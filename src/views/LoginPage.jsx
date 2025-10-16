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
          <h1 className={styles.loginTitle}>Login</h1> 
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;