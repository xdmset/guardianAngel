// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Agregar una nueva alerta
  const addAlert = useCallback((childData) => {
    const newAlert = {
      id: Date.now(),
      childId: childData.id_child,
      childName: childData.first_name,
      childLastName: childData.last_name,
      message: childData.message,
      timestamp: new Date(),
      read: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    setShowModal(true);

    console.log('🔔 Nueva alerta agregada:', newAlert);

    // Auto-cerrar modal después de 10 segundos
    setTimeout(() => {
      setShowModal(false);
    }, 10000);
  }, []);

  // Marcar alerta como leída
  const markAsRead = useCallback((alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  }, []);

  // Limpiar alertas
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Contar alertas no leídas
  const unreadCount = alerts.filter(a => !a.read).length;

  const value = {
    alerts,
    unreadCount,
    showModal,
    addAlert,
    markAsRead,
    markAllAsRead,
    clearAlerts,
    closeModal
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};