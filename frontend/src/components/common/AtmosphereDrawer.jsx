import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PiXBold,
  PiSparkleBold,
  PiBookmarkSimpleBold,
  PiCheckBold,
  PiPlusBold,
  PiPlayBold,
  PiPauseBold,
  PiSpeakerHighBold,
  PiBooksBold,
  PiArrowRightBold,
  PiFeatherBold,
  PiCompassBold,
  PiStarFill,
} from 'react-icons/pi';
import { ReadingListContext } from '../../context/ReadingListContext';
import { bookService } from '../../services/api';
import { getBookCoverUrl } from '../../utils/imageHelper';
import { playPaperUnwrap, playWaxSealCrack } from '../../utils/soundEffects';
import { ambientAudio } from '../../utils/ambientAudioEngine';
import { useSnackbar } from 'notistack';

// 6 Curated Atmospheric Anthologies with verified local assets, quotes, and soundscapes
export const ATMOSPHERES_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    tagline: 'Gothic obsession, classical libraries & intellectual longing.',
    quote: 'I want to live quietly, secluded from the turmoil of people, with good books.',
    quoteAuthor: 'Donna Tartt, The Secret History',
    soundName: 'Cathedral Rain & Grandfather Clock',
    soundPreset: { rain: 0.5, fireplace: 0.0, clock: 0.3 },
    bgImage: '/images/parlour-gothic.jpg',
    color: '#8D263B',
    accent: '#C6A16B',
    keywords: ['secret history', 'dorian', 'villains', 'babel', 'crime and punishment', 'frankenstein'],
    canonicalWorks: [
      {
        _id: 'canonical-the-secret-history',
        title: 'The Secret History',
        author: 'Donna Tartt',
        publishYear: 1992,
        category: 'Fiction',
        image: '/images/covers/the-secret-history.jpg',
        excerpt: 'An elite Greek tragedy class entangled in an ancient ritual that unravels into murder.',
        curatorBadge: 'Academic Canon',
        readingTime: '9 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-dorian-gray',
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        publishYear: 1890,
        category: 'Fiction',
        image: '/images/covers/the-picture-of-dorian-gray.jpg',
        excerpt: 'A Faustian portrait of vanity, aesthetic obsession, and moral rot in Victorian London.',
        curatorBadge: 'Gothic Masterpiece',
        readingTime: '4.5 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-if-we-were-villains',
        title: 'If We Were Villains',
        author: 'M.L. Rio',
        publishYear: 2017,
        category: 'Fiction',
        image: '/images/covers/if-we-were-villains.jpg',
        excerpt: 'Seven young Shakespearean actors at an elite conservatory play their roles too deeply.',
        curatorBadge: 'Tragic Theatre',
        readingTime: '7.5 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-babel',
        title: 'Babel: An Arcane History',
        author: 'R.F. Kuang',
        publishYear: 2022,
        category: 'Fiction',
        image: '/images/covers/babel.jpg',
        excerpt: 'Oxford’s Royal Institute of Translation, magical silver-working, and the ethics of empire.',
        curatorBadge: 'Linguistic Arcana',
        readingTime: '12 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-crime-punishment',
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
        publishYear: 1866,
        category: 'Classic',
        image: '/images/covers/crime-and-punishment.jpg',
        excerpt: 'The psychological anatomy of guilt, hubris, and redemption in Saint Petersburg.',
        curatorBadge: 'Psychological Core',
        readingTime: '14 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-frankenstein',
        title: 'Frankenstein',
        author: 'Mary Shelley',
        publishYear: 1818,
        category: 'Gothic',
        image: '/images/covers/frankenstein.jpg',
        excerpt: 'A scientist dares to spark synthetic life, birthing a lonely creature consumed by vengeance.',
        curatorBadge: 'Gothic Origin',
        readingTime: '5 hrs',
        averageRating: 4.8,
      },
    ],
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Fiction',
    tagline: 'Dystopias, speculative frontiers & cosmic curiosity.',
    quote: 'The mystery of life isn’t a problem to solve, but a reality to experience.',
    quoteAuthor: 'Frank Herbert, Dune',
    soundName: 'Cosmic Rain & Library Whispers',
    soundPreset: { rain: 0.55, fireplace: 0.0, clock: 0.15 },
    bgImage: '/images/parlour-midnight.jpg',
    color: '#343A5E',
    accent: '#8AA0DC',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit', 'klara', 'solitude'],
    canonicalWorks: [
      {
        _id: 'canonical-dune',
        title: 'Dune',
        author: 'Frank Herbert',
        publishYear: 1965,
        category: 'Sci-Fi',
        image: '/images/covers/dune.jpg',
        excerpt: 'Politics, religion, and ecology collide on Arrakis in an unparalleled desert epic.',
        curatorBadge: 'Cosmic Monument',
        readingTime: '14 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-1984',
        title: '1984',
        author: 'George Orwell',
        publishYear: 1949,
        category: 'Sci-Fi',
        image: '/images/covers/1984.jpg',
        excerpt: 'The chilling portrait of totalitarian surveillance, newspeak, and the loss of truth.',
        curatorBadge: 'Dystopian Benchmark',
        readingTime: '6 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-brave-new-world',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        publishYear: 1932,
        category: 'Sci-Fi',
        image: '/images/covers/brave-new-world.jpg',
        excerpt: 'A technocratic future that engineered tranquility at the price of human liberty.',
        curatorBadge: 'Prophetic Vision',
        readingTime: '5.5 hrs',
        averageRating: 4.7,
      },
      {
        _id: 'canonical-fahrenheit-451',
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        publishYear: 1953,
        category: 'Sci-Fi',
        image: '/images/covers/fahrenheit-451.jpg',
        excerpt: 'A fireman whose duty is to ignite printed books discovers the insurgent beauty of literature.',
        curatorBadge: 'Literary Rebirth',
        readingTime: '4 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-klara-and-the-sun',
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        publishYear: 2021,
        category: 'Sci-Fi',
        image: '/images/covers/klara-and-the-sun.jpg',
        excerpt: 'An artificial friend with extraordinary observational power contemplates the human heart.',
        curatorBadge: 'Tender Speculation',
        readingTime: '6.5 hrs',
        averageRating: 4.7,
      },
      {
        _id: 'canonical-one-hundred-years',
        title: 'One Hundred Years of Solitude',
        author: 'Gabriel García Márquez',
        publishYear: 1967,
        category: 'Fiction',
        image: '/images/covers/one-hundred-years-of-solitude.jpg',
        excerpt: 'Seven generations of the Buendía family in the mythical town of Macondo.',
        curatorBadge: 'Magical Realism',
        readingTime: '11 hrs',
        averageRating: 4.9,
      },
    ],
  },
  {
    id: 'comforting-stories',
    title: 'Quiet, Comforting Stories',
    tagline: 'Solace, gentle hearths & warm pastoral worlds.',
    quote: 'There is nothing like staying at home for real comfort.',
    quoteAuthor: 'Jane Austen, Emma',
    soundName: 'Hearthside Crackle & Herbal Tea',
    soundPreset: { rain: 0.1, fireplace: 0.55, clock: 0.05 },
    bgImage: '/images/parlour-slow.jpg',
    color: '#7A4A28',
    accent: '#D4A373',
    keywords: ['pride and prejudice', 'hobbit', 'before the coffee', 'alchemist', 'little women', 'gentle reminder'],
    canonicalWorks: [
      {
        _id: 'canonical-pride-prejudice',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        publishYear: 1813,
        category: 'Fiction',
        image: '/images/covers/pride-and-prejudice.jpg',
        excerpt: 'Witty Regency romantic satire tracing Elizabeth Bennet and Mr. Darcy through misunderstanding.',
        curatorBadge: 'Timeless Warmth',
        readingTime: '7.5 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-the-hobbit',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        publishYear: 1937,
        category: 'Fantasy',
        image: '/images/covers/the-hobbit.jpg',
        excerpt: 'In a hole in the ground there lived a hobbit. Bilbo Baggins steps beyond the Shire.',
        curatorBadge: 'Pastoral Solace',
        readingTime: '6.5 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-before-coffee',
        title: 'Before the Coffee Gets Cold',
        author: 'Toshikazu Kawaguchi',
        publishYear: 2015,
        category: 'Fiction',
        image: '/images/covers/before-the-coffee-gets-cold.jpg',
        excerpt: 'In a small Tokyo back alley, a café offers customers the chance to travel back in time.',
        curatorBadge: 'Gentle Tearjerker',
        readingTime: '4 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-the-alchemist',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        publishYear: 1988,
        category: 'Fiction',
        image: '/images/covers/the-alchemist.jpg',
        excerpt: 'An Andalusian shepherd boy journeys toward the Pyramids in search of worldly treasure.',
        curatorBadge: 'Warm Parable',
        readingTime: '3.5 hrs',
        averageRating: 4.7,
      },
      {
        _id: 'canonical-little-women',
        title: 'Little Women',
        author: 'Louisa May Alcott',
        publishYear: 1868,
        category: 'Fiction',
        image: '/images/covers/little-women.jpg',
        excerpt: 'The heartfelt journey of the four March sisters growing up in Civil War-era New England.',
        curatorBadge: 'Cozy Hearth',
        readingTime: '8 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-gentle-reminder',
        title: 'A Gentle Reminder',
        author: 'Bianca Sparacino',
        publishYear: 2020,
        category: 'Poetry',
        image: '/images/covers/a-gentle-reminder.jpg',
        excerpt: 'Soulful meditations on healing, soft hearts, and finding peace in turbulent times.',
        curatorBadge: 'Quiet Solace',
        readingTime: '2 hrs',
        averageRating: 4.9,
      },
    ],
  },
  {
    id: 'perspective-shifts',
    title: 'Perspective Shifts',
    tagline: 'Philosophy, radical empathy & human experience.',
    quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    quoteAuthor: 'Marcus Aurelius, Meditations',
    soundName: 'Philosophy Hall & Monastic Tone',
    soundPreset: { rain: 0.25, fireplace: 0.1, clock: 0.35 },
    bgImage: '/images/editorial/moodboard_mountain.jpg',
    color: '#284E45',
    accent: '#83B59B',
    keywords: ['meditations', 'meaning', 'sapiens', 'mockingbird', 'metamorphosis', 'thinking'],
    canonicalWorks: [
      {
        _id: 'canonical-meditations',
        title: 'Meditations',
        author: 'Marcus Aurelius',
        publishYear: 180,
        category: 'Non-Fiction',
        image: '/images/covers/meditations.jpg',
        excerpt: 'Private journal entries of Rome’s Stoic philosopher-emperor on duty, death, and self-mastery.',
        curatorBadge: 'Stoic Keystone',
        readingTime: '4 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-mans-search',
        title: "Man's Search for Meaning",
        author: 'Viktor E. Frankl',
        publishYear: 1946,
        category: 'Non-Fiction',
        image: '/images/covers/mans-search-for-meaning.jpg',
        excerpt: 'Psychiatrist Frankl outlines logotherapy and finding enduring purpose amidst adversity.',
        curatorBadge: 'Human Resilience',
        readingTime: '3.5 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-sapiens',
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        publishYear: 2011,
        category: 'Non-Fiction',
        image: '/images/covers/sapiens.jpg',
        excerpt: 'From cognitive revolution to AI, how an insignificant ape became the ruler of planet Earth.',
        curatorBadge: 'Cosmic Vantage',
        readingTime: '9.5 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-mockingbird',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publishYear: 1960,
        category: 'Fiction',
        image: '/images/covers/to-kill-a-mockingbird.jpg',
        excerpt: 'Scout Finch witnesses conscience and moral courage in the Jim Crow American South.',
        curatorBadge: 'Moral Clarity',
        readingTime: '6 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-metamorphosis',
        title: 'The Metamorphosis',
        author: 'Franz Kafka',
        publishYear: 1915,
        category: 'Fiction',
        image: '/images/covers/metamorphosis.jpg',
        excerpt: 'Gregor Samsa awakes to find himself transformed into a monstrous insect.',
        curatorBadge: 'Existential Icon',
        readingTime: '2 hrs',
        averageRating: 4.7,
      },
      {
        _id: 'canonical-thinking-fast-slow',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        publishYear: 2011,
        category: 'Non-Fiction',
        image: '/images/covers/thinking-fast-and-slow.jpg',
        excerpt: 'Nobel laureate Kahneman reveals the dual cognitive systems shaping intuition and choice.',
        curatorBadge: 'Cognitive Depth',
        readingTime: '9 hrs',
        averageRating: 4.8,
      },
    ],
  },
  {
    id: 'late-night',
    title: 'Late-Night Reads',
    tagline: 'Page-turners devoured while the world sleeps.',
    quote: 'I like large parties. They’re so intimate. At small parties there isn’t any privacy.',
    quoteAuthor: 'F. Scott Fitzgerald, The Great Gatsby',
    soundName: 'Midnight Hearth & Quiet Raindrop Tap',
    soundPreset: { rain: 0.45, fireplace: 0.4, clock: 0.15 },
    bgImage: '/images/login-reading-nook-hd.jpg',
    color: '#4B2544',
    accent: '#B884AA',
    keywords: ['great gatsby', 'shadow of the wind', 'norwegian wood', 'bell jar', 'stoner', 'kafka on the shore'],
    canonicalWorks: [
      {
        _id: 'canonical-great-gatsby',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publishYear: 1925,
        category: 'Fiction',
        image: '/images/covers/the-great-gatsby.jpg',
        excerpt: 'The shimmering green light of Long Island Sound, roaring decadence, and doomed idealism.',
        curatorBadge: 'Jazz Age Nocturne',
        readingTime: '3.5 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-shadow-of-wind',
        title: 'The Shadow of the Wind',
        author: 'Carlos Ruiz Zafón',
        publishYear: 2001,
        category: 'Fiction',
        image: '/images/covers/the-shadow-of-the-wind.jpg',
        excerpt: 'Barcelona, 1945. A boy is introduced to the secret Cemetery of Forgotten Books.',
        curatorBadge: 'Gothic Labyrinth',
        readingTime: '10 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-norwegian-wood',
        title: 'Norwegian Wood',
        author: 'Haruki Murakami',
        publishYear: 1987,
        category: 'Fiction',
        image: '/images/covers/norwegian-wood.jpg',
        excerpt: 'A nostalgic, atmospheric story of loss, sexuality, and student unrest in 1960s Tokyo.',
        curatorBadge: 'Nocturnal Melancholy',
        readingTime: '7 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-bell-jar',
        title: 'The Bell Jar',
        author: 'Sylvia Plath',
        publishYear: 1963,
        category: 'Fiction',
        image: '/images/covers/the-bell-jar.jpg',
        excerpt: 'Esther Greenwood navigates New York glamour and the suffocation of personal identity.',
        curatorBadge: 'Lyrical Rawness',
        readingTime: '5.5 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-stoner',
        title: 'Stoner',
        author: 'John Williams',
        publishYear: 1965,
        category: 'Fiction',
        image: '/images/covers/stoner.jpg',
        excerpt: 'The quiet, deeply moving life of an unassuming academic who finds sanctuary in literature.',
        curatorBadge: 'Quiet Perfection',
        readingTime: '6 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-kafka-shore',
        title: 'Kafka on the Shore',
        author: 'Haruki Murakami',
        publishYear: 2002,
        category: 'Fiction',
        image: '/images/covers/kafka-on-the-shore.jpg',
        excerpt: 'A teenage runaway and an elderly man who speaks to cats enter a metaphysical realm.',
        curatorBadge: 'Surreal Odyssey',
        readingTime: '11 hrs',
        averageRating: 4.8,
      },
    ],
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth & Craft',
    tagline: 'Habits, deep focus & clearer thinking.',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    quoteAuthor: 'James Clear, Atomic Habits',
    soundName: 'Precision Clockwork & Fountain Pen Scratch',
    soundPreset: { rain: 0.05, fireplace: 0.0, clock: 0.5 },
    bgImage: '/images/editorial/moodboard_reading_nook.jpg',
    color: '#3B362F',
    accent: '#C59A44',
    keywords: ['atomic habits', 'steve jobs', 'educated', 'thinking', 'beyond good and evil', 'alchemist'],
    canonicalWorks: [
      {
        _id: 'canonical-atomic-habits',
        title: 'Atomic Habits',
        author: 'James Clear',
        publishYear: 2018,
        category: 'Non-Fiction',
        image: '/images/covers/atomic-habits.jpg',
        excerpt: 'An evidence-based framework for tiny behavioral changes that compound into massive transformations.',
        curatorBadge: 'System Architecture',
        readingTime: '5 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-steve-jobs',
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        publishYear: 2011,
        category: 'Biography',
        image: '/images/covers/steve-jobs.jpg',
        excerpt: 'The unsparing biography of the visionary who revolutionized six technological industries.',
        curatorBadge: 'Creative Genius',
        readingTime: '13 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-educated',
        title: 'Educated',
        author: 'Tara Westover',
        publishYear: 2018,
        category: 'Memoir',
        image: '/images/covers/educated.jpg',
        excerpt: 'Raised off-grid in rural Idaho, Westover teaches herself mathematics to enter university at 17.',
        curatorBadge: 'Transformational',
        readingTime: '7 hrs',
        averageRating: 4.9,
      },
      {
        _id: 'canonical-thinking-fast-slow-craft',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        publishYear: 2011,
        category: 'Non-Fiction',
        image: '/images/covers/thinking-fast-and-slow.jpg',
        excerpt: 'How intuition, biases, and slow deliberative thinking shape every crucial decision.',
        curatorBadge: 'Mental Models',
        readingTime: '9 hrs',
        averageRating: 4.8,
      },
      {
        _id: 'canonical-beyond-good-evil',
        title: 'Beyond Good and Evil',
        author: 'Friedrich Nietzsche',
        publishYear: 1886,
        category: 'Philosophy',
        image: '/images/covers/beyond-good-and-evil.jpg',
        excerpt: 'A scathing philosophical critique of moral dogmatism and the celebration of independent thought.',
        curatorBadge: 'Philosophic Flame',
        readingTime: '6 hrs',
        averageRating: 4.7,
      },
      {
        _id: 'canonical-the-stranger',
        title: 'The Stranger',
        author: 'Albert Camus',
        publishYear: 1942,
        category: 'Philosophy',
        image: '/images/covers/the-stranger.jpg',
        excerpt: 'Through the absurd story of Meursault, Camus explores honesty, alienation, and existence.',
        curatorBadge: 'Absurdist Pillar',
        readingTime: '3 hrs',
        averageRating: 4.8,
      },
    ],
  },
];

