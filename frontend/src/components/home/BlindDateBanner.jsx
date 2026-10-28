import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiSparkleBold,
  PiHeartFill,
  PiArrowRightBold,
  PiEyeBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiArrowsClockwiseBold,
  PiStarFill,
  PiBookOpenBold,
  PiCompassBold,
  PiFeatherBold,
  PiCheckBold,
} from 'react-icons/pi';
import { ReadingListContext } from '../../context/ReadingListContext';
import { playWaxSealCrack, playPaperUnwrap, playRevealChime } from '../../utils/soundEffects';

// Curated atmospheric clues strictly following:
// 1. Atmosphere or Setting
// 2. Genre or Narrative Style
// 3. Theme or Reading Mood
const CURATED_MYSTERY_CLUES = {
  'The Picture of Dorian Gray': {
    atmosphere: 'Victorian London salons, shadowed opium dens, and an artist’s quiet studio.',
    genre: 'Gothic philosophical classic steeped in decadent aestheticism.',
    theme: 'Vanity, eternal youth, and the hidden rot of a compromised soul.',
    tagline: '“The only way to get rid of a temptation is to yield to it.”',
    accent: '#5B1E28',
  },
  '1984': {
    atmosphere: 'A bleak, rain-soaked superstate monitored by ever-vigilant telescreens.',
    genre: 'Prophetic dystopian political fiction and psychological suspense.',
    theme: 'Memory, forbidden human intimacy, and defiance against absolute power.',
    tagline: '“Freedom is the freedom to say that two plus two make four.”',
    accent: '#262D36',
  },
  'Dune': {
    atmosphere: 'A vast desert planet where water is currency and sand hides ancient titans.',
    genre: 'Grand interstellar science fiction epic with mythic political intrigue.',
    theme: 'Prophecy, ecological fragility, empire, and mastering mortal fear.',
    tagline: '“Fear is the mind-killer.”',
    accent: '#3E2A1B',
  },
  'Crime and Punishment': {
    atmosphere: 'Claustrophobic garrets and murky Saint Petersburg canal bridges.',
    genre: 'Intense psychological realism and moral detective drama.',
    theme: 'Guilt, rationalized transgression, and the painful path to redemption.',
    tagline: '“Pain and suffering are always inevitable for a large intelligence.”',
    accent: '#33201D',
  },
  'Pride and Prejudice': {
    atmosphere: 'Regency English country estates, candlelit ballrooms, and rolling grounds.',
    genre: 'Classic comedy of manners with sharp, witty romantic prose.',
    theme: 'First impressions, societal vanity, and discovering authentic mutual respect.',
    tagline: '“My good opinion once lost, is lost forever.”',
    accent: '#362B24',
  },
  "Man's Search for Meaning": {
    atmosphere: 'The stark, bitter winter barracks of wartime captivity.',
    genre: 'Existential memoir and foundational psychological philosophy.',
    theme: 'Human resilience, inner liberty, and discovering purpose in the face of suffering.',
    tagline: '“He who has a why to live can bear almost any how.”',
    accent: '#2A3026',
  },
  'Fahrenheit 451': {
    atmosphere: 'A neon-lit dystopia where mechanical hounds roam and kerosene hoses burn.',
    genre: 'Speculative fiction with poetic, cautionary urgency.',
    theme: 'Censorship, the sanctity of literature, and preserving human memory.',
    tagline: '“It was a pleasure to burn.”',
    accent: '#421E18',
  },
  'The Great Gatsby': {
    atmosphere: 'Jazz Age Long Island shores, champagne gardens, and a lone green dock light.',
    genre: 'Tragic American classic with shimmering, lyrical prose.',
    theme: 'Nostalgia, impossible romantic ideals, and the illusion of reinvention.',
    tagline: '“So we beat on, boats against the current, borne back ceaselessly into the past.”',
    accent: '#2A243A',
  },
  'The Hobbit': {
    atmosphere: 'A cozy subterranean hearth leading to misty mountain peaks and dragon lairs.',
    genre: 'Mythic high fantasy and timeless folkloric adventure.',
    theme: 'Unexpected courage in small beings, camaraderie, and homecoming.',
    tagline: '“In a hole in the ground there lived a hobbit.”',
    accent: '#1F3327',
  },
  'The Alchemist': {
    atmosphere: 'Sun-drenched Andalusian hills, Moroccan bazaars, and the sweeping Sahara.',
    genre: 'Allegorical philosophical fable written with luminous simplicity.',
    theme: 'Listening to the heart, reading omens, and pursuing your personal destiny.',
    tagline: '“When you want something, all the universe conspires in helping you achieve it.”',
    accent: '#3D2F1D',
  },
};

