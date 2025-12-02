# Script para ejecutar poblar_inventario_inicial.sql
# Fecha: 2025-11-28

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$sqlFile = "$PSScriptRoot\poblar_inventario_inicial.sql"
$database = "macrosur_ecommerce"
$user = "root"

# Solicitar contraseña
$securePassword = Read-Host "Ingresa la contraseña de MySQL para el usuario root" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ejecutando script de poblado de datos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que existe el archivo SQL
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: No se encuentra el archivo $sqlFile" -ForegroundColor Red
    exit 1
}

# Ejecutar el script SQL
Write-Host "Ejecutando: poblar_inventario_inicial.sql" -ForegroundColor Yellow
Write-Host ""

try {
    # Usar Get-Content y pipe a mysql
    $content = Get-Content $sqlFile -Raw -Encoding UTF8
    
    # Ejecutar usando stdin
    $content | & $mysqlPath --user=$user --password=$password --database=$database --default-character-set=utf8mb4 2>&1 | ForEach-Object {
        if ($_ -match "ERROR") {
            Write-Host $_ -ForegroundColor Red
        } else {
            Write-Host $_
        }
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Script ejecutado exitosamente" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Hubo errores durante la ejecución" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
