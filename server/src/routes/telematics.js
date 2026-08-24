const express = require('express');
const { telemetryPool, redisClient } = require('../config/db');

const router = express.Router();

// 1. Get Sub-millisecond Latest Positions from Redis Hot Cache
router.get('/positions/live', async (req, res) => {
  const { deviceId } = req.query;

  try {
    if (deviceId) {
      const cached = await redisClient.get(`pos:${deviceId}`);
      return res.json({ success: true, position: cached ? JSON.parse(cached) : null });
    }

    // Get all live positions
    const keys = await redisClient.keys('pos:*');
    if (keys.length === 0) return res.json({ success: true, positions: [] });

    const pipeline = redisClient.pipeline();
    keys.forEach(k => pipeline.get(k));
    const results = await pipeline.exec();

    const positions = results.map(([err, val]) => val ? JSON.parse(val) : null).filter(Boolean);
    res.json({ success: true, count: positions.length, positions });
  } catch (err) {
    console.error('Redis position fetch error:', err);
    res.status(500).json({ success: false, error: 'লোকেশন ক্যাশ লোড করা সম্ভব হয়নি' });
  }
});

// 2. High-Speed History Replay from TimescaleDB Data Plane
router.get('/history/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { from, to, limit = 500 } = req.query;

  try {
    const fromDate = from ? new Date(from) : new Date(Date.now() - 24 * 3600 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const query = `
      SELECT id, deviceid as "deviceId", protocol, servertime as "serverTime",
             devicetime as "deviceTime", fixtime as "fixTime", valid, latitude, longitude,
             altitude, speed, course, address, accuracy, attributes
      FROM tc_positions
      WHERE deviceid = $1 AND fixtime >= $2 AND fixtime <= $3
      ORDER BY fixtime ASC
      LIMIT $4
    `;

    const result = await telemetryPool.query(query, [deviceId, fromDate, toDate, parseInt(limit, 10)]);
    res.json({
      success: true,
      deviceId,
      totalPoints: result.rows.length,
      positions: result.rows
    });
  } catch (err) {
    console.error('TimescaleDB History query error:', err);
    res.status(500).json({ success: false, error: 'হিস্ট্রি ডাটা লোড ব্যর্থ হয়েছে' });
  }
});

// 3. Webhook from Traccar to ingest live position into Redis Cache instantly
router.post('/positions/webhook', async (req, res) => {
  const payload = req.body;
  if (!payload || !payload.deviceId) {
    return res.status(400).send('Invalid payload');
  }

  try {
    const key = `pos:${payload.deviceId}`;
    await redisClient.set(key, JSON.stringify(payload), 'EX', 86400 * 7); // Cache for 7 days
    res.status(200).send('Cached in Redis');
  } catch (err) {
    console.error('Webhook Redis caching error:', err);
    res.status(500).send('Redis error');
  }
});

module.exports = router;
