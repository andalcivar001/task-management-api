# Task Management API

API REST para gestion de tareas con autenticacion JWT, construida con NestJS + TypeORM + SQLite.

## 1) Resumen Tecnico

- Tipo de proyecto: backend API (monolito modular).
- Framework principal: NestJS 11.
- Lenguaje: TypeScript.
- Persistencia: SQLite con TypeORM.
- Seguridad: JWT Bearer + bcrypt.
- Validacion: class-validator + ValidationPipe global.

## 2) Arquitectura

### Estilo
- Monolito modular (modulos `User` y `Task` dentro de una sola app Nest).

### Capas
- Controller: expone endpoints HTTP y parsea parametros.
- Service: implementa reglas de negocio.
- Persistencia: Repository de TypeORM para entidades.
- Entidades: `User` y `Task` mapeadas a tablas SQL.

### Modulos
- `AppModule`: arranque general, CORS, DB sqlite.
- `UserModule`: registro/login, JWT strategy, guard.
- `TaskModule`: CRUD de tareas y relacion con usuario owner.

## 3) Patrones y Principios que ya usa el codigo

- Inyeccion de dependencias (IoC de NestJS).
- Patron Repository (TypeORM repositories).
- Patron DTO + validacion declarativa (`class-validator`).
- Patron Strategy (Passport JWT strategy).
- Guard para autorizacion (`JwtAuthGuard`).
- Decorator-driven design (`@Controller`, `@Injectable`, `@Entity`, etc).

## 4) Modelo de Datos

### User (`users`)
- `id` (PK)
- `nombre`
- `usuario` (unique)
- `password` (hash bcrypt via `@BeforeInsert`)
- `created_at`, `update_at`
- relacion 1:N con `Task`

### Task (`tasks`)
- `id` (PK)
- `title`
- `description` (opcional)
- `status` (`pending | in_progress | completed`)
- `priority` (`low | medium | high`)
- `due_date` (opcional)
- `created_at`, `updated_at`
- `owner` (ManyToOne -> User)

## 5) Seguridad

- Auth con JWT Bearer (`Authorization: Bearer <token>`).
- Registro y login en `/auth`.
- Password hash con bcrypt (`HASH_SALT` por variable de entorno).
- Validacion global habilitada con `ValidationPipe`.

## 6) Endpoints actuales

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Tasks
- `POST /tasks/:id` (crear tarea para usuario por id)
- `GET /tasks` (lista; admite `?status=`)
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## 7) Dependencias clave

### Runtime
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/typeorm`, `typeorm`, `sqlite3`
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
- `bcrypt`
- `class-validator`, `class-transformer`

### Desarrollo
- `typescript`, `ts-node`
- `jest`, `ts-jest`, `supertest`
- `eslint`, `prettier`

## 8) Configuracion y ejecucion

### Variables de entorno minimas
- `PORT=8080` (ya existe en `.env`)
- `HASH_SALT=10` (requerida para hash de password)

### Instalacion
```bash
npm install
```

### Desarrollo
```bash
npm run start:dev
```

### Produccion
```bash
npm run build
npm run start:prod
```

### Tests
```bash
npm run test
npm run test:e2e
npm run test:cov
```

## 9) Que describir en tu prueba Fullstack (guion recomendado)

Cuando presentes este backend, cubre estos puntos:

1. Contexto y objetivo
- Que problema resuelve la API.
- Que entidades maneja y por que.

2. Arquitectura
- Por que elegiste monolito modular en lugar de microservicios.
- Separacion por modulos y capas (Controller/Service/Repository).

3. Modelo de datos
- Relaciones entre User y Task.
- Decisiones de campos (estatus, prioridad, fechas, owner).

4. Seguridad
- Flujo register/login.
- Emision y validacion de JWT.
- Hash de password y rol de variables de entorno.

5. Validacion y manejo de errores
- DTOs y validaciones.
- Errores HTTP y contratos de respuesta.

6. Testing
- Que pruebas unitarias/e2e tienes y cuales faltan.
- Estrategia para aumentar cobertura.

7. Escalabilidad y mantenibilidad
- Como migrarias de SQLite a Postgres.
- Como agregarias roles/permisos y paginacion.

8. Integracion fullstack
- Contratos de API que consume frontend.
- Flujo de autenticacion en cliente (guardar token, proteger rutas).
- Manejo de estados de UI (loading/error/empty/success).

9. DevOps basico
- Variables de entorno por ambiente.
- Build/release.
- Observabilidad minima (logs, health check).

## 10) Riesgos tecnicos actuales detectados (importante para entrevista)

- `DELETE /tasks/:id` no tiene `@UseGuards(JwtAuthGuard)`.
- `TaskService.delete` valida existencia pero no ejecuta `remove/delete` en DB.
- `jwt.constants.ts` tiene secreto hardcodeado (deberia ir en env).
- `synchronize: true` en TypeORM no es recomendado para produccion.
- Endpoints de tareas no restringen por owner autenticado (falta control de autorizacion por recurso).

Si quieres, en el siguiente paso puedo corregir estos puntos en codigo y dejar el proyecto listo para demo tecnica.
