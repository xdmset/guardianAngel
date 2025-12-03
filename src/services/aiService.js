import api from '../config/apiConfig';

/**
 * Envía los signos vitales al backend para ser analizados por la IA.
 * * @param {number|string} bpm - Ritmo cardíaco
 * @param {number|string} temp - Temperatura corporal
 * @param {number|string} oxygen - Nivel de oxígeno
 * @returns {Promise<Object>} Objeto con el análisis { is_critical, message, risk_probability }
 */
export const analyzeHealth = async (bpm, temp, oxygen) => {
    try {
        const url = `${api.baseUrl}${api.ep.analyze}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bpm: parseInt(bpm),
                temperature: parseFloat(temp),
                oxygen_level: parseInt(oxygen)
            })
        });

        if (!response.ok) {
            // Si el backend da error (ej. 500 o 400), lanzamos excepción para que el catch la atrape
            throw new Error(`Error del servidor IA: ${response.status}`);
        }

        const data = await response.json();
        
        // Retornamos solo la parte del análisis que nos interesa
        return data.analysis; 

    } catch (error) {
        console.error("Error en servicio IA:", error);
        
        // Retornamos un objeto seguro por defecto para que la app no se rompa
        // Esto permite que el dashboard siga funcionando aunque la IA falle
        return { 
            is_critical: false, 
            message: "Sin conexión a IA",
            risk_probability: 0
        };
    }
};