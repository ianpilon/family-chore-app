import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppProvider';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { useAuth } from './context/AuthContext';
import { useApp } from './hooks/useApp';
import { useFamilyCoach } from './hooks/useFamilyCoach';

// Temporary development flag to bypass authentication
const BYPASS_AUTH = true;

function AppContent() {
  const { user } = useAuth();
  const { login, currentUser } = useApp();
  useFamilyCoach(); // Add the Family Coach hook

  // Set initial user (Anita) when the app loads
  useEffect(() => {
    if (!currentUser) {
      login('1'); // Anita's ID
    }
  }, [login, currentUser]);

  // During development, we'll show the Dashboard directly
  return BYPASS_AUTH ? <Dashboard /> : (user ? <Dashboard /> : <Login />);
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;