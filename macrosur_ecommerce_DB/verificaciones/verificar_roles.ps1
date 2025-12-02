# Script para verificar roles y permisos en la base de datos
# Ejecutar desde: macrosur_ecommerce_DB

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE ROLES Y PERMISOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuración de conexión
$server = "localhost"
$database = "macrosur_ecommerce"
$user = "root"
$password = "admin"

# Cargar el ensamblado MySQL
try {
    Add-Type -Path "C:\Program Files (x86)\MySQL\MySQL Connector NET 8.0.33\MySql.Data.dll" -ErrorAction SilentlyContinue
} catch {
    Write-Host "⚠️  Advertencia: No se pudo cargar MySQL Connector" -ForegroundColor Yellow
    Write-Host "   Intentando usar método alternativo..." -ForegroundColor Yellow
}

# Función para ejecutar consultas SQL
function Execute-Query {
    param(
        [string]$Query,
        [string]$Title
    )
    
    try {
        $connectionString = "Server=$server;Database=$database;Uid=$user;Pwd=$password;"
        $connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)
        $connection.Open()
        
        $command = New-Object MySql.Data.MySqlClient.MySqlCommand($Query, $connection)
        $adapter = New-Object MySql.Data.MySqlClient.MySqlDataAdapter($command)
        $dataSet = New-Object System.Data.DataSet
        $adapter.Fill($dataSet) | Out-Null
        
        Write-Host ""
        Write-Host "=== $Title ===" -ForegroundColor Green
        $dataSet.Tables[0] | Format-Table -AutoSize
        
        $connection.Close()
        return $dataSet.Tables[0]
    }
    catch {
        Write-Host "❌ Error ejecutando consulta: $_" -ForegroundColor Red
        return $null
    }
}

# 1. Verificar roles existentes
$queryRoles = "SELECT rol_id, nombre_rol FROM roles ORDER BY rol_id;"
$titleRoles = "ROLES EXISTENTES"
Execute-Query -Query $queryRoles -Title $titleRoles

# 2. Verificar usuarios admin y sus roles
$queryUsuarios = @"
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
"@
Execute-Query -Query $queryUsuarios -Title "USUARIOS ADMIN Y SUS ROLES"

# 3. Verificar permisos por rol
$queryPermisosAdmin = @"
SELECT 
    r.nombre_rol,
    COUNT(rp.permiso_id) as total_permisos,
    GROUP_CONCAT(p.nombre_permiso SEPARATOR ', ') as permisos
FROM roles r
LEFT JOIN rol_permiso rp ON r.rol_id = rp.rol_id
LEFT JOIN permisos p ON rp.permiso_id = p.permiso_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;
"@
Execute-Query -Query $queryPermisosAdmin -Title "PERMISOS POR ROL (RESUMEN)"

# 4. Verificar permisos del rol Admin (detalle)
$queryAdminPermisos = @"
SELECT 
    p.nombre_permiso
FROM roles r
JOIN rol_permiso rp ON r.rol_id = rp.rol_id
JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre_rol = 'Admin'
ORDER BY p.nombre_permiso;
"@
$adminPermisos = Execute-Query -Query $queryAdminPermisos -Title "PERMISOS DEL ROL 'ADMIN'"

# 5. Verificar permisos del rol Gestor Logística (si existe)
$queryLogisticaPermisos = @"
SELECT 
    p.nombre_permiso
FROM roles r
JOIN rol_permiso rp ON r.rol_id = rp.rol_id
JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre_rol = 'Gestor Logística'
ORDER BY p.nombre_permiso;
"@
$logisticaPermisos = Execute-Query -Query $queryLogisticaPermisos -Title "PERMISOS DEL ROL 'GESTOR LOGÍSTICA'"

# 6. Verificar si existe Gestor Comercial
$queryComercialPermisos = @"
SELECT 
    p.nombre_permiso
FROM roles r
JOIN rol_permiso rp ON r.rol_id = rp.rol_id
JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre_rol LIKE '%Comercial%'
ORDER BY p.nombre_permiso;
"@
Execute-Query -Query $queryComercialPermisos -Title "PERMISOS DEL ROL 'GESTOR COMERCIAL' (si existe)"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Verificación completada" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para aplicar control de acceso por roles:" -ForegroundColor Yellow
Write-Host "   1. Verifica los nombres exactos de los roles arriba" -ForegroundColor Yellow
Write-Host "   2. Confirma qué usuarios tienen qué roles" -ForegroundColor Yellow
Write-Host "   3. Decide qué rutas debe ver cada rol" -ForegroundColor Yellow
Write-Host ""
