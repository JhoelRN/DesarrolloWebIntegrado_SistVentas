-- ====================================================
-- CONSULTA ESTADO REAL DE LA BASE DE DATOS
-- ====================================================

-- 1. Listar TODAS las tablas
SELECT '=== TABLAS EN BASE DE DATOS ===' AS '';
SHOW TABLES;

-- 2. Verificar tabla pedidos
SELECT '' AS '';
SELECT '=== ESTRUCTURA TABLA PEDIDOS ===' AS '';
DESCRIBE pedidos;

-- 3. Contar pedidos existentes
SELECT '' AS '';
SELECT '=== TOTAL PEDIDOS ===' AS '';
SELECT COUNT(*) AS total_pedidos FROM pedidos;

-- 4. Ver últimos pedidos si existen
SELECT '' AS '';
SELECT '=== ÚLTIMOS 5 PEDIDOS ===' AS '';
SELECT pedido_id, cliente_id, fecha_pedido, estado, total_final 
FROM pedidos 
ORDER BY pedido_id DESC 
LIMIT 5;

-- 5. Verificar inventario actual
SELECT '' AS '';
SELECT '=== INVENTARIO ACTUAL ===' AS '';
SELECT 
    i.inventario_id,
    vp.sku,
    SUBSTRING(p.nombre_producto, 1, 25) AS producto,
    ui.nombre_ubicacion AS ubicacion,
    i.cantidad,
    i.stock_minimo_seguridad
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario ui ON i.ubicacion_id = ui.ubicacion_id
ORDER BY ui.ubicacion_id, i.inventario_id;

-- 6. Ver ubicaciones disponibles
SELECT '' AS '';
SELECT '=== UBICACIONES INVENTARIO ===' AS '';
SELECT * FROM ubicaciones_inventario;

-- 7. Contar alarmas activas
SELECT '' AS '';
SELECT '=== ALARMAS ACTIVAS ===' AS '';
SELECT COUNT(*) AS total_alarmas_activas FROM alarmas_stock WHERE resuelta = FALSE;

-- 8. Ver alarmas activas detalle
SELECT 
    a.alarma_stock_id,
    vp.sku,
    SUBSTRING(p.nombre_producto, 1, 25) AS producto,
    a.tipo_alarma,
    a.fecha_creacion,
    i.cantidad AS stock_actual
FROM alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
WHERE a.resuelta = FALSE
LIMIT 10;

-- 9. Contar órdenes de reposición
SELECT '' AS '';
SELECT '=== ÓRDENES DE REPOSICIÓN ===' AS '';
SELECT COUNT(*) AS total_ordenes FROM ordenes_reposicion;

-- 10. Ver órdenes por estado
SELECT 
    estado_autorizacion,
    COUNT(*) AS cantidad
FROM ordenes_reposicion
GROUP BY estado_autorizacion;

-- 11. Verificar tabla seguimiento_despacho (cliente)
SELECT '' AS '';
SELECT '=== SEGUIMIENTO DESPACHO (CLIENTE) ===' AS '';
DESCRIBE seguimiento_despacho;

-- 12. Verificar tabla seguimientos_despacho (logística)
SELECT '' AS '';
SELECT '=== SEGUIMIENTOS DESPACHO (LOGÍSTICA) ===' AS '';
SELECT COUNT(*) AS existe FROM information_schema.tables 
WHERE table_schema = 'macrosur_ecommerce' AND table_name = 'seguimientos_despacho';

-- 13. Ver operadores logísticos disponibles
SELECT '' AS '';
SELECT '=== OPERADORES LOGÍSTICOS ===' AS '';
SELECT * FROM operadores_logisticos WHERE activo = TRUE;

-- 14. Ver proveedores
SELECT '' AS '';
SELECT '=== PROVEEDORES ===' AS '';
SELECT proveedor_id, nombre, contacto, telefono FROM proveedores LIMIT 10;

-- 15. Verificar migraciones Flyway ejecutadas
SELECT '' AS '';
SELECT '=== MIGRACIONES FLYWAY ===' AS '';
SELECT version, description, script, installed_on, success 
FROM flyway_schema_history 
ORDER BY installed_rank DESC 
LIMIT 10;
