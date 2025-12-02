-- ============================================================
-- CORRECCIÓN DE DATOS MAL CODIFICADOS
-- ============================================================
-- Este script corrige caracteres latinos mal insertados
-- ============================================================

-- Actualizar categorías con caracteres corregidos
UPDATE categorias SET descripcion = 'Artículos para cocina, comedor y bar' WHERE categoria_id = 8;

-- Actualizar productos con caracteres corregidos
UPDATE productos SET descripcion_corta = 'Alfombra tradicional con diseños persas' WHERE codigo_producto = 'ALF001';
UPDATE productos SET ficha_tecnica_html = '<p>Diseño contemporáneo ideal para espacios modernos</p><ul><li>Material: Polipropileno</li><li>Tamaño: 160x230cm</li><li>Fácil limpieza</li></ul>' WHERE codigo_producto = 'ALF002';
UPDATE productos SET ficha_tecnica_html = '<p>Textura suave y acogedora para salas de estar</p><ol><li>Material: Fibra sintética</li><li>Altura pelo: 5cm</li><li>Tamaño: 200x290cm</li></ol>' WHERE codigo_producto = 'ALF003';
UPDATE productos SET descripcion_corta = 'Cojín de terciopelo con relleno premium' WHERE codigo_producto = 'COJ001';
UPDATE productos SET ficha_tecnica_html = '<p>Elegante cojín de terciopelo</p><ol><li>Material: Terciopelo 100%</li><li>Tamaño: 45x45cm</li><li>Relleno: Pluma de ganso</li></ol>' WHERE codigo_producto = 'COJ001';
UPDATE productos SET descripcion_corta = 'Cojín rectangular para respaldo lumbar' WHERE codigo_producto = 'COJ004';
UPDATE productos SET ficha_tecnica_html = '<p>Soporte cervical óptimo</p><ol><li>Material: Viscoelástico</li><li>Funda lavable</li><li>Hipoalergénica</li></ol>' WHERE codigo_producto = 'COJ003';
UPDATE productos SET descripcion_corta = 'Tabla de cortar profesional de bambú' WHERE codigo_producto = 'COC003';
UPDATE productos SET ficha_tecnica_html = '<p>Tabla duradera y ecológica</p><ul><li>Material: Bambú natural</li><li>Tamaño: 45x30cm</li><li>Antibacteriana</li></ul>' WHERE codigo_producto = 'COC003';
UPDATE productos SET descripcion_corta = 'Cortina bloqueadora de luz 100%' WHERE codigo_producto = 'CRT001';
UPDATE productos SET ficha_tecnica_html = '<p>Bloquea luz y temperatura</p><ul><li>Medida: 140x220cm</li><li>Material: Poliéster blackout</li><li>Aislante térmico</li></ul>' WHERE codigo_producto = 'CRT001';
UPDATE productos SET descripcion_corta = 'Visillo translúcido elegante' WHERE codigo_producto = 'CRT002';
UPDATE productos SET descripcion_corta = 'Panel deslizante moderno 4 piezas' WHERE codigo_producto = 'CRT004';
UPDATE productos SET ficha_tecnica_html = '<p>Sistema de paneles japoneses</p><ul><li>4 paneles de 60cm c/u</li><li>Rieles incluidos</li><li>Diseño minimalista</li></ul>' WHERE codigo_producto = 'CRT004';
UPDATE productos SET descripcion_corta = 'Arte abstracto contemporáneo' WHERE codigo_producto = 'CUA001';
UPDATE productos SET ficha_tecnica_html = '<p>Arte moderno para decoración</p><ul><li>Tamaño: 80x120cm</li><li>Impresión canvas</li><li>Marco madera</li></ul>' WHERE codigo_producto = 'CUA001';
UPDATE productos SET ficha_tecnica_html = '<p>Espejo elegante decorativo</p><ul><li>Diámetro: 80cm</li><li>Marco metal dorado</li><li>Fácil instalación</li></ul>' WHERE codigo_producto = 'CUA002';
UPDATE productos SET descripcion_corta = 'Tríptico paisaje naturaleza' WHERE codigo_producto = 'CUA003';
UPDATE productos SET ficha_tecnica_html = '<p>Set decorativo de 3 cuadros</p><ul><li>Medidas: 40x60cm c/u</li><li>Impresión HD</li><li>Marcos incluidos</li></ul>' WHERE codigo_producto = 'CUA003';

