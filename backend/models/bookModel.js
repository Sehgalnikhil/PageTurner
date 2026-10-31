import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Uncategorized',
    },
    description: {
      type: String,
      default: '',
    },
    isbn: {
      type: String,
      default: '',
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'English',
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
        },
      }
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// High-Performance Query & Text Search Compound Indexes
bookSchema.index({ category: 1, createdAt: -1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ isFeatured: 1 });

export const Book = mongoose.model('Book', bookSchema);
