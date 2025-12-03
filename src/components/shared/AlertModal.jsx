// src/components/shared/AlertModal.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoWarning, IoClose } from 'react-icons/io5';
import { useNotifications } from '../../context/NotificationContext';
import styles from './AlertModal.module.css';

const AlertModal = () => {
  const { showModal, alerts, closeModal } = useNotifications();
  const navigate = useNavigate();

  // Obtener la alerta más reciente no leída
  const latestAlert = alerts.find(a => !a.read);

  useEffect(() => {
    if (showModal && latestAlert) {
      // Reproducir sonido de alerta (opcional)
      const audio = new Audio('/alert-sound.mp3'); // Necesitas agregar un archivo de sonido
      audio.volume = 0.3;
      audio.play().catch(err => console.log('No se pudo reproducir sonido:', err));
    }
  }, [showModal, latestAlert]);

  if (!showModal || !latestAlert) return null;

  const handleViewChild = () => {
    closeModal();
    navigate(`/niño/${latestAlert.childId}`);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={closeModal}>
          <IoClose />
        </button>

        <div className={styles.iconContainer}>
          <IoWarning className={styles.warningIcon} />
        </div>

        <h2 className={styles.title}>¡Alerta de Salud!</h2>
        
        <div className={styles.content}>
          <p className={styles.childName}>
            {latestAlert.childName} {latestAlert.childLastName}
          </p>
          <p className={styles.message}>{latestAlert.message}</p>
          <p className={styles.timestamp}>
            {latestAlert.timestamp.toLocaleTimeString('es-MX', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.viewButton} onClick={handleViewChild}>
            Ver Detalles
          </button>
          <button className={styles.dismissButton} onClick={closeModal}>
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;