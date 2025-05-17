const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  video_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  author_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment_text: { type: String, required: true },
  created_at:   { type: Date, default: Date.now },
  update_at:    { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment; 