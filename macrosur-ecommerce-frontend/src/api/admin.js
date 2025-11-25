// API para funciones administrativas
const API_BASE = 'http://localhost:8081/api'; // URL del backend Spring Boot

// Función auxiliar para obtener el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getRoles = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/roles`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Error fetching roles: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Error fetching users: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

export const createAdminUser = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error creating user: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

export const assignPermissionsToRole = async (rol_id, permisoIds) => {
  try {
    const res = await fetch(`${API_BASE}/admin/roles/${rol_id}/permissions`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(permisoIds)
    });
    
    if (!res.ok) {
      throw new Error(`Error assigning permissions: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error asignando permisos:', error);
    throw error;
  }
};

// Nuevas funciones para el manejo completo de la administración
export const getPermissions = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/permissions`, {
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Error fetching permissions: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    throw error;
  }
};

export const updateAdminUser = async (userId, payload) => {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error updating user: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!res.ok) {
      throw new Error(`Error deleting user: ${res.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    throw error;
  }
};

export const toggleUserStatus = async (userId, active) => {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ activo: active })
    });
    
    if (!res.ok) {
      throw new Error(`Error updating user status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error cambiando estado del usuario:', error);
    throw error;
  }
};

export default {
  getRoles,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleUserStatus,
  assignPermissionsToRole,
  getPermissions
};
