import axios from 'axios';

const API_URL = 'http://localhost:8081/api/logistica/ordenes-reposicion';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const crearOrdenReposicion = async (ordenData) => {
  const response = await axios.post(API_URL, ordenData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerTodasLasOrdenes = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerOrdenesPorEstado = async (estado) => {
  const response = await axios.get(`${API_URL}/estado/${estado}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const autorizarOrden = async (ordenId, usuarioAdminId) => {
  const response = await axios.patch(
    `${API_URL}/${ordenId}/autorizar`,
    null,
    {
      params: { usuarioAdminId },
      headers: getAuthHeader()
    }
  );
  return response.data;
};

export const rechazarOrden = async (ordenId) => {
  const response = await axios.patch(`${API_URL}/${ordenId}/rechazar`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const recibirMercancia = async (recepcionData) => {
  const response = await axios.post(`${API_URL}/recibir`, recepcionData, {
    headers: getAuthHeader()
  });
  return response.data;
};
