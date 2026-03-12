# Autonomous Vehicle RL Training & Dashboard

A complete system for training an autonomous vehicle using Reinforcement Learning (Q-Learning) with a real-time web-based dashboard.

## System Components

### 1. C++ SFML Simulator (`autonomus/`)
- **Location**: `/home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator/`
- **Binary**: `./build/AutonomousVehicleSimulator`
- **Language**: C++ with SFML 2D graphics
- **Purpose**: Trains a vehicle agent using Q-Learning to navigate and avoid obstacles
- **Output**: Real-time state saved to `state.json` (every episode)

### 2. React + Node.js Dashboard (`rl-dashboard-nextgen/`)
- **Location**: `/home/harsh/project-1/rl-dashboard-nextgen/`
- **Backend**: Node.js Express server with WebSocket support
- **Frontend**: React with Recharts and styled-components
- **Port**: 3000
- **Purpose**: Real-time visualization of training metrics and vehicle behavior

## Quick Start

### Prerequisites
- **C++**: Build tools, SFML library (already configured)
- **Node.js**: v18+ (already installed)
- **npm**: Package manager (included with Node.js)

### Step 1: Start the Simulator

```bash
cd /home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator
./build/AutonomousVehicleSimulator
```

**What it does:**
- Launches the Q-Learning training in a visual window
- Updates `state.json` every episode with current metrics
- Continues training indefinitely until you stop it (Ctrl+C)
- Episode metrics include: reward, epsilon, position, sensors, collisions

### Step 2: Start the Dashboard Backend

Open a **new terminal** and run:

```bash
cd /home/harsh/project-1/rl-dashboard-nextgen
npm start
```

**What it does:**
- Starts Node.js server on port 3000
- Reads `state.json` every 1 second
- Broadcasts state updates to connected clients via WebSocket
- Provides REST API at `http://localhost:3000/api/state`

### Step 3: View the Dashboard

Open your browser and go to:

```
http://localhost:3000
```

**You will see:**
- Real-time metrics cards (Episode, Step, Reward, Epsilon, Collisions)
- Interactive charts (Reward Trend, Epsilon Decay)
- Environment map showing vehicle position and sensors
- Live sensor readings (front, left, right sensors)

## System Architecture

```
Simulator (C++)
    ↓ (writes state.json every episode)
    ↓
state.json
    ↓ (polls every 1 second)
    ↓
Node.js Backend (server.js)
    ↓ (broadcasts via WebSocket)
    ↓
React Frontend
    ↓ (renders in browser)
    ↓
Dashboard @ localhost:3000
```

## File Structure

```
/home/harsh/project-1/
├── autonomus/                          (C++ Simulator)
│   └── autonomous-rl-vehicle/
│       └── simulator/
│           ├── build/
│           │   └── AutonomousVehicleSimulator  (executable)
│           ├── state.json                      (live state data)
│           ├── q_table.bin                     (Q-table)
│           └── main.cpp
│
└── rl-dashboard-nextgen/               (React + Node.js Dashboard)
    ├── server.js                       (Express + WebSocket backend)
    ├── package.json                    (Node.js dependencies)
    └── client/
        ├── src/
        │   └── App.js                  (React main component)
        ├── build/                      (production build)
        └── package.json                (React dependencies)
```

## API Endpoints

### REST API

**Get current state:**
```bash
curl http://localhost:3000/api/state
```

**Get historical data:**
```bash
curl http://localhost:3000/api/history
```

**Get server status:**
```bash
curl http://localhost:3000/api/status
```

### WebSocket

**Connection**: `ws://localhost:3000`
**Data updates**: Automatic push every ~1 second
**Message format**:
```json
{
  "type": "state_update",
  "data": {
    "episode": 514,
    "step": 501,
    "total_reward": -236.74,
    "epsilon": 0.05,
    "position": {"x": 415.93, "y": 249.90},
    "sensors": {...}
  }
}
```

## Troubleshooting

### Dashboard shows "Disconnected"
1. Verify Node.js server is running: `ps aux | grep "node server"`
2. Check port 3000 is listening: `ss -tuln | grep 3000`
3. Verify simulator is writing state.json: `cat /home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator/state.json`

### Simulator window is not visible
1. The simulator outputs to the real X display (`:0`)
2. On headless systems, use `DISPLAY=:0` or configure a virtual display

### No data showing in dashboard
1. Check WebSocket connection in browser console (F12)
2. Verify both processes are running
3. Restart Node.js server: `pkill -f "npm start"` then `npm start`

## Performance Tips

- **Simulator**: Runs at variable speed (depends on C++ performance)
- **Dashboard**: Updates every 1 second via WebSocket (minimal latency)
- **Storage**: State.json is ~2KB, history stored in memory (no database needed)

## Stopping the System

**Stop Simulator**: In simulator window, press Ctrl+C or close window
**Stop Dashboard**: In terminal, press Ctrl+C

## Configuration

### Change training parameters
Edit `/home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator/main.cpp` and recompile:
```bash
cd /home/harsh/project-1/autonomus/autonomous-rl-vehicle/simulator/build
make
```

### Change dashboard port
Edit `/home/harsh/project-1/rl-dashboard-nextgen/server.js` line ~160:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000 to desired port
```

### Change polling interval
Edit `/home/harsh/project-1/rl-dashboard-nextgen/server.js` line ~120:
```javascript
}, 1000); // Change 1000ms to desired interval
```

## Technologies Used

- **Simulator**: C++, SFML 2D
- **Algorithm**: Q-Learning (Reinforcement Learning)
- **Backend**: Node.js, Express, WebSocket
- **Frontend**: React, Recharts, styled-components
- **Communication**: WebSocket (real-time), REST API (fallback)

## Deployment

Want to share your dashboard with others? Deploy it to the cloud!

### Recommended Options
- **Railway** (free tier, easiest)
- **Vercel** (free, React optimized)
- **DigitalOcean** ($5/month, full control)
- **Heroku** ($7+/month)
- **Self-hosted** (any server)

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## Status

✅ System is fully operational and ready to use.
- Simulator: Running and training continuously
- Dashboard: Live at http://localhost:3000
- Deployment: Ready for cloud hosting (see DEPLOYMENT.md)
- No external dependencies or complex setup needed

For detailed training metrics, check the browser console (F12) for WebSocket messages.

---

## Quick Links

- 🔗 **GitHub Repository**: https://github.com/hhnaidu/autonomous-vehicle-rl-training
- 📝 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 **Issues**: Report on GitHub Issues
- 💬 **Discussions**: GitHub Discussions
