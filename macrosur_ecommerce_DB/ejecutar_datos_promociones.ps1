# Script PowerShell para insertar datos de promociones
# Ejecutar desde macrosur_ecommerce_DB

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  INSERTAR DATOS DE PROMOCIONES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Intentar encontrar MySQL
$mysqlPath = $null
$possiblePaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "mysql.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path -ErrorAction SilentlyContinue) {
        $mysqlPath = $path
        break
    }
    if ((Get-Command $path -ErrorAction SilentlyContinue)) {
        $mysqlPath = $path
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "❌ MySQL no encontrado en el PATH" -ForegroundColor Red
    Write-Host "`nPuedes ejecutar manualmente en MySQL:" -ForegroundColor Yellow
    Write-Host "  USE macrosur_ecommerce;" -ForegroundColor White
    Write-Host "  SOURCE d:/RODRIGO/DesarrolloWebIntegrado_SistVentas/macrosur_ecommerce_DB/insertar_datos_promociones.sql;`n" -ForegroundColor White
    exit 1
}

Write-Host "✓ MySQL encontrado: $mysqlPath`n" -ForegroundColor Green

# Leer el archivo SQL
$sqlFile = ".\insertar_datos_promociones.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Archivo no encontrado: $sqlFile" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw

# Ejecutar usando MySQL
Write-Host "Ejecutando script SQL..." -ForegroundColor Yellow

try {
    # Usar pipeline para pasar el contenido
    $sqlContent | & $mysqlPath -u root -proot1234 -h localhost -P 3308 2>&1 | Out-Null
    
    Write-Host "`n✓ Script ejecutado exitosamente" -ForegroundColor Green
    
    # Verificar resultados
    Write-Host "`nVerificando promociones insertadas..." -ForegroundColor Yellow
    
    $result = & $mysqlPath -u root -proot1234 -h localhost -P 3308 -e "SELECT COUNT(*) AS Total FROM macrosur_ecommerce.reglas_descuento" 2>&1
    Write-Host $result
    
    Write-Host "`n✓ Datos insertados correctamente" -ForegroundColor Green
    Write-Host "`nAhora puedes probar el módulo desde:" -ForegroundColor Cyan
    Write-Host "  - API REST: http://localhost:8081/api/promociones" -ForegroundColor White
    Write-Host "  - JSP: http://localhost:8081/promociones.jsp" -ForegroundColor White
    Write-Host "  - JSF: http://localhost:8081/admin/promociones.xhtml" -ForegroundColor White
    Write-Host "  - React: http://localhost:5173/admin/promotions`n" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error al ejecutar script:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
