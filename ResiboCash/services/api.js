const API_BASE_URL = 'http://localhost:3001';

const STORES = [
  'SM Supermarket',
  'Robinsons',
  'Puregold',
  'Mercury Drug',
  '7-Eleven',
  'Ministop',
  'Jollibee',
  "McDonald's",
  'Watsons',
  'Landmark',
  'S&R',
  'Landers',
];

function mockScanResult() {
  const store = STORES[Math.floor(Math.random() * STORES.length)];
  const total = (Math.floor(Math.random() * 301) + 10) * 10;
  const points = Math.floor(total / 10);
  return { store, total, points };
}

/**
 * Scan a receipt image. Tries the real API first; falls back to mock on failure.
 *
 * @param {string} imageUri - URI of the captured receipt image
 * @returns {Promise<{ store: string, total: number, points: number }>}
 */
export async function scanReceipt(imageUri) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUri }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('scanReceipt API failed, using mock:', err.message);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return mockScanResult();
  }
}

/**
 * Simulate redeeming a reward via an API call.
 * Returns a success flag after a 1-second artificial delay.
 *
 * @param {string} rewardId - ID of the reward being redeemed
 * @param {number} cost     - Point cost of the reward
 * @returns {Promise<{ success: boolean, rewardId: string, cost: number }>}
 */
export async function redeemReward(rewardId, cost) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, rewardId, cost };
}
