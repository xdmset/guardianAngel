import React from 'react';
import { Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const SmartwatchTable = ({ smartwatches, loading, onDelete }) => {
    if (loading && smartwatches.length === 0) {
        return (
            <div className="table-container">
                <div className="loading-state">Cargando smartwatches...</div>
            </div>
        );
    }

    if (smartwatches.length === 0) {
        return (
            <div className="table-container">
                <div className="empty-state">No se encontraron smartwatches</div>
            </div>
        );
    }

    return (
        <div className="table-container">
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
                        {smartwatches.map((smartwatch) => (
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
                                    <button
                                        onClick={() => onDelete(smartwatch.id_smartwatch)}
                                        disabled={loading}
                                        className="btn-delete"
                                        title="Eliminar smartwatch"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SmartwatchTable;