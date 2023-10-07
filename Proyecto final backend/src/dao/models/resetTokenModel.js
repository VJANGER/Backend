
const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  expires: Date,
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);
