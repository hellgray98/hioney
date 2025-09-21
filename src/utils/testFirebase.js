import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Test function to check Firebase connection and data
export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test 1: Check if we can access the collection
    console.log('📁 Testing collection access...');
    const usersCollection = collection(db, 'users');
    console.log('✅ Collection reference created:', usersCollection);
    
    // Test 2: Try to get documents
    console.log('📊 Testing document retrieval...');
    const usersSnapshot = await getDocs(usersCollection);
    console.log('✅ Snapshot retrieved:', usersSnapshot);
    console.log('📋 Number of documents:', usersSnapshot.docs.length);
    
    // Test 3: Log each document
    usersSnapshot.docs.forEach((doc, index) => {
      console.log(`👤 User ${index + 1}:`, {
        id: doc.id,
        data: doc.data()
      });
    });
    
    // Test 4: Check if we can access a specific document
    if (usersSnapshot.docs.length > 0) {
      const firstDoc = usersSnapshot.docs[0];
      console.log('🔍 Testing specific document access...');
      const userDocRef = doc(db, 'users', firstDoc.id);
      const userDoc = await getDoc(userDocRef);
      console.log('✅ Specific document retrieved:', userDoc.data());
    }
    
    return {
      success: true,
      count: usersSnapshot.docs.length,
      users: usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Function to check current user authentication
export const checkCurrentUser = async () => {
  console.log('🔐 Checking current user...');
  
  try {
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    
    if (user) {
      console.log('✅ User is authenticated:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      // Check user role in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('👤 User data from Firestore:', userData);
        console.log('👑 User role:', userData.role);
        return {
          authenticated: true,
          user: user,
          role: userData.role,
          userData: userData
        };
      } else {
        console.log('⚠️ User document not found in Firestore');
        return {
          authenticated: true,
          user: user,
          role: null,
          userData: null
        };
      }
    } else {
      console.log('❌ No user is authenticated');
      return {
        authenticated: false,
        user: null,
        role: null,
        userData: null
      };
    }
  } catch (error) {
    console.error('❌ Error checking user:', error);
    return {
      authenticated: false,
      error: error.message
    };
  }
};

// Function to test admin access
export const testAdminAccess = async () => {
  console.log('👑 Testing admin access...');
  
  try {
    const userCheck = await checkCurrentUser();
    
    if (!userCheck.authenticated) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }
    
    if (userCheck.role !== 'admin') {
      return {
        success: false,
        error: `User is not admin. Current role: ${userCheck.role}`
      };
    }
    
    // Try to read all users as admin
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    console.log('✅ Admin access successful!');
    console.log('📊 Users found:', usersSnapshot.docs.length);
    
    return {
      success: true,
      count: usersSnapshot.docs.length,
      users: usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
    
  } catch (error) {
    console.error('❌ Admin access test failed:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};
