// src/components/childDetails/Horario.jsx
import React, { useEffect, useState } from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";
import { FaGamepad } from "react-icons/fa";
import api from "../../config/apiConfig";

const Horario = ({ childId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${api.baseUrl}children/${childId}/schedule`);
        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    if (childId) fetchSchedule();
  }, [childId]);

  return (
    <section className={`${styles.card} ${styles.cardActivities}`}>
      <h2 className={styles.sectionTitle}>Actividades</h2>
      
      {loading ? (
        <p>Cargando actividades...</p>
      ) : (
        <ul className={styles.list}>
          {schedule.length > 0 ? (
            schedule.map((act) => (
              <li key={act.id_schedule}>
                <FaGamepad /> {act.activity_name} ({act.start_time} - {act.end_time})
                <br />
                <small>{act.description}</small>
              </li>
            ))
          ) : (
            <li>No se ha registrado el horario del niño</li>
          )}
        </ul>
      )}
    </section>
  );
};

export default Horario;
