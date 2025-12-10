#!/bin/bash
echo "=== Application Start Script ==="

cd /home/ubuntu/lummilo-app/server

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

echo "Stopping existing PM2 process..."
pm2 stop lummilo-backend || true
pm2 delete lummilo-backend || true

echo "Starting Node.js server..."
pm2 start index.js --name "lummilo-backend" \
    --log /home/ubuntu/logs/server.log \
    --error /home/ubuntu/logs/server-error.log \
    --output /home/ubuntu/logs/server-out.log \
    --time

pm2 save

echo "Setting up PM2 startup..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

pm2 save

echo "Application started successfully!"
echo "Server running on port 4008"
echo "Check logs: pm2 logs lummilo-backend"