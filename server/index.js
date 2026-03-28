/**
 * In-memory user points store (replace with DB in production)
 * Maps userId -> { balance, history[] }
 */
const userPoints = new Map();

// Initialize with some test users
userPoints.set('user_1', { balance: 500, history: [] });
userPoints.set('user_2', { balance: 1200, history: [] });

/**
 * Get user point balance
 */
function getBalance(userId) {
  if (!userPoints.has(userId)) {
    userPoints.set(userId, { balance: 0, history: [] });
  }
  return userPoints.get(userId).balance;
}

/**
 * Add points to user account (called after receipt scan)
 */
function addPoints(userId, amount) {
  if (!userPoints.has(userId)) {
    userPoints.set(userId, { balance: 0, history: [] });
  }
  const user = userPoints.get(userId);
  user.balance += amount;
  user.history.push({ type: 'earn', amount, timestamp: Date.now() });
  return user.balance;
}

/**
 * Validate and deduct points for redemption.
 * Returns { valid: true/false, error?: string, newBalance?: number }
 */
function validateRedemption(userId, cost) {
  if (!userPoints.has(userId)) {
    return { valid: false, error: 'User not found' };
  }
  const user = userPoints.get(userId);
  if (user.balance < cost) {
    return {
      valid: false,
      error: `Insufficient balance. Have ${user.balance} points, need ${cost} points.`
    };
  }
  return { valid: true, newBalance: user.balance - cost };
}

/**
 * Deduct points after successful redemption
 */
function deductPoints(userId, cost) {
  const user = userPoints.get(userId);
  user.balance -= cost;
  user.history.push({ type: 'redeem', amount: cost, timestamp: Date.now() });
  return user.balance;
}

// Payout provider integration (GCash / Maya / PayMaya)
const PAYOUT_PROVIDERS = {
  gcash: { name: 'GCash', endpoint: 'https://api.gcash.com/bills/payment' },
  maya: { name: 'Maya', endpoint: 'https://api.maya.com.ph/send-money/v1/transfers' },
  paymaya: { name: 'PayMaya', endpoint: 'https://api.paymaya.com/v1/payouts' },
};

async function initiatePayout({ provider, accountNumber, amount, userId }) {
  // In production, call the actual payout provider API
  console.log(`[PAYOUT] Initiating ${amount} PHP to ${accountNumber} via ${provider} for user ${userId}`);
  
  // Simulate payout API call
  const payoutProvider = PAYOUT_PROVIDERS[provider];
  if (!payoutProvider) {
    throw new Error(`Unknown payout provider: ${provider}`);
  }
  
  // In production:
  // const response = await fetch(payoutProvider.endpoint, {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.PAYOUT_API_KEY}` },
  //   body: JSON.stringify({ accountNumber, amount, description: `ResiboCash reward redemption` })
  // });
  // return await response.json();
  
  // Placeholder return
  return {
    success: true,
    transactionId: `PAYOUT_${Date.now()}_${userId}`,
    provider,
    amount,
    accountNumber: accountNumber.slice(0, 4) + '****', // Masked
  };
}

// =====================================
// EXPRESS APP SETUP
// =====================================
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// =====================================
// API ROUTES
// =====================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get user balance
app.get('/api/users/:userId/balance', (req, res) => {
  const { userId } = req.params;
  res.json({ userId, balance: getBalance(userId) });
});

// Award points for scanned receipt (called after scanReceipt on client)
app.post('/api/points/award', (req, res) => {
  const { userId, points, receiptId } = req.body;
  if (!userId || !points) {
    return res.status(400).json({ error: 'userId and points required' });
  }
  const newBalance = addPoints(userId, points);
  res.json({ success: true, userId, awarded: points, newBalance, receiptId });
});

// Redeem reward with server-side validation
app.post('/api/rewards/redeem', async (req, res) => {
  const { userId, rewardId, cost, payoutInfo } = req.body;
  
  if (!userId || !rewardId || !cost) {
    return res.status(400).json({ error: 'userId, rewardId, and cost required' });
  }
  
  if (!payoutInfo || !payoutInfo.provider || !payoutInfo.accountNumber) {
    return res.status(400).json({ error: 'payoutInfo (provider, accountNumber) required' });
  }
  
  // === SERVER-SIDE VALIDATION ===
  const validation = validateRedemption(userId, cost);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }
  
  try {
    // Initiate payout through provider
    const payoutResult = await initiatePayout({
      provider: payoutInfo.provider,
      accountNumber: payoutInfo.accountNumber,
      amount: cost,
      userId,
    });
    
    // Deduct points only after payout succeeds
    deductPoints(userId, cost);
    const newBalance = validation.newBalance;
    
    console.log(`[REDEMPTION] User ${userId} redeemed reward ${rewardId} for ${cost} points. Payout: ${payoutResult.transactionId}`);
    
    res.json({
      success: true,
      rewardId,
      cost,
      newBalance,
      payout: payoutResult,
    });
  } catch (err) {
    console.error('[REDEMPTION ERROR]', err.message);
    res.status(500).json({ error: `Payout failed: ${err.message}` });
  }
});

// Receipt upload endpoint (multipart/form-data)
app.post('/api/receipts/upload', upload.single('receipt'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No receipt image provided' });
  }
  
  // In production: analyze receipt image for store and total
  // For now: parse mock data from query params or body
  const { store, total, points } = req.body;
  
  res.json({
    success: true,
    store: store || 'SM Supermarket',
    total: parseFloat(total) || 0,
    points: parseInt(points) || 0,
    receiptId: `RECEIPT_${Date.now()}`,
  });
});

// Legacy endpoint (for backwards compatibility)
app.post('/api/scan', (req, res) => {
  res.status(501).json({ error: 'Deprecated. Use /api/receipts/upload with multipart/form-data' });
});

module.exports = app;
