const api = {
  // baseUrl: 'http://172.17.3.33:5000/apidocs/',
  baseUrl: 'http://127.0.0.1:5000/api/',

  ep: {
    children: 'children/',
    caregiver: 'caregiver/',            // Para listar los niños del cuidador
    smartwatch: 'readings/smartwatch/', // Para obtener lecturas del reloj
    analyze: 'analyze-reading',         // Para el análisis de IA
  }
};

export default api;