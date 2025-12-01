import axios from 'axios';

const API_URL_PROVEEDORES = 'http://localhost:8081/api/logistica/proveedores';
const API_URL_OPERADORES = 'http://localhost:8081/api/logistica/operadores';
const API_URL = 'http://localhost:8081/api/logistica';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== PROVEEDORES ====================

export const obtenerProveedores = async () => {
  const response = await axios.get(API_URL_PROVEEDORES, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const crearProveedor = async (proveedorData) => {
  const response = await axios.post(API_URL_PROVEEDORES, proveedorData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const actualizarProveedor = async (proveedorId, proveedorData) => {
  const response = await axios.put(`${API_URL_PROVEEDORES}/${proveedorId}`, proveedorData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const eliminarProveedor = async (proveedorId) => {
  const response = await axios.delete(`${API_URL_PROVEEDORES}/${proveedorId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// ==================== OPERADORES LOGÍSTICOS ====================

export const obtenerOperadores = async () => {
  const response = await axios.get(API_URL_OPERADORES, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const crearOperador = async (operadorData) => {
  const response = await axios.post(API_URL_OPERADORES, operadorData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const actualizarOperador = async (operadorId, operadorData) => {
  const response = await axios.put(`${API_URL_OPERADORES}/${operadorId}`, operadorData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const eliminarOperador = async (operadorId) => {
  const response = await axios.delete(`${API_URL_OPERADORES}/${operadorId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};
