-- Verificar PRODUCTOS vs INVENTARIO
SELECT '=== TOTAL DE PRODUCTOS ===' AS '';
SELECT COUNT(*) as total_productos FROM productos;

SELECT '=== TOTAL DE VARIANTES ===' AS '';
SELECT COUNT(*) as total_variantes FROM variantes_producto;

SELECT '=== TOTAL EN INVENTARIO ===' AS '';
SELECT COUNT(DISTINCT i.variante_id) as variantes_con_stock FROM inventario i;

SELECT '=== PRODUCTOS SIN INVENTARIO ===' AS '';
SELECT 
    p.producto_id,
    p.nombre_producto,
    COUNT(DISTINCT v.variante_id) as total_variantes,
    COUNT(DISTINCT i.variante_id) as variantes_con_stock,
    (COUNT(DISTINCT v.variante_id) - COUNT(DISTINCT i.variante_id)) as sin_inventario
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
LEFT JOIN inventario i ON v.variante_id = i.variante_id
GROUP BY p.producto_id, p.nombre_producto
HAVING sin_inventario > 0
ORDER BY p.producto_id;
