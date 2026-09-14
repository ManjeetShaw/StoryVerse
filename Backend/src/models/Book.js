const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  // Matches the story service's ACTUAL response shape (its README is stale
  // and still describes an old "styleDescription" field that no longer exists).
  characterDescription: { type: String, default: '' },
  style: { type: String, default: 'comic_color' }, // one of: comic_color, comic_bw, storybook
  language: { type: String, default: 'English' },
  pageCount: { type: Number, required: true },
  coverImage: { type: String, default: '' },
  // Stored as-is from the story service response. Not normalized on purpose —
  // we only ever fetch whole books, never query inside individual pages.
  pages: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', bookSchema);
