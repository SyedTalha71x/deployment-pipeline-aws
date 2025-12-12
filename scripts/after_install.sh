#!/bin/bash
echo "=== After Install Script ==="
echo "Setting up application..."

cd /home/ubuntu/lummilo-app/server

echo "Installing production dependencies..."
npm ci --only=production

echo "Setting up environment variables..."

echo "Fetching environment variables from Parameter Store..."

# Format: KEY=VALUE (each on new line)
echo "MONGODB_URL=$(aws ssm get-parameter --name "/lummilo-app/test/MONGODB_URL" --with-decryption --query Parameter.Value --output text --region us-east-1)" > .env
echo "PORT=$(aws ssm get-parameter --name "/lummilo-app/test/PORT" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "ADMIN_SECRET_KEY=$(aws ssm get-parameter --name "/lummilo-app/test/ADMIN_SECRET_KEY" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "FRONTEND_URL=$(aws ssm get-parameter --name "/lummilo-app/test/FRONTEND_URL" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "CLIENT_URL=$(aws ssm get-parameter --name "/lummilo-app/test/CLIENT_URL" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "JWT_SECRET=$(aws ssm get-parameter --name "/lummilo-app/test/JWT_SECRET" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "EMAIL_USER=$(aws ssm get-parameter --name "/lummilo-app/test/EMAIL_USER" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "EMAIL_PASS=$(aws ssm get-parameter --name "/lummilo-app/test/EMAIL_PASS" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "OPENAI_API_KEY=$(aws ssm get-parameter --name "/lummilo-app/test/OPENAI_API_KEY" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "OPENAI_API_KEY_FOR_LUMMILO_PARENT_COACH=$(aws ssm get-parameter --name "/lummilo-app/test/OPENAI_API_KEY_FOR_LUMMILO_PARENT_COACH" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "STRIPE_WEBHOOK_SECRET=$(aws ssm get-parameter --name "/lummilo-app/test/STRIPE_WEBHOOK_SECRET" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "STRIPE_SECRET_KEY=$(aws ssm get-parameter --name "/lummilo-app/test/STRIPE_SECRET_KEY" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env
echo "EXPRESS_SESSION_KEY=$(aws ssm get-parameter --name "/lummilo-app/test/EXPRESS_SESSION_KEY" --with-decryption --query Parameter.Value --output text --region us-east-1)" >> .env

echo "Environment setup complete"
echo ".env file created with $(wc -l < .env) variables"