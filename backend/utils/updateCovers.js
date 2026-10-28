import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/bookModel.js';

dotenv.config();

const RELIABLE_BOOK_COVERS = {
  'To Kill a Mockingbird': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=700&q=80',
  '1984': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
  'The Great Gatsby': 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=700&q=80',
  'Pride and Prejudice': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80',
  'The Catcher in the Rye': 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=700&q=80',
  'The Hobbit': 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=700&q=80',
  'Sapiens: A Brief History of Humankind': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=80',
  'Dune': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=80',
  'Steve Jobs': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
  'The Alchemist': 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80',
  'Brave New World': 'https://images.unsplash.com/photo-1507842229451-9f7a932bb857?auto=format&fit=crop&w=700&q=80',
  'Atomic Habits': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=700&q=80',
  'Crime and Punishment': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80',
  'The Fellowship of the Ring': 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?auto=format&fit=crop&w=700&q=80',
  'Educated': 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=700&q=80',
  'Fahrenheit 451': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80',
  'Thinking, Fast and Slow': 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=700&q=80',
  'The Diary of a Young Girl': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
  'The Picture of Dorian Gray': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
  "Man's Search for Meaning": 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
};

const updateCovers = async () => {
  try {
    const mongoUri = process.env.mongoDBURL || 'mongodb://127.0.0.1:27017/books-collection';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const books = await Book.find({});
    console.log(`Found ${books.length} books in DB`);

    let updatedCount = 0;
    for (const book of books) {
      const reliableCover = RELIABLE_BOOK_COVERS[book.title];
      if (reliableCover) {
        book.image = reliableCover;
        await book.save();
        updatedCount++;
        console.log(`Updated cover for: ${book.title}`);
      }
    }

    console.log(`Finished updating ${updatedCount} books with reliable cover URLs!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to update covers:', error);
    process.exit(1);
  }
};

updateCovers();
