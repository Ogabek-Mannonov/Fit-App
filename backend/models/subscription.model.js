const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date:       { type: Date, required: true },
  end_date:         { type: Date },
  price:            { type: Number },
  status:           { type: String },
  subscription_type:{ type: String },
  created_at:       { type: Date, default: Date.now },
  update_at:        { type: Date, default: Date.now }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription; 