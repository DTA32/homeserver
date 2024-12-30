#!/bin/bash

# Location: /usr/local/bin/scripts/autosuspend.sh
# Description: This script suspend server if there's no nginx activity in the last 30 minutes or no active SSH connection
# Notes: supaya tagihan listrik tidak terlalu tinggi ya

# Check if there's any active SSH connection
if who | grep -q "pts"; then
  echo "Active SSH session detected. Skipping suspend."
  exit 0
fi

# Query network activity from NGINX Ingress using Prometheus
PROMETHEUS_URL="http://<prome-ip>:9090"
QUERY='sum(rate(nginx_ingress_controller_requests[30m]))'

response=$(curl -sG --data-urlencode "query=$QUERY" "$PROMETHEUS_URL/api/v1/query")

result=$(echo "$response" | jq -r '.data.result[0].value[1]')

if [[ "$result" == "0" ]]; then
  echo "No activity detected in the last 30 minutes. Suspending the server..."
  systemctl suspend
else
  echo "Activity detected: $result requests. No action taken."
fi
