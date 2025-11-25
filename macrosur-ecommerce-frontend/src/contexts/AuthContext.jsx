import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// Importamos la API de autenticación
import * as authApi from '../api/auth'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const logoutTimerRef = useRef(null);
    const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 horas por defecto (en ms)

    useEffect(() => {
        // Lógica para verificar el token en localStorage al cargar la app
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // Validar token real con el backend
            const validate = async () => {
                try {
                    // Intentar validar el token con el backend
                    const isValid = await authApi.validateToken(storedToken);
                    if (isValid) {
                        // Obtener datos completos del usuario desde el backend
                        const userData = await authApi.getCurrentUser(storedToken);
                        
                        console.log('🔍 AuthContext - Datos del usuario:', userData);
                        
                        setUser({
                            id: userData.id,
                            name: userData.name,
                            email: userData.email
                        });
                        setUserRole(userData.roleName);
                        setUserPermissions(userData.permissions);
                        setIsAuthenticated(true);
                        
                        console.log('✅ AuthContext - Usuario autenticado:', {
                            role: userData.roleName,
                            permissions: userData.permissions
                        });
                    } else {
                        // Token inválido
                        clearAuthData();
                    }
                    
                    // Programar auto-logout basado en expiración
                    setupAutoLogout();
                } catch (e) {
                    console.error('Error validando token:', e);
                    clearAuthData();
                } finally {
                    setLoading(false);
                }
            };
            validate();
        } else {
            // No hay token: dejar de cargar
            setLoading(false);
        }
    }, []);

    // Función auxiliar para limpiar datos de autenticación
    const clearAuthData = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        setUser(null);
        setUserRole(null);
        setUserPermissions([]);
        setIsAuthenticated(false);
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    // Función auxiliar para configurar auto-logout
    const setupAutoLogout = () => {
        const rawExpiry = localStorage.getItem('authTokenExpiry');
        const expiry = rawExpiry ? parseInt(rawExpiry, 10) : Date.now() + SESSION_TTL;
        
        if (expiry > Date.now()) {
            const msUntil = expiry - Date.now();
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = setTimeout(() => logout(), msUntil);
        } else {
            clearAuthData();
        }
    };

    const login = async (email, password, isAdmin) => {
        try {
            const response = await authApi.login(email, password, isAdmin);
            
            // Guardar token
            localStorage.setItem('authToken', response.token);
            const expiry = Date.now() + SESSION_TTL;
            localStorage.setItem('authTokenExpiry', expiry.toString());
            
            // Obtener datos completos del usuario
            const userData = await authApi.getCurrentUser(response.token);
            
            console.log('🔍 Login - Datos del usuario:', userData);
            
            setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email
            });
            setUserRole(userData.roleName);
            setUserPermissions(userData.permissions);
            setIsAuthenticated(true);
            
            console.log('✅ Login - Usuario autenticado:', {
                role: userData.roleName,
                permissions: userData.permissions
            });
            
            // Configurar auto-logout
            setupAutoLogout();
            
            return true;
        } catch (error) {
            console.error('Fallo en el login:', error);
            return false;
        }
    };

    const logout = () => {
        clearAuthData();
    };

    // Función para verificar si el usuario tiene un permiso específico
    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    // Función para verificar si el usuario tiene un rol específico
    const hasRole = (role) => {
        return userRole === role;
    };

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        userRole,
        userPermissions,
        login,
        logout,
        hasPermission,
        hasRole
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};