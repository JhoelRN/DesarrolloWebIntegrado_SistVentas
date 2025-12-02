# Script para reorganizar archivos SQL del proyecto
# Fecha: 2025-12-01
# Proposito: Limpiar y organizar carpeta macrosur_ecommerce_DB

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " REORGANIZACION DE ARCHIVOS SQL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Directorio base
$baseDir = $PSScriptRoot

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "$baseDir\extract_schema_simple.ps1")) {
    Write-Host "ERROR: Este script debe ejecutarse desde macrosur_ecommerce_DB/" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Directorio base: $baseDir" -ForegroundColor Green
Write-Host ""

# Funcion para crear carpeta si no existe
function New-DirectoryIfNotExists {
    param([string]$path)
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Host "  [+] Carpeta creada: $path" -ForegroundColor Green
    } else {
        Write-Host "  [i] Carpeta ya existe: $path" -ForegroundColor Yellow
    }
}

# Funcion para mover archivo con verificacion
function Move-FileIfExists {
    param(
        [string]$source,
        [string]$destination
    )
    
    $sourcePath = Join-Path $baseDir $source
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destination -Force
        Write-Host "  [+] Movido: $source" -ForegroundColor Green
    } else {
        Write-Host "  [!] No encontrado: $source" -ForegroundColor Yellow
    }
}

Write-Host "[FASE 1] Crear estructura de carpetas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Crear carpetas
New-DirectoryIfNotExists "$baseDir\datos_prueba"
New-DirectoryIfNotExists "$baseDir\correcciones_historicas"
New-DirectoryIfNotExists "$baseDir\configuracion_inicial"
New-DirectoryIfNotExists "$baseDir\backups_historicos"
New-DirectoryIfNotExists "$baseDir\verificaciones"

Write-Host ""
Write-Host "[FASE 2] Mover archivos de datos de prueba" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$datosPrueba = @(
    "insert_productos_prueba.sql",
    "insert_admin_FROM_BACKUP.sql",
    "insertar_cliente_prueba.sql",
    "crear_cliente_prueba.sql",
    "datos_prueba_logistica.sql",
    "insertar_datos_promociones.sql",
    "poblar_inventario_inicial.sql",
    "crear_inventarios_manual.sql"
)

foreach ($archivo in $datosPrueba) {
    Move-FileIfExists $archivo "$baseDir\datos_prueba\"
}

Write-Host ""
Write-Host "[FASE 3] Mover archivos de correcciones historicas" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$correcciones = @(
    "corregir_datos_utf8.sql",
    "fix_utf8_encoding.sql",
    "corregir_operadores_logisticos.sql",
    "corregir_alarmas_mal_resueltas.sql",
    "actualizar_operadores.sql",
    "actualizar_enum_tipo_descuento.sql",
    "reparar_flyway_v7.sql",
    "reorganizar_proveedores.sql",
    "asegurar_ubicacion_principal.sql",
    "mejora_ordenes_automaticas.sql"
)

foreach ($archivo in $correcciones) {
    Move-FileIfExists $archivo "$baseDir\correcciones_historicas\"
}

Write-Host ""
Write-Host "[FASE 4] Mover archivos de configuracion inicial" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$configuracion = @(
    "crear_ubicaciones.sql",
    "insertar_operadores_logisticos.sql",
    "crear_variantes_faltantes.sql"
)

foreach ($archivo in $configuracion) {
    Move-FileIfExists $archivo "$baseDir\configuracion_inicial\"
}

Write-Host ""
Write-Host "[FASE 5] Mover backups a backups_historicos" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$backups = @(
    "CURRENT_SCHEMA_ONLY_20251125_085104.sql",
    "CURRENT_SCHEMA_WITH_DATA_20251125_085104.sql",
    "SCHEMA_ACTUAL_20251201_111507.sql",
    "SCHEMA_CON_DATOS_20251201_111507.sql",
    "SCHEMA_COMPLETO_CON_DATOS_20251201_113925.sql",
    "CONTEO_REGISTROS_20251201_111507.txt"
)

foreach ($archivo in $backups) {
    Move-FileIfExists $archivo "$baseDir\backups_historicos\"
}

Write-Host ""
Write-Host "[FASE 6] Mover scripts de verificacion" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$verificaciones = @(
    "verificar_conteo.sql",
    "verificar_estado.sql",
    "verificar_alarmas.sql",
    "verificar_duplicados_alarmas.sql",
    "verificar_flyway.sql",
    "verificar_inventarios_auto_creados.sql",
    "verificar_inventario_vs_alarmas.sql",
    "verificar_permisos_completo.sql",
    "verificar_productos_vs_inventario.sql",
    "verificar_ubicaciones.sql",
    "verificar_usuario_admin.sql",
    "verificar_roles.ps1",
    "verificar_roles_simple.ps1",
    "verificar_utf8.ps1",
    "check_inventarios.sql",
    "check_roles.sql"
)

foreach ($archivo in $verificaciones) {
    Move-FileIfExists $archivo "$baseDir\verificaciones\"
}

Write-Host ""
Write-Host "[FASE 7] Eliminar archivos temporales/duplicados" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$eliminar = @(
    "analisis_bd.sql",
    "consulta_complemento.sql",
    "consulta_estado_real.sql",
    "limpiar_bd.sql",
    "ver_tablas.sql"
)

foreach ($archivo in $eliminar) {
    $filePath = Join-Path $baseDir $archivo
    if (Test-Path $filePath) {
        Remove-Item $filePath -Force
        Write-Host "  [-] Eliminado: $archivo" -ForegroundColor Red
    } else {
        Write-Host "  [i] No encontrado: $archivo" -ForegroundColor Yellow
    }
}

# Consolidar scripts de visualizacion
Write-Host ""
Write-Host "Consolidando scripts de visualizacion..." -ForegroundColor Cyan

$consolidarVer = @(
    "ver_promociones.sql",
    "ver_promociones.ps1",
    "ver_operadores.sql",
    "ver_operadores.ps1"
)

foreach ($archivo in $consolidarVer) {
    Move-FileIfExists $archivo "$baseDir\verificaciones\"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " REORGANIZACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen de carpetas creadas:" -ForegroundColor Cyan
Write-Host "  [+] datos_prueba/            - Datos de ejemplo y pruebas" -ForegroundColor White
Write-Host "  [+] correcciones_historicas/ - Fixes aplicados en el pasado" -ForegroundColor White
Write-Host "  [+] configuracion_inicial/   - Scripts de setup inicial" -ForegroundColor White
Write-Host "  [+] backups_historicos/      - Backups de esquemas anteriores" -ForegroundColor White
Write-Host "  [+] verificaciones/          - Scripts de verificacion y consulta" -ForegroundColor White
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Revisar que todo esta en orden" -ForegroundColor White
Write-Host "  2. Hacer commit de los cambios" -ForegroundColor White
Write-Host "  3. Agregar backups_historicos/ a .gitignore" -ForegroundColor White
Write-Host "  4. Probar que el backend sigue funcionando" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE: Las migraciones de Flyway NO fueron tocadas" -ForegroundColor Yellow
Write-Host "   (src/main/resources/db/migration/ sigue intacto)" -ForegroundColor White
Write-Host ""

Write-Host "Terminado exitosamente!" -ForegroundColor Green
