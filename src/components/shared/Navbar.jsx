import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import styles from './Navbar.module.css';
import logoutIcon from '../../assets/img/logout.png';
import logo from '../../assets/logomercy.png'; // <--- Tu logo importado
import { FaBars, FaTimes, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    navigate('/cuidador/alertas');
    closeMenu();
  };

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
      
<img 
  src={logo} 
  alt="Guardian Angel" 
 
  style={{ height: '50px', width: 'auto' }} 
/>
          <span>Guardian Angel</span>
        </NavLink>

        {/* BOTÓN DE MENÚ (MÓVIL) */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* ENLACES DE NAVEGACIÓN */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ''}`}>
          
          {/* Menú Cuidador */}
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

              {/* Campanita de Notificaciones */}
              <button 
                onClick={handleNotificationClick}
                className={styles.notificationButton}
                title="Ver alertas"
              >
                <FaBell className={unreadCount > 0 ? styles.bellIconAlert : styles.bellIcon} />
                {unreadCount > 0 && (
                  <span className={styles.notificationBadge}>{unreadCount}</span>
                )}
              </button>
            </>
          )}

          {/* Menú Tutor */}
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

          {/* Botón Salir */}
          <button onClick={handleLogout} className={styles.logoutButton} title="Cerrar sesión">
            <img src={logoutIcon} alt="Logout" className={styles.logoutIcon} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;