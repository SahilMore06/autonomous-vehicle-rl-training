#!/bin/bash

# Autonomous Vehicle Simulator Launcher
# This script runs the RL simulator with virtual display support

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"
BINARY="$BUILD_DIR/AutonomousVehicleSimulator"

# Check if binary exists
if [ ! -f "$BINARY" ]; then
    echo "Error: Simulator binary not found at $BINARY"
    echo "Please build the simulator first using: cd $SCRIPT_DIR/build && cmake .. && make"
    exit 1
fi

# Check if xvfb-run is available
if ! command -v xvfb-run &> /dev/null; then
    echo "Error: xvfb-run not found. Installing xvfb..."
    sudo apt-get install -y xvfb
fi

echo "Starting Autonomous Vehicle Simulator..."
echo "Binary: $BINARY"
echo ""

# Run with virtual display
xvfb-run -a "$BINARY"

echo "Simulator stopped."
