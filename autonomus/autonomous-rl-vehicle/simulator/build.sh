#!/bin/bash

# Build Script for Autonomous Vehicle Simulator

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"

echo "Building Autonomous Vehicle Simulator..."
echo "Source directory: $SCRIPT_DIR"
echo "Build directory: $BUILD_DIR"
echo ""

# Create build directory if it doesn't exist
if [ ! -d "$BUILD_DIR" ]; then
    echo "Creating build directory..."
    mkdir -p "$BUILD_DIR"
fi

# Run cmake and make
cd "$BUILD_DIR"
cmake .. && make

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Build successful!"
    echo "You can now run the simulator using: ./run_simulator.sh"
else
    echo ""
    echo "✗ Build failed!"
    exit 1
fi
