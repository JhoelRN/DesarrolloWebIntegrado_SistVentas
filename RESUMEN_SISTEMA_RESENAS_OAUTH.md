# Sistema de Reseñas con Autenticación OAuth2 - Resumen de Implementación

## 📋 Estado General: FRONTEND Y BACKEND COMPLETOS (Requiere Configuración OAuth)

---

## ✅ BACKEND COMPLETADO (Java/Spring Boot)

### 1. Entidades JPA

#### **Cliente.java** (`com.macrosur.ecommerce.entity.Cliente`)
```java
- clienteId (Long, PK, auto-generated)
- nombre, apellido, correo, contrasenaHash (nullable para OAuth)
- telefono, fechaRegistro (auto-generated)
- oauthProvider (String: 'google', 'microsoft', null)
- oauthId (String: ID único del proveedor OAuth)
- avatarUrl (String: URL de imagen de perfil)
- @OneToMany(mappedBy="cliente") resenas

Métodos:
- getNombreCompleto() → nombre + apellido
- isOAuthUser() → oauthProvider != null
```

#### **Resena.java** (`com.macrosur.ecommerce.entity.Resena`)
```java
- resenaId (Long, PK, auto-generated)
- @ManyToOne cliente (FK a Cliente)
- @ManyToOne producto (FK a Producto)
- calificacion (Integer 1-5, validated in setter)
- comentario (Text)
- fechaResena (LocalDateTime, auto-generated)
- estadoResena (Enum: Pendiente/Aprobada/Rechazada)
- fechaCompraVerificada (LocalDateTime, nullable)

Métodos:
- aprobar() → cambia estado a Aprobada
- rechazar() → cambia estado a Rechazada
- isAprobada(), isPendiente(), isRechazada()
```

### 2. Migración Base de Datos

#### **V6__add_oauth_columns_to_clientes.sql**
```sql
ALTER TABLE clientes ADD COLUMN oauth_provider VARCHAR(50);
ALTER TABLE clientes ADD COLUMN oauth_id VARCHAR(255);
ALTER TABLE clientes ADD COLUMN avatar_url VARCHAR(500);
CREATE INDEX idx_clientes_oauth ON clientes(oauth_provider, oauth_id);
ALTER TABLE clientes MODIFY contrasena_hash VARCHAR(255) NULL;
```

**IMPORTANTE:** Ejecutar migración con `mvn flyway:migrate` o al iniciar la aplicación.

### 3. DTOs

- **ClienteDTO**: Completo con oauth_provider, oauth_id, avatar_url
- **ResenaDTO**: Completo con ClienteDTO embebido, productoNombre, estadoResena
- **CreateResenaDTO**: Para crear reseñas (@NotNull @Min(1) @Max(5) calificacion)
- **ResenaListDTO**: Vista simplificada para listados (clienteNombre, avatarUrl, compraVerificada)

### 4. Repositorios

#### **ClienteRepository**
```java
- findByCorreo(String correo)
- findByOAuthProviderAndOAuthId(String provider, String oauthId)
- existsByCorreo(String correo)
- existsByOAuthProviderAndOAuthId(String provider, String oauthId)
```

#### **ResenaRepository**
```java
- findAprobadasByProductoId(Integer productoId, Pageable)
- findAllByProductoId(Integer productoId)
- findByClienteId(Long clienteId)
- findByEstadoResena(EstadoResena estado, Pageable)
- existsByClienteIdAndProductoId(Long clienteId, Integer productoId) ⚠️ Previene duplicados
- calcularPromedioCalificacion(Integer productoId)
- contarResenasAprobadas(Integer productoId)
- contarPorCalificacion(Integer productoId, Integer calificacion)
- contarPendientes()
```

### 5. Servicios

#### **ClienteService**
```java
✅ registrarCliente(nombre, apellido, correo, contrasena, telefono)
   - Valida correo único
   - Hashea contraseña con PasswordEncoder

✅ loginManual(correo, contrasena)
   - Verifica credenciales
   - Rechaza si es usuario OAuth

✅ loginOAuth(provider, oauthId, nombre, apellido, correo, avatarUrl)
   - Busca por provider+oauthId
   - Si no existe → crea nuevo cliente
   - Si existe → actualiza avatarUrl
   - Valida conflictos de correo

✅ obtenerCliente(clienteId)
✅ actualizarPerfil(clienteId, nombre, apellido, telefono)
✅ cambiarContrasena(clienteId, contrasenaActual, contrasenaNueva)
✅ listarTodosLosClientes() → Para admin

⚠️ TODO: generarRespuestaLogin() tiene comentario para JWT token
```

