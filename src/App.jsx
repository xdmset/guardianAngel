import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import './App.css'; //para poder usar variables  root  en todo

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;