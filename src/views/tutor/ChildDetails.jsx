import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUtensils, FaGamepad } from 'react-icons/fa';
import { FaHeartPulse, FaTemperatureThreeQuarters } from 'react-icons/fa6';
import styles from '../caregiver/ChildDetails.module.css';
import api from '../../config/apiConfig';
import { IoWater } from "react-icons/io5";

// Componentes separados
import NotesSection from '../../components/childDetails/NotesSection';
import NotesModal from '../../components/childDetails/NotesModal';
import AddNoteModal from '../../components/childDetails/AddNoteModal';
import EditNoteModal from '../../components/childDetails/EditNoteModal';

const ChildDetails = () => {
  // Estados y variables
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  // Datos de salud
  const [heartRate, setHeartRate] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [oxygenation, setOxygenation] = useState(null);
  // Animaciones
  const [pulse, setPulse] = useState(false);
  const [flashTemp, setFlashTemp] = useState(false);
  const [oxygenAnim, setOxygenAnim] = useState(false);

  // Notas
  const [notes, setNotes] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  // Edición de notas
  const [editingNote, setEditingNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Nueva nota
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    priority: "medium",
  });

  // Funciones para manejar notas (se usa para actualizar cuando se edita, postea, o elimina, etc)
  const loadNotes = async () => {
    try {
      const res = await fetch(`${api.baseUrl}children/${id}/notes`);
      const data = await res.json();
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotes(data);
    } catch (err) {
      console.error("Error loading notes:", err);
    }
  };
  useEffect(() => { loadNotes(); }, [id]);

  // Agregar nota
  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${api.baseUrl}children/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newNote,
          id_author: 15,
        }),
      });

      const saved = await res.json();
      setNotes(prev => [saved, ...prev]);
      setShowAddNoteModal(false);
      loadNotes();
      setNewNote({ title: "", content: "", priority: "medium" });

    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Eliminar nota
  const handleDeleteNote = async (idNote) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota?")) return;

    try {
      await fetch(`${api.baseUrl}notes/${idNote}`, { method: "DELETE" });
      loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Editar nota
  const handleEditNote = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${api.baseUrl}notes/${editingNote.id_note}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNote),
      });

      loadNotes();
      setShowEditModal(false);
      setEditingNote(null);

    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  // Cargar datos del niño
  useEffect(() => {
    const loadChild = async () => {
      const res = await fetch(`${api.baseUrl}${api.ep.children}${id}`);
      const data = await res.json();
      setChild(data);
      setLoading(false);
    };
    loadChild();
  }, [id]);

  // Cargar datos del tutor
  useEffect(() => {
    const loadTutor = async () => {
      const res = await fetch(`${api.baseUrl}${api.ep.children}${id}/tutor`);
      setTutor(await res.json());
    };
    loadTutor();
  }, [id]);

  // Cargar datos de salud en tiempo real (con intervalos de 3 sec)
  useEffect(() => {
    if (!child?.id_smartwatch) return;

    const fetchReadings = async () => {
      try {
        const res = await fetch(`${api.baseUrl}readings/smartwatch/${child.id_smartwatch}/latest`);
        const data = await res.json();

        setHeartRate(data.heart_rate?.beats_per_minute || 0);
        setTemperature(parseFloat(data.temperature?.temperature || 0));
        setOxygenation(parseFloat(data.oxygenation?.spo2_level || 0));

        setPulse(true);
        setFlashTemp(true);
        setOxygenAnim(true);

        setTimeout(() => setPulse(false), 400);
        setTimeout(() => setFlashTemp(false), 500);
        setTimeout(() => setOxygenAnim(false), 700);
      } catch (err) {
        console.log('Error fetching readings:', err);
      }
    };
    fetchReadings();
    const interval = setInterval(fetchReadings, 1000);
    return () => clearInterval(interval);
  }, [child]);

  if (loading) return <h2 className={styles.loading}>Cargando datos...</h2>;

  return (
    <div className={styles.container}>
      <header className={styles.header} role="banner" aria-label="Encabezado del niño">
        <div className={styles.childInfo}>
          <div className={styles.avatar}>
            <img 
              src={`https://ui-avatars.com/api/?name=${child.first_name}&background=FEE9D6&color=5A6B8A`} 
              alt={`${child.first_name} avatar`} 
            />
          </div>

          <div className={styles.nameBlock}>
            <h1 className={styles.childName}>{child.first_name} {child.last_name}</h1>
            <p className={styles.welcome}>¡Bienvenido a su día en la guardería!</p>
          </div>
        </div>

        <div className={styles.actions}>

          {/* <button
            className={styles.actionButton}
            aria-label="Calendario"
            title="Ver calendario"
          >
            <FaCalendarAlt />
          </button> */}
        </div>
      </header>

      <main className={styles.mainGrid}>

        {/* ------------- ROW 1 : NOTAS + TUTOR ------------- */}
        <div className={styles["row-notes-tutor"]}>
          <div className={styles.colLeft}>
            <NotesSection 
              notes={notes}
              setShowNotesModal={setShowNotesModal}
            />
          </div>

          <div className={styles.colRight}>
            <section className={`${styles.card} ${styles.tutorCard}`}>
              <h2 className={styles.sectionTitle}>Tutor</h2>
              {tutor ? (
                <>
                  <p><strong>Nombre:</strong> {tutor.first_name} {tutor.last_name}</p>
                  <p><strong>Correo:</strong> {tutor.email}</p>
                </>
              ) : (
                <p>No hay tutor registrado.</p>
              )}
            </section>
          </div>
        </div>

        {/* ------------- ROW 2 : ESTADO DE SALUD (solo) ------------- */}
        <div className={styles["row-health"]}>
          <section className={`${styles.card} ${styles.healthSection}`}>
            <h2 className={styles.sectionTitle}>Estado de Salud</h2>

            <div className={styles.healthGrid}>
              <div className={styles.healthCard}>
                <div className={styles.healthTitle}>
                  <FaHeartPulse className={`${styles.icon} ${pulse ? styles.pulseAnim : ''}`}/>
                  <span>Ritmo Cardíaco</span>
                </div>
                <p className={styles.healthReading}>
                  {heartRate ? `${heartRate} LPM` : '—'}
                </p>
              </div>

              <div className={styles.healthCard}>
                <div className={styles.healthTitle}>
                  <FaTemperatureThreeQuarters className={styles.icon}/>
                  <span>Temperatura</span>
                </div>
                <p className={styles.healthReading}>
                  {temperature ? `${temperature.toFixed(1)}°C` : '—'}
                </p>
              </div>

              <div className={styles.healthCard}>
                <div className={styles.healthTitle}>
                  <IoWater className={styles.icon}/>
                  <span>Oxigenación</span>
                </div>
                <p className={styles.healthReading}>
                  {oxygenation ? `${oxygenation}%` : '—'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ------------- ROW 3 : ACTIVIDADES + ALIMENTACIÓN ------------- */}
        <div className={styles.row}>

          <div className={styles.colLeft}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Actividades</h2>
              <ul className={styles.list}>
                <li><FaGamepad /> Juegos de construcción – 30 min</li>
                <li><FaGamepad /> Pintura – 20 min</li>
                <li><FaGamepad /> Canciones – 15 min</li>
              </ul>
            </section>
          </div>

          <div className={styles.colRight}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>🍽 Alimentación</h2>
              <ul className={styles.list}>
                <li><FaUtensils /> Desayuno: Fruta</li>
                <li><FaUtensils /> Almuerzo: Sopa</li>
                <li><FaUtensils /> Merienda: Yogur</li>
              </ul>
            </section>
          </div>

        </div>

      </main>


      {/* --------------------- MODALES --------------------- */}
      <NotesModal
        show={showNotesModal}
        setShow={setShowNotesModal}
        notes={notes}
        openEdit={setShowEditModal}
        setEditingNote={setEditingNote}
        handleDelete={handleDeleteNote}
      />

      <AddNoteModal
        show={showAddNoteModal}
        setShow={setShowAddNoteModal}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
        refreshNotes={loadNotes}
      />

      <EditNoteModal
        show={showEditModal}
        setShow={setShowEditModal}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        handleEditNote={handleEditNote}
      />

    </div>
  );
};

export default ChildDetails;
