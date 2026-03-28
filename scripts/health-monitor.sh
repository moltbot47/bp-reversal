#!/bin/bash
# Health monitor script — run via cron: */5 * * * * /path/to/health-monitor.sh
# Checks /api/health and alerts on failure

APP_URL="${APP_URL:-http://localhost:3000}"
WEBHOOK_URL="${ALERT_WEBHOOK_URL:-}"  # Slack/Discord webhook for alerts
LOG_FILE="/tmp/bp-reversal-health.log"

check_health() {
  local response
  response=$(curl -s -w "\n%{http_code}" --max-time 10 "${APP_URL}/api/health" 2>/dev/null)
  local http_code=$(echo "$response" | tail -1)
  local body=$(echo "$response" | head -1)

  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local status="ok"

  if [ "$http_code" != "200" ]; then
    status="error"
    echo "${timestamp} ERROR: HTTP ${http_code} from ${APP_URL}/api/health" >> "$LOG_FILE"
    send_alert "BP Reversal health check FAILED (HTTP ${http_code})"
  else
    local app_status=$(echo "$body" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    if [ "$app_status" = "degraded" ]; then
      status="degraded"
      echo "${timestamp} WARN: App status degraded — ${body}" >> "$LOG_FILE"
      send_alert "BP Reversal health DEGRADED: ${body}"
    else
      echo "${timestamp} OK: ${body}" >> "$LOG_FILE"
    fi
  fi

  # Keep log file manageable
  if [ -f "$LOG_FILE" ] && [ $(wc -l < "$LOG_FILE") -gt 1000 ]; then
    tail -500 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
  fi
}

send_alert() {
  local message="$1"
  if [ -n "$WEBHOOK_URL" ]; then
    curl -s -X POST "$WEBHOOK_URL" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"${message}\"}" > /dev/null 2>&1
  fi
}

check_health
