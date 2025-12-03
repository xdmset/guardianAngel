import React, { useEffect, useState } from "react";
import styles from "../../views/caregiver/ChildDetails.module.css";
import api from "../../config/apiConfig";

const MedicinesSection = ({ childId }) => {
  const [medNotes, setMedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del popup
  const [showAddPopup, setShowAddPopup] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    title: "",
    dosis: "",
    horario: "",
    notasEspeciales: "",
    priority: "high",
  });

  // -----------------------------
  // Cargar medicamentos
  // -----------------------------
  const loadMedicines = async () => {
    try {
      const res = await fetch(`${api.baseUrl}children/${childId}/notes`);
      if (!res.ok) throw new Error("Error loading meds");
      const data = await res.json();

      const meds = data.filter((n) => n.priority === "high");
      meds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setMedNotes(meds);
      setLoading(false);
    } catch (error) {
      console.error("Error loading meds:", error);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, [childId]);

  // -----------------------------
  // Construir content
  // -----------------------------
  const buildContent = ({ title, dosis, horario, notasEspeciales }) => {
    let content = `Dar ${dosis} de ${title} a las ${horario}`;
    if (notasEspeciales.trim() !== "") content += `. Nota: ${notasEspeciales}`;
    return content;
  };

  // -----------------------------
  // Guardar nuevo medicamento
  // -----------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    const content = buildContent(formData);

    try {
      const res = await fetch(`${api.baseUrl}children/${childId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          content,
          id_author: 15, // reemplazar por usuario loggeado
        }),
      });

      if (!res.ok) throw new Error("POST failed");

      await loadMedicines();
      setShowAddPopup(false);
      setFormData({ title: "", dosis: "", horario: "", notasEspeciales: "", priority: "high" });
    } catch (err) {
      console.error("Error adding med:", err);
    }
  };

  // -----------------------------
  // Eliminar medicamento
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este medicamento?")) return;
    try {
      const res = await fetch(`${api.baseUrl}notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE failed");
      await loadMedicines();
    } catch (err) {
      console.error("Error deleting med:", err);
    }
  };

  return (
    <section className={`${styles.card}`} style={{ position: "relative" }}>
      <div className={styles.medicinesCard}>
        <div className={styles.medicinesHeader}>
          <h3>Medicamentos</h3>
          <button className={styles.addMedicineButton} onClick={() => setShowAddPopup(true)}>
            + Agregar
          </button>
        </div>

        {/* Lista de medicamentos */}
        <div className={styles.medicinesList}>
          {loading ? (
            <p>Cargando medicamentos...</p>
          ) : medNotes.length === 0 ? (
            <p className={styles.emptyText}>No hay medicamentos registrados.</p>
          ) : (
            medNotes.map((med) => (
              <div key={med.id_note} className={styles.medicineItem}>
                <h4>{med.title}</h4>
                <p>{med.content}</p>
                <span className={styles.date}>
                  {new Date(med.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={styles.actionsRow}>
                  <button className={styles.deleteButton} onClick={() => handleDelete(med.id_note)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Popup encima del div */}
        {showAddPopup && (
          <div className={styles.addPopupOverlay} onClick={() => setShowAddPopup(false)}>
            <div className={styles.addPopup} onClick={(e) => e.stopPropagation()}>
              <h3>Agregar Medicamento</h3>
              <form onSubmit={handleSave} className={styles.form}>
                <input
                  type="text"
                  placeholder="Nombre del medicamento"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosis (ej. 2g)"
                  value={formData.dosis}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                  required
                />
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Notas especiales (opcional)"
                  value={formData.notasEspeciales}
                  onChange={(e) =>
                    setFormData({ ...formData, notasEspeciales: e.target.value })
                  }
                />
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.saveButton}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowAddPopup(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MedicinesSection;
