USE macrosur_ecommerce;

-- =====================================================
-- PASO 2: PREPARAR BASE DE DATOS PARA REPORTES JASPER
-- =====================================================

-- VERIFICAR ESTRUCTURA ACTUAL DE PRODUCTOS
SELECT 'VERIFICANDO ESTRUCTURA DE PRODUCTOS...' as status;
DESCRIBE Productos;

-- AGREGAR CAMPOS FALTANTES A PRODUCTOS
-- Campo codigo_producto
SET @column_exists_codigo = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'macrosur_ecommerce' 
    AND TABLE_NAME = 'Productos' 
    AND COLUMN_NAME = 'codigo_producto'
);

-- Solo agregar si no existe
SET @sql_codigo = IF(@column_exists_codigo = 0, 
    'ALTER TABLE Productos ADD COLUMN codigo_producto VARCHAR(50) UNIQUE AFTER producto_id', 
    'SELECT "Campo codigo_producto ya existe" as info'
);

PREPARE stmt1 FROM @sql_codigo;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

-- Campo precio_unitario
SET @column_exists_precio = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'macrosur_ecommerce' 
    AND TABLE_NAME = 'Productos' 
    AND COLUMN_NAME = 'precio_unitario'
);

SET @sql_precio = IF(@column_exists_precio = 0, 
    'ALTER TABLE Productos ADD COLUMN precio_unitario DECIMAL(10,2) DEFAULT 0.00 AFTER ficha_tecnica_html', 
    'SELECT "Campo precio_unitario ya existe" as info'
);

PREPARE stmt2 FROM @sql_precio;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Renombrar campo nombre a nombre_producto si es necesario
SET @column_exists_nombre_producto = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'macrosur_ecommerce' 
    AND TABLE_NAME = 'Productos' 
    AND COLUMN_NAME = 'nombre_producto'
);

SET @sql_rename = IF(@column_exists_nombre_producto = 0, 
    'ALTER TABLE Productos CHANGE nombre nombre_producto VARCHAR(255) NOT NULL', 
    'SELECT "Campo nombre_producto ya existe" as info'
);

PREPARE stmt3 FROM @sql_rename;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- CREAR VISTAS PARA SIMPLIFICAR REPORTES
-- Vista de Inventario
DROP VIEW IF EXISTS Vista_Inventario;
CREATE VIEW Vista_Inventario AS
SELECT 
    p.producto_id,
    p.codigo_producto,
    p.nombre_producto AS producto,
    COALESCE(i.cantidad, 0) AS stock_actual,
    COALESCE(i.stock_minimo_seguridad, 0) AS stock_minimo,
    COALESCE(ui.nombre_ubicacion, 'Sin ubicación') AS ubicacion,
    ui.ubicacion_id AS almacen_id
FROM Productos p
LEFT JOIN Variantes_Producto vp ON p.producto_id = vp.producto_id
LEFT JOIN Inventario i ON vp.variante_id = i.variante_id
LEFT JOIN Ubicaciones_Inventario ui ON i.ubicacion_id = ui.ubicacion_id;

-- Vista de Ventas (basada en Pedidos)
DROP VIEW IF EXISTS Vista_Ventas;
CREATE VIEW Vista_Ventas AS
SELECT 
    p.pedido_id,
    DATE(p.fecha_pedido) AS fecha,
    CONCAT(COALESCE(c.nombre, 'Cliente'), ' ', COALESCE(c.apellido, 'Anónimo')) AS cliente_nombre,
    GROUP_CONCAT(
        CONCAT(
            COALESCE(prod.nombre_producto, 'Producto'), 
            ' (', dp.cantidad, ')'
        ) SEPARATOR ', '
    ) AS productos_descripcion,
    p.total_final AS total,
    p.estado
FROM Pedidos p
LEFT JOIN Clientes c ON p.cliente_id = c.cliente_id
LEFT JOIN Detalle_Pedido dp ON p.pedido_id = dp.pedido_id
LEFT JOIN Variantes_Producto vp ON dp.variante_id = vp.variante_id
LEFT JOIN Productos prod ON vp.producto_id = prod.producto_id
GROUP BY p.pedido_id, p.fecha_pedido, c.nombre, c.apellido, p.total_final, p.estado;

-- VERIFICAR VISTAS CREADAS
SELECT 'VISTAS CREADAS:' as status;
SHOW TABLES LIKE 'Vista_%';

-- VERIFICAR ESTRUCTURA FINAL DE PRODUCTOS
SELECT 'ESTRUCTURA FINAL DE PRODUCTOS:' as status;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'macrosur_ecommerce' 
AND TABLE_NAME = 'Productos'
ORDER BY ORDINAL_POSITION;

SELECT 'PASO 2 COMPLETADO - ESTRUCTURA PARA REPORTES LISTA' as resultado;