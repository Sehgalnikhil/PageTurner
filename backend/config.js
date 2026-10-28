import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5555;

export const mongoDBURL =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/books-collection';

export const JWT_SECRET =
  process.env.JWT_SECRET || 'fallback_secret_key_please_change';

export const NODE_ENV = process.env.NODE_ENV || 'development';