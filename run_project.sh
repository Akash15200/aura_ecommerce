#!/bin/bash

# Create logs directory
mkdir -p logs

# JVM options to minimize memory usage for local run on 8GB RAM machines
JVM_OPTS="-XX:TieredStopAtLevel=1 -Xmx192m -Xms64m"

# Track PIDs of started processes
PIDS=()

cleanup() {
    echo ""
    echo "=============================================="
    echo "Stopping all microservices and frontend..."
    echo "=============================================="
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
        fi
    done
    exit 0
}

# Trap Ctrl+C and termination signals
trap cleanup SIGINT SIGTERM

echo "=============================================="
echo "Starting Aura E-Commerce Microservices Platform"
echo "=============================================="

# 1. Start Discovery Server
echo "Starting Discovery Server (Eureka)..."
java $JVM_OPTS -jar backend/discovery-server/target/discovery-server-0.0.1-SNAPSHOT.jar > logs/discovery-server.log 2>&1 &
DISCOVERY_PID=$!
PIDS+=($DISCOVERY_PID)

echo "Waiting for Discovery Server to initialize (15 seconds)..."
sleep 15

# 2. Start all other backend services
SERVICES=(
    "api-gateway"
    "auth-service"
    "product-service"
    "order-service"
    "payment-service"
    "review-service"
    "recommendation-service"
    "notification-service"
    "analytics-service"
)

for service in "${SERVICES[@]}"; do
    echo "Starting $service..."
    java $JVM_OPTS -jar backend/$service/target/$service-0.0.1-SNAPSHOT.jar > logs/$service.log 2>&1 &
    PIDS+=($!)
done

# 3. Start Frontend Vite Server
echo "Starting Frontend Vite App..."
npm run dev --prefix frontend > logs/frontend.log 2>&1 &
PIDS+=($!)

echo "=============================================="
echo "All microservices and frontend are running!"
echo "----------------------------------------------"
echo "Log files are available in the 'logs/' folder:"
echo "  - Discovery Server: http://localhost:8761"
echo "  - API Gateway:      http://localhost:8080"
echo "  - Frontend:         http://localhost:5173"
echo "=============================================="
echo "Press Ctrl+C to stop all services."

# Wait for all processes to complete
wait
