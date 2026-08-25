import express from 'express';
import { Book } from '../models/bookModel.js';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

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
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /books
// @desc    Save a new Book
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      category: request.body.category,
      description: request.body.description,
      isbn: request.body.isbn,
      pageCount: request.body.pageCount,
      language: request.body.language,
    };

    if (request.file) {
      newBook.image = `/uploads/${request.file.filename}`;
    }

    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// @route   GET /books
// @desc    Get all books with pagination, search, filter
// @access  Public
router.get('/', async (request, response) => {
  try {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (request.query.search) {
      query.$or = [
        { title: { $regex: request.query.search, $options: 'i' } },
        { author: { $regex: request.query.search, $options: 'i' } },
      ];
    }

    if (request.query.category && request.query.category !== 'All') {
      query.category = request.query.category;
    }

    const count = await Book.countDocuments(query);
    const books = await Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    return response.status(200).json({
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// @route   GET /books/:id
// @desc    Get One Book from database by id
// @access  Public
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// @route   PUT /books/:id
// @desc    Update a Book
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params;

    const updateData = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
      category: request.body.category,
      description: request.body.description,
      isbn: request.body.isbn,
      pageCount: request.body.pageCount,
      language: request.body.language,
    };

    if (request.file) {
      updateData.image = `/uploads/${request.file.filename}`;
    }

    const result = await Book.findByIdAndUpdate(id, updateData);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// @route   DELETE /books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', protect, admin, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// @route   POST /books/:id/reviews
// @desc    Create new review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Book already reviewed' });
      }

      const review = {
        userId: req.user._id,
        username: req.user.username,
        rating: Number(rating),
        comment,
      };

      book.reviews.push(review);

      book.averageRating =
        book.reviews.reduce((acc, item) => item.rating + acc, 0) /
        book.reviews.length;

      await book.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
