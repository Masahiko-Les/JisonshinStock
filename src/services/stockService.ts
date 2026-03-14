import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Stock } from '../types';

const MAX_LENGTH = 200;

const toDate = (value: Timestamp | null | undefined): Date => {
  if (!value) {
    return new Date();
  }
  return value.toDate();
};

const validateStockText = (text: string) => {
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error('投稿内容を入力してください。');
  }
  if (trimmed.length > MAX_LENGTH) {
    throw new Error('投稿は200文字以内で入力してください。');
  }

  return trimmed;
};

export const stockService = {
  async createStock(uid: string, text: string) {
    const trimmed = validateStockText(text);

    await addDoc(collection(db, 'users', uid, 'stocks'), {
      text: trimmed,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateStock(uid: string, stockId: string, text: string) {
    const trimmed = validateStockText(text);

    await updateDoc(doc(db, 'users', uid, 'stocks', stockId), {
      text: trimmed,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteStock(uid: string, stockId: string) {
    await deleteDoc(doc(db, 'users', uid, 'stocks', stockId));
  },

  subscribeUserStocks(uid: string, callback: (stocks: Stock[]) => void) {
    const stocksQuery = query(collection(db, 'users', uid, 'stocks'), orderBy('createdAt', 'desc'));

    return onSnapshot(stocksQuery, (snapshot) => {
      const stocks = snapshot.docs.map((snapshotDoc) => {
        const data = snapshotDoc.data() as {
          text: string;
          createdAt?: Timestamp;
          updatedAt?: Timestamp;
        };

        return {
          id: snapshotDoc.id,
          text: data.text,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        };
      });

      callback(stocks);
    });
  },
};

export { MAX_LENGTH };
