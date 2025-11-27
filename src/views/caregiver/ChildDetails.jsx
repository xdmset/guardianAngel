import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUtensils, FaGamepad } from 'react-icons/fa';
import { FaHeartPulse, FaTemperatureThreeQuarters } from 'react-icons/fa6';
import styles from './ChildDetails.module.css';
import api from '../../config/apiConfig';

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
    const interval = setInterval(fetchReadings, 3000);
    return () => clearInterval(interval);
  }, [child]);

  if (loading) return <h2>Cargando datos...</h2>;

  return (
    <div className={styles.container}>
      <Link to="/cuidador/dashboard" className={styles.backButton}>⬅ Volver</Link>

      <header className={styles.header}>
        <div className={styles.childInfo}>
          <div className={styles.avatar}>
            <img 
              src={`https://ui-avatars.com/api/?name=${child.first_name}&background=FFD1DC&color=555`} 
              alt={child.first_name} 
            />
          </div>

          <div>
            <h1 className={styles.childName}>{child.first_name} {child.last_name}</h1>
            <p>¡Bienvenido a su día en la guardería!</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={() => setShowAddNoteModal(true)}>
            <FaPlus />
          </button>
          <button className={styles.actionButton}><FaCalendarAlt /></button>
        </div>
      </header>

      <main className={styles.mainGrid}>
        
        <div className={styles.mainLeft}>
          
          <NotesSection 
            notes={notes}
            setShowNotesModal={setShowNotesModal}
          />

          {/* Seccion donde se muestran los estados de salud, temperatura, heart rate */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Estado de Salud</h2>

            <div className={styles.healthGrid}>
              <div className={styles.healthCard}>
                <h3>Ritmo Cardíaco</h3>
                <p className={styles.healthReading}>
                  <FaHeartPulse className={styles.icon} />
                  {heartRate ? `${heartRate} LPM` : '—'}
                </p>
              </div>

              <div className={`${styles.healthCard}`}>
                <h3>Temperatura</h3>
                <p className={styles.healthReading}>
                  <FaTemperatureThreeQuarters className={styles.icon} />
                  {temperature ? `${temperature.toFixed(1)}°C` : '—'}
                </p>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Actividades</h2>
            <ul className={styles.list}>
              <li><FaGamepad /> Juegos de construcción – 30 min</li>
              <li><FaGamepad /> Pintura y creatividad – 20 min</li>
              <li><FaGamepad /> Canciones y movimiento – 15 min</li>
            </ul>
          </section>

        </div>

        <aside className={styles.tutorColumn}>
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

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>🍽 Alimentación</h2>
            <ul className={styles.list}>
              <li><FaUtensils /> Desayuno: Fruta y cereal</li>
              <li><FaUtensils /> Almuerzo: Sopa y arroz</li>
              <li><FaUtensils /> Merienda: Yogur</li>
            </ul>
          </section>
        </aside>

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
