import mongoose from 'mongoose';

const sprintParticipantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: '/images/eleanor-avatar.jpg' },
    email: { type: String, default: '' },
    currentBook: { type: String, default: 'Curated Classic' },
    joinedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const readingSprintSchema = new mongoose.Schema(
  {
    parlourSlug: {
      type: String,
      default: 'gothic',
      index: true,
    },
    parlourTitle: {
      type: String,
      default: 'The Gothic Study',
    },
    hostName: {
      type: String,
      required: true,
    },
    hostAvatar: {
      type: String,
      default: '/images/eleanor-avatar.jpg',
    },
    durationMinutes: {
      type: Number,
      default: 25,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 25 * 60 * 1000),
    },
    participants: {
      type: [sprintParticipantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

readingSprintSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
readingSprintSchema.set('toJSON', { virtuals: true });
readingSprintSchema.set('toObject', { virtuals: true });

export const ReadingSprint = mongoose.model('ReadingSprint', readingSprintSchema);
