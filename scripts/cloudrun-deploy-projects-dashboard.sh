#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${1:-}"
REGION="${2:-europe-west1}"
SERVICE="${3:-projects-dashboard}"
SUBDOMAIN="${4:-}"
BASE_DOMAIN="anayalvaro.com"
ROOT="/home/alvaro/.openclaw/workspace/projects-dashboard"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <project-id> [region] [service] [subdomain]" >&2
  exit 1
fi

command -v gcloud >/dev/null || { echo "gcloud missing" >&2; exit 1; }

echo "[1/6] Set project"
gcloud config set project "$PROJECT_ID" >/dev/null

echo "[2/6] Enable APIs"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

echo "[3/6] Deploy Cloud Run"
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

echo "[4/6] Service URL"
URL="$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')"
echo "$URL"

echo "[5/6] Health check"
curl -fsS "$URL" >/dev/null && echo "OK"

if [[ -n "$SUBDOMAIN" ]]; then
  FQDN="${SUBDOMAIN}.${BASE_DOMAIN}"
  echo "[6/6] Domain mapping requested: $FQDN"
  if gcloud beta run domain-mappings create \
    --service "$SERVICE" \
    --domain "$FQDN" \
    --region "$REGION" \
    --quiet; then
    echo "Domain mapping created: https://$FQDN"
    echo "Run this to get required DNS records for Cloudflare:"
    echo "  gcloud beta run domain-mappings describe --domain $FQDN --region $REGION"
  else
    echo "⚠ Could not create domain mapping automatically."
    echo "Likely cause: domain not verified in this GCP project yet."
    echo "After verification, run:"
    echo "  gcloud beta run domain-mappings create --service $SERVICE --domain $FQDN --region $REGION"
  fi
else
  echo "[6/6] Skip domain mapping (no subdomain arg provided)."
  echo "Tip: pass a 4th arg to auto-map <subdomain>.${BASE_DOMAIN}."
fi
