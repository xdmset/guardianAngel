import React, { useState, useEffect } from 'react';
import './SmartWatchManager.css';
import SmartwatchTable from '../../components/smartwatchManager/SmartwatchTable';
import SmartwatchModal from '../../components/smartwatchManager/smartWatchModal';
import SearchBar from '../../components/smartwatchManager/SearchBar';
import Alert from '../../components/smartwatchManager/Alert';
import PageHeader from '../../components/smartwatchManager/PageHeader';

const SmartwatchManagerPage = () => {
    const [smartwatches, setSmartwatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        device_id: '',
        model: '',
        status: 'inactive'
    });

    const API_BASE_URL = 'http://localhost:5000/api';

    // useEffect(() => {
    //     fetchSmartwatches();
    // }, []);
    useEffect(() => {
        fetchSmartwatches();
    }, [loading]);

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

            const newSmartwatch = await response.json();
            setSmartwatches([...smartwatches, newSmartwatch]);
            setSuccess('Smartwatch registrado exitosamente');
            setShowModal(false);
            setFormData({ device_id: '', model: '', status: 'inactive' });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSmartwatch = async (smartwatchId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este smartwatch? (No funciona, aun no hay endpoint para eliminar)')) {
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

            setSmartwatches(smartwatches.filter(sw => sw.id_smartwatch !== smartwatchId));
            setSuccess('Smartwatch eliminado exitosamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ device_id: '', model: '', status: 'inactive' });
    };

    const filteredSmartwatches = smartwatches.filter(sw =>
    // sw.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    {
        return String(sw.device_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sw.model && sw.model.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    );

    return (
        <div className="devices-page">
            <div className="devices-container">
                <PageHeader onNewClick={() => setShowModal(true)} />

                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por Device ID o Modelo..."
                />

                <SmartwatchTable
                    smartwatches={filteredSmartwatches}
                    loading={loading}
                    onDelete={handleDeleteSmartwatch}
                />

                <div className="devices-footer">
                    Total de dispositivos: <span className="footer-count">{filteredSmartwatches.length}</span>
                    {searchTerm && ` (filtrado de ${smartwatches.length})`}
                </div>

                <SmartwatchModal
                    show={showModal}
                    loading={loading}
                    formData={formData}
                    onClose={handleCloseModal}
                    onSubmit={handleCreateSmartwatch}
                    onChange={setFormData}
                />
            </div>
        </div>
    );
};

export default SmartwatchManagerPage;