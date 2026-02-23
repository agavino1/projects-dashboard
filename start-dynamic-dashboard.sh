#!/bin/bash

# 🚀 Iniciador del Dashboard Dinámico de Proyectos
# https://projects.anayalvaro.com/

clear
echo "🦞 Dashboard Dinámico de Proyectos - Álvaro Gaviño"
echo "================================================"
echo ""
echo "🎯 URL: https://projects.anayalvaro.com/"
echo ""

cd "$(dirname "$0")"

# Verificar dependencias
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Instala Node.js v18+ primero."
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo "⚠️  gcloud CLI no encontrado. Solo funcionalidad local disponible."
fi

echo "📊 Sincronizando datos iniciales..."
npm run sync

echo ""
echo "🎛️  Opciones disponibles:"
echo ""
echo "1️⃣  Sincronizar y Desplegar AHORA"
echo "2️⃣  Iniciar Watcher Dinámico (automático)"
echo "3️⃣  Solo sincronizar datos"
echo "4️⃣  Desarrollo local (localhost:3000)"
echo ""

read -p "Selecciona opción [1-4]: " choice

case $choice in
    1)
        echo "🚀 Desplegando..."
        npm run deploy
        ;;
    2)
        echo "👀 Iniciando watcher dinámico..."
        echo "   • Cambios en archivos .md → auto-deploy"
        echo "   • Ctrl+C para parar"
        echo "   • Ctrl+D para deployment manual"
        echo ""
        npm run watch
        ;;
    3)
        echo "📊 Solo sincronizando..."
        npm run sync
        echo "✅ Datos sincronizados en data/projects-data.json"
        ;;
    4)
        echo "🛠️  Iniciando servidor local..."
        npm run dev
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac