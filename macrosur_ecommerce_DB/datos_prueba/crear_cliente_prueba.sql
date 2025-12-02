-- Crear cliente de prueba con contraseña: password123
-- Password hash generado con BCrypt (10 rounds)

-- Eliminar si existe
DELETE FROM clientes WHERE correo = 'test@example.com';

-- Insertar cliente nuevo
INSERT INTO clientes (nombre, apellido, correo, contrasena_hash, telefono, fecha_registro)
VALUES (
    'Juan',
    'Pérez',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password123
    '+56912345678',
    NOW()
);

-- Mostrar el cliente creado
SELECT cliente_id, nombre, apellido, correo, telefono FROM clientes WHERE correo = 'test@example.com';
