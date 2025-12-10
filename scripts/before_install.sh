#!/bin/bash
echo "=== Before Install Script ==="
echo "Cleaning up previous installation..."

cd /home/ubuntu

# Backup current installation
if [ -d "lummilo-app" ]; then
    echo "Backing up existing application..."
    timestamp=$(date +%Y%m%d%H%M%S)
    mv lummilo-app "lummilo-app-backup-$timestamp"
fi

mkdir -p lummilo-app
echo "Created fresh directory at /home/ubuntu/lummilo-app"