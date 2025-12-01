# Script: Actualizar operadores logisticos

$mysqlPath = 'C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe'
$sqlFile = 'actualizar_operadores.sql'

Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Actualizando operadores logisticos...' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

# Ejecutar actualizacion
Get-Content $sqlFile | & $mysqlPath -u root -padmin macrosur_ecommerce 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ''
    Write-Host '========================================' -ForegroundColor Green
    Write-Host 'Operadores actualizados exitosamente' -ForegroundColor Green
    Write-Host '========================================' -ForegroundColor Green
} else {
    Write-Host ''
    Write-Host '========================================' -ForegroundColor Yellow
    Write-Host 'Intentando con ruta alternativa...' -ForegroundColor Yellow
    Write-Host '========================================' -ForegroundColor Yellow
    
    $mysqlPath = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
    Get-Content $sqlFile | & $mysqlPath -u root -padmin macrosur_ecommerce 2>&1
}
