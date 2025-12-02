# ============================================================================
# SCRIPT DE EXTRACCION DEL ESQUEMA ACTUAL DESDE MYSQL WORKBENCH
# ============================================================================

param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DbUser = "root",
    [string]$DbName = "macrosur_ecommerce",
    [switch]$WithData
)

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "EXTRACTOR DE ESQUEMA MYSQL" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

# ============================================================================
# PASO 1: Buscar mysqldump.exe
# ============================================================================

Write-Host "[INFO] Buscando mysqldump.exe en el sistema..." -ForegroundColor Cyan

$possiblePaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysqldump.exe",
    "C:\xampp\mysql\bin\mysqldump.exe",
    "C:\wamp64\bin\mysql\mysql8.0.39\bin\mysqldump.exe"
)

$mysqldumpPath = $null

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $mysqldumpPath = $path
        Write-Host "[OK] Encontrado: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqldumpPath) {
    Write-Host "[WARNING] No se encontro mysqldump en rutas comunes" -ForegroundColor Yellow
    Write-Host "[INFO] Buscando en todo el sistema..." -ForegroundColor Cyan
    
    $found = Get-ChildItem "C:\Program Files\MySQL" -Recurse -Filter mysqldump.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($found) {
        $mysqldumpPath = $found.FullName
        Write-Host "[OK] Encontrado: $mysqldumpPath" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] No se encontro mysqldump.exe" -ForegroundColor Red
        Write-Host "[INFO] Instala MySQL Server o verifica tu instalacion" -ForegroundColor Cyan
        exit 1
    }
}

# ============================================================================
# PASO 2: Solicitar contrasena
# ============================================================================

Write-Host "[INFO] Conectando a MySQL..." -ForegroundColor Cyan
$securePassword = Read-Host "Ingresa la contrasena de MySQL para usuario '$DbUser'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$dbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# ============================================================================
# PASO 3: Verificar conexion a la base de datos
# ============================================================================

Write-Host "[INFO] Verificando conexion a la base de datos '$DbName'..." -ForegroundColor Cyan

$mysqlPath = $mysqldumpPath -replace "mysqldump.exe", "mysql.exe"

$testQuery = "SHOW DATABASES LIKE '$DbName';"
$testResult = & $mysqlPath --host=$DbHost --port=$DbPort --user=$DbUser --password=$dbPassword -e $testQuery 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo conectar a MySQL" -ForegroundColor Red
    Write-Host "[INFO] Verifica: host=$DbHost, puerto=$DbPort, usuario=$DbUser" -ForegroundColor Cyan
    exit 1
}

if (-not ($testResult -match $DbName)) {
    Write-Host "[ERROR] La base de datos '$DbName' no existe" -ForegroundColor Red
    Write-Host "[INFO] Bases de datos disponibles:" -ForegroundColor Cyan
    & $mysqlPath --host=$DbHost --port=$DbPort --user=$DbUser --password=$dbPassword -e "SHOW DATABASES;"
    exit 1
}

Write-Host "[OK] Conexion exitosa a '$DbName'" -ForegroundColor Green

# ============================================================================
# PASO 4: Contar tablas existentes
# ============================================================================

Write-Host "[INFO] Contando tablas en '$DbName'..." -ForegroundColor Cyan

$countQuery = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DbName';"
$tableCount = & $mysqlPath --host=$DbHost --port=$DbPort --user=$DbUser --password=$dbPassword -N -e $countQuery

Write-Host "[OK] Se encontraron $tableCount tablas" -ForegroundColor Green

if ($tableCount -eq 0) {
    Write-Host "[WARNING] La base de datos esta vacia" -ForegroundColor Yellow
    exit 0
}

# ============================================================================
# PASO 5: Listar tablas
# ============================================================================

Write-Host "[INFO] Tablas encontradas:" -ForegroundColor Cyan
$listQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema='$DbName' ORDER BY table_name;"
& $mysqlPath --host=$DbHost --port=$DbPort --user=$DbUser --password=$dbPassword -e $listQuery

# ============================================================================
# PASO 6: Generar dumps
# ============================================================================

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputDir = Split-Path $PSCommandPath -Parent

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "GENERANDO DUMPS" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

