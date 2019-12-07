// Load Environment
require('dotenv').config();

const isProd = process.env.ENV == 'PROD'
const ENV = {
	env: process.env.ENV || 'TEST',
	port: process.env.PORT || 5000,
	mongoURI: isProd ? process.env.MONGODB_URI : process.env.MONGODB_TEST_URI,
	jwtSecret: isProd ? process.env.JWT_SECRET : process.env.JWT_SECRET_TEST,
	clientSecret: isProd ? process.env.CLIENT_SECRET : process.env.CLIENT_SECRET_TEST
}

module.exports = ENV