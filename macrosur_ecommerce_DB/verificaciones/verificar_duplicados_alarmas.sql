-- Verificar productos duplicados en inventario y estado de alarmas
-- 1. Productos repetidos en inventario (misma variante en múltiples ubicaciones)
SELECT 
    p.nombre_producto,
    v.sku,
    COUNT(*) as veces_en_inventario,
    GROUP_CONCAT(CONCAT(u.nombre_ubicacion, ' (', i.cantidad, ')') SEPARATOR ' | ') as ubicaciones_stock
FROM inventario i
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
GROUP BY p.producto_id, v.variante_id
HAVING COUNT(*) > 1
ORDER BY p.nombre_producto;

-- 2. Estado completo de alarmas
SELECT 
    a.alarma_stock_id,
    p.nombre_producto,
    v.sku,
    u.nombre_ubicacion,
    i.cantidad as stock_actual,
    i.stock_minimo_seguridad as stock_minimo,
    a.tipo_alarma,
    a.resuelta,
    DATE_FORMAT(a.fecha_creacion, '%Y-%m-%d %H:%i') as creada,
    DATE_FORMAT(a.fecha_resolucion, '%Y-%m-%d %H:%i') as resuelta_fecha
FROM alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY a.resuelta, a.fecha_creacion DESC;
