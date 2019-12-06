const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/users');

// Load Environment
require('dotenv').config();

// Start the app.
const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.ENV == 'TEST' ? process.env.MONGODB_TEST_URI : process.env.MONGODB_URI
mongoose
	.connect(
		mongoURI, 
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch( err => console.log(`Problem connecting ${err}`))

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000

app
	.listen(
		port, 
		() => { console.log(`Server running on port ${port}`) }
	)

module.exports = app; // for testing