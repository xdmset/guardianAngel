import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return 'status-active';
            case 'inactive':
                return 'status-inactive';
            case 'maintenance':
                return 'status-maintenance';
            default:
                return 'status-inactive';
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

export default StatusBadge;