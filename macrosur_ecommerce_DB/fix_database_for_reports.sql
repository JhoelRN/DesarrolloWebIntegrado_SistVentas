USE macrosur_ecommerce;

-- =====================================================
-- SCRIPT DE CORRECCIÓN Y DATOS DE PRUEBA PARA REPORTES
-- =====================================================

-- 1. AGREGAR CAMPOS FALTANTES A PRODUCTOS
ALTER TABLE Productos 
ADD COLUMN codigo_producto VARCHAR(50) UNIQUE AFTER producto_id,
ADD COLUMN precio_unitario DECIMAL(10,2) DEFAULT 0.00 AFTER ficha_tecnica_html;

-- Actualizar nombres de productos para que coincidan con queries
ALTER TABLE Productos CHANGE nombre nombre_producto VARCHAR(255) NOT NULL;

-- 2. CREAR VISTA PARA SIMPLIFICAR INVENTARIO (compatible con reportes)
CREATE OR REPLACE VIEW Vista_Inventario AS
SELECT 
    p.producto_id,
    p.codigo_producto,
    p.nombre_producto AS producto,
    i.cantidad AS stock_actual,
    i.stock_minimo_seguridad AS stock_minimo,
    ui.nombre_ubicacion AS ubicacion,
    ui.ubicacion_id AS almacen_id
FROM Productos p
LEFT JOIN Variantes_Producto vp ON p.producto_id = vp.producto_id
LEFT JOIN Inventario i ON vp.variante_id = i.variante_id
LEFT JOIN Ubicaciones_Inventario ui ON i.ubicacion_id = ui.ubicacion_id;

-- 3. CREAR VISTA PARA VENTAS (basada en Pedidos)
CREATE OR REPLACE VIEW Vista_Ventas AS
SELECT 
    p.pedido_id,
    p.fecha_pedido AS fecha,
    CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre,
    GROUP_CONCAT(CONCAT(prod.nombre_producto, ' (', dp.cantidad, ')') SEPARATOR ', ') AS productos_descripcion,
    p.total_final AS total,
    p.estado
FROM Pedidos p
LEFT JOIN Clientes c ON p.cliente_id = c.cliente_id
LEFT JOIN Detalle_Pedido dp ON p.pedido_id = dp.pedido_id
LEFT JOIN Variantes_Producto vp ON dp.variante_id = vp.variante_id
LEFT JOIN Productos prod ON vp.producto_id = prod.producto_id
GROUP BY p.pedido_id, p.fecha_pedido, c.nombre, c.apellido, p.total_final, p.estado;

-- 4. INSERTAR DATOS DE PRUEBA - CATEGORÍAS
INSERT INTO Categorias (nombre, descripcion, visible_cliente) VALUES
('Hogar y Decoración', 'Productos para el hogar', true),
('Textiles', 'Ropa de cama y textiles', true),
('Muebles', 'Muebles y mobiliario', true),
('Electrodomésticos', 'Electrodomésticos diversos', true);

-- 5. INSERTAR DATOS DE PRUEBA - PRODUCTOS
INSERT INTO Productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg) VALUES
('PROD-001', 'Alfombra Persa Grande', 'Alfombra de alta calidad estilo persa', 1250.00, 15.5),
('PROD-002', 'Juego de Sábanas Premium', 'Sábanas 100% algodón egipcio', 320.00, 2.0),
('PROD-003', 'Mesa de Centro Moderna', 'Mesa de centro en madera de roble', 890.00, 25.0),
('PROD-004', 'Lámpara de Pie Vintage', 'Lámpara decorativa estilo vintage', 450.00, 5.5),
('PROD-005', 'Cojines Decorativos Set x4', 'Set de cojines decorativos variados', 180.00, 1.2);

-- 6. RELACIONAR PRODUCTOS CON CATEGORÍAS
INSERT INTO Producto_Categoria (producto_id, categoria_id) VALUES
(1, 1), -- Alfombra -> Hogar
(2, 2), -- Sábanas -> Textiles
(3, 3), -- Mesa -> Muebles
(4, 1), -- Lámpara -> Hogar
(5, 2); -- Cojines -> Textiles

