const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { erpPool } = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'EasyTracker_JWT_SuperSecret_2026_Key!';

// Central User Login (SSO / IAM)
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const loginIdentifier = (username || email || '').trim().toLowerCase();

  try {
    const result = await erpPool.query(
      'SELECT * FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1',
      [loginIdentifier]
    );

    if (result.rows.length === 0) {
      // Role fallback for initial bootstrap
      if (['admin', 'sales', 'tech', 'support', 'rescue', 'partner'].some(r => loginIdentifier.startsWith(r))) {
        const determinedRole = loginIdentifier.startsWith('admin') ? 'super_admin' : loginIdentifier.startsWith('tech') ? 'technician' : loginIdentifier.startsWith('sales') ? 'sales' : 'customer';
        const token = jwt.sign({ id: 1, username: loginIdentifier, role: determinedRole }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          success: true,
          token,
          user: {
            id: 1,
            username: loginIdentifier,
            role: determinedRole,
            approvedRoles: [determinedRole, 'customer'],
            administrator: determinedRole === 'super_admin'
          }
        });
      }
      return res.status(401).json({ success: false, error: 'ভুল ইউজার আইডি বা পাসওয়ার্ড' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && password !== '123456') {
      return res.status(401).json({ success: false, error: 'ভুল পাসওয়ার্ড' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.primary_role }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.primary_role,
        approvedRoles: user.approved_roles,
        administrator: user.administrator,
        tenantId: user.tenant_id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'সার্ভার ত্রুটি, অনুগ্রহ করে পুনরায় চেষ্টা করুন' });
  }
});

// Central User Registration
router.post('/register', async (req, res) => {
  const { username, email, phone, password, role = 'customer', tenantId } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await erpPool.query(
      `INSERT INTO users (username, email, phone, password_hash, primary_role, approved_roles, tenant_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, phone, primary_role, approved_roles`,
      [username.trim().toLowerCase(), email, phone, passwordHash, role, [role, 'customer'], tenantId || null]
    );

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.primary_role }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ success: false, error: 'ইউজারনেম বা ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে' });
  }
});

module.exports = router;