#### **ResenaService**
```java
✅ crearResena(CreateResenaDTO, clienteId)
   - Valida cliente y producto existen
   - Previene duplicados con existsByClienteIdAndProductoId
   - Crea con estado Pendiente

✅ listarResenasProducto(productoId, pageable)
   - Solo aprobadas (público)
   - Incluye estadísticas: promedio, total, distribución 1-5 estrellas

✅ listarResenasCliente(clienteId)
   - Todas las reseñas del cliente (cualquier estado)

✅ aprobarResena(resenaId) → Admin
✅ rechazarResena(resenaId) → Admin

✅ listarResenasPendientes(pageable) → Admin
✅ listarResenasPorEstado(estado, pageable) → Admin

✅ eliminarResena(resenaId, clienteId, isAdmin)
   - Cliente puede eliminar sus propias reseñas
   - Admin puede eliminar cualquier reseña

✅ puedeResenar(clienteId, productoId)
   - Verifica si ya reseñó
```

### 6. Controllers REST

#### **ClienteController** (`/api/clientes`)
```
POST   /registro                 → Registro manual
POST   /login                    → Login manual
POST   /oauth-login              → Callback OAuth (Google/Microsoft)
GET    /perfil                   → Obtener perfil (requiere X-Cliente-Id header)
PUT    /perfil                   → Actualizar perfil
POST   /cambiar-contrasena       → Cambiar contraseña (solo usuarios manuales)
GET    /                         → Listar todos (admin, requiere X-Is-Admin: true)
GET    /{id}                     → Obtener por ID
```

#### **ResenaController** (`/api/resenas`)
```
POST   /                         → Crear reseña (requiere X-Cliente-Id)
GET    /producto/{id}            → Listar aprobadas de un producto (público)
GET    /mis-resenas              → Mis reseñas (requiere X-Cliente-Id)
GET    /puede-resenar/{id}       → Verificar permiso (requiere X-Cliente-Id)
PATCH  /{id}/aprobar             → Aprobar (admin)
PATCH  /{id}/rechazar            → Rechazar (admin)
GET    /pendientes               → Listar por estado (admin, ?estado=Pendiente/Aprobada/Rechazada)
GET    /cliente/{id}             → Listar de un cliente (admin, requiere X-Is-Admin)
DELETE /{id}                     → Eliminar (owner o admin)
```

---

## ✅ FRONTEND COMPLETADO (React + Vite)

### 1. APIs

#### **clientAuth.js** (`src/api/clientAuth.js`)
```javascript
OAUTH_CONFIG:
  - google: { clientId, redirectUri, authEndpoint, scope }
  - microsoft: { clientId, redirectUri, authEndpoint, scope }

⚠️ PENDIENTE: Reemplazar 'YOUR_GOOGLE_CLIENT_ID' y 'YOUR_MICROSOFT_CLIENT_ID'

Funciones:
✅ loginConGoogle() 
   - Genera state aleatorio (seguridad CSRF)
   - Guarda state en localStorage
   - Redirige a Google OAuth

✅ loginConMicrosoft()
   - Similar a Google

✅ procesarCallbackOAuth(hash)
   - Valida state
   - Decodifica ID token con atob(idToken.split('.')[1])
   - Extrae datos según proveedor (Google: given_name, Microsoft: preferred_username)
   - POST a /api/clientes/oauth-login

✅ registrarCliente, loginManual
✅ obtenerPerfil, actualizarPerfil, cambiarContrasena
✅ guardarCliente → localStorage
✅ getAuthHeaders() → { 'X-Cliente-Id': clienteId }
✅ logout, estaAutenticado
```

#### **resenas.js** (`src/api/resenas.js`)
```javascript
✅ obtenerResenasProducto(productoId, page, size) → Público
✅ crearResena(productoId, calificacion, comentario) → Requiere auth
✅ obtenerMisResenas()
✅ puedeResenar(productoId)
✅ eliminarResena(resenaId)

Admin:
✅ obtenerResenasPendientes(page, size, estado)
✅ aprobarResena(resenaId) → X-Is-Admin: true
✅ rechazarResena(resenaId)
✅ eliminarResenaAdmin(resenaId)
```

### 2. Componentes

