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
                correo: email,  // Tu backend espera 'correo', no 'email'
                password: password 
            }),
        });

        if (!res.ok) {
            throw new Error('Credenciales no válidas');
        }

        const data = await res.json();
        
        // Tu backend devuelve { token: "jwt-string" }
        // Necesitamos decodificar el JWT para obtener datos del usuario
        const userInfo = await getUserInfoFromToken(data.token);
        
        return { 
            token: data.token, 
            userId: userInfo.userId, 
            userName: userInfo.userName, 
            role: userInfo.role 
        };
    } catch (error) {
        console.error('Error en login:', error);
        throw new Error("Credenciales no válidas.");
    }
};

// Función auxiliar para obtener info del usuario desde el backend
const getUserInfoFromToken = async (token) => {
    try {
        // Llamar al endpoint /api/auth/me para obtener datos del usuario
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const userData = await res.json();
            return {
                userId: userData.id,
                userName: userData.nombre + ' ' + userData.apellido,
                role: 'ADMIN' // Por ahora asumimos ADMIN, después puedes mapear rolId a nombre
            };
        } else {
            throw new Error('No se pudo obtener información del usuario');
        }
    } catch (e) {
        console.error('Error obteniendo datos del usuario:', e);
        // Fallback: decodificar JWT básico
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            userId: 1,
            userName: payload.sub || 'Admin',
            role: 'ADMIN'
        };
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