-- ================================================
-- CONSULTA: ANÁLISIS COMPLETO BASE DE DATOS
-- ================================================

-- 1. Ver todas las tablas
SELECT 'LISTADO DE TABLAS' AS Seccion;
SHOW TABLES;

-- 2. Verificar tabla pedidos
SELECT 'TABLA PEDIDOS' AS Seccion;
SELECT COUNT(*) AS existe FROM information_schema.tables 
WHERE table_schema = 'macrosur_ecommerce' AND table_name = 'pedidos';

-- 3. Verificar tabla detalle_pedido
SELECT 'TABLA DETALLE_PEDIDO' AS Seccion;
SELECT COUNT(*) AS existe FROM information_schema.tables 
WHERE table_schema = 'macrosur_ecommerce' AND table_name = 'detalle_pedido';

-- 4. Ver inventario actual
SELECT 'INVENTARIO ACTUAL' AS Seccion;
SELECT 
    i.inventario_id,
    vp.sku,
    SUBSTRING(p.nombre_producto, 1, 30) AS producto,
    ui.nombre_ubicacion,
    i.cantidad,
    i.stock_minimo_seguridad
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario ui ON i.ubicacion_id = ui.ubicacion_id
ORDER BY ui.ubicacion_id, p.nombre_producto;

-- 5. Ver ubicaciones
SELECT 'UBICACIONES INVENTARIO' AS Seccion;
SELECT * FROM ubicaciones_inventario;

-- 6. Ver alarmas
SELECT 'ALARMAS ACTIVAS' AS Seccion;
SELECT COUNT(*) AS total_activas FROM alarmas_stock WHERE resuelta = FALSE;

-- 7. Ver órdenes de reposición
SELECT 'ORDENES REPOSICION' AS Seccion;
SELECT COUNT(*) AS total_ordenes FROM ordenes_reposicion;
