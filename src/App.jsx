import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import MainApp from './components/MainApp';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <MainApp />
        <PWAInstallPrompt />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;