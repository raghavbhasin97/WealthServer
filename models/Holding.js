const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const HoldingSchema = new Schema({
  securityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  costBasis: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

module.exports = Holding = mongoose.model('holdings', HoldingSchema);