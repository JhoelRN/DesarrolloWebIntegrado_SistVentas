# ENFOQUE HÍBRIDO: Creación Automática de Inventario

## 📋 Descripción

Implementación de creación automática de registros de inventario cuando se crean variantes de productos, evitando incongruencias de datos mientras se mantiene flexibilidad para ajustes manuales.

---

## 🎯 Objetivos

1. **Evitar Incongruencias**: Toda variante de producto SIEMPRE tiene al menos un registro de inventario
2. **Automatización Inteligente**: Se crea automáticamente con `cantidad=0` en ubicación principal
3. **Flexibilidad Manual**: El administrador puede ajustar cantidades y agregar ubicaciones adicionales
4. **Proceso Transparente**: Sistema registra logs para auditoría

---

## 🔧 Componentes Implementados

### 1. Entity Listener (`VarianteProductoListener.java`)
```java
@PostPersist
public void afterPersist(VarianteProducto variante)
```
- Se ejecuta automáticamente cuando se persiste una nueva `VarianteProducto`
- Llama a `ProductoService.crearInventarioAutomaticoParaVariante()`
- Maneja errores sin afectar el proceso principal

### 2. Servicio de Productos (`ProductoService.java`)

#### Método Principal: `crearInventarioAutomaticoParaVariante()`
- Busca ubicación "Tienda Principal" (o primera física disponible)
- Verifica que no exista ya un inventario para esa variante/ubicación
- Crea registro con:
  - `cantidad = 0` (el admin lo ajusta después)
  - `stockMinimoSeguridad = 10` (valor por defecto)
- Registra logs del proceso

#### Método de Utilidad: `verificarYCrearInventarioParaVariantesExistentes()`
- Procesa todas las variantes existentes
- Identifica cuáles NO tienen inventario
- Crea registros faltantes
- Retorna contador de registros creados

### 3. Endpoint REST (`InventarioController.java`)

**POST** `/api/logistica/inventario/auto-crear`
```json
Response:
{
  "success": true,
  "message": "Proceso de auto-creación de inventario completado. Ver logs del servidor para detalles."
}
```

**Propósito**: Ejecutar proceso manual para variantes existentes (migración inicial)

### 4. Script SQL (`asegurar_ubicacion_principal.sql`)
- Inserta "Tienda Principal" (tipo: TIENDA) si no existe
- Usa columnas correctas: `nombre_ubicacion`, `tipo_ubicacion`, `direccion`, `es_fisica`
- Previene errores en creación automática
- Se ejecuta una vez en setup inicial

---

## 📊 Flujo de Trabajo

### Para Nuevas Variantes (Automático)
```
1. Admin crea producto/variante en sistema
   ↓
2. JPA persiste VarianteProducto
   ↓
3. @PostPersist trigger → VarianteProductoListener
   ↓
4. Listener llama a ProductoService
   ↓
5. Se crea Inventario (cantidad=0, ubicación principal)
   ↓
6. Admin ve producto en inventario y ajusta cantidad
```

### Para Variantes Existentes (Manual/Una vez)
```
1. Admin ejecuta POST /api/logistica/inventario/auto-crear
   ↓
2. Sistema verifica todas las variantes
   ↓
3. Crea inventarios faltantes con cantidad=0
   ↓
4. Retorna mensaje de confirmación + logs
   ↓
5. Admin revisa inventario y ajusta cantidades
```

---

## 🚀 Pasos de Implementación

### 1. Preparar Base de Datos
```sql
-- Ejecutar en MySQL Workbench o CLI
source d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB\asegurar_ubicacion_principal.sql
```

### 2. Compilar Backend
```powershell
cd d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend
.\mvnw clean compile
```

### 3. Reiniciar Aplicación
```powershell
.\mvnw spring-boot:run
```

### 4. Ejecutar Auto-Creación (Solo Primera Vez)
```bash
# Usando curl
curl -X POST http://localhost:8081/api/logistica/inventario/auto-crear \
  -H "Authorization: Bearer TU_JWT_TOKEN"

# O desde Postman/Insomnia
POST http://localhost:8081/api/logistica/inventario/auto-crear
Headers:
  Authorization: Bearer {token}
```

