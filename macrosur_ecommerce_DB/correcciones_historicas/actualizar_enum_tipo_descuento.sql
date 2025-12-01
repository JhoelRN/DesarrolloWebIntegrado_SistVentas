-- ========================================
-- ACTUALIZAR ENUM tipo_descuento
-- ========================================
-- Problema: La columna tipo_descuento tiene valores ENUM antiguos
-- que no coinciden con el enum TipoDescuento del backend
-- 
-- Valores antiguos: 'Porcentaje', 'Monto Fijo', '2x1', 'Envio Gratis'
-- Valores correctos: 'Porcentaje', 'Monto_Fijo', 'Dos_X_Uno', 'Envio_Gratis'

USE macrosur_ecommerce;

-- Paso 1: Verificar la definición actual
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'macrosur_ecommerce'
  AND TABLE_NAME = 'reglas_descuento'
  AND COLUMN_NAME = 'tipo_descuento';

-- Paso 2: Desactivar safe mode temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Paso 3: Cambiar tipo_descuento a VARCHAR temporalmente (para migración segura)
ALTER TABLE reglas_descuento 
MODIFY COLUMN tipo_descuento VARCHAR(20) NOT NULL;

-- Paso 4: Actualizar valores existentes para que coincidan con el nuevo enum
UPDATE reglas_descuento 
SET tipo_descuento = CASE 
    WHEN tipo_descuento = 'Monto Fijo' THEN 'Monto_Fijo'
    WHEN tipo_descuento = '2x1' THEN 'Dos_X_Uno'
    WHEN tipo_descuento = 'Envio Gratis' THEN 'Envio_Gratis'
    ELSE tipo_descuento
END
WHERE regla_id > 0;  -- Condición para satisfacer safe mode

-- Paso 5: Reactivar safe mode
SET SQL_SAFE_UPDATES = 1;

-- Paso 6: Cambiar de nuevo a ENUM con los valores correctos
ALTER TABLE reglas_descuento 
MODIFY COLUMN tipo_descuento ENUM(
    'Porcentaje', 
    'Monto_Fijo', 
    'Dos_X_Uno', 
    'Envio_Gratis'
) NOT NULL;

-- Verificar los cambios
SELECT 
    regla_id,
    nombre_regla,
    tipo_descuento,
    valor_descuento
FROM reglas_descuento
ORDER BY regla_id;

-- Verificar la nueva definición de la columna
SHOW COLUMNS FROM reglas_descuento WHERE Field = 'tipo_descuento';
