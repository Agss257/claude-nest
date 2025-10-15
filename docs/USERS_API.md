# API de Usuarios - Documentación

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Modelo de Datos](#modelo-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [DTOs y Validación](#dtos-y-validación)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## Descripción General

El módulo de usuarios proporciona una API RESTful completa para la gestión de usuarios en el sistema. Implementa operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con validación de datos, manejo de errores y documentación Swagger integrada.

**Base URL:** `/users`

**Características:**
- Validación automática de datos de entrada
- Emails únicos por usuario
- Seguimiento de última actividad
- Sistema de roles (admin, user, moderator)
- Timestamps automáticos de creación y actualización
- Documentación Swagger disponible

---

## Modelo de Datos

### Entidad User

**Tabla:** `usuarios`

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | UUID | Identificador único del usuario | Primary Key, Auto-generado |
| `correo` | string | Correo electrónico del usuario | Único, No nulo, Max 255 caracteres |
| `nombre` | string | Nombre completo del usuario | No nulo, Max 100 caracteres |
| `rol` | enum | Rol del usuario en el sistema | Valores: 'admin', 'user', 'moderator', Default: 'user' |
| `disponibilidad` | boolean | Estado de disponibilidad del usuario | Default: true |
| `ultimaVezActivo` | timestamp | Última vez que el usuario estuvo activo | Nullable, se actualiza al consultar |
| `createdAt` | timestamp | Fecha de creación del registro | Auto-generado |
| `updatedAt` | timestamp | Fecha de última actualización | Auto-actualizado |

### Enum: UserRole

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}
```

---

## Endpoints de la API

### 1. Crear Usuario

**POST** `/users`

Crea un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "correo": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "rol": "user",
  "disponibilidad": true
}
```

**Response (201 Created):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "correo": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "rol": "user",
  "disponibilidad": true,
  "ultimaVezActivo": "2025-10-09T10:30:00.000Z",
  "createdAt": "2025-10-09T10:30:00.000Z",
  "updatedAt": "2025-10-09T10:30:00.000Z"
}
```

**Códigos de Estado:**
- `201` - Usuario creado exitosamente
- `400` - Datos de entrada inválidos o validación fallida
- `409` - El correo electrónico ya existe en el sistema

---

### 2. Obtener Todos los Usuarios

**GET** `/users`

Obtiene una lista de todos los usuarios en el sistema, ordenados por fecha de creación (más reciente primero).

**Response (200 OK):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "correo": "usuario1@ejemplo.com",
    "nombre": "Juan Pérez",
    "rol": "user",
    "disponibilidad": true,
    "ultimaVezActivo": "2025-10-09T10:30:00.000Z",
    "createdAt": "2025-10-09T10:30:00.000Z",
    "updatedAt": "2025-10-09T10:30:00.000Z"
  },
  {
    "id": "987e6543-e21b-34d5-b678-426614174111",
    "correo": "usuario2@ejemplo.com",
    "nombre": "María García",
    "rol": "admin",
    "disponibilidad": true,
    "ultimaVezActivo": "2025-10-09T09:15:00.000Z",
    "createdAt": "2025-10-08T14:20:00.000Z",
    "updatedAt": "2025-10-09T09:15:00.000Z"
  }
]
```

**Códigos de Estado:**
- `200` - Lista de usuarios obtenida exitosamente

---

### 3. Obtener Usuario por ID

**GET** `/users/:id`

Obtiene un usuario específico por su ID. Actualiza automáticamente el campo `ultimaVezActivo` del usuario.

**Parámetros:**
- `id` (path) - UUID del usuario

**Ejemplo:** `GET /users/123e4567-e89b-12d3-a456-426614174000`

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "correo": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "rol": "user",
  "disponibilidad": true,
  "ultimaVezActivo": "2025-10-09T10:30:00.000Z",
  "createdAt": "2025-10-09T10:30:00.000Z",
  "updatedAt": "2025-10-09T10:30:00.000Z"
}
```

**Códigos de Estado:**
- `200` - Usuario obtenido exitosamente
- `404` - Usuario no encontrado

---

### 4. Actualizar Usuario

**PATCH** `/users/:id`

Actualiza un usuario existente. Todos los campos son opcionales.

**Parámetros:**
- `id` (path) - UUID del usuario

**Request Body (todos los campos son opcionales):**
```json
{
  "correo": "nuevo@ejemplo.com",
  "nombre": "Juan Carlos Pérez",
  "rol": "moderator",
  "disponibilidad": false
}
```

**Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "correo": "nuevo@ejemplo.com",
  "nombre": "Juan Carlos Pérez",
  "rol": "moderator",
  "disponibilidad": false,
  "ultimaVezActivo": "2025-10-09T10:30:00.000Z",
  "createdAt": "2025-10-09T10:30:00.000Z",
  "updatedAt": "2025-10-09T11:45:00.000Z"
}
```

