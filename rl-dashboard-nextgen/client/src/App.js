import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

/* ─── Animations ─── */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.15); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.3); }
`;

const pulseRing = keyframes`
  0% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ─── Layout ─── */
const Container = styled.div`
  min-height: 100vh;
  background: #07070f;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 80%, rgba(244, 63, 94, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(7, 7, 15, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
`;

const Title = styled.h1`
  font-size: 1.4em;
  margin: 0;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
  
  span {
    color: #818cf8;
    font-weight: 400;
    margin-left: 6px;
    font-size: 0.75em;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.1))' 
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.$active ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'};
  color: ${props => props.$active ? '#34d399' : '#f87171'};
`;

const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? '#34d399' : '#f87171'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid ${props => props.$active ? '#34d399' : '#f87171'};
    animation: ${props => props.$active ? css`${pulseRing} 2s ease-out infinite` : 'none'};
  }
`;

const TimeBadge = styled.div`
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.78em;
  font-family: 'JetBrains Mono', monospace;
  color: #94a3b8;
`;

/* ─── Dashboard Body ─── */
const DashboardBody = styled.div`
  position: relative;
  z-index: 1;
  padding: 28px 32px 60px;
  max-width: 1520px;
  margin: 0 auto;
`;

/* ─── Metric Cards ─── */
const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 28px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
    animation: ${glow} 2s ease-in-out infinite;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$accent || 'linear-gradient(90deg, #6366f1, #8b5cf6)'};
    opacity: 0.8;
  }
`;

const MetricIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  font-size: 18px;
  background: ${props => props.$bg || 'rgba(99, 102, 241, 0.12)'};
  color: ${props => props.$color || '#818cf8'};
`;

const MetricLabel = styled.div`
  font-size: 0.72em;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

const MetricValue = styled.div`
  font-size: 1.75em;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  color: #f1f5f9;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

const MetricSub = styled.div`
  font-size: 0.7em;
  color: #475569;
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
`;

/* ─── Chart Section ─── */
const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
  
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 0.95em;
  font-weight: 600;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  
  .material-symbols-rounded {
    font-size: 20px;
    color: ${props => props.$iconColor || '#818cf8'};
  }
`;

const CardBadge = styled.span`
  font-size: 0.7em;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(99, 102, 241, 0.1);
  color: #a5b4fc;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
`;

/* ─── Bottom Grid ─── */
const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Canvas / Map ─── */
const MapCanvas = styled.canvas`
  width: 100%;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

/* ─── Sensors ─── */
const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
`;

const SensorItem = styled.div`
  text-align: center;
  padding: 14px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: 1px solid ${props => {
    const v = props.$val;
    if (v < 0.3) return 'rgba(239, 68, 68, 0.4)';
    if (v < 0.6) return 'rgba(251, 191, 36, 0.3)';
    return 'rgba(16, 185, 129, 0.3)';
  }};
  transition: all 0.3s ease;
  
  &:nth-child(5) {
    grid-column: 1 / -1;
  }
`;

const SensorLabel = styled.div`
  font-size: 0.68em;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`;

const SensorVal = styled.div`
  font-size: 1.3em;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: ${props => {
    const v = props.$val;
    if (v < 0.3) return '#f87171';
    if (v < 0.6) return '#fbbf24';
    return '#34d399';
  }};
`;

/* ─── Vehicle State Cards ─── */
const VehicleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const VStateItem = styled.div`
  padding: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const VLabel = styled.div`
  font-size: 0.65em;
  font-weight: 500;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;

const VValue = styled.div`
  font-size: 1.15em;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #e2e8f0;
`;

/* ─── Loading State ─── */
const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #07070f;
  gap: 24px;
`;

const LoadingOrb = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  background-size: 200% 200%;
  animation: ${gradientShift} 3s ease infinite, ${float} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 0 60px rgba(99, 102, 241, 0.3);
`;

const LoadingText = styled.div`
  font-size: 1.1em;
  font-weight: 500;
  color: #94a3b8;
`;

const LoadingSub = styled.div`
  font-size: 0.8em;
  color: #475569;
  font-family: 'JetBrains Mono', monospace;
`;