// Safe fallback clues derived strictly from active book metadata
const deriveCluesFromBook = (book) => {
  if (!book) {
    return {
      atmosphere: 'An evocative world captured in timeless literary prose.',
      genre: 'Classic narrative literature from our curated collection.',
      theme: 'The enduring human condition, choice, and discovery.',
      tagline: 'A story waiting to be read without preconceptions.',
      accent: '#3A2824',
    };
  }

  // 1. Atmosphere / Setting Clue
  let atmosphere = '';
  const desc = book.description || '';
  if (desc.toLowerCase().includes('london')) atmosphere = 'Fog-cloaked London streets and historic drawing rooms.';
  else if (desc.toLowerCase().includes('paris')) atmosphere = 'The atmospheric boulevards and quiet quarters of Paris.';
  else if (desc.toLowerCase().includes('space') || desc.toLowerCase().includes('planet') || desc.toLowerCase().includes('star')) {
    atmosphere = 'A far-flung cosmic frontier where civilizations collide.';
  } else if (desc.toLowerCase().includes('desert')) atmosphere = 'Vast, unforgiving desert sands shaped by howling winds.';
  else if (desc.toLowerCase().includes('sea') || desc.toLowerCase().includes('ocean')) atmosphere = 'Wind-lashed seas and the mystery of deep open waters.';
  else if (book.publishYear) {
    atmosphere = `The distinctive social atmosphere of the ${book.publishYear} era.`;
  } else {
    atmosphere = 'An immersive literary world rich in period ambiance.';
  }

  // 2. Genre / Narrative Style Clue
  const genre = `${book.category || 'Literary Fiction'} storytelling crafted with ${
    book.pageCount && book.pageCount > 350 ? 'sweeping, panoramic' : 'focused, elegant'
  } narrative depth.`;

  // 3. Theme / Reading Mood Clue
  let theme = 'Identity, moral dilemmas, and the transformative power of perspective.';
  if (desc.toLowerCase().includes('love') || desc.toLowerCase().includes('romance')) {
    theme = 'Longing, societal expectations, and the trials of the human heart.';
  } else if (desc.toLowerCase().includes('freedom') || desc.toLowerCase().includes('truth') || desc.toLowerCase().includes('war')) {
    theme = 'Freedom of conscience, moral courage, and defiance against circumstance.';
  } else if (desc.toLowerCase().includes('murder') || desc.toLowerCase().includes('mystery') || desc.toLowerCase().includes('crime')) {
    theme = 'Guilt, retribution, and the psychological labyrinth of conscience.';
  } else if (book.category === 'Non-Fiction' || book.category === 'Philosophy') {
    theme = 'Profound existential insight, human resilience, and the search for purpose.';
  }

  return {
    atmosphere,
    genre,
    theme,
    tagline: 'A book chosen by fate, waiting for your hands to break the seal.',
    accent: '#3A2824',
  };
};

