export const login = async (email, password, isAdmin) => {
    // Simulación de validación simple
    if (isAdmin) {
        if (email === 'admin@macrosur.com' && password === 'admin') {
            return { token: 'admin-token', userId: 1, userName: 'Admin', role: 'ADMIN' };
        }
    } else {
        if (email === 'cliente@test.com' && password === 'cliente') {
            return { token: 'client-token', userId: 101, userName: 'Juan Pérez', role: 'CLIENTE' };
        }
    }
    // Si falla
    throw new Error("Credenciales no válidas.");
};