/* ─── Custom Tooltip ─── */
const TooltipBox = styled.div`
  background: rgba(15, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 12px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75em;
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <div style={{ color: '#94a3b8', marginBottom: 6 }}>Episode {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </TooltipBox>
  );
};

/* ────────────────────── APP ────────────────────── */

const App = () => {
  const [state, setState] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [episodeHistory, setEpisodeHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [clock, setClock] = useState(new Date());
  const ws = useRef(null);
  const canvasRef = useRef(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'state_update') {
        setState(msg.data);
      } else if (msg.type === 'init') {
        setState(msg.data);
        setRewardHistory(msg.rewardHistory || []);
        setEpisodeHistory(msg.episodeHistory || []);
      } else if (msg.type === 'history') {
        setRewardHistory(msg.rewardHistory || []);
        setEpisodeHistory(msg.episodeHistory || []);
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
          window.location.reload();
        }
      }, 3000);
    };

    ws.current.onerror = () => setConnected(false);
    return () => { if (ws.current) ws.current.close(); };
  }, []);

  // Canvas drawing
  const drawEnvironment = useCallback(() => {
    if (!canvasRef.current || !state) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
    for (let x = 0; x < w; x += 30) {
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const scale = Math.min(w / 800, h / 600);
    const pos = state.position;
    const vx = (pos?.x || 0) * scale;
    const vy = (pos?.y || 0) * scale;
    const angle = (state.angle || 0) * (Math.PI / 180);
    const sensors = state.sensors || {};

    // Sensor beams (glow)
    const sensorConfig = [
      { key: 'front', offset: 0 },
      { key: 'front_left', offset: -Math.PI / 4 },
      { key: 'front_right', offset: Math.PI / 4 },
      { key: 'left', offset: -Math.PI / 2 },
      { key: 'right', offset: Math.PI / 2 },
    ];

    sensorConfig.forEach(({ key, offset }) => {
      const dist = 120 * (sensors[key] || 0);
      const sAngle = angle + offset;
      const endX = vx + dist * Math.cos(sAngle);
      const endY = vy + dist * Math.sin(sAngle);
      
      const val = sensors[key] || 0;
      let color;
      if (val < 0.3) color = 'rgba(239, 68, 68, 0.5)';
      else if (val < 0.6) color = 'rgba(251, 191, 36, 0.4)';
      else color = 'rgba(16, 185, 129, 0.4)';

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Endpoint dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vehicle outer glow
    const glowGrad = ctx.createRadialGradient(vx, vy, 0, vx, vy, 30);
    glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(vx, vy, 30, 0, Math.PI * 2);
    ctx.fill();

    // Vehicle body
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(vx, vy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright dot
    ctx.fillStyle = '#c7d2fe';
    ctx.beginPath();
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Direction arrow
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx + 22 * Math.cos(angle), vy + 22 * Math.sin(angle));
    ctx.stroke();

    // Arrow head
    const headLen = 7;
    const hAngle1 = angle + Math.PI * 0.8;
    const hAngle2 = angle - Math.PI * 0.8;
    const tipX = vx + 22 * Math.cos(angle);
    const tipY = vy + 22 * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + headLen * Math.cos(hAngle1), tipY + headLen * Math.sin(hAngle1));
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + headLen * Math.cos(hAngle2), tipY + headLen * Math.sin(hAngle2));
    ctx.stroke();

    // Speed indicator text
    ctx.fillStyle = '#64748b';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`SPD: ${(state.speed || 0).toFixed(2)}`, 10, h - 10);
    ctx.fillText(`ANG: ${(state.angle || 0).toFixed(1)}°`, w - 90, h - 10);

  }, [state]);

  useEffect(() => { drawEnvironment(); }, [drawEnvironment]);

  // Radar data for sensors
  const sensorRadarData = state ? [
    { sensor: 'Front', value: (state.sensors?.front || 0) * 100 },
    { sensor: 'F-Left', value: (state.sensors?.front_left || 0) * 100 },
    { sensor: 'Left', value: (state.sensors?.left || 0) * 100 },
    { sensor: 'Right', value: (state.sensors?.right || 0) * 100 },
    { sensor: 'F-Right', value: (state.sensors?.front_right || 0) * 100 },
  ] : [];

  /* ─── Loading Screen ─── */
  if (!state) {
    return (
      <LoadingContainer>
        <LoadingOrb>🏎️</LoadingOrb>
        <LoadingText>{connected ? 'Waiting for simulator data...' : 'Connecting to server...'}</LoadingText>
        <LoadingSub>{connected ? 'Start the C++ simulator to begin training' : 'Make sure the server is running on port 3000'}</LoadingSub>
      </LoadingContainer>
    );
  }

  const getRewardColor = (r) => r >= 0 ? '#34d399' : '#f87171';

  return (
    <Container>
      {/* ─── Header ─── */}
      <Header>
        <LogoArea>
          <LogoIcon>
            <span className="material-symbols-rounded" style={{ fontSize: 22, color: '#fff' }}>neurology</span>
          </LogoIcon>
          <Title>
            Neural Drive<span>RL Dashboard</span>
          </Title>
        </LogoArea>
        <HeaderRight>
          <TimeBadge>
            {clock.toLocaleTimeString('en-US', { hour12: false })}
          </TimeBadge>
          <StatusBadge $active={connected}>
            <PulseDot $active={connected} />
            {connected ? 'Live' : 'Offline'}
          </StatusBadge>
        </HeaderRight>
      </Header>

      <DashboardBody>
        {/* ─── Metrics Row ─── */}
        <MetricsRow>
          <MetricCard $accent="linear-gradient(90deg, #6366f1, #818cf8)">
            <MetricIcon $bg="rgba(99,102,241,0.12)" $color="#818cf8">
              <span className="material-symbols-rounded">repeat</span>
            </MetricIcon>
            <MetricLabel>Episode</MetricLabel>
            <MetricValue>{Math.floor(state.episode || 0)}</MetricValue>
            <MetricSub>training cycle</MetricSub>
          </MetricCard>

          <MetricCard $accent="linear-gradient(90deg, #8b5cf6, #a78bfa)">
            <MetricIcon $bg="rgba(139,92,246,0.12)" $color="#a78bfa">
              <span className="material-symbols-rounded">steps</span>
            </MetricIcon>
            <MetricLabel>Step</MetricLabel>
            <MetricValue>{Math.floor(state.step || 0)}</MetricValue>
            <MetricSub>/ 500 max</MetricSub>
          </MetricCard>

          <MetricCard $accent={`linear-gradient(90deg, ${getRewardColor(state.total_reward)}, ${getRewardColor(state.total_reward)}88)`}>
            <MetricIcon 
              $bg={state.total_reward >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'} 
              $color={getRewardColor(state.total_reward)}
            >
              <span className="material-symbols-rounded">emoji_events</span>
            </MetricIcon>
            <MetricLabel>Reward</MetricLabel>
            <MetricValue style={{ color: getRewardColor(state.total_reward) }}>
              {(state.total_reward || 0).toFixed(1)}
            </MetricValue>
            <MetricSub>cumulative</MetricSub>
          </MetricCard>

          <MetricCard $accent="linear-gradient(90deg, #10b981, #34d399)">
            <MetricIcon $bg="rgba(16,185,129,0.12)" $color="#34d399">
              <span className="material-symbols-rounded">explore</span>
            </MetricIcon>
            <MetricLabel>Epsilon</MetricLabel>
            <MetricValue>{(state.epsilon || 0).toFixed(4)}</MetricValue>
            <MetricSub>exploration rate</MetricSub>
          </MetricCard>

          <MetricCard $accent="linear-gradient(90deg, #f59e0b, #fbbf24)">
            <MetricIcon $bg="rgba(245,158,11,0.12)" $color="#fbbf24">
              <span className="material-symbols-rounded">trending_up</span>
            </MetricIcon>
            <MetricLabel>Avg Reward</MetricLabel>
            <MetricValue style={{ color: getRewardColor(state.avg_reward) }}>
              {(state.avg_reward || 0).toFixed(1)}
            </MetricValue>
            <MetricSub>last 50 episodes</MetricSub>
          </MetricCard>

          <MetricCard $accent={`linear-gradient(90deg, ${state.collisions > 0 ? '#ef4444' : '#10b981'}, ${state.collisions > 0 ? '#f87171' : '#34d399'})`}>
            <MetricIcon 
              $bg={state.collisions > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'} 
              $color={state.collisions > 0 ? '#f87171' : '#34d399'}
            >
              <span className="material-symbols-rounded">{state.collisions > 0 ? 'car_crash' : 'verified_user'}</span>
            </MetricIcon>
            <MetricLabel>Collisions</MetricLabel>
            <MetricValue style={{ color: state.collisions > 0 ? '#f87171' : '#34d399' }}>
              {Math.floor(state.collisions || 0)}
            </MetricValue>
            <MetricSub>{state.collisions > 0 ? 'episode ended' : 'no crash'}</MetricSub>
          </MetricCard>
        </MetricsRow>

        {/* ─── Charts ─── */}
        <ChartsRow>
          <Card>
            <CardHeader>
              <CardTitle $iconColor="#818cf8">
                <span className="material-symbols-rounded">show_chart</span>
                Reward Trend
              </CardTitle>
              <CardBadge>{rewardHistory.length} episodes</CardBadge>
            </CardHeader>
            {rewardHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={rewardHistory.slice(-80)}>
                  <defs>
                    <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="episode" stroke="#334155" tick={{ fill: '#475569', fontSize: 10 }} />
                  <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="reward" stroke="#6366f1" fill="url(#rewardGrad)" name="Reward" dot={false} strokeWidth={2} />
                  <Area type="monotone" dataKey="avgReward" stroke="#a855f7" fill="url(#avgGrad)" name="Avg Reward" dot={false} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                Waiting for episode data...
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle $iconColor="#34d399">
                <span className="material-symbols-rounded">psychology</span>
                Exploration vs Exploitation
              </CardTitle>
              <CardBadge>epsilon decay</CardBadge>
            </CardHeader>
            {rewardHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={rewardHistory.slice(-80)}>
                  <defs>
                    <linearGradient id="epsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="episode" stroke="#334155" tick={{ fill: '#475569', fontSize: 10 }} />
                  <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 10 }} domain={[0, 1]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="epsilon" stroke="#10b981" fill="url(#epsGrad)" name="Epsilon" dot={false} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                Waiting for episode data...
              </div>
            )}
          </Card>
        </ChartsRow>

        {/* ─── Bottom: Map + Sensors + Vehicle ─── */}
        <BottomGrid>
          {/* Environment Map */}
          <Card>
            <CardHeader>
              <CardTitle $iconColor="#f59e0b">
                <span className="material-symbols-rounded">map</span>
                Environment Map
              </CardTitle>
              <CardBadge>live view</CardBadge>
            </CardHeader>
            <MapCanvas ref={canvasRef} width={500} height={350} />
          </Card>

          {/* Sensor Readings with Radar */}
          <Card>
            <CardHeader>
              <CardTitle $iconColor="#ec4899">
                <span className="material-symbols-rounded">sensors</span>
                Sensor Array
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={sensorRadarData} outerRadius={70}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="sensor" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Distance" dataKey="value" stroke="#818cf8" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <SensorGrid>
              {[
                { key: 'front', label: 'Front' },
                { key: 'left', label: 'Left' },
                { key: 'right', label: 'Right' },
                { key: 'front_left', label: 'F-Left' },
                { key: 'front_right', label: 'F-Right' },
              ].map(s => {
                const val = state.sensors?.[s.key] || 0;
                return (
                  <SensorItem key={s.key} $val={val}>
                    <SensorLabel>{s.label}</SensorLabel>
                    <SensorVal $val={val}>{val.toFixed(2)}</SensorVal>
                  </SensorItem>
                );
              })}
            </SensorGrid>
          </Card>

          {/* Vehicle State */}
          <Card>
            <CardHeader>
              <CardTitle $iconColor="#f87171">
                <span className="material-symbols-rounded">directions_car</span>
                Vehicle Telemetry
              </CardTitle>
            </CardHeader>
            <VehicleGrid>
              <VStateItem>
                <VLabel>Position X</VLabel>
                <VValue>{(state.position?.x || 0).toFixed(1)}</VValue>
              </VStateItem>
              <VStateItem>
                <VLabel>Position Y</VLabel>
                <VValue>{(state.position?.y || 0).toFixed(1)}</VValue>
              </VStateItem>
              <VStateItem>
                <VLabel>Speed</VLabel>
                <VValue style={{ color: state.speed >= 0 ? '#34d399' : '#f87171' }}>
                  {(state.speed || 0).toFixed(3)}
                </VValue>
              </VStateItem>
              <VStateItem>
                <VLabel>Angle</VLabel>
                <VValue>{(state.angle || 0).toFixed(1)}°</VValue>
              </VStateItem>
              <VStateItem>
                <VLabel>Steering</VLabel>
                <VValue>{(state.steering || 0).toFixed(3)}</VValue>
              </VStateItem>
              <VStateItem>
                <VLabel>Action</VLabel>
                <VValue style={{ 
                  color: state.last_action === 'ACCELERATE' ? '#34d399' 
                    : state.last_action === 'BRAKE' ? '#f87171' 
                    : state.last_action === 'TURN_LEFT' || state.last_action === 'TURN_RIGHT' ? '#fbbf24'
                    : '#818cf8',
                  fontSize: '0.95em'
                }}>
                  {state.last_action || 'IDLE'}
                </VValue>
              </VStateItem>
            </VehicleGrid>
            
            {/* Q-Learning Info */}
            <div style={{ 
              marginTop: 14, 
              padding: '14px', 
              background: 'rgba(99,102,241,0.06)', 
              borderRadius: 12, 
              border: '1px solid rgba(99,102,241,0.12)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 16, color: '#818cf8' }}>model_training</span>
                <span style={{ fontSize: '0.72em', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Q-Learning Status</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <VLabel>Algorithm</VLabel>
                  <VValue style={{ fontSize: '0.85em', color: '#a5b4fc' }}>Q-Learning</VValue>
                </div>
                <div>
                  <VLabel>State Space</VLabel>
                  <VValue style={{ fontSize: '0.85em', color: '#a5b4fc' }}>1024</VValue>
                </div>
                <div>
                  <VLabel>Actions</VLabel>
                  <VValue style={{ fontSize: '0.85em', color: '#a5b4fc' }}>5</VValue>
                </div>
                <div>
                  <VLabel>Discount (γ)</VLabel>
                  <VValue style={{ fontSize: '0.85em', color: '#a5b4fc' }}>0.99</VValue>
                </div>
              </div>
            </div>
          </Card>
        </BottomGrid>
      </DashboardBody>
    </Container>
  );
};

export default App;
