-- Script para crear variantes por defecto para productos sin variantes
-- Fecha: 2025-11-30
-- Propósito: Asegurar que todos los productos tengan al menos una variante

USE macrosur_ecommerce;

-- Insertar variantes para productos que no tienen
INSERT INTO variantes_producto (producto_id, sku, precio_base, url_imagen_principal)
SELECT 
    p.producto_id,
    CONCAT('SKU-', LPAD(p.producto_id, 5, '0')) as sku,
    p.precio_unitario as precio_base,
    p.imagen_url as url_imagen_principal
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
WHERE v.variante_id IS NULL
  AND p.activo = 1;

-- Verificar variantes creadas
SELECT 
    p.producto_id,
    p.nombre_producto,
    v.variante_id,
    v.sku,
    v.precio_base
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
ORDER BY p.producto_id;

-- Contar productos con y sin variantes
SELECT 
    'Total productos' as tipo,
    COUNT(*) as cantidad
FROM productos WHERE activo = 1
UNION ALL
SELECT 
    'Productos con variantes' as tipo,
    COUNT(DISTINCT p.producto_id) as cantidad
FROM productos p
INNER JOIN variantes_producto v ON p.producto_id = v.producto_id
WHERE p.activo = 1
UNION ALL
SELECT 
    'Productos sin variantes' as tipo,
    COUNT(DISTINCT p.producto_id) as cantidad
FROM productos p
LEFT JOIN variantes_producto v ON p.producto_id = v.producto_id
WHERE v.variante_id IS NULL
  AND p.activo = 1;
