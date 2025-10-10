// API stubs for admin-related backend calls
// These functions currently simulate behavior for local development.
// Replace simulated returns with real fetch/axios calls to your backend.

const API_BASE = '/api'; // Cambia por la URL de tu backend si es necesario

export const getRoles = async () => {
  // Ejemplo de llamada real:
  // const res = await fetch(`${API_BASE}/roles`);
  // if (!res.ok) throw new Error('Error fetching roles');
  // return res.json();

  // Stub local
  return [
    { rol_id: 1, nombre_rol: 'ADMIN' },
    { rol_id: 2, nombre_rol: 'GESTOR_LOGISTICA' },
    { rol_id: 3, nombre_rol: 'GESTOR_PRODUCTOS' },
    { rol_id: 4, nombre_rol: 'GESTOR_COMERCIAL' },
  ];
};

export const getAdminUsers = async () => {
  // Ejemplo real:
  // const res = await fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
  // if (!res.ok) throw new Error('Error fetching users');
  // return res.json();

  // Stub
  return [
    { usuario_admin_id: 1, rol_id: 1, nombre: 'Admin', apellido: 'Macrosur', correo_corporativo: 'admin@macrosur.com', activo: true }
  ];
};

export const createAdminUser = async (payload) => {
  // payload: { rol_id, nombre, apellido, correo_corporativo, contrasena }
  // Ejemplo real (backend debe recibir y guardar hash):
  // const res = await fetch(`${API_BASE}/admin/users`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  // if (!res.ok) throw new Error('Error creating user');
  // return res.json();

  // Stub: devolver el objeto creado con id simulado
  return { usuario_admin_id: 999, ...payload, activo: true };
};

export const assignPermissionsToRole = async (rol_id, permisoIds) => {
  // Ejemplo real:
  // await fetch(`${API_BASE}/roles/${rol_id}/permissions`, { method: 'PUT', body: JSON.stringify(permisoIds) })
  return { success: true };
};

export default {
  getRoles,
  getAdminUsers,
  createAdminUser,
  assignPermissionsToRole
};
