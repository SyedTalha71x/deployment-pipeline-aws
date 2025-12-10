#!/bin/bash
echo "=== After Install Script ==="
echo "Setting up application..."

cd /home/ubuntu/lummilo-app/server

echo "Installing production dependencies..."
npm ci --only=production

echo "Setting up environment variables..."

# Create .env file from AWS Parameter Store 

echo "Fetching environment variables from Parameter Store..."
aws ssm get-parameter --name "/lummilo-app/test/MONGODB_URL" --with-decryption --query Parameter.Value --output text > .env
aws ssm get-parameter --name "/lummilo-app/test/PORT" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/ADMIN_SECRET_KEY" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/FRONTEND_URL" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/CLIENT_URL" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/JWT_SECRET" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/EMAIL_USER" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/EMAIL_PASS" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/OPENAI_API_KEY" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/OPENAI_API_KEY_FOR_LUMMILO_PARENT_COACH" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/STRIPE_WEBHOOK_SECRET" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/STRIPE_SECRET_KEY" --with-decryption --query Parameter.Value --output text >> .env
aws ssm get-parameter --name "/lummilo-app/test/EXPRESS_SESSION_KEY" --with-decryption --query Parameter.Value --output text >> .env


echo "Environment setup complete"