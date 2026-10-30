import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, mongoDBURL, NODE_ENV } from './config.js';
import booksRoute from './routes/booksRoute.js';
import authRoute from './routes/authRoute.js';
import systemRoute from './routes/systemRoute.js';
import adminRoute from './routes/adminRoute.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDemoUsers } from './utils/seedDemoUsers.js';
import { seed20Books } from './utils/seed20Books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use(cors());

// HTTP Request-Response Lifecycle Timing Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (NODE_ENV !== 'test') {
      console.log(`[HTTP ${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Static File Serving (Multer upload destination & fast cover cache with 30-day browser caching)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public/uploads'), {
    maxAge: '30d',
    immutable: true,
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'PageTurner Backend API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Base API welcome endpoint
app.get('/', (request, response) => {
  return response.status(200).json({
    project: 'PageTurner — Modern Book Management System',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      books: '/books',
      auth: '/auth',
      systemDiagnostics: '/system/info',
      exportCsv: '/books/export/csv',
      healthCheck: '/health',
    },
  });
});

// Mount modular routes
app.use('/books', booksRoute);
app.use('/auth', authRoute);
app.use('/system', systemRoute);
app.use('/admin', adminRoute);

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

// Database connection & Server initialization
mongoose
  .connect(mongoDBURL)
  .then(async () => {
    console.log('✅ Connected to MongoDB database');
    await seedDemoUsers();
    await seed20Books();
    const server = app.listen(PORT, () => {
      console.log(`🚀 PageTurner server listening on port: ${PORT}`);
    });

    // Graceful Process Termination
    const gracefulShutdown = () => {
      console.log('\n🛑 Closing server gracefully...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
  });

export default app;
