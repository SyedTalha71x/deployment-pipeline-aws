#!/bin/bash
echo "=== Application Stop Script ==="

pm2 stop lummilo-backend || true
pm2 delete lummilo-backend || true

echo "Application stopped"