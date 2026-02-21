#!/bin/bash
# Script para que Sebastián (OpenClaw) actualice el dashboard de proyectos
# Uso: 
#   ./scripts/update-dashboard.sh upsert-project '{"id":"nuevo-proyecto","emoji":"🚀",...}'
#   ./scripts/update-dashboard.sh add-task "project-id" '{"id":"task-1","title":"Hacer X",...}'
#   ./scripts/update-dashboard.sh list

DASHBOARD_URL="${DASHBOARD_URL:-https://projects.anayalvaro.com}"
API_KEY="${DASHBOARD_API_KEY}"

if [ -z "$API_KEY" ]; then
  if [ -f "$(dirname "$0")/../.env.local" ]; then
    API_KEY=$(grep DASHBOARD_API_KEY "$(dirname "$0")/../.env.local" | cut -d= -f2)
  fi
fi

if [ -z "$API_KEY" ]; then
  echo "Error: DASHBOARD_API_KEY not set. Set it as env var or in .env.local"
  exit 1
fi

CMD="${1:-list}"

case "$CMD" in
  list)
    echo "📋 Proyectos actuales:"
    curl -s "$DASHBOARD_URL/api/projects" | node -e "
      const chunks = []; 
      process.stdin.on('data', c => chunks.push(c)); 
      process.stdin.on('end', () => { 
        const d = JSON.parse(chunks.join('')); 
        (d.projects || d).forEach(p => console.log(\`  \${p.emoji} [\${p.id}] \${p.name} - \${p.status} (\${p.progress}%)\`)); 
      });"
    ;;

  upsert-project)
    PROJECT_JSON="$2"
    if [ -z "$PROJECT_JSON" ]; then
      echo "Uso: $0 upsert-project '{\"id\":\"...\",\"name\":\"...\", ...}'"
      exit 1
    fi
    echo "📤 Enviando proyecto al dashboard..."
    RESULT=$(curl -s -X POST "$DASHBOARD_URL/api/projects" \
      -H "Content-Type: application/json" \
      -H "x-api-key: $API_KEY" \
      -d "$PROJECT_JSON")
    echo "✅ Resultado: $RESULT"
    ;;

  add-task)
    PROJECT_ID="$2"
    TASK_JSON="$3"
    if [ -z "$PROJECT_ID" ] || [ -z "$TASK_JSON" ]; then
      echo "Uso: $0 add-task project-id '{\"id\":\"...\",\"title\":\"...\"}'"
      exit 1
    fi
    echo "📤 Añadiendo tarea al proyecto $PROJECT_ID..."
    RESULT=$(curl -s -X PATCH "$DASHBOARD_URL/api/projects/$PROJECT_ID" \
      -H "Content-Type: application/json" \
      -H "x-api-key: $API_KEY" \
      -d "{\"task\": $TASK_JSON}")
    echo "✅ Resultado: $RESULT"
    ;;

  update-progress)
    PROJECT_ID="$2"
    PROGRESS="$3"
    STATUS="$4"
    if [ -z "$PROJECT_ID" ] || [ -z "$PROGRESS" ]; then
      echo "Uso: $0 update-progress project-id progress [status]"
      exit 1
    fi
    PAYLOAD="{\"progress\": $PROGRESS, \"lastUpdated\": \"hoy\""
    if [ -n "$STATUS" ]; then
      PAYLOAD="$PAYLOAD, \"status\": \"$STATUS\""
    fi
    PAYLOAD="$PAYLOAD}"
    echo "📤 Actualizando progreso de $PROJECT_ID a $PROGRESS%..."
    RESULT=$(curl -s -X PATCH "$DASHBOARD_URL/api/projects/$PROJECT_ID" \
      -H "Content-Type: application/json" \
      -H "x-api-key: $API_KEY" \
      -d "$PAYLOAD")
    echo "✅ Resultado: $RESULT"
    ;;

  delete)
    PROJECT_ID="$2"
    if [ -z "$PROJECT_ID" ]; then
      echo "Uso: $0 delete project-id"
      exit 1
    fi
    echo "🗑️ Eliminando proyecto $PROJECT_ID..."
    RESULT=$(curl -s -X DELETE "$DASHBOARD_URL/api/projects/$PROJECT_ID" \
      -H "x-api-key: $API_KEY")
    echo "✅ Resultado: $RESULT"
    ;;

  *)
    echo "Comandos disponibles:"
    echo "  list                          - Ver todos los proyectos"
    echo "  upsert-project <json>         - Crear o actualizar proyecto"
    echo "  add-task <project-id> <json>  - Añadir tarea a un proyecto"
    echo "  update-progress <id> <n> [status] - Actualizar progreso"
    echo "  delete <project-id>           - Eliminar proyecto"
    ;;
esac
