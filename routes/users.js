const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const uuid = require('uuid/v4');

// Load User model
const User = require('../models/User');

module.exports = router;