#### **StarRating.jsx** (`src/components/product/StarRating.jsx`)
```jsx
Props:
  - rating (number 1-5)
  - onRatingChange (función para modo editable)
  - readOnly (boolean)
  - size ('sm'|'md'|'lg'|'xl')

Características:
✅ Estrellas interactivas con hover transform: scale(1.2)
✅ Colores: #ffc107 (★), #e4e5e9 (☆)
✅ Accesibilidad: role="button", onKeyDown (Enter/Space)
✅ aria-label descriptivo
```

#### **ProductReviews.jsx** (`src/components/product/ProductReviews.jsx`)
```jsx
Props: productoId

Características:
✅ Card resumen: promedio, StarRating, total
✅ Botón "Escribir Reseña"
   - Verifica autenticación
   - Verifica permisos (puedeResenar)
   - Abre modal o redirige a login

✅ Lista de reseñas aprobadas:
   - Avatar o círculo con inicial
   - Nombre cliente
   - Badge "Compra Verificada" si aplica
   - Fecha (toLocaleDateString('es-PE'))
   - StarRating readonly
   - Comentario

✅ Modal crear reseña:
   - StarRating editable (size lg)
   - Textarea maxLength 1000 con contador
   - handleSubmitResena → POST /api/resenas
   - Alert "Pendiente de moderación"

✅ Paginación 10 items/página
```

### 3. Páginas

#### **OAuthCallbackPage.jsx** (`src/pages/auth/OAuthCallbackPage.jsx`)
```jsx
✅ Procesa window.location.hash
✅ Llama procesarCallbackOAuth(hash)
✅ Muestra Spinner durante procesamiento
✅ En error → Alert con botón "Volver al Login"
✅ En éxito → redirect a localStorage('oauth_redirect_after_login') o '/'
```

#### **ClientProfilePage.jsx** (`src/pages/frontend/ClientProfilePage.jsx`)
```jsx
Secciones:
✅ Avatar (img o inicial en círculo)
✅ Badge OAuth provider (Google/Microsoft)
✅ Información personal (editable):
   - Form con nombre, apellido, telefono
   - Botón "Editar" toggle

✅ Seguridad (solo usuarios manuales):
   - Botón "Cambiar Contraseña"
   - Modal con 3 campos: actual, nueva, confirmar

✅ Mis Reseñas:
   - Lista con Card por reseña
   - Badges estado (Pendiente/Aprobada/Rechazada)
   - Botón eliminar (🗑️)
   - Modal confirmación

✅ Botón "Cerrar Sesión" (logout)
```

#### **ReviewsPage.jsx** (`src/pages/admin/ReviewsPage.jsx`)
```jsx
✅ Filtros por estado (Pendiente/Aprobada/Rechazada)
✅ Tabla con columnas:
   - ID, Cliente, Producto, Calificación, Comentario, Fecha, Estado, Acciones

✅ Acciones según estado:
   - Pendiente: Botones Aprobar (✓), Rechazar (✗), Eliminar
   - Aprobada/Rechazada: Solo Eliminar

✅ Click en fila → Modal detalle:
   - Información completa de reseña
   - Badge "Compra Verificada"
   - Botones Aprobar/Rechazar (si pendiente)

✅ Modal confirmación eliminar
✅ Paginación
✅ Alertas success/error
```

#### **CustomersPage.jsx** (`src/pages/admin/CustomersPage.jsx`)
```jsx
✅ Campo búsqueda (nombre/apellido/correo)
✅ Tabla clientes:
   - Avatar (img o inicial)
   - Nombre completo
   - Badge OAuth provider o "Manual"
   - Fecha registro

✅ Botón "Ver" → Modal detalle:
   - Info completa del cliente
   - Lista de reseñas del cliente (cualquier estado)
   - Alert: "Vista de solo lectura, sin consentimiento no se puede modificar"

✅ Botón "Actualizar" (refresh)
```

#### **LoginClientePage.jsx** (`src/pages/auth/LoginClientePage.jsx`)
```jsx
✅ Formulario login manual
✅ Separador "───── o ─────"

✅ Botón "Continuar con Google":
   - Logo SVG de Google
   - Guarda url actual en localStorage('oauth_redirect_after_login')
   - Llama loginConGoogle()

✅ Botón "Continuar con Microsoft":
   - Logo SVG de Microsoft (4 cuadrados)
   - Similar a Google

✅ Link "Crea tu cuenta aquí" → /register
```

### 4. Rutas

#### **AppRouter.jsx** actualizado:
```jsx
✅ /oauth/callback → OAuthCallbackPage
✅ /cliente/perfil → ClientProfilePage (protegido, requiere CLIENTE)
```

#### **AdminRouter.jsx** (ya existente):
```
✅ /admin/reviews → ReviewsPage (actualizado de stub)
✅ /admin/customers → CustomersPage (actualizado de stub)
```

---

## ⚠️ OAUTH2 DESHABILITADO (Solo Visual)

**NOTA:** Los botones de "Continuar con Google/Microsoft" están presentes en la interfaz pero **deshabilitados**. Solo muestran un mensaje "Próximamente" y no realizan ninguna acción.

**Autenticación Disponible:** Solo login manual con correo y contraseña.

### Configuración OAuth (Para referencia futura - Actualmente deshabilitado)

#### **Google Cloud Console** (https://console.cloud.google.com)
```
1. Crear nuevo proyecto o seleccionar existente
2. Ir a "APIs & Services" → "Credentials"
3. Crear "OAuth 2.0 Client ID"
4. Tipo: Web application
5. Authorized JavaScript origins:
   - http://localhost:5173
   - http://localhost:5174
   - https://tudominio.com (producción)
6. Authorized redirect URIs:
   - http://localhost:5173/oauth/callback
   - http://localhost:5174/oauth/callback
   - https://tudominio.com/oauth/callback
7. Copiar Client ID
8. Scope requerido: profile, email
```

#### **Microsoft Azure Portal** (https://portal.azure.com)
```
1. Ir a "Azure Active Directory" → "App registrations"
2. Crear "New registration"
3. Nombre: "Macrosur E-commerce"
4. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
5. Redirect URI: 
   - Platform: Web
   - URI: http://localhost:5173/oauth/callback
6. Copiar "Application (client) ID"
7. Ir a "Authentication" → agregar más URIs si necesario
8. Ir a "API permissions" → agregar:
   - openid, profile, email (Microsoft Graph)
9. Scope requerido: openid profile email
```

### 2. Actualizar Frontend

**Archivo:** `src/api/clientAuth.js`

```javascript
const OAUTH_CONFIG = {
  google: {
    clientId: 'TU_GOOGLE_CLIENT_ID_AQUI.apps.googleusercontent.com', // ⚠️ REEMPLAZAR
    redirectUri: window.location.origin + '/oauth/callback',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'profile email'
  },
  microsoft: {
    clientId: 'TU_MICROSOFT_CLIENT_ID_AQUI', // ⚠️ REEMPLAZAR
    redirectUri: window.location.origin + '/oauth/callback',
    authEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scope: 'openid profile email'
  }
};
```

### 3. Actualizar Backend (Opcional - Validación adicional)

**Archivo:** `application.properties`

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=TU_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=TU_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=profile,email

