import express from 'express';
import { validateAdmin, createReservation, getRecentReservations } from '../lib/db.js';

const app = express();
app.use(express.json());

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password_hash } = req.body;
  
  try {
    const user = validateAdmin.get({ username, password_hash });
    
    if (user) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create reservation endpoint
app.post('/api/reservations', (req, res) => {
  const { name, email, phone, date, special_requests } = req.body;
  
  try {
    createReservation.run({
      name,
      email,
      phone,
      date,
      special_requests
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Get recent reservations endpoint
app.get('/api/reservations', (req, res) => {
  try {
    const reservations = getRecentReservations.all();
    res.json(reservations);
  } catch (error) {
    console.error('Fetch reservations error:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});