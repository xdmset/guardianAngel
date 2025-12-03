import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookMedical } from 'react-icons/fa';
import styles from '../caregiver/CaregiverDashboard.module.css';
import { useAuth } from '../../hooks/useAuth';

const TutorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://127.0.0.1:5000/api/tutor/${user.id}/children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error cargando los niños");
        }

        const data = await response.json();
        setChildren(data);

        // 🔥 Regla principal: si solo tiene 1 niño → redirigir SIEMPRE
        if (data.length === 1) {
          navigate(`/tutor/niño/${data[0].id_child}`);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchChildren();
    }
  }, [user, navigate]);


  // --- LOADING Y ERROR ---
  if (loading) return <p className={styles.pageTitle}>Cargando los niños...</p>;
  if (error) return <p className={styles.pageTitle}>{error}</p>;

  // 🔥 Caso: No tiene niños
  if (children.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>Sin niños asignados</h1>
        <p className={styles.pageSubtitle}>Contacta a la guardería.</p>
      </div>
    );
  }

  // 🔥 Caso: Tiene MÁS de 1 — mostrar Dashboard normal
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
              src={`https://ui-avatars.com/api/?name=${child.first_name}&background=FEE9D6&color=5A6B8A`} 
              alt={`${child.first_name} avatar`} 
              className={styles.cardImage}
            />

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
                {child.first_name} {child.last_name}
              </h3>

              <Link
                to={`/tutor/niño/${child.id_child}`}
                className={styles.cardButton}
              >
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

export default TutorDashboard;
