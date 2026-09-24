#!/bin/bash

set -e

echo "🏗️ Building Shamuga Drone frontend..."

cd /home/jothiswaranoh5717/htdocs/Ai/frontend

npm install
npm run build

echo "🔄 Reloading Apache..."

sudo apache2ctl configtest
sudo service apache2 reload

echo "🚀 Deploying backend..."

cd /home/jothiswaranoh5717/htdocs/Ai/backend

echo "📥 Pulling latest backend code..."

git fetch origin
git checkout main
git pull origin main

echo "🐍 Installing backend dependencies..."

source .venv/bin/activate
pip install -r requirements.txt
deactivate

echo "🔄 Restarting Shamuga Drone API..."

sudo supervisorctl restart shamuga-drone-api

echo "📊 Service status..."

sudo supervisorctl status shamuga-drone-api

echo "✅ Shamuga Drone deployment completed successfully"