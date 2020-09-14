const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets.js');

const Users = require('./auth-model');

router.post('/register', validateUserInfo, (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then((saved) => {
      res.status(201).json({
        message: `User ${saved.username} successfully registered.`,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post('/login', validateUserInfo, (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // generate token
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token, //return the token upon login
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Generate Tokens

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '7d',
  };
  return jwt.sign(payload, jwtSecret, options);
}

// Middleware to ensure user inputs proper credentials

function validateUserInfo(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: 'Username, and Password fields are required.',
    });
  } else {
    next();
  }
}

module.exports = router;
