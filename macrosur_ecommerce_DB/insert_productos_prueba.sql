-- Script para insertar 20 productos de prueba con categorías
-- Ejecutar después de tener las categorías creadas

-- Primero verificamos/creamos las categorías necesarias
INSERT INTO categorias (nombre, descripcion, visible_cliente, activo) VALUES
('Alfombras y tapetes', 'Alfombras decorativas y tapetes funcionales', TRUE, TRUE),
('Almohadas y cojines', 'Cojines decorativos y almohadas', TRUE, TRUE),
('Cocina, comedor y bar', 'Artículos para cocina, comedor y bar', TRUE, TRUE),
('Cortinas', 'Cortinas y accesorios para ventanas', TRUE, TRUE),
('Cuadros y Espejos', 'Decoración de paredes con cuadros y espejos', TRUE, TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar 20 productos (4 por categoría)
-- URLs optimizadas: w=400&q=75&fm=webp para carga más rápida
-- Categoría 1: Alfombras y tapetes
INSERT INTO productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3, imagen_url, ficha_tecnica_html, activo) VALUES
('ALF001', 'Alfombra Persa Premium', 'Alfombra tradicional con diseños persas', 299.99, 5.5, 0.05, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=75&fm=webp&fit=crop', '<p>Alfombra de alta calidad con diseños tradicionales persas</p><ul><li>Material: Lana 100%</li><li>Tamaño: 200x300cm</li><li>Colores: Rojo, azul, beige</li></ul>', TRUE),
('ALF002', 'Tapete Moderno Geométrico', 'Tapete con diseños geométricos modernos', 149.99, 3.2, 0.03, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=75&fm=webp&fit=crop', '<p>Diseño contemporáneo ideal para espacios modernos</p><ul><li>Material: Polipropileno</li><li>Tamaño: 160x230cm</li><li>Fácil limpieza</li></ul>', TRUE),
('ALF003', 'Alfombra Shaggy Suave', 'Alfombra de pelo largo ultra suave', 199.99, 4.0, 0.04, 'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=400&q=75&fm=webp&fit=crop', '<p>Textura suave y acogedora para salas de estar</p><ul><li>Material: Fibra sintética</li><li>Altura pelo: 5cm</li><li>Tamaño: 200x290cm</li></ul>', TRUE),
('ALF004', 'Tapete Pasillo Antideslizante', 'Tapete largo para pasillos con base antideslizante', 79.99, 2.0, 0.02, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=75&fm=webp&fit=crop', '<p>Perfecto para pasillos y entradas</p><ul><li>Base antideslizante</li><li>Tamaño: 80x200cm</li><li>Lavable a máquina</li></ul>', TRUE);

-- Categoría 2: Almohadas y cojines
INSERT INTO productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3, imagen_url, ficha_tecnica_html, activo) VALUES
('COJ001', 'Cojín Decorativo Terciopelo', 'Cojín de terciopelo con relleno premium', 29.99, 0.8, 0.01, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&fm=webp&fit=crop', '<p>Elegante cojín de terciopelo</p><ul><li>Material: Terciopelo 100%</li><li>Tamaño: 45x45cm</li><li>Relleno: Pluma de ganso</li></ul>', TRUE),
('COJ002', 'Set 4 Cojines Lino Natural', 'Juego de 4 cojines de lino natural', 89.99, 2.5, 0.03, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=75&fm=webp&fit=crop', '<p>Set completo para sofás</p><ul><li>Material: Lino 100%</li><li>Tamaño: 40x40cm cada uno</li><li>Colores neutros</li></ul>', TRUE),
('COJ003', 'Almohada Cervical Viscoelástica', 'Almohada ergonómica para mejor descanso', 49.99, 1.2, 0.02, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=75&fm=webp&fit=crop', '<p>Soporte cervical óptimo</p><ul><li>Material: Viscoelástico</li><li>Funda lavable</li><li>Hipoalergénica</li></ul>', TRUE),
('COJ004', 'Cojín Lumbar Decorativo', 'Cojín rectangular para respaldo lumbar', 34.99, 0.9, 0.015, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=75&fm=webp&fit=crop', '<p>Ideal para sillas y sofás</p><ul><li>Tamaño: 30x50cm</li><li>Soporte lumbar</li><li>Diseños variados</li></ul>', TRUE);

-- Categoría 3: Cocina, comedor y bar
INSERT INTO productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3, imagen_url, ficha_tecnica_html, activo) VALUES
('COC001', 'Juego Vajilla 24 Piezas Porcelana', 'Vajilla completa de porcelana blanca', 159.99, 8.5, 0.06, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=75&fm=webp&fit=crop', '<p>Vajilla elegante para 6 personas</p><ul><li>Material: Porcelana</li><li>Incluye: Platos, tazas, platillos</li><li>Apta microondas y lavavajillas</li></ul>', TRUE),
('COC002', 'Set Copas Vino Cristal', 'Juego de 6 copas de cristal para vino', 69.99, 2.0, 0.02, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=75&fm=webp&fit=crop', '<p>Cristal de alta calidad</p><ul><li>Capacidad: 450ml</li><li>6 unidades</li><li>Cristal transparente</li></ul>', TRUE),
('COC003', 'Tabla Cortar Bambú Grande', 'Tabla de cortar profesional de bambú', 39.99, 2.5, 0.015, 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&q=75&fm=webp&fit=crop', '<p>Tabla duradera y ecológica</p><ul><li>Material: Bambú natural</li><li>Tamaño: 45x30cm</li><li>Antibacteriana</li></ul>', TRUE),
('COC004', 'Set Cubiertos Acero Inoxidable 24pz', 'Cubiertos modernos de acero inoxidable', 89.99, 3.5, 0.03, 'https://images.unsplash.com/photo-1565789877953-ee94a71c2b1c?w=400&q=75&fm=webp&fit=crop', '<p>Set completo para 6 personas</p><ul><li>Material: Acero inoxidable 18/10</li><li>Diseño moderno</li><li>Lavavajillas</li></ul>', TRUE);

-- Categoría 4: Cortinas
INSERT INTO productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3, imagen_url, ficha_tecnica_html, activo) VALUES
('CRT001', 'Cortina Blackout Térmica', 'Cortina bloqueadora de luz 100%', 79.99, 2.8, 0.025, 'https://images.unsplash.com/photo-1590873875583-4ea90bbbb1d9?w=400&q=75&fm=webp&fit=crop', '<p>Bloquea luz y temperatura</p><ul><li>Medida: 140x220cm</li><li>Material: Poliéster blackout</li><li>Aislante térmico</li></ul>', TRUE),
('CRT002', 'Cortina Visillo Elegante', 'Visillo translúcido elegante', 49.99, 1.5, 0.02, 'https://images.unsplash.com/photo-1604599455556-3b5a035b5ea7?w=400&q=75&fm=webp&fit=crop', '<p>Cortina ligera y elegante</p><ul><li>Medida: 150x230cm</li><li>Material: Voile</li><li>Deja pasar luz natural</li></ul>', TRUE),
('CRT003', 'Cortina Doble Lino Beige', 'Cortina de lino natural color beige', 119.99, 3.5, 0.03, 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400&q=75&fm=webp&fit=crop', '<p>Elegancia natural</p><ul><li>Medida: 160x250cm</li><li>Material: Lino 80%</li><li>Color beige neutro</li></ul>', TRUE),
('CRT004', 'Set Cortinas Panel Japonés', 'Panel deslizante moderno 4 piezas', 189.99, 5.0, 0.04, 'https://images.unsplash.com/photo-1604076947778-557e3e47a2c1?w=400&q=75&fm=webp&fit=crop', '<p>Sistema de paneles japoneses</p><ul><li>4 paneles de 60cm c/u</li><li>Rieles incluidos</li><li>Diseño minimalista</li></ul>', TRUE);

-- Categoría 5: Cuadros y Espejos
INSERT INTO productos (codigo_producto, nombre_producto, descripcion_corta, precio_unitario, peso_kg, volumen_m3, imagen_url, ficha_tecnica_html, activo) VALUES
('CUA001', 'Cuadro Abstracto Moderno', 'Arte abstracto contemporáneo', 129.99, 2.5, 0.02, 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&q=75&fm=webp&fit=crop', '<p>Arte moderno para decoración</p><ul><li>Tamaño: 80x120cm</li><li>Impresión canvas</li><li>Marco madera</li></ul>', TRUE),
('CUA002', 'Espejo Redondo Marco Dorado', 'Espejo decorativo marco dorado', 99.99, 3.8, 0.025, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=75&fm=webp&fit=crop', '<p>Espejo elegante decorativo</p><ul><li>Diámetro: 80cm</li><li>Marco metal dorado</li><li>Fácil instalación</li></ul>', TRUE),
('CUA003', 'Set 3 Cuadros Paisaje Natural', 'Tríptico paisaje naturaleza', 159.99, 4.5, 0.03, 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=400&q=75&fm=webp&fit=crop', '<p>Set decorativo de 3 cuadros</p><ul><li>Medidas: 40x60cm c/u</li><li>Impresión HD</li><li>Marcos incluidos</li></ul>', TRUE),
('CUA004', 'Espejo Cuerpo Completo Rectangular', 'Espejo de pie marco minimalista', 149.99, 8.0, 0.05, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=75&fm=webp&fit=crop', '<p>Espejo de cuerpo entero</p><ul><li>Medida: 50x170cm</li><li>Con soporte de pie</li><li>Marco negro</li></ul>', TRUE);

-- Asignar categorías a productos
-- Alfombras y tapetes (categoria_id = 1 - ajustar según tu BD)
SET @cat_alfombras = (SELECT categoria_id FROM categorias WHERE nombre = 'Alfombras y tapetes' LIMIT 1);
SET @cat_almohadas = (SELECT categoria_id FROM categorias WHERE nombre = 'Almohadas y cojines' LIMIT 1);
SET @cat_cocina = (SELECT categoria_id FROM categorias WHERE nombre = 'Cocina, comedor y bar' LIMIT 1);
SET @cat_cortinas = (SELECT categoria_id FROM categorias WHERE nombre = 'Cortinas' LIMIT 1);
SET @cat_cuadros = (SELECT categoria_id FROM categorias WHERE nombre = 'Cuadros y Espejos' LIMIT 1);

-- Relacionar productos con categorías
INSERT INTO producto_categoria (producto_id, categoria_id)
SELECT p.producto_id, @cat_alfombras FROM productos p WHERE p.codigo_producto IN ('ALF001', 'ALF002', 'ALF003', 'ALF004');

INSERT INTO producto_categoria (producto_id, categoria_id)
SELECT p.producto_id, @cat_almohadas FROM productos p WHERE p.codigo_producto IN ('COJ001', 'COJ002', 'COJ003', 'COJ004');

INSERT INTO producto_categoria (producto_id, categoria_id)
SELECT p.producto_id, @cat_cocina FROM productos p WHERE p.codigo_producto IN ('COC001', 'COC002', 'COC003', 'COC004');

INSERT INTO producto_categoria (producto_id, categoria_id)
SELECT p.producto_id, @cat_cortinas FROM productos p WHERE p.codigo_producto IN ('CRT001', 'CRT002', 'CRT003', 'CRT004');

INSERT INTO producto_categoria (producto_id, categoria_id)
SELECT p.producto_id, @cat_cuadros FROM productos p WHERE p.codigo_producto IN ('CUA001', 'CUA002', 'CUA003', 'CUA004');

-- Verificar inserción
SELECT 
    c.nombre as categoria,
    COUNT(pc.producto_id) as cantidad_productos
FROM categorias c
LEFT JOIN producto_categoria pc ON c.categoria_id = pc.categoria_id
WHERE c.nombre IN ('Alfombras y tapetes', 'Almohadas y cojines', 'Cocina, comedor y bar', 'Cortinas', 'Cuadros y Espejos')
GROUP BY c.categoria_id, c.nombre;
