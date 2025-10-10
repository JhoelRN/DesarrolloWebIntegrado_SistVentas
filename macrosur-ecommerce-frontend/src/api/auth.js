export const login = async (email, password, isAdmin) => {
    // --- STUB (entorno local / pruebas) ---
    // Simulación de validación simple para desarrollo local.
    if (isAdmin) {
        if (email === 'admin@macrosur.com' && password === 'admin') {
            return { token: 'admin-token', userId: 1, userName: 'Admin', role: 'ADMIN' };
        }
    } else {
        if (email === 'cliente@test.com' && password === 'cliente') {
            return { token: 'client-token', userId: 101, userName: 'Juan Pérez', role: 'CLIENTE' };
        }
    }

    // --- EJEMPLO DE LLAMADA REAL AL BACKEND (COMENTADO) ---
    // En producción deberías reemplazar el stub por una llamada a tu API,
    // por ejemplo usando fetch/axios:
    //
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, isAdmin }),
    // });
    // if (!res.ok) throw new Error('Credenciales no válidas');
    // const data = await res.json();
    // return { token: data.token, userId: data.user.id, userName: data.user.name, role: data.user.role };

    // Si falla (credenciales incorrectas)
    throw new Error("Credenciales no válidas.");
};