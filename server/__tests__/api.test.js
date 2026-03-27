const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ResiboCash API');
  });
});

describe('GET /api/rewards', () => {
  it('returns 10 reward items', async () => {
    const res = await request(app).get('/api/rewards');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(10);
  });

  it('each reward has id, name, desc, cost, category', async () => {
    const res = await request(app).get('/api/rewards');
    res.body.data.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('desc');
      expect(item).toHaveProperty('cost');
      expect(item).toHaveProperty('category');
    });
  });
});

describe('POST /api/rewards/redeem', () => {
  it('returns a successful redemption', async () => {
    const res = await request(app)
      .post('/api/rewards/redeem')
      .send({ rewardId: '1', cost: 500 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rewardId).toBe('1');
    expect(res.body.data.pointsUsed).toBe(500);
    expect(res.body.data.status).toBe('completed');
  }, 5000);
});
