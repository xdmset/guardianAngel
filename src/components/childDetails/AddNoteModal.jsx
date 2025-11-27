import React from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";


const AddNoteModal = ({
  show,
  setShow,
  newNote,
  setNewNote,
  handleAddNote
}) => {

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        
        <button className={styles.closeX} onClick={() => setShow(false)}>
          ✖
        </button>

        <h2>Agregar nueva nota</h2>

        <form onSubmit={handleAddNote} className={styles.form}>
          <label>Título</label>
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            required
          />

          <label>Contenido</label>
          <textarea
            rows="4"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            required
          />

          <label>Prioridad</label>
          <select
            value={newNote.priority}
            onChange={(e) => setNewNote({ ...newNote, priority: e.target.value })}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>

          <button type="submit" className={styles.closeButton}>
            Guardar Nota
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
