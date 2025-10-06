import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signinLoading, setSigninLoading] = useState(false);
  const [error, setError] = useState('');

  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      setLoading(true);
      
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: displayName
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Initialize user's financial data
      await setDoc(doc(db, 'userData', user.uid), {
        balance: 0,
        transactions: [],
        categories: [
          // Default income categories
          {
            id: 'income-salary',
            name: 'Lương',
            type: 'income',
            icon: '💰',
            color: '#10b981'
          },
          {
            id: 'income-bonus',
            name: 'Thưởng',
            type: 'income', 
            icon: '🎁',
            color: '#059669'
          },
          // Default expense categories
          {
            id: 'expense-food',
            name: 'Ăn uống',
            type: 'expense',
            icon: '🍜',
            color: '#ef4444'
          },
          {
            id: 'expense-transport',
            name: 'Di chuyển',
            type: 'expense',
            icon: '🚗',
            color: '#f97316'
          },
          {
            id: 'expense-shopping',
            name: 'Mua sắm',
            type: 'expense',
            icon: '🛒',
            color: '#8b5cf6'
          },
          {
            id: 'expense-entertainment',
            name: 'Giải trí',
            type: 'expense',
            icon: '🎬',
            color: '#06b6d4'
          }
        ],
        budgets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      setError('');
      setSigninLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setSigninLoading(false);
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user profile
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      
      // Handle specific Firebase connection errors
      if (error.code === 'unavailable' || error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.warn('Firebase connection blocked. This might be due to ad blocker or network restrictions.');
        // You could show a user-friendly message here
      }
      
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set user immediately for faster UI response
        setCurrentUser(user);
        setLoading(false);
        
        // Fetch additional user data in background
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setCurrentUser({
              ...user,
              ...userProfile
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Keep the basic user data even if profile fetch fails
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    signin,
    logout,
    resetPassword,
    loading,
    signinLoading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
