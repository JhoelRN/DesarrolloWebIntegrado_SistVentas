import axios from 'axios';

// URL BASE: Apunta a tu futuro backend Java EE (cuando exista)
const API_URL = 'http://localhost:8080/MacroSur_JAXRS/api/auth'; 


const MOCK_MODE = true; 

const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (credentials) => {
    if (MOCK_MODE) {
        await mockDelay(1000); 
        
        // Simular error si el correo es "error@test.com"
        if (credentials.email === "error@test.com") {
            throw { response: { data: { message: "Credenciales inválidas" } } };
        }
        
        return {
            token: "mock-jwt-token-xyz-123",
            user: {
                id: 1,
                nombre: "Usuario Prueba",
                email: credentials.email,
                role: "CLIENTE"
            }
        };
    }
    
    // Modo Real (Se activará cuando MOCK_MODE sea false)
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const register = async (userData) => {
    if (MOCK_MODE) {
        await mockDelay(1500);
        return {
            success: true,
            message: "Usuario registrado exitosamente"
        };
    }

    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};