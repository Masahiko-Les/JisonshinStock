import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, Persistence, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const cleanEnv = (value: string | undefined) => {
  if (!value) {
    return '';
  }

  return value.trim().replace(/^"|"$/g, '').replace(/,$/, '').trim();
};

const firebaseConfig = {
  apiKey: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const hasMissingConfig = Object.values(firebaseConfig).some((value) => !value);
if (hasMissingConfig) {
  console.warn('Firebase環境変数が未設定です。EXPO_PUBLIC_FIREBASE_* を確認してください。');
}

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage) as Persistence,
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
