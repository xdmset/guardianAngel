import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, Calendar, Users, Baby, AlertCircle, Watch } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const ChildManager = () => {
    const [children, setChildren] = useState([]);
    const [daycares, setDaycares] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [caregivers, setCaregivers] = useState([]);
    const [smartwatches, setSmartWatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentChild, setCurrentChild] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        id_daycare: '',
        id_tutor: '',
        id_caregiver: '',
        id_smartwatch: ''
    });

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadChildren(),
                loadDaycares(),
                loadUsers(),
                loadSmartWatches()
            ]);
            setError(null);
        } catch (err) {
            setError('Error al cargar los datos. Verifica que el servidor esté corriendo.');
            console.error('Error cargando datos:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadChildren = async () => {
        try {
            const response = await fetch(`${API_URL}/children`);
            if (!response.ok) throw new Error('Error al cargar niños');
            const data = await response.json();
            setChildren(data);
        } catch (err) {
            console.error('Error loading children:', err);
            throw err;
        }
    };

    const loadDaycares = async () => {
        try {
            const response = await fetch(`${API_URL}/daycares/`);
            if (!response.ok) throw new Error('Error al cargar guarderías');
            const data = await response.json();
            setDaycares(data);
        } catch (err) {
            console.error('Error loading daycares:', err);
            throw err;
        }
    };

    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users/`);
            if (!response.ok) throw new Error('Error al cargar usuarios');
            const data = await response.json();

            const tutorsList = data.filter(u => u.role === 'tutor');
            const caregiversList = data.filter(u => u.role === 'caregiver');

            setTutors(tutorsList);
            setCaregivers(caregiversList);
        } catch (err) {
            console.error('Error loading users:', err);
            throw err;
        }
    };

    const loadSmartWatches = async () => {
        try {
            const response = await fetch(`${API_URL}/smartwatches/`);
            if (!response.ok) throw new Error('Error al cargar smartwatches');
            const data = await response.json();
            setSmartWatches(data);
        } catch (err) {
            console.error('Error loading smartwatches:', err);
            throw err;
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const openModal = (child = null) => {
        if (child) {
            setIsEditing(true);

            // Buscar los IDs reales desde los datos cargados para pre-llenar el formulario
            // Nota: Asumimos que el backend envía los nombres, buscamos el ID correspondiente
            const daycare = daycares.find(d => d.name === child.daycare_name);
            const tutor = tutors.find(t =>
                t.first_name === child.tutor_first_name &&
                t.last_name === child.tutor_last_name
            );
            const caregiver = caregivers.find(c =>
                c.first_name === child.caregiver_first_name &&
                c.last_name === child.caregiver_last_name
            );
            // Para smartwatch, el child ya trae id_smartwatch o device_id, buscamos coincidencia
            const sw = smartwatches.find(s => s.device_id === child.device_id);

            setCurrentChild({
                id_child: child.id_child,
                first_name: child.child_first_name,
                last_name: child.child_last_name,
                birth_date: child.birth_date,
                id_daycare: daycare?.id_daycare || '',
                id_tutor: tutor?.id_user || '',
                id_caregiver: caregiver?.id_user || '',
                id_smartwatch: sw?.id_smartwatch || ''
            });
        } else {
            setIsEditing(false);
            setCurrentChild({
                first_name: '',
                last_name: '',
                birth_date: '',
                id_daycare: '',
                id_tutor: '',
                id_caregiver: '',
                id_smartwatch: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentChild({
            first_name: '',
            last_name: '',
            birth_date: '',
            id_daycare: '',
            id_tutor: '',
            id_caregiver: '',
            id_smartwatch: ''
        });
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentChild(prev => ({
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
                first_name: currentChild.first_name,
                last_name: currentChild.last_name,
                birth_date: currentChild.birth_date,
                id_daycare: parseInt(currentChild.id_daycare),
                id_tutor: parseInt(currentChild.id_tutor),
                id_caregiver: currentChild.id_caregiver ? parseInt(currentChild.id_caregiver) : 0,
                id_smartwatch: currentChild.id_smartwatch ? parseInt(currentChild.id_smartwatch) : 0
            };

            let response;
            if (isEditing) {
                response = await fetch(`${API_URL}/children/${currentChild.id_child}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                response = await fetch(`${API_URL}/children`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el niño');
            }

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            await loadChildren();

            closeModal();
            alert(isEditing ? '✅ Niño actualizado correctamente' : '✅ Niño creado correctamente');
        } catch (err) {
            setError(err.message);
            console.error('Error al guardar:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (childId) => {
        if (!window.confirm('¿Está seguro que desea eliminar este niño?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/children/${childId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el niño');
            }

            await loadChildren();
            alert('✅ Niño eliminado correctamente');
        } catch (err) {
            setError(err.message);
            console.error('Error al eliminar:', err);
            alert('❌ Error al eliminar el niño');
        } finally {
            setLoading(false);
        }
    };

    const filteredChildren = children.filter(child =>
        child.child_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.child_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.daycare_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && children.length === 0) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Cargando datos...</p>
                <style>{globalCss}</style>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{globalCss}</style>

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
                        <div>
                            <h1 style={styles.title}>Gestión de Niños</h1>
                            <p style={styles.subtitle}>Administra los niños registrados en las guarderías</p>
                        </div>
                    </div>
                    <button style={styles.addButton} onClick={() => openModal()}>
                        <Plus size={20} />
                        Agregar Niño
                    </button>
                </div>
            </div>

            <div style={styles.searchContainer}>
                <div style={styles.searchBox}>
                    <Search size={20} color="var(--muted-text)" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o guardería..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <Users size={24} color="var(--head-bg)" />
                        <div>
                            <p style={styles.statNumber}>{children.length}</p>
                            <p style={styles.statLabel}>Total Niños</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Nombre Completo</th>
                            <th style={styles.th}>Edad</th>
                            <th style={styles.th}>Guardería</th>
                            <th style={styles.th}>Tutor</th>
                            <th style={styles.th}>Smartwatch</th>
                            <th style={styles.th}>Cuidador</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChildren.map((child) => (
                            <tr key={child.id_child} style={styles.tableRow}>
                                <td style={styles.td}>
                                    <div style={styles.nameCell}>
                                        {/* <div style={styles.avatar}>
                                            {child.child_first_name[0]}{child.child_last_name[0]}
                                        </div> */}
                                        <div>
                                            <p style={styles.childName}>
                                                {child.child_first_name} {child.child_last_name}
                                            </p>
                                            <p style={styles.childDate}>
                                                <Calendar size={12} />
                                                {new Date(child.birth_date).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.ageBadge}>
                                        {calculateAge(child.birth_date)} años
                                    </span>
                                </td>
                                <td style={styles.td}>{child.daycare_name}</td>
                                <td style={styles.td}>
                                    {child.tutor_first_name} {child.tutor_last_name}
                                </td>

                                {/* COLUMNA NUEVA: SMARTWATCH ID */}
                                <td style={styles.td}>
                                    {child.device_id ? (
                                        <div style={styles.smartwatchBadge}>
                                            <Watch size={14} />
                                            {child.device_id}
                                        </div>
                                    ) : (
                                        <span style={styles.emptyDash}>-</span>
                                    )}
                                </td>

                                <td style={styles.td}>
                                    {child.caregiver_first_name ?
                                        `${child.caregiver_first_name} ${child.caregiver_last_name}` :
                                        <span style={{ color: 'var(--muted-text)', fontStyle: 'italic', fontSize: '13px' }}>Sin asignar</span>
                                    }
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.actionButtons}>
                                        <button
                                            style={styles.editButton}
                                            onClick={() => openModal(child)}
                                            title="Editar"
                                            disabled={loading}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        {/* <button
                                            style={styles.deleteButton}
                                            onClick={() => handleDelete(child.id_child)}
                                            title="Eliminar"
                                            disabled={loading}
                                        >
                                            <Trash2 size={16} />
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredChildren.length === 0 && (
                    <div style={styles.emptyState}>
                        <Baby size={64} color="var(--muted-text)" />
                        <p style={styles.emptyText}>No se encontraron niños</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>
                                {isEditing ? 'Editar Niño' : 'Agregar Nuevo Niño'}
                            </h2>
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
                                    <label style={styles.label}>Nombre *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={currentChild.first_name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder={isEditing ? currentChild.first_name : "Ej: Juan"}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Apellido *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={currentChild.last_name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder={isEditing ? currentChild.last_name : "Ej: Pérez"}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Fecha de Nacimiento *</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        // value={currentChild.birth_date}
                                        // value={new Date(currentChild.birth_date).toISOString().split("T")[0]}
                                        value={new Date(currentChild.birth_date).toISOString().split("T")[0]}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                        placeholder={isEditing ? currentChild.birth_date : ""}
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Guardería *</label>
                                    <select
                                        name="id_daycare"
                                        value={currentChild.id_daycare}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Seleccione una guardería</option>
                                        {daycares.map(dc => (
                                            <option key={dc.id_daycare} value={dc.id_daycare}>
                                                {dc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tutor *</label>
                                    <select
                                        name="id_tutor"
                                        value={currentChild.id_tutor}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                        required
                                    >
                                        <option value="">Seleccione un tutor</option>
                                        {tutors.map(tutor => (
                                            <option key={tutor.id_user} value={tutor.id_user}>
                                                {tutor.first_name} {tutor.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Cuidador (Opcional)</label>
                                    <select
                                        name="id_caregiver"
                                        value={currentChild.id_caregiver}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                    >
                                        <option value="">Sin cuidador asignado</option>
                                        {caregivers.map(caregiver => (
                                            <option key={caregiver.id_user} value={caregiver.id_user}>
                                                {caregiver.first_name} {caregiver.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Smartwatch (Opcional)</label>
                                    <select
                                        name="id_smartwatch"
                                        value={currentChild.id_smartwatch}
                                        onChange={handleInputChange}
                                        style={styles.select}
                                    >
                                        <option value="">Sin smartwatch asignado</option>
                                        {smartwatches.map(sw => (
                                            <option key={sw.id_smartwatch} value={sw.id_smartwatch}>
                                                {sw.device_id} ({sw.status})
                                            </option>
                                        ))}
                                    </select>
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
                                            {isEditing ? 'Actualizar' : 'Guardar'}
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

// CSS Global inyectado (animaciones y variables)
const globalCss = `
  :root {
    /* Paleta principal */
    --primary: #FFB673;       /* Naranja durazno suave */
    --primary-dark: #E38C4D;
    --primary-hover: #FFC085;

    --secondary: #8ECDF2;     /* Azul bebé */
    --secondary-dark: #5AAED4;

    --accent: #7DD3A9;        /* Verde menta */
    --accent-dark: #52B985;

    --title-color: #018061;

    /* Fondos y superficies */
    --background: #FAFAFC;    /* Fondo limpio */
    --surface: #FFFFFF;       /* Tarjetas */
    
    --title-color: #374151;   /* Gris profesional */
    --text-color: #4B5563;
    --muted-text: #9CA3AF;
    
    --head-bg: #245AB2;       /* Azul fuerte para Header */

    /* Estética */
    --border-radius: 6px;
    --transition: 0.25s ease;
    --shadow: 0 4px 12px rgba(11,22,39,0.05);
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  body {
    background-color: var(--background);
  }
`;

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        // padding: '30px',
        padding: '5rem',
        paddingTop: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        color: 'var(--secondary)'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid var(--secondary)',
        borderTop: '4px solid var(--head-bg)',
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
        boxShadow: 'var(--shadow)',
        borderLeft: '4px solid #DC2626'
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
        // backgroundColor: 'var(--surface)',
        background: 'linear-gradient(135deg, var(--title-color) 0%, var(--accent) 100%)',
        borderRadius: 'var(--border-radius)',
        // padding: '24px 32px',
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
    iconWrapper: {
        // backgroundColor: 'var(--head-bg)',
        backgroundColor: 'var(--head-bg)',
        padding: '10px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        // color: 'var(--title-color)',
        color: '#ffffff',
        fontSize: '26px',
        fontWeight: '700',
        margin: '0',
        textAlign: 'left'
    },
    subtitle: {
        color: 'var(--muted-text)',
        fontSize: '14px',
        margin: '4px 0 0 0',
        textAlign: 'left'
    },
    addButton: {
        // backgroundColor: 'var(--head-bg)',

        background: "var(--primary)",
        color: 'white',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: '12px 24px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'var(--transition)',
        boxShadow: '0 4px 10px rgba(36, 90, 178, 0.2)'
    },
    searchContainer: {
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    searchBox: {
        flex: '1',
        minWidth: '300px',
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow)',
        border: '1px solid transparent'
    },
    searchInput: {
        flex: '1',
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        color: 'var(--text-color)',
        // backgroundColor: 'transparent'
    },
    statsContainer: {
        display: 'flex',
        gap: '16px'
    },
    statCard: {
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: 'var(--shadow)'
    },
    statNumber: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--head-bg)',
        margin: '0'
    },
    statLabel: {
        fontSize: '12px',
        color: 'var(--muted-text)',
        margin: '0',
        fontWeight: '500'
    },
    tableContainer: {
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '0', // Removed padding for cleaner table look
        padding: '0', // Removed padding for cleaner table look
        boxShadow: 'var(--shadow)',
        overflowX: 'auto',
        overflow: 'hidden' // Rounds corners of table
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    tableHeader: {
        backgroundColor: '#F3F4F6', // Light gray for header background
        borderBottom: '2px solid #E5E7EB'
    },
    th: {
        padding: '16px 24px',
        textAlign: 'left',
        // fontSize: '13px',
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--title-color)',
        // textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    tableRow: {
        borderBottom: '1px solid #F3F4F6',
        transition: 'var(--transition)',
        backgroundColor: 'var(--surface)'
    },
    td: {
        padding: '16px 24px',
        fontSize: '14px',
        color: 'var(--text-color)',
        verticalAlign: 'middle'
    },
    nameCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: 'var(--secondary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    childName: {
        margin: '0',
        fontWeight: '600',
        color: 'var(--title-color)',
        fontSize: '15px'
    },
    childDate: {
        margin: '2px 0 0 0',
        fontSize: '12px',
        color: 'var(--muted-text)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    ageBadge: {
        // backgroundColor: 'var(--secondary)', // Using secondary (Baby Blue)
        // color: '#0F4C75', // Darker blue for contrast text
        // padding: '4px 10px',
        // borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block'
    },
    smartwatchBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: 'var(--accent)', // Mint Green
        color: 'white',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        width: 'fit-content'
    },
    emptyDash: {
        color: 'var(--muted-text)',
        paddingLeft: '10px'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    editButton: {
        backgroundColor: '#F3F4F6',
        color: 'var(--head-bg)',
        border: '1px solid #E5E7EB',
        borderRadius: '6px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'var(--transition)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        backgroundColor: '#FEF2F2',
        color: '#EF4444',
        border: '1px solid #FEE2E2',
        borderRadius: '6px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'var(--transition)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 24px',
        color: 'var(--muted-text)'
    },
    emptyText: {
        marginTop: '16px',
        fontSize: '16px',
        fontWeight: '500'
    },
    modalOverlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        // backgroundColor: 'rgba(36, 90, 178, 0.4)', // Blue-tinted overlay
        // backdropFilter: 'blur(2px)',
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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        border: '1px solid #E5E7EB'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        // backgroundColor: 'var(--head-bg)',
        // color: 'black',
        borderTopLeftRadius: 'var(--border-radius)',
        borderTopRightRadius: 'var(--border-radius)',

        // backgroundColor: "linear-gradient(135deg, var(--title-color) 0%, var(--accent) 100%)",
        // borderRadius: "var(--border-radius)",
        // padding: "2.5rem",
        // marginBottom: "2rem",
        // boxShadow: "var(--shadow)",
        color: "white",

    },
    modalTitle: {
        color: 'var(--head-bg)',
        fontSize: '20px',
        fontWeight: '600',
        margin: '0'
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        borderRadius: '50%',
        transition: 'var(--transition)'
    },
    formContainer: {
        padding: '30px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--title-color)',
        marginBottom: '2px',
        textTransform: 'uppercase',
        letterSpacing: '0.3px'
    },
    input: {
        padding: '12px',
        fontSize: '15px',
        border: '1px solid #D1D5DB',
        borderRadius: 'var(--border-radius)',
        outline: 'none',
        transition: 'var(--transition)',
        color: 'var(--text-color)',
        backgroundColor: '#F9FAFB'
    },
    select: {
        padding: '12px',
        fontSize: '15px',
        border: '1px solid #D1D5DB',
        borderRadius: 'var(--border-radius)',
        outline: 'none',
        transition: 'var(--transition)',
        backgroundColor: '#F9FAFB',
        cursor: 'pointer',
        color: 'var(--text-color)'
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        paddingTop: '20px',
        borderTop: '1px solid #E5E7EB'
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: 'var(--text-color)',
        border: '1px solid #D1D5DB',
        borderRadius: 'var(--border-radius)',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition)'
    },
    saveButton: {
        backgroundColor: 'var(--head-bg)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--border-radius)',
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'var(--transition)',
        boxShadow: '0 2px 5px rgba(36, 90, 178, 0.2)'
    }
};

export default ChildManager;