**Códigos de Estado:**
- `200` - Usuario actualizado exitosamente
- `400` - Datos de entrada inválidos o validación fallida
- `404` - Usuario no encontrado
- `409` - El correo electrónico ya existe (si se está actualizando el email)

---

### 5. Eliminar Usuario

**DELETE** `/users/:id`

Elimina un usuario del sistema (eliminación física).

**Parámetros:**
- `id` (path) - UUID del usuario

**Ejemplo:** `DELETE /users/123e4567-e89b-12d3-a456-426614174000`

**Response (204 No Content):**
Sin contenido en el body.

**Códigos de Estado:**
- `204` - Usuario eliminado exitosamente
- `404` - Usuario no encontrado

---

## DTOs y Validación

### CreateUserDto

Utilizado para crear nuevos usuarios.

| Campo | Tipo | Requerido | Validaciones |
|-------|------|-----------|--------------|
| `correo` | string | Sí | Email válido |
| `nombre` | string | Sí | Mínimo 2, Máximo 100 caracteres |
| `rol` | UserRole | No | Enum: 'admin', 'user', 'moderator' |
| `disponibilidad` | boolean | No | Booleano |

**Mensajes de Error:**
- Correo: "Debe proporcionar un correo electrónico válido", "El correo electrónico es obligatorio"
- Nombre: "El nombre es obligatorio", "El nombre debe tener al menos 2 caracteres", "El nombre no puede exceder 100 caracteres"
- Rol: "El rol debe ser uno de: admin, user, moderator"
- Disponibilidad: "La disponibilidad debe ser un valor booleano"

### UpdateUserDto

Todos los campos de `CreateUserDto` son opcionales. Utiliza `PartialType` de NestJS.

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200 OK` | Operación exitosa (GET, PATCH) |
| `201 Created` | Usuario creado exitosamente (POST) |
| `204 No Content` | Usuario eliminado exitosamente (DELETE) |
| `400 Bad Request` | Datos de entrada inválidos o validación fallida |
| `404 Not Found` | Usuario no encontrado |
| `409 Conflict` | Conflicto (email duplicado) |

---

## Ejemplos de Uso

### Ejemplo 1: Crear un nuevo usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan.perez@ejemplo.com",
    "nombre": "Juan Pérez",
    "rol": "user",
    "disponibilidad": true
  }'
```

### Ejemplo 2: Obtener todos los usuarios

```bash
curl -X GET http://localhost:3000/users
```

### Ejemplo 3: Obtener un usuario específico

```bash
curl -X GET http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

### Ejemplo 4: Actualizar un usuario

```bash
curl -X PATCH http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "disponibilidad": false
  }'
```

### Ejemplo 5: Eliminar un usuario

```bash
curl -X DELETE http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
```

---

## Características Adicionales

### Métodos Auxiliares en UsersService

Además de los endpoints públicos, el servicio incluye métodos auxiliares:

- **`findByEmail(correo: string)`** - Busca un usuario por su correo electrónico
- **`updateLastActive(id: string)`** - Actualiza el timestamp de última actividad

Estos métodos pueden ser utilizados por otros módulos del sistema (ej: autenticación).

---

## Documentación Swagger

La API incluye documentación Swagger completa. Una vez que el servidor esté corriendo, puedes acceder a ella en:

**URL:** `http://localhost:3000/api`

La documentación Swagger proporciona:
- Descripción detallada de cada endpoint
- Esquemas de datos
- Posibilidad de probar los endpoints directamente desde el navegador
- Ejemplos de request/response

---

## Notas de Implementación

1. **Validación Automática:** Todos los endpoints tienen validación automática con `ValidationPipe` configurado con `whitelist: true` y `forbidNonWhitelisted: true`.

2. **Unicidad de Email:** El sistema garantiza que no pueden existir dos usuarios con el mismo correo electrónico.

3. **Actualización de Actividad:** Cada vez que se consulta un usuario específico (GET /users/:id), se actualiza automáticamente su timestamp `ultimaVezActivo`.

4. **Valores por Defecto:**
   - `rol`: 'user'
   - `disponibilidad`: true
   - `ultimaVezActivo`: fecha/hora actual al crear

5. **Ordenamiento:** La lista de usuarios se devuelve ordenada por fecha de creación descendente (más recientes primero).
