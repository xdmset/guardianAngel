import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { FaHeartPulse, FaTemperatureThreeQuarters } from 'react-icons/fa6'; 
import styles from './ChildDetails.module.css'; 

// Datos simulados
const childData = {
  '1': { name: 'Ana', lastName: 'García', temperature: 36.8, heartRate: 95 },
  '2': { name: 'Luis', lastName: 'Martinez', temperature: 37.6, heartRate: 102 },
};

const ChildDetails = () => {
  const { id } = useParams();
  const child = childData[id];

  if (!child) {
    return (
      <div className={styles.container}>
        <h2>Niño no encontrado</h2>
        <Link to="/cuidador/dashboard">Volver al listado</Link>
      </div>
    );
  }

  const getTempStatus = (temp) => {
    if (temp > 37.5) return styles.tempHigh;
    if (temp < 36.0) return styles.tempLow;
    return styles.tempNormal;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.childName}>{child.name} {child.lastName}</h1>
        <div className={styles.actions}>
          <button className={styles.actionButton}><FaPlus /></button>
          <button className={styles.actionButton}><FaCalendarAlt /></button>
        </div>
      </header>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Notas del Día</h2>
        <p>Ana comió bien y durmió una siesta de 1 hora.</p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Información de Salud</h2>
        <div className={styles.healthGrid}>
          <div className={styles.card}>
            <h3>Ritmo Cardíaco</h3>
            <p className={styles.healthReading}>
              <FaHeartPulse style={{ color: 'red' }} /> {child.heartRate} LPM
            </p>
          </div>
          <div className={styles.card}>
            <h3>Temperatura</h3>
            <p className={`${styles.healthReading} ${getTempStatus(child.temperature)}`}>
              <FaTemperatureThreeQuarters /> {child.temperature}°C
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.card} ${styles.contactCard}`}>
        <h2 className={styles.sectionTitle}>Contacto del Padre</h2>
        <p><strong>Nombre:</strong> Carlos García</p>
        <p><strong>Teléfono:</strong> 555-123-4567</p>
        <a href="tel:555-123-4567" className={styles.contactButton}>
          <FaPhone /> Contactar
        </a>
      </section>
    </div>
  );
};

export default ChildDetails;