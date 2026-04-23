# Imantt Academy - Push a GitHub (PowerShell)
# Ejecutar desde D:\Imantt_Academy\ con: .\push.ps1

Write-Host "Imantt Academy - Push a GitHub" -ForegroundColor Cyan

# .gitignore
$content = "node_modules/`ndist/`n.next/`nout/`nbuild/`n.env`n.env.local`n.env.production`n*.log`n.DS_Store`ncoverage/"
[System.IO.File]::WriteAllText("$PWD\.gitignore", $content)
Write-Host ".gitignore OK" -ForegroundColor Green

# Git init
if (-not (Test-Path ".git")) {
    git init
    git remote add origin https://github.com/imantt1/academy.git
    Write-Host "Git inicializado" -ForegroundColor Green
} else {
    Write-Host "Git ya existe" -ForegroundColor Green
}

# Stage
git add -A
Write-Host ""
Write-Host "Archivos a commitear:" -ForegroundColor Yellow
git status --short

Write-Host ""
$confirm = Read-Host "Continuar con commit y push? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "Cancelado."
    exit 0
}

# Commit
git commit -m "feat: plataforma Imantt Academy completa - backend NestJS + frontend Next.js 14"

# Push
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "Push completado exitosamente" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Railway: conectar repo imantt1/academy, carpeta backend, agregar vars de .env"
Write-Host "2. Vercel:  conectar repo imantt1/academy, carpeta frontend, NEXT_PUBLIC_API_URL=<url-railway>"
Write-Host "3. Seed:    POST /seed/run con token admin despues del deploy"
