-- ================================================
-- SCRIPT DE DATOS DE PRUEBA - MÓDULO LOGÍSTICA
-- ================================================
USE macrosur_ecommerce;

-- ==================== PROVEEDORES ====================
-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('Distribuidora Tech SAC', 'Carlos Mendoza - ventas@techsac.com', '987654321'),
('Importaciones Global EIRL', 'María González - contacto@globaleirl.com', '965432187'),
('Suministros Express', 'Jorge Ramírez - info@sumexpress.com', '912345678'),
('Mayorista del Norte', 'Ana Torres - ventas@mayornorte.com', '998877665');

SELECT 'Proveedores creados:' as info, COUNT(*) as cantidad FROM proveedores;

-- ==================== OPERADORES LOGÍSTICOS ====================
-- Insertar operadores logísticos de ejemplo
INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('Olva Courier', 'https://www.olvacourier.com/rastreo?guia='),
('Shalom Empresarial', 'https://www.shalomcontrol.com/seguimiento?codigo='),
('Cruz del Sur Cargo', 'https://www.cruzdelsur.com.pe/rastreo?guia='),
('SerPost', 'https://www.serpost.com.pe/Inicio/tracking?code=');

SELECT 'Operadores logísticos creados:' as info, COUNT(*) as cantidad FROM operadores_logisticos;

-- ==================== ÓRDENES DE REPOSICIÓN ====================
-- Crear algunas órdenes de reposición de ejemplo

-- Orden 1: PENDIENTE (esperando autorización)
INSERT INTO ordenes_reposicion (proveedor_id, fecha_solicitud, estado_autorizacion, costo_total)
VALUES (1, NOW(), 'PENDIENTE', 0);
SET @orden1 = LAST_INSERT_ID();

-- Detalles de la orden 1 (usar variantes existentes)
INSERT INTO detalles_orden_reposicion (orden_reposicion_id, variante_producto_id, cantidad_solicitada, precio_unitario)
SELECT @orden1, variante_id, 50, 25.00 FROM variantes_producto WHERE variante_id = 1
UNION ALL
SELECT @orden1, variante_id, 30, 18.50 FROM variantes_producto WHERE variante_id = 2
UNION ALL
SELECT @orden1, variante_id, 40, 32.00 FROM variantes_producto WHERE variante_id = 3;

-- Actualizar costo total de orden 1
UPDATE ordenes_reposicion 
SET costo_total = (
    SELECT SUM(cantidad_solicitada * precio_unitario) 
    FROM detalles_orden_reposicion 
    WHERE orden_reposicion_id = @orden1
)
WHERE orden_reposicion_id = @orden1;

-- Orden 2: AUTORIZADA (lista para envío)
INSERT INTO ordenes_reposicion (proveedor_id, fecha_solicitud, estado_autorizacion, usuario_admin_id_autoriza, fecha_autorizacion, costo_total)
VALUES (2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'AUTORIZADA', 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 0);
SET @orden2 = LAST_INSERT_ID();

-- Detalles de la orden 2
INSERT INTO detalles_orden_reposicion (orden_reposicion_id, variante_producto_id, cantidad_solicitada, precio_unitario)
SELECT @orden2, variante_id, 60, 45.00 FROM variantes_producto WHERE variante_id = 4
UNION ALL
SELECT @orden2, variante_id, 25, 38.00 FROM variantes_producto WHERE variante_id = 5;

-- Actualizar costo total de orden 2
UPDATE ordenes_reposicion 
SET costo_total = (
    SELECT SUM(cantidad_solicitada * precio_unitario) 
    FROM detalles_orden_reposicion 
    WHERE orden_reposicion_id = @orden2
)
WHERE orden_reposicion_id = @orden2;

-- Orden 3: RECIBIDA (completada)
INSERT INTO ordenes_reposicion (proveedor_id, fecha_solicitud, estado_autorizacion, usuario_admin_id_autoriza, fecha_autorizacion, fecha_recepcion, costo_total)
VALUES (3, DATE_SUB(NOW(), INTERVAL 7 DAY), 'RECIBIDA', 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 0);
SET @orden3 = LAST_INSERT_ID();

-- Detalles de la orden 3
INSERT INTO detalles_orden_reposicion (orden_reposicion_id, variante_producto_id, cantidad_solicitada, cantidad_recibida, precio_unitario)
SELECT @orden3, variante_id, 35, 35, 28.00 FROM variantes_producto WHERE variante_id = 6
UNION ALL
SELECT @orden3, variante_id, 45, 42, 22.50 FROM variantes_producto WHERE variante_id = 7;

