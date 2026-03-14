import {
    EmailAuthProvider,
    createUserWithEmailAndPassword,
    deleteUser,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    setDoc,
    writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const STOCK_DELETE_BATCH_SIZE = 400;

const deleteAllStocksForUser = async (uid: string) => {
  while (true) {
    const snapshot = await getDocs(
      query(collection(db, 'users', uid, 'stocks'), limit(STOCK_DELETE_BATCH_SIZE)),
    );

    if (snapshot.empty) {
      break;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((stockDoc) => {
      batch.delete(stockDoc.ref);
    });
    await batch.commit();
  }
};

export const authService = {
  async signUp(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
    });
  },

  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    await signOut(auth);
  },

  async deleteCurrentUserAccount(uid: string) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('ログインユーザーが存在しません。');
    }

    if (currentUser.uid !== uid) {
      throw new Error('別ユーザーの削除はできません。');
    }

    await deleteAllStocksForUser(uid);
    await deleteDoc(doc(db, 'users', uid));
    await deleteUser(currentUser);
  },

  async reauthenticate(email: string, password: string) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('ログインユーザーが存在しません。');
    }

    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(currentUser, credential);
  },
};