const API_BASE = 'http://localhost:8081/api';

export const login = async (email, password, isAdmin) => {
    try {
        // Decidir endpoint según tipo de usuario
        const endpoint = isAdmin ? `${API_BASE}/auth/login` : `${API_BASE}/clientes/login`;
        const bodyData = isAdmin 
            ? { correo_corporativo: email, contrasena: password }
            : { correo: email, contrasena: password };
        
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bodyData),
        });

        if (!res.ok) {
            throw new Error('Credenciales no válidas');
        }

        const data = await res.json();
        
        // Para admin: retornar el token JWT
        // Para cliente: retornar TODO el objeto (clienteId, nombre, apellido, correo, etc.)
        if (isAdmin) {
            return { 
                token: data.token || data.authToken
            };
        } else {
            // Cliente: retornar el objeto completo
            return data;
        }
    } catch (error) {
        console.error('Error en login:', error);
        throw new Error("Credenciales no válidas.");
    }
};

// Función para obtener datos completos del usuario autenticado
export const getCurrentUser = async (token, isAdmin = true) => {
    try {
        // Si es cliente, el token ES el objeto de datos del cliente
        if (!isAdmin && typeof token === 'object') {
            return {
                id: token.clienteId,
                name: `${token.nombre} ${token.apellido}`,
                email: token.correo,
                roleName: 'CLIENTE',
                permissions: [],
                isActive: true
            };
        }
        
        // Si es admin, consultar endpoint /auth/me
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error('No se pudo obtener información del usuario');
        }

        const userData = await res.json();
        
        // Retornar datos estructurados del usuario admin
        return {
            id: userData.usuario_admin_id,
            name: `${userData.nombre} ${userData.apellido}`,
            email: userData.correo_corporativo,
            rolId: userData.role?.rol_id,
            roleName: userData.role?.nombre_rol || 'UNKNOWN',
            permissions: userData.permissions ? userData.permissions.map(p => p.nombre_permiso) : [],
            isActive: userData.activo
        };
    } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        throw error;
    }
};

// Función para validar token (útil para AuthContext)
export const validateToken = async (token) => {
    try {
        const res = await fetch(`${API_BASE}/auth/validate`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return res.ok;
    } catch (error) {
        return false;
    }
};