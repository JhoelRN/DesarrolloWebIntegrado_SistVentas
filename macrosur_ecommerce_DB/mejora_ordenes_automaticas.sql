-- ===================================================================
-- MEJORA: Sistema de órdenes automáticas inteligentes
-- ===================================================================

-- 1. Agregar columna proveedor_preferido a productos
ALTER TABLE productos 
ADD COLUMN proveedor_preferido_id INT DEFAULT NULL,
ADD CONSTRAINT fk_producto_proveedor_preferido 
    FOREIGN KEY (proveedor_preferido_id) 
    REFERENCES proveedores(proveedor_id);

-- 2. Asignar proveedores predeterminados a productos existentes
-- (Ajusta según tus necesidades reales)

-- Proveedor 1: Productos de alfombras y tapetes
UPDATE productos 
SET proveedor_preferido_id = 1
WHERE codigo_producto LIKE 'ALF%' OR codigo_producto LIKE 'TAP%';

-- Proveedor 2: Productos de cojines y textiles
UPDATE productos 
SET proveedor_preferido_id = 2
WHERE codigo_producto LIKE 'COJ%' OR codigo_producto LIKE 'CRT%';

-- Proveedor 3: Productos de cocina y vajilla
UPDATE productos 
SET proveedor_preferido_id = 3
WHERE codigo_producto LIKE 'COC%' OR codigo_producto LIKE 'CUA%';

-- Si queda algún producto sin proveedor, asignar al proveedor 1 por defecto
UPDATE productos 
SET proveedor_preferido_id = 1
WHERE proveedor_preferido_id IS NULL;

-- 3. Verificar asignación
SELECT 
    prov.nombre as proveedor,
    COUNT(p.producto_id) as cantidad_productos,
    GROUP_CONCAT(p.codigo_producto SEPARATOR ', ') as productos
FROM productos p
LEFT JOIN proveedores prov ON p.proveedor_preferido_id = prov.proveedor_id
GROUP BY prov.proveedor_id, prov.nombre
ORDER BY cantidad_productos DESC;

-- 4. Crear índice para mejorar performance
CREATE INDEX idx_producto_proveedor ON productos(proveedor_preferido_id);

SELECT '✅ Mejora aplicada: Relación producto-proveedor configurada' as resultado;
