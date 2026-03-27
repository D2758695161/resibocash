import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  POINTS: '@resibo_points',
  HISTORY: '@resibo_history',
  TOTAL_EARNED: '@resibo_total_earned',
  TOTAL_REDEEMED: '@resibo_total_redeemed',
  ONBOARDED: '@resibo_onboarded',
};

/**
 * Load all persisted app data from AsyncStorage in a single batch.
 * Returns sensible defaults when keys are missing or storage fails.
 */
export async function loadAppData() {
  try {
    const [points, history, totalEarned, totalRedeemed, onboarded] = await Promise.all([
      AsyncStorage.getItem(KEYS.POINTS),
      AsyncStorage.getItem(KEYS.HISTORY),
      AsyncStorage.getItem(KEYS.TOTAL_EARNED),
      AsyncStorage.getItem(KEYS.TOTAL_REDEEMED),
      AsyncStorage.getItem(KEYS.ONBOARDED),
    ]);
    return {
      points: points ? parseInt(points, 10) : 0,
      history: history ? JSON.parse(history) : [],
      totalEarned: totalEarned ? parseInt(totalEarned, 10) : 0,
      totalRedeemed: totalRedeemed ? parseInt(totalRedeemed, 10) : 0,
      onboarded: onboarded === 'true',
    };
  } catch {
    return { points: 0, history: [], totalEarned: 0, totalRedeemed: 0, onboarded: false };
  }
}

/** Persist the current points balance. */
export async function savePoints(points) {
  await AsyncStorage.setItem(KEYS.POINTS, points.toString());
}

/** Persist the full scan/redeem history array. */
export async function saveHistory(history) {
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

/** Persist the cumulative total of earned points. */
export async function saveTotalEarned(total) {
  await AsyncStorage.setItem(KEYS.TOTAL_EARNED, total.toString());
}

/** Persist the cumulative total of redeemed points. */
export async function saveTotalRedeemed(total) {
  await AsyncStorage.setItem(KEYS.TOTAL_REDEEMED, total.toString());
}

/** Mark the user as having completed onboarding. */
export async function setOnboarded() {
  await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
}
