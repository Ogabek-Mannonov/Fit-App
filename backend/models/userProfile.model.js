const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name:       { type: String },
  lastname:   { type: String },
  bio:        { type: String },
  avatar:     { type: String },
  created_at: { type: Date, default: Date.now },
  update_at:  { type: Date, default: Date.now }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile; 