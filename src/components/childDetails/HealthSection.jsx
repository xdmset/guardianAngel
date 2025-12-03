import React, { useState, useEffect } from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";
import { FaHeartPulse, FaTemperatureThreeQuarters } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import api from "../../config/apiConfig";

// charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const HealthSection = ({ smartwatchId, heartRate, temperature, oxygenation, pulse }) => {
  
  const [selectedChart, setSelectedChart] = useState(null);

  const [heartData, setHeartData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [oxygenData, setOxygenData] = useState([]);

  // Toggle abrir/cerrar
  const handleCardClick = async (type) => {
    if (selectedChart === type) {
      setSelectedChart(null); 
      return;
    }
    setSelectedChart(type);

    if (type === "heart") fetchHeartRate();
    if (type === "oxygen") fetchOxygen();
    if (type === "temp") setTempData([]);
  };

  const fetchHeartRate = async () => {
    try {
      const res = await fetch(
        `${api.baseUrl}readings/smartwatch/${smartwatchId}/heart_rate`
      );
      const data = await res.json();
      setHeartData(
        data.map((item) => ({
          value: item.beats_per_minute,
          timestamp: item.timestamp
        }))
      );
    } catch (e) {
      console.log("Error fetching heart rate", e);
    }
  };

  const fetchOxygen = async () => {
    try {
      const res = await fetch(
        `${api.baseUrl}readings/smartwatch/${smartwatchId}/oxygen`
      );
      const data = await res.json();
      setOxygenData(
        data.map((item) => ({
          value: parseFloat(item.spo2_level),
          timestamp: item.timestamp
        }))
      );
    } catch (e) {
      console.log("Error fetching oxygen", e);
    }
  };

  return (
    <div className={styles["row-health"]}>
      <section className={`${styles.card} ${styles.healthSection}`}>
        <h2 className={styles.sectionTitle}>Estado de Salud</h2>

        {/* Tarjetas */}
        <div className={styles.healthGrid}>

          <div
            className={styles.healthCard}
            onClick={() => handleCardClick("heart")}
          >
            <div className={styles.healthTitle}>
              <FaHeartPulse className={`${styles.icon} ${pulse ? styles.pulseAnim : ""}`} />
              <span>Ritmo Cardíaco</span>
            </div>
            <p className={styles.healthReading}>
              {heartRate ? `${heartRate} LPM` : "—"}
            </p>
          </div>

          <div
            className={styles.healthCard}
            onClick={() => handleCardClick("temp")}
          >
            <div className={styles.healthTitle}>
              <FaTemperatureThreeQuarters className={styles.icon} />
              <span>Temperatura</span>
            </div>
            <p className={styles.healthReading}>
              {temperature ? `${temperature.toFixed(1)}°C` : "—"}
            </p>
          </div>

          <div
            className={styles.healthCard}
            onClick={() => handleCardClick("oxygen")}
          >
            <div className={styles.healthTitle}>
              <IoWater className={styles.icon} />
              <span>Oxigenación</span>
            </div>
            <p className={styles.healthReading}>
              {oxygenation ? `${oxygenation}%` : "—"}
            </p>
          </div>

        </div>

        <br />

        {/* Panel de gráfica */}
        {selectedChart && (
          <div className={styles.chartPanel}>

            {/* Título de gráfica */}
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              {selectedChart === "heart" && "Historial de Ritmo Cardíaco (LPM)"}
              {selectedChart === "oxygen" && "Historial de Oxigenación (%)"}
              {/* {selectedChart === "temp" && "Temperatura Corporal"} */}
            </h3>

            {/* Heart chart */}
            {selectedChart === "heart" && (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={heartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} LPM`} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Latidos por minuto" stroke="#ED9263" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>

                <p style={{ textAlign: "center", marginTop: "10px", color: "#555" }}>
                  • Valores más altos indican mayor actividad o esfuerzo.
                </p>
              </>
            )}

            {/* Oxygen chart */}
            {selectedChart === "oxygen" && (
              <>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={oxygenData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis domain={[90, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Nivel de oxígeno" stroke="#245AB2" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>

                <p style={{ textAlign: "center", marginTop: "10px", color: "#555" }}>
                  • Un nivel normal debe ser de 95% a 100%.
                </p>
              </>
            )}

            {/* Temp chart */}
            {/* {selectedChart === "temp" && (
              <p style={{ textAlign: "center", padding: "20px 0" }}>
                (No hay datos de temperatura disponibles actualmente)
              </p>
            )} */}

          </div>
        )}

      </section>
    </div>
  );
};

export default HealthSection;
