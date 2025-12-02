# Script para extraer esquema actual de la BD
$mysql = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
$mysqldump = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe"

if (-not (Test-Path $mysql)) {
    Write-Host "ERROR: MySQL no encontrado" -ForegroundColor Red
    exit 1
}

$dbUser = "root"
$dbPass = "admin"
$dbName = "macrosur_ecommerce"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

Write-Host "=== EXTRAYENDO INFORMACION DE LA BASE DE DATOS ===" -ForegroundColor Cyan

# 1. Obtener lista de tablas
Write-Host "[1/4] Obteniendo lista de tablas..." -ForegroundColor Yellow
$queryTablas = "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.tables WHERE table_schema='$dbName' ORDER BY TABLE_NAME;"
& $mysql -u $dbUser -p$dbPass -D $dbName -e $queryTablas 2>&1 | Tee-Object -Variable resultTablas
Write-Host $resultTablas

# 2. Extraer esquema completo
Write-Host "[2/4] Extrayendo esquema completo..." -ForegroundColor Yellow
$schemaFile = ".\SCHEMA_ACTUAL_$timestamp.sql"
& $mysqldump -u $dbUser -p$dbPass --databases $dbName --no-data --routines --triggers --events --result-file=$schemaFile 2>&1 | Out-Null
if (Test-Path $schemaFile) {
    Write-Host "OK: Esquema guardado en $schemaFile" -ForegroundColor Green
}

# 3. Extraer esquema con datos
Write-Host "[3/4] Extrayendo esquema con datos..." -ForegroundColor Yellow
$schemaDataFile = ".\SCHEMA_CON_DATOS_$timestamp.sql"
& $mysqldump -u $dbUser -p$dbPass --databases $dbName --routines --triggers --events --result-file=$schemaDataFile 2>&1 | Out-Null
if (Test-Path $schemaDataFile) {
    Write-Host "OK: Esquema con datos guardado en $schemaDataFile" -ForegroundColor Green
}

# 4. Conteo de registros
Write-Host "[4/4] Contando registros..." -ForegroundColor Yellow
$conteosFile = ".\CONTEO_REGISTROS_$timestamp.txt"
$queryListaTables = "SHOW TABLES;"
$tablas = & $mysql -u $dbUser -p$dbPass -D $dbName -N -e $queryListaTables 2>&1

"=== CONTEO DE REGISTROS ===" | Out-File $conteosFile
foreach ($tabla in $tablas) {
    if ($tabla -and $tabla.Trim() -ne "") {
        $queryCount = "SELECT COUNT(*) FROM $tabla;"
        $count = & $mysql -u $dbUser -p$dbPass -D $dbName -N -e $queryCount 2>&1
        "$tabla - $count registros" | Out-File $conteosFile -Append
    }
}
Write-Host "OK: Conteos guardados en $conteosFile" -ForegroundColor Green

Write-Host "`n=== EXTRACCION COMPLETADA ===" -ForegroundColor Green
Write-Host "Archivos generados:" -ForegroundColor Cyan
Write-Host "  - $schemaFile"
Write-Host "  - $schemaDataFile"
Write-Host "  - $conteosFile"
