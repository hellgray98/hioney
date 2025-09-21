import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const FirebaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const info = {};

    try {
      // Test 1: Firebase Config
      info.config = {
        status: 'Checking...',
        db: !!db,
        auth: !!auth,
        timestamp: new Date().toISOString()
      };

      // Test 2: Authentication
      if (auth) {
        info.auth = {
          status: 'Available',
          currentUser: auth.currentUser ? {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName
          } : null
        };
      } else {
        info.auth = { status: 'Not available' };
      }

      // Test 3: Database Connection
      if (db) {
        try {
          const testCollection = collection(db, 'users');
          const snapshot = await getDocs(testCollection);
          info.database = {
            status: 'Connected',
            usersCount: snapshot.docs.length,
            users: snapshot.docs.map(doc => ({
              id: doc.id,
              email: doc.data().email,
              role: doc.data().role
            }))
          };
        } catch (dbError) {
          info.database = {
            status: 'Error',
            error: dbError.message,
            code: dbError.code
          };
        }
      } else {
        info.database = { status: 'Not available' };
      }

      // Test 4: User Role Check
      if (auth.currentUser && db) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            info.userRole = {
              status: 'Found',
              role: userDoc.data().role,
              data: userDoc.data()
            };
          } else {
            info.userRole = { status: 'Document not found' };
          }
        } catch (roleError) {
          info.userRole = {
            status: 'Error',
            error: roleError.message
          };
        }
      }

    } catch (error) {
      info.generalError = {
        message: error.message,
        code: error.code,
        stack: error.stack
      };
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    runDebug();
  }, []);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🔧 Firebase Debug Info
        </h3>
        <button
          onClick={runDebug}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? '🔄 Testing...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Config Status */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            ⚙️ Firebase Config
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Database:</span> {debugInfo.config?.db ? '✅ Available' : '❌ Not available'}</p>
            <p><span className="font-medium">Auth:</span> {debugInfo.config?.auth ? '✅ Available' : '❌ Not available'}</p>
            <p><span className="font-medium">Timestamp:</span> {debugInfo.config?.timestamp}</p>
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            🔐 Authentication
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Status:</span> {debugInfo.auth?.status}</p>
            {debugInfo.auth?.currentUser ? (
              <>
                <p><span className="font-medium">User ID:</span> {debugInfo.auth.currentUser.uid}</p>
                <p><span className="font-medium">Email:</span> {debugInfo.auth.currentUser.email}</p>
                <p><span className="font-medium">Name:</span> {debugInfo.auth.currentUser.displayName || 'N/A'}</p>
              </>
            ) : (
              <p className="text-red-600 dark:text-red-400">❌ No user logged in</p>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
            🗄️ Database Connection
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Status:</span> {debugInfo.database?.status}</p>
            {debugInfo.database?.status === 'Connected' ? (
              <>
                <p><span className="font-medium">Users Count:</span> {debugInfo.database.usersCount}</p>
                {debugInfo.database.users.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Users:</p>
                    <div className="space-y-1">
                      {debugInfo.database.users.map((user, index) => (
                        <div key={index} className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                          <p><span className="font-medium">Email:</span> {user.email}</p>
                          <p><span className="font-medium">Role:</span> {user.role || 'user'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="text-red-600 dark:text-red-400">❌ {debugInfo.database?.error}</p>
                {debugInfo.database?.code && (
                  <p className="text-red-600 dark:text-red-400">Code: {debugInfo.database.code}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Role */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
            👑 User Role
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Status:</span> {debugInfo.userRole?.status}</p>
            {debugInfo.userRole?.role && (
              <p><span className="font-medium">Role:</span> {debugInfo.userRole.role}</p>
            )}
            {debugInfo.userRole?.error && (
              <p className="text-red-600 dark:text-red-400">❌ {debugInfo.userRole.error}</p>
            )}
          </div>
        </div>

        {/* General Error */}
        {debugInfo.generalError && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
              ❌ General Error
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Message:</span> {debugInfo.generalError.message}</p>
              {debugInfo.generalError.code && (
                <p><span className="font-medium">Code:</span> {debugInfo.generalError.code}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseDebug;
