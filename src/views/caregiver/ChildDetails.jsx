import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaPhone, FaUtensils, FaGamepad } from 'react-icons/fa';
import { FaHeartPulse, FaTemperatureThreeQuarters } from 'react-icons/fa6'; 
import styles from './ChildDetails.module.css'; 

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
      <Link to="/cuidador/dashboard" className={styles.backButton}>Volver</Link>

      <header className={styles.header}>
        <div className={styles.childInfo}>
          <div className={styles.avatar}>
            <img src={`https://ui-avatars.com/api/?name=${child.name}+${child.lastName}&background=245AB2&color=fff`} alt={child.name} />
          </div>
          <div>
            <h1 className={styles.childName}>{child.name} {child.lastName}</h1>
            <p className={styles.subtitle}>Información general del menor</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton}><FaPlus /></button>
          <button className={styles.actionButton}><FaCalendarAlt /></button>
        </div>
      </header>

      <main className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          {/* Notas del Día */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Notas del Día</h2>
            <p>Ana comió bien, participó en juegos grupales y durmió una siesta de 1 hora.</p>
          </section>

          {/* Información de Salud */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Información de Salud</h2>
            <div className={styles.healthGrid}>
              <div className={styles.healthCard}>
                <h3>Ritmo Cardíaco</h3>
                <p className={styles.healthReading}>
                  <FaHeartPulse style={{ color: '#ED9263' }} /> {child.heartRate} LPM
                </p>
              </div>
              <div className={styles.healthCard}>
                <h3>Temperatura</h3>
                <p className={`${styles.healthReading} ${getTempStatus(child.temperature)}`}>
                  <FaTemperatureThreeQuarters /> {child.temperature}°C
                </p>
              </div>
            </div>
          </section>

          {/* Actividades */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Actividades</h2>
            <ul className={styles.list}>
              <li><FaGamepad style={{ color: '#245AB2' }} /> Juegos de construcción - 30 min</li>
              <li><FaGamepad style={{ color: '#245AB2' }} /> Pintura y creatividad - 20 min</li>
              <li><FaGamepad style={{ color: '#245AB2' }} /> Canciones y movimiento - 15 min</li>
            </ul>
          </section>

          {/* Alimentación */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Alimentación</h2>
            <ul className={styles.list}>
              <li><FaUtensils style={{ color: '#8ED6CB' }} /> Desayuno: Fruta y cereal</li>
              <li><FaUtensils style={{ color: '#8ED6CB' }} /> Almuerzo: Sopa y arroz</li>
              <li><FaUtensils style={{ color: '#8ED6CB' }} /> Merienda: Yogur</li>
            </ul>
          </section>
        </div>

        <aside className={`${styles.card} ${styles.contactCard}`}>
          <h2 className={styles.sectionTitle}>Contacto del Padre</h2>
          <p><strong>Nombre:</strong> Carlos García</p>
          <p><strong>Teléfono:</strong> 555-123-4567</p>
          <a href="tel:555-123-4567" className={styles.contactButton}>
            <FaPhone /> Contactar
          </a>
        </aside>
      </main>
    </div>
  );
};

export default ChildDetails;
