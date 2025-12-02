/**
 * API de Productos
 * Funciones para consumir endpoints del backend relacionados con productos
 */

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/productos';

// Obtener token de autenticación (si existe)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Listar productos con paginación y filtros
 * Público - para catálogo de clientes
 * 
 * @param {Object} params - Parámetros de búsqueda y filtrado
 * @param {string} params.search - Búsqueda por código o nombre
 * @param {number} params.categoria - ID de categoría
 * @param {number} params.precioMin - Precio mínimo
 * @param {number} params.precioMax - Precio máximo
 * @param {number} params.page - Número de página (default: 0)
 * @param {number} params.size - Tamaño de página (default: 20)
 * @param {string} params.sortBy - Campo de ordenamiento
 * @param {string} params.sortDir - Dirección (asc/desc)
 */
export const listarProductos = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, { 
      params,
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al listar productos:', error);
    throw error;
  }
};

/**
 * Obtener producto por ID (información completa)
 * Público
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener productos relacionados
 * Público
 */
export const obtenerProductosRelacionados = async (id, limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/relacionados`, {
      params: { limit },
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos relacionados de ${id}:`, error);
    throw error;
  }
};

/**
 * Crear nuevo producto
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const crearProducto = async (productoData) => {
  try {
    console.log('🚀 Enviando datos de creación:', JSON.stringify(productoData, null, 2));
    const response = await axios.post(API_URL, productoData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    console.error('📛 Response data:', error.response?.data);
    console.error('📛 Response status:', error.response?.status);
    console.error('📛 Response headers:', error.response?.headers);
    throw error;
  }
};

/**
 * Actualizar producto existente
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const actualizarProducto = async (id, productoData) => {
  try {
    console.log('📝 Actualizando producto', id);
    console.log('📦 Datos a enviar:', JSON.stringify(productoData, null, 2));
    const response = await axios.put(`${API_URL}/${id}`, productoData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Producto actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar producto ${id}:`, error);
    console.error('📦 Datos enviados:', JSON.stringify(productoData, null, 2));
    console.error('🔴 Error completo:', error.response?.data);
    console.error('🔴 Status:', error.response?.status);
    console.error('🔴 Mensaje:', error.response?.data?.message || error.response?.data?.error);
    
    // Mostrar validaciones específicas si existen
    if (error.response?.data?.errors) {
      console.error('🔴 Errores de validación:', error.response.data.errors);
    }
    
    throw error;
  }
};

/**
 * Soft delete - desactivar producto
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const desactivarProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/soft`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al desactivar producto ${id}:`, error);
    throw error;
  }
};

/**
 * Hard delete - eliminar permanentemente producto
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const eliminarProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/hard`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar producto ${id}:`, error);
    throw error;
  }
};

/**
 * Reactivar producto
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const reactivarProducto = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/reactivar`, {}, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al reactivar producto ${id}:`, error);
    throw error;
  }
};

/**
 * Cambiar estado activo/inactivo de un producto
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const cambiarEstadoProducto = async (id, activo) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/estado`, 
      { activo }, 
      { headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al cambiar estado del producto ${id}:`, error);
    throw error;
  }
};

/**
 * Obtener estadísticas de productos
 * Requiere autenticación y permiso GESTIONAR_PRODUCTOS
 */
export const obtenerEstadisticasProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * Helper: Construir parámetros de búsqueda para filtros
 */
export const buildSearchParams = ({ search, categoria, precioMin, precioMax, page = 0, size = 20, sortBy = 'nombreProducto', sortDir = 'asc' }) => {
  const params = {
    page,
    size,
    sortBy,
    sortDir
  };

  if (search) params.search = search;
  if (categoria) params.categoria = categoria;
  if (precioMin !== null && precioMin !== undefined) params.precioMin = precioMin;
  if (precioMax !== null && precioMax !== undefined) params.precioMax = precioMax;

  return params;
};
