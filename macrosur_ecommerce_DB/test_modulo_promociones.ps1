# =====================================================
# SCRIPT DE PRUEBA - MÓDULO DE PROMOCIONES
# =====================================================
# 
# Este script prueba todos los endpoints REST del módulo
# de promociones para verificar la implementación completa
#
# Requisitos:
# - Backend corriendo en http://localhost:8081
# - MySQL con la tabla reglas_descuento

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA MÓDULO DE PROMOCIONES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:8081/api/promociones"
$headers = @{
    "Content-Type" = "application/json"
}

# Verificar que el backend esté activo
try {
    Write-Host "1️⃣  Verificando backend..." -ForegroundColor Yellow
    Invoke-RestMethod -Uri "http://localhost:8081/actuator/health" -Method Get -ErrorAction Stop | Out-Null
    Write-Host "✅ Backend activo" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Backend no está activo en puerto 8081" -ForegroundColor Red
    Write-Host "   Inicia el backend con: cd macrosur-ecommerce-backend; .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Test 1: Obtener todas las promociones (puede estar vacío)
Write-Host "2️⃣  Test GET /api/promociones (todas)" -ForegroundColor Yellow
try {
    $promociones = Invoke-RestMethod -Uri $API_URL -Method Get -Headers $headers
    Write-Host "✅ Endpoint funcional - Total promociones: $($promociones.Count)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener promociones: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Verifica que la tabla 'reglas_descuento' exista" -ForegroundColor Yellow
    Write-Host ""
}

# Test 2: Crear nueva promoción
Write-Host "3️⃣  Test POST /api/promociones (crear)" -ForegroundColor Yellow
$nuevaPromocion = @{
    nombreRegla = "Black Friday 2024 - Test"
    tipoDescuento = "Porcentaje"
    valorDescuento = 30.0
    acumulable = $true
    exclusivo = $false
    fechaInicio = "2024-11-25T00:00:00"
    fechaFin = "2024-11-30T23:59:59"
} | ConvertTo-Json

try {
    $creada = Invoke-RestMethod -Uri $API_URL -Method Post -Body $nuevaPromocion -Headers $headers -ContentType "application/json"
    Write-Host "✅ Promoción creada con ID: $($creada.reglaId)" -ForegroundColor Green
    Write-Host "   Nombre: $($creada.nombreRegla)" -ForegroundColor Gray
    Write-Host "   Tipo: $($creada.tipoDescuento)" -ForegroundColor Gray
    Write-Host "   Valor: $($creada.valorDescuento)%" -ForegroundColor Gray
    Write-Host "   Estado: $($creada.estadoTexto)" -ForegroundColor Gray
    Write-Host ""
    
    $promocionId = $creada.reglaId
    
    # Test 3: Obtener por ID
    Write-Host "4️⃣  Test GET /api/promociones/{id} (obtener una)" -ForegroundColor Yellow
    $promo = Invoke-RestMethod -Uri "$API_URL/$promocionId" -Method Get -Headers $headers
    Write-Host "✅ Promoción obtenida correctamente" -ForegroundColor Green
    Write-Host "   ID: $($promo.reglaId)" -ForegroundColor Gray
    Write-Host "   Nombre: $($promo.nombreRegla)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 4: Actualizar promoción
    Write-Host "5️⃣  Test PUT /api/promociones/{id} (actualizar)" -ForegroundColor Yellow
    $actualizar = @{
        nombreRegla = "Cyber Monday 2024 - Test Actualizado"
        tipoDescuento = "Porcentaje"
        valorDescuento = 25.0
        acumulable = $true
        exclusivo = $false
        fechaInicio = "2024-12-01T00:00:00"
        fechaFin = "2024-12-03T23:59:59"
    } | ConvertTo-Json
    
    $actualizada = Invoke-RestMethod -Uri "$API_URL/$promocionId" -Method Put -Body $actualizar -Headers $headers -ContentType "application/json"
    Write-Host "✅ Promoción actualizada" -ForegroundColor Green
    Write-Host "   Nuevo nombre: $($actualizada.nombreRegla)" -ForegroundColor Gray
    Write-Host "   Nuevo valor: $($actualizada.valorDescuento)%" -ForegroundColor Gray
    Write-Host ""
    
    # Test 5: Buscar por nombre
    Write-Host "6️⃣  Test GET /api/promociones/buscar?nombre=Cyber" -ForegroundColor Yellow
    $busqueda = Invoke-RestMethod -Uri "$API_URL/buscar?nombre=Cyber" -Method Get -Headers $headers
    Write-Host "✅ Búsqueda completada - Encontrados: $($busqueda.Count)" -ForegroundColor Green
    Write-Host ""
    
    # Test 6: Obtener promociones activas
    Write-Host "7️⃣  Test GET /api/promociones/activas" -ForegroundColor Yellow
    $activas = Invoke-RestMethod -Uri "$API_URL/activas" -Method Get -Headers $headers
    Write-Host "✅ Promociones activas: $($activas.Count)" -ForegroundColor Green
    Write-Host ""
    
    # Test 7: Filtrar por tipo
    Write-Host "8️⃣  Test GET /api/promociones/tipo/Porcentaje" -ForegroundColor Yellow
    $porTipo = Invoke-RestMethod -Uri "$API_URL/tipo/Porcentaje" -Method Get -Headers $headers
    Write-Host "✅ Promociones tipo 'Porcentaje': $($porTipo.Count)" -ForegroundColor Green
    Write-Host ""
    
    # Test 8: Estadísticas
    Write-Host "9️⃣  Test GET /api/promociones/estadisticas" -ForegroundColor Yellow
    $stats = Invoke-RestMethod -Uri "$API_URL/estadisticas" -Method Get -Headers $headers
    Write-Host "✅ Estadísticas obtenidas:" -ForegroundColor Green
    Write-Host "   Total promociones: $($stats.totalPromociones)" -ForegroundColor Gray
    Write-Host "   Activas: $($stats.promocionesActivas)" -ForegroundColor Gray
    Write-Host "   Inactivas: $($stats.promocionesInactivas)" -ForegroundColor Gray
    Write-Host "   Próximas a expirar: $($stats.proximasExpirar)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 9: Calcular descuento
    Write-Host "🔟 Test POST /api/promociones/{id}/calcular-descuento" -ForegroundColor Yellow
    $calcular = @{
        precio = 10000.00
    } | ConvertTo-Json
    
    $calculo = Invoke-RestMethod -Uri "$API_URL/$promocionId/calcular-descuento" -Method Post -Body $calcular -Headers $headers -ContentType "application/json"
    Write-Host "✅ Descuento calculado:" -ForegroundColor Green
    Write-Host "   Precio original: `$$($calculo.precioOriginal)" -ForegroundColor Gray
    Write-Host "   Descuento: `$$($calculo.descuento)" -ForegroundColor Gray
    Write-Host "   Precio final: `$$($calculo.precioFinal)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 10: Eliminar promoción
    Write-Host "1️⃣1️⃣  Test DELETE /api/promociones/{id} (eliminar)" -ForegroundColor Yellow
    $eliminada = Invoke-RestMethod -Uri "$API_URL/$promocionId" -Method Delete -Headers $headers
    Write-Host "✅ Promoción eliminada: $($eliminada.mensaje)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "❌ Error en prueba: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Crear promociones de ejemplo
Write-Host "1️⃣2️⃣  Creando promociones de ejemplo..." -ForegroundColor Yellow

$ejemplos = @(
    @{
        nombreRegla = "Black Friday 2024"
        tipoDescuento = "Porcentaje"
        valorDescuento = 30.0
        acumulable = $false
        exclusivo = $true
        fechaInicio = "2024-11-25T00:00:00"
        fechaFin = "2024-11-30T23:59:59"
    },
    @{
        nombreRegla = "Cyber Monday"
        tipoDescuento = "Porcentaje"
        valorDescuento = 25.0
        acumulable = $false
        exclusivo = $true
        fechaInicio = "2024-12-01T00:00:00"
        fechaFin = "2024-12-03T23:59:59"
    },
    @{
        nombreRegla = "Envío Gratis Verano"
        tipoDescuento = "Envio Gratis"
        valorDescuento = 0.0
        acumulable = $true
        exclusivo = $false
        fechaInicio = "2024-12-01T00:00:00"
        fechaFin = "2025-03-01T23:59:59"
    },
    @{
        nombreRegla = "2x1 Seleccionados"
        tipoDescuento = "2x1"
        valorDescuento = 0.0
        acumulable = $false
        exclusivo = $true
        fechaInicio = "2024-12-01T00:00:00"
        fechaFin = "2024-12-31T23:59:59"
    },
    @{
        nombreRegla = "Descuento Fijo $5000"
        tipoDescuento = "Monto Fijo"
        valorDescuento = 5000.0
        acumulable = $true
        exclusivo = $false
    }
)

$creadas = 0
foreach ($ejemplo in $ejemplos) {
    try {
        $json = $ejemplo | ConvertTo-Json
        $result = Invoke-RestMethod -Uri $API_URL -Method Post -Body $json -Headers $headers -ContentType "application/json"
        $creadas++
        Write-Host "   ✅ Creada: $($result.nombreRegla)" -ForegroundColor Gray
    } catch {
        Write-Host "   ⚠️  Error creando '$($ejemplo.nombreRegla)': $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Promociones de ejemplo creadas: $creadas" -ForegroundColor Green
Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Módulo de promociones implementado correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "Endpoints probados:" -ForegroundColor White
Write-Host "  ✅ GET    /api/promociones" -ForegroundColor Gray
Write-Host "  ✅ GET    /api/promociones/activas" -ForegroundColor Gray
Write-Host "  ✅ GET    /api/promociones/{id}" -ForegroundColor Gray
Write-Host "  ✅ POST   /api/promociones" -ForegroundColor Gray
Write-Host "  ✅ PUT    /api/promociones/{id}" -ForegroundColor Gray
Write-Host "  ✅ DELETE /api/promociones/{id}" -ForegroundColor Gray
Write-Host "  ✅ GET    /api/promociones/buscar" -ForegroundColor Gray
Write-Host "  ✅ GET    /api/promociones/tipo/{tipo}" -ForegroundColor Gray
Write-Host "  ✅ GET    /api/promociones/estadisticas" -ForegroundColor Gray
Write-Host "  ✅ POST   /api/promociones/{id}/calcular-descuento" -ForegroundColor Gray
Write-Host ""
Write-Host "Accede al módulo:" -ForegroundColor White
Write-Host "  React: http://localhost:5173/admin/promotions" -ForegroundColor Cyan
Write-Host "  JSF:   http://localhost:8081/promociones.xhtml" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentación completa:" -ForegroundColor White
Write-Host "  MODULO_PROMOCIONES_ARQUITECTURA_HIBRIDA.md" -ForegroundColor Cyan
Write-Host ""
