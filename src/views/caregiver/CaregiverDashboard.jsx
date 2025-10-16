import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookMedical } from 'react-icons/fa';
import styles from './CaregiverDashboard.module.css'; 

// Datos simulados
const assignedChildren = [
  { id: 1, name: 'Ana', lastName: 'García', age: 3, imageUrl: 'https://i.pravatar.cc/300?u=ana' },
  { id: 2, name: 'Luis', lastName: 'Martinez', age: 4, imageUrl: 'https://i.pravatar.cc/300?u=luis' },
  { id: 3, name: 'Sofía', lastName: 'Hernández', age: 3, imageUrl: 'https://i.pravatar.cc/300?u=sofia' },
];

const CaregiverDashboard = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mis Niños Asignados</h1>
      <p className={styles.pageSubtitle}>
        Aquí encontrarás la lista de niños bajo tu cuidado. Selecciona uno para ver sus detalles.
      </p>
      <div className={styles.grid}>
        {assignedChildren.map((child) => (
          <div key={child.id} className={styles.card}>
            <img src={child.imageUrl} alt={child.name} className={styles.cardImage} />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{child.name} {child.lastName}</h3>
              <p className={styles.cardInfo}>Edad: {child.age} años</p>
              <Link to={`/niño/${child.id}`} className={styles.cardButton}>
                <FaBookMedical style={{ marginRight: '8px' }} />
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaregiverDashboard;