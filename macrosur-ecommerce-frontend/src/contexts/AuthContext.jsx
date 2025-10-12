import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// Importamos la API de autenticación
import * as authApi from '../api/auth'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // CLIENTE, ADMIN, GESTOR
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
                        // Obtener datos del usuario desde el backend
                        try {
                            const res = await fetch('http://localhost:8081/api/auth/me', {
                                headers: { 'Authorization': `Bearer ${storedToken}` }
                            });
                            if (res.ok) {
                                const userData = await res.json();
                                const userInfo = {
                                    id: userData.id,
                                    name: userData.nombre + ' ' + userData.apellido
                                };
                                const role = 'ADMIN'; // Mapear rolId a nombre después
                                
                                setUser(userInfo);
                                setUserRole(role);
                                setIsAuthenticated(true);
                            } else {
                                throw new Error('No se pudo obtener datos del usuario');
                            }
                        } catch (err) {
                            console.error('Error obteniendo datos del usuario:', err);
                            // Fallback con datos básicos del token
                            const payload = JSON.parse(atob(storedToken.split('.')[1]));
                            setUser({ id: 1, name: payload.sub || 'Admin' });
                            setUserRole('ADMIN');
                            setIsAuthenticated(true);
                        }
                    } else {
                        // Token inválido
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authTokenExpiry');
                        setUser(null);
                        setUserRole(null);
                        setIsAuthenticated(false);
                    }
                    // Si hay un expiry guardado y válido, programar cierre automático
                    const rawExpiry = localStorage.getItem('authTokenExpiry');
                    const expiry = rawExpiry ? parseInt(rawExpiry, 10) : Date.now() + SESSION_TTL;
                    if (expiry > Date.now()) {
                        const msUntil = expiry - Date.now();
                        // Limpiar timer anterior
                        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
                        logoutTimerRef.current = setTimeout(() => {
                            // Auto logout al expirar la sesión
                            logout();
                        }, msUntil);
                    } else {
                        // Expirado
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authTokenExpiry');
                        setUser(null);
                        setUserRole(null);
                        setIsAuthenticated(false);
                    }
                } catch (e) {
                    console.error('Error validando token:', e);
                    // Fallback: limpiar
                    localStorage.removeItem('authToken');
                    setUser(null);
                    setUserRole(null);
                    setIsAuthenticated(false);
                } finally {
                    setLoading(false);
                }
            };
            validate();
        }
        else {
            // No hay token: dejar de cargar
            setLoading(false);
        }
    }, []);

    const login = async (email, password, isAdmin) => {
        try {
            const response = await authApi.login(email, password, isAdmin);
            
            // Simulación de éxito
            localStorage.setItem('authToken', response.token);
            // Guardar expiry (ahora + TTL)
            const expiry = Date.now() + SESSION_TTL;
            localStorage.setItem('authTokenExpiry', expiry.toString());
            // Programar auto-logout cuando expire la sesión
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = setTimeout(() => logout(), SESSION_TTL);
            setUser({ id: response.userId, name: response.userName });
            setUserRole(response.role);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Fallo en el login:', error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authTokenExpiry');
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
    };

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        userRole,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};