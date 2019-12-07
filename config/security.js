const env = require('./env');

module.exports = (req, res, next) => {
	if (req.body.key == env.clientSecret) { 
		return next(null)
	}
	res.status(401).send('Unauthorized')
};