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

/**
 * Simulate scanning a receipt image via an API call.
 * Returns the detected store name, purchase total, and earned points
 * after a 2.5-second artificial delay.
 *
 * @param {string} _imageUri - URI of the captured receipt image (unused in mock)
 * @returns {Promise<{ store: string, total: number, points: number }>}
 */
export async function scanReceipt(_imageUri) {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const store = STORES[Math.floor(Math.random() * STORES.length)];
  const total = (Math.floor(Math.random() * 301) + 10) * 10; // 100 – 3100, multiples of 10
  const points = Math.floor(total / 10);

  return { store, total, points };
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
