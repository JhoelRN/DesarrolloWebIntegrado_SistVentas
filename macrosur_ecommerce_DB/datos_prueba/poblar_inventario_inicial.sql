-- Script para poblar inventario inicial con productos existentes
-- Fecha: 2025-11-27

USE macrosur_ecommerce;

-- =============================================
-- 1. CREAR VARIANTES DE PRODUCTO (si no existen)
-- =============================================
-- Primero crear variantes para los productos existentes (IDs 9-13)
INSERT INTO variantes_producto (producto_id, sku, precio_base, url_imagen_principal) VALUES
(9, 'ZP-01-NEGRO-40', 899.99, NULL),
(9, 'ZP-01-NEGRO-41', 899.99, NULL),
(10, 'ALF001-ROJO-200x300', 1299.00, NULL),
(10, 'ALF001-AZUL-200x300', 1299.00, NULL),
(11, 'ALF002-GRIS-160x230', 799.00, NULL),
(12, 'ALF003-BEIGE-200x200', 599.00, NULL),
(13, 'ALF004-GRIS-80x200', 299.00, NULL),
(13, 'ALF004-AZUL-80x200', 299.00, NULL)
ON DUPLICATE KEY UPDATE precio_base = VALUES(precio_base);

-- =============================================
-- 2. INSERTAR INVENTARIO PARA TODAS LAS VARIANTES
-- =============================================

-- Obtener el ID de la ubicación "Tienda Principal"
SET @ubicacion_tienda = (SELECT ubicacion_id FROM ubicaciones_inventario WHERE nombre_ubicacion = 'Tienda Principal' LIMIT 1);

-- Si no existe, crearla
INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, direccion, es_fisica)
SELECT 'Tienda Principal', 'TIENDA', 'Av. Principal 123, Santiago', TRUE
WHERE NOT EXISTS (SELECT 1 FROM ubicaciones_inventario WHERE nombre_ubicacion = 'Tienda Principal');

-- Actualizar la variable después del INSERT
SET @ubicacion_tienda = (SELECT ubicacion_id FROM ubicaciones_inventario WHERE nombre_ubicacion = 'Tienda Principal' LIMIT 1);

-- Insertar inventario para cada variante de producto creada (con manejo de duplicados)
INSERT INTO inventario (variante_id, ubicacion_id, cantidad, stock_minimo_seguridad)
VALUES 
(24, @ubicacion_tienda, 15, 5),   -- ZP-01 Negro 40 - Stock normal
(25, @ubicacion_tienda, 3, 10),   -- ZP-01 Negro 41 - Stock bajo (generará alerta)
(26, @ubicacion_tienda, 8, 5),    -- ALF001 Rojo 200x300 - Stock normal
(27, @ubicacion_tienda, 0, 5),    -- ALF001 Azul 200x300 - Stock cero (generará alerta)
(28, @ubicacion_tienda, 20, 10),  -- ALF002 Gris 160x230 - Stock normal
(29, @ubicacion_tienda, 4, 8),    -- ALF003 Beige 200x200 - Stock bajo
(30, @ubicacion_tienda, 6, 3),    -- ALF004 Gris 80x200 - Stock normal
(31, @ubicacion_tienda, 12, 5)    -- ALF004 Azul 80x200 - Stock normal
ON DUPLICATE KEY UPDATE 
    cantidad = VALUES(cantidad),
    stock_minimo_seguridad = VALUES(stock_minimo_seguridad);

-- =============================================
-- 2. GENERAR ALARMAS PARA STOCK BAJO/CERO
-- =============================================

-- Alarma para stock cero (ALF001 Azul)
INSERT INTO alarmas_stock (inventario_id, tipo_alarma, fecha_creacion, resuelta)
SELECT i.inventario_id, 'STOCK_CERO', NOW(), FALSE
FROM inventario i
WHERE i.variante_id = 27 AND i.ubicacion_id = @ubicacion_tienda
AND NOT EXISTS (
    SELECT 1 FROM alarmas_stock a 
    WHERE a.inventario_id = i.inventario_id AND a.resuelta = FALSE
);

