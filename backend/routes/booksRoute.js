import express from 'express';
import mongoose from 'mongoose';
import { Book } from '../models/bookModel.js';
import multer from 'multer';
import path from 'path';
import { Readable } from 'stream';
import { protect, admin } from '../middleware/authMiddleware.js';
import { auditEmitter } from '../utils/eventBus.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp allowed)!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   GET /books/export/csv
// @desc    Stream CSV file download of library books
// @access  Public
router.get('/export/csv', async (req, res, next) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="PageTurner_Books_Catalog.csv"');

    // Create CSV header
    const header = 'ID,Title,Author,PublishYear,Category,ISBN,PageCount,Language,Rating,CreatedAt\n';
    
    // Create Node.js Readable Stream
    let index = 0;
    const stream = new Readable({
      read() {
        if (index === 0) {
          this.push(Buffer.from(header, 'utf-8'));
        }
        if (index < books.length) {
          const b = books[index++];
          const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
          const row = [
            b._id,
            escapeCsv(b.title),
            escapeCsv(b.author),
            b.publishYear,
            escapeCsv(b.category),
            escapeCsv(b.isbn),
            b.pageCount,
            escapeCsv(b.language),
            b.averageRating || 0,
            b.createdAt ? b.createdAt.toISOString() : ''
          ].join(',') + '\n';
          this.push(Buffer.from(row, 'utf-8'));
        } else {
          this.push(null); // End of stream
        }
      }
    });

    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

// @route   POST /books
// @desc    Save a new Book (Authenticated users)
// @access  Private
router.post('/', protect, upload.single('image'), async (request, response, next) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).json({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const newBook = {
      title: request.body.title.trim(),
      author: request.body.author.trim(),
      publishYear: Number(request.body.publishYear),
      category: request.body.category || 'Uncategorized',
      description: request.body.description || '',
      isbn: request.body.isbn || '',
      pageCount: Number(request.body.pageCount) || 0,
      language: request.body.language || 'English',
      createdBy: request.user._id, // Mongoose reference to User
    };

    if (request.file) {
      newBook.image = `/uploads/${request.file.filename}`;
    }

    const book = await Book.create(newBook);

    // Populate createdBy details before response
    await book.populate('createdBy', 'username email role');

    // Log event via auditEmitter
    auditEmitter.logEvent('book:created', {
      id: book._id,
      title: book.title,
      author: book.author,
      creator: request.user.username,
    });

    return response.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

// @route   GET /books
// @desc    Get all books with pagination, search, category filter & Mongoose populate
// @access  Public
router.get('/', async (request, response, next) => {
  try {
    const page = Math.max(1, Number(request.query.page) || 1);
    const limit = Math.max(1, Number(request.query.limit) || 8);
    const skip = (page - 1) * limit;

    let query = {};

    if (request.query.search) {
      query.$or = [
        { title: { $regex: request.query.search, $options: 'i' } },
        { author: { $regex: request.query.search, $options: 'i' } },
        { isbn: { $regex: request.query.search, $options: 'i' } },
      ];
    }

    if (request.query.category && request.query.category !== 'All') {
      query.category = request.query.category;
    }

    // Advanced sorting support
    let sortOptions = { createdAt: -1 };
    if (request.query.sortBy) {
      switch (request.query.sortBy) {
        case 'title-asc':
          sortOptions = { title: 1 };
          break;
        case 'title-desc':
          sortOptions = { title: -1 };
          break;
        case 'year-newest':
          sortOptions = { publishYear: -1 };
          break;
        case 'year-oldest':
          sortOptions = { publishYear: 1 };
          break;
        case 'rating-desc':
          sortOptions = { averageRating: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('createdBy', 'username email role')
      .populate('reviews.userId', 'username email')
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    return response.status(200).json({
      count,
      totalPages: Math.ceil(count / limit) || 1,
      currentPage: page,
      limit,
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /books/:id
// @desc    Get One Book from database by id with populated fields
// @access  Public
router.get('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    let book = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      book = await Book.findById(id)
        .populate('createdBy', 'username email role')
        .populate('reviews.userId', 'username email');
    }

    // Fallback: If not found or id wasn't an ObjectId, search by title or slug
    if (!book) {
      const cleanSearch = decodeURIComponent(id)
        .replace(/^default-/, '')
        .replace(/[-_]/g, ' ')
        .trim();

      book = await Book.findOne({
        title: { $regex: new RegExp(cleanSearch, 'i') },
      })
        .populate('createdBy', 'username email role')
        .populate('reviews.userId', 'username email');
    }

    if (!book) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /books/:id
// @desc    Update a Book
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (request, response, next) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).json({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params;

    const updateData = {
      title: request.body.title.trim(),
      author: request.body.author.trim(),
      publishYear: Number(request.body.publishYear),
      category: request.body.category,
      description: request.body.description,
      isbn: request.body.isbn,
      pageCount: Number(request.body.pageCount) || 0,
      language: request.body.language,
    };

    if (request.file) {
      updateData.image = `/uploads/${request.file.filename}`;
    }

    const result = await Book.findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'username email role');

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    auditEmitter.logEvent('book:updated', {
      id: result._id,
      title: result.title,
      updatedBy: request.user.username,
    });

    return response.status(200).json({
      message: 'Book updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', protect, admin, async (request, response, next) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    auditEmitter.logEvent('book:deleted', {
      id: result._id,
      title: result.title,
      deletedBy: request.user.username,
    });

    return response.status(200).json({
      message: 'Book deleted successfully',
      deletedBookId: id,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /books/:id/reviews
// @desc    Create new review with rating and comment
// @access  Private
router.post('/:id/reviews', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const alreadyReviewed = book.reviews.find(
      (r) => r.userId && r.userId.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = {
      userId: req.user._id,
      username: req.user.username,
      rating: Number(rating),
      comment: comment.trim(),
    };

    book.reviews.push(review);

    book.averageRating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();

    auditEmitter.logEvent('review:added', {
      bookId: book._id,
      rating,
      user: req.user.username,
    });

    res.status(201).json({
      message: 'Review added successfully',
      averageRating: book.averageRating,
      reviewsCount: book.reviews.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
