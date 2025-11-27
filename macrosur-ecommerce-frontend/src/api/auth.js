const API_BASE = 'http://localhost:8081/api';

export const login = async (email, password, isAdmin) => {
    try {
        // Llamada real al backend Spring Boot
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                correo_corporativo: email,  // CORRECCIÓN: Backend espera 'correo_corporativo'
                contrasena: password        // CORRECCIÓN: Backend espera 'contrasena'
            }),
        });

        if (!res.ok) {
            throw new Error('Credenciales no válidas');
        }

        const data = await res.json();
        
        // Simplemente retornamos el token, los datos del usuario se obtendrán después
        return { 
            token: data.token
        };
    } catch (error) {
        console.error('Error en login:', error);
        throw new Error("Credenciales no válidas.");
    }
};

// Función para obtener datos completos del usuario autenticado
export const getCurrentUser = async (token) => {
    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error('No se pudo obtener información del usuario');
        }

        const userData = await res.json();
        
        // Retornar datos estructurados del usuario
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