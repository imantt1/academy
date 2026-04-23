# Imantt Academy — Guía de Deploy

## Orden de pasos

```
1. Push a GitHub  →  2. Railway (backend)  →  3. Vercel (frontend)  →  4. Seed  →  5. Finalizar
```

---

## Paso 1 — Push a GitHub

Desde `D:\Imantt_Academy\` en PowerShell:

```powershell
.\push.ps1
```

Cuando pida usuario y contraseña de GitHub, usa:
- Usuario: `imantt1`
- Contraseña: tu **Personal Access Token** (Settings → Developer settings → Tokens → Generate new token → scope: `repo`)

---

## Paso 2 — Railway (Backend NestJS)

### 2.1 Crear proyecto en Railway
1. Ir a [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → seleccionar `imantt1/academy`
3. En el wizard, establecer **Root Directory**: `backend`

### 2.2 Agregar base de datos PostgreSQL
1. Dentro del proyecto → **+ New** → **Database** → **PostgreSQL**
2. Railway inyecta `DATABASE_URL` automáticamente. No hace falta configurarla.

### 2.3 Configurar variables de entorno
En Railway → tu servicio backend → **Variables** → **RAW Editor**, pegar:

```
JWT_SECRET=c6869387482fb8dea08a90bf7845e8d542cbcad9d44917ff59b01d234a44c0678c1df29e282f6db66ebe7bc139bcdf09
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=cb03f931f491dc56fd19f39ad731fd3d2ce9477827cc9e22d1ed911ddfd0aabca4c0f890fce324a788dc6b7f2829bf8c
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://imantt-academy.vercel.app
DB_SYNC=true
```

> `FRONTEND_URL` se actualiza en el Paso 4 con la URL real de Vercel.

### 2.4 Verificar deploy
- Esperar a que el build termine (2-3 min)
- Abrir la URL de Railway + `/api/docs` → debe mostrar Swagger
- Ejemplo: `https://backend-production-xxxx.up.railway.app/api/docs`

**Anotar esta URL** — la necesitarás para Vercel.

---

## Paso 3 — Vercel (Frontend Next.js)

### 3.1 Importar proyecto
1. Ir a [vercel.com](https://vercel.com) → **Add New Project** → Import `imantt1/academy`
2. **Root Directory**: `frontend`
3. Framework: **Next.js** (detección automática)

### 3.2 Configurar variable de entorno
En Vercel → **Environment Variables**:

| Nombre | Valor |
|--------|-------|
| `NEXT_PUBLIC_API_URL` | `https://tu-url.up.railway.app` (URL de Railway del Paso 2.4) |

### 3.3 Deploy
- Clic en **Deploy** → esperar ~2 min
- Vercel dará una URL como `https://imantt-academy.vercel.app`

### 3.4 Actualizar CORS en Railway
Volver a Railway → Variables → cambiar:
```
FRONTEND_URL=https://imantt-academy.vercel.app
```
Railway hará redeploy automático.

---

## Paso 4 — Seed de datos

Una vez el backend esté corriendo en Railway, ejecutar desde Postman o PowerShell:

### Registrar usuario admin
```powershell
$body = '{"email":"juliancandela@imantt.com","password":"TuPasswordSeguro123!","firstName":"Julian","lastName":"Candela"}'
$res = Invoke-RestMethod -Uri "https://TU-RAILWAY-URL.up.railway.app/auth/register" -Method POST -Body $body -ContentType "application/json"
$token = $res.accessToken
```

### Promover a admin (directo en Railway PostgreSQL)
En Railway → PostgreSQL → **Query**:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'juliancandela@imantt.com';
```

### Login como admin
```powershell
$body = '{"email":"juliancandela@imantt.com","password":"TuPasswordSeguro123!"}'
$res = Invoke-RestMethod -Uri "https://TU-RAILWAY-URL.up.railway.app/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $res.accessToken
```

### Ejecutar seed (9 módulos RTP)
```powershell
Invoke-RestMethod `
  -Uri "https://TU-RAILWAY-URL.up.railway.app/seed/run" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $token" }
```

Respuesta esperada: `{ "message": "Seed completado", "modules": 9, "lessons": 30, "questions": 40 }`

---

## Paso 5 — Deshabilitar DB_SYNC (importante)

Una vez el seed esté completo y todo funcione:

1. Railway → Variables → cambiar `DB_SYNC=false`
2. Railway hace redeploy automático
3. La base de datos ya no se modificará automáticamente en futuros deploys ✓

---

## Paso 6 — Regenerar password de Railway PostgreSQL (seguridad)

1. Railway → PostgreSQL → **Settings** → **Regenerate Credentials**
2. La nueva `DATABASE_URL` se inyecta automáticamente

---

## Verificación final

| Check | URL |
|-------|-----|
| API Swagger | `https://TU-RAILWAY-URL.up.railway.app/api/docs` |
| Health check | `https://TU-RAILWAY-URL.up.railway.app/api/docs-json` |
| Frontend login | `https://imantt-academy.vercel.app/login` |
| Frontend dashboard | `https://imantt-academy.vercel.app/dashboard` |

---

## Troubleshooting

**Build falla en Railway con "nest: not found"**
→ Ya está corregido: `package.json` usa `npx @nestjs/cli build`

**CORS error en el frontend**
→ Verificar que `FRONTEND_URL` en Railway coincide exactamente con la URL de Vercel (sin `/` al final)

**502 Bad Gateway en Railway**
→ Verificar que `PORT=3001` está configurado en Variables de Railway

**Seed falla con 403**
→ El usuario debe tener `role = 'admin'` en la base de datos (ver query SQL del Paso 4)

**Certificado PDF no descarga**
→ Asegurarse de completar el quiz con puntaje >= passingScore antes de generar
