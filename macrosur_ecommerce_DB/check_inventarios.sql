-- CREAR VARIANTES E INVENTARIOS COMPLETO
USE macrosur_ecommerce;

-- 1. Ver productos existentes
SELECT 'Productos existentes:' as info, producto_id, nombre_producto FROM productos LIMIT 10;

-- 2. CREAR VARIANTES para los primeros 5 productos
INSERT INTO variantes_producto (producto_id, sku, precio_base, url_imagen_principal)
SELECT 
    p.producto_id,
    CONCAT('SKU-', LPAD(p.producto_id, 5, '0')),
    p.precio_unitario,
    p.imagen_url
FROM productos p
WHERE NOT EXISTS (
    SELECT 1 FROM variantes_producto vp WHERE vp.producto_id = p.producto_id
)
LIMIT 10;

SELECT 'Variantes creadas:' as info, COUNT(*) as cantidad FROM variantes_producto;

-- 3. CREAR INVENTARIOS para todas las variantes
SET @ubicacion = (SELECT ubicacion_id FROM ubicaciones_inventario LIMIT 1);

INSERT INTO inventario (variante_id, ubicacion_id, cantidad, stock_minimo_seguridad)
SELECT variante_id, @ubicacion, 0, 10
FROM variantes_producto;

SELECT 'Inventarios creados:' as info, COUNT(*) as cantidad FROM inventario;

-- 4. Actualizar con cantidades de prueba
UPDATE inventario SET cantidad = 15 WHERE variante_id = 1;
UPDATE inventario SET cantidad = 3 WHERE variante_id = 2;
UPDATE inventario SET cantidad = 20 WHERE variante_id = 3;
UPDATE inventario SET cantidad = 8 WHERE variante_id = 4;
UPDATE inventario SET cantidad = 0 WHERE variante_id = 5;

-- 5. Ver resultados finales
SELECT 
    i.inventario_id,
    i.variante_id,
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
