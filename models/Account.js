const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  holdings: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

module.exports = Account = mongoose.model('accounts', AccountSchema);