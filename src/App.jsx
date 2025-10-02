import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/FirebaseDataContext';
import { useAuth } from './contexts/AuthContext';
import MainApp from './components/MainApp';
import AuthWrapper from './components/AuthWrapper';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

// Protected App Component
const ProtectedApp = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return currentUser ? (
    <DataProvider>
      <MainApp />
      <PWAInstallPrompt />
    </DataProvider>
  ) : (
    <AuthWrapper />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;