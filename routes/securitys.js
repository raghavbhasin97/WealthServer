const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4');
const env = require('../config/env');
const ensureProtected = require('../config/security')

// Load Security model
const Security = require('../models/Security');


// @route   POST api/security
// @desc    Add a security
// @access  Internal Only
router.post('/', ensureProtected, (req, res) => {
	Security.findOneAndUpdate(
		{symbol: req.body.symbol},
		{symbol: req.body.symbol, historicPrices: req.body.historicPrices},
		{ upsert : true },
		(err, security) => {
			if(err) {
				res.status(400).send('Failed to update security price.')
			} else {
				res.status(200).send('Updated')
			}
	});
});

module.exports = router;