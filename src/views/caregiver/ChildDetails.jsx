import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import styles from './ChildDetails.module.css';
import api from '../../config/apiConfig';

// Importamos el Monitor de Audio
import AmbientMonitor from '../../components/childDetails/AmbientMonitor';

// Componentes separados
import NotesSection from '../../components/childDetails/NotesSection';
import NotesModal from '../../components/childDetails/NotesModal';
import AddNoteModal from '../../components/childDetails/AddNoteModal';
import EditNoteModal from '../../components/childDetails/EditNoteModal';
import HealthSection from '../../components/childDetails/HealthSection';
import SuggestionsSection from '../../components/childDetails/SuggestionsSection';
import Horario from '../../components/childDetails/Horario';
import MedicinesSection from '../../components/childDetails/MedicinesSection';

const ChildDetails = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Datos de salud
  const [heartRate, setHeartRate] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [oxygenation, setOxygenation] = useState(null);
  const [pulse, setPulse] = useState(false);
  
  // Notas
  const [notes, setNotes] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    priority: "medium",
  });

  // Cargar notas
  const loadNotes = async () => {
    try {
      const res = await fetch(`${api.baseUrl}children/${id}/notes`);
      const data = await res.json();
      const filtered = data.filter(n => n.priority === "low" || n.priority === "medium");
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotes(filtered);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { loadNotes(); }, [id]);

  // CRUD Notas
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${api.baseUrl}children/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newNote, id_author: 15 }),
      });
      setShowAddNoteModal(false);
      loadNotes();
      setNewNote({ title: "", content: "", priority: "medium" });
    } catch (error) { console.error(error); }
  };

  const handleDeleteNote = async (idNote) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota?")) return;
    try { await fetch(`${api.baseUrl}notes/${idNote}`, { method: "DELETE" }); loadNotes(); } catch (error) { console.error(error); }
  };

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
    } catch (error) { console.error(error); }
  };

  // Cargar Niño
  useEffect(() => {
    const loadChild = async () => {
      const res = await fetch(`${api.baseUrl}${api.ep.children}${id}`);
      const data = await res.json();
      setChild(data);
      setLoading(false);
    };
    loadChild();
  }, [id]);

  // Cargar Tutor
  useEffect(() => {
    const loadTutor = async () => {
      const res = await fetch(`${api.baseUrl}${api.ep.children}${id}/tutor`);
      setTutor(await res.json());
    };
    loadTutor();
  }, [id]);

  // Salud Real-time
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
        setTimeout(() => setPulse(false), 400);
      } catch (err) { console.log('Error readings:', err); }
    };
    fetchReadings();
    const interval = setInterval(fetchReadings, 3000);
    return () => clearInterval(interval);
  }, [child]);

  if (loading) return <h2 className={styles.loading}>Cargando datos...</h2>;

  return (
    <div className={styles.container}>
      
      {/* --- HEADER CON AUDIO INTEGRADO --- */}
      <header className={styles.header}>
        
        {/* IZQUIERDA: Avatar y Nombre */}
        <div className={styles.childInfo}>
          <div className={styles.avatar}>
            <img 
              // Usamos la imagen de la BD, o un avatar por defecto si es null
              src={child.profile_image || `https://ui-avatars.com/api/?name=${child.first_name}&background=FEE9D6&color=5A6B8A`} 
              alt={`${child.first_name} avatar`} 
            />
          </div>
          <div className={styles.nameBlock}>
            <h1 className={styles.childName}>{child.first_name} {child.last_name}</h1>
            <p className={styles.welcome}>¡Bienvenido a su día en la guardería!</p>
          </div>
        </div>

        {/* CENTRO: MONITOR DE AUDIO AMBIENTAL */}
        <div className={styles.ambientPlayerContainer}>
           <AmbientMonitor />
        </div>

        {/* DERECHA: Botones de Acción */}
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => setShowAddNoteModal(true)}
            aria-label="Agregar nota"
            title="Agregar nota"
          >
            <FaPlus />
          </button>
        </div>
      </header>

      <main className={styles.mainGrid}>
        
        {/* FILA 1: NOTAS Y TUTOR */}
        <div className={styles["row-notes-tutor"]}>
          <div className={styles.colLeft}>
            <NotesSection notes={notes} setShowNotesModal={setShowNotesModal} />
          </div>
          
          <div className={styles.colRight}>
            <section className={`${styles.card} ${styles.tutorCard}`}>
              <h2 className={styles.sectionTitle}>Tutor</h2>
              
              {tutor ? (
                <div className={styles.tutorContainer}>
                  {/* Imagen del Tutor */}
                  
                  
                  {/* Datos del Tutor */}
                  <div className={styles.tutorInfo}>
                    <p className={styles.tutorName}>
                      {tutor.first_name} {tutor.last_name}
                    </p>
                    
                    <div className={styles.contactRow}>
                      <span className={styles.label}>Correo:</span>
                      <span className={styles.value}>{tutor.email}</span>
                    </div>

                    <div className={styles.contactRow}>
                      <span className={styles.label}>Teléfono:</span>
                      <span className={styles.value}>
                        {tutor.phone || "No registrado"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No hay tutor registrado.</p>
              )}
            </section>
          </div>
        </div>

        <HealthSection
          smartwatchId={child.id_smartwatch}
          heartRate={heartRate}
          temperature={temperature}
          oxygenation={oxygenation}
          pulse={pulse}
        />

        <div className={styles.row}>
          <div className={styles.colLeft}><MedicinesSection childId={child.id_child} /></div>
          <div className={styles.colRight}><SuggestionsSection smartwatchId={child.id_smartwatch} /></div>
        </div>

        <div className={styles.rowFull}><Horario childId={child.id_child} /></div>
      </main>

      {/* MODALES */}
      <NotesModal show={showNotesModal} setShow={setShowNotesModal} notes={notes} openEdit={setShowEditModal} setEditingNote={setEditingNote} handleDelete={handleDeleteNote} />
      <AddNoteModal show={showAddNoteModal} setShow={setShowAddNoteModal} newNote={newNote} setNewNote={setNewNote} handleAddNote={handleAddNote} refreshNotes={loadNotes} />
      <EditNoteModal show={showEditModal} setShow={setShowEditModal} editingNote={editingNote} setEditingNote={setEditingNote} handleEditNote={handleEditNote} />
    </div>
  );
};

export default ChildDetails;