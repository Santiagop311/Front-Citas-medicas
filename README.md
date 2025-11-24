# Documentación del Sistema de Gestión de Citas Médicas

## Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación del Backend](#instalación-del-backend)
5. [Instalación del Frontend](#instalación-del-frontend)
6. [Conexión Frontend-Backend](#conexión-frontend-backend)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Funcionalidades Principales](#funcionalidades-principales)
9. [Endpoints de la API](#endpoints-de-la-api)
10. [Base de Datos](#base-de-datos)
11. [Autenticación](#autenticación)

---

## Descripción del Proyecto

Este es un sistema de gestión de citas médicas que desarrollé separando el frontend del backend. Básicamente permite gestionar usuarios, afiliados, tipos de citas médicas y cuotas. Tiene una interfaz web moderna y una API REST para manejar todas las operaciones.

### ¿Qué hace el sistema?

El sistema permite:
- Gestionar usuarios del sistema (médicos, administradores) con roles
- Registrar y administrar afiliados o pacientes
- Configurar diferentes tipos de citas médicas con sus costos
- Asignar y gestionar cuotas a los afiliados
- Realizar seguimiento de las citas médicas

### Características principales

- Gestión completa de usuarios con sistema de roles
- CRUD de afiliados/pacientes
- Configuración de tipos de citas con costos
- Gestión de cuotas y asignaciones
- Autenticación con JWT (tokens)
- Interfaz desarrollada con Astro y React

---

## Arquitectura del Sistema

El sistema está dividido en tres partes principales que se comunican entre sí:

```
Frontend (Astro + React)
Puerto: 4321
- Componentes React para la interfaz
- Páginas Astro para las rutas
- Axios para hacer peticiones a la API
         │
         │ HTTP/REST + JSON
         │ JWT Tokens
         ▼
Backend (Laravel API REST)
Puerto: 8000
- Controladores que manejan las peticiones HTTP
- Servicios con la lógica de negocio
- Repositorios para acceder a los datos
- Middleware para autenticación, CORS y validación
         │
         │ Eloquent ORM
         │ PDO
         ▼
Base de Datos (PostgreSQL 16)
Puerto: 5432
- Tablas: users, affiliates, types_appointments, citas, quotas, roles
```

### Cómo funciona el backend

En el backend usé el patrón Repository-Service-Controller:

1. **Repositorios** (`app/Repositories/`): Se encargan de acceder a los datos de la base de datos
2. **Servicios** (`app/Services/`): Contienen la lógica de negocio (validaciones, transformaciones, etc.)
3. **Controladores** (`app/Http/Controllers/`): Reciben las peticiones HTTP y devuelven las respuestas

Cuando llega una petición, el flujo es así:
```
Cliente → Route → Middleware → Controller → Service → Repository → Model → Database
                                                                                ↓
Cliente ← JSON ← Controller ← Service ← Repository ← Model ← Database
```

---

## Tecnologías Utilizadas

### Distribución del proyecto

En términos de código y esfuerzo, el proyecto se distribuye así:

- **Backend (Laravel/PHP)**: 45%
- **Frontend (Astro/React)**: 40%
- **Base de Datos (PostgreSQL)**: 10%
- **Configuración/Docker**: 5%

### Lenguajes de programación

| Lenguaje | Porcentaje | Dónde se usa |
|----------|------------|--------------|
| PHP | 45% | Todo el backend: controladores, servicios, repositorios, modelos |
| TypeScript/JavaScript | 40% | Frontend: componentes React, lógica de UI |
| SQL | 10% | Migraciones y queries de base de datos |
| Docker/YAML | 5% | Configuración de contenedores |

### Backend - Tecnologías

**Framework principal:**
- Laravel 12.0 - Framework PHP que uso para el backend
- PHP 8.2+ - El lenguaje principal
- Composer - Para gestionar las dependencias de PHP

**Autenticación:**
- tymon/jwt-auth 2.2 - Para generar y validar tokens JWT
- laravel/sanctum 4.0 - También incluido aunque uso más JWT

**Base de datos:**
- PostgreSQL 16 - La base de datos relacional

**Infraestructura:**
- Docker & Docker Compose - Para levantar todo fácilmente
- PHP-FPM 8.3 - Para procesar las peticiones PHP

**Herramientas de desarrollo:**
- PHPUnit - Para hacer tests
- Laravel Pint - Para formatear el código
- Laravel Pail - Para ver los logs en tiempo real

### Frontend - Tecnologías

**Framework y librerías:**
- Astro 5.5+ - El framework principal del frontend
- React 19.2 - Para los componentes interactivos
- TypeScript 5.2+ - Para tener tipado estático

**Estilos:**
- Tailwind CSS 3.3 - Framework CSS que uso para los estilos
- SASS - Preprocesador CSS (aunque uso más Tailwind)

**Cliente HTTP:**
- Axios 1.13.1 - Para hacer las peticiones a la API

**Componentes UI:**
- @material-tailwind/react 2.0.1 - Componentes de Material Design
- framer-motion 10.18.0 - Para animaciones
- react-apexcharts 1.4.0 - Para gráficos

**Herramientas:**
- Vite - Build tool (viene con Astro)
- npm - Gestor de paquetes

### Resumen por capa

**Backend:**
- PHP: 85%
- SQL: 10%
- Docker/Config: 5%

**Frontend:**
- TypeScript/JavaScript: 60%
- React/JSX: 25%
- CSS/Tailwind: 10%
- Configuración: 5%

---

## Instalación del Backend

### Requisitos

Necesitas tener Docker Desktop instalado y corriendo. Si prefieres no usar Docker, necesitas PHP 8.2+, Composer y PostgreSQL 16 instalados localmente.

### Instalación con Docker (Recomendado)

**Paso 1:** Entrar al directorio del backend
```bash
cd "Api-Laravel-citas-medicas-main"
```

**Paso 2:** Crear el archivo .env
Crea un archivo `.env` en la raíz del proyecto con esto:

```env
APP_NAME="Sistema de Citas Médicas"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=mi_api_db
DB_USERNAME=postgres
DB_PASSWORD=secret

JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160
```

**Paso 3:** Levantar los contenedores
```bash
docker-compose up -d --build
```

Esto levanta:
- PostgreSQL en el puerto 5432
- PgAdmin en el puerto 5050 (interfaz web para ver la BD)
- Laravel en el puerto 8000

**Paso 4:** Instalar dependencias
```bash
docker exec -it laravel_app composer install
```

**Paso 5:** Generar las claves
```bash
docker exec -it laravel_app php artisan key:generate
docker exec -it laravel_app php artisan jwt:secret
```

**Paso 6:** Ejecutar migraciones y seeders
```bash
docker exec -it laravel_app php artisan migrate --seed
```

**Paso 7:** Verificar que funciona
Abre en el navegador: `http://localhost:8000/api/prueba`

Debería mostrar: `hola, este e suna prieba`

### Instalación sin Docker

**Paso 1:** Instalar dependencias
```bash
composer install
```

**Paso 2:** Crear la base de datos
```sql
CREATE DATABASE mi_api_db;
```

Y configurar el `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mi_api_db
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
```

**Paso 3:** Generar claves
```bash
php artisan key:generate
php artisan jwt:secret
```

**Paso 4:** Ejecutar migraciones
```bash
php artisan migrate --seed
```

**Paso 5:** Iniciar el servidor
```bash
php artisan serve
```

El servidor queda en `http://localhost:8000`

### Comandos útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f laravel

# Ejecutar comandos artisan
docker exec -it laravel_app php artisan [comando]

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver todas las rutas
php artisan route:list

# Ejecutar tests
php artisan test
```

---

## Instalación del Frontend

### Requisitos

Necesitas Node.js 18 o superior instalado. npm viene incluido con Node.js.

### Pasos de instalación

**Paso 1:** Entrar al directorio del frontend
```bash
cd "Front-Citas-medicas-dev"
```

**Paso 2:** Instalar dependencias
```bash
npm install
```

Esto descarga todas las dependencias: Astro, React, Tailwind, Axios, etc.

**Paso 3:** Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
PUBLIC_API_URL=http://localhost:8000/api
```

**Paso 4:** Iniciar el servidor de desarrollo
```bash
npm run dev
```

El servidor queda disponible en `http://localhost:4321`

**Paso 5:** Verificar
Abre `http://localhost:4321` en el navegador y deberías ver la página de inicio.

### Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar el build de producción
```

---

## Conexión Frontend-Backend

### Cómo se conectan

El frontend se conecta al backend haciendo peticiones HTTP REST. La configuración está en el archivo `Front-Citas-medicas-dev/src/lib/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL, // http://localhost:8000/api
});

// Esto agrega el token JWT a todas las peticiones automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Cómo funciona la autenticación

1. El usuario ingresa email y contraseña en la página de login
2. El frontend envía un POST a `http://localhost:8000/api/login`
3. El backend valida las credenciales y genera un token JWT
4. El backend devuelve el token y los datos del usuario
5. El frontend guarda el token en localStorage
6. Todas las peticiones siguientes incluyen el header `Authorization: Bearer {token}`

### Ejemplo de uso

**Para hacer login:**
```typescript
const handleLogin = async (email: string, password: string) => {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};
```

**Para hacer peticiones autenticadas:**
```typescript
import api from "../lib/api";

const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
```

### Si tienes problemas de CORS

Si te sale un error de CORS, edita `Api-Laravel-citas-medicas-main/config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:4321', 'http://localhost:3000'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Verificar que todo funciona

1. Verifica el backend: `http://localhost:8000/api/prueba` debe responder
2. Verifica el frontend: `http://localhost:4321` debe cargar
3. Prueba el login:
   - Ve a `http://localhost:4321/login`
   - Ingresa credenciales
   - Abre DevTools → Application → Local Storage y verifica que se guardó el token
4. Verifica las peticiones:
   - Abre DevTools → Network
   - Haz alguna acción (como listar usuarios)
   - Verifica que las peticiones van a `http://localhost:8000/api/...`
   - Verifica que incluyen el header `Authorization: Bearer {token}`

---

## Estructura del Proyecto

### Backend (Laravel)

```
Api-Laravel-citas-medicas-main/
├── app/
│   ├── Http/Controllers/          # Controladores REST
│   │   ├── UserController.php
│   │   ├── TypeAppointmentsController.php
│   │   ├── AffiliateController.php
│   │   └── QuotasController.php
│   ├── Models/                    # Modelos Eloquent
│   │   ├── User.php
│   │   ├── TypeAppointments.php
│   │   ├── Affiliates.php
│   │   ├── Quota.php
│   │   └── Role.php
│   ├── Services/                  # Lógica de negocio
│   │   ├── UserService.php
│   │   ├── TypeAppointmentService.php
│   │   ├── AffiliateService.php
│   │   └── QuotaService.php
│   └── Repositories/              # Acceso a datos
│       ├── UserRepository.php
│       ├── TypeAppointmentRepository.php
│       ├── AffiliateRepository.php
│       └── QuotaRepository.php
├── database/
│   ├── migrations/                # Migraciones de BD
│   └── seeders/                  # Datos iniciales
├── routes/api.php                # Rutas de la API
├── config/                        # Configuración
├── docker-compose.yml             # Docker
└── composer.json                  # Dependencias
```

### Frontend (Astro)

```
Front-Citas-medicas-dev/
├── src/
│   ├── components/                # Componentes React
│   │   ├── signin.tsx            # Login
│   │   ├── signup.tsx            # Registro
│   │   ├── usersPage.tsx         # Gestión usuarios
│   │   ├── quotasPage.jsx        # Gestión cuotas
│   │   └── ...
│   ├── pages/                     # Páginas (rutas)
│   │   ├── index.astro           # Página principal
│   │   ├── login.astro           # /login
│   │   ├── users.astro           # /users
│   │   └── ...
│   ├── layouts/                   # Layouts
│   │   └── Layout.astro
│   └── lib/                       # Utilidades
│       └── api.js                # Cliente HTTP
├── public/                        # Archivos estáticos
├── astro.config.mjs               # Config Astro
└── package.json                   # Dependencias
```

---

## Funcionalidades Principales

### 1. Gestión de Usuarios

- Crear usuarios nuevos con un rol asignado
- Listar todos los usuarios del sistema
- Editar información de usuarios existentes
- Eliminar usuarios
- Sistema de roles para control de acceso

### 2. Gestión de Afiliados

- CRUD completo de afiliados/pacientes
- Tipos de identificación (CC, NIT, Pasaporte, etc.)
- Número de identificación único
- Información personal básica

### 3. Tipos de Citas Médicas

- Crear nuevos tipos de citas con nombre, descripción y costo
- Listar todos los tipos disponibles
- Editar tipos existentes
- Eliminar tipos

### 4. Gestión de Cuotas

- Crear cuotas y asignarlas a afiliados
- Listar todas las cuotas
- Editar cuotas existentes
- Eliminar cuotas
- Relaciones con afiliados y tipos de citas

### 5. Autenticación

- Login con email y contraseña
- Tokens JWT para autenticación
- Logout seguro
- Protección de rutas con middleware
- Validación de datos

---

## Endpoints de la API

### Autenticación

**POST `/api/login`**
Iniciar sesión

Request:
```json
{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

Response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@example.com"
  }
}
```

**POST `/api/logout`**
Cerrar sesión (requiere autenticación)

Headers:
```
Authorization: Bearer {token}
```

**GET `/api/user`**
Obtener usuario autenticado (requiere autenticación)

### Usuarios

**GET `/api/users`** - Listar todos los usuarios

**POST `/api/users`** - Crear usuario
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123",
  "role_id": 1
}
```

**GET `/api/users/{id}`** - Obtener usuario por ID

**PUT `/api/users/{id}`** - Actualizar usuario

**DELETE `/api/users/{id}`** - Eliminar usuario

### Tipos de Citas

**GET `/api/appointments`** - Listar tipos de citas

**POST `/api/appointments`** - Crear tipo de cita
```json
{
  "name": "Consulta General",
  "description": "Consulta médica general",
  "cost": 50000
}
```

**GET `/api/appointments/{id}`** - Obtener por ID

**PUT `/api/appointments/{id}`** - Actualizar

**DELETE `/api/appointments/{id}`** - Eliminar

### Afiliados

**GET `/api/affiliates`** - Listar afiliados

**POST `/api/affiliates`** - Crear afiliado
```json
{
  "name": "María García",
  "identification_type": "CC",
  "identification_number": "1234567890"
}
```

**GET `/api/affiliates/{id}`** - Obtener por ID

**PUT `/api/affiliates/{id}`** - Actualizar

**DELETE `/api/affiliates/{id}`** - Eliminar

### Cuotas

**GET `/api/quotas`** - Listar cuotas

**POST `/api/quotas`** - Crear cuota

**GET `/api/quotas/{id}`** - Obtener por ID

**PUT `/api/quotas/{id}`** - Actualizar

**DELETE `/api/quotas/{id}`** - Eliminar

---

## Base de Datos

### Esquema

**Tabla `users`:**
- id (bigint, primary key)
- name (string)
- email (string, unique)
- password (string, hashed)
- role_id (bigint, foreign key -> roles.id)
- created_at, updated_at

**Tabla `roles`:**
- id (bigint, primary key)
- name (string)
- created_at, updated_at

**Tabla `types_appointments`:**
- id (bigint, primary key)
- name (string, 100)
- description (text, nullable)
- cost (decimal, 10, 2, nullable)
- created_at, updated_at

**Tabla `affiliates`:**
- id (bigint, primary key)
- name (string)
- identification_type (string)
- identification_number (string)
- created_at, updated_at

**Tabla `citas`:**
- id (bigint, primary key)
- types_appointments_id (foreign key -> types_appointments.id)
- paciente_id (foreign key -> affiliates.id)
- medico_id (foreign key -> users.id)
- creado_por (foreign key -> users.id)
- fecha_cita (datetime)
- descripcion (text, nullable)
- estado (smallint, default: 1)
- created_at, updated_at

**Tabla `quotas`:**
- id (bigint, primary key)
- affiliate_id (foreign key -> affiliates.id)
- type_appointment_id (foreign key -> types_appointments.id)
- fecha_asignacion (date)
- fecha_vencimiento (date, nullable)
- estado (string)
- created_at, updated_at

### Relaciones

- Un usuario tiene un rol (belongsTo)
- Una cita tiene un tipo de cita (belongsTo)
- Una cita tiene un paciente/afiliado (belongsTo)
- Una cita tiene un médico/usuario (belongsTo)
- Una cuota pertenece a un afiliado (belongsTo)
- Una cuota es para un tipo de cita (belongsTo)

---

## Autenticación

### JWT (JSON Web Tokens)

Uso JWT para la autenticación. Los tokens tienen tres partes:
- Header: tipo de token y algoritmo (HS256)
- Payload: datos del usuario (ID, email, etc.)
- Signature: firma para verificar que no se modificó

### Configuración

- TTL: 60 minutos (duración del token)
- Refresh TTL: 14 días
- Algoritmo: HS256
- Blacklist: habilitada (para invalidar tokens)

### Flujo completo

1. Usuario ingresa email y contraseña
2. Frontend envía POST a /api/login
3. Backend valida credenciales
4. Backend genera token JWT
5. Backend devuelve token y datos del usuario
6. Frontend guarda token en localStorage
7. Frontend incluye token en header Authorization
8. Backend valida token en cada petición protegida
9. Si es válido → permite acceso, si no → retorna 401

### Seguridad de contraseñas

Las contraseñas se guardan hasheadas con bcrypt:

```php
$data['password'] = Hash::make($data['password']);
```

### Middleware

Las rutas protegidas usan el middleware `auth:api`:

```php
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json(Auth::user());
});
```

### Validación

Uso la validación de Laravel:

```php
$data = $request->validate([
    'name' => 'required|string',
    'email' => 'required|email|unique:users',
    'password' => 'required|min:6',
]);
```

---

## Solución de Problemas

### Error: "Cannot connect to database"

Con Docker:
```bash
docker-compose ps postgres
docker-compose logs postgres
docker-compose restart postgres
```

Sin Docker:
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Error: "JWT Secret not set"

```bash
# Con Docker
docker exec -it laravel_app php artisan jwt:secret

