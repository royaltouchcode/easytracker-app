const express = require('express');
const { erpPool } = require('../config/db');

const router = express.Router();

// 1. Get Technician Ledgers
router.get('/ledgers', async (req, res) => {
  try {
    const result = await erpPool.query('SELECT * FROM technician_ledgers ORDER BY current_due_bdt DESC');
    res.json({ success: true, ledgers: result.rows });
  } catch (err) {
    console.error('Error fetching technician ledgers:', err);
    res.status(500).json({ success: false, error: 'লেজার ডাটা লোড হয়নি' });
  }
});

// 2. Create Job Card for Field Tech (Diagnostic Ephemeral Access Trigger)
router.post('/jobs/create', async (req, res) => {
  const { jobType, customerId, vehicleId, technicianId, assignedImei, commissionBdt } = req.body;
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

  try {
    const result = await erpPool.query(
      `INSERT INTO job_cards (job_type, customer_id, vehicle_id, technician_id, assigned_imei, otp_code, commission_earned_bdt, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'assigned')
       RETURNING *`,
      [jobType, customerId, vehicleId, technicianId, assignedImei, otpCode, commissionBdt || 500.00]
    );

    res.json({ success: true, job: result.rows[0] });
  } catch (err) {
    console.error('Job creation error:', err);
    res.status(500).json({ success: false, error: 'জব কার্ড তৈরি ব্যর্থ হয়েছে' });
  }
});

// 3. Verify Job Completion with Customer OTP & Credit Commission
router.post('/jobs/verify-otp', async (req, res) => {
  const { jobId, otpCode } = req.body;

  try {
    const jobResult = await erpPool.query('SELECT * FROM job_cards WHERE id = $1', [jobId]);
    if (jobResult.rows.length === 0) return res.status(404).json({ success: false, error: 'জব কার্ড পাওয়া যায়নি' });

    const job = jobResult.rows[0];
    if (job.otp_code !== otpCode) {
      return res.status(400).json({ success: false, error: 'ভুল ওটিপি (Invalid OTP)' });
    }

    // Update job status to verified
    await erpPool.query(
      `UPDATE job_cards SET status = 'verified', completed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [jobId]
    );

    // Credit Technician commission in ledger
    await erpPool.query(
      `UPDATE technician_ledgers 
       SET current_due_bdt = current_due_bdt + $1 
       WHERE technician_id = $2`,
      [job.commission_earned_bdt, job.technician_id]
    );

    res.json({
      success: true,
      message: '✅ জব সফলভাবে কাস্টমার কর্তৃক ভেরিফাই হয়েছে এবং টেকনিশিয়ানের একাউন্টে কমিশন জমা হয়েছে!'
    });
  } catch (err) {
    console.error('Job OTP verification error:', err);
    res.status(500).json({ success: false, error: 'ওটিপি ভেরিফিকেশন ব্যর্থ হয়েছে' });
  }
});

module.exports = router;
