import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import styles from './AmbientMonitor.module.css';

const AmbientMonitor = () => {
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef(null);
  
  // Asegúrate de que este archivo exista en tu carpeta public
  const audioUrl = "/kidsplayground.mp3";

  const startSimulation = () => {
    // Sin delay de conexión para que se sienta más rápido en el header
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Error audio:", e));
    }
    setIsListening(true);
  };

  const stopSimulation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className={styles.miniContainer}>
      <audio ref={audioRef} src={audioUrl} />

      {/* Visualizador de ondas (Solo visible si está escuchando) */}
      <div className={styles.visualizerArea}>
        {isListening && (
          <div className={styles.bars}>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={styles.miniBar} 
                style={{ animationDelay: `${Math.random() * 0.5}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Botón Minimalista */}
      <button 
        className={`${styles.miniButton} ${isListening ? styles.active : ''}`} 
        onClick={toggleListening}
        title={isListening ? "Detener escucha" : "Escuchar ambiente"}
      >
        {isListening ? <FaStop /> : <FaMicrophone />}
      </button>
    </div>
  );
};

export default AmbientMonitor;