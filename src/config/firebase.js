import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Try loading from environment variables first, fallback to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD6WogJjmb6OiJivzmH4U-0Xl8xY5dJBPM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hioney-finance.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hioney-finance",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hioney-finance.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "694188619660",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:694188619660:web:a029e9365c31424f9208a9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-F4RGQ14PY7"
};

// Check if Firebase config is loaded properly
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error('❌ Firebase configuration error! Please check your .env.local file.');
  console.error('Make sure all VITE_FIREBASE_* variables are set correctly.');
  console.error('Current config:', {
    apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Set' : '✗ Missing',
    projectId: firebaseConfig.projectId ? '✓ Set' : '✗ Missing',
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
