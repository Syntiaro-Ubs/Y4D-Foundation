const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get impact data
router.get('/impact-data', async (req, res) => {
  try {
    const { region } = req.query;
    let query = 'SELECT id, beneficiaries, states, projects, region FROM impact_data WHERE 1=1';
    const params = [];

    if (region && region !== "all") {
      query += ` AND (region = ? OR region = 'both')`;
      params.push(region);
      query += ' ORDER BY CASE WHEN region = ? THEN 1 ELSE 2 END, id DESC LIMIT 1';
      params.push(region);
    } else {
      query += ' ORDER BY id ASC LIMIT 1';
    }

    const [results] = await db.execute(query, params);
    if (results.length > 0) {
      res.json({
        beneficiaries: results[0].beneficiaries,
        states: results[0].states,
        projects: results[0].projects
      });
    } else {
      res.json({
        beneficiaries: 15,
        states: 20,
        projects: 200
      });
    }
  } catch (error) {
    console.error('Error fetching impact data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update impact data (for admin dashboard)
router.put('/impact-data', async (req, res) => {
  try {
    const { beneficiaries, states, projects } = req.body;
    const impactRegion = req.body.region || req.query.region || 'both';

    const [existing] = await db.execute('SELECT id, beneficiaries, states, projects, region FROM impact_data WHERE region = ?', [impactRegion]);

    if (existing.length > 0) {
      await db.execute(
        'UPDATE impact_data SET beneficiaries = ?, states = ?, projects = ? WHERE region = ?',
        [beneficiaries, states, projects, impactRegion]
      );
    } else {
      await db.execute(
        'INSERT INTO impact_data (beneficiaries, states, projects, region) VALUES (?, ?, ?, ?)',
        [beneficiaries, states, projects, impactRegion]
      );
    }

    res.json({ message: 'Impact data updated successfully' });
  } catch (error) {
    console.error('Error updating impact data:', error);
    if (error.sqlMessage) console.error('SQL Error details:', error.sqlMessage);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;