import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { IoWarning, IoTrash, IoCheckmarkDone } from 'react-icons/io5';
import styles from './AlertsPage.module.css';

const AlertsPage = () => {
  const { alerts, markAsRead, markAllAsRead, clearAlerts } = useNotifications();
  const navigate = useNavigate();

  const handleAlertClick = (alertId, childId) => {
    markAsRead(alertId);
    navigate(`/niño/${childId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <IoWarning /> Historial de Alertas
        </h1>
        
        {alerts.length > 0 && (
          <div className={styles.actions}>
            <button onClick={markAllAsRead} className={styles.markAllButton}>
              <IoCheckmarkDone /> Marcar todas como leídas
            </button>
            <button onClick={clearAlerts} className={styles.clearButton}>
              <IoTrash /> Limpiar historial
            </button>
          </div>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className={styles.emptyState}>
          <IoCheckmarkDone className={styles.emptyIcon} />
          <p>No hay alertas en este momento</p>
          <p className={styles.emptySubtext}>¡Todos los niños están bien!</p>
        </div>
      ) : (
        <div className={styles.alertList}>
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`${styles.alertCard} ${alert.read ? styles.read : styles.unread}`}
              onClick={() => handleAlertClick(alert.id, alert.childId)}
            >
              <div className={styles.alertIcon}>
                <IoWarning />
              </div>
              
              <div className={styles.alertContent}>
                <h3 className={styles.alertTitle}>
                  {alert.childName} {alert.childLastName}
                </h3>
                <p className={styles.alertMessage}>{alert.message}</p>
                <p className={styles.alertTime}>
                  {alert.timestamp.toLocaleString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {!alert.read && <div className={styles.unreadDot} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;