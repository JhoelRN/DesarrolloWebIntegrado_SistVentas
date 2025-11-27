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
    const [rememberMe, setRememberMe] = useState(false);
    const logoutTimerRef = useRef(null);
    const activityTimerRef = useRef(null);
    const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 horas si "Recordarme"
    const SESSION_TTL_SHORT = 2 * 60 * 60 * 1000; // 2 horas sesión normal
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos de inactividad

    useEffect(() => {
        // Lógica para verificar el token en localStorage/sessionStorage al cargar la app
        const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (storedToken) {
            setRememberMe(storedRememberMe);
            
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
                        
                        // Programar auto-logout y detección de inactividad
                        setupAutoLogout(storedRememberMe);
                        setupInactivityDetection();
                    } else {
                        // Token inválido
                        clearAuthData();
                    }
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
        // Limpiar tanto localStorage como sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authTokenExpiry');
        
        setUser(null);
        setUserRole(null);
        setUserPermissions([]);
        setIsAuthenticated(false);
        setRememberMe(false);
        
        // Limpiar timers
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
        if (activityTimerRef.current) {
            clearTimeout(activityTimerRef.current);
            activityTimerRef.current = null;
        }
        
        // Remover listeners de actividad
        document.removeEventListener('mousemove', resetInactivityTimer);
        document.removeEventListener('keydown', resetInactivityTimer);
        document.removeEventListener('click', resetInactivityTimer);
    };

    // Función auxiliar para configurar auto-logout
    const setupAutoLogout = (remember = false) => {
        const storage = remember ? localStorage : sessionStorage;
        const rawExpiry = storage.getItem('authTokenExpiry');
        const expiry = rawExpiry ? parseInt(rawExpiry, 10) : Date.now() + (remember ? SESSION_TTL : SESSION_TTL_SHORT);
        
        if (expiry > Date.now()) {
            const msUntil = expiry - Date.now();
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = setTimeout(() => {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                logout();
            }, msUntil);
        } else {
            clearAuthData();
        }
    };

    // Detección de inactividad (estándar: 30 min sin actividad)
    const resetInactivityTimer = () => {
        if (activityTimerRef.current) {
            clearTimeout(activityTimerRef.current);
        }
        activityTimerRef.current = setTimeout(() => {
            alert('Tu sesión se cerró por inactividad.');
            logout();
        }, INACTIVITY_TIMEOUT);
    };

    const setupInactivityDetection = () => {
        // Escuchar eventos de actividad del usuario
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keydown', resetInactivityTimer);
        document.addEventListener('click', resetInactivityTimer);
        
        // Iniciar el timer
        resetInactivityTimer();
    };

    const login = async (email, password, isAdmin, remember = false) => {
        try {
            const response = await authApi.login(email, password, isAdmin);
            
            // Decidir storage según "Recordarme"
            const storage = remember ? localStorage : sessionStorage;
            const ttl = remember ? SESSION_TTL : SESSION_TTL_SHORT;
            
            // Guardar token y email
            storage.setItem('authToken', response.token);
            storage.setItem('userEmail', email);
            const expiry = Date.now() + ttl;
            storage.setItem('authTokenExpiry', expiry.toString());
            
            // Guardar preferencia de recordar en localStorage
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            setRememberMe(remember);
            
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
                permissions: userData.permissions,
                rememberMe: remember,
                sessionTTL: remember ? '24 horas' : '2 horas'
            });
            
            // Configurar auto-logout y detección de inactividad
            setupAutoLogout(remember);
            setupInactivityDetection();
            
            return true;
        } catch (error) {
            console.error('Fallo en el login:', error);
            return false;
        }
    };

    const logout = (showMessage = false) => {
        if (showMessage) {
            // Opcional: mostrar mensaje de despedida
            console.log('👋 Sesión cerrada correctamente');
        }
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