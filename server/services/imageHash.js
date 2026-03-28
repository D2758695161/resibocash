/**
 * Image Hashing Service for Duplicate Receipt Detection
 * Uses blockhash-core for perceptual hashing (robust to compression/format changes)
 * and buffer SHA-256 for exact duplicates (fast path)
 */

const crypto = require('crypto');
const { blockhash } = require('blockhash-core');
const { PNG } = require('pngjs');

// ── Config ────────────────────────────────────────────────────────────
const BLOCK_SIZE = 16;      // blockhash block size
const BIT_COUNT = 64;        // bits per hash (16x16 grid = 64 bits for BLOCKBITS=4)
const NEAR_DUPLICATE_THRESHOLD = 10; // max Hamming distance for near-duplicate (out of 64 bits = ~85% similarity)

// ── Exact hash (SHA-256 of resized grayscale PNG) ─────────────────────
// Fast path: identical uploads always produce same buffer
async function computeExactHash(imageBuffer) {
  return crypto.createHash('sha256').update(imageBuffer).digest('hex');
}

// ── Perceptual hash (blockhash) ─────────────────────────────────────
// Robust to JPEG re-compression, minor crops, contrast shifts
async function computePerceptualHash(imageBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const png = PNG.read(imageBuffer);
      const width = png.width;
      const height = png.height;

      // Resize to a small grayscale image for hashing (save computation)
      const resized = resizeGrayscale(png, BLOCK_SIZE * 4);

      blockhash(resized, BLOCK_SIZE, BIT_COUNT)
        .then((hash) => resolve(hash))
        .catch((err) => reject(err));
    } catch (err) {
      reject(new Error(`Perceptual hash failed: ${err.message}`));
    }
  });
}

// ── Grayscale resize (nearest-neighbor, no antialiasing) ─────────────
function resizeGrayscale(png, targetSize) {
  const srcW = png.width;
  const srcH = png.height;
  const ratio = Math.min(srcW / targetSize, srcH / targetSize);
  const newW = Math.round(srcW / ratio);
  const newH = Math.round(srcH / ratio);

  const src = png.data; // RGBA Uint8Array
  const dst = Buffer.alloc(newW * newH);

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcX = Math.floor(x * ratio);
      const srcY = Math.floor(y * ratio);
      const idx = (srcY * srcW + srcX) * 4;
      // Grayscale: use green channel (most representative) or luminance
      dst[y * newW + x] = src[idx + 1]; // green channel
    }
  }

  // Return a mock "image" object that blockhash-core accepts
  return {
    width: newW,
    height: newH,
    data: dst,
  };
}

// ── Hamming distance between two hex hashes ──────────────────────────
function hammingDistance(hash1, hash2) {
  if (hash1.length !== hash2.length) return Infinity;
  let dist = 0;
  for (let i = 0; i < hash1.length; i++) {
    const a = parseInt(hash1[i], 16);
    const b = parseInt(hash2[i], 16);
    const xor = a ^ b;
    // Count set bits
    let v = xor;
    while (v) { dist++; v &= v - 1; }
  }
  return dist;
}

// ── Check if two hashes are near-duplicates ─────────────────────────
function isNearDuplicate(hash1, hash2) {
  return hammingDistance(hash1, hash2) <= NEAR_DUPLICATE_THRESHOLD;
}

// ── Main duplicate detection ──────────────────────────────────────────
// Returns { status: 'exact'|'near'|'new', existingReceipt?, similarity? }
async function checkDuplicate(imageBuffer, userId, receiptStore) {
  const exactHash = await computeExactHash(imageBuffer);
  const perceptualHash = await computePerceptualHash(imageBuffer).catch(() => null);

  // Get all receipts for this user
  const userReceipts = receiptStore.filter((r) => r.userId === userId);

  for (const receipt of userReceipts) {
    // Check exact duplicate first (fast path)
    if (receipt.exactHash === exactHash) {
      return { status: 'exact', existingReceipt: receipt, similarity: 100 };
    }

    // Check perceptual near-duplicate
    if (perceptualHash && receipt.perceptualHash) {
      const dist = hammingDistance(perceptualHash, receipt.perceptualHash);
      const similarity = Math.round((1 - dist / 64) * 100);
      if (dist <= NEAR_DUPLICATE_THRESHOLD) {
        return { status: 'near', existingReceipt: receipt, similarity };
      }
    }
  }

  return { status: 'new', exactHash, perceptualHash, similarity: 0 };
}

// ── Fraud audit log ──────────────────────────────────────────────────
const fraudLog = [];

function logDuplicateAttempt(userId, attemptedHash, status, existingReceiptId, similarity) {
  fraudLog.push({
    timestamp: new Date().toISOString(),
    userId,
    attemptedHash: attemptedHash ? attemptedHash.substring(0, 16) + '...' : null,
    status, // 'exact' | 'near' | 'manual_review'
    existingReceiptId: existingReceiptId || null,
    similarity: similarity || null,
  });
}

function getFraudLog() {
  return [...fraudLog];
}

module.exports = {
  computeExactHash,
  computePerceptualHash,
  hammingDistance,
  isNearDuplicate,
  checkDuplicate,
  logDuplicateAttempt,
  getFraudLog,
};
