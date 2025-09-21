import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const useFirebaseSync = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('disconnected');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setSyncStatus('connected');
      } else {
        setSyncStatus('disconnected');
      }
    });

    return () => unsubscribe();
  }, []);

  const syncDataToFirebase = async (data) => {
    if (!user) return false;

    try {
      setSyncStatus('syncing');
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...data,
        lastSync: new Date().toISOString(),
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }, { merge: true });
      setSyncStatus('synced');
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const loadDataFromFirebase = async () => {
    if (!user) return null;

    try {
      setSyncStatus('loading');
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSyncStatus('loaded');
        return data;
      } else {
        setSyncStatus('no_data');
        return null;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSyncStatus('error');
      return null;
    }
  };

  const subscribeToDataChanges = (callback) => {
    if (!user) return () => {};

    const userDocRef = doc(db, 'users', user.uid);
    return onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data);
      }
    });
  };

  return {
    user,
    loading,
    syncStatus,
    syncDataToFirebase,
    loadDataFromFirebase,
    subscribeToDataChanges
  };
};
