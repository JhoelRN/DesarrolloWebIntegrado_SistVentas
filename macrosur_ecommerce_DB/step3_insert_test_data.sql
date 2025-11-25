USE macrosur_ecommerce;

-- =====================================================
-- PASO 3: INSERTAR DATOS DE PRUEBA PARA REPORTES
-- =====================================================

-- INSERTAR CATEGORÍAS DE PRUEBA
INSERT IGNORE INTO Categorias (nombre, descripcion, visible_cliente) VALUES
('Hogar y Decoración', 'Productos para el hogar y decoración', true),
('Textiles', 'Ropa de cama y textiles para el hogar', true),
('Muebles', 'Muebles y mobiliario diverso', true),
('Electrodomésticos', 'Electrodomésticos para el hogar', true);

-- INSERTAR PRODUCTOS DE PRUEBA
INSERT IGNORE INTO Productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3) VALUES
('PROD-001', 'Alfombra Persa Grande 200x300', 'Alfombra de alta calidad estilo persa importada', 1250.00, 15.5, 0.12),
('PROD-002', 'Juego de Sábanas Premium King', 'Sábanas 100% algodón egipcio, 600 hilos', 320.00, 2.0, 0.015),
('PROD-003', 'Mesa de Centro Moderna Roble', 'Mesa de centro en madera de roble macizo', 890.00, 25.0, 0.8),
('PROD-004', 'Lámpara de Pie Vintage Bronce', 'Lámpara decorativa estilo vintage con base de bronce', 450.00, 5.5, 0.05),
('PROD-005', 'Set 4 Cojines Decorativos', 'Set de cojines decorativos variados colores', 180.00, 1.2, 0.02),
('PROD-006', 'Cortinas Blackout 140x220', 'Cortinas blackout para dormitorio, varios colores', 280.00, 3.0, 0.025),
('PROD-007', 'Espejo Decorativo Marco Dorado', 'Espejo redondo con marco dorado ornamentado', 420.00, 8.5, 0.04),
('PROD-008', 'Florero Cerámica Artesanal', 'Florero de cerámica hecho a mano, diseño único', 95.00, 2.8, 0.008);

-- RELACIONAR PRODUCTOS CON CATEGORÍAS
INSERT IGNORE INTO Producto_Categoria (producto_id, categoria_id) VALUES
(1, 1), -- Alfombra -> Hogar
(2, 2), -- Sábanas -> Textiles
(3, 3), -- Mesa -> Muebles
(4, 1), -- Lámpara -> Hogar
(5, 2), -- Cojines -> Textiles
(6, 2), -- Cortinas -> Textiles
(7, 1), -- Espejo -> Hogar
(8, 1); -- Florero -> Hogar

-- INSERTAR PROVEEDORES
INSERT IGNORE INTO Proveedores (nombre, contacto, telefono) VALUES
('Textiles Premium SAC', 'Ana García Textiles', '01-2345678'),
('Muebles del Norte SRL', 'Carlos Mendoza Muebles', '01-3456789'),
('Decoración Import EIRL', 'María López Decoración', '01-4567890');

-- INSERTAR UBICACIONES DE INVENTARIO
INSERT IGNORE INTO Ubicaciones_Inventario (nombre_ubicacion, es_fisica, direccion_fisica) VALUES
('Tienda Central Miraflores', true, 'Av. Larco 1234, Miraflores, Lima'),
('Almacén Principal Callao', true, 'Av. Industrial 567, Callao'),
('Tienda San Isidro', true, 'Av. Conquistadores 890, San Isidro, Lima');

-- CREAR VARIANTES DE PRODUCTOS
INSERT IGNORE INTO Variantes_Producto (producto_id, sku, precio_base, url_imagen_principal) VALUES
(1, 'ALF-PER-001', 1250.00, '/images/alfombra-persa-grande.jpg'),
(2, 'SAB-PREM-001', 320.00, '/images/sabanas-premium-king.jpg'),
(3, 'MES-MOD-001', 890.00, '/images/mesa-centro-roble.jpg'),
(4, 'LAM-VIN-001', 450.00, '/images/lampara-vintage-bronce.jpg'),
(5, 'COJ-SET-001', 180.00, '/images/cojines-decorativos.jpg'),
(6, 'CORT-BLK-001', 280.00, '/images/cortinas-blackout.jpg'),
(7, 'ESP-DOR-001', 420.00, '/images/espejo-marco-dorado.jpg'),
(8, 'FLO-CER-001', 95.00, '/images/florero-ceramica.jpg');

