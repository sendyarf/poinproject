import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDNPhb4Qo0g33m7AJBfn3JDtRuKSSm6ASY",
  authDomain: "rewardpoin-35e8f.firebaseapp.com",
  projectId: "rewardpoin-35e8f",
  storageBucket: "rewardpoin-35e8f.firebasestorage.app",
  messagingSenderId: "445967575841",
  appId: "1:445967575841:web:c0925b8ca4e473bc156c60",
  measurementId: "G-2Z81M4CVWD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export const initializeUser = async () => {
  try {
    const user = await signInAnonymously(auth);
    const userDoc = doc(db, 'users', user.user.uid);
    const docSnap = await getDoc(userDoc);
    if (!docSnap.exists()) {
      await setDoc(userDoc, { points: 0 });
    }
    return user.user.uid;
  } catch (error) {
    console.error('Failed to initialize user:', error);
    throw error;
  }
};

export const getUserPoints = async (userId) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists() ? docSnap.data().points : 0;
  } catch (error) {
    console.error('Failed to get user points:', error);
    throw error;
  }
};

export const addPoints = async (userId, points) => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    const currentPoints = docSnap.exists() ? docSnap.data().points : 0;
    await updateDoc(userDoc, { points: currentPoints + points });
    return currentPoints + points;
  } catch (error) {
    console.error('Failed to add points:', error);
    throw error;
  }
};

export const requestWithdrawal = async (userId, amount, danaNumber) => {
  try {
    // Validate input
    if (!userId || !amount || !danaNumber) {
      throw new Error('Missing required parameters');
    }

    // Validate DANA number
    if (!/^[0-9]{10,12}$/.test(danaNumber)) {
      throw new Error('Invalid DANA number');
    }

    // Check if user has enough points
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    const currentPoints = docSnap.exists() ? docSnap.data().points : 0;
    
    if (currentPoints < amount) {
      throw new Error('Insufficient points');
    }

    // Create withdrawal request
    const withdrawal = {
      userId,
      amount,
      danaNumber,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // Add withdrawal request to database
    const withdrawalRef = await addDoc(collection(db, 'withdrawals'), withdrawal);

    // Update user points
    await updateDoc(userDoc, { points: currentPoints - amount });

    return withdrawalRef.id;
  } catch (error) {
    console.error('Withdrawal request failed:', error);
    throw error;
  }
};