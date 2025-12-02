-- ============================================
-- SCRIPT: Corregir Operadores Logísticos
-- ============================================
-- Ejecuta este script en MySQL Workbench

-- 1. Ver estado actual
SELECT * FROM operadores_logisticos;

-- 2. Limpiar tabla (eliminar duplicados y datos incorrectos)
DELETE FROM operadores_logisticos;

-- 3. Reiniciar el auto_increment
ALTER TABLE operadores_logisticos AUTO_INCREMENT = 1;

-- 4. Insertar operadores correctos (nombres coinciden con frontend)
INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('chilexpress', 'https://www.chilexpress.cl/Seguimiento?='),
('starken', 'https://www.starken.cl/seguimiento?codigo='),
('correos_chile', 'https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio='),
('bluexpress', 'https://www.bluex.cl/seguimiento?numero='),
('otro', 'https://ejemplo.com/seguimiento?numero=');

-- 5. Verificar resultado final
SELECT 
    operador_id AS 'ID',
    nombre AS 'Nombre',
    url_rastreo_base AS 'URL Base'
FROM operadores_logisticos
ORDER BY operador_id;

-- ============================================
-- RESULTADO ESPERADO:
-- +----+---------------+--------------------------------------------------------+
-- | ID | Nombre        | URL Base                                               |
-- +----+---------------+--------------------------------------------------------+
-- | 1  | chilexpress   | https://www.chilexpress.cl/Seguimiento?=               |
-- | 2  | starken       | https://www.starken.cl/seguimiento?codigo=             |
-- | 3  | correos_chile | https://www.correos.cl/SitePages/seguimiento/segui...  |
-- | 4  | bluexpress    | https://www.bluex.cl/seguimiento?numero=               |
-- | 5  | otro          | https://ejemplo.com/seguimiento?numero=                |
-- +----+---------------+--------------------------------------------------------+
-- 
-- IMPORTANTE: Los nombres ahora coinciden EXACTAMENTE con los valores
--             del dropdown en PedidosLogisticaPage.jsx:
--             { value: 'chilexpress', label: 'Chilexpress' }
--             { value: 'starken', label: 'Starken' }
--             { value: 'correos_chile', label: 'Correos de Chile' }
--             { value: 'bluexpress', label: 'Blue Express' }
--             { value: 'otro', label: 'Otro' }
-- ============================================
