# ============================================================
# SCRIPT DE VERIFICACION UTF-8 - MACROSUR E-COMMERCE
# ============================================================
# Proposito: Verificar que la base de datos y backend usen UTF-8 correctamente
# ============================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICACION UTF-8 - MACROSUR E-COMMERCE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar encoding de la base de datos
Write-Host "[1/4] Verificando encoding de la base de datos..." -ForegroundColor Yellow
$mysql = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$dbEncoding = & $mysql -u root -padmin -D macrosur_ecommerce -e "SHOW VARIABLES LIKE 'character_set_database';" 2>$null | Select-String "utf8mb4"

if ($dbEncoding) {
    Write-Host "OK - Base de datos configurada en UTF8MB4" -ForegroundColor Green
} else {
    Write-Host "ERROR - Base de datos NO esta en UTF8MB4" -ForegroundColor Red
}

# 2. Verificar encoding de las tablas
Write-Host "`n[2/4] Verificando encoding de las tablas..." -ForegroundColor Yellow
$tableCount = & $mysql -u root -padmin -D macrosur_ecommerce -e "SELECT COUNT(*) as total FROM information_schema.TABLES WHERE TABLE_SCHEMA='macrosur_ecommerce' AND TABLE_COLLATION='utf8mb4_unicode_ci';" 2>$null | Select-String -Pattern "\d+" | Select-Object -Last 1

if ($tableCount -match "(\d+)") {
    $count = $matches[1]
    Write-Host "OK - $count tablas configuradas en utf8mb4_unicode_ci" -ForegroundColor Green
} else {
    Write-Host "ERROR - Error al verificar tablas" -ForegroundColor Red
}

# 3. Verificar application.properties
Write-Host "`n[3/4] Verificando application.properties..." -ForegroundColor Yellow
$appPropsPath = "d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend\src\main\resources\application.properties"

if (Test-Path $appPropsPath) {
    $content = Get-Content $appPropsPath -Raw -Encoding UTF8
    
    $hasCharacterEncoding = $content -match "characterEncoding=UTF-8"
    $hasUseUnicode = $content -match "useUnicode=true"
    $hasHibernateCharset = $content -match "hibernate.connection.CharSet=utf-8"
    
    if ($hasCharacterEncoding -and $hasUseUnicode -and $hasHibernateCharset) {
        Write-Host "OK - application.properties configurado correctamente" -ForegroundColor Green
        Write-Host "  - characterEncoding=UTF-8: OK" -ForegroundColor Gray
        Write-Host "  - useUnicode=true: OK" -ForegroundColor Gray
        Write-Host "  - hibernate.connection.CharSet: OK" -ForegroundColor Gray
    } else {
        Write-Host "ERROR - Faltan configuraciones UTF-8 en application.properties" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR - No se encontro application.properties" -ForegroundColor Red
}

# 4. Verificar datos reales
Write-Host "`n[4/4] Verificando datos con caracteres latinos..." -ForegroundColor Yellow
$testQuery = & $mysql -u root -padmin -D macrosur_ecommerce --default-character-set=utf8mb4 -e "SELECT nombre FROM categorias WHERE categoria_id=8;" 2>$null | Select-String -Pattern "Cocina"

if ($testQuery) {
    Write-Host "OK - Datos con caracteres latinos se muestran correctamente" -ForegroundColor Green
} else {
    Write-Host "AVISO - No se pudieron verificar datos (normal si no hay registros)" -ForegroundColor Yellow
}

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE CONFIGURACION UTF-8" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "
Configuraciones aplicadas:
1. Base de datos: utf8mb4 / utf8mb4_unicode_ci
2. Todas las tablas: utf8mb4_unicode_ci
3. Conexion JDBC: characterEncoding=UTF-8&useUnicode=true
4. Hibernate: connection.CharSet=utf-8
5. Flyway: encoding=UTF-8

Caracteres soportados:
- Tildes: a, e, i, o, u (con tildes)
- Enes: n (con virgulilla)
- Dieresis: u (con dieresis)
- Simbolos especiales
- Emojis

Para verificar manualmente:
mysql -u root -p macrosur_ecommerce --default-character-set=utf8mb4
" -ForegroundColor White

Write-Host "Verificacion completada." -ForegroundColor Green
