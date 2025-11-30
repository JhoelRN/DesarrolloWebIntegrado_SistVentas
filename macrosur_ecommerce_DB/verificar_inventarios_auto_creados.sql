-- Verificar inventarios creados automáticamente
USE macrosur_ecommerce;

-- 1. Ver cuántas variantes tienen inventario
SELECT 
    (SELECT COUNT(*) FROM variantes_producto) AS total_variantes,
    (SELECT COUNT(DISTINCT variante_id) FROM inventario) AS con_inventario,
    (SELECT COUNT(*) FROM variantes_producto) - (SELECT COUNT(DISTINCT variante_id) FROM inventario) AS sin_inventario;

-- 2. Ver inventarios creados
SELECT 
    i.inventario_id,
    vp.variante_id,
    vp.sku,
    p.nombre_producto,
    i.cantidad,
    i.stock_minimo_seguridad,
    u.nombre_ubicacion
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY i.inventario_id DESC
LIMIT 20;

-- 3. Si quieres poblar con datos de prueba (ajustar cantidades):
-- Descomenta y ejecuta las siguientes líneas:

/*
UPDATE inventario SET cantidad = 15, stock_minimo_seguridad = 5 WHERE variante_id = 1;
UPDATE inventario SET cantidad = 3, stock_minimo_seguridad = 10 WHERE variante_id = 2;
UPDATE inventario SET cantidad = 20, stock_minimo_seguridad = 8 WHERE variante_id = 3;
UPDATE inventario SET cantidad = 0, stock_minimo_seguridad = 5 WHERE variante_id = 4;
UPDATE inventario SET cantidad = 8, stock_minimo_seguridad = 10 WHERE variante_id = 5;
*/
