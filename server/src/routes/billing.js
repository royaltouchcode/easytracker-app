const express = require('express');
const { erpPool } = require('../config/db');

const router = express.Router();

// 1. Create bKash Payment URL / Intent
router.post('/bkash/create-payment', async (req, res) => {
  const { userId, vehicleId, amountBdt, planName = 'Monthly GPS Telematics' } = req.body;

  try {
    const paymentID = 'BKASH_' + Date.now();
    const expiryDate = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days validity

    const result = await erpPool.query(
      `INSERT INTO subscriptions (user_id, vehicle_id, plan_name, amount_bdt, payment_method, mfs_trx_id, payment_status, expiry_date)
       VALUES ($1, $2, $3, $4, 'bkash', $5, 'pending', $6)
       RETURNING *`,
      [userId, vehicleId, planName, amountBdt || 350.00, paymentID, expiryDate]
    );

    res.json({
      success: true,
      paymentID,
      amount: amountBdt || 350.00,
      bkashURL: `https://checkout.pay.bka.sh/v1.2.0-beta/checkout/${paymentID}`,
      subscription: result.rows[0]
    });
  } catch (err) {
    console.error('bKash create payment error:', err);
    res.status(500).json({ success: false, error: 'বিকাশ পেমেন্ট শুরু করা যায়নি' });
  }
});

// 2. bKash Callback / Instant IPN Webhook
router.post('/bkash/callback', async (req, res) => {
  const { paymentID, trxID, status } = req.body;

  if (status === 'success' || status === 'Completed') {
    try {
      await erpPool.query(
        `UPDATE subscriptions 
         SET payment_status = 'paid', mfs_trx_id = $1 
         WHERE mfs_trx_id = $2`,
        [trxID || 'TRX_' + Date.now(), paymentID]
      );

      return res.json({ success: true, message: 'পেমেন্ট সফলভাবে গৃহীত হয়েছে!' });
    } catch (err) {
      console.error('bKash callback DB error:', err);
      return res.status(500).json({ success: false, error: 'ডাটাবেস আপডেট ব্যর্থ' });
    }
  }

  res.status(400).json({ success: false, error: 'পেমেন্ট সম্পন্ন হয়নি' });
});

// 3. BanglaQR & Nagad Payment Intent
router.post('/banglaqr/create', async (req, res) => {
  const { amountBdt, reference } = req.body;
  const qrString = `00020101021226580010com.bkash011501700000000520459995303050540${amountBdt}5802BD5914EASYTRACKER_GPS6005DHAKA62150511${reference}6304`;

  res.json({
    success: true,
    qrCodeString: qrString,
    amount: amountBdt,
    reference
  });
});

module.exports = router;
