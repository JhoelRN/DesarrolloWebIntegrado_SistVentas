# ==================================================
# Script: Consultar estado real de MySQL
# ==================================================

$password = Read-Host "MySQL root password" -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$sqlFile = "verificar_productos_vs_inventario.sql"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Consultando estado real de la BD..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Ejecutar consulta
Get-Content $sqlFile | & $mysqlPath -u root --password=$plainPassword macrosur_ecommerce

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Consulta ejecutada exitosamente" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Error al ejecutar consulta" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}
