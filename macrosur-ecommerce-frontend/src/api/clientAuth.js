/**
 * API de autenticación para clientes
 * Maneja login manual, registro y OAuth (Google, Microsoft)
 */

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/clientes';

// Configuración OAuth2 (Deshabilitado - Solo login manual disponible)
const OAUTH_CONFIG = {
  google: {
    enabled: false // Deshabilitado por ahora
  },
  microsoft: {
    enabled: false // Deshabilitado por ahora
  }
};

/**
 * Guardar cliente en localStorage
 */
const guardarCliente = (clienteData) => {
  localStorage.setItem('cliente', JSON.stringify(clienteData));
  localStorage.setItem('clienteId', clienteData.clienteId);
  if (clienteData.token) {
    localStorage.setItem('clientToken', clienteData.token);
  }
};

/**
 * Obtener cliente actual
 */
export const obtenerClienteActual = () => {
  const clienteStr = localStorage.getItem('cliente');
  return clienteStr ? JSON.parse(clienteStr) : null;
};

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = () => {
  const clienteId = localStorage.getItem('clienteId');
  const token = localStorage.getItem('clientToken');
  
  const headers = {};
  if (clienteId) {
    headers['X-Cliente-Id'] = clienteId;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Registrar nuevo cliente
 */
export const registrarCliente = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/registro`, datos);
    if (response.data) {
      guardarCliente(response.data);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al registrar cliente';
  }
};

/**
 * Login manual (correo y contraseña)
 */
export const loginManual = async (correo, contrasena) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { correo, contrasena });
    if (response.data) {
      guardarCliente(response.data);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Credenciales inválidas';
  }
};

/**
 * Iniciar flujo OAuth con Google (Deshabilitado)
 */
export const loginConGoogle = () => {
  alert('🚧 Función en desarrollo\n\nEl login con Google no está disponible por el momento.\nPor favor usa el login manual con correo y contraseña.');
  console.log('ℹ️ Login con Google deshabilitado - usar login manual');
};

/**
 * Iniciar flujo OAuth con Microsoft (Deshabilitado)
 */
export const loginConMicrosoft = () => {
  alert('🚧 Función en desarrollo\n\nEl login con Microsoft no está disponible por el momento.\nPor favor usa el login manual con correo y contraseña.');
  console.log('ℹ️ Login con Microsoft deshabilitado - usar login manual');
};

/**
 * Procesar callback de OAuth
 */
export const procesarCallbackOAuth = async (hash) => {
  try {
    const params = new URLSearchParams(hash.substring(1));
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const provider = localStorage.getItem('oauth_provider');

    // Validar state
    const expectedState = localStorage.getItem('oauth_state');
    if (state !== expectedState) {
      throw new Error('Estado de OAuth inválido');
    }

    // Decodificar ID token (simple, sin verificar firma)
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    
    // Extraer datos según el provider
    let datos;
    if (provider === 'google') {
      datos = {
        provider: 'google',
        oauthId: payload.sub,
        nombre: payload.given_name || '',
        apellido: payload.family_name || '',
        correo: payload.email,
        avatarUrl: payload.picture
      };
    } else if (provider === 'microsoft') {
      datos = {
        provider: 'microsoft',
        oauthId: payload.oid || payload.sub,
        nombre: payload.given_name || '',
        apellido: payload.family_name || '',
        correo: payload.email || payload.preferred_username,
        avatarUrl: null // Microsoft no provee foto en el token
      };
    }

    // Enviar al backend
    const response = await axios.post(`${API_URL}/oauth-login`, datos);
    if (response.data) {
      guardarCliente(response.data);
    }

    // Limpiar
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_provider');

    return response.data;
  } catch (error) {
    console.error('Error en callback OAuth:', error);
    throw error.response?.data?.error || 'Error al procesar login social';
  }
};

/**
 * Obtener perfil del cliente
 */
export const obtenerPerfil = async () => {
  try {
    // Intentar obtener token del AuthContext primero (login unificado)
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    let headers = {};
    
    if (authToken) {
      // Si hay authToken, intentar parsearlo como objeto (cliente) o usar como token
      try {
        const clientData = JSON.parse(authToken);
        if (clientData.clienteId) {
          headers['X-Cliente-Id'] = clientData.clienteId;
        }
      } catch {
        // Si no se puede parsear, es un token JWT de admin (ignorar para clientes)
      }
    } else {
      // Fallback al sistema antiguo
      headers = getAuthHeaders();
    }
    
    const response = await axios.get(`${API_URL}/perfil`, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al obtener perfil';
  }
};

/**
 * Actualizar perfil del cliente
 */
export const actualizarPerfil = async (datos) => {
  try {
    // Intentar obtener token del AuthContext primero (login unificado)
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    let headers = {};
    
    if (authToken) {
      try {
        const clientData = JSON.parse(authToken);
        if (clientData.clienteId) {
          headers['X-Cliente-Id'] = clientData.clienteId;
        }
      } catch {
        // Token inválido o JWT de admin
      }
    } else {
      headers = getAuthHeaders();
    }
    
    const response = await axios.put(`${API_URL}/perfil`, datos, { headers });
    
    // Actualizar en localStorage si existe
    if (authToken) {
      try {
        const clientData = JSON.parse(authToken);
        const clienteActualizado = { ...clientData, ...response.data };
        const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
        storage.setItem('authToken', JSON.stringify(clienteActualizado));
      } catch {
        // No actualizar si es JWT
      }
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al actualizar perfil';
  }
};

/**
 * Cambiar contraseña
 */
export const cambiarContrasena = async (contrasenaActual, contrasenaNueva) => {
  try {
    // Intentar obtener token del AuthContext primero (login unificado)
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    let headers = {};
    
    if (authToken) {
      try {
        const clientData = JSON.parse(authToken);
        if (clientData.clienteId) {
          headers['X-Cliente-Id'] = clientData.clienteId;
        }
      } catch {
        // Token inválido
      }
    } else {
      headers = getAuthHeaders();
    }
    
    const response = await axios.post(`${API_URL}/cambiar-contrasena`, {
      contrasenaActual,
      contrasenaNueva
    }, { headers });
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al cambiar contraseña';
  }
};

/**
 * Cerrar sesión
 */
export const logout = () => {
  localStorage.removeItem('cliente');
  localStorage.removeItem('clienteId');
  localStorage.removeItem('clientToken');
  window.location.href = '/';
};

/**
 * Verificar si está autenticado
 */
export const estaAutenticado = () => {
  return !!localStorage.getItem('clienteId');
};
