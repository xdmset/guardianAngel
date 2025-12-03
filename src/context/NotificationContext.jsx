// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

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
  
  // Usamos una referencia para saber cuál fue la última alerta mostrada y no repetir el modal
  const lastAlertIdRef = useRef(null);

  // Agregar una nueva alerta (CON PROTECCIÓN CONTRA DUPLICADOS)
  const addAlert = useCallback((childData) => {
    setAlerts(prev => {
      // 1. Verificamos si ya existe una alerta NO LEÍDA para este niño con el mismo mensaje
      const isDuplicate = prev.some(alert => 
        alert.childId === childData.id_child && 
        !alert.read &&
        alert.message === childData.message
      );

      // Si es duplicada, no hacemos nada (regresamos el estado anterior tal cual)
      if (isDuplicate) {
        console.log(` Alerta duplicada ignorada para: ${childData.first_name}`);
        return prev;
      }

      // 2. Si es nueva, la creamos
      const newAlert = {
        id: Date.now(),
        childId: childData.id_child,
        childName: childData.first_name,
        childLastName: childData.last_name,
        message: childData.message,
        timestamp: new Date(),
        read: false
      };

      console.log('Nueva alerta agregada:', newAlert);
      return [newAlert, ...prev];
    });
  }, []);

  // EFECTO: Controla la apertura del Modal automáticamente cuando cambia la lista de alertas
  useEffect(() => {
    if (alerts.length > 0) {
      const latestAlert = alerts[0];

      // Solo abrimos el modal si la alerta más reciente es NUEVA (distinta a la anterior) y no está leída
      if (latestAlert.id !== lastAlertIdRef.current && !latestAlert.read) {
        setShowModal(true);
        lastAlertIdRef.current = latestAlert.id; // Actualizamos el ID de referencia

        // Auto-cerrar modal después de 10 segundos
        const timer = setTimeout(() => {
          setShowModal(false);
        }, 10000);

        return () => clearTimeout(timer);
      }
    }
  }, [alerts]);

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