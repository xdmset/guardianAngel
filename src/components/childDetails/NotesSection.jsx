import React from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";


const NotesSection = ({ notes, setShowNotesModal }) => {
  return (
    <section className={`${styles.card} ${styles.notesCard}`}>
      <h2 className={styles.sectionTitle}>Notas</h2>

      {notes.length > 0 ? (
        <div onClick={() => setShowNotesModal(true)} style={{ cursor: "pointer" }}>
          <h3>{notes[0].title}</h3>
          <p>{notes[0].content}</p>
          <small>
            {notes[0].author_first_name} {notes[0].author_last_name} · {notes[0].created_at}
          </small>
        </div>
      ) : (
        <p>No hay notas registradas.</p>
      )}
    </section>
  );
};

export default NotesSection;
