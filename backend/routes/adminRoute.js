import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { Book } from '../models/bookModel.js';
import { Announcement } from '../models/announcementModel.js';
import { AuditLog } from '../models/auditLogModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { seed20Books } from '../utils/seed20Books.js';
import { NODE_ENV } from '../config.js';

const router = express.Router();

// Helper to record audit events
const logAuditEvent = async ({ action, details, req, category = 'system' }) => {
  try {
    await AuditLog.create({
      action,
      details,
      adminUsername: req?.user?.username || 'Curator Admin',
      adminId: req?.user?._id,
      category,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

// ==========================================
// PUBLIC ENDPOINTS (No Auth Required)
// ==========================================

// @route   GET /admin/announcement/public
// @desc    Get active site-wide broadcast banner for public visitors & readers
// @access  Public
router.get('/announcement/public', async (req, res, next) => {
  try {
    let announcement = await Announcement.findOne().sort({ updatedAt: -1 });
    if (!announcement) {
      announcement = await Announcement.create({
        text: 'Welcome to PageTurner — A Digital Sanctuary for Book Lovers & Curators.',
        subtext: 'Explore classical philosophy, gothic fiction, and fine bindings.',
        badge: 'Curator Dispatch',
        active: true,
        tone: 'burgundy',
      });
    }
    return res.status(200).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PROTECTED CURATOR ADMIN ENDPOINTS
// ==========================================
router.use(protect, admin);

// @route   GET /admin/stats
// @desc    Comprehensive library statistics, rating distribution, telemetry & system health
// @access  Private / Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAuditLogs = await AuditLog.countDocuments();

    // Aggregate reviews count, ratings, and rating histogram
    const books = await Book.find({}).select('title category averageRating reviews createdAt isFeatured');
    
    let totalReviews = 0;
    let ratingSum = 0;
    let ratedBooksCount = 0;
    let featuredBooksCount = 0;
    const categoryMap = {};

    // Rating histogram: count of 5, 4, 3, 2, 1 star reviews
    const ratingHistogram = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    books.forEach((book) => {
      // Category tally
      const cat = book.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;

      // Featured tally
      if (book.isFeatured) {
        featuredBooksCount += 1;
      }

      // Reviews tally & histogram
      if (Array.isArray(book.reviews)) {
        totalReviews += book.reviews.length;
        book.reviews.forEach((r) => {
          const roundedRating = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
          ratingHistogram[roundedRating] = (ratingHistogram[roundedRating] || 0) + 1;
        });
      }

      // Average rating tally
      if (book.averageRating > 0) {
        ratingSum += book.averageRating;
        ratedBooksCount += 1;
      }
    });

    const averageRating = ratedBooksCount > 0 ? (ratingSum / ratedBooksCount).toFixed(2) : 0;

    const categoryDistribution = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Recent 5 books
    const recentBooks = await Book.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author publishYear category image averageRating createdAt isFeatured');

    // Recent 5 users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    // Recent 5 reviews flattened
    const allRecentReviews = [];
    books.forEach((b) => {
      if (Array.isArray(b.reviews)) {
        b.reviews.forEach((r) => {
          allRecentReviews.push({
            bookId: b._id,
            bookTitle: b.title,
            reviewId: r._id,
            username: r.username,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt || b.createdAt,
          });
        });
      }
    });
    allRecentReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentReviews = allRecentReviews.slice(0, 5);

    // System health telemetry
    const memory = process.memoryUsage();
    const system = {
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      environment: NODE_ENV,
      memoryHeapUsedMB: (memory.heapUsed / 1024 / 1024).toFixed(1),
      memoryHeapTotalMB: (memory.heapTotal / 1024 / 1024).toFixed(1),
      dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      dbHost: mongoose.connection.host || '127.0.0.1',
      dbName: mongoose.connection.name || 'books-collection',
      emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    };

    return res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        totalUsers,
        totalReviews,
        featuredBooksCount,
        averageRating: Number(averageRating),
        categoryDistribution,
        ratingHistogram,
        totalAuditLogs,
      },
      recentBooks,
      recentUsers,
      recentReviews,
      system,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /admin/announcement
// @desc    Get broadcast banner settings
// @access  Private / Admin
router.get('/announcement', async (req, res, next) => {
  try {
    let announcement = await Announcement.findOne().sort({ updatedAt: -1 });
    if (!announcement) {
      announcement = await Announcement.create({});
    }
    return res.status(200).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /admin/announcement
// @desc    Update broadcast banner settings
// @access  Private / Admin
router.put('/announcement', async (req, res, next) => {
  try {
    const { text, subtext, badge, active, tone, link } = req.body;
    let announcement = await Announcement.findOne().sort({ updatedAt: -1 });
    if (!announcement) {
      announcement = new Announcement();
    }

    if (text !== undefined) announcement.text = text;
    if (subtext !== undefined) announcement.subtext = subtext;
    if (badge !== undefined) announcement.badge = badge;
    if (active !== undefined) announcement.active = active;
    if (tone !== undefined) announcement.tone = tone;
    if (link !== undefined) announcement.link = link;
    announcement.updatedBy = req.user.username;

    await announcement.save();

    await logAuditEvent({
      action: 'ANNOUNCEMENT_UPDATED',
      details: `Updated broadcast banner text: "${announcement.text.substring(0, 40)}..." [Active: ${announcement.active}]`,
      req,
      category: 'announcement',
    });

    return res.status(200).json({ success: true, message: 'Broadcast banner updated!', announcement });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /admin/books/:id/toggle-feature
// @desc    Toggle Curator Spotlight on a volume
// @access  Private / Admin
router.put('/books/:id/toggle-feature', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Volume not found' });
    }

    book.isFeatured = !book.isFeatured;
    await book.save();

    await logAuditEvent({
      action: book.isFeatured ? 'BOOK_SPOTLIGHT_PINNED' : 'BOOK_SPOTLIGHT_UNPINNED',
      details: `${book.isFeatured ? 'Pinned' : 'Unpinned'} "${book.title}" to Curator Spotlight`,
      req,
      category: 'books',
    });

    return res.status(200).json({
      success: true,
      message: `"${book.title}" ${book.isFeatured ? 'is now pinned to Curator Spotlight' : 'removed from Curator Spotlight'}.`,
      isFeatured: book.isFeatured,
      book,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /admin/books/:id/quick-edit
// @desc    In-place update for volume metadata without leaving dashboard
// @access  Private / Admin
router.put('/books/:id/quick-edit', async (req, res, next) => {
  try {
    const { title, author, publishYear, category, description, isbn, pageCount, image, isFeatured } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Volume not found in catalog' });
    }

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (publishYear) book.publishYear = Number(publishYear);
    if (category) book.category = category.trim();
    if (description !== undefined) book.description = description;
    if (isbn !== undefined) book.isbn = isbn.trim();
    if (pageCount !== undefined) book.pageCount = Number(pageCount) || 0;
    if (image !== undefined) book.image = image;
    if (isFeatured !== undefined) book.isFeatured = Boolean(isFeatured);

    await book.save();

    await logAuditEvent({
      action: 'BOOK_QUICK_EDITED',
      details: `Curator updated metadata for "${book.title}"`,
      req,
      category: 'books',
    });

    return res.status(200).json({
      success: true,
      message: `"${book.title}" updated successfully!`,
      book,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /admin/books/bulk-delete
// @desc    Bulk delete selected books
// @access  Private / Admin
router.post('/books/bulk-delete', async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of book IDs to delete.' });
    }

    const result = await Book.deleteMany({ _id: { $in: ids } });

    await logAuditEvent({
      action: 'BULK_BOOKS_DELETED',
      details: `Bulk deleted ${result.deletedCount} volumes from library archives.`,
      req,
      category: 'books',
    });

    return res.status(200).json({
      success: true,
      message: `Successfully removed ${result.deletedCount} volumes from archives.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /admin/books/bulk-category
// @desc    Bulk update category for selected books
// @access  Private / Admin
router.post('/books/bulk-category', async (req, res, next) => {
  try {
    const { ids, category } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !category) {
      return res.status(400).json({ message: 'Please provide book IDs and a valid category name.' });
    }

    const result = await Book.updateMany(
      { _id: { $in: ids } },
      { $set: { category: category.trim() } }
    );

    await logAuditEvent({
      action: 'BULK_CATEGORY_UPDATED',
      details: `Reassigned ${result.modifiedCount} volumes to genre "${category}".`,
      req,
      category: 'books',
    });

    return res.status(200).json({
      success: true,
      message: `Reassigned ${result.modifiedCount} volumes to "${category}".`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /admin/users
// @desc    Get all registered members with search and sorting
// @access  Private / Admin
router.get('/users', async (req, res, next) => {
  try {
    const { search = '', role = '' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role && (role === 'admin' || role === 'user')) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /admin/users/:id/role
// @desc    Change user role (user <-> admin)
// @access  Private / Admin
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot revoke your own administrator status.' });
    }

    user.role = role;
    await user.save();

    await logAuditEvent({
      action: 'USER_ROLE_CHANGED',
      details: `Changed role for "${user.username}" (${user.email}) to "${role}"`,
      req,
      category: 'users',
    });

    return res.status(200).json({
      success: true,
      message: `User ${user.username} role successfully updated to ${role}`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /admin/users/:id
// @desc    Delete a user account
// @access  Private / Admin
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own administrative account.' });
    }

    await User.findByIdAndDelete(req.params.id);

    await logAuditEvent({
      action: 'USER_ACCOUNT_DELETED',
      details: `Revoked Guild membership for user "${user.username}" (${user.email})`,
      req,
      category: 'users',
    });

    return res.status(200).json({
      success: true,
      message: `User account "${user.username}" was permanently removed.`,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /admin/reviews
// @desc    Get all reviews across all books for centralized moderation
// @access  Private / Admin
router.get('/reviews', async (req, res, next) => {
  try {
    const books = await Book.find({ 'reviews.0': { $exists: true } })
      .select('title author image reviews')
      .lean();

    const reviews = [];
    books.forEach((book) => {
      if (Array.isArray(book.reviews)) {
        book.reviews.forEach((rev) => {
          reviews.push({
            bookId: book._id,
            bookTitle: book.title,
            bookAuthor: book.author,
            bookImage: book.image,
            reviewId: rev._id,
            userId: rev.userId,
            username: rev.username,
            rating: rev.rating,
            comment: rev.comment,
            createdAt: rev.createdAt || book.createdAt,
          });
        });
      }
    });

    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /admin/reviews/:bookId/:reviewId
// @desc    Direct curator review removal
// @access  Private / Admin
router.delete('/reviews/:bookId/:reviewId', async (req, res, next) => {
  try {
    const { bookId, reviewId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Associated book not found' });
    }

    const reviewIndex = book.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found in catalog' });
    }

    const removedReview = book.reviews[reviewIndex];
    book.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    if (book.reviews.length > 0) {
      const sum = book.reviews.reduce((acc, r) => acc + r.rating, 0);
      book.averageRating = Number((sum / book.reviews.length).toFixed(1));
    } else {
      book.averageRating = 0;
    }

    await book.save();

    await logAuditEvent({
      action: 'REVIEW_MODERATED',
      details: `Removed review by "${removedReview.username}" on "${book.title}"`,
      req,
      category: 'reviews',
    });

    return res.status(200).json({
      success: true,
      message: 'Review removed from public library display.',
      averageRating: book.averageRating,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /admin/reviews/bulk-delete
// @desc    Bulk delete reviews
// @access  Private / Admin
router.post('/reviews/bulk-delete', async (req, res, next) => {
  try {
    const { items } = req.body; // array of { bookId, reviewId }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Please provide review items to delete.' });
    }

    let removedCount = 0;
    // Group by bookId
    const byBook = {};
    items.forEach(({ bookId, reviewId }) => {
      if (!byBook[bookId]) byBook[bookId] = [];
      byBook[bookId].push(reviewId);
    });

    for (const [bookId, reviewIds] of Object.entries(byBook)) {
      const book = await Book.findById(bookId);
      if (book && Array.isArray(book.reviews)) {
        const initialLen = book.reviews.length;
        book.reviews = book.reviews.filter((r) => !reviewIds.includes(r._id.toString()));
        removedCount += initialLen - book.reviews.length;
        if (book.reviews.length > 0) {
          const sum = book.reviews.reduce((acc, r) => acc + r.rating, 0);
          book.averageRating = Number((sum / book.reviews.length).toFixed(1));
        } else {
          book.averageRating = 0;
        }
        await book.save();
      }
    }

    await logAuditEvent({
      action: 'BULK_REVIEWS_MODERATED',
      details: `Bulk deleted ${removedCount} marginalia reviews.`,
      req,
      category: 'reviews',
    });

    return res.status(200).json({
      success: true,
      message: `Bulk removed ${removedCount} reviews.`,
      removedCount,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /admin/audit-logs
// @desc    Get chronological ledger of curator actions
// @access  Private / Admin
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
});

// @route   GET /admin/backup/json
// @desc    Download complete JSON snapshot of all library books and reviews
// @access  Private / Admin
router.get('/backup/json', async (req, res, next) => {
  try {
    const books = await Book.find({}).lean();
    const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpires').lean();
    const announcement = await Announcement.findOne().sort({ updatedAt: -1 }).lean();

    const snapshot = {
      exportedAt: new Date().toISOString(),
      platform: 'PageTurner — Digital Literary Journal & Archive',
      version: '1.0.0',
      totalVolumes: books.length,
      totalMembers: users.length,
      announcement,
      books,
      users,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="pageturner-catalog-backup-${new Date().toISOString().slice(0, 10)}.json"`
    );

    await logAuditEvent({
      action: 'SNAPSHOT_EXPORTED',
      details: 'Curator exported full JSON archive snapshot.',
      req,
      category: 'system',
    });

    return res.status(200).send(JSON.stringify(snapshot, null, 2));
  } catch (error) {
    next(error);
  }
});

// @route   POST /admin/reseed
// @desc    Trigger canonical catalog verification and reseed
// @access  Private / Admin
router.post('/reseed', async (req, res, next) => {
  try {
    await seed20Books();

    await logAuditEvent({
      action: 'CATALOG_RESEEDED',
      details: 'Verified and re-seeded canonical library volumes.',
      req,
      category: 'system',
    });

    return res.status(200).json({
      success: true,
      message: 'Canonical book stacks verified and re-seeded successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /admin/users/:id/welcome-email
// @desc    Manually dispatch welcome email to user
// @access  Private / Admin
router.post('/users/:id/welcome-email', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const emailSent = await sendWelcomeEmail(user.email, user.username);

    await logAuditEvent({
      action: 'WELCOME_EMAIL_DISPATCHED',
      details: `Dispatched Reader Passport email to ${user.email}`,
      req,
      category: 'users',
    });

    return res.status(200).json({
      success: true,
      message: emailSent
        ? `Welcome passport dispatched to ${user.email}!`
        : `Email queued for ${user.email} (preview available in browser).`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