-- Actualizar costo total de orden 3
UPDATE ordenes_reposicion 
SET costo_total = (
    SELECT SUM(cantidad_solicitada * precio_unitario) 
    FROM detalles_orden_reposicion 
    WHERE orden_reposicion_id = @orden3
)
WHERE orden_reposicion_id = @orden3;

SELECT 'Órdenes de reposición creadas:' as info, COUNT(*) as cantidad FROM ordenes_reposicion;
SELECT 'Detalles de órdenes creados:' as info, COUNT(*) as cantidad FROM detalles_orden_reposicion;

-- ==================== SEGUIMIENTOS (Tracking) ====================
-- Nota: Seguimientos requieren pedidos (órdenes de clientes) existentes
-- Si no hay pedidos en la BD, estos registros son de ejemplo

-- Verificar si hay pedidos
SET @pedido_existente = (SELECT pedido_id FROM pedidos LIMIT 1);

-- Solo crear seguimientos si existen pedidos
INSERT INTO seguimientos_despacho (pedido_id, operador_id, numero_guia, estado_envio, fecha_despacho, fecha_estimada_entrega)
SELECT 
    p.pedido_id,
    1, -- Olva Courier
    CONCAT('OLV', LPAD(p.pedido_id, 8, '0')),
    'EN_CAMINO',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_ADD(NOW(), INTERVAL 2 DAY)
FROM pedidos p
WHERE p.pedido_id = @pedido_existente;

INSERT INTO seguimientos_despacho (pedido_id, operador_id, numero_guia, estado_envio, fecha_despacho, fecha_estimada_entrega)
SELECT 
    p.pedido_id,
    2, -- Shalom
    CONCAT('SHL', LPAD(p.pedido_id, 8, '0')),
    'EN_DISTRIBUCION',
    DATE_SUB(NOW(), INTERVAL 2 DAY),
    NOW()
FROM pedidos p
WHERE p.pedido_id != @pedido_existente
LIMIT 1;

SELECT 'Seguimientos creados:' as info, COUNT(*) as cantidad FROM seguimientos_despacho;

-- ==================== ALARMAS DE STOCK (de ejemplo) ====================
-- Crear algunas alarmas basadas en inventario bajo

-- Alarma para variante con stock en 3 (bajo stock)
INSERT INTO alarmas_stock (inventario_id, tipo_alarma, fecha_creacion, resuelta)
SELECT 
    i.inventario_id,
    'BAJO_STOCK',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    FALSE
FROM inventario i
WHERE i.variante_id = 2 AND i.cantidad < i.stock_minimo_seguridad
LIMIT 1;

-- Alarma para variante con stock en 0 (stock cero)
INSERT INTO alarmas_stock (inventario_id, tipo_alarma, fecha_creacion, resuelta)
SELECT 
    i.inventario_id,
    'STOCK_CERO',
    DATE_SUB(NOW(), INTERVAL 2 HOUR),
    FALSE
FROM inventario i
WHERE i.variante_id = 5 AND i.cantidad = 0
LIMIT 1;

SELECT 'Alarmas de stock creadas:' as info, COUNT(*) as cantidad FROM alarmas_stock WHERE resuelta = FALSE;

-- ==================== RESUMEN FINAL ====================
SELECT '=== RESUMEN DE DATOS DE PRUEBA ===' as '';
SELECT 'Proveedores:' as entidad, COUNT(*) as total FROM proveedores
UNION ALL
SELECT 'Operadores logísticos:', COUNT(*) FROM operadores_logisticos
UNION ALL
SELECT 'Órdenes de reposición:', COUNT(*) FROM ordenes_reposicion
UNION ALL
SELECT 'Detalles de órdenes:', COUNT(*) FROM detalles_orden_reposicion
UNION ALL
SELECT 'Seguimientos de envíos:', COUNT(*) FROM seguimientos_despacho
UNION ALL
SELECT 'Alarmas activas:', COUNT(*) FROM alarmas_stock WHERE resuelta = FALSE
UNION ALL
SELECT 'Inventarios disponibles:', COUNT(*) FROM inventario;

-- Mostrar órdenes creadas
SELECT 
    or_rep.orden_reposicion_id,
    p.nombre as proveedor,
    or_rep.estado_autorizacion,
    or_rep.costo_total,
    COUNT(d.detalle_orden_reposicion_id) as items,
    or_rep.fecha_solicitud
FROM ordenes_reposicion or_rep
JOIN proveedores p ON or_rep.proveedor_id = p.proveedor_id
LEFT JOIN detalles_orden_reposicion d ON or_rep.orden_reposicion_id = d.orden_reposicion_id
GROUP BY or_rep.orden_reposicion_id
ORDER BY or_rep.fecha_solicitud DESC;
