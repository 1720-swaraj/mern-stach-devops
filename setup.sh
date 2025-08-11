#!/bin/bash

# MERN Task Manager Setup Script
echo "Setting up MERN Task Manager..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "MongoDB is not running. Please start MongoDB before continuing."
    echo "You can start MongoDB with: brew services start mongodb-community (on macOS)"
    exit 1
fi

echo "Installing backend dependencies..."
cd backend
npm install

echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please update the .env file with your configuration before starting the server."
fi

cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Make sure to update backend/.env with your MongoDB URI and JWT secret."