-- INSERTAR INVENTARIO DISTRIBUIDO
INSERT IGNORE INTO Inventario (variante_id, ubicacion_id, cantidad, stock_minimo_seguridad) VALUES
-- Alfombra
(1, 1, 12, 5),   -- Miraflores
(1, 2, 28, 10),  -- Callao
(1, 3, 8, 3),    -- San Isidro
-- Sábanas
(2, 1, 45, 15),  -- Miraflores
(2, 2, 85, 25),  -- Callao
(2, 3, 22, 8),   -- San Isidro
-- Mesa
(3, 1, 6, 2),    -- Miraflores
(3, 2, 15, 5),   -- Callao
(3, 3, 4, 2),    -- San Isidro
-- Lámpara
(4, 1, 18, 6),   -- Miraflores
(4, 2, 32, 12),  -- Callao
(4, 3, 11, 4),   -- San Isidro
-- Cojines
(5, 1, 65, 20),  -- Miraflores
(5, 2, 95, 30),  -- Callao
(5, 3, 38, 15),  -- San Isidro
-- Cortinas
(6, 1, 24, 8),   -- Miraflores
(6, 2, 46, 15),  -- Callao
(6, 3, 19, 6),   -- San Isidro
-- Espejo
(7, 1, 15, 5),   -- Miraflores
(7, 2, 22, 8),   -- Callao
(7, 3, 9, 3),    -- San Isidro
-- Florero
(8, 1, 28, 10),  -- Miraflores
(8, 2, 42, 15),  -- Callao
(8, 3, 18, 6);   -- San Isidro

-- INSERTAR CLIENTES DE PRUEBA
INSERT IGNORE INTO Clientes (nombre, apellido, correo, contrasena_hash, telefono) VALUES
('María Elena', 'González Pérez', 'maria.gonzalez@email.com', '$2b$10$example_hash_1', '987654321'),
('Juan Carlos', 'Pérez Rodríguez', 'juan.perez@email.com', '$2b$10$example_hash_2', '987654322'),
('Ana Sofía', 'Rodríguez Silva', 'ana.rodriguez@email.com', '$2b$10$example_hash_3', '987654323'),
('Carlos Miguel', 'Silva Torres', 'carlos.silva@email.com', '$2b$10$example_hash_4', '987654324'),
('Lucía Isabel', 'Torres Mendoza', 'lucia.torres@email.com', '$2b$10$example_hash_5', '987654325');

-- INSERTAR DIRECCIONES DE CLIENTES
INSERT IGNORE INTO Direcciones (cliente_id, alias, calle, numero, ciudad, departamento, codigo_postal, es_principal) VALUES
(1, 'Casa', 'Av. Los Pinos', '123', 'Lima', 'Lima', '15001', true),
(2, 'Casa', 'Jr. Las Flores', '456', 'Lima', 'Lima', '15002', true),
(3, 'Oficina', 'Av. Empresarial', '789', 'Lima', 'Lima', '15003', true),
(4, 'Casa', 'Calle Los Sauces', '321', 'Lima', 'Lima', '15004', true),
(5, 'Departamento', 'Av. La Marina', '654', 'Lima', 'Lima', '15005', true);

