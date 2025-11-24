import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookMedical } from 'react-icons/fa';
import styles from './CaregiverDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';

const CaregiverDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `http://127.0.0.1:5000/api/teachers/${user.id}/children`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

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

    if (user?.id) {
      fetchChildren();
    }
  }, [user]);

  if (loading) return <p className={styles.pageTitle}>Cargando the niños...</p>;
  if (error) return <p className={styles.pageTitle}>{error}</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Mis Niños Asignados</h1>
      <p className={styles.pageSubtitle}>
        Aquí encontrarás la lista de niños bajo tu cuidado. Selecciona uno para ver sus detalles.
      </p>

      <div className={styles.grid}>
        {children.map((child) => (
          <div key={child.id_child} className={styles.card}>
            <img
              src={`https://i.pravatar.cc/300?u=${child.first_name}`}
              alt={child.first_name}
              className={styles.cardImage}
            />

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
                {child.first_name} {child.last_name}
              </h3>

              <p className={styles.cardInfo}>
                Edad: {calculateAge(child.birth_date)} años
              </p>

              <Link to={`/niño/${child.id_child}`} className={styles.cardButton}>
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
