import mongoose from 'mongoose';

const pastBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: String, default: '' },
  },
  { _id: false }
);

const parlourSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General Literature',
    },
    desc: {
      type: String,
      default: '',
    },
    longDesc: {
      type: String,
      default: '',
    },
    members: {
      type: Number,
      default: 1,
    },
    activeNow: {
      type: Number,
      default: 1,
    },
    curator: {
      type: String,
      default: 'Curator Admin',
    },
    curatorHandle: {
      type: String,
      default: 'admin_curator',
    },
    curatorAvatar: {
      type: String,
      default: '/images/eleanor-avatar.jpg',
    },
    img: {
      type: String,
      default: '/images/parlour-gothic.jpg',
    },
    currentBook: {
      type: String,
      default: 'Curated Classic',
    },
    currentBookAuthor: {
      type: String,
      default: 'Unknown Author',
    },
    currentBookCover: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    },
    currentChapter: {
      type: String,
      default: 'Chapter I: Opening Pages',
    },
    readingWeek: {
      type: String,
      default: 'Week 1 of 4 • 25% Canon Complete',
    },
    prompt: {
      type: String,
      default: 'What resonates most deeply with you in this chapter?',
    },
    meetingTime: {
      type: String,
      default: 'Weekly Gatherings at Dusk',
    },
    ambiancePreset: {
      type: String,
      enum: ['rain', 'fireplace', 'wind', 'off'],
      default: 'rain',
    },
    membersList: {
      type: [String],
      default: [],
    },
    pastBooks: {
      type: [pastBookSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for id mapped to slug
parlourSchema.virtual('id').get(function () {
  return this.slug;
});

parlourSchema.set('toJSON', { virtuals: true });
parlourSchema.set('toObject', { virtuals: true });

export const Parlour = mongoose.model('Parlour', parlourSchema);

