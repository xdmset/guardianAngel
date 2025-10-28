import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import kidIcon from '../../assets/header/kiddo.png';


import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Marca */}
        <NavLink to="/cuidador/index" className={styles.brand}>
          Guardian Angel
        </NavLink>

        {/* Botón hamburguesa para móvil */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
          <NavLink
            to="/cuidador/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <img src={kidIcon} alt="Logo de Kid" className={styles.kiddo} /> Mis Niños
          </NavLink>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
