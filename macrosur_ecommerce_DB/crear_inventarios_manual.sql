-- Crear inventarios manualmente para todas las variantes existentes
USE macrosur_ecommerce;

-- Insertar inventarios para todas las variantes que no tienen
INSERT INTO inventario (variante_id, ubicacion_id, cantidad, stock_minimo_seguridad)
SELECT 
    vp.variante_id,
    (SELECT ubicacion_id FROM ubicaciones_inventario WHERE nombre_ubicacion = 'Tienda Principal' LIMIT 1) as ubicacion_id,
    0 as cantidad,
    10 as stock_minimo_seguridad
FROM variantes_producto vp
WHERE NOT EXISTS (
    SELECT 1 FROM inventario i WHERE i.variante_id = vp.variante_id
);

-- Ver cuántos se crearon
SELECT 'Inventarios creados:' as mensaje, COUNT(*) as cantidad FROM inventario;

-- Ver inventarios con productos
SELECT 
    i.inventario_id,
    vp.sku,
    p.nombre_producto,
    i.cantidad,
    i.stock_minimo_seguridad,
    u.nombre_ubicacion
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY i.inventario_id;

-- Actualizar algunas cantidades para probar
UPDATE inventario SET cantidad = 15, stock_minimo_seguridad = 5 WHERE inventario_id = 1;
UPDATE inventario SET cantidad = 3, stock_minimo_seguridad = 10 WHERE inventario_id = 2;
UPDATE inventario SET cantidad = 20, stock_minimo_seguridad = 8 WHERE inventario_id = 3;

SELECT 'Inventarios actualizados con cantidades de prueba' as mensaje;
