import React from 'react';

const SmartwatchModal = ({
    show,
    loading,
    formData,
    onClose,
    onSubmit,
    onChange
}) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Registrar Nuevo Smartwatch</h2>

                <div>
                    <div className="form-group">
                        <label className="form-label">Device ID *</label>
                        <input
                            type="text"
                            required
                            value={formData.device_id}
                            onChange={(e) => onChange({ ...formData, device_id: e.target.value })}
                            className="form-input"
                            placeholder="Ej: SW-001"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Modelo</label>
                        <input
                            type="text"
                            value={formData.model}
                            onChange={(e) => onChange({ ...formData, model: e.target.value })}
                            className="form-input"
                            placeholder="Ej: Apple Watch Series 9"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Estado Inicial</label>
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
                            {loading ? 'Guardando...' : 'Registrar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartwatchModal;