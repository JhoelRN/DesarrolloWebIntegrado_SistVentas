# 📸 EXTRACCIÓN DEL ESQUEMA ACTUAL DESDE MYSQL WORKBENCH

## ¿Por qué hacer esto primero?

Antes de implementar un sistema de versionado, necesitamos **capturar el estado REAL** de tu base de datos tal como está en MySQL Workbench. Puede que haya cambios que no están reflejados en los archivos `.sql` del proyecto.

---

## 🔧 OPCIÓN 1: Desde MySQL Workbench (RECOMENDADO - Interfaz Gráfica)

### Paso 1: Abrir Data Export

1. Abre **MySQL Workbench**
2. Conecta a tu servidor MySQL local
3. Ve a: **Server → Data Export**

### Paso 2: Configurar la Exportación

**En la pestaña "Objects to Export":**
- ✅ Selecciona la base de datos: `macrosur_ecommerce`
- ✅ Marca TODAS las tablas (verás las 30 tablas si todas existen)

**En "Export Options":**
- Método: **Export to Self-Contained File**
- Archivo: `D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB\CURRENT_SCHEMA_REAL.sql`

**Opciones importantes:**
- ✅ **Include Create Schema** (crear la base de datos si no existe)
- ✅ **Create Dump in a Single Transaction** (consistencia)
- ❌ **DESMARCAR**: "Export to Dump Project Folder"

**Advanced Options (botón abajo):**
```
Add DROP TABLE/VIEW/PROCEDURE/FUNCTION
Add CREATE DATABASE / USE statement
Complete inserts
Extended inserts (desmarcar si quieres ver inserts separados)
```

### Paso 3: Ejecutar Export

1. Click en **Start Export**
2. Espera a que termine
3. Verás el progreso: "Export of ... has finished"

---

## 🔧 OPCIÓN 2: Desde PowerShell (RÁPIDO - Línea de Comandos)

Abre PowerShell en: `D:\RODRIGO\DesarrolloWebIntegrado_SistVentas`

```powershell
# Configurar variables (AJUSTA según tu instalación)
$MYSQL_BIN = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
$DB_HOST = "localhost"
$DB_PORT = "3306"
$DB_USER = "root"
$DB_PASS = "admin"  
$DB_NAME = "macrosur_ecommerce"
$OUTPUT_FILE = "macrosur_ecommerce_DB\CURRENT_SCHEMA_REAL.sql"

# Ejecutar dump completo (ESQUEMA + DATOS)
& $MYSQL_BIN `
  --host=$DB_HOST `
  --port=$DB_PORT `
  --user=$DB_USER `
  --password=$DB_PASS `
  --databases $DB_NAME `
  --routines `
  --triggers `
  --events `
  --single-transaction `
  --result-file=$OUTPUT_FILE

Write-Host "✅ Dump completo generado en: $OUTPUT_FILE" -ForegroundColor Green
```

### Solo Esquema (sin datos - MÁS RÁPIDO):

```powershell
& $MYSQL_BIN `
  --host=$DB_HOST `
  --port=$DB_PORT `
  --user=$DB_USER `
  --password=$DB_PASS `
  --databases $DB_NAME `
  --no-data `
  --routines `
  --triggers `
  --events `
  --result-file="macrosur_ecommerce_DB\CURRENT_SCHEMA_ONLY.sql"
```

---

## 📊 PASO 2: Analizar Diferencias con Archivos SQL Existentes

Una vez extraído, compara con los archivos actuales:

```powershell
# Ver diferencias con Git
git diff --no-index `
  "macrosur_ecommerce_DB\Tablas del Módulo de Catálogo y Productos.sql" `
  "macrosur_ecommerce_DB\CURRENT_SCHEMA_REAL.sql"
```

O abre ambos archivos en VS Code y usa:
- **Ctrl+Shift+P** → "File: Compare Active File With..."

---

## 🎯 PASO 3: Usar el Schema Real como V1__baseline.sql

Una vez que tengas `CURRENT_SCHEMA_REAL.sql`, ese será el punto de partida oficial:

```powershell
# Copiar el schema real a la primera migración
Copy-Item `
  "macrosur_ecommerce_DB\CURRENT_SCHEMA_REAL.sql" `
  "macrosur-ecommerce-backend\src\main\resources\db\migration\V1__baseline.sql"
```

---

## 📋 CHECKLIST - ¿Qué debes extraer?

✅ Todas las 30 tablas con sus estructuras actuales:
- Módulo Seguridad (4): `Roles`, `Permisos`, `Rol_Permiso`, `Usuarios_Admin`
- Módulo Catálogo (7): `Categorias`, `Productos`, `Producto_Categoria`, `Atributos`, etc.
- Módulo Clientes (5): `Clientes`, `Direcciones`, `Metodos_Pago_Cliente`, etc.
- Módulo Logística (8): `Proveedores`, `Inventario`, `Movimientos_Stock`, etc.
- Módulo Ventas (5): `Pedidos`, `Detalle_Pedido`, `Transacciones_Pago`, etc.
- Módulo Contenido (1): `Contenido_Informativo`

✅ Vistas (si existen):
- `Vista_Inventario`
- `Vista_Ventas`

✅ Datos iniciales críticos (OPCIONALES en baseline):
- 4 Roles
- 28 Permisos
- Relaciones Rol_Permiso
- 4 Usuarios Admin de prueba

---

## ⚡ SIGUIENTE PASO

Después de extraer el schema real, ejecuta:

```powershell
# Desde la raíz del proyecto
.\macrosur_ecommerce_DB\compare_schemas.ps1
```

Esto te mostrará:
- ✅ Qué tablas existen en Workbench
- ❌ Qué tablas faltan
- ⚠️ Qué diferencias hay en estructura

---

## 🔄 Workflow Futuro (después del baseline)

1. **Haces cambios en Workbench** (agregar columna, índice, etc.)
2. **Ejecutas el script de extracción** para generar un nuevo dump
3. **Comparas con V1__baseline.sql** para ver qué cambió
4. **Creas V2__descripcion_cambio.sql** solo con los cambios incrementales
5. **Flyway aplica V2** automáticamente en otros entornos

---

## 🚀 RESUMEN RÁPIDO

```powershell
# 1. Extraer schema actual
mysqldump -u root -p --no-data --databases macrosur_ecommerce > CURRENT_SCHEMA_REAL.sql

# 2. Revisar el archivo generado
code CURRENT_SCHEMA_REAL.sql

# 3. Copiar como baseline
cp CURRENT_SCHEMA_REAL.sql ../macrosur-ecommerce-backend/src/main/resources/db/migration/V1__baseline.sql

# 4. Desde ahí, Flyway trackea TODOS los cambios futuros
```

---

## 📞 ¿Problemas?

**Error: "Access denied"**
```powershell
# Verifica credenciales
mysql -u root -p
# Luego ejecuta: SHOW DATABASES;
```

**Error: "mysqldump not found"**
```powershell
# Encuentra la ruta correcta
Get-ChildItem "C:\Program Files\MySQL" -Recurse -Filter mysqldump.exe
```

**Error: "Unknown database"**
```sql
-- Verifica que exista la base de datos
SHOW DATABASES LIKE 'macrosur_ecommerce';
```

---

## ✅ Cuando termines

Avísame y verificaré que el dump tenga todo lo necesario antes de configurar Flyway.
