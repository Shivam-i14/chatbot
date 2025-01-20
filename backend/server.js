require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chatbot'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

// API endpoint for sending messages
app.post('/api/message', (req, res) => {
  const { userMessage } = req.body;

  // Validate input
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Simple response logic
  let botResponse = 'I don\'t understand that.';

  if (userMessage.toLowerCase() === 'hii') {
    botResponse = 'Hello!';
  } else if (userMessage.toLowerCase() === 'how are you') {
    botResponse = 'what is your first name';
  } else if (userMessage.toLowerCase() === 'shivam'){
    botResponse = 'last name';
  } else if (userMessage.toLowerCase() === 'pathak'){
    botResponse ='thankyou for response'
  }

  // Store the message and response in the database
  const query = 'INSERT INTO chat_history (user_message, bot_response) VALUES (?, ?)';
  db.query(query, [userMessage, botResponse], (err, result) => {
    if (err) {
      console.error('Error storing message:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Send response back to the client
    res.json({ botResponse });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
