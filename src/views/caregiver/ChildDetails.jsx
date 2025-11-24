import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUtensils, FaGamepad } from 'react-icons/fa';
import { FaHeartPulse, FaTemperatureThreeQuarters } from 'react-icons/fa6';
import styles from './ChildDetails.module.css';
import apiConfig from '../../config/apiConfig';

const ChildDetails = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [heartRate, setHeartRate] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [oxygenation, setOxygenation] = useState(null);

  const [pulse, setPulse] = useState(false);
  const [flashTemp, setFlashTemp] = useState(false);
  const [oxygenAnim, setOxygenAnim] = useState(false);

  useEffect(() => {
    const loadChild = async () => {
      const res = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.children}${id}`);
      const data = await res.json();
      setChild(data);
      setLoading(false);
    };
    loadChild();
  }, [id]);

  useEffect(() => {
    const loadTutor = async () => {
      const res = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.children}${id}/tutor`);
      setTutor(await res.json());
    };
    loadTutor();
  }, [id]);

  useEffect(() => {
    if (!child?.id_smartwatch) return;

    const fetchReadings = async () => {
      try {
        const res = await fetch(`${apiConfig.baseUrl}readings/smartwatch/${child.id_smartwatch}/latest`);
        const data = await res.json();

        setHeartRate(data.heart_rate?.beats_per_minute || 0);
        setTemperature(parseFloat(data.temperature?.temperature || 0));
        setOxygenation(parseFloat(data.oxygenation?.spo2_level || 0));

        setPulse(true);
        setFlashTemp(true);
        setOxygenAnim(true);

        setTimeout(() => setPulse(false), 400);
        setTimeout(() => setFlashTemp(false), 500);
        setTimeout(() => setOxygenAnim(false), 700);
      } catch (err) {
        console.log('Error fetching readings:', err);
      }
    };

    fetchReadings();
    const interval = setInterval(fetchReadings, 3000);
    return () => clearInterval(interval);
  }, [child]);

  if (loading) return <h2>Cargando datos...</h2>;

  // const tempColor = temperature > 37.5
  //   ? styles.tempHigh
  //   : temperature < 36
  //   ? styles.tempLow
  //   : styles.tempNormal;

  return (
    <div className={styles.container}>
      <Link to="/cuidador/dashboard" className={styles.backButton}>⬅ Volver</Link>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.childInfo}>
          <div className={styles.avatar}>
            <img 
              src={`https://ui-avatars.com/api/?name=${child.first_name}&background=FFD1DC&color=555`} 
              alt={child.first_name} 
            />
          </div>
          <div>
            <h1 className={styles.childName}>{child.first_name} {child.last_name}</h1>
            <p>¡Bienvenido a su día en la guardería!</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton}><FaPlus /></button>
          <button className={styles.actionButton}><FaCalendarAlt /></button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <main className={styles.mainGrid}>

        {/* ------------ COLUMNA IZQUIERDA ------------ */}
        <div className={styles.mainLeft}>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Notas del Día</h2>
            <p>{child.first_name} tuvo un día muy activo y alegre.</p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>🩺 Estado de Salud</h2>

            <div className={styles.healthGrid}>
              
              <div className={styles.healthCard}>
                <h3>Ritmo Cardíaco</h3>
                <p className={styles.healthReading}>
                  <FaHeartPulse className={`${styles.icon} ${pulse ? styles.heartBeat : ''}`} />
                  {heartRate ? `${heartRate} LPM` : '—'}
                </p>

              </div>

              <div className={`${styles.healthCard} ${flashTemp ? styles.flash : ''}`}>
                <h3>Temperatura</h3>
                <p className={styles.healthReading}>
                  <FaTemperatureThreeQuarters className={`${styles.icon} ${flashTemp ? styles.tempFlash : ''}`} />
                  {temperature ? `${temperature.toFixed(1)}°C` : '—'}
                </p>


              </div>

              {/* <div className={`${styles.healthCard} ${oxygenAnim ? styles.oxygenPulse : ''}`}>
                <h3>Oxigenación</h3>
                <p className={styles.healthReading}>
                  <span className={`${styles.icon} ${oxygenAnim ? styles.oxygenPulse : ''}`}>💨</span>
                  {oxygenation ? `${oxygenation.toFixed(1)}%` : '—'}
                </p>

              </div> */}

            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>🎨 Actividades</h2>
            <ul className={styles.list}>
              <li><FaGamepad /> Juegos de construcción – 30 min</li>
              <li><FaGamepad /> Pintura y creatividad – 20 min</li>
              <li><FaGamepad /> Canciones y movimiento – 15 min</li>
            </ul>
          </section>

        </div>

        {/* ------------ COLUMNA DERECHA (Tutor + Alimentación) ------------ */}
        <aside className={styles.tutorColumn}>

          <section className={`${styles.card} ${styles.tutorCard}`}>
            <h2 className={styles.sectionTitle}>Tutor</h2>
            {tutor ? (
              <>
                <p><strong>Nombre:</strong> {tutor.first_name} {tutor.last_name}</p>
                <p><strong>Correo:</strong> {tutor.email}</p>
              </>
            ) : (
              <p>No hay tutor registrado.</p>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>🍽 Alimentación</h2>
            <ul className={styles.list}>
              <li><FaUtensils /> Desayuno: Fruta y cereal</li>
              <li><FaUtensils /> Almuerzo: Sopa y arroz</li>
              <li><FaUtensils /> Merienda: Yogur</li>
            </ul>
          </section>

        </aside>

      </main>
    </div>
  );
};

export default ChildDetails;
