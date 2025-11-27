import React, { useState, useEffect } from 'react';
import { Watch, Plus, Trash2, Edit2, UserPlus, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import "./SmartWatchManager.css"

// Componente Alert
const Alert = ({ type, message }) => {
    const Icon = type === 'error' ? AlertCircle : CheckCircle;
    return (
        <div className={`alert alert-${type}`}>
            <Icon size={20} />
            <span>{message}</span>
        </div>
    );
};

// Componente StatusBadge
const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'maintenance': return 'status-maintenance';
            default: return 'status-inactive';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'inactive': return 'Inactivo';
            case 'maintenance': return 'Mantenimiento';
            default: return status;
        }
    };

    return (
        <span className={`status-badge ${getStatusClass(status)}`}>
            {getStatusText(status)}
        </span>
    );
};

// Modal para Crear/Editar Smartwatch
const SmartwatchFormModal = ({ show, loading, formData, onClose, onSubmit, onChange, isEdit }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {isEdit ? 'Editar Smartwatch' : 'Registrar Nuevo Smartwatch'}
                </h2>

                <div>
                    <div className="form-group">
                        <label className="form-label">Device ID *</label>
                        <input
                            type="text"
                            required
                            disabled={isEdit}
                            value={formData.device_id}
                            onChange={(e) => onChange({ ...formData, device_id: e.target.value })}
                            className="form-input"
                            placeholder="Ej: SW-001"
                            style={isEdit ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Modelo</label>
                        <input
                            type="text"
                            value={formData.model || ''}
                            onChange={(e) => onChange({ ...formData, model: e.target.value })}
                            className="form-input"
                            placeholder="Ej: KidsFit 2.0"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Estado</label>
                        <select
                            value={formData.status}
                            onChange={(e) => onChange({ ...formData, status: e.target.value })}
                            className="form-select"
                        >
                            <option value="inactive">Inactivo</option>
                            <option value="active">Activo</option>
                            <option value="maintenance">Mantenimiento</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal para Asignar a Niño
const AssignChildModal = ({ show, loading, smartwatch, children, onClose, onAssign }) => {
    const [selectedChild, setSelectedChild] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Función para calcular edad
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 1) {
            const months = (today.getFullYear() - birth.getFullYear()) * 12 + monthDiff;
            return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        }

        return `${age} ${age === 1 ? 'año' : 'años'}`;
    };

    if (!show) return null;

    const filteredChildren = children.filter(child =>
        `${child.child_first_name} ${child.child_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.daycare_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${child.tutor_first_name} ${child.tutor_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const availableChildren = filteredChildren.filter(child => !child.has_smartwatch);

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="modal-title" style={{ margin: 0 }}>
                        Asignar Smartwatch a Niño
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: '#6B7280'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{
                    backgroundColor: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '14px',
                    marginBottom: '1.5rem'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Dispositivo</p>
                    <p style={{ fontWeight: '600', margin: '0.25rem 0' }}>{smartwatch?.device_id}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{smartwatch?.model || 'Sin modelo'}</p>
                </div>

                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, guardería o tutor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div style={{
                    maxHeight: '300px',
                    overflow: 'auto',
                    border: '1px solid #e5e7eb',
                    borderRadius: '14px',
                    marginBottom: '1.5rem'
                }}>
                    {availableChildren.length === 0 ? (
                        <div className="empty-state">
                            No hay niños disponibles sin smartwatch asignado
                        </div>
                    ) : (
                        availableChildren.map(child => (
                            <div
                                key={child.id_child}
                                onClick={() => setSelectedChild(child.id_child)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    backgroundColor: selectedChild === child.id_child ? '#eff6ff' : 'white',
                                    transition: '0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '700', marginBottom: '0.5rem', margin: 0, fontSize: '1rem', color: '#018061' }}>
                                            {child.child_first_name} {child.child_last_name}
                                        </p>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>ID:</strong> {child.id_child}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Guardería:</strong> {child.daycare_name}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Tutor:</strong> {child.tutor_first_name} {child.tutor_last_name}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Cuidador:</strong> {child.caregiver_first_name} {child.caregiver_last_name}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Edad:</strong> {calculateAge(child.birth_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        checked={selectedChild === child.id_child}
                                        onChange={() => setSelectedChild(child.id_child)}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', marginTop: '0.25rem' }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onAssign(selectedChild)}
                        disabled={!selectedChild || loading}
                        className="btn-submit"
                        style={{
                            backgroundColor: !selectedChild || loading ? undefined : '#10b981'
                        }}
                    >
                        {loading ? 'Asignando...' : 'Asignar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SmartWatchManagerPage = () => {
    const [smartwatches, setSmartwatches] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedSmartwatch, setSelectedSmartwatch] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        device_id: '',
        model: '',
        status: 'inactive'
    });

    const API_BASE_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchSmartwatches();
        fetchChildren();
    }, []);

    const fetchSmartwatches = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/smartwatches/`);
            if (!response.ok) throw new Error('Error al cargar los smartwatches');
            const data = await response.json();
            setSmartwatches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/children/with-tutor-caregiver`);
            if (!response.ok) throw new Error('Error al cargar los niños');
            const data = await response.json();

            // Obtener smartwatches para verificar cuáles niños ya tienen uno asignado
            const swResponse = await fetch(`${API_BASE_URL}/smartwatches/`);
            const smartwatchesData = await swResponse.json();

            // Crear un Set de IDs de niños que ya tienen smartwatch
            const childrenWithSmartwatch = new Set();
            smartwatchesData.forEach(sw => {
                if (sw.child_id) {
                    childrenWithSmartwatch.add(sw.child_id);
                }
            });

            // Agregar la información de si tienen smartwatch
            const childrenWithInfo = data.map(child => ({
                ...child,
                has_smartwatch: childrenWithSmartwatch.has(child.id_child)
            }));

            setChildren(childrenWithInfo);
        } catch (err) {
            console.error('Error al cargar niños:', err);
        }
    };

    const handleCreateSmartwatch = async () => {
        if (!formData.device_id) {
            setError('El Device ID es requerido');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/smartwatches/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el smartwatch');
            }

            setSuccess('Smartwatch registrado exitosamente');
            setShowFormModal(false);
            setFormData({ device_id: '', model: '', status: 'inactive' });
            fetchSmartwatches();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSmartwatch = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/smartwatches/${selectedSmartwatch.id_smartwatch}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: formData.model,
                    status: formData.status
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el smartwatch');
            }

            setSuccess('Smartwatch actualizado exitosamente');
            setShowFormModal(false);
            setIsEdit(false);
            setSelectedSmartwatch(null);
            fetchSmartwatches();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSmartwatch = async (smartwatchId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este smartwatch?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/smartwatches/${smartwatchId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el smartwatch');
            }

            setSuccess('Smartwatch eliminado exitosamente');
            fetchSmartwatches();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignToChild = async (childId) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_BASE_URL}/smartwatches/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_smartwatch: selectedSmartwatch.id_smartwatch,
                    id_child: childId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al asignar el smartwatch');
            }

            setSuccess('Smartwatch asignado exitosamente');
            setShowAssignModal(false);
            setSelectedSmartwatch(null);
            fetchSmartwatches();
            fetchChildren();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (smartwatch) => {
        setSelectedSmartwatch(smartwatch);
        setFormData({
            device_id: smartwatch.device_id,
            model: smartwatch.model || '',
            status: smartwatch.status
        });
        setIsEdit(true);
        setShowFormModal(true);
    };

    const openAssignModal = (smartwatch) => {
        setSelectedSmartwatch(smartwatch);
        setShowAssignModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setIsEdit(false);
        setSelectedSmartwatch(null);
        setFormData({ device_id: '', model: '', status: 'inactive' });
    };

    const filteredSmartwatches = smartwatches.filter(sw =>
        String(sw.device_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sw.model && sw.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="devices-page">
            <div className="devices-container">
                {/* Header */}
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-info">
                            <div className="header-title">
                                <Watch size={32} />
                                <h1>Gestión de Smartwatches</h1>
                            </div>
                            <p className="header-subtitle">
                                Administra los dispositivos del sistema AngelCare
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setIsEdit(false);
                                setShowFormModal(true);
                            }}
                            className="btn-primary"
                        >
                            <Plus size={20} />
                            Nuevo Smartwatch
                        </button>
                    </div>
                </div>

                {/* Alertas */}
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                {/* Barra de búsqueda */}
                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por Device ID o Modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Tabla */}
                <div className="table-container">
                    {loading && smartwatches.length === 0 ? (
                        <div className="loading-state">Cargando smartwatches...</div>
                    ) : filteredSmartwatches.length === 0 ? (
                        <div className="empty-state">No se encontraron smartwatches</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="devices-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Device ID</th>
                                        <th>Modelo</th>
                                        <th>Estado</th>
                                        <th>Fecha Creación</th>
                                        <th style={{ textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSmartwatches.map((smartwatch) => (
                                        <tr key={smartwatch.id_smartwatch}>
                                            <td style={{ color: '#6B7280' }}>{smartwatch.id_smartwatch}</td>
                                            <td style={{ fontWeight: '600' }}>{smartwatch.device_id}</td>
                                            <td>{smartwatch.model || 'N/A'}</td>
                                            <td>
                                                <StatusBadge status={smartwatch.status} />
                                            </td>
                                            <td style={{ color: '#6B7280' }}>
                                                {new Date(smartwatch.created_at).toLocaleDateString('es-MX')}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => openAssignModal(smartwatch)}
                                                        title="Asignar a niño"
                                                        style={{
                                                            padding: '0.5rem',
                                                            backgroundColor: '#10b981',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: '0.3s ease'
                                                        }}
                                                    >
                                                        <UserPlus size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(smartwatch)}
                                                        title="Editar"
                                                        style={{
                                                            padding: '0.5rem',
                                                            backgroundColor: '#3b82f6',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            transition: '0.3s ease'
                                                        }}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSmartwatch(smartwatch.id_smartwatch)}
                                                        disabled={loading}
                                                        className="btn-delete"
                                                        title="Eliminar smartwatch"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="devices-footer">
                    Total de dispositivos: <span className="footer-count">{filteredSmartwatches.length}</span>
                    {searchTerm && ` (filtrado de ${smartwatches.length})`}
                </div>

                {/* Modales */}
                <SmartwatchFormModal
                    show={showFormModal}
                    loading={loading}
                    formData={formData}
                    isEdit={isEdit}
                    onClose={closeFormModal}
                    onSubmit={isEdit ? handleEditSmartwatch : handleCreateSmartwatch}
                    onChange={setFormData}
                />

                <AssignChildModal
                    show={showAssignModal}
                    loading={loading}
                    smartwatch={selectedSmartwatch}
                    children={children}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedSmartwatch(null);
                    }}
                    onAssign={handleAssignToChild}
                />
            </div>
        </div>
    );
};

export default SmartWatchManagerPage;
