import axios from 'axios';

const API_URL = 'http://localhost:8081/api/reclamos'; // Asegúrate de tener este endpoint o usa uno genérico

// Obtener header de autenticación (si el usuario está logueado)
const getAuthHeader = () => {
  const token = localStorage.getItem('clientToken');
  const clienteId = localStorage.getItem('clienteId');
  
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (clienteId) headers['X-Cliente-Id'] = clienteId;
  
  return headers;
};

/**
 * Enviar un nuevo reclamo
 */
export const enviarReclamo = async (reclamoData) => {
  try {
    // Si no tienes el endpoint listo en el backend, descomenta esto para simular éxito:
    /*
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id: 'REC-' + Date.now(), ...reclamoData }), 1000);
    });
    */

    const response = await axios.post(API_URL, reclamoData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al enviar reclamo:', error);
    throw error.response?.data?.error || 'No se pudo enviar el reclamo.';
  }
};