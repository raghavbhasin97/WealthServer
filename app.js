const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/users');

// Load Environment
const env = require('./config/env');

// Start the app.
const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
	.connect(
		env.mongoURI, 
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

app
	.listen(
		env.port, 
		() => { console.log(`Server running on port ${env.port}`) }
	)

module.exports = app; // for testing