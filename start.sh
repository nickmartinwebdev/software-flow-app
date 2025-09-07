#!/bin/bash

set -e

echo "🚀 Software Flow App - Development Setup"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1 && ! docker compose version > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Copying .env.example to .env..."
    cp .env.example .env
    echo "✅ Environment file created. You can modify .env if needed."
fi

# Build and start services
echo "🔨 Building and starting services..."
if command -v docker-compose > /dev/null 2>&1; then
    docker-compose up --build -d
else
    docker compose up --build -d
fi

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running at http://localhost:3000"
else
    echo "⚠️  Frontend might still be starting..."
fi

# Check backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8000"
else
    echo "⚠️  Backend might still be starting..."
fi

# Check Meilisearch
if curl -s http://localhost:7700/health > /dev/null; then
    echo "✅ Meilisearch is running at http://localhost:7700"
else
    echo "⚠️  Meilisearch might still be starting..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Meilisearch: http://localhost:7700"
echo ""
echo "🛠  Useful commands:"
echo "   View logs:   docker-compose logs -f"
echo "   Stop all:    docker-compose down"
echo "   Rebuild:     docker-compose up --build"
echo ""
echo "Happy coding! 🎯"
