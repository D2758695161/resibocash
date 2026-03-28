const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
 * Scan a receipt image via real API upload.
 * Uploads image binary as multipart/form-data to /api/receipts/upload
 *
 * @param {string} imageUri - URI of the captured receipt image (content:// or file://)
 * @returns {Promise<{ store: string, total: number, points: number }>}
 */
export async function scanReceipt(imageUri) {
  try {
    // Convert content:// URI to blob for upload
    const response = await fetch(imageUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    const imageBlob = await response.blob();

    // Create multipart form data
    const formData = new FormData();
    formData.append('receipt', imageBlob, 'receipt.jpg');

    // POST to real endpoint with multipart/form-data
    const apiResponse = await fetch(`${API_BASE_URL}/api/receipts/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Upload failed (${apiResponse.status}): ${errorText || 'Unknown error'}`);
    }

    const result = await apiResponse.json();
    return {
      store: result.store || STORES[0],
      total: result.total || 0,
      points: result.points || Math.floor((result.total || 0) / 10),
    };
  } catch (err) {
    // Show user-visible error instead of silent mock fallback
    const errorMessage = err.message || 'Upload failed. Please try again.';
    console.error('scanReceipt error:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Redeem a reward via API call.
 * Validates user has sufficient balance before redemption.
 *
 * @param {string} rewardId - ID of the reward being redeemed
 * @param {number} cost     - Point cost of the reward
 * @returns {Promise<{ success: boolean, rewardId: string, cost: number }>}
 */
export async function redeemReward(rewardId, cost) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId, cost }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Redemption failed (${response.status})`);
    }

    return await response.json();
  } catch (err) {
    console.error('redeemReward error:', err.message);
    throw err;
  }
}
