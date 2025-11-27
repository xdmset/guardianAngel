import React from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";


const EditNoteModal = ({
  show,
  setShow,
  editingNote,
  setEditingNote,
  handleEditNote
}) => {

  if (!show || !editingNote) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <button className={styles.closeX} onClick={() => setShow(false)}>
          ✖
        </button>

        <h2>Editar Nota</h2>

        <form onSubmit={handleEditNote} className={styles.form}>
          <label>Título</label>
          <input
            type="text"
            value={editingNote.title}
            onChange={(e) =>
              setEditingNote({ ...editingNote, title: e.target.value })
            }
            required
          />

          <label>Contenido</label>
          <textarea
            rows="4"
            value={editingNote.content}
            onChange={(e) =>
              setEditingNote({ ...editingNote, content: e.target.value })
            }
            required
          />

          <label>Prioridad</label>
          <select
            value={editingNote.priority}
            onChange={(e) =>
              setEditingNote({ ...editingNote, priority: e.target.value })
            }
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>

          <button type="submit" className={styles.closeButton}>
            Guardar cambios
          </button>
        </form>

      </div>
    </div>
  );
};

export default EditNoteModal;
