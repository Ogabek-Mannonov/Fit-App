const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  trainer_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'TrainerProfile', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  title:       { type: String, required: true },
  description: { type: String },
  video_post:  { type: String },
  upload_date: { type: Date, default: Date.now },
  duration:    { type: Number },
  created_at:  { type: Date, default: Date.now },
  update_at:   { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video; 