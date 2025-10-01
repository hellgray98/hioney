import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import MainApp from './components/MainApp';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;