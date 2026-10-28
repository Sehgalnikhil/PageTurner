import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/bookModel.js';

dotenv.config();

const ORIGINAL_COVERS = {
  'To Kill a Mockingbird': 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
  'The Great Gatsby': 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
  'Pride and Prejudice': 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
  'The Catcher in the Rye': 'https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg',
  'The Hobbit': 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
  'Sapiens: A Brief History of Humankind': 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  'Dune': 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
  'Steve Jobs': 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
  'The Alchemist': 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
  'Brave New World': 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
  'Atomic Habits': 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  'Crime and Punishment': 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
  'The Fellowship of the Ring': 'https://covers.openlibrary.org/b/isbn/9780547928210-L.jpg',
  'Educated': 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
  'Fahrenheit 451': 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
  'Thinking, Fast and Slow': 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
  'The Diary of a Young Girl': 'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg',
  'The Picture of Dorian Gray': 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
  "Man's Search for Meaning": 'https://covers.openlibrary.org/b/isbn/9780807014295-L.jpg',
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
