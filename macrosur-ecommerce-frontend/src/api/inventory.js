import axios from 'axios';

const API_URL = 'http://localhost:8081/api/logistica/inventario';

// Obtener token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const obtenerInventarioCompleto = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerInventarioPorUbicacion = async (ubicacionId) => {
  const response = await axios.get(`${API_URL}/ubicacion/${ubicacionId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const ajustarInventario = async (ajusteData) => {
  const response = await axios.post(`${API_URL}/ajustar`, ajusteData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const transferirStock = async (transferenciaData) => {
  const response = await axios.post(`${API_URL}/transferir`, transferenciaData, {
    headers: getAuthHeader()
  });
  return response.data;
};
