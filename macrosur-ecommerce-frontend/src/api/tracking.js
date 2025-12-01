import axios from 'axios';

const API_URL = 'http://localhost:8081/api/logistica/seguimiento';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const crearSeguimiento = async (seguimientoData) => {
  const response = await axios.post(API_URL, seguimientoData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerSeguimientoPorPedido = async (pedidoId) => {
  const response = await axios.get(`${API_URL}/pedido/${pedidoId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerSeguimientoPorGuia = async (numeroGuia) => {
  const response = await axios.get(`${API_URL}/guia/${numeroGuia}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const actualizarEstadoEnvio = async (seguimientoId, nuevoEstado) => {
  const response = await axios.patch(
    `${API_URL}/${seguimientoId}/estado`,
    null,
    {
      params: { nuevoEstado },
      headers: getAuthHeader()
    }
  );
  return response.data;
};

export const obtenerTodosSeguimientos = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};