const DEFAULT_CANDIDATE_BOOKS = [
  {
    _id: '6ad86169d32fdfa6ea3d36af',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    publishYear: 1890,
    category: 'Fiction',
    pageCount: 254,
    averageRating: 5,
    image: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
    description: 'Enthralled by his own youth and beauty in a painted portrait, Dorian Gray trades his soul to ensure the portrait ages while he remains eternally young.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d366b',
    title: '1984',
    author: 'George Orwell',
    publishYear: 1949,
    category: 'Sci-Fi',
    pageCount: 328,
    averageRating: 4.8,
    image: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    description: 'Winston Smith struggles against the omnipresent eye of Big Brother in a totalitarian superstate that controls reality itself.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d3683',
    title: 'Dune',
    author: 'Frank Herbert',
    publishYear: 1965,
    category: 'Sci-Fi',
    pageCount: 688,
    averageRating: 4.9,
    image: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    description: 'A sweeping sci-fi epic set on the desert planet Arrakis, where noble houses battle for the most precious resource in the universe: the spice melange.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d3673',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publishYear: 1813,
    category: 'Fiction',
    pageCount: 432,
    averageRating: 4.9,
    image: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    description: 'Elizabeth Bennet navigates the turbulent waters of societal expectations, family pressures, and the haughty Mr. Darcy.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d3697',
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    publishYear: 1866,
    category: 'Fiction',
    pageCount: 545,
    averageRating: 4.8,
    image: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
    description: 'A desperate former student in Saint Petersburg formulates a dangerous theory of moral supremacy, testing it with a fateful act that unravels his psyche.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d36b3',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    publishYear: 1946,
    category: 'Non-Fiction',
    pageCount: 165,
    averageRating: 4.9,
    image: 'https://covers.openlibrary.org/b/isbn/9780807014295-L.jpg',
    description: 'Psychiatrist Viktor Frankl explores his experiences in concentration camps and introduces logotherapy, emphasizing the primary human drive to find meaning.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d36a3',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    publishYear: 1953,
    category: 'Sci-Fi',
    pageCount: 249,
    averageRating: 4.7,
    image: 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
    description: 'In a dystopian future, books are banned and critical thought suppressed. Guy Montag is a fireman whose job is to burn books, until a chance encounter awakens his curiosity.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d366f',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishYear: 1925,
    category: 'Fiction',
    pageCount: 180,
    averageRating: 4.6,
    image: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    description: 'Set in the Roaring Twenties, this tale explores themes of decadence, idealism, and social upheaval through the eyes of Nick Carraway and the enigmatic Jay Gatsby.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d367b',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    publishYear: 1937,
    category: 'Fantasy',
    pageCount: 310,
    averageRating: 4.9,
    image: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
    description: 'Bilbo Baggins is a hobbit who enjoys a comfortable and unambitious life, until Gandalf and a company of dwarves arrive on his doorstep.',
  },
  {
    _id: '6ad86169d32fdfa6ea3d368b',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publishYear: 1988,
    category: 'Fiction',
    pageCount: 197,
    averageRating: 4.8,
    image: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    description: 'Santiago, an Andalusian shepherd boy, journeys to the Egyptian pyramids in search of a treasure buried near them.',
  },
];

