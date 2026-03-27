require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://resibocash.azurewebsites.net',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
}));
app.use(express.json());

// ── Azure clients (lazy-initialized) ──────────────────────────────
let cosmosContainer = null;
let blobContainer = null;

async function getCosmosContainer() {
  if (cosmosContainer) return cosmosContainer;
  if (!process.env.COSMOS_CONNECTION_STRING) return null;

  const { CosmosClient } = require('@azure/cosmos');
  const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
  const { database } = await client.databases.createIfNotExists({ id: 'resibocash' });
  const { container } = await database.containers.createIfNotExists({
    id: 'receipts',
    partitionKey: { paths: ['/userId'] },
  });
  cosmosContainer = container;
  return container;
}

async function getBlobContainer() {
  if (blobContainer) return blobContainer;
  if (!process.env.STORAGE_CONNECTION_STRING) return null;

  const { BlobServiceClient } = require('@azure/storage-blob');
  const blobService = BlobServiceClient.fromConnectionString(process.env.STORAGE_CONNECTION_STRING);
  blobContainer = blobService.getContainerClient('receipts');
  await blobContainer.createIfNotExists();
  return blobContainer;
}

// ── Mock data ─────────────────────────────────────────────────────
const STORES = [
  'SM Supermarket', 'Robinsons', 'Puregold', 'Mercury Drug',
  '7-Eleven', 'Ministop', 'Jollibee', "McDonald's",
  'Watsons', 'Landmark', 'S&R', 'Landers',
];

// In-memory store for local dev
const receiptStore = [];

// ── Routes ────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ResiboCash API',
    version: '1.0.0',
    mode: process.env.COSMOS_CONNECTION_STRING ? 'azure' : 'mock',
  });
});

// Scan receipt
app.post('/api/receipts/upload', upload.single('receipt'), async (req, res) => {
  try {
    // Upload image to blob storage if available
    if (req.file) {
      const container = await getBlobContainer();
      if (container) {
        const blobName = `${Date.now()}-${req.file.originalname || 'receipt.jpg'}`;
        const blockBlob = container.getBlockBlobClient(blobName);
        await blockBlob.upload(req.file.buffer, req.file.buffer.length, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });
      }
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 2000));

    // Generate mock receipt data
    const store = STORES[Math.floor(Math.random() * STORES.length)];
    const total = (Math.floor(Math.random() * 300) + 10) * 10;
    const points = Math.floor(total / 10);

    const receipt = {
      id: Date.now().toString(),
      userId: req.body?.userId || 'anonymous',
      store,
      total,
      points,
      date: new Date().toISOString(),
      items: [
        { name: 'Item 1', price: Math.floor(total * 0.4) },
        { name: 'Item 2', price: Math.floor(total * 0.35) },
        { name: 'Item 3', price: total - Math.floor(total * 0.4) - Math.floor(total * 0.35) },
      ],
    };

    // Save to Cosmos DB if available
    const container = await getCosmosContainer();
    if (container) {
      await container.items.create(receipt);
    } else {
      receiptStore.push(receipt);
    }

    res.json({ success: true, data: receipt });
  } catch (err) {
    console.error('Receipt upload error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to process receipt' });
  }
});

// Get receipt history (optionally filtered by userId query param)
app.get('/api/receipts', async (req, res) => {
  try {
    const { userId } = req.query;
    const container = await getCosmosContainer();
    if (container) {
      const query = userId
        ? { query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.date DESC', parameters: [{ name: '@userId', value: userId }] }
        : 'SELECT * FROM c ORDER BY c.date DESC';
      const { resources } = await container.items.query(query).fetchAll();
      res.json({ success: true, data: resources });
    } else {
      let data = receiptStore.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (userId) data = data.filter((r) => r.userId === userId);
      res.json({ success: true, data });
    }
  } catch (err) {
    console.error('Receipts fetch error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch receipts' });
  }
});

// Redeem reward
app.post('/api/rewards/redeem', (req, res) => {
  const { rewardId, cost } = req.body;

  if (!rewardId || typeof rewardId !== 'string' || rewardId.trim() === '') {
    return res.status(400).json({ success: false, error: 'rewardId is required and must be a non-empty string' });
  }
  if (cost === undefined || cost === null || typeof cost !== 'number' || cost <= 0 || !Number.isFinite(cost)) {
    return res.status(400).json({ success: false, error: 'cost is required and must be a positive number' });
  }

  setTimeout(() => {
    res.json({
      success: true,
      data: {
        redemptionId: Date.now().toString(),
        rewardId,
        pointsUsed: cost,
        status: 'completed',
        message: 'Reward has been sent to your account.',
      },
    });
  }, 1000);
});

// Get rewards catalog
app.get('/api/rewards', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: 'GCash', desc: 'P50 GCash Credit', cost: 500, category: 'E-Wallet' },
      { id: '2', name: 'GCash', desc: 'P100 GCash Credit', cost: 1000, category: 'E-Wallet' },
      { id: '3', name: 'Maya', desc: 'P50 Maya Credit', cost: 500, category: 'E-Wallet' },
      { id: '4', name: 'Globe Load', desc: 'P50 Mobile Load', cost: 450, category: 'Mobile Load' },
      { id: '5', name: 'Smart Load', desc: 'P50 Mobile Load', cost: 450, category: 'Mobile Load' },
      { id: '6', name: 'SM Gift Card', desc: 'P100 SM Store Credit', cost: 900, category: 'Gift Cards' },
      { id: '7', name: 'Jollibee', desc: 'P100 Jollibee Voucher', cost: 800, category: 'Food' },
      { id: '8', name: 'Grab', desc: 'P50 Grab Credit', cost: 500, category: 'E-Wallet' },
      { id: '9', name: 'Robinson', desc: 'P100 Store Credit', cost: 900, category: 'Gift Cards' },
      { id: '10', name: "McDonald's", desc: 'P100 McD Voucher', cost: 800, category: 'Food' },
    ],
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    const mode = process.env.COSMOS_CONNECTION_STRING ? 'AZURE' : 'MOCK';
    console.log(`ResiboCash API [${mode}] running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /api/receipts/upload  - Scan a receipt');
    console.log('  GET  /api/receipts         - Get receipt history');
    console.log('  POST /api/rewards/redeem   - Redeem a reward');
    console.log('  GET  /api/rewards          - Get rewards catalog');
    console.log('  GET  /api/health           - Health check');
  });
}

module.exports = app;
