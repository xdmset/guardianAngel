import React, { useEffect, useState } from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";
import { FaLightbulb } from "react-icons/fa";
import api from "../../config/apiConfig";

const SuggestionsSection = ({ smartwatchId }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!smartwatchId) return;

    const fetchData = async () => {
      try {
        // FETCH Heart Rate
        const resHeart = await fetch(`${api.baseUrl}readings/smartwatch/${smartwatchId}/heart_rate`);
        const heartData = await resHeart.json();
        const heartAvg = heartData.length
          ? heartData.reduce((sum, r) => sum + r.beats_per_minute, 0) / heartData.length
          : 0;

        // FETCH Oxygen
        const resOxy = await fetch(`${api.baseUrl}readings/smartwatch/${smartwatchId}/oxygen`);
        const oxyData = await resOxy.json();
        const oxyAvg = oxyData.length
          ? oxyData.reduce((sum, r) => sum + parseFloat(r.spo2_level), 0) / oxyData.length
          : 0;

        // GENERAR SUGERENCIAS
        const suggestionList = [];

        let hasAlert = false; 

        // Ritmo cardíaco
        if (heartAvg < 70) {
          suggestionList.push("El ritmo cardíaco está bajo. Vigilar actividad física.");
          hasAlert = true;
        } else if (heartAvg > 100) {
          suggestionList.push("Ritmo cardíaco elevado, considerar descanso y monitoreo.");
          hasAlert = true;
        } else {
          suggestionList.push("Ritmo cardíaco normal, mantener rutina saludable.");
        }

        // Oxigenación
        if (oxyAvg < 95) {
          suggestionList.push("Oxigenación baja. Revisar respiración y entorno.");
          hasAlert = true;
        } else {
          suggestionList.push("Oxigenación dentro del rango saludable.");
        }

        // Estado general
        if (heartAvg > 120 && oxyAvg < 95) {
          suggestionList.push("Alerta: posible sobreesfuerzo o malestar, vigilar al niño de cerca.");
          hasAlert = true;
        }

        // Actividad recomendada
        if (heartAvg < 90) {
          suggestionList.push("Aprovecha para juegos activos y ejercicios ligeros.");
        } else if (heartAvg <= 100) {
          suggestionList.push("Mantener actividades normales y supervisadas.");
        } else {
          suggestionList.push("Priorizar actividades tranquilas y relajación.");
        }

        // Hidratación
        if (oxyAvg < 97 || heartAvg > 110) {
          suggestionList.push("Recordar mantener al niño hidratado.");
        }

        // Si no hay alertas, mensaje positivo general
        if (!hasAlert) {
          suggestionList.push("El niño se encuentra en buen estado de salud, sigue con su rutina normal.");
        }

        setSuggestions(suggestionList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching health data:", error);
        setSuggestions(["No se pudieron obtener sugerencias."]);
        setLoading(false);
      }
    };

    fetchData();
  }, [smartwatchId]);

  return (
    <section className={`${styles.card} ${styles.cardSugestion}`}>
      <h2 className={styles.sectionTitle}>
        <FaLightbulb style={{ marginRight: "6px" }} />
        Resumen y sugerencias
      </h2>

      {loading ? (
        <p className={styles.muted}>No hay sugerencias disponibles</p>
      ) : suggestions.length === 0 ? (
        <p className={styles.muted}>No hay sugerencias disponibles.</p>
      ) : (
        <ul className={styles.list}>
          {suggestions.map((s, i) => (
            <li key={i}><FaLightbulb /> {s}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SuggestionsSection;
