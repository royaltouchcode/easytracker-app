const { Pool } = require('pg');
const Redis = require('ioredis');

// =========================================================================
// 1. ERP & BUSINESS DATABASE POOL (PostgreSQL 16)
// =========================================================================
const erpPool = new Pool({
  host: process.env.ERP_DB_HOST || 'localhost',
  port: parseInt(process.env.ERP_DB_PORT || '5432', 10),
  database: process.env.ERP_DB_NAME || 'easytracker_erp',
  user: process.env.ERP_DB_USER || 'erp_admin',
  password: process.env.ERP_DB_PASS || 'EasyTracker_ERP_Secret2026!',
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// =========================================================================
// 2. TELEMETRY DATA PLANE POOL (TimescaleDB / PostgreSQL 16)
// =========================================================================
const telemetryPool = new Pool({
  host: process.env.TELEMETRY_DB_HOST || 'localhost',
  port: parseInt(process.env.TELEMETRY_DB_PORT || '5433', 10),
  database: process.env.TELEMETRY_DB_NAME || 'easytracker_telemetry',
  user: process.env.TELEMETRY_DB_USER || 'telemetry_admin',
  password: process.env.TELEMETRY_DB_PASS || 'EasyTracker_Telemetry_Secret2026!',
  max: 50,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// =========================================================================
// 3. IN-MEMORY HOT POSITION CACHE (Redis 7)
// =========================================================================
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'EasyTracker_Redis_Secret2026!',
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  }
});

erpPool.on('error', (err) => console.error('❌ ERP DB Pool Error:', err));
telemetryPool.on('error', (err) => console.error('❌ Telemetry DB Pool Error:', err));
redisClient.on('error', (err) => console.error('❌ Redis Cache Error:', err));
redisClient.on('connect', () => console.log('✅ Redis 7 Cache Connected Successfully'));

module.exports = {
  erpPool,
  telemetryPool,
  redisClient
};
