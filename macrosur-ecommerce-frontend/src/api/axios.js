import axios from 'axios';

// Creamos una instancia de axios conectada a tu backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Lee la URL del archivo .env
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR (Opcional pero recomendado):
// Si tienes un token guardado (login), lo envía automáticamente al backend.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;