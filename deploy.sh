#!/bin/bash

set -e

echo "🏗️ Building Shamuga Drone frontend..."

cd /home/jothiswaranoh5717/htdocs/Ai/frontend


git fetch origin
git checkout main
git pull origin main

if [ -f ".env.prod" ] && [ ! -f ".env.production" ]; then
    cp .env.prod .env.production
elif [ -f ".env.production" ] && [ ! -f ".env.prod" ]; then
    cp .env.production .env.prod
fi

npm install
npm run build -- --mode prod

echo "🔄 Reloading Apache..."

sudo apache2ctl configtest
sudo service apache2 reload

echo "🚀 Deploying backend..."

cd /home/jothiswaranoh5717/htdocs/Ai/backend

echo "📥 Pulling latest backend code..."


echo "🐍 Installing backend dependencies..."

source .venv/bin/activate
pip install -r requirements.txt
deactivate

echo "🔄 Restarting Shamuga Drone API..."

sudo supervisorctl restart shamuga-drone-api

echo "📊 Service status..."

sudo supervisorctl status shamuga-drone-api

echo "✅ Shamuga Drone deployment completed successfully"