-- Alarma para stock bajo (ZP-01 Negro 41)
INSERT INTO alarmas_stock (inventario_id, tipo_alarma, fecha_creacion, resuelta)
SELECT i.inventario_id, 'STOCK_BAJO', NOW(), FALSE
FROM inventario i
WHERE i.variante_id = 25 AND i.ubicacion_id = @ubicacion_tienda
AND NOT EXISTS (
    SELECT 1 FROM alarmas_stock a 
    WHERE a.inventario_id = i.inventario_id AND a.resuelta = FALSE
);

-- Alarma para stock bajo (ALF003 Beige)
INSERT INTO alarmas_stock (inventario_id, tipo_alarma, fecha_creacion, resuelta)
SELECT i.inventario_id, 'STOCK_BAJO', NOW(), FALSE
FROM inventario i
WHERE i.variante_id = 29 AND i.ubicacion_id = @ubicacion_tienda
AND NOT EXISTS (
    SELECT 1 FROM alarmas_stock a 
    WHERE a.inventario_id = i.inventario_id AND a.resuelta = FALSE
);

-- =============================================
-- 3. AGREGAR PROVEEDORES ADICIONALES
-- =============================================

INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('Textiles del Sur', 'ventas@textilessur.cl', '+56912345001'),
('Mueblería Premium', 'contacto@muebleriapremium.cl', '+56912345002'),
('Decoraciones Modernas', 'info@decomodernas.cl', '+56912345003')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- =============================================
-- 4. CREAR ORDEN DE REPOSICIÓN DE EJEMPLO (PENDIENTE)
-- =============================================

-- Obtener IDs
SET @proveedor_textil = (SELECT proveedor_id FROM proveedores WHERE nombre = 'Textiles del Sur' LIMIT 1);
SET @proveedor_general = (SELECT proveedor_id FROM proveedores WHERE nombre = 'Proveedor General' LIMIT 1);

-- Orden 1: Reposición de Sábanas (PENDIENTE - esperando autorización)
INSERT INTO ordenes_reposicion (proveedor_id, fecha_solicitud, estado_autorizacion, costo_total)
VALUES (@proveedor_textil, NOW(), 'PENDIENTE', 6400.00);

SET @orden1_id = LAST_INSERT_ID();

-- Detalles de la orden 1
INSERT INTO detalles_orden_reposicion (orden_reposicion_id, variante_producto_id, cantidad_solicitada, precio_unitario)
VALUES 
(@orden1_id, 25, 20, 320.00); -- 20 Zapatos ZP-01 Negro 41

-- Orden 2: Reposición de Alfombra (PENDIENTE)
INSERT INTO ordenes_reposicion (proveedor_id, fecha_solicitud, estado_autorizacion, costo_total)
VALUES (@proveedor_general, NOW(), 'PENDIENTE', 4500.00);

SET @orden2_id = LAST_INSERT_ID();

-- Detalles de la orden 2
INSERT INTO detalles_orden_reposicion (orden_reposicion_id, variante_producto_id, cantidad_solicitada, precio_unitario)
VALUES 
(@orden2_id, 27, 10, 450.00); -- 10 Alfombras ALF001 Azul

-- =============================================
-- 5. RESUMEN
-- =============================================

SELECT 
    'INVENTARIO INICIAL CREADO' AS Resultado,
    COUNT(*) AS 'Total Registros'
FROM inventario;

SELECT 
    'ALARMAS GENERADAS' AS Resultado,
    COUNT(*) AS 'Total Alertas'
FROM alarmas_stock
WHERE resuelta = FALSE;

SELECT 
    'ÓRDENES DE REPOSICIÓN' AS Resultado,
    COUNT(*) AS 'Total Órdenes Pendientes'
FROM ordenes_reposicion
WHERE estado_autorizacion = 'PENDIENTE';

SELECT 
    'PROVEEDORES DISPONIBLES' AS Resultado,
    COUNT(*) AS 'Total Proveedores'
FROM proveedores;

SELECT 
    'OPERADORES LOGÍSTICOS' AS Resultado,
    COUNT(*) AS 'Total Operadores'
FROM operadores_logisticos;
