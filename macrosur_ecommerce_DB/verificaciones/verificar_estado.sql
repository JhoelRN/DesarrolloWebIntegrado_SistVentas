-- =============================================
-- VERIFICACIÓN RÁPIDA DEL ESTADO DEL SISTEMA
-- =============================================

SELECT '=== PRODUCTOS Y VARIANTES ===' AS '';

SELECT 
    p.producto_id,
    p.nombre_producto,
    COUNT(DISTINCT v.variante_id) as total_variantes
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
GROUP BY p.producto_id, p.nombre_producto
ORDER BY p.producto_id
LIMIT 10;

SELECT '=== INVENTARIO POR UBICACIÓN ===' AS '';

SELECT 
    u.ubicacion_id,
    u.nombre_ubicacion,
    u.es_fisica,
    COUNT(i.inventario_id) as items_en_stock,
    SUM(i.cantidad) as total_unidades
FROM ubicaciones_inventario u
LEFT JOIN inventario i ON u.ubicacion_id = i.ubicacion_id
GROUP BY u.ubicacion_id, u.nombre_ubicacion, u.es_fisica
ORDER BY u.ubicacion_id;

SELECT '=== DETALLE DE INVENTARIO (Primeros 10 items) ===' AS '';

SELECT 
    i.inventario_id,
    v.sku,
    p.nombre_producto,
    u.nombre_ubicacion,
    i.cantidad,
    i.stock_minimo_seguridad,
    CASE 
        WHEN i.cantidad = 0 THEN 'SIN STOCK'
        WHEN i.cantidad < i.stock_minimo_seguridad THEN 'BAJO'
        ELSE 'OK'
    END as estado_stock
FROM inventario i
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY i.inventario_id
LIMIT 10;

SELECT '=== ALARMAS ACTIVAS ===' AS '';

SELECT 
    a.alarma_id,
    v.sku,
    p.nombre_producto,
    a.tipo_alarma,
    a.fecha_creacion,
    a.resuelta
FROM alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
WHERE a.resuelta = 0
ORDER BY a.fecha_creacion DESC;

SELECT '=== ÓRDENES DE REPOSICIÓN ===' AS '';

SELECT 
    o.orden_reposicion_id,
    pr.nombre as proveedor,
    o.fecha_solicitud,
    o.estado_autorizacion,
    o.costo_total,
    COUNT(d.detalle_orden_id) as total_items
FROM ordenes_reposicion o
JOIN proveedores pr ON o.proveedor_id = pr.proveedor_id
LEFT JOIN detalle_ordenes_reposicion d ON o.orden_reposicion_id = d.orden_reposicion_id
GROUP BY o.orden_reposicion_id
ORDER BY o.orden_reposicion_id DESC
LIMIT 10;

SELECT '=== ÚLTIMOS MOVIMIENTOS DE STOCK ===' AS '';

SELECT 
    m.movimiento_id,
    v.sku,
    p.nombre_producto,
    u.nombre_ubicacion,
    m.tipo_movimiento,
    m.cantidad,
    m.fecha_movimiento,
    LEFT(m.motivo, 50) as motivo
FROM movimientos_stock m
JOIN inventario i ON m.inventario_id = i.inventario_id
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY m.fecha_movimiento DESC
LIMIT 10;
