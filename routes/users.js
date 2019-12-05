const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const uuid = require('uuid/v4');

// Load User model
const User = require('../models/User');

// Load Input Validation
const validateRegisterInput = require('../validations/register');

// @route   POST api/users/register
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

module.exports = router;