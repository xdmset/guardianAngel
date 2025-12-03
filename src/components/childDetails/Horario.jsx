import React, { useEffect, useState } from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";
import { FaGamepad } from "react-icons/fa";
import api from "../../config/apiConfig";


const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const Horario = ({ childId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${api.baseUrl}children/${childId}/schedule`);
        const data = await res.json();
        console.log("Fetched schedule:", data);
        setSchedule(data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    if (childId) fetchSchedule();
  }, [childId]);

  // Agrupar actividades por día
  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedule.filter((item) => item.day_of_week === day);
    return acc;
  }, {});

  return (
    <section className={`${styles.card} ${styles.cardActivities}`}>
      <h2 className={styles.sectionTitle}>Horario Semanal</h2>
      
      {loading ? (
        <p>Cargando actividades...</p>
      ) : (
        <div className={styles.scheduleGrid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayColumn}>
              <h3 className={styles.dayTitle}>{day}</h3>
              {scheduleByDay[day].length > 0 ? (
                scheduleByDay[day].map((act) => (
                 <div key={act.id_schedule} className={styles.activityCard}>
                  <div className={styles.activityTime}>
                    {act.start_time} - {act.end_time}
                  </div>
                  <div className={styles.activityName}>
                    <FaGamepad /> {act.activity_name}
                  </div>
                  <div className={styles.activityDescription}>{act.description}</div>
                </div>
                ))
              ) : (
                <p className={styles.noActivity}>Sin actividades</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Horario;
