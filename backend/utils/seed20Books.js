import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from '../models/bookModel.js';
import { User } from '../models/userModel.js';

dotenv.config();

const famousBooks = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publishYear: 1960,
    category: 'Fiction',
    description: 'Set in the American South during the 1930s, this Pulitzer Prize-winning masterpiece follows young Scout Finch, whose father Atticus is appointed to defend a Black man falsely accused of a grave crime. An enduring examination of prejudice, moral courage, and innocence.',
    isbn: '9780061120084',
    pageCount: 336,
    language: 'English',
    image: "/uploads/covers/to-kill-a-mockingbird.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'One of the most moving novels in modern literature. Atticus Finch remains the ultimate paragon of justice and integrity.',
      },
      {
        rating: 5,
        comment: 'A compassionate, deeply humane story that stays with you long after the final page.',
      }
    ]
  },
  {
    title: '1984',
    author: 'George Orwell',
    publishYear: 1949,
    category: 'Sci-Fi',
    description: 'A chilling dystopian warning set in Oceania, a totalitarian superstate ruled by the omnipresent Party and Big Brother. Winston Smith dares to commit thoughtcrime and secret rebellion in a world where language, truth, and human thought are ruthlessly policed.',
    isbn: '9780451524935',
    pageCount: 328,
    language: 'English',
    image: "/uploads/covers/1984.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'More prophetic with every passing decade. Doublethink and Newspeak are brilliant concepts.',
      }
    ]
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishYear: 1925,
    category: 'Fiction',
    description: 'Set in the Roaring Twenties on Long Island, the story follows the mysterious Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan. A poetic critique of the American Dream, excess, class, and longing.',
    isbn: '9780743273565',
    pageCount: 180,
    language: 'English',
    image: "/uploads/covers/the-great-gatsby.jpg",
    reviews: [
      {
        rating: 4,
        comment: 'Exquisite prose and haunting symbolism. Fitzgerald captured the Jazz Age like no other.',
      }
    ]
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publishYear: 1813,
    category: 'Fiction',
    description: 'A sparkling romantic comedy of manners following the witty Elizabeth Bennet and the proud Mr. Darcy. Austen explores societal expectations, family dynamics, and the folly of hasty judgements with razor-sharp irony.',
    isbn: '9780141439518',
    pageCount: 432,
    language: 'English',
    image: "/uploads/covers/pride-and-prejudice.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Unbeatable wit, beloved characters, and peerless dialogue. Truly timeless.',
      }
    ]
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    publishYear: 1951,
    category: 'Fiction',
    description: 'Narrated by sixteen-year-old Holden Caulfield after his expulsion from prep school, this groundbreaking novel captures adolescent alienation, the loss of innocence, and the yearning for authentic human connection.',
    isbn: '9780316769488',
    pageCount: 277,
    language: 'English',
    image: "/uploads/covers/the-catcher-in-the-rye.jpg",
    reviews: [
      {
        rating: 4,
        comment: 'Raw, honest, and unforgettable voice. Holden remains an iconic literary figure.',
      }
    ]
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    publishYear: 1937,
    category: 'Fiction',
    description: 'Bilbo Baggins, a comfort-loving hobbit, is whisked away on an unexpected journey by the wizard Gandalf and thirteen dwarves to reclaim the Lonely Mountain and its hoard from the dragon Smaug.',
    isbn: '9780547928227',
    pageCount: 310,
    language: 'English',
    image: "/uploads/covers/the-hobbit.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'A whimsical and breathtaking doorway into Middle-earth. Pure storytelling magic.',
      }
    ]
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publishYear: 2011,
    category: 'Non-Fiction',
    description: 'A sweeping narrative exploring how an insignificant ape became the ruler of planet Earth. Harari covers the Cognitive, Agricultural, and Scientific Revolutions, illuminating how shared myths have shaped human history.',
    isbn: '9780062316097',
    pageCount: 443,
    language: 'English',
    image: "/uploads/covers/sapiens.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Mind-expanding perspective on human biology, economy, and history.',
      }
    ]
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    publishYear: 1965,
    category: 'Sci-Fi',
    description: 'Set on the desert planet Arrakis, Dune is the epic tale of Paul Atreides as his noble family assumes control of the universe\'s only source of the spice melange. An astonishing triumph of worldbuilding, ecology, religion, and galactic politics.',
    isbn: '9780441172719',
    pageCount: 688,
    language: 'English',
    image: "/uploads/covers/dune.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'The Lord of the Rings of science fiction. Unmatched depth and ambition.',
      }
    ]
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    publishYear: 2011,
    category: 'Biography',
    description: 'Based on more than forty interviews with Jobs conducted over two years, this definitive biography portrays the rollercoaster life and searingly intense personality of a creative entrepreneur whose passion for perfection revolutionized six industries.',
    isbn: '9781451648539',
    pageCount: 656,
    language: 'English',
    image: "/uploads/covers/steve-jobs.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Fascinating, unvarnished look inside one of technology’s greatest innovators.',
      }
    ]
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publishYear: 1988,
    category: 'Fiction',
    description: 'The mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure. Along the way, he discovers the wisdom of listening to his heart, recognizing omens, and following his Personal Legend.',
    isbn: '9780062315007',
    pageCount: 208,
    language: 'English',
    image: "/uploads/covers/the-alchemist.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Inspiring fable that reminds us that our true treasure is often closer than we think.',
      }
    ]
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    publishYear: 1932,
    category: 'Sci-Fi',
    description: 'Set in a technologically engineered World State where citizens are genetically conditioned, psychologically manipulated, and numbed by the synthetic narcotic soma. A prophetic contemplation on consumerism, hedonism, and lost individuality.',
    isbn: '9780060850524',
    pageCount: 288,
    language: 'English',
    image: "/uploads/covers/brave-new-world.jpg",
    reviews: [
      {
        rating: 4,
        comment: 'Astonishingly insightful view into modern pleasure-driven distraction societies.',
      }
    ]
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    publishYear: 2018,
    category: 'Non-Fiction',
    description: 'A proven framework for improving every day. James Clear reveals practical strategies on how small changes lead to remarkable results by mastering cue, craving, response, and reward systems.',
    isbn: '9780735211292',
    pageCount: 320,
    language: 'English',
    image: "/uploads/covers/atomic-habits.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'The most actionable self-improvement guide ever written. Changed my daily routine.',
      }
    ]
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    publishYear: 1866,
    category: 'Fiction',
    description: 'Raskolnikov, a destitute former student in Saint Petersburg, commits a murder believing himself beyond conventional morality. What follows is a gripping psychological and spiritual investigation of guilt, conscience, and redemption.',
    isbn: '9780140449136',
    pageCount: 671,
    language: 'English',
    image: "/uploads/covers/crime-and-punishment.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Dostoevsky dissects human psychology with unequaled brilliance and depth.',
      }
    ]
  },
  {
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    publishYear: 1954,
    category: 'Fiction',
    description: 'The first volume in the epic legend of Middle-earth. Frodo Baggins inherits the One Ring of the Dark Lord Sauron and must journey with eight companions across great peril toward Mount Doom to destroy it.',
    isbn: '9780547928210',
    pageCount: 423,
    language: 'English',
    image: "/uploads/covers/the-fellowship-of-the-ring.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'The pinnacle of high fantasy. Tolkien’s language and lore are unparalleled.',
      }
    ]
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    publishYear: 2018,
    category: 'Biography',
    description: 'An unforgettable memoir about a young girl kept out of school and isolated from society in rural Idaho by survivalist parents, who eventually teaches herself enough mathematics and grammar to enter college and earn a PhD from Cambridge.',
    isbn: '9780399590504',
    pageCount: 334,
    language: 'English',
    image: "/uploads/covers/educated.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Incredible resilience and a moving testament to the transformative power of knowledge.',
      }
    ]
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    publishYear: 1953,
    category: 'Sci-Fi',
    description: 'Guy Montag is a fireman whose job is to burn books, which are banned in a dystopian future where intellectual curiosity is suppressed in favor of instant entertainment. When he meets a freethinking girl, his worldview begins to ignite.',
    isbn: '9781451673319',
    pageCount: 249,
    language: 'English',
    image: "/uploads/covers/fahrenheit-451.jpg",
    reviews: [
      {
        rating: 4,
        comment: 'Poetic, urgent tribute to the preservation of literature, thought, and memory.',
      }
    ]
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    publishYear: 2011,
    category: 'Non-Fiction',
    description: 'Nobel laureate Daniel Kahneman explains the two systems that drive the way we think: System 1 (fast, intuitive, emotional) and System 2 (slower, deliberate, logical). A masterclass on cognitive biases, heuristics, and choice architecture.',
    isbn: '9780374533557',
    pageCount: 499,
    language: 'English',
    image: "/uploads/covers/thinking-fast-and-slow.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Essential reading for understanding how the human mind actually makes decisions.',
      }
    ]
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    publishYear: 1947,
    category: 'Biography',
    description: 'Discovered in the secret attic annex where she and her family hid from Nazi occupation in Amsterdam, Anne Frank’s diary provides an intimate, heartbreaking, and luminous testimony to the human spirit in the face of tyranny.',
    isbn: '9780553296983',
    pageCount: 283,
    language: 'English',
    image: "/uploads/covers/the-diary-of-a-young-girl.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'A profoundly poignant voice that reminds the world of the tragedy of intolerance.',
      }
    ]
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    publishYear: 1890,
    category: 'Fiction',
    description: 'Enthralled by his own youth and beauty in a painted portrait, Dorian Gray trades his soul to ensure the portrait ages while he remains eternally young, leading him down a decadent path of aestheticism, moral decay, and consequence.',
    isbn: '9780141439570',
    pageCount: 254,
    language: 'English',
    image: "/uploads/covers/the-picture-of-dorian-gray.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Wilde\'s epigrams and philosophical musings on beauty and morality are intoxicating.',
      }
    ]
  },
  {
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    publishYear: 1946,
    category: 'Non-Fiction',
    description: 'Psychiatrist Viktor Frankl\'s profound memoir of his experiences in Nazi concentration camps, introducing his psychotherapeutic method of logotherapy—the belief that our primary drive in life is not pleasure, but the discovery of meaning.',
    isbn: '9780807014295',
    pageCount: 165,
    language: 'English',
    image: "/uploads/covers/mans-search-for-meaning.jpg",
    reviews: [
      {
        rating: 5,
        comment: 'Life-altering book that provides fortitude and perspective in any difficult season.',
      }
    ]
  }
];

export const seed20Books = async () => {
  try {
    const admin = await User.findOne({ email: 'admin@pageturner.io' });
    const reader = await User.findOne({ email: 'student@pageturner.io' });
    const adminId = admin ? admin._id : null;
    const readerId = reader ? reader._id : adminId;

    let insertedCount = 0;
    for (const b of famousBooks) {
      const exists = await Book.findOne({ title: b.title, author: b.author });
      if (!exists) {
        const reviewsWithUsers = b.reviews.map(r => ({
          ...r,
          userId: readerId,
          username: reader ? reader.username : 'BookLover'
        }));

        const avg = reviewsWithUsers.length
          ? reviewsWithUsers.reduce((acc, curr) => acc + curr.rating, 0) / reviewsWithUsers.length
          : 0;

        await Book.create({
          ...b,
          createdBy: adminId,
          reviews: reviewsWithUsers,
          averageRating: avg
        });
        insertedCount++;
      }
    }

    console.log(`✨ Successfully verified and seeded ${insertedCount} new famous books into database!`);
  } catch (error) {
    console.error('Error seeding 20 books:', error);
  }
};