# Sin Docker
php artisan jwt:secret
```

### Error: "APP_KEY not set"

```bash
# Con Docker
docker exec -it laravel_app php artisan key:generate

# Sin Docker
php artisan key:generate
```

### Error de CORS

1. Verifica `config/cors.php`
2. Limpia la caché:
```bash
php artisan config:clear
php artisan cache:clear
```

### Puerto ocupado

Para cambiar el puerto del backend:
```bash
# En docker-compose.yml cambia:
ports:
  - "8001:8000"

# O sin Docker:
php artisan serve --port=8001
```

Para cambiar el puerto del frontend:
```bash
npm run dev -- --port 3000
```

---

## Comandos de Referencia

### Backend

```bash
docker-compose up -d                    # Levantar contenedores
docker-compose ps                       # Ver estado
docker-compose logs -f laravel          # Ver logs
docker exec -it laravel_app php artisan [comando]  # Ejecutar comandos

php artisan migrate                     # Migraciones
php artisan migrate --seed             # Migraciones + datos
php artisan cache:clear                # Limpiar caché
php artisan config:clear               # Limpiar config
php artisan route:list                 # Ver rutas
php artisan test                       # Tests
```

### Frontend

```bash
npm install                             # Instalar dependencias
npm run dev                            # Desarrollo
npm run build                          # Build producción
npm run preview                        # Preview producción
```

---

## Conclusión

Este sistema permite gestionar citas médicas de manera completa. La separación entre frontend y backend hace que sea más fácil de mantener y escalar. Las tecnologías que usé son modernas y permiten un buen rendimiento.

**Tecnologías principales:**
- Backend: Laravel 12 (PHP 8.2+)
- Frontend: Astro 5 + React 19
- Base de datos: PostgreSQL 16
- Autenticación: JWT
- Infraestructura: Docker

---

**Documentación del Proyecto**  
**Sustentación de Grado**  
**2025**
