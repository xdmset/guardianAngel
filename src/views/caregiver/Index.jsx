import React from "react";
import { motion } from "framer-motion";
import "./Index.css";

const Index = () => {
  return (
    <div className="index">

      {/* eljiro */}
      <section className="hero">
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
          Todo lo que necesitas saber sobre los niños bajo tu cuidado y sobre Guardian Angel.
        </motion.p>
      </section>


      {/* oroyect information*/}
      <section className="project-info">
        <h2>Sobre Guardian Angel</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Misión</h3>
            <p>
              Brindar seguridad y tranquilidad a los padres, permitiendo un seguimiento constante del bienestar
              de los niños a través de tecnología amigable e intuitiva.
            </p>
          </div>
          <div className="info-card">
            <h3>Visión</h3>
            <p>
              Ser la plataforma líder en monitoreo infantil, mejorando la calidad del cuidado en guarderías y hogares.
            </p>
          </div>
          <div className="info-card">
            <h3>Valores</h3>
            <p>
              Seguridad, confianza, transparencia y compromiso con el bienestar infantil.
            </p>
          </div>
          <div className="info-card">
            <h3>Cómo funciona</h3>
            <p>
              Los cuidadores pueden registrar y monitorear datos como ritmo cardíaco, temperatura, llantos y actividades,
              con alertas automáticas en situaciones de riesgo.
            </p>
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="benefits">
        <h2>Beneficios Clave para Cuidadores</h2>
        <div className="benefit-grid">
          {[
            {
              title: "Monitoreo en tiempo real",
              text: "Visualiza el ritmo cardíaco, temperatura y actividad de cada niño de manera inmediata.",
            },
            {
              title: "Alertas inteligentes",
              text: "Detecta caídas, llantos prolongados o signos anormales y recibe notificaciones automáticas.",
            },
            {
              title: "Historial completo",
              text: "Consulta evolución de cada niño a lo largo del tiempo y toma decisiones informadas.",
            },
            {
              title: "Interfaz intuitiva",
              text: "Pensada para cuidadores, fácil de usar en móviles y tablets mientras atiendes a los niños.",
            },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="benefit-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* alertas n stuff */}
      <section className="alerts-section">
        <h2>Alertas y Recomendaciones</h2>
        <div className="alerts-grid">
          <motion.div className="alert-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p>Recuerda revisar la temperatura de todos los niños antes de las 10 AM.</p>
          </motion.div>
          <motion.div className="alert-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <p>Mantén el área de juegos limpia y segura para prevenir accidentes.</p>
          </motion.div>
          <motion.div className="alert-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <p>Actualiza el registro de alimentación de cada niño al finalizar la merienda.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
