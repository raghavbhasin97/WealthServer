const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const env = require('../config/env');

// Load User model
const Holding = require('../models/Holding');

// Load Input Validation
const validateAddHoldings = require('../validations/addHoldings');


// @route   POST api/holdings
// @desc    Register user
// @access  Authorized

router.post(
	'/', 
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { errors, isValid } = validateAddHoldings(req.body);

		// Check Validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

		const newHolding = new Holding({
			securityId: req.body.securityId,
			costBasis: req.body.costBasis,
			quantity: req.body.quantity
		});

		newHolding
		.save()
		.then(holdings => res.status(201).send('Holdings created'))
		.catch(err => res.status(400).json({'save': 'Error adding holding.'}));
});

module.exports = router;