-- 7. INSERTAR DATOS DE PRUEBA - PROVEEDORES Y UBICACIONES
INSERT INTO Proveedores (nombre, contacto, telefono) VALUES
('Proveedor Textiles SAC', 'Ana García', '01-2345678'),
('Muebles del Norte SRL', 'Carlos Mendoza', '01-3456789');

INSERT INTO Ubicaciones_Inventario (nombre_ubicacion, es_fisica, direccion_fisica) VALUES
('Tienda Central Lima', true, 'Av. Larco 1234, Miraflores'),
('Almacén Principal', true, 'Av. Industrial 567, Callao'),
('Almacén Proveedor A', false, NULL);

-- 8. CREAR VARIANTES DE PRODUCTOS
INSERT INTO Variantes_Producto (producto_id, sku, precio_base, url_imagen_principal) VALUES
(1, 'ALF-PER-001', 1250.00, '/images/alfombra-persa.jpg'),
(2, 'SAB-PREM-001', 320.00, '/images/sabanas-premium.jpg'),
(3, 'MES-MOD-001', 890.00, '/images/mesa-centro.jpg'),
(4, 'LAM-VIN-001', 450.00, '/images/lampara-vintage.jpg'),
(5, 'COJ-SET-001', 180.00, '/images/cojines-set.jpg');

-- 9. INSERTAR INVENTARIO
INSERT INTO Inventario (variante_id, ubicacion_id, cantidad, stock_minimo_seguridad) VALUES
(1, 1, 15, 5),  -- Alfombra en Tienda Central
(1, 2, 25, 10), -- Alfombra en Almacén Principal
(2, 1, 45, 15), -- Sábanas en Tienda Central
(2, 2, 80, 20), -- Sábanas en Almacén Principal
(3, 1, 8, 3),   -- Mesa en Tienda Central
(3, 2, 12, 5),  -- Mesa en Almacén Principal
(4, 1, 20, 8),  -- Lámpara en Tienda Central
(4, 2, 35, 12), -- Lámpara en Almacén Principal
(5, 1, 60, 20), -- Cojines en Tienda Central
(5, 2, 90, 30); -- Cojines en Almacén Principal

-- 10. INSERTAR CLIENTES DE PRUEBA
INSERT INTO Clientes (nombre, apellido, correo, contrasena_hash, telefono) VALUES
('María', 'González', 'maria.gonzalez@email.com', '$2b$10$example_hash_1', '987654321'),
('Juan', 'Pérez', 'juan.perez@email.com', '$2b$10$example_hash_2', '987654322'),
('Ana', 'Rodriguez', 'ana.rodriguez@email.com', '$2b$10$example_hash_3', '987654323');

-- 11. INSERTAR DIRECCIONES DE CLIENTES
INSERT INTO Direcciones (cliente_id, alias, calle, numero, ciudad, departamento, codigo_postal, es_principal) VALUES
(1, 'Casa', 'Av. Los Pinos', '123', 'Lima', 'Lima', '15001', true),
(2, 'Casa', 'Jr. Las Flores', '456', 'Lima', 'Lima', '15002', true),
(3, 'Oficina', 'Av. Empresarial', '789', 'Lima', 'Lima', '15003', true);

-- 12. INSERTAR PEDIDOS DE PRUEBA
INSERT INTO Pedidos (cliente_id, estado, total_neto, total_impuestos, total_envio, total_descuento, total_final, metodo_entrega, direccion_envio_id) VALUES
(1, 'Entregado', 1250.00, 225.00, 50.00, 0.00, 1525.00, 'Domicilio', 1),
(2, 'En Preparacion', 320.00, 57.60, 25.00, 30.00, 372.60, 'Domicilio', 2),
(3, 'Pagado', 890.00, 160.20, 75.00, 0.00, 1125.20, 'Domicilio', 3),
(1, 'Entregado', 630.00, 113.40, 40.00, 50.00, 733.40, 'Retiro en Tienda', NULL),
(2, 'Despachado', 180.00, 32.40, 20.00, 0.00, 232.40, 'Domicilio', 2);

