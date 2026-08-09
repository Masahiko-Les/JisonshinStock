import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const POST_COUNT_KEY = '@review/postCount_v2';
const REVIEW_REQUESTED_KEY = '@review/requested_v2';
const REVIEW_THRESHOLD = 10;

export const reviewService = {
  async notePostCreated() {
    const stored = await AsyncStorage.getItem(POST_COUNT_KEY);
    const count = Number(stored ?? '0') + 1;
    await AsyncStorage.setItem(POST_COUNT_KEY, String(count));

    if (count < REVIEW_THRESHOLD) {
      return;
    }

    const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
    if (alreadyRequested) {
      return;
    }

    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
    }
  },
};
