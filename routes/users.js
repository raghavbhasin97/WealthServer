const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const env = require('../config/env');

// Load User model
const User = require('../models/User');

// Load Input Validation
const validateRegisterInput = require('../validations/register');
const validateLoginInput = require('../validations/login');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(201).send('User created'))
            .catch(err => res.status(400).json({'save': 'Error adding user.'}));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / return JWT
// @access  Public
router.get('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;

  User
    .findOne({email})
    .then( user => {
      // Check for user
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check Password
      bcrypt
        .compare(req.body.password, user.password)
        .then(isMatch =>{
            if (isMatch) {
              // Token payload
              const payload = {id: user.id}

              // Sign Token
              jwt.sign(
                payload, 
                env.jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({'token': 'Bearer ' + token})
                }
              );

            } else {
              errors.password = 'Password incorrect';
              return res.status(400).json(errors);
            }
        });
    });

});

module.exports = router;