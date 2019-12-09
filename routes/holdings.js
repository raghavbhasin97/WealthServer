const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const env = require('../config/env');

// Load models
const Holding = require('../models/Holding');
const Security = require('../models/Security');
const Account = require('../models/Account');

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

		// Get security Id
		Security
			.findOne({symbol: req.body.security})
			.then(security => {
				const newHolding = new Holding({
					securityId: security._id,
					costBasis: req.body.costBasis,
					quantity: req.body.quantity
				});
				newHolding
					.save()
					.then(holding => {
						Account
						.findById(req.body.accountId)
						.then( account => {
							account.holdings.push(holding._id)
							Account.findOneAndUpdate(
								{_id: account._id},
								account,
								{upsert : false}
							)
							.then(_ => res.status(201).json(holding))
							.catch(_ => {
								console.log(`Failed to update account ${account}`)
								deleteHolding(holding)
									.then(_ => res.status(400).json({'save': 'Error adding holding.'}))
									.catch(_ => res.status(400).json({'save': 'Error adding holding.'}))
							})
						})
						.catch(_ => {
							console.log(`Failed to find account ${req.body.accountId}`)
							deleteHolding(holding)
								.then(_ => res.status(400).json({'save': 'Error adding holding.'}))
								.catch(_ => res.status(400).json({'save': 'Error adding holding.'}))
						})
					})
					.catch(_ => res.status(400).json({'save': 'Error adding holding.'}));
			})
			.catch(_ => res.status(404).json({'save': 'Invalid security'}))
});


function deleteHolding(holding, callback) {
	return Holding.deleteOne(holding)
}

module.exports = router;