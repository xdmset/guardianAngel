import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Alert = ({ type, message }) => {
    const styles = {
        error: {
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33'
        },
        success: {
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724'
        }
    };

    const Icon = type === 'error' ? AlertCircle : CheckCircle;

    return (
        <div style={{
            ...styles[type],
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
        }}>
            <Icon size={20} />
            <span>{message}</span>
        </div>
    );
};

export default Alert;