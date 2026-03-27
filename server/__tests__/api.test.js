const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ResiboCash API');
  });
});

describe('GET /api/rewards', () => {
  it('returns rewards array', async () => {
    const res = await request(app).get('/api/rewards');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('each reward has id, name, cost, category', async () => {
    const res = await request(app).get('/api/rewards');
    for (const reward of res.body.data) {
      expect(reward).toHaveProperty('id');
      expect(reward).toHaveProperty('name');
      expect(reward).toHaveProperty('cost');
      expect(reward).toHaveProperty('category');
    }
  });
});

describe('POST /api/rewards/redeem', () => {
  it('returns 400 when rewardId missing', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ cost: 500 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when cost missing', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '1' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when cost is zero', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '1', cost: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when cost is negative', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '1', cost: -100 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when rewardId is empty string', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '  ', cost: 500 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('redeems successfully with valid payload', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '1', cost: 500 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rewardId).toBe('1');
    expect(res.body.data.pointsUsed).toBe(500);
    expect(res.body.data.status).toBe('completed');
  }, 5000);
});

describe('GET /api/receipts', () => {
  it('returns receipts array', async () => {
    const res = await request(app).get('/api/receipts');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters by userId query param', async () => {
    const res = await request(app).get('/api/receipts?userId=user-abc');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    for (const receipt of res.body.data) {
      expect(receipt.userId).toBe('user-abc');
    }
  });
});
