-- ============================================
-- SCRIPT: Insertar Operadores Logísticos
-- ============================================
-- Ejecuta este script en MySQL Workbench o phpMyAdmin

-- 1. Verificar tabla existente
DESCRIBE operadores_logisticos;

-- 2. Ver operadores actuales (si hay)
SELECT * FROM operadores_logisticos;

-- 3. Limpiar tabla si quieres empezar de cero (OPCIONAL)
-- DELETE FROM operadores_logisticos;

-- 4. Insertar los 5 operadores logísticos (coinciden con dropdown del frontend)
INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('chilexpress', 'https://www.chilexpress.cl/seguimiento/'),
('starken', 'https://www.starken.cl/seguimiento/'),
('correos_chile', 'https://www.correos.cl/seguimiento/'),
('bluexpress', 'https://www.bluex.cl/seguimiento/'),
('otro', 'https://ejemplo.com/seguimiento/');

-- 5. Verificar inserción exitosa
SELECT 
    operador_id,
    nombre,
    url_rastreo_base
FROM operadores_logisticos
ORDER BY operador_id;

-- ============================================
-- RESULTADO ESPERADO:
-- +-------------+----------------+--------------------------------------+
-- | operador_id | nombre         | url_rastreo_base                     |
-- +-------------+----------------+--------------------------------------+
-- | 1           | chilexpress    | https://www.chilexpress.cl/seguim... |
-- | 2           | starken        | https://www.starken.cl/seguimiento/  |
-- | 3           | correos_chile  | https://www.correos.cl/seguimiento/  |
-- | 4           | bluexpress     | https://www.bluex.cl/seguimiento/    |
-- | 5           | otro           | https://ejemplo.com/seguimiento/     |
-- +-------------+----------------+--------------------------------------+
-- 
-- NOTA: Los nombres coinciden EXACTAMENTE con los valores del dropdown 
--       en PedidosLogisticaPage.jsx para evitar errores de búsqueda.
-- ============================================
