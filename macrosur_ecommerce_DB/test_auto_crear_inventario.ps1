# Script PowerShell para ejecutar auto-creación de inventario
# Primero obtén un token JWT válido

Write-Host "=== PASO 1: Obtener Token JWT ===" -ForegroundColor Cyan

# Login como admin
$loginBody = @{
    correo = "admin@macrosur.com"
    contrasena = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "✓ Token obtenido exitosamente" -ForegroundColor Green
    Write-Host "Token: $token" -ForegroundColor Gray
    
    Write-Host "`n=== PASO 2: Ejecutar Auto-Creación de Inventario ===" -ForegroundColor Cyan
    
    # Ejecutar endpoint de auto-creación
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/logistica/inventario/auto-crear" `
        -Method POST `
        -Headers $headers
    
    Write-Host "✓ Proceso completado" -ForegroundColor Green
    Write-Host "Respuesta:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3
    
    Write-Host "`n=== PASO 3: Revisar logs del backend ===" -ForegroundColor Cyan
    Write-Host "Busca mensajes como:" -ForegroundColor Gray
    Write-Host "  'Inventario automático creado para variante SKU: ...'" -ForegroundColor Gray
    Write-Host "  'Proceso completado: X registros de inventario creados automáticamente.'" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`n=== Verificar en Base de Datos ===" -ForegroundColor Cyan
Write-Host "Ejecuta en MySQL:" -ForegroundColor Yellow
Write-Host @"
SELECT 
    COUNT(*) as total_variantes,
    (SELECT COUNT(DISTINCT variante_id) FROM inventario) as con_inventario,
    COUNT(*) - (SELECT COUNT(DISTINCT variante_id) FROM inventario) as sin_inventario
FROM variantes_producto;
"@ -ForegroundColor Gray
