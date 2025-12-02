/**
 * API para gestión de reseñas (Admin)
 * Usa JWT token en lugar de X-Cliente-Id
 */

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/resenas';

/**
 * Obtener headers con JWT de admin
 */
const getAdminHeaders = () => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Listar todas las reseñas (admin) con filtro opcional por estado
 */
export const listarResenas = async (estado = null, page = 0, size = 10) => {
  try {
    const params = { page, size };
    if (estado) {
      params.estado = estado;
    }
    
    const response = await axios.get(`${API_URL}/pendientes`, {
      params,
      headers: getAdminHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al listar reseñas';
  }
};

/**
 * Aprobar reseña (admin)
 */
export const aprobarResena = async (resenaId) => {
  try {
    const response = await axios.patch(`${API_URL}/${resenaId}/aprobar`, {}, {
      headers: getAdminHeaders()
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
      headers: getAdminHeaders()
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
      headers: getAdminHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al eliminar reseña';
  }
};

/**
 * Obtener estadísticas de reseñas (admin)
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/estadisticas`, {
      headers: getAdminHeaders()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener estadísticas';
  }
};
