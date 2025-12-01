import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../config/apiConfig';

const API_URL = api.baseUrl;

const DAYS_OF_WEEK = [
    { value: 'Monday', label: 'Lunes' },
    { value: 'Tuesday', label: 'Martes' },
    { value: 'Wednesday', label: 'Miércoles' },
    { value: 'Thursday', label: 'Jueves' },
    { value: 'Friday', label: 'Viernes' },
    { value: 'Saturday', label: 'Sábado' },
    { value: 'Sunday', label: 'Domingo' }
];

const ScheduleManager = () => {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentActivity, setCurrentActivity] = useState({
        activity_name: '',
        day_of_week: 'Monday',
        description: '',
        start_time: '',
        end_time: ''
    });

    useEffect(() => {
        loadChildren();
    }, []);

    useEffect(() => {
        if (selectedChild) {
            loadSchedule(selectedChild.id_child);
        }
    }, [selectedChild]);

    const loadChildren = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}children`);
            if (!response.ok) throw new Error('Error al cargar niños');
            const data = await response.json();
            setChildren(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los datos.');
            console.error('Error loading children:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadSchedule = async (childId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}children/${childId}/schedule`);
            if (!response.ok) throw new Error('Error al cargar horario');
            const data = await response.json();
            setSchedules(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el horario.');
            console.error('Error loading schedule:', err);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setCurrentActivity({
            activity_name: '',
            day_of_week: 'Monday',
            description: '',
            start_time: '',
            end_time: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentActivity({
            activity_name: '',
            day_of_week: 'Monday',
            description: '',
            start_time: '',
            end_time: ''
        });
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentActivity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                activity_name: currentActivity.activity_name,
                day_of_week: currentActivity.day_of_week,
                description: currentActivity.description,
                start_time: currentActivity.start_time,
                end_time: currentActivity.end_time
            };

            const response = await fetch(`${API_URL}children/${selectedChild.id_child}/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar la actividad');
            }

            await loadSchedule(selectedChild.id_child);
            closeModal();
            alert('✅ Actividad agregada correctamente');
        } catch (err) {
            setError(err.message);
            console.error('Error al guardar:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (scheduleId) => {
        if (!window.confirm('¿Está seguro que desea eliminar esta actividad?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}schedules/${scheduleId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la actividad');
            }

            await loadSchedule(selectedChild.id_child);
            alert('✅ Actividad eliminada correctamente');
        } catch (err) {
            setError(err.message);
            console.error('Error al eliminar:', err);
            alert('❌ Error al eliminar la actividad');
        } finally {
            setLoading(false);
        }
    };

    const getDayLabel = (dayValue) => {
        const day = DAYS_OF_WEEK.find(d => d.value === dayValue);
        return day ? day.label : dayValue;
    };

    const groupSchedulesByDay = () => {
        const grouped = {};
        DAYS_OF_WEEK.forEach(day => {
            grouped[day.value] = schedules.filter(s => s.day_of_week === day.value);
        });
        return grouped;
    };

    if (loading && children.length === 0) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Cargando datos...</p>
                <style>{spinnerKeyframes}</style>
            </div>
        );
    }

    if (!selectedChild) {
        return (
            <div style={styles.container}>
                <style>{spinnerKeyframes}</style>

                {error && (
                    <div style={styles.errorBanner}>
                        <AlertCircle size={20} />
                        <span>{error}</span>
                        <button style={styles.closeError} onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <div style={styles.header}>
                    <div style={styles.titleSection}>
                        <div>
                            <h1 style={styles.title}>Gestión de Horarios</h1>
                            <p style={styles.subtitle}>Selecciona un niño para ver y administrar su horario semanal</p>
                        </div>
                    </div>
                </div>

                <div style={styles.childrenGrid}>
                    {children.map((child) => (
                        <div
                            key={child.id_child}
                            style={styles.childCard}
                            onClick={() => setSelectedChild(child)}
                        >
                            {/* <div style={styles.cardAvatar}>
                                {child.child_first_name[0]}{child.child_last_name[0]}
                            </div> */}
                            <div style={styles.cardContent}>
                                <h3 style={styles.cardName}>
                                    {child.child_first_name} {child.child_last_name}
                                </h3>
                                <p style={styles.cardInfo}>
                                    <Calendar size={14} />
                                    {new Date(child.birth_date).toLocaleDateString('es-MX')}
                                </p>
                                <p style={styles.cardInfo}>{child.daycare_name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {children.length === 0 && (
                    <div style={styles.emptyState}>
                        <Calendar size={64} color="var(--muted-text)" />
                        <p style={styles.emptyText}>No hay niños registrados</p>
                    </div>
                )}
            </div>
        );
    }

    const groupedSchedules = groupSchedulesByDay();

    return (
        <div style={styles.container}>
            <style>{spinnerKeyframes}</style>

            {error && (
                <div style={styles.errorBanner}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button style={styles.closeError} onClick={() => setError(null)}>×</button>
                </div>
            )}

            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.titleSection}>
                        <button style={styles.backButton} onClick={() => setSelectedChild(null)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={styles.title}>
                                Horario de {selectedChild.child_first_name} {selectedChild.child_last_name}
                            </h1>
                            <p style={styles.subtitle}>{selectedChild.daycare_name}</p>
                        </div>
                    </div>
                    <button style={styles.addButton} onClick={openModal}>
                        <Plus size={20} />
                        Agregar Actividad
                    </button>
                </div>
            </div>

            <div style={styles.scheduleContainer}>
                {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} style={styles.dayColumn}>
                        <div style={styles.dayHeader}>
                            <h3 style={styles.dayTitle}>{day.label}</h3>
                            <span style={styles.dayBadge}>
                                {groupedSchedules[day.value].length} actividades
                            </span>
                        </div>

                        <div style={styles.activitiesList}>
                            {groupedSchedules[day.value].length === 0 ? (
                                <div style={styles.noActivities}>
                                    <Clock size={24} color="var(--muted-text)" />
                                    <p style={styles.noActivitiesText}>Sin actividades</p>
                                </div>
                            ) : (
                                groupedSchedules[day.value].map((activity) => (
                                    <div key={activity.id_schedule} style={styles.activityCard}>
                                        <div style={styles.activityHeader}>
                                            <div style={styles.timeRange}>
                                                <Clock size={16} color="var(--primary)" />
                                                <span style={styles.timeText}>
                                                    {activity.start_time} - {activity.end_time}
                                                </span>
                                            </div>
                                            <button
                                                style={styles.deleteIconButton}
                                                onClick={() => handleDelete(activity.id_schedule)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h4 style={styles.activityName}>{activity.activity_name}</h4>
                                        {activity.description && (
                                            <p style={styles.activityDescription}>{activity.description}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Agregar Nueva Actividad</h2>
                            <button style={styles.closeButton} onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={styles.formContainer}>
                            {error && (
                                <div style={styles.errorBox}>
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Nombre de la Actividad *</label>
                                    <input
                                        type="text"
                                        name="activity_name"
                                        value={currentActivity.activity_name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder="Ej: Desayuno, Siesta, Juegos"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Día de la Semana *</label>
                                    <select
                                        name="day_of_week"
                                        value={currentActivity.day_of_week}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                        required
                                    >
                                        {DAYS_OF_WEEK.map(day => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Hora de Inicio *</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={currentActivity.start_time}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Hora de Fin *</label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={currentActivity.end_time}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                                    <label style={styles.label}>Descripción (Opcional)</label>
                                    <textarea
                                        name="description"
                                        value={currentActivity.description}
                                        onChange={handleInputChange}
                                        style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                                        placeholder="Detalles adicionales sobre la actividad..."
                                    />
                                </div>
                            </div>

                            <div style={styles.modalFooter}>
                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={closeModal}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    style={{ ...styles.saveButton, opacity: loading ? 0.6 : 1 }}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        'Guardando...'
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const spinnerKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        padding: '5rem',
        paddingTop: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: 'var(--primary)'
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid var(--secondary)',
        borderTop: '4px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    errorBanner: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '16px',
        borderRadius: 'var(--border-radius)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow)'
    },
    closeError: {
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#DC2626'
    },
    errorBox: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '12px',
        borderRadius: 'var(--border-radius)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
    },
    header: {
        backgroundColor: 'var(--surface)',
        background: "linear-gradient(135deg, var(--title-color) 0%, var(--accent) 100%)",
        marginBottom: '24px',
        boxShadow: 'var(--shadow)',
        padding: "2.5rem",
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    titleSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    title: {
        color: 'white',
        fontSize: '28px',
        fontWeight: '700',
        margin: '0',
        textAlign: 'left'
    },
    subtitle: {
        color: 'white',
        fontSize: '14px',
        margin: '4px 0 0 0',
        textAlign: 'left'
    },
    backButton: {
        backgroundColor: 'transparent',
        border: '2px solid var(--primary)',
        borderRadius: 'var(--border-radius)',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)',
        transition: 'var(--transition)'
    },
    addButton: {
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'var(--transition)',
        boxShadow: '0 2px 8px rgba(255, 182, 115, 0.3)'
    },
    childrenGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    childCard: {
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '20px',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer',
        transition: 'var(--transition)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    cardAvatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '20px',
        flexShrink: 0
    },
    cardContent: {
        flex: 1
    },
    cardName: {
        margin: '0 0 8px 0',
        color: 'var(--title-color)',
        fontSize: '18px',
        fontWeight: '600'
    },
    cardInfo: {
        margin: '4px 0',
        color: 'var(--muted-text)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    scheduleContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
    },
    dayColumn: {
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden'
    },
    dayHeader: {
        padding: '16px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dayTitle: {
        margin: '0',
        fontSize: '16px',
        fontWeight: '600'
    },
    dayBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    activitiesList: {
        padding: '12px',
        minHeight: '200px'
    },
    noActivities: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '8px'
    },
    noActivitiesText: {
        color: 'var(--muted-text)',
        fontSize: '14px',
        margin: '0'
    },
    activityCard: {
        backgroundColor: 'var(--background)',
        borderRadius: 'var(--border-radius)',
        padding: '12px',
        marginBottom: '8px',
        border: '1px solid #E5E7EB'
    },
    activityHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    timeRange: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    timeText: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--primary)'
    },
    activityName: {
        margin: '0 0 6px 0',
        color: 'var(--title-color)',
        fontSize: '15px',
        fontWeight: '600'
    },
    activityDescription: {
        margin: '0',
        color: 'var(--muted-text)',
        fontSize: '13px',
        lineHeight: '1.4'
    },
    deleteIconButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#DC2626',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'var(--transition)'
    },
    emptyState: {
        textAlign: 'center',
        padding: '48px 24px',
        color: 'var(--muted-text)',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)'
    },
    emptyText: {
        marginTop: '16px',
        fontSize: '16px'
    },
    modalOverlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        padding: '20px'
    },
    modal: {
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        borderBottom: '2px solid #E5E7EB'
    },
    modalTitle: {
        color: 'var(--title-color)',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0'
    },
    closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--muted-text)',
        transition: 'var(--transition)'
    },
    formContainer: {
        padding: '24px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '24px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--title-color)',
        marginBottom: '4px'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #E5E7EB',
        borderRadius: 'var(--border-radius)',
        outline: 'none',
        transition: 'var(--transition)',
        color: 'var(--text-color)',
        backgroundColor: 'var(--surface)'
    },
    select: {
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #E5E7EB',
        borderRadius: 'var(--border-radius)',
        outline: 'none',
        transition: 'var(--transition)',
        backgroundColor: 'var(--surface)',
        cursor: 'pointer',
        color: 'var(--text-color)'
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '24px',
        borderTop: '2px solid #E5E7EB'
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: 'var(--muted-text)',
        border: '2px solid #E5E7EB',
        borderRadius: 'var(--border-radius)',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition)'
    },
    saveButton: {
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'var(--transition)',
        boxShadow: '0 2px 8px rgba(255, 182, 115, 0.3)'
    }
};

export default ScheduleManager;