const AtmosphereDrawer = ({ isOpen, onClose }) => {
  const [selectedAtmosphereId, setSelectedAtmosphereId] = useState('dark-academia');
  const [liveBooks, setLiveBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const { toggleBook, isBookSaved, count: shelfCount, setIsDrawerOpen: openShelfDrawer } = useContext(ReadingListContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  // Load books once when drawer is opened
  useEffect(() => {
    if (isOpen && liveBooks.length === 0) {
      setLoadingBooks(true);
      bookService
        .getAll({ limit: 100 })
        .then((res) => {
          setLiveBooks(res.data?.data || []);
        })
        .catch((err) => {
          console.warn('[AtmosphereDrawer] Could not fetch live books:', err);
        })
        .finally(() => {
          setLoadingBooks(false);
        });
    }
  }, [isOpen, liveBooks.length]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Stop ambient sound if drawer closes
  const handleClose = () => {
    if (isAudioPlaying) {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    }
    onClose();
  };

  const currentAtmosphere =
    ATMOSPHERES_DATA.find((a) => a.id === selectedAtmosphereId) || ATMOSPHERES_DATA[0];

  // Toggle procedural soundscape for current atmosphere
  const toggleAtmosphereAudio = () => {
    playWaxSealCrack();
    if (isAudioPlaying) {
      ambientAudio.stop();
      setIsAudioPlaying(false);
      enqueueSnackbar('Soundscape paused', { variant: 'default', autoHideDuration: 1800 });
    } else {
      const preset = currentAtmosphere.soundPreset;
      ambientAudio.setVolume('rain', preset.rain);
      ambientAudio.setVolume('fireplace', preset.fireplace);
      ambientAudio.setVolume('clock', preset.clock);
      ambientAudio.start();
      setIsAudioPlaying(true);
      enqueueSnackbar(`🎧 Playing ${currentAtmosphere.soundName}`, {
        variant: 'info',
        autoHideDuration: 2500,
      });
    }
  };

  // Switch active atmosphere tab
  const handleSelectAtmosphere = (id) => {
    playPaperUnwrap();
    setSelectedAtmosphereId(id);

    // If audio is already active, seamlessly retune the mix to the new atmosphere
    if (isAudioPlaying) {
      const targetAtmosphere = ATMOSPHERES_DATA.find((a) => a.id === id);
      if (targetAtmosphere) {
        const preset = targetAtmosphere.soundPreset;
        ambientAudio.setVolume('rain', preset.rain);
        ambientAudio.setVolume('fireplace', preset.fireplace);
        ambientAudio.setVolume('clock', preset.clock);
        enqueueSnackbar(`🎧 Retuned to ${targetAtmosphere.soundName}`, {
          variant: 'info',
          autoHideDuration: 2200,
        });
      }
    }
  };

  // Compile books for the active atmosphere, prioritizing canonical classics with 100% verified local covers
  const getAtmosphereBooks = () => {
    const canonical = currentAtmosphere.canonicalWorks || [];
    const keywords = currentAtmosphere.keywords || [];

    // Filter matching books from DB by keyword
    const matchedFromDb = liveBooks.filter((book) => {
      const text = `${book.title || ''} ${book.description || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    // Start with the curated canonical list, then attach any unique database matches
    const combined = [...canonical];
    for (const dbBook of matchedFromDb) {
      const titleLower = dbBook.title?.toLowerCase().trim();
      const alreadyPresent = combined.some((b) => b.title?.toLowerCase().trim() === titleLower);
      if (!alreadyPresent) {
        // Resolve real book cover using imageHelper
        const resolvedCover = getBookCoverUrl(dbBook.image, dbBook.title, dbBook.isbn);
        combined.push({
          ...dbBook,
          image: resolvedCover || dbBook.image,
          excerpt: dbBook.description ? `${dbBook.description.slice(0, 100)}...` : 'Curated sanctuary edition.',
          curatorBadge: dbBook.category || 'Curated Work',
          averageRating: dbBook.rating || 4.8,
        });
      }
    }
    return combined.slice(0, 6);
  };

  const booksToDisplay = getAtmosphereBooks();

  // Handle Add to Shelf action
  const handleToggleShelf = (book) => {
    playPaperUnwrap();
    const coverToSave = getBookCoverUrl(book.image, book.title, book.isbn) || book.image;

    toggleBook({
      _id: book._id,
      title: book.title,
      author: book.author,
      publishYear: book.publishYear,
      category: book.category,
      image: coverToSave,
      averageRating: book.averageRating || 5,
    });

    const isNowSaved = !isBookSaved(book._id);
    if (isNowSaved) {
      playWaxSealCrack();
      enqueueSnackbar(`📖 Added "${book.title}" to your sanctuary shelf!`, {
        variant: 'success',
        autoHideDuration: 2500,
      });
    } else {
      enqueueSnackbar(`Removed "${book.title}" from your shelf`, {
        variant: 'default',
        autoHideDuration: 2000,
      });
    }
  };

  // Navigate to Discover filtered by this atmosphere
  const handleFilterDiscover = () => {
    handleClose();
    if (location.pathname === '/') {
      const el = document.getElementById('curated-collections');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/?scrollTo=curated-collections');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="atmosphere-drawer-title"
    >
      {/* 1. BACKDROP OVERLAY */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* 2. DRAWER CONTAINER */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[600px] sm:max-w-[650px] bg-[#FAF7F2] border-l border-[#E2D5C3] shadow-2xl flex flex-col relative overflow-hidden text-[#2F2620] animate-drawer-in">
          
          {/* A. EDITORIAL MASTHEAD */}
          <header className="px-6 py-5 bg-[#F6F1E8] border-b border-[#E5DACB] relative flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/20 text-[10px] font-mono uppercase tracking-widest font-semibold mb-1.5">
                  <PiSparkleBold className="text-[11px]" />
                  <span>Curated Anthologies</span>
                </div>
                <h2
                  id="atmosphere-drawer-title"
                  className="font-serif text-2xl font-semibold text-[#2F2620] tracking-tight"
                >
                  Curated Atmospheres
                </h2>
                <p className="text-xs text-[#7A6E64] font-serif italic mt-0.5">
                  Immerse in aesthetic realms, tailored soundscapes, and companion literature.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close collections drawer"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] hover:bg-[#8D263B] text-[#7A6E64] hover:text-[#FFFDF9] border border-[#E2D5C3] shadow-2xs flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <PiXBold className="text-xs" />
              </button>
            </div>

            {/* B. ATMOSPHERIC SELECTOR PILLS (2-Row Responsive Grid — Zero Cutoffs) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-3.5">
              {ATMOSPHERES_DATA.map((atm) => {
                const isActive = atm.id === selectedAtmosphereId;
                return (
                  <button
                    key={atm.id}
                    type="button"
                    onClick={() => handleSelectAtmosphere(atm.id)}
                    className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium text-center transition-all duration-200 cursor-pointer truncate ${
                      isActive
                        ? 'bg-[#8D263B] text-[#FFFDF9] shadow-xs font-semibold ring-1 ring-[#8D263B]'
                        : 'bg-[#FFFDF9] text-[#63574E] hover:text-[#8D263B] hover:bg-[#FFFDF9]/80 border border-[#E5DACB]'
                    }`}
                    title={atm.title}
                  >
                    {atm.title}
                  </button>
                );
              })}
            </div>
          </header>

          {/* C. SCROLLABLE ATMOSPHERIC CONTENT BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            
            {/* HERO ATMOSPHERE SHOWCASE CARD (Glow Border & High-Res Artwork) */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C6A16B]/40 shadow-lg bg-[#1B1612] text-white">
              {/* Background Cover Image with Gradient */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${currentAtmosphere.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140F0C] via-[#140F0C]/85 to-[#140F0C]/50" />

              {/* Atmosphere Details Overlay */}
              <div className="relative p-5 sm:p-6 z-10 flex flex-col justify-between min-h-[230px]">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#E8C28A] font-semibold flex items-center gap-1.5">
                      <span className="text-[#C6A16B]">✦</span>
                      <span>Atmosphere No. {ATMOSPHERES_DATA.findIndex((a) => a.id === currentAtmosphere.id) + 1}</span>
                    </span>

                    {/* Works Count Badge */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-white/90 border border-white/20">
                      {booksToDisplay.length} Works Curated
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-white drop-shadow-sm tracking-tight mb-1.5">
                    {currentAtmosphere.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans leading-relaxed max-w-md">
                    {currentAtmosphere.tagline}
                  </p>
                </div>

                {/* Literary Quote & Audio Soundscape Dock */}
                <div className="pt-3.5 border-t border-white/15 mt-3 space-y-3">
                  <div className="bg-black/35 rounded-xl p-3 border border-white/10">
                    <p className="text-xs italic font-serif text-[#F8E8CD] leading-relaxed">
                      &ldquo;{currentAtmosphere.quote}&rdquo;
                    </p>
                    <span className="block text-[10.5px] font-sans text-stone-400 mt-1">
                      &mdash; {currentAtmosphere.quoteAuthor}
                    </span>
                  </div>

                  {/* Procedural Soundscape Controller Bar */}
                  <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/60 border border-[#E8C28A]/30 backdrop-blur-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                          isAudioPlaying
                            ? 'bg-[#E8C28A] text-[#2F2620]'
                            : 'bg-white/15 text-white/80'
                        }`}
                      >
                        <PiSpeakerHighBold />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-white block truncate">
                          {currentAtmosphere.soundName}
                        </span>
                        <span className="text-[9.5px] font-mono text-stone-400 block">
                          Procedural Soundscape &bull; Offline Capable
                        </span>
                      </div>
                    </div>

                    {/* Sound Play/Pause Button */}
                    <button
                      type="button"
                      onClick={toggleAtmosphereAudio}
                      className={`h-7 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer flex-shrink-0 ${
                        isAudioPlaying
                          ? 'bg-[#E8C28A] text-[#2F2620] hover:bg-[#F3D7A8] shadow-sm font-semibold'
                          : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                      }`}
                    >
                      {isAudioPlaying ? (
                        <>
                          <PiPauseBold className="text-[10px]" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PiPlayBold className="text-[10px]" />
                          <span>Play Vibe</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CURATED COMPANION BOOKS SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <PiBooksBold className="text-base text-[#8D263B]" />
                  <h4 className="font-serif text-lg font-semibold text-[#2F2620]">
                    Anthology Selections
                  </h4>
                </div>
                <span className="text-xs text-[#7A6E64] font-mono">
                  1-Click &ldquo;+ Shelf&rdquo;
                </span>
              </div>

              {loadingBooks ? (
                <div className="py-12 text-center text-xs text-[#7A6E64] font-serif italic">
                  Fetching atmospheric volumes from the library...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {booksToDisplay.map((book) => {
                    const isSaved = isBookSaved(book._id);
                    const coverUrl = getBookCoverUrl(book.image, book.title, book.isbn) || '/images/covers/the-picture-of-dorian-gray.jpg';

                    return (
                      <div
                        key={book._id || book.title}
                        className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#E5DACB] hover:border-[#8D263B]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                      >
                        {/* Top: Cover + Details */}
                        <div className="flex gap-3">
                          <div className="w-14 h-20 rounded-md overflow-hidden bg-[#EFE7DC] border border-[#E2D5C3] flex-shrink-0 relative shadow-2xs group-hover:scale-103 transition-transform duration-200">
                            <img
                              src={coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/covers/the-picture-of-dorian-gray.jpg';
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            {book.curatorBadge && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C6A16B]/15 text-[#8D263B] font-semibold tracking-wider mb-1 inline-block">
                                {book.curatorBadge}
                              </span>
                            )}
                            <h5
                              className="font-serif text-sm font-bold text-[#2F2620] group-hover:text-[#8D263B] transition-colors leading-snug line-clamp-2"
                              title={book.title}
                            >
                              {book.title}
                            </h5>
                            <p className="text-xs text-[#7A6E64] font-sans truncate mt-0.5">
                              {book.author}
                            </p>
                            <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#9C8F85] mt-1.5">
                              <span>{book.publishYear || 'Classic'}</span>
                              <span>&bull;</span>
                              <span>{book.readingTime || book.category || 'Literary'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Excerpt / Annotation */}
                        {book.excerpt && (
                          <p className="text-[11px] text-[#54483F] font-serif italic line-clamp-2 my-2.5 leading-relaxed bg-[#FAF5EE] p-2 rounded-lg border border-[#EDE3D6]">
                            &ldquo;{book.excerpt}&rdquo;
                          </p>
                        )}

                        {/* Action Dock: 1-Click + Shelf */}
                        <div className="pt-2 border-t border-[#EFE7DC] flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[10px] font-mono text-[#7A6E64] flex items-center gap-1">
                            <PiStarFill className="text-[#C6A16B] text-[10px]" />
                            <span>{book.averageRating || '4.8'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleShelf(book)}
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                              isSaved
                                ? 'bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/30 hover:bg-[#8D263B]/20 font-semibold'
                                : 'bg-[#8D263B] hover:bg-[#67202F] text-white shadow-2xs hover:shadow-sm'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <PiCheckBold className="text-[11px]" />
                                <span>In Shelf</span>
                              </>
                            ) : (
                              <>
                                <PiPlusBold className="text-[11px]" />
                                <span>+ Shelf</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CURATOR'S READING RITUAL TIP */}
            <div className="p-4 rounded-xl bg-[#F6F1E8] border border-[#E2D5C3] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8D263B]/10 text-[#8D263B] flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <PiFeatherBold />
              </div>
              <div>
                <h6 className="text-xs font-semibold text-[#2F2620] uppercase font-mono tracking-wider">
                  Curator&rsquo;s Atmospheric Ritual
                </h6>
                <p className="text-xs text-[#63574E] leading-relaxed mt-1 font-serif">
                  Turn on the ambient audio vibe above, set your device to quiet mode, and add 2–3 companion volumes to your shelf to read in uninterrupted stillness.
                </p>
              </div>
            </div>
          </div>

          {/* D. BOTTOM ACTION BAR */}
          <footer className="px-6 py-4 bg-[#F6F1E8] border-t border-[#E5DACB] flex items-center justify-between gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleFilterDiscover}
              className="text-xs font-medium text-[#8D263B] hover:text-[#67202F] flex items-center gap-1.5 cursor-pointer py-1"
            >
              <PiCompassBold className="text-sm" />
              <span>Explore on Discover</span>
              <PiArrowRightBold className="text-[10px]" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleClose();
                openShelfDrawer(true);
              }}
              className="px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDF9] text-xs font-medium flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer cute-press"
            >
              <PiBookmarkSimpleBold className="text-xs" />
              <span>View My Shelf ({shelfCount})</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AtmosphereDrawer;
