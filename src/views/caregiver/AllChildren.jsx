import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookMedical } from "react-icons/fa";
import { IoWarning } from 'react-icons/io5'; // Importamos icono de alerta
import styles from "./CaregiverDashboard.module.css"; 
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from '../../context/NotificationContext'; // Contexto de notificaciones
import api from "../../config/apiConfig";
import { analyzeHealth } from '../../services/aiService'; // Servicio de IA

const AllChildren = () => {
  const { user } = useAuth();
  const { addAlert } = useNotifications(); // Hook de alertas
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [healthStatus, setHealthStatus] = useState({}); // Estado para salud

  // 1. CARGAR NIÑOS
  useEffect(() => {
    const fetchAllChildren = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.baseUrl}children`);

        if (!response.ok) {
          throw new Error("Error cargando la lista de niños");
        }

        const data = await response.json();
        setChildren(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChildren();
  }, []);

  // 2. LÓGICA DE IA Y SENSORES (Igual que en Dashboard)
  useEffect(() => {
    if (children.length === 0) return;

    const checkHealth = async () => {
      const newStatuses = {};

      await Promise.all(children.map(async (child) => {
        // Nota: Asegúrate de que el endpoint /children devuelva 'id_smartwatch'
        // Si no tiene reloj asignado, saltamos
        if (!child.id_smartwatch && !child.device_id) return; 

        // Usamos id_smartwatch si viene, o intentamos buscar por device_id si es necesario
        // Asumimos que la API devuelve id_smartwatch en el objeto child
        const smartwatchId = child.id_smartwatch; 
        
        if(!smartwatchId) return; 

        try {
          const url = `${api.baseUrl}readings/smartwatch/${smartwatchId}/latest`;
          const res = await fetch(url);
          
          if (res.ok) {
            const reading = await res.json();
            const bpm = reading.heart_rate?.beats_per_minute || 0;
            const temp = reading.temperature?.temperature || 0;
            const oxy = reading.oxygenation?.spo2_level || 0;

            // Análisis de modelo IA
            const analysis = await analyzeHealth(bpm, temp, oxy);
            
            newStatuses[child.id_child] = analysis;
            
            // Si es crítico, enviamos alerta
            if (analysis.is_critical) {
              addAlert({
                id_child: child.id_child,
                // En AllChildren la API suele devolver child_first_name
                first_name: child.child_first_name || child.first_name, 
                last_name: child.child_last_name || child.last_name,
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
      
      <h1 className={styles.pageTitle}>Todos los Niños Registrados</h1>
      <p className={styles.pageSubtitle}>
        Aquí puedes ver la lista completa de niños registrados en el sistema.
      </p>

      <div className={styles.grid}>
        {children.map((child) => {
          // Extraemos estado de salud
          const status = healthStatus[child.id_child];
          const isCritical = status?.is_critical;
          
          // Nombres (adaptando por si la API devuelve child_first_name)
          const firstName = child.child_first_name || child.first_name;
          const lastName = child.child_last_name || child.last_name;

          // Clases dinámicas según riesgo
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

              {/* IMAGEN DE PERFIL: Usa la de la BD o genera avatar */}
              <img 
                src={child.profile_image || `https://ui-avatars.com/api/?name=${firstName}&background=FEE9D6&color=5A6B8A`} 
                alt={`${firstName} avatar`} 
                className={styles.cardImage}
              />

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>
                  {firstName} {lastName}
                </h3>

                {/* Mensaje de estado de salud IA */}
                {status && (
                  <p className={isCritical ? styles.textCritical : styles.textSafe}>
                    {status.message}
                  </p>
                )}

                <Link to={`/niño/${child.id_child}`} className={styles.cardButton}>
                  <FaBookMedical style={{ marginRight: "8px" }} />
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

export default AllChildren;