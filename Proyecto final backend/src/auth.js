const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../dao/models/userModel');

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

res.redirect('/login');
} catch (error) {
  res.status(500).json({ error: 'An error occurred' });
}
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/github', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

module.exports = router;
