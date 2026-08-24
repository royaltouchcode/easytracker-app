const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const telematicsRoutes = require('./routes/telematics');
const dealerRoutes = require('./routes/dealer');
const technicianRoutes = require('./routes/technician');
const billingRoutes = require('./routes/billing');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EasyTracker Multi-Tenant Telematics & ERP API Gateway',
    version: '2.0.0',
    scaleTarget: '2,000,000 Devices'
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/telematics', telematicsRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/billing', billingRoutes);

// Real-Time WebSocket Streaming for Live Telematics
wss.on('connection', (ws) => {
  console.log('📡 Client connected to Real-Time Telematics WebSocket Stream');

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      // Echo or handle client subscriptions
    } catch (e) {}
  });

  ws.on('close', () => console.log('Client disconnected from Telematics Stream'));
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 EasyTracker SaaS API Gateway running on port ${PORT}`);
  console.log(`📦 ERP PostgreSQL DB: Dedicated Business Plane`);
  console.log(`⏱️ Telemetry TimescaleDB: Dedicated Time-Series Plane`);
  console.log(`⚡ Redis 7 In-Memory Hot Position Cache: Active`);
  console.log(`=======================================================`);
});
