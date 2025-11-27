/**
 * API para gestión de reseñas de productos
 */

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/resenas';

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = () => {
  const clienteId = localStorage.getItem('clienteId');
  const token = localStorage.getItem('clientToken');
  
  const headers = {};
  if (clienteId) {
    headers['X-Cliente-Id'] = clienteId;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Obtener reseñas aprobadas de un producto (público)
 */
export const obtenerResenasProducto = async (productoId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/producto/${productoId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    throw error;
  }
};

/**
 * Crear nueva reseña (requiere autenticación)
 */
export const crearResena = async (productoId, calificacion, comentario) => {
  try {
    const response = await axios.post(API_URL, {
      productoId,
      calificacion,
      comentario
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al crear reseña';
  }
};

/**
 * Obtener mis reseñas
 */
export const obtenerMisResenas = async () => {
  try {
    const response = await axios.get(`${API_URL}/mis-resenas`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener tus reseñas';
  }
};

/**
 * Verificar si puedo reseñar un producto
 */
export const puedeResenar = async (productoId) => {
  try {
    const response = await axios.get(`${API_URL}/puede-resenar/${productoId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return { puedeResenar: false, motivo: 'Error al verificar' };
  }
};

/**
 * Eliminar mi reseña
 */
export const eliminarResena = async (resenaId) => {
  try {
    const response = await axios.delete(`${API_URL}/${resenaId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar reseña';
  }
};

// ====== ENDPOINTS ADMIN ======

/**
 * Obtener reseñas pendientes de moderación (admin)
 */
export const obtenerResenasPendientes = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(`${API_URL}/pendientes`, {
      params: { page, size },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener reseñas pendientes';
  }
};

/**
 * Aprobar reseña (admin)
 */
export const aprobarResena = async (resenaId) => {
  try {
    const response = await axios.patch(`${API_URL}/${resenaId}/aprobar`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al aprobar reseña';
  }
};

/**
 * Rechazar reseña (admin)
 */
export const rechazarResena = async (resenaId) => {
  try {
    const response = await axios.patch(`${API_URL}/${resenaId}/rechazar`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al rechazar reseña';
  }
};

/**
 * Eliminar reseña (admin)
 */
export const eliminarResenaAdmin = async (resenaId) => {
  try {
    const response = await axios.delete(`${API_URL}/${resenaId}`, {
      headers: {
        ...getAuthHeaders(),
        'X-Is-Admin': 'true'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar reseña';
  }
};
