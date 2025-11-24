import React from "react";
import { motion } from "framer-motion";
import "./Index.css"; // Usa el mismo CSS pastel

const IndexTutor = () => {
  return (
    <div className="index">

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Bienvenido, <span>Tutor</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Consulta la información más importante del bienestar de tu pequeño,
            de manera clara, rápida y siempre accesible.
          </motion.p>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="project-info section">
        <div className="container">
          <h2 className="section-title">Tu Portal de Tutor</h2>

          <div className="info-grid">
            {[
              {
                icon: "🍼",
                title: "Revisar Actividades",
                text: "Consulta lo que tu hijo hizo en el día: alimentación, juegos, descanso y más."
              },
              {
                icon: "❤️",
                title: "Seguimiento de Salud",
                text: "Visualiza indicadores importantes como temperatura o ritmo cardíaco."
              },
              {
                icon: "📊",
                title: "Historial Completo",
                text: "Revisa el registro histórico de tu pequeño para ver su progreso."
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="info-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="info-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits section">
        <div className="container">
          <h2 className="section-title light">Lo que puedes hacer aquí</h2>

          <div className="benefit-grid">
            {[
              {
                icon: "📘",
                title: "Revisar el día a día",
                text: "Observa cómo estuvo tu pequeño en su jornada en la guardería."
              },
              {
                icon: "🕒",
                title: "Acceso rápido",
                text: "Toda la información disponible 24/7 desde tu dispositivo."
              },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="benefit-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ALERTS */}
      <section className="alertas-section">
        <h2 className="section-title">Información útil para ti</h2>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🧼</span>
            <p className="feature-text">Revisa si tu pequeño tuvo algún incidente menor o recomendación.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🥗</span>
            <p className="feature-text">Consulta su registro de comidas del día.</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">💤</span>
            <p className="feature-text">Revisa cómo durmió durante la siesta.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default IndexTutor;
