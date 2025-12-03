import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // 1. Importar Contexto
import AppRouter from './router/AppRouter';
import AlertModal from './components/shared/AlertModal'; // 2. Importar Modal
import './App.css'; 

function App() {
  return (
    <AuthProvider>
      
      <NotificationProvider> 
        <AppRouter />
        
        
        <AlertModal /> 
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;