const BlindDateBanner = ({ books = [] }) => {
  const navigate = useNavigate();
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  // Pool of candidate books: prioritize provided catalog books, fallback to curated titles
  const pool = useMemo(() => {
    if (books && books.length > 0) {
      // Find books that have curated matches first, then append the rest
      const curated = books.filter((b) => CURATED_MYSTERY_CLUES[b.title]);
      const others = books.filter((b) => !CURATED_MYSTERY_CLUES[b.title]);
      const combined = [...curated, ...others];
      return combined.length > 0 ? combined : DEFAULT_CANDIDATE_BOOKS;
    }
    return DEFAULT_CANDIDATE_BOOKS;
  }, [books]);

  // Non-repeating book selection tracking
  const [seenIds, setSeenIds] = useState(() => new Set());
  const [currentBook, setCurrentBook] = useState(null);

  // Unwrapping stage: 'sealed' | 'compressing' | 'cracking' | 'loosening' | 'peeling' | 'revealed'
  const [unwrappingStage, setUnwrappingStage] = useState('sealed');
  const [isAnimating, setIsAnimating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 3D Mouse Tilt state
  const parcelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Pick initial book and sync when real books arrive from API
  useEffect(() => {
    if (books && books.length > 0) {
      if (!currentBook) {
        const first = pool[0];
        setCurrentBook(first);
        setSeenIds(new Set([first._id]));
      } else {
        // Sync active currentBook with real record from database if needed
        const matchingReal = books.find(
          (b) => b._id === currentBook._id || b.title.toLowerCase() === currentBook.title.toLowerCase()
        );
        if (matchingReal && matchingReal._id !== currentBook._id) {
          setCurrentBook(matchingReal);
          setSeenIds((prev) => new Set([...prev, matchingReal._id]));
        }
      }
    } else if (!currentBook && DEFAULT_CANDIDATE_BOOKS.length > 0) {
      const first = DEFAULT_CANDIDATE_BOOKS[0];
      setCurrentBook(first);
      setSeenIds(new Set([first._id]));
    }
  }, [books, pool, currentBook]);

  // Derived clues for the currently selected book
  const clues = useMemo(() => {
    if (!currentBook) return deriveCluesFromBook(null);
    return CURATED_MYSTERY_CLUES[currentBook.title] || deriveCluesFromBook(currentBook);
  }, [currentBook]);

  const isSaved = currentBook ? isBookSaved(currentBook._id) : false;

  // Handle gentle 3D tilt tracking mouse pointer over parcel
  const handleMouseMove = (e) => {
    if (unwrappingStage === 'revealed' || isAnimating) return;
    if (!parcelRef.current) return;
    const rect = parcelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 6; // Max 6 deg tilt
    const rotateY = (x / (rect.width / 2)) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Check reduced motion preference
  const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Execute the carefully choreographed 7-step unwrapping sequence (800-1400ms)
  const handleBreakSeal = () => {
    if (isAnimating || unwrappingStage !== 'sealed') return;

    setIsAnimating(true);

    if (prefersReducedMotion()) {
      // Instant graceful reveal for reduced motion
      playWaxSealCrack();
      setTimeout(() => {
        setUnwrappingStage('revealed');
        setIsAnimating(false);
        playRevealChime();
      }, 250);
      return;
    }

    // Step 1: Seal compresses (0 - 120ms)
    setUnwrappingStage('compressing');

    // Step 2: Wax seal cracks and separates (120 - 350ms)
    setTimeout(() => {
      setUnwrappingStage('cracking');
      playWaxSealCrack();
    }, 120);

    // Step 3: Twine loosens (300 - 500ms)
    setTimeout(() => {
      setUnwrappingStage('loosening');
    }, 320);

    // Step 4: Top paper flap peels away (450 - 750ms)
    setTimeout(() => {
      setUnwrappingStage('peeling');
      playPaperUnwrap();
    }, 480);

    // Step 5 & 6: Book emerges with radiant halo (750 - 1100ms)
    setTimeout(() => {
      setUnwrappingStage('revealed');
      setIsAnimating(false);
      playRevealChime();
    }, 820);
  };

  // Discover another mystery: smoothly cycles through unread books without repeating
  const handleNextMystery = () => {
    if (isAnimating) return;

    // Pick unread candidates
    const unread = pool.filter((b) => !seenIds.has(b._id));
    let nextBook = null;

    if (unread.length > 0) {
      // Pick random from remaining unseen
      const randomIndex = Math.floor(Math.random() * unread.length);
      nextBook = unread[randomIndex];
      setSeenIds((prev) => new Set([...prev, nextBook._id]));
    } else {
      // Reset seen tracking if all explored, pick a different one from current
      const others = pool.filter((b) => b._id !== currentBook?._id);
      nextBook = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : pool[0];
      setSeenIds(new Set([nextBook._id]));
    }

    // Wrap parcel back up smoothly
    playPaperUnwrap();
    setUnwrappingStage('sealed');
    setTilt({ x: 0, y: 0 });
    setCurrentBook(nextBook);
    setSaveSuccess(false);
  };

  // Save to shelf toggle
  const handleToggleShelf = () => {
    if (!currentBook) return;
    toggleBook(currentBook);
    if (!isSaved) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2200);
    }
  };

  return (
    <section id="blind-date-section" className="mb-12 scroll-mt-24">
      {/* Immersive Studio Environment Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#24171D] via-[#1E1418] to-[#160E12] text-[#FAF5ED] p-6 sm:p-8 md:p-10 lg:p-12 border border-[#442D38] shadow-2xl">
        {/* Soft Art-Directed Studio Lighting & Depth Vignettes */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(195,145,100,0.06)_0%,transparent_60%)] pointer-events-none" />

        {/* Two-Column Responsive Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: Editorial Hierarchy, Legible Clues & Actions
              ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left order-2 lg:order-1">
            
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy/90 text-amber-200 border border-amber-300/20 text-[10px] font-mono uppercase tracking-widest font-bold shadow-xs">
                <PiHeartFill className="text-xs text-rose-300" />
                <span>Literary Serendipity</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                &bull; Independent Bookstore Edition
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF5ED] leading-tight">
              A story chosen by fate.
            </h2>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-stone-300/90 font-serif italic mt-2 mb-6 leading-relaxed max-w-xl">
              Wrapped in tactile brown kraft paper, tied with natural jute twine, and sealed in crimson wax. Read the mystery clues, break the seal, and let curiosity introduce your next beloved author.
            </p>

            {/* Dynamic Content: Sealed Clues vs. Unwrapped Book Details */}
            {unwrappingStage !== 'revealed' ? (
              /* ================= THE 3 CLEAR, READABLE CLUES ================= */
              <div className="space-y-4">
                {/* Parchment Clues Plaque */}
                <div className="kraft-tag rounded-2xl p-5 sm:p-6 bg-[#FAF4EB] text-[#1A120B] border border-[#C2A383] shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#D8C4AE] pb-2.5 mb-3.5">
                    <div className="flex items-center gap-2">
                      <PiFeatherBold className="text-burgundy text-sm" />
                      <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#5A4535]">
                        Three Anonymous Clues
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7A6453] uppercase tracking-widest font-semibold">
                      Unopened Volume
                    </span>
                  </div>

                  {/* 3 Distinct Lines with Subtle Decorative Markers */}
                  <ul className="space-y-3.5 font-serif text-sm sm:text-[15px] leading-snug">
                    {/* Clue 1: Atmosphere / Setting */}
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 text-burgundy font-serif font-bold text-sm select-none">
                        ◈
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#6B5342] block">
                          Atmosphere &amp; Setting
                        </span>
                        <p className="text-[#1A120B] italic font-semibold text-sm sm:text-[15px] mt-0.5">
                          &ldquo;{clues.atmosphere}&rdquo;
                        </p>
                      </div>
                    </li>

                    {/* Clue 2: Genre / Narrative Style */}
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 text-amber-800 font-serif font-bold text-sm select-none">
                        ✦
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#6B5342] block">
                          Narrative Style &amp; Form
                        </span>
                        <p className="text-[#1A120B] italic font-semibold text-sm sm:text-[15px] mt-0.5">
                          &ldquo;{clues.genre}&rdquo;
                        </p>
                      </div>
                    </li>

                    {/* Clue 3: Theme / Reading Mood */}
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 text-rose-900 font-serif font-bold text-sm select-none">
                        ❧
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#6B5342] block">
                          Core Theme &amp; Resonance
                        </span>
                        <p className="text-[#1A120B] italic font-semibold text-sm sm:text-[15px] mt-0.5">
                          &ldquo;{clues.theme}&rdquo;
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Primary Action Button: Break The Seal */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="button"
                    onClick={handleBreakSeal}
                    disabled={isAnimating}
                    aria-label="Break the wax seal to reveal the mystery book"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8C1B2B] via-[#7B1826] to-[#5C101B] hover:from-[#9E1F32] hover:to-[#6E1320] text-amber-100 font-serif font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:ring-offset-2 focus:ring-offset-[#1E1418] border border-amber-300/25 group"
                  >
                    <PiSparkleBold className="text-amber-300 text-lg group-hover:rotate-12 transition-transform duration-200" />
                    <span>Break the Wax Seal</span>
                    <PiArrowRightBold className="text-xs transform group-hover:translate-x-1 transition-transform duration-200" />
                  </button>

                  <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Or tap the wax medallion directly</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= REVEALED BOOK EDITORIAL CARD ================= */
              <div className="space-y-4 animate-fade-in">
                {/* Revealed Header Banner */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                    <PiCheckBold className="text-sm" />
                    <span>Mystery Unwrapped</span>
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    Volume #{currentBook.publishYear || 'Classic'}
                  </span>
                </div>

                {/* Title & Author */}
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-tight leading-snug">
                    {currentBook.title}
                  </h3>
                  <p className="font-serif text-base text-stone-300 mt-1 italic">
                    by <span className="text-white font-medium">{currentBook.author}</span>
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-stone-300">
                    {currentBook.category || 'Fiction'}
                  </span>
                  {currentBook.pageCount && (
                    <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-stone-300">
                      {currentBook.pageCount} pages
                    </span>
                  )}
                  {currentBook.averageRating && (
                    <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-amber-300 flex items-center gap-1">
                      <PiStarFill className="text-amber-400 text-xs" />
                      <span>{currentBook.averageRating} / 5</span>
                    </span>
                  )}
                </div>

                {/* Synopsis / Tagline */}
                <div className="bg-[#181114] p-4 rounded-xl border border-stone-800/80 text-stone-300 text-xs sm:text-sm font-serif leading-relaxed italic">
                  {clues.tagline && (
                    <p className="text-amber-200/90 font-medium mb-1.5 not-italic font-mono text-[11px]">
                      {clues.tagline}
                    </p>
                  )}
                  <p className="line-clamp-3">
                    {currentBook.description || 'A timeless narrative masterpiece selected for your private library shelf.'}
                  </p>
                </div>

                {/* Revealed Actions Row: Details, Shelf, Next */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => navigate(`/books/details/${currentBook._id}`)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-serif font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <PiEyeBold className="text-base" />
                    <span>View Book Details</span>
                  </button>

                  {/* Save to My Shelf */}
                  <button
                    type="button"
                    onClick={handleToggleShelf}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-semibold border transition-all duration-200 active:scale-95 ${
                      isSaved
                        ? 'bg-burgundy text-white border-burgundy shadow-sm'
                        : 'bg-stone-800/90 hover:bg-stone-700 text-stone-200 border-stone-600'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <PiBookmarkSimpleFill className="text-base text-amber-300" />
                        <span>Saved on Shelf</span>
                      </>
                    ) : (
                      <>
                        <PiBookmarkSimpleBold className="text-base" />
                        <span>Save to My Shelf</span>
                      </>
                    )}
                  </button>

                  {/* Discover Another Mystery */}
                  <button
                    type="button"
                    onClick={handleNextMystery}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-stone-300 hover:text-white bg-transparent hover:bg-stone-800/60 border border-stone-700 transition-all duration-200"
                    title="Wrap up a new mystery volume"
                  >
                    <PiArrowsClockwiseBold className="text-sm" />
                    <span>Next Mystery</span>
                  </button>
                </div>

                {saveSuccess && (
                  <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                    <PiCheckBold />
                    <span>Book placed securely into your personal Reading Shelf!</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: The Large Physical Kraft Parcel & Real Reveal Sequence
              ========================================================================= */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
            
            {/* 3D Tilt Container for Parcel */}
            <div
              ref={parcelRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isAnimating ? 'none' : 'transform 0.25s ease-out',
              }}
              className="relative w-full max-w-[310px] sm:max-w-[340px] md:max-w-[360px] h-[440px] sm:h-[470px] select-none flex items-center justify-center"
            >
              {/* Idle Floating Levitation Wrapper */}
              <div
                className={`w-full h-full relative ${
                  unwrappingStage === 'sealed' ? 'animate-parcel-float' : ''
                }`}
              >
                {/* Real Book Revealed View */}
                {unwrappingStage === 'revealed' ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-4">
                    {/* Soft halo radiance behind revealed book */}
                    <div className="reveal-radiance" />

                    {/* Book Cover Presentation */}
                    <div className="relative z-10 w-[240px] sm:w-[260px] h-[360px] sm:h-[390px] rounded-xl overflow-hidden shadow-2xl border border-amber-900/40 animate-book-reveal bg-stone-900 flex flex-col">
                      {/* Realistic book spine gradient on left */}
                      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/50 via-white/10 to-transparent z-20 pointer-events-none" />

                      {currentBook.image ? (
                        <img
                          src={currentBook.image}
                          alt={currentBook.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Graceful Fallback if image fails or missing */}
                      <div
                        className="w-full h-full bg-gradient-to-b from-[#3D1E26] to-[#1F1015] p-6 flex flex-col justify-between text-center border-l-4 border-amber-500/40"
                        style={{ display: currentBook.image ? 'none' : 'flex' }}
                      >
                        <div className="flex items-center justify-center text-amber-200/80">
                          <PiBookOpenBold className="text-3xl" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-amber-100 leading-snug">
                            {currentBook.title}
                          </h4>
                          <p className="font-serif text-xs text-stone-300 mt-2 italic">
                            {currentBook.author}
                          </p>
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
                          {currentBook.category || 'PageTurner Collection'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Physical Wrapped Kraft Mystery Parcel */
                  <div
                    className="kraft-parcel w-full h-full relative p-6 flex flex-col justify-between text-left overflow-hidden"
                    role="region"
                    aria-label="Wrapped mystery book parcel"
                  >
                    {/* Textured 3D Paper Flaps for Unfolding */}
                    <div
                      className={`paper-flap paper-flap-top absolute inset-x-0 top-0 h-1/2 bg-[#C8B198] border-b border-[#A88E74]/70 z-10 ${
                        unwrappingStage === 'peeling' ? 'animate-flap-top' : ''
                      }`}
                      style={{
                        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(60,35,15,0.1))',
                      }}
                    />
                    <div
                      className={`paper-flap paper-flap-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#C4AC92] border-t border-[#A88E74]/70 z-10 ${
                        unwrappingStage === 'peeling' ? 'animate-flap-bottom' : ''
                      }`}
                      style={{
                        backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0.08), rgba(60,35,15,0.12))',
                      }}
                    />

                    {/* Natural Twisted Jute Twine (Vertical & Horizontal) */}
                    <div
                      className={`twine-v ${
                        unwrappingStage === 'loosening' || unwrappingStage === 'peeling'
                          ? 'animate-twine-loosen-v'
                          : ''
                      }`}
                    />
                    <div
                      className={`twine-h ${
                        unwrappingStage === 'loosening' || unwrappingStage === 'peeling'
                          ? 'animate-twine-loosen-h'
                          : ''
                      }`}
                    />

                    {/* Twine Intersecting Knot Shadow */}
                    <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/25 blur-xs z-15 pointer-events-none" />

                    {/* Mini Kraft Delivery Label Stamp (Top Left) */}
                    <div className="relative z-20 self-start bg-[#FAF5ED]/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#B5987A] shadow-xs text-stone-800 rotate-[-2deg]">
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold block text-burgundy">
                        Blind Date Parcel
                      </span>
                      <span className="font-serif text-[11px] italic text-stone-700">
                        Mystery Edition No. {currentBook ? currentBook.publishYear || '42' : '42'}
                      </span>
                    </div>

                    {/* Central Crimson Wax Seal Medallion */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <button
                        type="button"
                        onClick={handleBreakSeal}
                        disabled={isAnimating}
                        aria-label="Break the wax seal"
                        className={`wax-seal-btn flex items-center justify-center text-amber-100 ${
                          unwrappingStage === 'compressing' ? 'seal-compressing' : ''
                        } ${unwrappingStage === 'cracking' ? 'animate-wax-crack' : ''}`}
                      >
                        {/* Periodic Gleam Highlight Sweep */}
                        <div className="seal-gleam-line" />

                        {/* Embossed Literary Monogram Emblem */}
                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                          <PiBookOpenBold className="text-xl sm:text-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] text-amber-200" />
                          <span className="font-serif font-black text-[9px] tracking-widest text-amber-300 uppercase mt-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                            SEAL
                          </span>
                        </div>

                        {/* Wax Hairline Crack Lines during step 2 */}
                        {unwrappingStage === 'cracking' && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-12 h-0.5 bg-amber-100/90 rotate-45 transform scale-x-125 shadow-xs" />
                            <div className="w-10 h-0.5 bg-amber-100/90 -rotate-30 transform scale-x-125 shadow-xs" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Bottom Luggage Stamp */}
                    <div className="relative z-20 self-end text-right">
                      <div className="inline-block bg-[#FAF5ED]/80 px-2.5 py-1 rounded border border-[#B5987A]/60 text-stone-700 text-[10px] font-mono uppercase tracking-wider rotate-[1.5deg]">
                        Handle With Care &bull; PageTurner
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlindDateBanner;
