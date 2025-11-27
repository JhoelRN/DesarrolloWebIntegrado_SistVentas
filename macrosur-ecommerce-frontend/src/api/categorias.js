/**
 * API de Categorías
 * Funciones para consumir endpoints del backend relacionados con categorías
 */

import axios from 'axios';
import api from './axios';

const API_URL = 'http://localhost:8081/api/categorias';


// Obtener token de autenticación (si existe)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};



/**
 * Listar todas las categorías activas
 * Público - no requiere autenticación
 */
export const obtenerCategoriasActivas = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);
    throw error;
  }
};

/**
 * Listar todas las categorías (incluye inactivas)
 * Requiere autenticación
 */
export const obtenerTodasCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/todas`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener todas las categorías:', error);
    throw error;
  }
};

/**
 * Obtener árbol jerárquico de categorías
 * Público
 */
export const obtenerArbolCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/arbol`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener árbol de categorías:', error);
    throw error;
  }
};

/**
 * Obtener categorías visibles para clientes
 * Público
 */
export const obtenerCategoriasVisibles = async () => {
  try {
    const response = await axios.get(`${API_URL}/visibles`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías visibles:', error);
    throw error;
  }
};

/**
 * Obtener categoría por ID
 * Público
 */
export const obtenerCategoriaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener categoría ${id}:`, error);
    throw error;
  }
};

/**
 * Crear nueva categoría
 * Requiere autenticación y permiso GESTIONAR_CATEGORIAS
 */
export const crearCategoria = async (categoriaData) => {
  try {
    const response = await axios.post(API_URL, categoriaData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualizar categoría existente
 * Requiere autenticación y permiso GESTIONAR_CATEGORIAS
 */
export const actualizarCategoria = async (id, categoriaData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoriaData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar categoría ${id}:`, error);
    throw error;
  }
};

/**
 * Soft delete - desactivar categoría
 * Requiere autenticación y permiso GESTIONAR_CATEGORIAS
 */
export const desactivarCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/soft`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al desactivar categoría ${id}:`, error);
    throw error;
  }
};

/**
 * Hard delete - eliminar permanentemente categoría
 * Requiere autenticación y permiso GESTIONAR_CATEGORIAS
 */
export const eliminarCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/hard`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar categoría ${id}:`, error);
    throw error;
  }
};

/**
 * Reactivar categoría
 * Requiere autenticación y permiso GESTIONAR_CATEGORIAS
 */
export const reactivarCategoria = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/reactivar`, {}, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al reactivar categoría ${id}:`, error);
    throw error;
  }
};

/**
 * Buscar categorías por nombre
 * Público
 */
export const buscarCategorias = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { q: searchTerm },
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar categorías:', error);
    throw error;
  }
};

/**
 * Obtener categorías con filtros (alias compatible)
 * Público
 */
export const getCategorias = async (filters = {}) => {
    try {
        // Esto llamará a: http://localhost:8081/api/categorias
        const response = await api.get('/categorias', { params: filters });
        
        // Adaptamos la respuesta si es necesario
        // (Si Java devuelve una lista directa, la envolvemos en un objeto para que tu tabla no falle)
        const data = response.data;
        if (Array.isArray(data)) {
            return { content: data };
        }
        return data; 
    } catch (error) {
        console.error('Error conectando con el Backend:', error);
        // Fallback de emergencia (opcional)
        return { content: [] };
    }
};