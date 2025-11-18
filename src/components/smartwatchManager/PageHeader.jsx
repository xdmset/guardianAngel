import React from 'react';
import { Watch, Plus } from 'lucide-react';

const PageHeader = ({ onNewClick }) => {
    return (
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
                <button onClick={onNewClick} className="btn-primary">
                    <Plus size={20} />
                    Nuevo Smartwatch
                </button>
            </div>
        </div>
    );
};

export default PageHeader;
