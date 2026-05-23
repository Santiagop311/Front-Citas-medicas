# Frontend - Citas Medicas

Frontend web para el sistema de gestion de citas medicas. Esta construido con Astro, React y Tailwind CSS, y consume la API Laravel mediante Axios.

## Stack

- Astro 5
- React 19
- TypeScript / JavaScript
- Tailwind CSS
- Material Tailwind
- Axios

## Modulos disponibles

- Login y autenticacion con JWT
- Dashboard / inicio
- Usuarios
- Perfil de usuario con contadores reales
- Citas medicas
- Medicos
- Reportes
- Medicamentos
- Historias clinicas
- Recetas medicas

## Requisitos

- Node.js 18 o superior
- npm
- Backend Laravel corriendo en `http://localhost:8000`

## Instalacion

1. Clonar el repositorio:

```bash
git clone https://github.com/Santiagop311/Front-Citas-medicas.git
cd Front-Citas-medicas
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env`:

```env
PUBLIC_API_URL=http://localhost:8000/api
```

4. Iniciar servidor de desarrollo:

```bash
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:4321
```

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # compilar proyecto
npm run preview   # previsualizar build
```

Nota: el proyecto actualmente usa `output: "server"` en `astro.config.mjs`. Para compilar en produccion se debe configurar un adapter de Astro o cambiar el modo de salida segun el despliegue.

## Conexion con la API

El cliente HTTP esta en:

```text
src/lib/api.js
```

Usa `PUBLIC_API_URL` y agrega automaticamente el token JWT:

```js
const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
  timeout: 15000,
});
```

## Rutas principales

| Ruta | Descripcion |
|---|---|
| `/login` | Inicio de sesion |
| `/` | Inicio |
| `/users` | Gestion de usuarios |
| `/profile` | Perfil del usuario |
| `/quotas` | Gestion de citas |
| `/medicos` | Gestion de medicos |
| `/reportes` | Reportes del sistema |
| `/medications` | Medicamentos |
| `/clinical-records` | Historias clinicas |
| `/prescriptions` | Recetas medicas |

## Estructura principal

```text
src/
  components/
    signin.tsx
    usersPage.tsx
    quotasPage.jsx
    profilePage.jsx
    doctorsPage.jsx
    reportsPage.jsx
    clinicalCrudPage.jsx
    navbar.tsx
  pages/
    login.astro
    users.astro
    quotas.astro
    profile.astro
    medicos.astro
    reportes.astro
    medications.astro
    clinical-records.astro
    prescriptions.astro
  lib/
    api.js
```

## Autenticacion

1. El usuario inicia sesion desde `/login`.
2. El frontend envia credenciales a `POST /api/login`.
3. La API retorna un token JWT y los datos del usuario.
4. El frontend guarda:
   - `token` en `localStorage`
   - `user` en `localStorage`
   - `token` en cookie para el middleware de Astro
5. Las peticiones siguientes usan `Authorization: Bearer {token}`.

## Backend requerido

Este frontend espera que la API tenga estos endpoints principales:

- `/api/login`
- `/api/logout`
- `/api/users`
- `/api/affiliates`
- `/api/appointments`
- `/api/quotas`
- `/api/medications`
- `/api/clinical-records`
- `/api/prescriptions`

## Credenciales de prueba

```text
Email: admin@example.com
Password: password
```

## Notas de desarrollo

- El menu lateral esta en `src/components/navbar.tsx`.
- Los modulos de medicamentos, historias clinicas y recetas comparten `src/components/clinicalCrudPage.jsx`.
- Los mensajes de creacion, actualizacion y eliminacion se muestran con toast.
- El perfil obtiene contadores reales desde la API.