-- Actualizar proveedores
UPDATE proveedores SET nombre = 'Proveedor General (Por Defecto)' WHERE proveedor_id = 1;
UPDATE proveedores SET contacto = 'Juan Pérez - Gerente de Ventas' WHERE proveedor_id = 6;
UPDATE proveedores SET contacto = 'María González - Atención al Cliente' WHERE proveedor_id = 7;
UPDATE proveedores SET contacto = 'Carlos Rodríguez - Ventas' WHERE proveedor_id = 8;

-- Actualizar ubicaciones
UPDATE ubicaciones_inventario SET nombre_ubicacion = 'Tienda Física Macrosur' WHERE ubicacion_id = 1;
UPDATE ubicaciones_inventario SET direccion = 'Av. Principal 123, Santiago Centro' WHERE ubicacion_id = 1;
UPDATE ubicaciones_inventario SET nombre_ubicacion = 'Almacén Central' WHERE ubicacion_id = 3;
UPDATE ubicaciones_inventario SET nombre_ubicacion = 'Tienda Física MacroSur' WHERE ubicacion_id = 4;
UPDATE ubicaciones_inventario SET direccion = 'Av. Principal 123, Lima, Perú' WHERE ubicacion_id = 4;
UPDATE ubicaciones_inventario SET nombre_ubicacion = 'Almacén Central' WHERE ubicacion_id = 5;
UPDATE ubicaciones_inventario SET direccion = 'Zona Industrial Norte, Callao, Perú' WHERE ubicacion_id = 5;

-- Actualizar movimientos con motivos corregidos
UPDATE movimientos_stock SET motivo = 'Recepción orden #7 - Distribución a Tienda (10 uds)' WHERE movimiento_stock_id = 3;
UPDATE movimientos_stock SET motivo = 'Recepción orden #8 - Distribución a Tienda (7 uds)' WHERE movimiento_stock_id = 4;
UPDATE movimientos_stock SET motivo = 'Recepción orden #8 - Distribución a Almacén (10 uds)' WHERE movimiento_stock_id = 5;
UPDATE movimientos_stock SET motivo = 'Recepción orden #9 - Distribución a Tienda (5 uds)' WHERE movimiento_stock_id = 6;
UPDATE movimientos_stock SET motivo = 'Recepción orden #9 - Distribución a Almacén (5 uds)' WHERE movimiento_stock_id = 7;
UPDATE movimientos_stock SET motivo = 'Recepción orden #10 - Distribución a Tienda (10 uds)' WHERE movimiento_stock_id = 8;
UPDATE movimientos_stock SET motivo = 'Recepción orden #11 - Distribución a Tienda (4 uds)' WHERE movimiento_stock_id = 9;
UPDATE movimientos_stock SET motivo = 'Recepción orden #11 - Distribución a Almacén (8 uds)' WHERE movimiento_stock_id = 10;
UPDATE movimientos_stock SET motivo = 'Recepción orden #12 - Distribución a Tienda (5 uds)' WHERE movimiento_stock_id = 11;
UPDATE movimientos_stock SET motivo = 'Recepción orden #12 - Distribución a Almacén (10 uds)' WHERE movimiento_stock_id = 12;
UPDATE movimientos_stock SET motivo = 'Recepción orden #13 - Distribución a Tienda (10 uds)' WHERE movimiento_stock_id = 13;
UPDATE movimientos_stock SET motivo = 'Recepción orden #14 - Distribución a Tienda (5 uds)' WHERE movimiento_stock_id = 14;
UPDATE movimientos_stock SET motivo = 'Recepción orden #14 - Distribución a Almacén (11 uds)' WHERE movimiento_stock_id = 15;

-- Actualizar roles
UPDATE roles SET nombre_rol = 'Gestor Logística' WHERE rol_id = 5;

-- Verificación
SELECT 'Corrección completada' as Estado;
