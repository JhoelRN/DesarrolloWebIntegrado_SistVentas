-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de tabla pedidos si existe
SHOW TABLES LIKE 'pedidos';

-- Ver estructura de tabla detalle_pedido si existe  
SHOW TABLES LIKE 'detalle_pedido';

-- Ver estructura de inventario
DESCRIBE inventario;

-- Ver registros de inventario
SELECT i.inventario_id, vp.sku, p.nombre_producto, ui.nombre_ubicacion, i.cantidad, i.stock_minimo_seguridad
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario ui ON i.ubicacion_id = ui.ubicacion_id
LIMIT 10;

-- Ver ubicaciones disponibles
SELECT * FROM ubicaciones_inventario;

-- Ver alarmas activas
SELECT * FROM alarmas_stock WHERE resuelta = FALSE;
