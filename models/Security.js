const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SecuritySchema = new Schema({
  symbol: {
    type: String,
    required: true
  },
  historicPrices: {
    type: [Number],
    required: true
  }
});

module.exports = Security = mongoose.model('securitys', SecuritySchema);