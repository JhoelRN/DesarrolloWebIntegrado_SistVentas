import React, { createContext, useContext, useState, useEffect } from 'react';
// Importamos la API de autenticación
import * as authApi from '../api/auth'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // CLIENTE, ADMIN, GESTOR

    useEffect(() => {
        // Lógica para verificar el token en localStorage al cargar la app
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            // Aquí se haría una llamada a la API para validar el token y obtener datos del usuario
            // En un entorno real, esto llenaría los datos del usuario y el rol
            const decodedPayload = { /* Lógica de decodificación y validación */ };
            
            setUser({ id: decodedPayload.id, name: decodedPayload.name });
            setUserRole(decodedPayload.role || 'CLIENTE'); // Asignar el rol
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email, password, isAdmin) => {
        try {
            const response = await authApi.login(email, password, isAdmin);
            
            // Simulación de éxito
            localStorage.setItem('authToken', response.token);
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
    };

    const contextValue = {
        user,
        isAuthenticated,
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