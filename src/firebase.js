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
  const user = await signInAnonymously(auth);
  const userDoc = doc(db, 'users', user.user.uid);
  const docSnap = await getDoc(userDoc);
  if (!docSnap.exists()) {
    await setDoc(userDoc, { points: 0 });
  }
  return user.user.uid;
};

export const getUserPoints = async (userId) => {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  return docSnap.exists() ? docSnap.data().points : 0;
};

export const addPoints = async (userId, points) => {
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  const currentPoints = docSnap.exists() ? docSnap.data().points : 0;
  await updateDoc(userDoc, { points: currentPoints + points });
};

export const requestWithdrawal = async (userId, amount, danaNumber) => {
  const withdrawal = {
    userId,
    amount,
    danaNumber,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  await addDoc(collection(db, 'withdrawals'), withdrawal);
  // Send to Telegram channel
  const botToken = process.env.REACT_APP_BOT_TOKEN || '7380366315:AAH9dnuF50OpUDjGIy06bLioyEa9Fr4bfS8';
  const channelId = '-1002697590626';
  const message = `New Withdrawal Request:\nUser ID: ${userId}\nAmount: ${amount} IDR\nDANA Number: ${danaNumber}`;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channelId,
      text: message
    })
  });
};