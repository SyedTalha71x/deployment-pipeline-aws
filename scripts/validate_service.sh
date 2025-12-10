#!/bin/bash
echo "=== Validate Service Script ==="
echo "Checking if application is healthy..."

echo "Waiting for application to start..."
sleep 15

MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "Health check attempt $((RETRY_COUNT + 1))..."
    
    if pm2 status | grep -q "lummilo-backend.*online"; then
        echo "PM2 process is running"
        
        if netstat -tuln | grep -q ":4008 "; then
            echo "Port 4008 is listening"
            
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4008/api/health)
            if [ "$HTTP_STATUS" = "200" ]; then
                echo "HTTP health check passed (Status: $HTTP_STATUS)"
                echo "Application deployment successful!"
                exit 0
            else
                echo "HTTP health check failed (Status: $HTTP_STATUS)"
            fi
        else
            echo "Port 4008 is not listening"
        fi
    else
        echo "PM2 process is not running"
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 5
done

echo "Application failed health checks after $MAX_RETRIES attempts"
echo "Checking logs for errors..."
pm2 logs lummilo-backend --lines 20

exit 1