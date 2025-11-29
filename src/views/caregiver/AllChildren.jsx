import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookMedical } from "react-icons/fa";
import styles from "./CaregiverDashboard.module.css"; 
import { useAuth } from "../../hooks/useAuth";
import api from "../../config/apiConfig";

const AllChildren = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllChildren = async () => {
      try {
        setLoading(true);
        console.log(`${api.baseUrl}children`)
        const response = await fetch(`${api.baseUrl}children`, {
        });

        if (!response.ok) {
          throw new Error("Error cargando la lista de niños");
        }

        const data = await response.json();
        console.log("RESPONSE ALL CHILDREN:", data);
        setChildren(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChildren();
  }, []);

  if (loading) return <p className={styles.pageTitle}>Cargando los niños...</p>;
  if (error) return <p className={styles.pageTitle}>{error}</p>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Todos los Niños Registrados</h1>
      <p className={styles.pageSubtitle}>
        Aquí puedes ver la lista completa de niños registrados en el sistema.
      </p>

      <div className={styles.grid}>
        {children.map((child) => (
          <div key={child.id_child} className={styles.card}>
            <img
              src={`https://i.pravatar.cc/300?u=${child.child_first_name}`}
              alt={child.child_first_name}
              className={styles.cardImage}
            />

            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>
                {child.child_first_name} {child.child_last_name}
              </h3>

              <Link to={`/niño/${child.id_child}`} className={styles.cardButton}>
                <FaBookMedical style={{ marginRight: "8px" }} />
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllChildren;
