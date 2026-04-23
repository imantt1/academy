# Imantt Academy — Próximos Pasos

## 1. Instalar dependencias nuevas del backend

```powershell
cd D:\Imantt_Academy\backend
npm install @nestjs/throttler
```

## 2. Probar el backend localmente

```powershell
npm run start:dev
# Servidor: http://localhost:3001
# Swagger:  http://localhost:3001/api/docs
```

### Secuencia de prueba en Swagger:

1. `POST /auth/register` → crear admin
   ```json
   { "email": "admin@imantt.com", "password": "Admin123!", "firstName": "Julian", "lastName": "Candela", "role": "admin" }
   ```
2. `POST /auth/login` → copiar `accessToken`
3. Click en **Authorize** → pegar el token
4. `POST /seed/run` → ejecutar seed de 9 módulos RTP
5. `GET /modules` → verificar los 9 módulos
6. `GET /quizzes/module/1` → ver quiz del módulo 1

## 3. Probar el frontend localmente

```powershell
cd D:\Imantt_Academy\frontend
npm run dev
# Frontend: http://localhost:3000
```

## 4. Push a GitHub y deploy

```powershell
cd D:\Imantt_Academy
bash github_push.sh
```

El script te da instrucciones paso a paso para Railway y Vercel.

## 5. Seguridad antes de producción

- [ ] Regenerar password de Railway DB
- [ ] Generar nuevos JWT_SECRET y JWT_REFRESH_SECRET
- [ ] Cambiar `synchronize: true` → `false` en `app.module.ts` (después del seed)
- [ ] Configurar `FRONTEND_URL` correcta en las vars de Railway

## Endpoints completos disponibles

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | /auth/register | No | Registro de usuario |
| POST | /auth/login | No | Login |
| POST | /auth/refresh | No | Refrescar tokens |
| POST | /auth/logout | JWT | Cerrar sesión |
| GET | /auth/me | JWT | Mi perfil |
| GET | /modules | JWT | Todos los módulos con progreso |
| GET | /modules/:id | JWT | Módulo con lecciones y quiz |
| POST | /modules | JWT+Admin | Crear módulo |
| GET | /lessons/module/:id | JWT | Lecciones de un módulo |
| GET | /quizzes/module/:id | JWT | Quiz sin respuestas correctas |
| POST | /quizzes/module/:id/submit | JWT | Enviar quiz y calificar |
| GET | /quizzes/my-progress | JWT | Mi progreso en todos los módulos |
| GET | /certificates/mine | JWT | Mis certificados emitidos |
| POST | /certificates/module/:id/generate | JWT | Generar/descargar PDF |
| POST | /seed/run | JWT+Admin | Ejecutar seed de 9 módulos RTP |
