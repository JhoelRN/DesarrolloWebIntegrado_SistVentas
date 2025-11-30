import axios from 'axios';

const API_URL = 'http://localhost:8081/api/logistica/alarmas';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const obtenerAlarmasActivas = async () => {
  const response = await axios.get(`${API_URL}/activas`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const obtenerTodasLasAlarmas = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const resolverAlarma = async (alarmaId) => {
  const response = await axios.patch(`${API_URL}/${alarmaId}/resolver`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};
