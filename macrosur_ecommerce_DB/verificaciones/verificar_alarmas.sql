-- Verificar alarmas activas
SELECT 
    a.alarma_stock_id,
    p.nombre_producto,
    v.sku,
    u.nombre_ubicacion,
    a.tipo_alarma,
    i.cantidad as stock_actual,
    i.stock_minimo_seguridad as stock_minimo,
    a.resuelta,
    a.fecha_creacion
FROM alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
WHERE a.resuelta = false
ORDER BY a.fecha_creacion DESC;

-- Resumen de alarmas
SELECT 
    COUNT(*) as total_alarmas,
    SUM(CASE WHEN resuelta = false THEN 1 ELSE 0 END) as alarmas_activas,
    SUM(CASE WHEN resuelta = true THEN 1 ELSE 0 END) as alarmas_resueltas
FROM alarmas_stock;
