import React from "react";
import { motion } from "framer-motion";
import "./Index.css";

const Index = () => {
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
            Hola, <span>Cuidador</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Administra y supervisa el bienestar de los pequeños de forma sencilla,
            visual y siempre accesible. 
          </motion.p>

          
        </div>
      </section>

      {/* PROJECT INFO */}
      <section className="project-info section">
        <div className="container">
          <h2 className="section-title">Sobre Guardian Angel</h2>

          <div className="info-grid">
            {[
              { icon: "🎯", title: "Misión", text: "Brindar seguridad y tranquilidad a padres y cuidadores mediante herramientas claras y confiables." },
              { icon: "🌟", title: "Visión", text: "Ser la plataforma líder en monitoreo infantil y apoyo en guarderías." },
              { icon: "💛", title: "Valores", text: "Confianza, empatía, seguridad y amor por la infancia." },
              { icon: "👶", title: "Cómo funciona", text: "Monitoreo de salud, hábitos, alertas inteligentes y registros diarios." },
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
          <h2 className="section-title light">Beneficios Clave</h2>

          <div className="benefit-grid">
            {[
              { icon: "📡", title: "Monitoreo tiempo real", text: "Consulta ritmo cardíaco, temperatura y más." },
              { icon: "🔔", title: "Alertas inteligentes", text: "Recibe notificaciones cuando un niño lo necesite." },
              { icon: "📘", title: "Historial completo", text: "Visualiza cada detalle del día del pequeño." },
              { icon: "✨", title: "Interfaz intuitiva", text: "Diseñada especialmente para cuidadores." },
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
      <section class="alertas-section">
        <h2 class="section-title">Alertas y Recomendaciones</h2>

        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🌡️</span>
            <p class="feature-text">Revisa la temperatura de todos los niños.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon">🧸</span>
            <p class="feature-text">Mantén el área de juegos limpia y sin objetos peligrosos.</p>
          </div>

          <div class="feature-card">
            <span class="feature-icon">🥛</span>
            <p class="feature-text">Actualiza el registro de alimentación después de cada comida.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
