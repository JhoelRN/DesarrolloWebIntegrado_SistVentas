# ==================================================
# Script: Prueba completa del sistema de carrito y pedidos
# ==================================================

Write-Output "🧪 PRUEBA COMPLETA DEL SISTEMA DE CARRITO Y PEDIDOS"
Write-Output ("=" * 60)
Write-Output ""

# 1. Verificar backend activo
Write-Output "1️⃣ Verificando backend..."
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8081/actuator/health" -Method Get -ErrorAction Stop
    Write-Output "   ✅ Backend activo: $($health.status)"
} catch {
    Write-Output "   ❌ Backend no disponible"
    exit 1
}
Write-Output ""

# 2. Consultar variantes disponibles
Write-Output "2️⃣ Obteniendo variantes..."
$variantes = Invoke-RestMethod -Uri "http://localhost:8081/api/productos/variantes" -Method Get
Write-Output "   ✅ Total variantes: $($variantes.Count)"
$variantePrueba = $variantes | Where-Object { $_.sku -eq "ALF001-AZUL-200x300" } | Select-Object -First 1
Write-Output "   📦 Variante de prueba: $($variantePrueba.sku) (ID: $($variantePrueba.varianteId))"
Write-Output ""

# 3. Consultar stock disponible
Write-Output "3️⃣ Consultando stock disponible..."
$stock = Invoke-RestMethod -Uri "http://localhost:8081/api/inventario/stock/variante/$($variantePrueba.varianteId)" -Method Get
Write-Output "   ✅ Stock total: $($stock.stockTotal) unidades"
Write-Output "   📍 Ubicaciones:"
$stock.ubicaciones | ForEach-Object {
    Write-Output "      - $($_.nombreUbicacion): $($_.cantidad) unidades"
}
Write-Output ""

# 4. Crear pedido
Write-Output "4️⃣ Creando pedido de prueba..."
$pedidoData = @{
    clienteId = 1
    metodoEntrega = "RETIRO_EN_TIENDA"
    direccionEnvioId = $null
    ubicacionRetiroId = 4
    totalEnvio = 0
    items = @(
        @{
            varianteId = $variantePrueba.varianteId
            cantidad = 2
            precioUnitario = [double]$variantePrueba.precioBase
            descuentoAplicado = 0
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $pedido = Invoke-RestMethod -Uri "http://localhost:8081/api/pedidos" -Method Post -ContentType "application/json" -Body $pedidoData
    Write-Output "   ✅ Pedido creado: ID #$($pedido.pedidoId)"
    Write-Output "   💰 Total: `$$($pedido.totalFinal)"
    Write-Output "   📋 Estado: $($pedido.estado)"
    Write-Output "   📦 Items: $($pedido.detalles.Count)"
    
    # 5. Verificar stock después del pedido
    Write-Output ""
    Write-Output "5️⃣ Verificando descuento de stock..."
    $stockDespues = Invoke-RestMethod -Uri "http://localhost:8081/api/inventario/stock/variante/$($variantePrueba.varianteId)" -Method Get
    Write-Output "   📊 Stock anterior: $($stock.stockTotal) unidades"
    Write-Output "   📊 Stock actual: $($stockDespues.stockTotal) unidades"
    Write-Output "   📉 Descontado: $(($stock.stockTotal) - ($stockDespues.stockTotal)) unidades"
    
    if (($stock.stockTotal - $stockDespues.stockTotal) -eq 2) {
        Write-Output "   ✅ Stock descontado correctamente!"
    } else {
        Write-Output "   ⚠️  Diferencia inesperada en stock"
    }
    
} catch {
    Write-Output "   ❌ Error al crear pedido: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Output "   📄 Detalles: $($_.ErrorDetails.Message)"
    }
}

Write-Output ""
Write-Output ("=" * 60)
Write-Output "✅ PRUEBA COMPLETADA"
Write-Output ("=" * 60)