# DUMP 1: Solo Esquema
$schemaOnlyFile = Join-Path $outputDir "CURRENT_SCHEMA_ONLY_$timestamp.sql"

Write-Host "[INFO] Generando dump de esquema (sin datos)..." -ForegroundColor Cyan

& $mysqldumpPath `
    --host=$DbHost `
    --port=$DbPort `
    --user=$DbUser `
    --password=$dbPassword `
    --databases $DbName `
    --no-data `
    --routines `
    --triggers `
    --events `
    --single-transaction `
    --result-file=$schemaOnlyFile

if ($LASTEXITCODE -eq 0) {
    $fileSizeKB = [math]::Round((Get-Item $schemaOnlyFile).Length / 1KB, 2)
    Write-Host "[OK] Esquema generado: $schemaOnlyFile ($fileSizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Fallo al generar dump de esquema" -ForegroundColor Red
    exit 1
}

# DUMP 2: Esquema + Datos (OPCIONAL)
if ($WithData) {
    $schemaWithDataFile = Join-Path $outputDir "CURRENT_SCHEMA_WITH_DATA_$timestamp.sql"
    
    Write-Host "[INFO] Generando dump completo (esquema + datos)..." -ForegroundColor Cyan
    
    & $mysqldumpPath `
        --host=$DbHost `
        --port=$DbPort `
        --user=$DbUser `
        --password=$dbPassword `
        --databases $DbName `
        --routines `
        --triggers `
        --events `
        --single-transaction `
        --result-file=$schemaWithDataFile
    
    if ($LASTEXITCODE -eq 0) {
        $fileSizeKB = [math]::Round((Get-Item $schemaWithDataFile).Length / 1KB, 2)
        Write-Host "[OK] Dump completo generado: $schemaWithDataFile ($fileSizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Fallo al generar dump completo" -ForegroundColor Red
    }
}

# ============================================================================
# PASO 7: Comparacion con archivos existentes
# ============================================================================

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "COMPARANDO CON ARCHIVOS EXISTENTES" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

$existingSqlFiles = Get-ChildItem $outputDir -Filter "Tablas del Modulo*.sql"

if ($existingSqlFiles.Count -gt 0) {
    Write-Host "[INFO] Se encontraron $($existingSqlFiles.Count) archivos SQL de modulos" -ForegroundColor Cyan
    Write-Host "[INFO] Puedes compararlos manualmente con: $schemaOnlyFile" -ForegroundColor Cyan
} else {
    Write-Host "[INFO] No se encontraron archivos SQL previos" -ForegroundColor Cyan
}

# ============================================================================
# PASO 8: Copiar como V1__baseline.sql (OPCIONAL)
# ============================================================================

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "SIGUIENTE PASO: CREAR BASELINE" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

$migrationsDir = "..\macrosur-ecommerce-backend\src\main\resources\db\migration"
$baselineFile = Join-Path $migrationsDir "V1__baseline.sql"

if (Test-Path $migrationsDir) {
    Write-Host "[INFO] Deseas copiar este schema como V1__baseline.sql para Flyway? (S/N)" -ForegroundColor Cyan
    $response = Read-Host
    
    if ($response -eq "S" -or $response -eq "s") {
        Copy-Item $schemaOnlyFile $baselineFile -Force
        Write-Host "[OK] Baseline creado: $baselineFile" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Puedes copiarlo manualmente despues" -ForegroundColor Cyan
    }
} else {
    Write-Host "[WARNING] No se encontro directorio de migraciones" -ForegroundColor Yellow
    Write-Host "[INFO] Crea el directorio primero" -ForegroundColor Cyan
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "EXTRACCION COMPLETADA" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

Write-Host "[OK] Archivos generados:" -ForegroundColor Green
Write-Host "  - $schemaOnlyFile"
if ($WithData -and (Test-Path $schemaWithDataFile)) {
    Write-Host "  - $schemaWithDataFile"
}

Write-Host "`nProximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Revisa el archivo generado en VS Code"
Write-Host "  2. Compara con los archivos SQL existentes"
Write-Host "  3. Copialo como V1__baseline.sql si es correcto"
Write-Host "  4. Configura Flyway en application.properties"
Write-Host "  5. Todos los cambios futuros quedaran trackeados`n"

# Limpiar password de memoria
$dbPassword = $null
[System.GC]::Collect()
