import mongoose from 'mongoose';

const literaryLetterSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderHandle: {
      type: String,
      default: 'reader',
    },
    senderAvatar: {
      type: String,
      default: '/images/eleanor-avatar.jpg',
    },
    senderEmail: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      default: 'A Dispatched Inscription from Kindred Hands',
    },
    body: {
      type: String,
      required: true,
    },
    waxSealColor: {
      type: String,
      default: '#7D2235', // Archival Burgundy
    },
    waxSealEmblem: {
      type: String,
      default: '❦', // Floral or quill
    },
    opened: {
      type: Boolean,
      default: false,
    },
    openedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

literaryLetterSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
literaryLetterSchema.set('toJSON', { virtuals: true });
literaryLetterSchema.set('toObject', { virtuals: true });

export const LiteraryLetter = mongoose.model('LiteraryLetter', literaryLetterSchema);
