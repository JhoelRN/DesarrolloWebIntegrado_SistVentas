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
    const SESSION_TTL = 24 * 60 * 60 * 0.1; // 24 horas por defecto (en ms)

    useEffect(() => {
        // Lógica para verificar el token en localStorage al cargar la app
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // Simular validación asíncrona del token (p. ej. llamada a /auth/validate)
            const validate = async () => {
                try {
                    // Simulación: esperar 300ms y establecer usuario por defecto
                    await new Promise(res => setTimeout(res, 300));
                    // En desarrollo podemos inferir role desde el token string (p. ej. 'admin-token')
                    const decodedRole = storedToken === 'admin-token' ? 'ADMIN' : 'CLIENTE';
                    setUser({ id: decodedRole === 'ADMIN' ? 1 : 101, name: decodedRole === 'ADMIN' ? 'Admin' : 'Cliente' });
                    setUserRole(decodedRole);
                    setIsAuthenticated(true);
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