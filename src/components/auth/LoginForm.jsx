import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './LoginForm.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginForm = () => {
  // const [username, setUsername] = useState('admin');
  // const [password, setPassword] = useState('admin123');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordInputContainer}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.togglePasswordVisibility}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className={styles.options}>
        <label className={styles.rememberMe}>
          <input type="checkbox" />
          Remember me
        </label>
        <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm;