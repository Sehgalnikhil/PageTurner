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

// 6 Curated Atmospheric Anthologies with authentic literary themes, quotes, and soundscapes
export const ATMOSPHERES_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    motif: '🏛️',
    romanNumeral: 'I',
    curatorSubtitle: 'Gothic Obsession & Intellectual Longing',
    tagline: 'Gothic obsession, classical libraries & intellectual longing.',
    quote: 'I want to live quietly, secluded from the turmoil of people, with good books.',
    quoteAuthor: 'Donna Tartt, The Secret History',
    soundName: 'Cathedral Rain & Grandfather Clock',
    soundPreset: { rain: 0.5, fireplace: 0.0, clock: 0.3 },
    bgImage: '/images/salon-hero-backdrop.jpg',
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
    motif: '🌌',
    romanNumeral: 'II',
    curatorSubtitle: 'Dystopias & Cosmic Frontiers',
    tagline: 'Dystopias, speculative frontiers & cosmic curiosity.',
    quote: 'The mystery of life isn’t a problem to solve, but a reality to experience.',
    quoteAuthor: 'Frank Herbert, Dune',
    soundName: 'Cosmic Rain & Monastic Tone',
    soundPreset: { rain: 0.55, fireplace: 0.0, clock: 0.15 },
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85',
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
    motif: '☕',
    romanNumeral: 'III',
    curatorSubtitle: 'Solace, Warm Hearths & Gentle Worlds',
    tagline: 'Solace, gentle hearths & warm pastoral worlds.',
    quote: 'There is nothing like staying at home for real comfort.',
    quoteAuthor: 'Jane Austen, Emma',
    soundName: 'Hearthside Crackle & Herbal Tea',
    soundPreset: { rain: 0.1, fireplace: 0.55, clock: 0.05 },
    bgImage: '/images/editorial/moodboard_open_book.jpg',
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
    motif: '🧭',
    romanNumeral: 'IV',
    curatorSubtitle: 'Philosophy & Radical Empathy',
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
    motif: '🕯️',
    romanNumeral: 'V',
    curatorSubtitle: 'Nocturnal Page-Turners & Shadows',
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
    motif: '🖋️',
    romanNumeral: 'VI',
    curatorSubtitle: 'Systems, Deep Work & Lifelong Mastery',
    tagline: 'Habits, deep focus & clearer thinking.',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    quoteAuthor: 'James Clear, Atomic Habits',
    soundName: 'Precision Clockwork & Fountain Pen Scratch',
    soundPreset: { rain: 0.05, fireplace: 0.0, clock: 0.5 },
    bgImage: '/images/signup-desk-scene-hd.jpg',
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
      {/* 1. BACKDROP OVERLAY WITH VINTAGE DIMMING */}
      <div
        className="absolute inset-0 bg-stone-950/65 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* 2. DRAWER CONTAINER */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[620px] sm:max-w-[680px] bg-[#FAF7F2] border-l border-[#D8C6AE] shadow-[-20px_0_60px_rgba(25,18,12,0.4)] flex flex-col relative overflow-hidden text-[#2F2620] animate-drawer-in">
          
          {/* TOP DECORATIVE BURGUNDY & GOLD ACCENT STRIP */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#4A0E18] via-[#8D263B] to-[#C6A16B]" />

          {/* A. EDITORIAL MASTHEAD WITH WAX SEAL BRANDING */}
          <header className="px-6 sm:px-7 pt-5 pb-4 bg-[#F5EDE1] border-b border-[#E5DACB] relative flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/25 text-[10px] font-mono uppercase tracking-[0.2em] font-semibold mb-2">
                  <span className="text-[#C6A16B]">✦</span>
                  <span>Ex-Libris Atmospheric Anthologies</span>
                </div>
                <h2
                  id="atmosphere-drawer-title"
                  className="font-serif text-[26px] sm:text-[28px] font-bold text-[#2A1E17] tracking-tight leading-none"
                >
                  Curated Atmospheres
                </h2>
                <p className="text-xs text-[#7A6C60] font-serif italic mt-1.5 leading-relaxed">
                  Hand-selected reading realms, immersive procedural soundscapes &amp; companion volumes.
                </p>
              </div>

              {/* Close Button — Tactile Brass Coin Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close collections drawer"
                className="w-9 h-9 rounded-full bg-[#FFFDF9] hover:bg-[#8D263B] text-[#7A6C60] hover:text-[#FFFDF9] border border-[#D8C7B2] shadow-sm flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <PiXBold className="text-sm" />
              </button>
            </div>

            {/* B. ATMOSPHERIC INDEX SELECTOR TABS (2-Row Responsive Grid of Embossed Badges) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4">
              {ATMOSPHERES_DATA.map((atm) => {
                const isActive = atm.id === selectedAtmosphereId;
                return (
                  <button
                    key={atm.id}
                    type="button"
                    onClick={() => handleSelectAtmosphere(atm.id)}
                    className={`px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 relative group border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6E1929] to-[#8D263B] text-[#FFFDF9] border-[#C6A16B] shadow-md shadow-[#8D263B]/20 scale-[1.02]'
                        : 'bg-[#FFFDF9] text-[#54463C] hover:text-[#8D263B] hover:bg-[#FFFDF9] hover:border-[#8D263B]/40 border-[#E5DACB] shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">{atm.motif}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`block text-[11.5px] font-serif font-bold leading-tight truncate ${
                        isActive ? 'text-[#FFFDF9]' : 'text-[#352920] group-hover:text-[#8D263B]'
                      }`}>
                        {atm.title}
                      </span>
                      <span className={`block text-[9px] font-mono tracking-wider uppercase mt-0.5 truncate ${
                        isActive ? 'text-[#E8C28A]' : 'text-[#9B8C7E]'
                      }`}>
                        Vol. {atm.romanNumeral}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </header>

          {/* C. SCROLLABLE ATMOSPHERIC CONTENT BODY */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-5 space-y-6">
            
            {/* HERO ATMOSPHERE FOLIO SHOWCASE CARD (Gold Filigree & Visible Artwork) */}
            <div className="relative rounded-2xl overflow-hidden border border-[#C6A16B]/60 shadow-[0_14px_40px_rgba(28,16,10,0.35)] bg-[#19120E] text-white">
              
              {/* Cinematic Background Imagery with Visible Texture */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out opacity-65"
                style={{ backgroundImage: `url(${currentAtmosphere.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140D09] via-[#1A110C]/80 to-[#2A1218]/50" />

              {/* Decorative Gold Filigree Corner Accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#E8C28A]/80 z-20 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#E8C28A]/80 z-20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#E8C28A]/80 z-20 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#E8C28A]/80 z-20 pointer-events-none" />

              {/* Atmosphere Details Overlay */}
              <div className="relative p-5 sm:p-6 z-10 flex flex-col justify-between min-h-[250px]">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#E8C28A] font-semibold flex items-center gap-1.5">
                      <span className="text-[#C6A16B]">✦</span>
                      <span>Atmosphere Vol. {currentAtmosphere.romanNumeral}</span>
                    </span>

                    {/* Curated Works Badge */}
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 text-[#E8C28A] border border-[#C6A16B]/40 shadow-xs">
                      {booksToDisplay.length} Works Curated
                    </span>
                  </div>

                  <h3 className="font-serif text-[28px] sm:text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBF2] via-[#FCE9D0] to-[#E5BE84] drop-shadow-sm tracking-tight leading-none mb-2">
                    {currentAtmosphere.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans leading-relaxed max-w-lg">
                    {currentAtmosphere.tagline}
                  </p>
                </div>

                {/* Literary Quote & Audio Soundscape Dock */}
                <div className="pt-4 border-t border-white/20 mt-4 space-y-3">
                  
                  {/* Parchment Quote Slip */}
                  <div className="bg-[#140E0A]/85 rounded-xl p-3.5 border border-[#C6A16B]/35 shadow-inner backdrop-blur-md">
                    <span className="font-serif text-2xl text-[#C6A16B] leading-none select-none block -mb-2">“</span>
                    <p className="font-serif italic text-xs sm:text-[13px] text-[#FBF2E3] leading-relaxed pl-2">
                      {currentAtmosphere.quote}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-2 pr-1">
                      <span className="h-[1px] w-8 bg-[#C6A16B]/40" />
                      <span className="text-[10px] font-mono tracking-wider text-[#E8C28A] uppercase">
                        &mdash; {currentAtmosphere.quoteAuthor}
                      </span>
                    </div>
                  </div>

                  {/* Analog Soundscape Console Bar */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#1A120D]/90 border border-[#C6A16B]/40 shadow-md backdrop-blur-md">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                          isAudioPlaying
                            ? 'bg-[#C6A16B] text-[#241710] shadow-[0_0_12px_rgba(198,161,107,0.6)]'
                            : 'bg-white/10 text-[#C6A16B] border border-white/10'
                        }`}
                      >
                        <PiSpeakerHighBold className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-semibold text-[#FFFDF9] truncate">
                            {currentAtmosphere.soundName}
                          </span>
                          {isAudioPlaying && (
                            <span className="flex items-center gap-0.5">
                              <span className="w-1 bg-[#C6A16B] rounded-full animate-wave-1" style={{ height: '10px' }} />
                              <span className="w-1 bg-[#C6A16B] rounded-full animate-wave-2" style={{ height: '14px' }} />
                              <span className="w-1 bg-[#C6A16B] rounded-full animate-wave-3" style={{ height: '8px' }} />
                            </span>
                          )}
                        </div>
                        <span className="text-[9.5px] font-mono text-[#D4B282]/80 flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAudioPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
                          <span>{isAudioPlaying ? 'Live Ambient Soundscape Active' : 'Procedural Audio Synthesis • Offline Capable'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Sound Play/Pause Button */}
                    <button
                      type="button"
                      onClick={toggleAtmosphereAudio}
                      className={`h-8 px-3.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer flex-shrink-0 cute-press ${
                        isAudioPlaying
                          ? 'bg-[#C6A16B] text-[#241710] hover:bg-[#D9B67C] font-semibold shadow-md'
                          : 'bg-white/15 text-[#FFFDF9] hover:bg-white/25 border border-white/20'
                      }`}
                    >
                      {isAudioPlaying ? (
                        <>
                          <PiPauseBold className="text-[11px]" />
                          <span>Pause Vibe</span>
                        </>
                      ) : (
                        <>
                          <PiPlayBold className="text-[11px] text-[#C6A16B]" />
                          <span>Play Vibe</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CURATED ANTHOLOGY COMPANION BOOKS SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#8D263B]/10 text-[#8D263B] flex items-center justify-center text-xs">
                    <PiBooksBold />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#2A1E17]">
                    Anthology Selections
                  </h4>
                  <span className="text-xs text-[#8D263B] font-mono font-medium">
                    &bull; {booksToDisplay.length} Volumes
                  </span>
                </div>
                <span className="text-[11px] text-[#7A6C60] font-mono">
                  1-Click &ldquo;+ Shelf&rdquo;
                </span>
              </div>

              {loadingBooks ? (
                <div className="py-12 text-center text-xs text-[#7A6C60] font-serif italic">
                  Fetching atmospheric volumes from the library...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booksToDisplay.map((book) => {
                    const isSaved = isBookSaved(book._id);
                    const coverUrl = getBookCoverUrl(book.image, book.title, book.isbn) || '/images/covers/the-picture-of-dorian-gray.jpg';

                    return (
                      <div
                        key={book._id || book.title}
                        className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E8DEC8] hover:border-[#8D263B]/50 hover:shadow-[0_12px_28px_rgba(50,30,20,0.12)] transition-all duration-300 flex flex-col justify-between group/book relative overflow-hidden"
                      >
                        {/* Top: 3D Hardcover Spine + Book Details */}
                        <div className="flex gap-3.5">
                          <div className="relative w-16 h-24 rounded-[4px] overflow-hidden flex-shrink-0 shadow-[0_6px_16px_rgba(40,25,15,0.22)] group-hover/book:scale-105 group-hover/book:-rotate-1 transition-all duration-300 bg-[#E8DDD0]">
                            {/* 3D Spine highlight fold on left */}
                            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/45 via-black/15 to-transparent z-10 pointer-events-none" />
                            {/* Specular book gloss */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/25 pointer-events-none z-10" />
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
                              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#8D263B]/10 text-[#8D263B] font-semibold border border-[#8D263B]/20 inline-block mb-1">
                                {book.curatorBadge}
                              </span>
                            )}
                            <h5
                              className="font-serif text-[15px] sm:text-[16px] font-bold text-[#2A1E17] group-hover/book:text-[#8D263B] transition-colors leading-snug line-clamp-2"
                              title={book.title}
                            >
                              {book.title}
                            </h5>
                            <p className="text-xs text-[#7A6C60] font-sans truncate mt-0.5">
                              {book.author}
                            </p>
                            <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#9B8C7E] mt-1.5">
                              <span>{book.publishYear || 'Classic'}</span>
                              <span>&bull;</span>
                              <span>{book.readingTime || book.category || 'Literary'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Deckle-Edge Marginalia Excerpt Ribbon */}
                        {book.excerpt && (
                          <div className="bg-[#FAF6EE] border-l-2 border-[#C6A16B] p-2.5 rounded-r-lg my-3 shadow-2xs">
                            <p className="text-[11px] font-serif italic text-[#4A3D34] leading-relaxed line-clamp-2">
                              &ldquo;{book.excerpt}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Action Dock: 1-Click + Shelf */}
                        <div className="pt-2.5 border-t border-[#F0E6D8] flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[10px] font-mono text-[#7A6C60] flex items-center gap-1 font-semibold">
                            <PiStarFill className="text-[#C6A16B] text-[11px]" />
                            <span>{book.averageRating || '4.8'}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleShelf(book)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 cursor-pointer cute-press ${
                              isSaved
                                ? 'bg-[#C6A16B]/15 text-[#67202F] border border-[#C6A16B] font-semibold shadow-2xs'
                                : 'bg-[#8D263B] hover:bg-[#67202F] text-white shadow-sm hover:shadow-md'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <PiCheckBold className="text-[11px] text-[#C6A16B]" />
                                <span>In Sanctuary</span>
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

            {/* CURATOR'S READING RITUAL NOTE (Archival Manuscript Memo) */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F5EDE1] border border-[#D8C7B2] flex items-start gap-3.5 shadow-2xs relative overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#8D263B]/10 text-[#8D263B] flex items-center justify-center text-base flex-shrink-0 mt-0.5 border border-[#8D263B]/20">
                <PiFeatherBold />
              </div>
              <div>
                <h6 className="text-xs font-bold text-[#2A1E17] uppercase font-mono tracking-wider flex items-center gap-2">
                  <span>Chief Curator&rsquo;s Reading Ritual</span>
                  <span className="text-[#C6A16B] text-[9px]">✦</span>
                </h6>
                <p className="text-xs text-[#5D5046] leading-relaxed mt-1 font-serif">
                  Engage the procedural ambient soundscape above, dim your screen lighting, and save 2–3 companion volumes to your shelf to read in quiet, uninterrupted contemplation.
                </p>
              </div>
            </div>
          </div>

          {/* D. BOTTOM ACTION BAR (Double Gilded Trim) */}
          <footer className="px-6 sm:px-7 py-4 bg-[#F5EDE1] border-t border-[#E5DACB] flex items-center justify-between gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleFilterDiscover}
              className="text-xs font-medium text-[#8D263B] hover:text-[#67202F] flex items-center gap-1.5 cursor-pointer py-1 group/btn"
            >
              <PiCompassBold className="text-sm text-[#C6A16B] group-hover/btn:rotate-45 transition-transform duration-300" />
              <span>Explore on Discover</span>
              <PiArrowRightBold className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleClose();
                openShelfDrawer(true);
              }}
              className="px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDF9] text-xs font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer cute-press"
            >
              <PiBookmarkSimpleBold className="text-xs text-[#C6A16B]" />
              <span>View My Shelf ({shelfCount})</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AtmosphereDrawer;
