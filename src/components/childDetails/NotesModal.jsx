import React from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";


const NotesModal = ({
  show,
  setShow,
  notes,
  openEdit,
  setEditingNote,
  handleDelete
}) => {

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        
        <button className={styles.closeX} onClick={() => setShow(false)}>
          ✖
        </button>

        <h2>Notas del niño</h2>

        {notes.map(note => (
          <div key={note.id_note} className={styles.noteItem}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>
              {note.author_first_name} {note.author_last_name} · {note.created_at}
            </small>

            <div className={styles.noteActions}>
              <button
                className={styles.editButton}
                onClick={() => {
                  setEditingNote(note);
                  openEdit(true);
                }}
              >
                ✏️
              </button>

              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(note.id_note)}
              >
                🗑️
              </button>
            </div>

            <hr />
          </div>
        ))}

      </div>
    </div>
  );
};

export default NotesModal;
