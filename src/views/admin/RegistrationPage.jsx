import React, { useState, useEffect } from 'react';
import { UserPlus, AlertCircle, CheckCircle, Eye, EyeOff, Building2, RefreshCw, Copy, Phone } from 'lucide-react'; // Agregué el icono Phone
import './RegistrationPage.css'

const RegistrationPage = () => {
    const [daycares, setDaycares] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const generatePassword = () => {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };

    // 1. Agregado el campo phone al estado inicial
    const [formData, setFormData] = useState({
        username: '',
        password: generatePassword(),
        first_name: '',
        last_name: '',
        email: '',
        phone: '', 
        role: 'tutor',
        id_daycare: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchDaycares();
    }, []);

    const fetchDaycares = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/daycares/`);
            if (!response.ok) throw new Error('Error al cargar las guarderías');
            const data = await response.json();
            setDaycares(data);
        } catch (err) {
            console.error('Error al cargar guarderías:', err);
        }
    };

    const handleRegeneratePassword = () => {
        const newPassword = generatePassword();
        setFormData(prev => ({
            ...prev,
            password: newPassword
        }));
        setCopySuccess(false);
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(formData.password);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.length < 3) {
            errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!formData.first_name.trim()) {
            errors.first_name = 'El nombre es requerido';
        }

        if (!formData.last_name.trim()) {
            errors.last_name = 'El apellido es requerido';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'El correo electrónico no es válido';
        }

        // 2. Validación del teléfono agregada
        if (!formData.phone.trim()) {
            errors.phone = 'El teléfono es requerido';
        }

        if (!formData.id_daycare) {
            errors.id_daycare = 'Debe seleccionar una guardería';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                ...formData,
                id_daycare: parseInt(formData.id_daycare)
            };

            const response = await fetch(`${API_BASE_URL}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el usuario');
            }

            // const newUser = await response.json(); // Variable no usada
            setSuccess(`Usuario registrado exitosamente`);

            setFormData({
                username: '',
                password: generatePassword(),
                first_name: '',
                last_name: '',
                email: '',
                phone: '', // Reiniciar teléfono
                role: 'tutor',
                id_daycare: ''
            });

            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        const roles = {
            admin: 'Administrador',
            caregiver: 'Cuidador',
            tutor: 'Tutor'
        };
        return roles[role] || role;
    };

    return (
        <div className="registration-container">
            <div className="registration-content">
                <div className="registration-card">
                    <div className="card-header">
                        <UserPlus className="header-icon" size={48} strokeWidth={2} />
                        <h1>Registro de Usuario</h1>
                        <p>Complete el formulario para crear un nuevo usuario en AngelCare</p>
                    </div>

                    <div className="card-body">
                        {error && (
                            <div className="alert alert-error">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success">
                                <CheckCircle size={20} />
                                {success}
                            </div>
                        )}

                        {/* Fila 1: Nombre y Apellido */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Nombre <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${formErrors.first_name ? 'error' : ''}`}
                                    placeholder="Juan"
                                />
                                {formErrors.first_name && (
                                    <div className="error-message">
                                        {formErrors.first_name}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Apellido <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${formErrors.last_name ? 'error' : ''}`}
                                    placeholder="Pérez"
                                />
                                {formErrors.last_name && (
                                    <div className="error-message">
                                        {formErrors.last_name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fila 2: Usuario y Email */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Nombre de Usuario <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`form-input ${formErrors.username ? 'error' : ''}`}
                                    placeholder="j.perez"
                                />
                                {formErrors.username && (
                                    <div className="error-message">
                                        {formErrors.username}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Correo Electrónico <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                                    placeholder="juan.perez@example.com"
                                />
                                {formErrors.email && (
                                    <div className="error-message">
                                        {formErrors.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fila 3: Teléfono y Guardería (NUEVO) */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">
                                    Teléfono <span className="required">*</span>
                                </label>
                                <div className="input-with-icon-wrapper" style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`form-input ${formErrors.phone ? 'error' : ''}`}
                                        style={{ paddingLeft: '35px' }}
                                        placeholder="664-123-4567"
                                    />
                                </div>
                                {formErrors.phone && (
                                    <div className="error-message">
                                        {formErrors.phone}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Guardería <span className="required">*</span>
                                </label>
                                <div className="daycare-select-wrapper">
                                    <Building2 size={20} className="daycare-icon" />
                                    <select
                                        name="id_daycare"
                                        value={formData.id_daycare}
                                        onChange={handleInputChange}
                                        className={`form-select with-icon ${formErrors.id_daycare ? 'error' : ''}`}
                                    >
                                        <option value="">-- Seleccionar Guardería --</option>
                                        {daycares.map(daycare => (
                                            <option key={daycare.id_daycare} value={daycare.id_daycare}>
                                                {daycare.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {formErrors.id_daycare && (
                                    <div className="error-message">
                                        {formErrors.id_daycare}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sección Contraseña */}
                        <div className="form-group">
                            <label className="form-label">
                                Contraseña Generada <span className="required">*</span>
                            </label>
                            <div className="password-display">
                                {showPassword ? (
                                    <span className="password-text">{formData.password}</span>
                                ) : (
                                    <span className="password-text">{'•'.repeat(12)}</span>
                                )}
                            </div>
                            <div className="password-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="btn-icon"
                                >
                                    {showPassword ? (
                                        <>
                                            <EyeOff size={18} />
                                            Ocultar
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={18} />
                                            Mostrar
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCopyPassword}
                                    className={`btn-icon ${copySuccess ? 'copied' : ''}`}
                                >
                                    <Copy size={18} />
                                    {copySuccess ? 'Copiado' : 'Copiar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRegeneratePassword}
                                    className="btn-icon"
                                >
                                    <RefreshCw size={18} />
                                    Regenerar
                                </button>
                            </div>
                            <div className="helper-text">
                                Guarde esta contraseña en un lugar seguro. El usuario deberá usarla para iniciar sesión.
                            </div>
                        </div>

                        {/* Sección Rol */}
                        <div className="form-group">
                            <label className="form-label">
                                Rol <span className="required">*</span>
                            </label>
                            <div className="role-selector">
                                <div className="role-option">
                                    <input
                                        type="radio"
                                        id="role-admin"
                                        name="role"
                                        value="admin"
                                        checked={formData.role === 'admin'}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="role-admin" className="role-label">
                                        {getRoleLabel('admin')}
                                    </label>
                                </div>
                                <div className="role-option">
                                    <input
                                        type="radio"
                                        id="role-caregiver"
                                        name="role"
                                        value="caregiver"
                                        checked={formData.role === 'caregiver'}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="role-caregiver" className="role-label">
                                        {getRoleLabel('caregiver')}
                                    </label>
                                </div>
                                <div className="role-option">
                                    <input
                                        type="radio"
                                        id="role-tutor"
                                        name="role"
                                        value="tutor"
                                        checked={formData.role === 'tutor'}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="role-tutor" className="role-label">
                                        {getRoleLabel('tutor')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Registrar Usuario
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;