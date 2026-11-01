import mongoose from 'mongoose';

const marginaliaSchema = new mongoose.Schema(
  {
    bookTitle: {
      type: String,
      required: true,
      trim: true,
    },
    bookAuthor: {
      type: String,
      default: 'Unknown Author',
    },
    chapter: {
      type: String,
      default: 'Chapter I',
    },
    quote: {
      type: String,
      required: true,
    },
    annotation: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorHandle: {
      type: String,
      default: 'reader',
    },
    authorAvatar: {
      type: String,
      default: '/images/eleanor-avatar.jpg',
    },
    authorEmail: {
      type: String,
      default: '',
    },
    parlourSlug: {
      type: String,
      default: 'gothic',
    },
    waxReactions: {
      profound: { type: [String], default: [] },
      poetic: { type: [String], default: [] },
      provocative: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

marginaliaSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
marginaliaSchema.set('toJSON', { virtuals: true });
marginaliaSchema.set('toObject', { virtuals: true });

export const Marginalia = mongoose.model('Marginalia', marginaliaSchema);

