#!/bin/bash

# Script de auto-deployment dinámico para projects dashboard
# Sincroniza datos y redespliega automáticamente

set -e

SCRIPT_DIR="$(dirname "$0")"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Auto-deployment iniciado..."

cd "$PROJECT_DIR"

# 1. Sincronizar datos desde archivos MD
echo "📊 Sincronizando datos de proyectos..."
node "$SCRIPT_DIR/sync-projects.js"

# 2. Verificar que el build funciona
echo "🔨 Verificando build..."
npm run build

# 3. Commit cambios si hay
if [[ $(git status --porcelain) ]]; then
    echo "📝 Commiteando cambios automáticos..."
    git add data/projects-data.json .next/
    git commit -m "Auto-sync: Actualización dinámica de proyectos $(date)"
fi

# 4. Deploy a Cloud Run (más rápido que Railway)
echo "☁️  Desplegando a Cloud Run..."
./scripts/cloudrun-deploy-projects-dashboard.sh projects-dashboard-$(date +%Y%m%d-%H%M) europe-west1 projects-dashboard

# 5. Verificar deployment
echo "🔍 Verificando deployment..."
sleep 10
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://projects.anayalvaro.com/)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment exitoso! https://projects.anayalvaro.com/"
else
    echo "⚠️  Advertencia: HTTP $HTTP_CODE al verificar. Revisar logs."
fi

echo "🎉 Auto-deployment completado!"