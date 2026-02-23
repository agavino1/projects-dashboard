#!/bin/bash

# Projects Dashboard - Railway Deployment Script
# Este script automatiza el deployment a Railway

set -e

echo "🚀 Projects Dashboard - Railway Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Verificando requisitos..."

if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI no encontrado${NC}"
    echo "Instala con: npm i -g @railway/cli"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no encontrado${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Todos los requisitos están OK${NC}"
echo ""

# Build
echo "🔨 Compilando proyecto..."
npm run build
echo -e "${GREEN}✓ Build completado${NC}"
echo ""

# Git commit
echo "📝 Preparando commit..."
git add -A
git commit -m "Deploy: Projects Dashboard update $(date +%Y-%m-%d)" || echo "Sin cambios para commitear"
git push origin main || echo "Push fallido o no hay cambios"
echo -e "${GREEN}✓ Git preparado${NC}"
echo ""

# Railway deploy
echo "🚀 Deployando a Railway..."
railway up

echo ""
echo -e "${GREEN}✅ Deployment completado!${NC}"
echo ""
echo "🌐 Tu dashboard está en: https://projects.anayalvaro.com"
echo "📊 Dashboard de Railway: https://railway.app/dashboard"
echo ""
