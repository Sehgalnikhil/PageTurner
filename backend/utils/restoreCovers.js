import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/bookModel.js';

dotenv.config();

const ORIGINAL_COVERS = {
  'To Kill a Mockingbird': '/uploads/covers/to-kill-a-mockingbird.jpg',
  '1984': '/uploads/covers/1984.jpg',
  'The Great Gatsby': '/uploads/covers/the-great-gatsby.jpg',
  'Pride and Prejudice': '/uploads/covers/pride-and-prejudice.jpg',
  'The Catcher in the Rye': '/uploads/covers/the-catcher-in-the-rye.jpg',
  'The Hobbit': '/uploads/covers/the-hobbit.jpg',
  'Sapiens: A Brief History of Humankind': '/uploads/covers/sapiens.jpg',
  'Dune': '/uploads/covers/dune.jpg',
  'Steve Jobs': '/uploads/covers/steve-jobs.jpg',
  'The Alchemist': '/uploads/covers/the-alchemist.jpg',
  'Brave New World': '/uploads/covers/brave-new-world.jpg',
  'Atomic Habits': '/uploads/covers/atomic-habits.jpg',
  'Crime and Punishment': '/uploads/covers/crime-and-punishment.jpg',
  'The Fellowship of the Ring': '/uploads/covers/the-fellowship-of-the-ring.jpg',
  'Educated': '/uploads/covers/educated.jpg',
  'Fahrenheit 451': '/uploads/covers/fahrenheit-451.jpg',
  'Thinking, Fast and Slow': '/uploads/covers/thinking-fast-and-slow.jpg',
  'The Diary of a Young Girl': '/uploads/covers/the-diary-of-a-young-girl.jpg',
  'The Picture of Dorian Gray': '/uploads/covers/the-picture-of-dorian-gray.jpg',
  "Man's Search for Meaning": '/uploads/covers/mans-search-for-meaning.jpg',
};

const restoreOriginalCovers = async () => {
  try {
    const mongoUri = process.env.mongoDBURL || 'mongodb://127.0.0.1:27017/books-collection';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const books = await Book.find({});
    let count = 0;
    for (const b of books) {
      if (ORIGINAL_COVERS[b.title]) {
        b.image = ORIGINAL_COVERS[b.title];
        await b.save();
        count++;
        console.log(`Restored original cover for: ${b.title} -> ${b.image}`);
      }
    }
    console.log(`Successfully restored ${count} original book covers!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error restoring covers:', err);
    process.exit(1);
  }
};

restoreOriginalCovers();