-- INSERTAR PEDIDOS REALISTAS CON FECHAS DISTRIBUIDAS
INSERT IGNORE INTO Pedidos (cliente_id, fecha_pedido, estado, total_neto, total_impuestos, total_envio, total_descuento, total_final, metodo_entrega, direccion_envio_id) VALUES
-- Octubre 2024
(1, '2024-10-15 14:30:00', 'Entregado', 1250.00, 225.00, 50.00, 0.00, 1525.00, 'Domicilio', 1),
(2, '2024-10-18 10:15:00', 'Entregado', 320.00, 57.60, 25.00, 30.00, 372.60, 'Domicilio', 2),
(3, '2024-10-22 16:45:00', 'Entregado', 890.00, 160.20, 75.00, 0.00, 1125.20, 'Domicilio', 3),
-- Noviembre 2024
(4, '2024-11-05 11:20:00', 'Entregado', 630.00, 113.40, 40.00, 50.00, 733.40, 'Retiro en Tienda', NULL),
(5, '2024-11-12 09:30:00', 'Entregado', 375.00, 67.50, 30.00, 0.00, 472.50, 'Domicilio', 5),
(1, '2024-11-20 15:10:00', 'Entregado', 180.00, 32.40, 20.00, 0.00, 232.40, 'Domicilio', 1),
-- Diciembre 2024
(2, '2024-12-03 13:25:00', 'Entregado', 700.00, 126.00, 45.00, 70.00, 801.00, 'Domicilio', 2),
(3, '2024-12-15 17:40:00', 'Despachado', 515.00, 92.70, 35.00, 25.00, 617.70, 'Domicilio', 3),
(4, '2024-12-20 12:05:00', 'En Preparacion', 280.00, 50.40, 25.00, 0.00, 355.40, 'Retiro en Tienda', NULL),
-- Enero 2025
(5, '2025-01-08 14:50:00', 'Pagado', 95.00, 17.10, 15.00, 0.00, 127.10, 'Domicilio', 5);

-- INSERTAR DETALLES DE PEDIDOS
INSERT IGNORE INTO Detalle_Pedido (pedido_id, variante_id, precio_unitario, cantidad, descuento_aplicado, subtotal, ubicacion_stock_origen) VALUES
-- Pedido 1: Alfombra
(1, 1, 1250.00, 1, 0.00, 1250.00, 1),
-- Pedido 2: Sábanas con descuento
(2, 2, 320.00, 1, 30.00, 290.00, 1),
-- Pedido 3: Mesa
(3, 3, 890.00, 1, 0.00, 890.00, 2),
-- Pedido 4: Lámpara + Cojines con descuento
(4, 4, 450.00, 1, 25.00, 425.00, 1),
(4, 5, 180.00, 1, 25.00, 155.00, 1),
-- Pedido 5: Cortinas + Florero
(5, 6, 280.00, 1, 0.00, 280.00, 2),
(5, 8, 95.00, 1, 0.00, 95.00, 2),
-- Pedido 6: Cojines
(6, 5, 180.00, 1, 0.00, 180.00, 2),
-- Pedido 7: Espejo + Sábanas con descuento
(7, 7, 420.00, 1, 35.00, 385.00, 1),
(7, 2, 320.00, 1, 35.00, 285.00, 1),
-- Pedido 8: Lámpara + Florero con descuento
(8, 4, 450.00, 1, 25.00, 425.00, 3),
(8, 8, 95.00, 1, 0.00, 95.00, 3),
-- Pedido 9: Cortinas
(9, 6, 280.00, 1, 0.00, 280.00, 3),
-- Pedido 10: Florero
(10, 8, 95.00, 1, 0.00, 95.00, 1);

-- VERIFICAR DATOS INSERTADOS
SELECT 'DATOS DE PRUEBA INSERTADOS:' as status;
SELECT 'Categorías:' as tabla, COUNT(*) as registros FROM Categorias;
SELECT 'Productos:' as tabla, COUNT(*) as registros FROM Productos;
SELECT 'Variantes:' as tabla, COUNT(*) as registros FROM Variantes_Producto;
SELECT 'Inventario:' as tabla, COUNT(*) as registros FROM Inventario;
SELECT 'Clientes:' as tabla, COUNT(*) as registros FROM Clientes;
SELECT 'Pedidos:' as tabla, COUNT(*) as registros FROM Pedidos;
SELECT 'Detalles Pedido:' as tabla, COUNT(*) as registros FROM Detalle_Pedido;

-- VERIFICAR VISTAS FUNCIONANDO
SELECT 'Productos con inventario:' as vista, COUNT(*) as registros 
FROM Vista_Inventario WHERE stock_actual > 0;

SELECT 'Ventas registradas:' as vista, COUNT(*) as registros 
FROM Vista_Ventas;

SELECT 'PASO 3 COMPLETADO - DATOS DE PRUEBA INSERTADOS' as resultado;