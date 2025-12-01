# ========================================
# Script PowerShell: Actualizar ENUM tipo_descuento
# ========================================

Write-Output @"

╔══════════════════════════════════════════════════════════════╗
║     ACTUALIZAR ENUM tipo_descuento EN BASE DE DATOS         ║
╔══════════════════════════════════════════════════════════════╗

⚠️  PROBLEMA DETECTADO:
   La columna 'tipo_descuento' en MySQL tiene valores ENUM antiguos
   que no coinciden con el enum del backend Java.

   Valores actuales: 'Porcentaje', 'Monto Fijo', '2x1', 'Envio Gratis'
   Valores requeridos: 'Porcentaje', 'Monto_Fijo', 'Dos_X_Uno', 'Envio_Gratis'

🔧 SOLUCIÓN:
   Ejecutar script SQL para actualizar la columna

"@

$scriptPath = "d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB\actualizar_enum_tipo_descuento.sql"

# Intentar con docker
Write-Output "`n🔍 Intentando conectar con Docker MySQL..."
$dockerResult = docker ps --filter "name=mysql" --format "{{.Names}}" 2>$null

if ($dockerResult) {
    Write-Output "✅ Docker MySQL encontrado: $dockerResult"
    Write-Output "`n📝 Ejecutando script SQL...`n"
    
    Get-Content $scriptPath | docker exec -i $dockerResult mysql -uroot -proot123 macrosur_ecommerce
    
    if ($LASTEXITCODE -eq 0) {
        Write-Output "`n✅ Script ejecutado exitosamente"
        Write-Output "`n🎉 Base de datos actualizada correctamente"
        Write-Output "`n📋 SIGUIENTE PASO:"
        Write-Output "   Reintentar crear la promoción de Envío Gratis"
    } else {
        Write-Output "`n❌ Error ejecutando el script"
    }
} else {
    Write-Output "❌ Docker no está ejecutándose o MySQL no está disponible"
    Write-Output "`n📝 EJECUTAR MANUALMENTE EN MYSQL WORKBENCH:"
    Write-Output "   1. Abrir MySQL Workbench"
    Write-Output "   2. Conectar a: localhost:3306"
    Write-Output "   3. Usuario: root / Contraseña: root123"
    Write-Output "   4. Abrir archivo: $scriptPath"
    Write-Output "   5. Ejecutar todo el script (Ctrl+Shift+Enter)"
    Write-Output "`n   O ejecutar estas líneas directamente:"
    Write-Output @"
   
   ALTER TABLE reglas_descuento MODIFY COLUMN tipo_descuento VARCHAR(20) NOT NULL;
   
   UPDATE reglas_descuento 
   SET tipo_descuento = CASE 
       WHEN tipo_descuento = 'Monto Fijo' THEN 'Monto_Fijo'
       WHEN tipo_descuento = '2x1' THEN 'Dos_X_Uno'
       WHEN tipo_descuento = 'Envio Gratis' THEN 'Envio_Gratis'
       ELSE tipo_descuento
   END;
   
   ALTER TABLE reglas_descuento 
   MODIFY COLUMN tipo_descuento ENUM('Porcentaje', 'Monto_Fijo', 'Dos_X_Uno', 'Envio_Gratis') NOT NULL;
   
"@
}

Write-Output "`n╔══════════════════════════════════════════════════════════════╗"
