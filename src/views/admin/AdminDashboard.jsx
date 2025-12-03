import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Watch, Users, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const styles = {
    container: {
        minHeight: '100vh',
        background: 'var(--background)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '2rem'
    },
    wrapper: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    title: {
        color: 'var(--title-color)',
        fontSize: '2rem',
        fontWeight: '600',
        marginBottom: '2rem',
        textAlign: 'left'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    },
    chartsSection: {
        marginTop: '3rem'
    },
    chartContainer: {
        background: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '2rem',
        boxShadow: '0 8px 20px rgba(11, 22, 39, 0.15)',
        marginBottom: '2rem'
    },
    chartTitle: {
        color: 'var(--title-color)',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        textAlign: 'left'
    },
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '2rem'
    }
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [childrenByDaycare, setChildrenByDaycare] = useState([]);
    const [smartwatchStatus, setSmartwatchStatus] = useState([]);

    useEffect(() => {
        // Fetch datos de la API real
        const fetchData = async () => {
            try {
                // Obtener datos de niños
                const childrenResponse = await fetch('http://localhost:5000/api/children');
                const childrenApiData = await childrenResponse.json();

                // Procesar datos de niños por guardería
                const daycareCount = {};
                childrenApiData.forEach(child => {
                    // Solo contar si tiene guardería asignada
                    if (child.daycare_name && child.daycare_name.trim() !== '') {
                        const daycare = child.daycare_name.trim();
                        daycareCount[daycare] = (daycareCount[daycare] || 0) + 1;
                    }
                });

                // Si no hay guarderías con niños, agregar mensaje
                const daycareData = Object.keys(daycareCount).length > 0
                    ? Object.entries(daycareCount).map(([name, count]) => ({
                        name,
                        cantidad: count
                    }))
                    : [{ name: 'Sin datos', cantidad: 0 }];

                setChildrenByDaycare(daycareData);

                // Obtener datos de smartwatches
                const smartwatchesResponse = await fetch('http://localhost:5000/api/smartwatches/');
                const smartwatchesApiData = await smartwatchesResponse.json();

                // Procesar datos de estado de smartwatches
                const statusCount = {
                    active: 0,
                    maintenance: 0,
                    inactive: 0
                };

                smartwatchesApiData.forEach(watch => {
                    statusCount[watch.status] = (statusCount[watch.status] || 0) + 1;
                });

                const statusData = [
                    { name: 'Activo', value: statusCount.active, color: '#7DD3A9' },
                    { name: 'Mantenimiento', value: statusCount.maintenance, color: '#FFB673' },
                    { name: 'Inactivo', value: statusCount.inactive, color: '#E38C4D' }
                ];
                setSmartwatchStatus(statusData);

            } catch (error) {
                console.error('Error al cargar datos de la API:', error);
                // En caso de error, usar datos de respaldo
                setChildrenByDaycare([
                    { name: 'Pequeños Gigantes', cantidad: 2 },
                    { name: 'Mundo Infantil', cantidad: 2 },
                    { name: 'Kids Paradise', cantidad: 3 }
                ]);
                setSmartwatchStatus([
                    { name: 'Activo', value: 7, color: '#7DD3A9' },
                    { name: 'Mantenimiento', value: 2, color: '#FFB673' },
                    { name: 'Inactivo', value: 1, color: '#E38C4D' }
                ]);
            }
        };

        fetchData();
    }, []);

    const cards = [
        {
            icon: <Users className="w-12 h-12" />,
            title: 'Registro',
            description: 'Registro de usuarios',
            route: '/registration',
            color: 'var(--primary)'
        },
        {
            icon: <Watch className="w-12 h-12" />,
            title: 'Smartwatches',
            description: 'Administrar relojes',
            route: '/smartwatches',
            color: 'var(--secondary)'
        },
        {
            icon: <User className="w-12 h-12" />,
            title: 'Niños',
            description: 'Catálogo de niños',
            route: '/children',
            color: 'var(--accent)'
        },
        {
            icon: <Calendar className="w-12 h-12" />,
            title: 'Horarios',
            description: 'Gestión de horarios de los niños',
            route: '/schedule',
            color: 'var(--primary-dark)'
        },
    ];

    const handleCardClick = (route) => {
        route = `/admin${route}`;
        console.log('Navegando a:', route);
        navigate(route);
    };

    const getCardBackground = (color) => {
        const colorMap = {
            'var(--primary)': '#FFE5CC',
            'var(--secondary)': '#D4EDF7',
            'var(--accent)': '#D1F2E3',
            'var(--primary-dark)': '#F4D4B8',
            'var(--secondary-dark)': '#B8DDF0',
            'var(--accent-dark)': '#B8E6D0'
        };
        return colorMap[color] || '#F3F4F6';
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <h1 style={styles.title}>Dashboard</h1>

                {/* Grid de Cartas */}
                <div style={styles.grid}>
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(card.route)}
                            style={{
                                background: getCardBackground(card.color),
                                borderRadius: 'var(--border-radius)',
                                padding: '2rem',
                                boxShadow: '0 8px 20px rgba(11, 22, 39, 0.15)',
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 16px 32px rgba(11, 22, 39, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(11, 22, 39, 0.15)';
                            }}
                        >
                            {/* Icono */}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '16px',
                                background: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginBottom: '0.5rem'
                            }}>
                                {card.icon}
                            </div>

                            {/* Título */}
                            <h3 style={{
                                margin: 0,
                                color: 'var(--title-color)',
                                fontSize: '1.25rem',
                                fontWeight: '600'
                            }}>
                                {card.title}
                            </h3>

                            {/* Descripción */}
                            <p style={{
                                margin: 0,
                                color: 'var(--text-color)',
                                fontSize: '0.9rem'
                            }}>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Sección de Gráficas */}
                <div style={styles.chartsSection}>
                    <div style={styles.chartsGrid}>
                        {/* Gráfica de Barras - Niños por Guardería */}
                        <div style={styles.chartContainer}>
                            <h2 style={styles.chartTitle}>Niños por Guardería</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={childrenByDaycare}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'var(--text-color)', fontSize: 12 }}
                                    />
                                    <YAxis
                                        tick={{ fill: 'var(--text-color)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="cantidad"
                                        fill="#8ECDF2"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Gráfica de Pastel - Estado de Smartwatches */}
                        <div style={styles.chartContainer}>
                            <h2 style={styles.chartTitle}>Estado de Smartwatches</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={smartwatchStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {smartwatchStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}