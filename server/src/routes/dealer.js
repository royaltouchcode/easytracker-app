const express = require('express');
const { erpPool } = require('../config/db');

const router = express.Router();

// Get Dealer Paywall Quotas
router.get('/quotas', async (req, res) => {
  try {
    const result = await erpPool.query('SELECT * FROM seller_quotas ORDER BY created_at DESC');
    res.json({ success: true, quotas: result.rows });
  } catch (err) {
    console.error('Error fetching seller quotas:', err);
    res.status(500).json({ success: false, error: 'কোটা তথ্য লোড করা সম্ভব হয়নি' });
  }
});

// Update or Set Dealer Quota
router.post('/set-quota', async (req, res) => {
  const { sellerId, sellerName, assignedImeiLimit } = req.body;

  try {
    const result = await erpPool.query(
      `INSERT INTO seller_quotas (seller_id, seller_name, assigned_imei_limit, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (seller_id)
       DO UPDATE SET 
         seller_name = EXCLUDED.seller_name,
         assigned_imei_limit = EXCLUDED.assigned_imei_limit,
         paywall_locked = (seller_quotas.active_due_devices >= EXCLUDED.assigned_imei_limit),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [sellerId, sellerName, parseInt(assignedImeiLimit, 10)]
    );

    res.json({ success: true, quota: result.rows[0] });
  } catch (err) {
    console.error('Error updating quota:', err);
    res.status(500).json({ success: false, error: 'কোটা আপডেট ব্যর্থ হয়েছে' });
  }
});

module.exports = router;
