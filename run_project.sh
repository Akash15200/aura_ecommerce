#!/bin/bash
echo "=============================================="
echo "Starting Aura E-Commerce Frontend (Offline Mock Mode)"
echo "=============================================="

# Check if node_modules exists in frontend, if not install it
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --prefix frontend
fi

echo "Starting Frontend Vite App..."
npm run dev --prefix frontend
