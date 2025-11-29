import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';
import logoutIcon from '../../assets/img/logout.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ------------ 

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        
        <NavLink
          to={
            user?.role === "tutor"
              ? "/tutor/index"
              : user?.role === "caregiver"
                ? "/cuidador/index"
                : "/login"
          }
          className={styles.brand}
          onClick={closeMenu}
        >
          Guardian Angel
        </NavLink>

        <button className={styles.menuToggle} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
          
          {/* Caregiver */}
          {user?.role === "caregiver" && (
             <>
              <NavLink
                to="/cuidador/dashboard"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Mis Niños
              </NavLink>

              <NavLink
                to="/cuidador/todos"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Todos los Niños
              </NavLink>
            </>
          )}

          {/* Tutor */}
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
            <img src={logoutIcon} alt="Cerrar sesión" className={styles.logoutIcon} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
