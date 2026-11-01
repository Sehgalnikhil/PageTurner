import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    handle: { type: String, default: 'reader' },
    avatar: { type: String, default: '/images/eleanor-avatar.jpg' },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Map comment virtual id
commentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const communityPostSchema = new mongoose.Schema(
  {
    parlourSlug: {
      type: String,
      default: 'common-room',
      index: true,
    },
    parlourTitle: {
      type: String,
      default: 'From the Common Room',
    },
    author: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
      default: 'reader',
    },
    avatar: {
      type: String,
      default: '/images/eleanor-avatar.jpg',
    },
    tag: {
      type: String,
      default: 'Reflection',
    },
    quote: {
      type: String,
      default: null,
    },
    quoteAuthor: {
      type: String,
      default: null,
    },
    quoteImg: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    bookmarkedBy: {
      type: [String],
      default: [],
    },
    commentsList: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

communityPostSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

communityPostSchema.virtual('commentsCount').get(function () {
  return this.commentsList ? this.commentsList.length : 0;
});

communityPostSchema.set('toJSON', { virtuals: true });
communityPostSchema.set('toObject', { virtuals: true });

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
