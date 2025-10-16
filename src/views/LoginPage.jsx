import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import styles from './LoginPage.module.css';
import logo from '../assets/logomercy.png'; 

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
    
          <img src={logo} alt="Logo de GuardianAngel" className={styles.logo} />
        </div>
        <LoginForm />
        <div className={styles.credentials}>
          <p>Admin: admin@guardianangel.com / admin</p>
          <p>Cuidador: cuidador@guardianangel.com / cuidador</p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;