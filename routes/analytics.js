const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Record an analytics event
router.post('/events', async (req, res) => {
  try {
    const { event_type, event_data, user_id } = req.body;
    
    const { rows } = await db.query(`
      INSERT INTO analytics (event_type, event_data, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [event_type, event_data, user_id]);
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics summary (admin only)
router.get('/summary', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get summary data
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    const totalProducts = await db.query('SELECT COUNT(*) FROM products WHERE active = TRUE');
    const totalOrders = await db.query('SELECT COUNT(*) FROM orders');
    const totalRevenue = await db.query('SELECT SUM(total_amount) FROM orders WHERE status = \'completed\'');
    
    // Get recent orders
    const recentOrders = await db.query(`
      SELECT o.*, u.username 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.order_date DESC
      LIMIT 5
    `);
    
    // Get top products
    const topProducts = await db.query(`
      SELECT p.id, p.name, SUM(oi.quantity) as total_sold
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    
    // Get events per day
    const eventsPerDay = await db.query(`
      SELECT DATE(timestamp) as date, COUNT(*) as count
      FROM analytics
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(timestamp)
      ORDER BY date
    `);
    
    res.json({
      totalUsers: totalUsers.rows[0].count,
      totalProducts: totalProducts.rows[0].count,
      totalOrders: totalOrders.rows[0].count,
      totalRevenue: totalRevenue.rows[0].sum || 0,
      recentOrders: recentOrders.rows,
      topProducts: topProducts.rows,
      eventsPerDay: eventsPerDay.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get event breakdown by type (admin only)
router.get('/events/breakdown', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { rows } = await db.query(`
      SELECT event_type, COUNT(*) as count
      FROM analytics
      WHERE timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY event_type
      ORDER BY count DESC
    `);
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;