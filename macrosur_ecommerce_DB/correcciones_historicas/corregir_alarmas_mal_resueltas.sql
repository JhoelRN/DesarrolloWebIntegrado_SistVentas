-- Resolver manualmente alarmas que deberían estar resueltas
-- (stock actual >= stock mínimo pero alarma sigue activa)

UPDATE alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
SET a.resuelta = true,
    a.fecha_resolucion = NOW()
WHERE a.resuelta = false
  AND i.cantidad >= i.stock_minimo_seguridad;

-- Verificar resultado
SELECT 'Alarmas corregidas manualmente' as resultado;

SELECT 
    a.alarma_stock_id,
    p.nombre_producto,
    v.sku,
    u.nombre_ubicacion,
    i.cantidad as stock_actual,
    i.stock_minimo_seguridad as stock_minimo,
    a.resuelta,
    'Ahora debería estar resuelta = 1' as estado_esperado
FROM alarmas_stock a
JOIN inventario i ON a.inventario_id = i.inventario_id
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
WHERE a.alarma_stock_id = 6; -- La alarma problemática
