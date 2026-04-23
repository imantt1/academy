#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Imantt Academy — Script de push a GitHub y guía de despliegue
# Ejecutar desde PowerShell:  bash github_push.sh
# Directorio: D:\Imantt_Academy\
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo ""
echo "🚀 Imantt Academy — Push a GitHub"
echo "══════════════════════════════════"

# ── Crear .gitignore raíz ─────────────────────────────────────────────────────
cat > .gitignore << 'GITIGNORE'
node_modules/
dist/
.next/
out/
build/
.env
.env.local
.env.production
.env*.local
*.log
.DS_Store
Thumbs.db
coverage/
.vscode/
GITIGNORE

echo "✅ .gitignore configurado"

# ── Git init (si no existe) ───────────────────────────────────────────────────
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/imantt1/academy.git
  echo "✅ Repositorio Git inicializado y remote configurado"
else
  echo "✅ Repositorio Git ya existe"
fi

# ── Stage y commit ────────────────────────────────────────────────────────────
git add -A
echo ""
echo "📋 Archivos a commitear:"
git status --short
echo ""

read -p "¿Continuar con el commit y push? (s/n): " confirm
if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
  echo "Cancelado por el usuario."
  exit 0
fi

COMMIT_MSG="feat: plataforma Imantt Academy completa

Backend (NestJS):
- Auth JWT con refresh token y RBAC (admin/student)
- CRUD: modules, lessons, quizzes, certificates
- Seed: 9 módulos RTP con 40 preguntas técnicas
- Generación de certificados PDF (pdf-lib) con diseño brand
- Rate limiting (throttler) + helmet + ValidationPipe
- Swagger docs en /api/docs

Frontend (Next.js 14):
- Auth store (Zustand) + axios interceptor con auto-refresh
- Dashboard con progreso global y módulos en curso
- Página de módulos con búsqueda y filtrado
- Visor de lecciones con markdown renderer
- Quiz interactivo con progress bar, revisión de respuestas
- Página de certificados con descarga PDF
- Diseño brand: Navy #1E2D6B · Blue #7B9FD4

DevOps:
- railway.json para deploy de backend
- .env.production para Vercel
- Procfile para Railway"

git commit -m "$COMMIT_MSG"
git branch -M main
git push -u origin main

echo ""
echo "✅ Push completado exitosamente"

# ── Guía de deploy ────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  📦 GUÍA DE DESPLIEGUE"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "── PASO 1: Seguridad (HACER ANTES DE PROD) ─────────────────"
echo "  ⚠️  Regenerar password de Railway DB"
echo "  ⚠️  Generar nuevos JWT secrets:"
node -e "const c=require('crypto'); console.log('  JWT_SECRET=' + c.randomBytes(48).toString('hex')); console.log('  JWT_REFRESH_SECRET=' + c.randomBytes(48).toString('hex'));" 2>/dev/null || echo "  Ejecuta: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
echo ""
echo "── PASO 2: Backend en Railway ──────────────────────────────"
echo "  1. railway.app → New Project → Deploy from GitHub"
echo "  2. Repo: imantt1/academy | Root Directory: backend"
echo "  3. Variables de entorno a configurar:"
echo "     DATABASE_URL        = <URL pública de Railway PostgreSQL>"
echo "     JWT_SECRET          = <secret del paso 1>"
echo "     JWT_EXPIRATION      = 15m"
echo "     JWT_REFRESH_SECRET  = <secret del paso 1>"
echo "     JWT_REFRESH_EXPIRATION = 7d"
echo "     PORT                = 3001"
echo "     NODE_ENV            = production"
echo "     FRONTEND_URL        = https://imantt-academy.vercel.app"
echo "  4. Build: npm run build | Start: npm run start:prod"
echo "  5. Copia la URL pública generada (ej: xxx.up.railway.app)"
echo ""
echo "── PASO 3: Frontend en Vercel ──────────────────────────────"
echo "  1. vercel.com → New Project → Import from GitHub"
echo "  2. Repo: imantt1/academy | Root Directory: frontend"
echo "  3. Variables de entorno:"
echo "     NEXT_PUBLIC_API_URL = https://<tu-url-de-railway>"
echo "  4. Deploy"
echo ""
echo "── PASO 4: Ejecutar seed en producción ─────────────────────"
echo "  Desde Swagger (railway_url/api/docs):"
echo "  1. POST /auth/register → crear admin con role: 'admin'"
echo "  2. POST /auth/login → copiar accessToken"
echo "  3. Authorize con Bearer <token>"
echo "  4. POST /seed/run → ejecutar seed de 9 módulos RTP"
echo ""
echo "── PASO 5: Cambiar synchronize en producción ────────────────"
echo "  En backend/src/app.module.ts:"
echo "     synchronize: false  (ya ejecutado el seed)"
echo "  Luego: git add -A && git commit -m 'fix: disable sync' && git push"
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  🎯 URLs ESPERADAS"
echo "  Frontend : https://imantt-academy.vercel.app"
echo "  API Docs : https://<railway-url>/api/docs"
echo "══════════════════════════════════════════════════════════════"
