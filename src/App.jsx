import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/FirebaseDataContext';
import { useAuth } from './contexts/AuthContext';
import MainApp from './components/MainApp';
import AuthWrapper from './components/AuthWrapper';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

// Protected App Component
const ProtectedApp = React.memo(() => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen 
      message="Đang tải..." 
      variant="premium" 
      size="lg" 
      minDuration={3000}
    />;
  }

  return currentUser ? (
    <DataProvider>
      <MainApp />
      <PWAInstallPrompt />
    </DataProvider>
  ) : (
    <AuthWrapper />
  );
});

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