-- 13. INSERTAR DETALLES DE PEDIDOS
INSERT INTO Detalle_Pedido (pedido_id, variante_id, precio_unitario, cantidad, descuento_aplicado, subtotal, ubicacion_stock_origen) VALUES
(1, 1, 1250.00, 1, 0.00, 1250.00, 1), -- Alfombra
(2, 2, 320.00, 1, 30.00, 290.00, 1),   -- Sábanas con descuento
(3, 3, 890.00, 1, 0.00, 890.00, 2),    -- Mesa
(4, 4, 450.00, 1, 25.00, 425.00, 1),   -- Lámpara con descuento
(4, 5, 180.00, 1, 25.00, 155.00, 1),   -- Cojines con descuento
(5, 5, 180.00, 1, 0.00, 180.00, 2);    -- Cojines

-- 14. AGREGAR FECHAS REALISTAS A LOS PEDIDOS (últimos 3 meses)
UPDATE Pedidos SET fecha_pedido = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 90) DAY);

-- 15. AGREGAR FECHA_CREACION A USUARIOS_ADMIN SI NO EXISTE
ALTER TABLE Usuarios_Admin ADD COLUMN fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- =====================================================
-- VERIFICACIÓN: CONSULTAS PARA VALIDAR LOS DATOS
-- =====================================================

-- Verificar productos
SELECT 'PRODUCTOS' as tabla, COUNT(*) as registros FROM Productos;

-- Verificar inventario
SELECT 'INVENTARIO' as tabla, COUNT(*) as registros FROM Vista_Inventario WHERE stock_actual IS NOT NULL;

-- Verificar ventas
SELECT 'VENTAS' as tabla, COUNT(*) as registros FROM Vista_Ventas;

-- Verificar usuarios admin
SELECT 'USUARIOS_ADMIN' as tabla, COUNT(*) as registros FROM Usuarios_Admin;

-- =====================================================
-- ACTUALIZACIÓN DE QUERIES EN EL BACKEND (DOCUMENTACIÓN)
-- =====================================================

/*
NOTA: Las queries del backend deben actualizarse para usar estas vistas:

1. REPORTE DE PRODUCTOS:
SELECT codigo_producto, nombre_producto, c.nombre AS nombre_categoria,
       precio_unitario, COALESCE(vi.stock_actual,0) AS stock_actual
FROM Productos p
LEFT JOIN Producto_Categoria pc ON p.producto_id = pc.producto_id
LEFT JOIN Categorias c ON pc.categoria_id = c.categoria_id
LEFT JOIN Vista_Inventario vi ON p.producto_id = vi.producto_id
WHERE (:fechaInicio IS NULL OR p.fecha_creacion >= :fechaInicio)
  AND (:categoriaId IS NULL OR c.categoria_id = :categoriaId)
ORDER BY p.nombre_producto;

2. REPORTE DE INVENTARIO:
SELECT producto, stock_actual, stock_minimo, ubicacion
FROM Vista_Inventario
WHERE (:almacenId IS NULL OR almacen_id = :almacenId)
ORDER BY producto;

3. REPORTE DE VENTAS:
SELECT fecha, cliente_nombre AS cliente, productos_descripcion AS productos,
       total, estado
FROM Vista_Ventas
WHERE (:fechaInicio IS NULL OR fecha >= :fechaInicio)
  AND (:fechaFin IS NULL OR fecha <= :fechaFin)
ORDER BY fecha DESC;

4. REPORTE DE USUARIOS:
SELECT nombre, apellido, correo_corporativo, r.nombre_rol,
       fecha_creacion, activo
FROM Usuarios_Admin ua
LEFT JOIN Roles r ON ua.rol_id = r.rol_id
WHERE (:rolId IS NULL OR ua.rol_id = :rolId)
  AND (:soloActivos IS NULL OR ua.activo = :soloActivos)
ORDER BY ua.fecha_creacion DESC;
*/