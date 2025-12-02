-- ===================================================================
-- VERIFICACIÓN: Relación Inventario vs Alarmas
-- ===================================================================

-- 1. Inventarios con stock bajo SIN alarma activa
SELECT 
    i.inventario_id,
    p.nombre_producto,
    v.sku,
    u.nombre_ubicacion,
    i.cantidad as stock_actual,
    i.stock_minimo_seguridad as stock_minimo,
    'SIN ALARMA' as estado,
    CASE 
        WHEN i.cantidad = 0 THEN '🔴 CRÍTICO (Stock Cero)'
        WHEN i.cantidad < i.stock_minimo_seguridad THEN '🟡 BAJO (Stock < Mínimo)'
        ELSE '✅ OK'
    END as nivel_stock
FROM inventario i
JOIN variantes_producto v ON i.variante_id = v.variante_id
JOIN productos p ON v.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
WHERE i.cantidad < i.stock_minimo_seguridad
  AND NOT EXISTS (
      SELECT 1 FROM alarmas_stock a 
      WHERE a.inventario_id = i.inventario_id 
      AND a.resuelta = false
  )
ORDER BY i.cantidad ASC;

-- 2. Resumen comparativo
SELECT 
    '📊 RESUMEN' as seccion,
    (SELECT COUNT(*) FROM inventario WHERE cantidad < stock_minimo_seguridad) as inventarios_bajo_stock,
    (SELECT COUNT(*) FROM alarmas_stock WHERE resuelta = false) as alarmas_activas,
    (SELECT COUNT(*) FROM inventario i 
     WHERE i.cantidad < i.stock_minimo_seguridad
     AND NOT EXISTS (
         SELECT 1 FROM alarmas_stock a 
         WHERE a.inventario_id = i.inventario_id 
         AND a.resuelta = false
     )) as inventarios_sin_alarma;

-- 3. Verificar si el método verificarYGestionarAlarmas() se está ejecutando
SELECT 
    '⚠️ POSIBLE CAUSA' as diagnostico,
    'Las alarmas solo se crean cuando hay movimientos de stock' as explicacion,
    'Si el inventario tiene stock bajo pero no hubo movimientos recientes, no habrá alarma' as detalle;