### 5. Verificar Resultados
```sql
-- Verificar inventarios creados
SELECT 
    i.inventario_id,
    vp.sku,
    p.nombre_producto,
    i.cantidad,
    i.stock_minimo_seguridad,
    u.nombre_ubicacion
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY i.inventario_id DESC;
```

---

## 💡 Ventajas del Enfoque Híbrido

### ✅ Ventajas
1. **Integridad de Datos**: Imposible tener variante sin inventario
2. **Cero Fricción**: Admin no necesita crear inventarios manualmente
3. **Flexibilidad**: Admin puede ajustar cantidades cuando reciba stock
4. **Auditable**: Logs claros de qué se creó y cuándo
5. **Escalable**: Funciona automáticamente para miles de productos
6. **Retrocompatible**: Endpoint manual para migrar datos existentes

### ⚠️ Consideraciones
1. **Ubicación Principal Requerida**: Debe existir antes de crear variantes
2. **Cantidad Inicial en Cero**: Admin debe ajustar después de recibir stock
3. **Logs del Servidor**: Revisar consola para confirmar creaciones
4. **Seguridad JWT**: Endpoint protegido - solo admins con rol GESTOR_LOGISTICA

---

## 🔍 Debugging y Troubleshooting

### Problema: "ADVERTENCIA: No existe ubicación física para inventario automático"
**Solución**: Ejecutar `asegurar_ubicacion_principal.sql`

### Problema: No se crea inventario al crear variante
**Verificar**:
1. Logs del backend (`@PostPersist` debe aparecer)
2. VarianteProductoListener está registrado
3. Ubicación principal existe en BD

### Problema: Endpoint retorna 401/403
**Solución**: 
- Usar token JWT válido
- Usuario debe tener rol GESTOR_LOGISTICA o ADMIN

---

## 📚 Referencias Técnicas

### Entity Listeners JPA
- `@EntityListeners(VarianteProductoListener.class)`
- `@PostPersist` ejecuta después de INSERT
- ApplicationContext inyecta servicios en listener

### Repositorios Utilizados
- `InventarioRepository.findByVarianteAndUbicacion()`
- `UbicacionInventarioRepository.findAll()`
- `VarianteProductoRepository.findAll()`

### Seguridad
- Endpoint protegido por JWT en SecurityConfig
- Ruta: `/api/logistica/**` requiere autenticación

---

## 📝 Notas de Desarrollo

**Fecha Implementación**: 2025-11-27  
**Versión**: 1.0  
**Estado**: ✅ Implementado y funcional  

**Desarrollador**: Sistema implementado según especificación de usuario  
**Enfoque Elegido**: Híbrido (auto-create + manual adjustments)  

**Archivos Modificados**:
- `VarianteProducto.java` - Agregado `@EntityListeners`
- `ProductoService.java` - Métodos de auto-creación
- `InventarioController.java` - Endpoint manual

**Archivos Nuevos**:
- `VarianteProductoListener.java` - JPA Listener
- `asegurar_ubicacion_principal.sql` - Setup inicial
- `ENFOQUE_HIBRIDO_INVENTARIO.md` - Esta documentación

---

## 🎓 Para el Futuro

### Posibles Mejoras
1. **Dashboard de Inventarios Sin Stock**: Vista filtrada de cantidad=0
2. **Notificaciones**: Alertar cuando se crea inventario automático
3. **Bulk Import**: Endpoint para crear múltiples variantes + inventarios
4. **Ubicaciones Múltiples**: Auto-crear en todas las ubicaciones físicas
5. **Stock Mínimo Inteligente**: Calcular basado en categoría de producto

### Extensiones Opcionales
- Webhook para sistemas externos
- Integración con ERP/WMS
- Reportes de variantes sin stock ajustado
- Recordatorios automáticos para ajustar cantidad=0

---

**Estado Final**: ✅ Sistema listo para producción con enfoque híbrido implementado
