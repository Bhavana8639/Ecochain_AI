/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrvXP1N_4_UAg6QrO5_rboDS8GnQrJcPg",
  authDomain: "scope3-c033c.firebaseapp.com",
  databaseURL: "https://scope3-c033c-default-rtdb.firebaseio.com",
  projectId: "scope3-c033c",
  storageBucket: "scope3-c033c.firebasestorage.app",
  messagingSenderId: "820742192798",
  appId: "1:820742192798:web:97e8b768c06a6610c8458f",
  measurementId: "G-NFNR24MKQJ"
};

// Firebase is fully configured with real credentials
export const isFirebaseConfigured = true;

// Initialize Firebase App singleton safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
