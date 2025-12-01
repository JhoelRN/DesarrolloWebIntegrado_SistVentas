/**
 * API para gestión de promociones
 * Patrón: Service Layer (Frontend)
 * 
 * Encapsula las llamadas Ajax (GET/POST/PUT) al backend REST
 * Soporta tanto React como vistas JSF híbridas
 */

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/promociones';

/**
 * Obtener headers con autenticación de administrador
 */
const getAuthHeaders = () => {
  const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const headers = {};
  
  if (authToken) {
    try {
      // Para admin, authToken es un JWT
      headers['Authorization'] = `Bearer ${authToken}`;
    } catch (e) {
      console.error('Error parseando authToken:', e);
    }
  }
  
  return headers;
};

// =============== CRUD BÁSICO ===============

/**
 * Obtener todas las promociones
 * Ajax Method: GET
 * Endpoint: GET /api/promociones
 */
export const obtenerPromociones = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    throw error.response?.data?.error || 'Error al obtener las promociones';
  }
};

/**
 * Obtener promociones activas (público)
 * Ajax Method: GET
 * Endpoint: GET /api/promociones/activas
 */
export const obtenerPromocionesActivas = async () => {
  try {
    const response = await axios.get(`${API_URL}/activas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener promociones activas:', error);
    throw error.response?.data?.error || 'Error al obtener promociones activas';
  }
};

/**
 * Obtener promoción por ID
 * Ajax Method: GET
 * Endpoint: GET /api/promociones/{id}
 */
export const obtenerPromocionPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener promoción ${id}:`, error);
    throw error.response?.data?.error || 'Promoción no encontrada';
  }
};

/**
 * Crear nueva promoción
 * Ajax Method: POST
 * Endpoint: POST /api/promociones
 * Body: PromocionDTO
 */
export const crearPromocion = async (promocionData) => {
  try {
    const response = await axios.post(API_URL, promocionData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear promoción:', error);
    throw error.response?.data?.error || 'Error al crear la promoción';
  }
};

/**
 * Actualizar promoción existente
 * Ajax Method: PUT
 * Endpoint: PUT /api/promociones/{id}
 * Body: PromocionDTO
 */
export const actualizarPromocion = async (id, promocionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, promocionData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar promoción ${id}:`, error);
    throw error.response?.data?.error || 'Error al actualizar la promoción';
  }
};

/**
 * Eliminar promoción
 * Ajax Method: DELETE
 * Endpoint: DELETE /api/promociones/{id}
 */
export const eliminarPromocion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar promoción ${id}:`, error);
    throw error.response?.data?.error || 'Error al eliminar la promoción';
  }
};

// =============== BÚSQUEDA Y FILTROS ===============

/**
 * Buscar promociones por nombre
 * Ajax Method: GET
 * Endpoint: GET /api/promociones/buscar?nombre={nombre}
 */
export const buscarPromocionesPorNombre = async (nombre) => {
  try {
    const response = await axios.get(`${API_URL}/buscar`, {
      params: { nombre },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar promociones:', error);
    throw error.response?.data?.error || 'Error en la búsqueda';
  }
};

/**
 * Filtrar promociones por tipo
 * Ajax Method: GET
 * Endpoint: GET /api/promociones/tipo/{tipo}
 * 
 * @param {string} tipo - "Porcentaje", "Monto Fijo", "2x1", "Envio Gratis"
 */
export const obtenerPromocionesPorTipo = async (tipo) => {
  try {
    const response = await axios.get(`${API_URL}/tipo/${tipo}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener promociones de tipo ${tipo}:`, error);
    throw error.response?.data?.error || 'Error al filtrar por tipo';
  }
};

// =============== ESTADÍSTICAS ===============

/**
 * Obtener estadísticas de promociones
 * Ajax Method: GET
 * Endpoint: GET /api/promociones/estadisticas
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error.response?.data?.error || 'Error al obtener estadísticas';
  }
};

// =============== CÁLCULOS ===============

/**
 * Calcular descuento para un precio dado
 * Ajax Method: POST
 * Endpoint: POST /api/promociones/{id}/calcular-descuento
 * Body: { precio: number }
 */
export const calcularDescuento = async (promocionId, precio) => {
  try {
    const response = await axios.post(
      `${API_URL}/${promocionId}/calcular-descuento`,
      { precio },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al calcular descuento:', error);
    throw error.response?.data?.error || 'Error al calcular el descuento';
  }
};

// =============== UTILIDADES ===============

/**
 * Tipos de descuento disponibles
 * IMPORTANTE: Los valores deben coincidir exactamente con el enum TipoDescuento del backend
 * Backend enum: Porcentaje, Monto_Fijo, Dos_X_Uno, Envio_Gratis
 */
export const TIPOS_DESCUENTO = [
  { value: 'Porcentaje', label: 'Descuento Porcentual (%)' },
  { value: 'Monto_Fijo', label: 'Descuento Monto Fijo ($)' },
  { value: 'Dos_X_Uno', label: 'Promoción 2x1' },
  { value: 'Envio_Gratis', label: 'Envío Gratis' }
];

/**
 * Validar datos de promoción antes de enviar
 */
export const validarPromocion = (promocion) => {
  const errores = [];

  if (!promocion.nombreRegla || promocion.nombreRegla.trim().length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres');
  }

  if (!promocion.tipoDescuento) {
    errores.push('Debe seleccionar un tipo de descuento');
  }

  // Para 2x1 y Envío Gratis, el valor puede ser 0
  const permiteCero = promocion.tipoDescuento === 'Dos_X_Uno' || promocion.tipoDescuento === 'Envio_Gratis';
  
  if (!permiteCero && (!promocion.valorDescuento || promocion.valorDescuento <= 0)) {
    errores.push('El valor del descuento debe ser mayor a 0');
  }

  if (promocion.valorDescuento < 0) {
    errores.push('El valor del descuento no puede ser negativo');
  }

  if (promocion.tipoDescuento === 'Porcentaje' && promocion.valorDescuento > 100) {
    errores.push('El porcentaje no puede ser mayor a 100');
  }

  if (promocion.fechaInicio && promocion.fechaFin) {
    const inicio = new Date(promocion.fechaInicio);
    const fin = new Date(promocion.fechaFin);
    if (fin <= inicio) {
      errores.push('La fecha de fin debe ser posterior a la fecha de inicio');
    }
  }

  if (promocion.acumulable && promocion.exclusivo) {
    errores.push('Una promoción no puede ser acumulable y exclusiva al mismo tiempo');
  }

  return errores;
};

/**
 * Formatear fecha para inputs datetime-local
 */
export const formatearFechaParaInput = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.toISOString().slice(0, 16);
};

/**
 * Obtener badge de estado
 */
export const obtenerEstadoBadge = (promocion) => {
  if (!promocion) return 'secondary';
  
  switch (promocion.estadoTexto) {
    case 'Activa': return 'success';
    case 'Programada': return 'info';
    case 'Expirada': return 'secondary';
    default: return 'light';
  }
};

export default {
  obtenerPromociones,
  obtenerPromocionesActivas,
  obtenerPromocionPorId,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
  buscarPromocionesPorNombre,
  obtenerPromocionesPorTipo,
  obtenerEstadisticas,
  calcularDescuento,
  validarPromocion,
  formatearFechaParaInput,
  obtenerEstadoBadge,
  TIPOS_DESCUENTO
};
