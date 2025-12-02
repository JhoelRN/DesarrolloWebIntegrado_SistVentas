# Script simple para verificar roles en MySQL
# Ejecutar desde: macrosur_ecommerce_DB

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE ROLES Y USUARIOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Intentar diferentes métodos para conectar a MySQL

# Método 1: Usando archivo SQL temporal
$tempSqlFile = "temp_verificar_roles.sql"
$sqlContent = @"
USE macrosur_ecommerce;

SELECT '=== ROLES EXISTENTES ===' AS '';
SELECT rol_id, nombre_rol FROM roles ORDER BY rol_id;

SELECT '=== USUARIOS ADMIN Y SUS ROLES ===' AS '';
SELECT 
    ua.usuario_admin_id,
    ua.nombre,
    ua.apellido,
    ua.correo_corporativo,
    r.nombre_rol as rol,
    ua.activo
FROM usuarios_admin ua
LEFT JOIN roles r ON ua.rol_id = r.rol_id
ORDER BY ua.usuario_admin_id;

SELECT '=== RESUMEN DE PERMISOS POR ROL ===' AS '';
SELECT 
    r.nombre_rol,
    COUNT(rp.permiso_id) as total_permisos
FROM roles r
LEFT JOIN rol_permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;
"@

# Guardar contenido SQL en archivo temporal
$sqlContent | Out-File -FilePath $tempSqlFile -Encoding UTF8

Write-Host "📋 Ejecutando consultas SQL..." -ForegroundColor Yellow
Write-Host ""

# Buscar instalación de MySQL
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlExe = $path
        Write-Host "✅ MySQL encontrado en: $path" -ForegroundColor Green
        break
    }
}

if ($mysqlExe) {
    # Ejecutar MySQL con el archivo SQL
    & $mysqlExe -u root -padmin < $tempSqlFile
    
    # Limpiar archivo temporal
    Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  INFORMACIÓN IMPORTANTE" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Revisa los roles y usuarios arriba" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔐 Para aplicar control de acceso:" -ForegroundColor Yellow
    Write-Host "   1. Verifica el nombre_rol de TU usuario" -ForegroundColor White
    Write-Host "   2. Confirma si es 'Admin' o 'Gestor Logística'" -ForegroundColor White
    Write-Host "   3. Dime cuál es tu rol para configurar correctamente" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ No se encontró MySQL en las rutas comunes" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativas:" -ForegroundColor Yellow
    Write-Host "   1. Usar phpMyAdmin o MySQL Workbench" -ForegroundColor White
    Write-Host "   2. Ejecutar manualmente este SQL:" -ForegroundColor White
    Write-Host ""
    Write-Host "   SELECT rol_id, nombre_rol FROM roles;" -ForegroundColor Cyan
    Write-Host "   SELECT ua.nombre, ua.apellido, r.nombre_rol" -ForegroundColor Cyan
    Write-Host "   FROM usuarios_admin ua" -ForegroundColor Cyan
    Write-Host "   LEFT JOIN roles r ON ua.rol_id = r.rol_id;" -ForegroundColor Cyan
    Write-Host ""
    
    # Limpiar archivo temporal si existe
    Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
}
