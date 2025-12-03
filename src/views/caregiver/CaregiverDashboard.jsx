import React, { useEffect, useState, useRef } from 'react';
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
  
  // Para rastrear qué niños ya enviaron alerta
  const alertedChildren = useRef(new Set());

  // 1. CARGAR LISTA DE NIÑOS
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        console.log('🔍 Cargando niños para usuario:', user.id);

        const response = await fetch(
          `http://127.0.0.1:5000/api/caregiver/${user.id}/children`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error cargando la lista de niños");
        }

        const data = await response.json();
        console.log('✅ Niños cargados:', data);
        setChildren(data);
      } catch (err) {
        console.error('❌ Error cargando niños:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchChildren();
    }
  }, [user]);

  // 2. LÓGICA DE IA CON NOTIFICACIONES
  useEffect(() => {
    if (children.length === 0) {
      console.log('⏸️ No hay niños para analizar');
      return;
    }

    console.log('🤖 Iniciando análisis de salud para', children.length, 'niños');

    const checkHealth = async () => {
      const newStatuses = {};

      await Promise.all(children.map(async (child) => {
        console.log(`\n👶 Analizando niño: ${child.first_name} (ID: ${child.id_child})`);
        console.log(`   Smartwatch ID: ${child.id_smartwatch}`);

        if (!child.id_smartwatch) {
          console.log('   ⚠️ No tiene smartwatch asignado');
          return;
        }

        try {
          const url = `${api.baseUrl}readings/smartwatch/${child.id_smartwatch}/latest`;
          console.log(`   📡 Consultando: ${url}`);
          
          const res = await fetch(url);
          console.log(`   📊 Status respuesta: ${res.status}`);
          
          if (res.ok) {
            const reading = await res.json();
            console.log('   📈 Lectura obtenida:', reading);
            
            const bpm = reading.heart_rate?.beats_per_minute || 0;
            const temp = reading.temperature?.temperature || 0;
            const oxy = reading.oxygenation?.spo2_level || 0;

            console.log(`   💓 BPM: ${bpm}, 🌡️ Temp: ${temp}, 🫁 O2: ${oxy}`);

            // Llamada a la IA
            console.log('   🧠 Enviando a IA...');
            const analysis = await analyzeHealth(bpm, temp, oxy);
            console.log('   🎯 Resultado IA:', analysis);
            
            newStatuses[child.id_child] = analysis;
            console.log(`   ${analysis.is_critical ? '🔴 CRÍTICO' : '🟢 NORMAL'}: ${analysis.message}`);
            
            // 🚨 ENVIAR NOTIFICACIÓN SI ES CRÍTICO Y NO SE HA ALERTADO ANTES
            if (analysis.is_critical && !alertedChildren.current.has(child.id_child)) {
              console.log('🔔 Enviando notificación para', child.first_name);
              
              addAlert({
                id_child: child.id_child,
                first_name: child.first_name,
                last_name: child.last_name,
                message: analysis.message
              });
              
              // Marcar como alertado
              alertedChildren.current.add(child.id_child);
            }
            
            // Si ya no es crítico, permitir nueva alerta en el futuro
            if (!analysis.is_critical && alertedChildren.current.has(child.id_child)) {
              alertedChildren.current.delete(child.id_child);
            }
            
          } else {
            console.log('   ❌ No se pudo obtener lectura del smartwatch');
          }
        } catch (err) {
          console.error(`   💥 Error analizando niño ${child.id_child}:`, err);
        }
      }));

      console.log('\n📦 Estados finales a guardar:', newStatuses);
      setHealthStatus(prev => {
        const updated = {...prev, ...newStatuses};
        console.log('✨ Estado actualizado:', updated);
        return updated;
      });
    };

    checkHealth();
    
    const interval = setInterval(() => {
      console.log('⏰ Recheck automático cada 10s');
      checkHealth();
    }, 10000);
    
    return () => {
      console.log('🛑 Limpiando intervalo');
      clearInterval(interval);
    };

  }, [children, addAlert]);

  if (loading) return <p className={styles.pageTitle}>Cargando los niños...</p>;
  if (error) return <p className={styles.pageTitle}>{error}</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mis Niños Asignados</h1>
      <p className={styles.pageSubtitle}>
        Aquí encontrarás la lista de niños bajo tu cuidado. Selecciona uno para ver sus detalles.
      </p>

      <div className={styles.grid}>
        {children.map((child) => {
          const status = healthStatus[child.id_child];
          const isCritical = status?.is_critical;
          
          let cardClassName = styles.card;
          if (status) {
            cardClassName = isCritical 
              ? `${styles.card} ${styles.cardCritical}`
              : `${styles.card} ${styles.cardSafe}`;
          }

          return (
            <div key={child.id_child} className={cardClassName}>
              
              {isCritical && (
                <div className={styles.alertBadge}>
                  <IoWarning /> RIESGO DETECTADO
                </div>
              )}

              <img
                src={`https://i.pravatar.cc/300?u=${child.first_name}`}
                alt={child.first_name}
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