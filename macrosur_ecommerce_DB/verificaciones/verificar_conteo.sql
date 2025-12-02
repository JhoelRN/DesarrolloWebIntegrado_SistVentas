USE macrosur_ecommerce;

SELECT 
    'Total productos activos' as tipo,
    COUNT(*) as cantidad
FROM productos WHERE activo = 1
UNION ALL
SELECT 
    'Total variantes' as tipo,
    COUNT(*) as cantidad
FROM variantes_producto
UNION ALL
SELECT 
    'Productos activos con variantes' as tipo,
    COUNT(DISTINCT p.producto_id) as cantidad
FROM productos p
INNER JOIN variantes_producto v ON p.producto_id = v.producto_id
WHERE p.activo = 1
UNION ALL
SELECT 
    'Productos activos SIN variantes' as tipo,
    COUNT(*) as cantidad
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
WHERE v.variante_id IS NULL AND p.activo = 1;
