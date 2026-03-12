#!/bin/bash
# ============================================
# Autonomous Vehicle RL Training - Start Script
# Double-click this file to run the project!
# ============================================

# Navigate to the project root (where this script lives)
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"

echo "============================================"
echo "  🚗 Autonomous Vehicle RL Training System"
echo "============================================"
echo ""

# --- 1. Build the C++ Simulator (if needed) ---
SIM_DIR="$PROJECT_DIR/autonomus/autonomous-rl-vehicle/simulator"
SIM_BIN="$SIM_DIR/build/AutonomousVehicleSimulator"

if [ ! -f "$SIM_BIN" ]; then
    echo "🔨 Building C++ Simulator..."
    mkdir -p "$SIM_DIR/build"
    cd "$SIM_DIR/build"
    cmake .. 2>&1
    make -j4 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ Simulator build failed!"
        echo "Press any key to exit..."
        read -n 1
        exit 1
    fi
    echo "✅ Simulator built successfully!"
else
    echo "✅ Simulator already built."
fi

# --- 2. Install Node.js dependencies (if needed) ---
DASH_DIR="$PROJECT_DIR/rl-dashboard-nextgen"

if [ ! -d "$DASH_DIR/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd "$DASH_DIR" && npm install
fi

if [ ! -d "$DASH_DIR/client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd "$DASH_DIR/client" && npm install
fi

if [ ! -d "$DASH_DIR/client/build" ]; then
    echo "🔨 Building React dashboard..."
    cd "$DASH_DIR/client" && npm run build
fi

echo ""

# --- 3. Cleanup function to kill background processes on exit ---
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    if [ ! -z "$SIM_PID" ]; then
        kill "$SIM_PID" 2>/dev/null
        echo "   Simulator stopped."
    fi
    if [ ! -z "$SERVER_PID" ]; then
        kill "$SERVER_PID" 2>/dev/null
        echo "   Dashboard server stopped."
    fi
    echo "👋 Goodbye!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# --- 4. Start the C++ Simulator ---
echo "🚀 Starting Simulator..."
cd "$SIM_DIR"
./build/AutonomousVehicleSimulator &
SIM_PID=$!
echo "   Simulator PID: $SIM_PID"

# --- 5. Start the Dashboard Server ---
echo "🌐 Starting Dashboard Server..."
cd "$DASH_DIR"
node server.js &
SERVER_PID=$!
echo "   Server PID: $SERVER_PID"

# Wait for server to start
sleep 2

# --- 6. Open the Dashboard in Browser ---
echo ""
echo "============================================"
echo "  ✅ Everything is running!"
echo ""
echo "  🎮 Simulator: Running (graphical window)"
echo "  📊 Dashboard: http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop everything."
echo "============================================"
echo ""

open "http://localhost:3000"

# Keep script alive until user presses Ctrl+C
wait