# Microsoft OAuth2  
spring.security.oauth2.client.registration.microsoft.client-id=TU_MICROSOFT_CLIENT_ID
spring.security.oauth2.client.registration.microsoft.client-secret=TU_MICROSOFT_CLIENT_SECRET
spring.security.oauth2.client.registration.microsoft.scope=openid,profile,email
```

---

## ⚠️ PENDIENTE: IMPLEMENTACIÓN JWT (Opcional pero Recomendado)

### Razón:
Actualmente usamos header `X-Cliente-Id` directamente. Esto funciona pero no es seguro en producción. JWT tokens añaden:
- Firma criptográfica (verificación de autenticidad)
- Expiración automática
- Claims adicionales (roles, permisos)

### Pasos:

1. **Crear JwtUtil.java**
```java
package com.macrosur.ecommerce.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "TU_SECRET_KEY_AQUI_256_BITS"; // ⚠️ Cambiar en producción
    private final long EXPIRATION_TIME = 86400000; // 24 horas

    public String generateToken(Cliente cliente) {
        return Jwts.builder()
            .setSubject(cliente.getCorreo())
            .claim("clienteId", cliente.getClienteId())
            .claim("nombre", cliente.getNombre())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
    }

    public Long getClienteIdFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();
        return claims.get("clienteId", Long.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

2. **Actualizar ClienteService.java**
```java
@Autowired
private JwtUtil jwtUtil;

private Map<String, Object> generarRespuestaLogin(Cliente cliente) {
    Map<String, Object> response = new HashMap<>();
    response.put("clienteId", cliente.getClienteId());
    response.put("nombre", cliente.getNombre());
    response.put("token", jwtUtil.generateToken(cliente)); // ✅ Ahora genera token
    // ... resto de campos
    return response;
}
```

3. **Actualizar Controllers**
Cambiar:
```java
@RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId
```

Por:
```java
@RequestHeader(value = "Authorization", required = false) String authHeader
```

Y extraer clienteId:
```java
if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
}

String token = authHeader.substring(7);
if (!jwtUtil.validateToken(token)) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
}

Long clienteId = jwtUtil.getClienteIdFromToken(token);
```

4. **Actualizar Frontend APIs**
Cambiar `getAuthHeaders()`:
```javascript
export const getAuthHeaders = () => {
  const cliente = obtenerClienteActual();
  if (!cliente || !cliente.token) return {};
  
  return {
    'Authorization': `Bearer ${cliente.token}`
  };
};
```

---

## 📝 PRUEBAS A REALIZAR

### 1. Pruebas Backend (Postman/cURL)

#### Registro manual:
```bash
POST http://localhost:8081/api/clientes/registro
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "contrasena": "password123",
  "telefono": "987654321"
}
```

#### Login manual:
```bash
POST http://localhost:8081/api/clientes/login
Body: {
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

#### Crear reseña:
```bash
POST http://localhost:8081/api/resenas
Headers: {
  "X-Cliente-Id": "1"
}
Body: {
  "productoId": 1,
  "calificacion": 5,
  "comentario": "Excelente producto!"
}
```

#### Aprobar reseña (admin):
```bash
PATCH http://localhost:8081/api/resenas/1/aprobar
```

### 2. Pruebas Frontend

1. **Login Manual**
   - Navegar a `/login`
   - Ingresar credenciales
   - Verificar redirección a perfil

2. **Login OAuth (con client IDs reales)**
   - Click "Continuar con Google"
   - Autorizar en Google
   - Verificar callback procesa correctamente
   - Verificar perfil muestra avatar de Google

3. **Crear Reseña**
   - Login como cliente
   - Navegar a producto
   - Tab "Reseñas"
   - Click "Escribir Reseña"
   - Enviar reseña
   - Verificar mensaje "Pendiente de moderación"

4. **Moderación Admin**
   - Login como admin (`/admin/login`)
   - Ir a `/admin/reviews`
   - Filtrar "Pendientes"
   - Aprobar reseña
   - Verificar aparece en producto

5. **Perfil Cliente**
   - Login como cliente
   - Ir a `/cliente/perfil`
   - Editar nombre
   - Cambiar contraseña (si manual)
   - Ver "Mis Reseñas"

6. **Admin Clientes**
   - Login como admin
   - Ir a `/admin/customers`
   - Buscar cliente
   - Ver detalle con reseñas

---

## 🔒 SEGURIDAD - NOTAS IMPORTANTES

### Headers Actuales (Temporal)
```
X-Cliente-Id: Long (ID del cliente autenticado)
X-Is-Admin: Boolean (true/false)
```

⚠️ **RIESGO:** Cualquiera puede enviar estos headers. Está bien para desarrollo pero NO PARA PRODUCCIÓN.

### Recomendaciones Producción:

1. **Implementar JWT** (ver sección anterior)
2. **Spring Security Filter Chain**
   - Validar token en cada request
   - Rechazar requests sin token válido
3. **CORS restrictivo**
   - Cambiar `@CrossOrigin(origins = "*")` a dominios específicos
4. **HTTPS obligatorio** en producción
5. **Rate Limiting** para prevenir spam de reseñas
6. **SQL Injection** ya protegido por JPA
7. **XSS** ya protegido por React (escaping automático)

---

## 📊 FLUJO COMPLETO DEL SISTEMA

### Flujo Cliente - Login OAuth:

```
1. Cliente → click "Continuar con Google" en /login
2. Frontend → genera state aleatorio, guarda en localStorage
3. Frontend → redirige a Google OAuth con state
4. Google → cliente autoriza, redirige a /oauth/callback#id_token=...&state=...
5. Frontend (OAuthCallbackPage) → valida state, decodifica token
6. Frontend → POST /api/clientes/oauth-login con datos extraídos
7. Backend (ClienteService) → busca o crea cliente
8. Backend → retorna clienteId, nombre, avatarUrl, etc.
9. Frontend → guarda en localStorage, redirige a página original
10. Cliente autenticado ✅
```

### Flujo Cliente - Crear Reseña:

```
1. Cliente → navega a producto, tab "Reseñas"
2. Frontend → GET /api/resenas/puede-resenar/1 (con X-Cliente-Id header)
3. Backend → verifica !existsByClienteIdAndProductoId
4. Frontend → habilita botón "Escribir Reseña"
5. Cliente → click botón, abre modal, escribe y envía
6. Frontend → POST /api/resenas con {productoId, calificacion, comentario}
7. Backend → crea Resena con estado Pendiente
8. Frontend → muestra "Pendiente de moderación"
```

### Flujo Admin - Moderar Reseña:

```
1. Admin → navega a /admin/reviews
2. Frontend → GET /api/resenas/pendientes?estado=Pendiente
3. Backend → findByEstadoResena(Pendiente, pageable)
4. Frontend → muestra tabla
5. Admin → click "Aprobar" (✓)
6. Frontend → PATCH /api/resenas/1/aprobar
7. Backend → resena.aprobar(), save
8. Frontend → recarga lista, muestra success
9. Reseña ahora visible en producto ✅
```

---

## 📂 ESTRUCTURA DE ARCHIVOS

### Backend:
```
src/main/java/com/macrosur/ecommerce/
├── entity/
│   ├── Cliente.java               ✅ NUEVO
│   └── Resena.java                ✅ NUEVO
├── dto/
│   ├── ClienteDTO.java            ✅ NUEVO
│   ├── ResenaDTO.java             ✅ NUEVO
│   ├── CreateResenaDTO.java       ✅ NUEVO
│   └── ResenaListDTO.java         ✅ NUEVO
├── repository/
│   ├── ClienteRepository.java     ✅ NUEVO
│   └── ResenaRepository.java      ✅ NUEVO
├── service/
│   ├── ClienteService.java        ✅ NUEVO
│   └── ResenaService.java         ✅ NUEVO
└── controller/
    ├── ClienteController.java     ✅ NUEVO
    └── ResenaController.java      ✅ NUEVO

src/main/resources/db/migration/
└── V6__add_oauth_columns_to_clientes.sql  ✅ NUEVO
```

### Frontend:
```
src/
├── api/
│   ├── clientAuth.js              ✅ NUEVO
│   └── resenas.js                 ✅ NUEVO
├── components/
│   └── product/
│       ├── StarRating.jsx         ✅ NUEVO
│       └── ProductReviews.jsx     ✅ NUEVO
├── pages/
│   ├── auth/
│   │   ├── LoginClientePage.jsx   ✅ ACTUALIZADO (botones OAuth)
│   │   └── OAuthCallbackPage.jsx  ✅ NUEVO
│   ├── frontend/
│   │   ├── ClientProfilePage.jsx  ✅ NUEVO
│   │   └── ProductDetailPage.jsx  ✅ ACTUALIZADO (ProductReviews integrado)
│   └── admin/
│       ├── ReviewsPage.jsx        ✅ ACTUALIZADO (de stub a completo)
│       └── CustomersPage.jsx      ✅ ACTUALIZADO (de stub a completo)
└── router/
    └── AppRouter.jsx               ✅ ACTUALIZADO (nuevas rutas)
```

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **Ejecutar migración V6**
   ```bash
   cd macrosur-ecommerce-backend
   mvn flyway:migrate
   # O simplemente iniciar la aplicación
   ```

2. ⚠️ **Obtener credenciales OAuth**
   - Google Cloud Console
   - Microsoft Azure Portal
   - Actualizar `clientAuth.js`

3. ✅ **Probar flujo completo sin OAuth**
   - Registro manual
   - Login manual
   - Crear reseña
   - Aprobar reseña (admin)

4. ⚠️ **Probar flujo OAuth** (después de configurar credenciales)
   - Login con Google
   - Login con Microsoft
   - Verificar perfil muestra avatar

5. ⚠️ **Implementar JWT** (opcional, recomendado para producción)

6. ✅ **Actualizar AuthContext** para separar admin vs cliente (si es necesario)

---

## 📞 SOPORTE Y CONTACTO

Para dudas o problemas:
- Revisar logs de backend: `mvn spring-boot:run`
- Revisar consola de frontend: F12 → Console
- Verificar network tab para ver requests/responses
- Comprobar que la migración V6 se ejecutó: `SELECT * FROM flyway_schema_history`

---

**Versión:** 1.0  
**Última actualización:** 2024-12  
**Estado:** Backend y Frontend completos - Requiere configuración OAuth2
