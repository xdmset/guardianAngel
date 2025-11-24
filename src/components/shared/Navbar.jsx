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
  const closeMenu = () => setMenuOpen(false);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Marca */}
       <NavLink
        to={
          user?.role === "tutor"
            ? "/tutor/index"
            : user?.role === "caregiver"
              ? "/cuidador/index"
              : "/login" // fallback por si acaso
        }
        className={styles.brand}
        onClick={closeMenu}
      >
        Guardian Angel
      </NavLink>



        {/* Botón hamburguesa para responsivenes del movil */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
          {/* Checa si el usuario es caregiver para mostrar esta opcion */}
          {user?.role === "caregiver" && (
            <NavLink
              to="/cuidador/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <img src={kidIcon} alt="Logo de Kid" className={styles.kiddo} /> Mis Niños
            </NavLink>
          )}

          {/* checar si el user es tutor ---NO MANDA A NINGUN LADO AUN */}
          {user?.role === "tutor" && (
            <NavLink
              to="/tutor/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Mi Niño
            </NavLink>

          )}


          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
