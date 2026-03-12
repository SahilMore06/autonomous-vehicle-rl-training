const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/', perMessageDeflate: false });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const STATE_FILE = path.join(__dirname, '..', 'autonomus', 'autonomous-rl-vehicle', 'simulator', 'state.json');

// Store for historical data
let rewardHistory = [];
let episodeHistory = [];
let currentState = null;
let connectedClients = new Set();

// Read state file
function readStateFile() {
  try {
    const data = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

// Broadcast state to all connected clients
function broadcastState(state) {
  const message = JSON.stringify({
    type: 'state_update',
    data: state,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  connectedClients.add(ws);

  // Send current state and history to new client
  ws.send(JSON.stringify({
    type: 'init',
    data: currentState,
    rewardHistory: rewardHistory.slice(-500),
    episodeHistory: episodeHistory.slice(-500)
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'request_history') {
        ws.send(JSON.stringify({
          type: 'history',
          rewardHistory: rewardHistory.slice(-500),
          episodeHistory: episodeHistory.slice(-500)
        }));
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    connectedClients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// Poll state file for changes
setInterval(() => {
  const state = readStateFile();
  if (state) {
    // Check if this is a new episode
    if (currentState && state.episode !== currentState.episode) {
      // New episode, store reward
      rewardHistory.push({
        episode: currentState.episode,
        reward: currentState.total_reward,
        avgReward: currentState.avg_reward,
        epsilon: currentState.epsilon
      });

      // Keep only last 1000 episodes
      if (rewardHistory.length > 1000) {
        rewardHistory = rewardHistory.slice(-1000);
      }
    }

    // Store episode data
    if (!currentState || state.step !== currentState.step) {
      episodeHistory.push({
        episode: state.episode,
        step: state.step,
        reward: state.total_reward,
        position: state.position,
        sensors: state.sensors,
        collisions: state.collisions
      });

      // Keep only last 500 steps
      if (episodeHistory.length > 500) {
        episodeHistory = episodeHistory.slice(-500);
      }
    }

    currentState = state;
    broadcastState(state);
  }
}, 1000); // Poll every second

// REST API endpoints
app.get('/api/state', (req, res) => {
  const state = readStateFile();
  res.json({
    state: state || {},
    rewardHistory: rewardHistory.slice(-200),
    episodeHistory: episodeHistory.slice(-200),
    clientCount: connectedClients.size
  });
});

app.get('/api/history', (req, res) => {
  res.json({
    rewards: rewardHistory.slice(-500),
    episodes: episodeHistory.slice(-500)
  });
});

app.get('/api/status', (req, res) => {
  const simulatorRunning = currentState !== null;
  res.json({
    simulatorRunning,
    connectedClients: connectedClients.size,
    lastUpdate: new Date().toISOString(),
    currentEpisode: currentState?.episode || 0
  });
});

// Serve React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RL Dashboard Server running on http://localhost:${PORT}`);
  console.log(`📊 WebSocket ready for real-time updates`);
  console.log(`📁 Reading state from: ${STATE_FILE}`);
});
