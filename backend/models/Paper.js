const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [String],
  abstract: String, // changed from abstract to match your controller
  source: { type: String, enum: ['arXiv', 'github'], required: true },
  url: { type: String, required: true },
  stars: Number,         // GitHub only
  language: String,      // GitHub only
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Paper', paperSchema);
