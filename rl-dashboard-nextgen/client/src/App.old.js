import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a0f2e 100%);
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #ff006e;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(255, 0, 110, 0.2);
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin: 0;
  background: linear-gradient(135deg, #ff006e, #8338ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 50px;
  background: ${props => props.active ? 'rgba(0, 255, 100, 0.2)' : 'rgba(255, 0, 0, 0.2)'};
  border: 2px solid ${props => props.active ? '#00ff64' : '#ff0000'};
  font-weight: 600;
`;

const Pulse = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#00ff64' : '#ff0000'};
  animation: ${props => props.active ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Dashboard = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 0, 110, 0.3);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  &:hover {
    border-color: #ff006e;
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 0, 110, 0.2);
  }
`;

const MetricLabel = styled.label`
  display: block;
  font-size: 0.9em;
  color: #b0b0b0;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MetricValue = styled.div`
  font-size: 2.2em;
  font-weight: 700;
  background: linear-gradient(135deg, #ff006e, #8338ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 0, 110, 0.3);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.3em;
  color: #ff006e;
`;

const EnvironmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
`;

const EnvironmentCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 0, 110, 0.3);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Canvas = styled.canvas`
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
`;

const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const SensorItem = styled.div`
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 2px solid ${props => {
    const val = props.value;
    if (val < 0.3) return '#ff0000';
    if (val < 0.7) return '#ffaa00';
    return '#00ff64';
  }};
`;

const SensorName = styled.div`
  font-size: 0.85em;
  color: #b0b0b0;
  margin-bottom: 8px;
`;

const SensorValue = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  color: ${props => {
    const val = props.value;
    if (val < 0.3) return '#ff0000';
    if (val < 0.7) return '#ffaa00';
    return '#00ff64';
  }};
`;

const App = () => {
  const [state, setState] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [episodeHistory, setEpisodeHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'state_update') {
        setState(message.data);
      } else if (message.type === 'init') {
        setState(message.data);
        setRewardHistory(message.rewardHistory || []);
        setEpisodeHistory(message.episodeHistory || []);
      } else if (message.type === 'history') {
        setRewardHistory(message.rewardHistory || []);
        setEpisodeHistory(message.episodeHistory || []);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
          window.location.reload();
        }
      }, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Draw environment
  useEffect(() => {
    if (!canvasRef.current || !state) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 0, 110, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw vehicle
    const scale = Math.min(width / 800, height / 600);
    const pos = state.position;
    const vx = (typeof pos === 'object' ? pos.x || 0 : pos[0] || 0) * scale;
    const vy = (typeof pos === 'object' ? pos.y || 0 : pos[1] || 0) * scale;

    // Vehicle circle
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.arc(vx, vy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Vehicle direction indicator
    const angle = (state.angle || 0) * (Math.PI / 180);
    ctx.strokeStyle = '#8338ec';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + 20 * Math.cos(angle), vy + 20 * Math.sin(angle));
    ctx.stroke();

    // Draw sensors
    const sensors = state.sensors || {};
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.3)';
    ctx.lineWidth = 1;

    ['front', 'left', 'right'].forEach((sensor, idx) => {
      const sensorAngle = angle + (idx - 1) * (Math.PI / 4);
      const distance = 100 * (sensors[sensor] || 0);
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(
        vx + distance * Math.cos(sensorAngle),
        vy + distance * Math.sin(sensorAngle)
      );
      ctx.stroke();
    });
  }, [state]);

  if (!state) {
    return (
      <Container>
        <Header>
          <Title>🤖 RL Autonomous Vehicle Dashboard</Title>
          <StatusBadge active={connected}>
            <Pulse active={connected} />
            {connected ? 'WAITING FOR SIMULATOR' : 'DISCONNECTED'}
          </StatusBadge>
        </Header>
        <Dashboard>
          <MetricCard style={{ gridColumn: '1 / -1' }}>
            <MetricLabel>Status</MetricLabel>
            <MetricValue>{connected ? '⏳ Initializing...' : '❌ No Connection'}</MetricValue>
          </MetricCard>
        </Dashboard>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🤖 RL Autonomous Vehicle</Title>
        <StatusBadge active={connected}>
          <Pulse active={connected} />
          {connected ? 'LIVE' : 'OFFLINE'}
        </StatusBadge>
      </Header>

      <Dashboard>
        {/* Metrics Grid */}
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Episode</MetricLabel>
            <MetricValue>{Math.floor(state.episode || 0)}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Step</MetricLabel>
            <MetricValue>{Math.floor(state.step || 0)}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Reward</MetricLabel>
            <MetricValue>{(state.total_reward || 0).toFixed(2)}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Epsilon</MetricLabel>
            <MetricValue>{(state.epsilon || 0).toFixed(4)}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Avg Reward (50)</MetricLabel>
            <MetricValue>{(state.avg_reward || 0).toFixed(2)}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Collisions</MetricLabel>
            <MetricValue>{Math.floor(state.collisions || 0)}</MetricValue>
          </MetricCard>
        </MetricsGrid>

        {/* Charts */}
        <ChartsGrid>
          {rewardHistory.length > 0 && (
            <ChartCard>
              <ChartTitle>📈 Reward Trend</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rewardHistory.slice(-100)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 110, 0.2)" />
                  <XAxis stroke="#b0b0b0" />
                  <YAxis stroke="#b0b0b0" />
                  <Tooltip contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ff006e' }} />
                  <Legend />
                  <Line type="monotone" dataKey="reward" stroke="#ff006e" name="Reward" dot={false} />
                  <Line type="monotone" dataKey="avgReward" stroke="#8338ec" name="Avg" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {rewardHistory.length > 0 && (
            <ChartCard>
              <ChartTitle>📊 Epsilon Decay</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rewardHistory.slice(-100)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 110, 0.2)" />
                  <XAxis stroke="#b0b0b0" />
                  <YAxis stroke="#b0b0b0" />
                  <Tooltip contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px solid #ff006e' }} />
                  <Line type="monotone" dataKey="epsilon" stroke="#00ff64" name="Epsilon" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </ChartsGrid>

        {/* Environment */}
        <EnvironmentGrid>
          <EnvironmentCard>
            <ChartTitle>🎮 Environment Map</ChartTitle>
            <Canvas ref={canvasRef} width={400} height={300} />
          </EnvironmentCard>

          <EnvironmentCard>
            <ChartTitle>📡 Sensor Readings</ChartTitle>
            <SensorGrid>
              {['front', 'left', 'right', 'front_left', 'front_right'].map(sensor => (
                <SensorItem key={sensor} value={state.sensors?.[sensor] || 0}>
                  <SensorName>{sensor.replace('_', ' ')}</SensorName>
                  <SensorValue value={state.sensors?.[sensor] || 0}>
                    {(state.sensors?.[sensor] || 0).toFixed(2)}
                  </SensorValue>
                </SensorItem>
              ))}
            </SensorGrid>
          </EnvironmentCard>
        </EnvironmentGrid>

        {/* Vehicle State */}
        <ChartCard style={{ marginTop: '30px' }}>
          <ChartTitle>🚗 Vehicle State</ChartTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div>
              <SensorName>Position X</SensorName>
              <MetricValue>{(state.position?.x || 0).toFixed(2)}</MetricValue>
            </div>
            <div>
              <SensorName>Position Y</SensorName>
              <MetricValue>{(state.position?.y || 0).toFixed(2)}</MetricValue>
            </div>
            <div>
              <SensorName>Speed</SensorName>
              <MetricValue>{(state.speed || 0).toFixed(3)}</MetricValue>
            </div>
            <div>
              <SensorName>Angle</SensorName>
              <MetricValue>{(state.angle || 0).toFixed(2)}°</MetricValue>
            </div>
            <div>
              <SensorName>Steering</SensorName>
              <MetricValue>{(state.steering || 0).toFixed(3)}</MetricValue>
            </div>
            <div>
              <SensorName>Action</SensorName>
              <MetricValue>{state.last_action || 'IDLE'}</MetricValue>
            </div>
          </div>
        </ChartCard>
      </Dashboard>
    </Container>
  );
};

export default App;
