-- Insertar cliente de prueba para el carrito de compras
INSERT INTO clientes (cliente_id, nombre, email, telefono, fecha_registro, activo)
VALUES (1, 'Cliente Prueba', 'cliente@test.com', '912345678', NOW(), 1)
ON DUPLICATE KEY UPDATE
    nombre = 'Cliente Prueba',
    email = 'cliente@test.com',
    telefono = '912345678',
    activo = 1;

-- Verificar
SELECT * FROM clientes WHERE cliente_id = 1;
