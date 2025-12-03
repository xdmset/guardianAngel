import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookMedical } from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';
import styles from './CaregiverDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../config/apiConfig'; 
import { analyzeHealth } from '../../services/aiService'; 

const CaregiverDashboard = () => {
  const { user } = useAuth();
  const { addAlert } = useNotifications();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [healthStatus, setHealthStatus] = useState({});
  
  // 1. CARGAR NIÑOS
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://127.0.0.1:5000/api/caregiver/${user.id}/children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Error cargando la lista de niños");

        const data = await response.json();
        setChildren(data);
      } catch (err) {
        console.error(' Error cargando niños:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchChildren();
  }, [user]);

  // 2. LÓGICA DE IA Y SENSORES
  useEffect(() => {
    if (children.length === 0) return;

    const checkHealth = async () => {
      const newStatuses = {};

      await Promise.all(children.map(async (child) => {
        if (!child.id_smartwatch) return;

        try {
          const url = `${api.baseUrl}readings/smartwatch/${child.id_smartwatch}/latest`;
          const res = await fetch(url);
          
          if (res.ok) {
            const reading = await res.json();
            const bpm = reading.heart_rate?.beats_per_minute || 0;
            const temp = reading.temperature?.temperature || 0;
            const oxy = reading.oxygenation?.spo2_level || 0;

            // Análisis de modelo
            const analysis = await analyzeHealth(bpm, temp, oxy);
            
            newStatuses[child.id_child] = analysis;
            
            if (analysis.is_critical) {
              addAlert({
                id_child: child.id_child,
                first_name: child.first_name,
                last_name: child.last_name,
                message: analysis.message
              });
            }
          }
        } catch (err) {
          console.error(`Error analizando niño ${child.id_child}:`, err);
        }
      }));

      setHealthStatus(prev => ({...prev, ...newStatuses}));
    };

    // Ejecutar inmediatamente y luego cada 10 segundos
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    
    return () => clearInterval(interval);

  }, [children, addAlert]);

  if (loading) return <p className={styles.pageTitle}>Cargando los niños...</p>;
  if (error) return <p className={styles.pageTitle}>{error}</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mis Niños Asignados</h1>
      <p className={styles.pageSubtitle}>
        Aquí encontrarás la lista de niños bajo tu cuidado.
      </p>

      <div className={styles.grid}>
        {children.map((child) => {
          const status = healthStatus[child.id_child];
          const isCritical = status?.is_critical;
          
          const cardClassName = isCritical 
              ? `${styles.card} ${styles.cardCritical}`
              : `${styles.card} ${styles.cardSafe}`;

          return (
            <div key={child.id_child} className={cardClassName}>
              {isCritical && (
                <div className={styles.alertBadge}>
                  <IoWarning /> RIESGO DETECTADO
                </div>
              )}

              {/* AQUÍ ESTÁ EL CAMBIO PARA LA IMAGEN */}
              <img 
                src={child.profile_image || `https://ui-avatars.com/api/?name=${child.first_name}&background=FEE9D6&color=5A6B8A`} 
                alt={`${child.first_name}`} 
                className={styles.cardImage}
              />

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>
                  {child.first_name} {child.last_name}
                </h3>

                {status && (
                  <p className={isCritical ? styles.textCritical : styles.textSafe}>
                    {status.message}
                  </p>
                )}

                <Link to={`/niño/${child.id_child}`} className={styles.cardButton}>
                  <FaBookMedical style={{ marginRight: '8px' }} />
                  Ver Detalles
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaregiverDashboard;