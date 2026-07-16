#!/bin/bash
# ReliefIQ — Deploy latest changes to Raspberry Pi
set -e

echo "🚀 ReliefIQ Deploy Starting..."
cd /opt/reliefiq

echo "📥 Pulling latest code..."
git pull origin main

echo "🐍 Updating backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt --quiet
deactivate
cd ..

echo "⚛️  Building frontend..."
cd frontend
npm install --silent
npm run build
sudo cp -r dist/* /var/www/reliefiq/
cd ..

echo "🔄 Restarting backend service..."
sudo systemctl restart reliefiq

echo "✅ Deploy complete!"
sudo systemctl status reliefiq --no-pager
