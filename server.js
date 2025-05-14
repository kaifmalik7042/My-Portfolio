const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kaif@786',
  database: 'ContactUser'
});

// Database se connect karo
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// API endpoint for contact form
app.post('/api/contact', (req, res) => {
  const { name, email, number, profession, message } = req.body;
  
  // Basic validation
  if (!name || !email || !number || !profession || !message) {
    return res.status(400).json({ message: 'Please provide name, email and message' });
  }
  
  // SQL database mein data insert karo
  const query = 'INSERT INTO contacts (name, email, number, profession, message) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [name, email, number, profession, message], (err, result) => {
    if (err) {
      console.error('Error saving contact:', err);
      return res.status(500).json({ message: 'Error saving your message' });
    }
    
    console.log('Contact saved with ID:', result.insertId);
    res.status(201).json({ message: 'Message received successfully!', id: result.insertId });
  });
});

// HTML files serve karo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Server start karo
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});