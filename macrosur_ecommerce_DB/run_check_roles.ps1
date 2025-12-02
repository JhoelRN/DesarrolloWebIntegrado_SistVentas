# Script simple para ejecutar check_roles.sql
Write-Host ""
Write-Host "Verificando roles en la base de datos..." -ForegroundColor Cyan
Write-Host ""

# Buscar MySQL
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe",
    "mysql.exe"
)

$mysqlFound = $false
foreach ($path in $mysqlPaths) {
    try {
        if ($path -eq "mysql.exe") {
            # Intentar desde PATH
            $null = Get-Command mysql -ErrorAction Stop
            Write-Host "Encontrado MySQL en PATH del sistema" -ForegroundColor Green
            $result = Get-Content check_roles.sql | mysql -u root -padmin 2>&1
            $mysqlFound = $true
            Write-Host $result
            break
        }
        elseif (Test-Path $path) {
            Write-Host "Encontrado MySQL en: $path" -ForegroundColor Green
            $result = Get-Content check_roles.sql | & $path -u root -padmin 2>&1
            $mysqlFound = $true
            Write-Host $result
            break
        }
    }
    catch {
        continue
    }
}

if (-not $mysqlFound) {
    Write-Host ""
    Write-Host "No se pudo conectar a MySQL automaticamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor ejecuta manualmente desde MySQL Workbench o phpMyAdmin:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "SELECT rol_id, nombre_rol FROM roles;" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "SELECT ua.nombre, ua.apellido, ua.correo_corporativo, r.nombre_rol" -ForegroundColor Cyan
    Write-Host "FROM usuarios_admin ua" -ForegroundColor Cyan
    Write-Host "LEFT JOIN roles r ON ua.rol_id = r.rol_id;" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""
Write-Host "Listo!" -ForegroundColor Green
