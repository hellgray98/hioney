import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

const AuthWrapper = () => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleShowForgot = () => {
    setMode('forgot');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  return (
    <>
      {mode === 'login' && (
        <Login 
          onToggleMode={handleToggleMode} 
          onShowForgot={handleShowForgot}
        />
      )}
      {mode === 'signup' && (
        <Signup onToggleMode={handleToggleMode} />
      )}
      {mode === 'forgot' && (
        <ForgotPassword onBack={handleBackToLogin} />
      )}
    </>
  );
};

export default AuthWrapper;
