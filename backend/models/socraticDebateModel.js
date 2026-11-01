import mongoose from 'mongoose';

const argumentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    authorHandle: { type: String, default: 'reader' },
    authorAvatar: { type: String, default: '/images/eleanor-avatar.jpg' },
    stance: { type: String, enum: ['thesis', 'antithesis'], required: true },
    text: { type: String, required: true },
    votes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

argumentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
argumentSchema.set('toJSON', { virtuals: true });
argumentSchema.set('toObject', { virtuals: true });

const socraticDebateSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    book: {
      type: String,
      required: true,
    },
    motion: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: true,
    },
    thesisLabel: {
      type: String,
      default: 'Thesis: Aestheticism as Pure Spiritual Devotion',
    },
    antithesisLabel: {
      type: String,
      default: 'Antithesis: Aestheticism as Moral Decay & Cowardice',
    },
    thesisVotes: {
      type: [String],
      default: [],
    },
    antithesisVotes: {
      type: [String],
      default: [],
    },
    arguments: {
      type: [argumentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

socraticDebateSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
socraticDebateSchema.set('toJSON', { virtuals: true });
socraticDebateSchema.set('toObject', { virtuals: true });

export const SocraticDebate = mongoose.model('SocraticDebate', socraticDebateSchema);

