//loginController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

exports.LogInAccount = async (req, res) => {
  const { email, password } = req.body;

  // Check the user's username in the database
  db.query('SELECT * FROM accounts WHERE email = ?', [email], async (err, rows) => {
    if (err) {
      console.error('Error checking user credentials:', err);
      return res.status(500).json({ message: 'Error checking credentials.' });
    }
    
    // Check if any user was returned
    if (rows.length === 0) {
      // Avoid revealing that the username does not exist
      return res.status(401).json({ message: 'Invalid credentials 1.' });
    }

    const accounts = rows[0];
    // Compare provided password with the hashed password
    const match = await bcrypt.compare(password, accounts.password);
    if (!match) {
      // Avoid revealing that the password was incorrect
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    // Create a token with the user role
    const token = jwt.sign(
      { accountsId: accounts.id, accounts: accounts.email, role: accounts.role },
      jwtSecret, // Use an environment variable for the secret key
      { expiresIn: '24h' }
    );

    // Authentication successful, return the token and user data
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      accounts: {
        id: accounts.id,
        username: accounts.username,
        role: accounts.role
      }
    });
  });
};
