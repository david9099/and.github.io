import Database from 'better-sqlite3';

const db = new Database('restaurant.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);

// Insert default admin if not exists
const adminExists = db.prepare('SELECT 1 FROM admin_users WHERE username = ?').get('admin');
if (!adminExists) {
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', 'admin123');
}

export const createReservation = db.prepare(`
  INSERT INTO reservations (name, email, phone, date, special_requests)
  VALUES (@name, @email, @phone, @date, @special_requests)
`);

export const getRecentReservations = db.prepare(`
  SELECT * FROM reservations 
  ORDER BY created_at DESC 
  LIMIT 10
`);

export const validateAdmin = db.prepare(`
  SELECT id FROM admin_users 
  WHERE username = @username AND password_hash = @password_hash
`);

export default db;