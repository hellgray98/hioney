import React from 'react';
import PersonalFinanceApp from "./PersonalFinanceAppNew";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <PersonalFinanceApp />
    </ErrorBoundary>
  );
}

export default App;