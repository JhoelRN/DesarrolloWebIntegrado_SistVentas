-- Script para actualizar imágenes con URLs optimizadas y verificadas
-- Usar imágenes de Lorem Picsum que son más confiables

-- Desactivar modo seguro
SET SQL_SAFE_UPDATES = 0;

-- Actualizar productos con placeholders visuales descriptivos
-- Usar placehold.co (más confiable que via.placeholder.com)

-- Alfombras y tapetes (Color marrón/beige)
UPDATE productos SET imagen_url = 'https://placehold.co/400/D2691E/FFFFFF?text=Alfombra+Persa' WHERE codigo_producto = 'ALF001';
UPDATE productos SET imagen_url = 'https://placehold.co/400/8B4513/FFFFFF?text=Tapete+Geometrico' WHERE codigo_producto = 'ALF002';
UPDATE productos SET imagen_url = 'https://placehold.co/400/F5DEB3/333333?text=Alfombra+Shaggy' WHERE codigo_producto = 'ALF003';
UPDATE productos SET imagen_url = 'https://placehold.co/400/DEB887/333333?text=Tapete+Pasillo' WHERE codigo_producto = 'ALF004';

-- Almohadas y cojines (Color azul/morado)
UPDATE productos SET imagen_url = 'https://placehold.co/400/6A5ACD/FFFFFF?text=Cojin+Terciopelo' WHERE codigo_producto = 'COJ001';
UPDATE productos SET imagen_url = 'https://placehold.co/400/87CEEB/333333?text=Set+4+Cojines' WHERE codigo_producto = 'COJ002';
UPDATE productos SET imagen_url = 'https://placehold.co/400/4169E1/FFFFFF?text=Almohada+Cervical' WHERE codigo_producto = 'COJ003';
UPDATE productos SET imagen_url = 'https://placehold.co/400/9370DB/FFFFFF?text=Cojin+Lumbar' WHERE codigo_producto = 'COJ004';

-- Cocina, comedor y bar (Color rojo/naranja)
UPDATE productos SET imagen_url = 'https://placehold.co/400/DC143C/FFFFFF?text=Vajilla+24pz' WHERE codigo_producto = 'COC001';
UPDATE productos SET imagen_url = 'https://placehold.co/400/FF6347/FFFFFF?text=Copas+Vino' WHERE codigo_producto = 'COC002';
UPDATE productos SET imagen_url = 'https://placehold.co/400/CD853F/FFFFFF?text=Tabla+Bambu' WHERE codigo_producto = 'COC003';
UPDATE productos SET imagen_url = 'https://placehold.co/400/C0C0C0/333333?text=Cubiertos+24pz' WHERE codigo_producto = 'COC004';

-- Cortinas (Color verde/gris)
UPDATE productos SET imagen_url = 'https://placehold.co/400/2F4F4F/FFFFFF?text=Cortina+Blackout' WHERE codigo_producto = 'CRT001';
UPDATE productos SET imagen_url = 'https://placehold.co/400/E0E0E0/333333?text=Visillo+Elegante' WHERE codigo_producto = 'CRT002';
UPDATE productos SET imagen_url = 'https://placehold.co/400/F5F5DC/333333?text=Cortina+Lino' WHERE codigo_producto = 'CRT003';
UPDATE productos SET imagen_url = 'https://placehold.co/400/708090/FFFFFF?text=Panel+Japones' WHERE codigo_producto = 'CRT004';

-- Cuadros y Espejos (Color oro/plata)
UPDATE productos SET imagen_url = 'https://placehold.co/400/FF1493/FFFFFF?text=Cuadro+Abstracto' WHERE codigo_producto = 'CUA001';
UPDATE productos SET imagen_url = 'https://placehold.co/400/FFD700/333333?text=Espejo+Dorado' WHERE codigo_producto = 'CUA002';
UPDATE productos SET imagen_url = 'https://placehold.co/400/228B22/FFFFFF?text=Set+3+Cuadros' WHERE codigo_producto = 'CUA003';
UPDATE productos SET imagen_url = 'https://placehold.co/400/000000/FFFFFF?text=Espejo+Completo' WHERE codigo_producto = 'CUA004';

-- Reactivar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Verificar las actualizaciones
SELECT codigo_producto, nombre_producto, imagen_url 
FROM productos 
ORDER BY codigo_producto;
