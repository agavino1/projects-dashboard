#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-}"
REGION="${2:-europe-west1}"
SERVICE="${3:-projects-dashboard}"
ROOT="/home/alvaro/.openclaw/workspace/projects-dashboard"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <project-id> [region] [service]" >&2
  exit 1
fi

command -v gcloud >/dev/null || { echo "gcloud missing" >&2; exit 1; }

echo "[1/5] Set project"
gcloud config set project "$PROJECT_ID" >/dev/null

echo "[2/5] Enable APIs"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

echo "[3/5] Deploy Cloud Run"
gcloud run deploy "$SERVICE" \
  --source "$ROOT" \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars NODE_ENV=production \
  --quiet

echo "[4/5] Service URL"
URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo "$URL"

echo "[5/5] Health check"
curl -fsS "$URL" >/dev/null && echo "OK"
