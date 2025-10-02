import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6WogJjmb6OiJivzmH4U-0Xl8xY5dJBPM",
  authDomain: "hioney-finance.firebaseapp.com",
  projectId: "hioney-finance",
  storageBucket: "hioney-finance.firebasestorage.app",
  messagingSenderId: "694188619660",
  appId: "1:694188619660:web:a029e9365c31424f9208a9",
  measurementId: "G-F4RGQ14PY7"
};

// Example (replace with your actual config):
// const firebaseConfig = {
//   apiKey: "AIzaSyC1234567890abcdefghijklmnop",
//   authDomain: "hioney-finance.firebaseapp.com", 
//   projectId: "hioney-finance",
//   storageBucket: "hioney-finance.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:abcdef123456"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
