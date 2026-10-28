import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiXBold,
  PiSparkleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiArrowRightBold,
  PiArrowsClockwiseBold,
  PiEyeBold,
  PiStarFill,
  PiHeartFill,
  PiGiftBold,
} from 'react-icons/pi';
import { ReadingListContext } from '../../context/ReadingListContext';
import { playWaxSealCrack, playPaperUnwrap, playRevealChime } from '../../utils/soundEffects';

// Curated poetic clue profiles for famous books in the catalog
const CURATED_MYSTERY_CLUES = {
  'The Picture of Dorian Gray': {
    vibe: 'Decadent, Gothic & Intoxicating',
    clues: [
      'A fateful deal struck before a painted canvas in an artist’s studio.',
      'A life of hedonism and eternal youth while a hidden portrait rots.',
      'Aristocratic London salons, opium dens, and moral peril.',
      'Victorian aestheticism with deadly consequences.',
    ],
    tagline: '“The only way to get rid of a temptation is to yield to it.”',
    accentColor: '#4A1521',
  },
  '1984': {
    vibe: 'Chilling, Dystopian & Paranoiac',
    clues: [
      'Telescreens that never sleep and a diary that could cost your life.',
      'A forbidden love affair in the shadows of the Ministry of Truth.',
      'The past is erased, memory is treason, and two plus two equals five.',
      'The definitive prophecy of totalitarian control.',
    ],
    tagline: '“Big Brother is Watching You.”',
    accentColor: '#1E242B',
  },
  'Dune': {
    vibe: 'Cosmic, Mythic & Revolutionary',
    clues: [
      'A hostile desert planet where water is currency and sand holds gods.',
      'Interstellar houses clash for control of the universe’s rarest substance.',
      'Giant sandworms, ancient prophecies, and a boy destined to shake empires.',
      'The greatest science fiction epic ever penned.',
    ],
    tagline: '“Fear is the mind-killer.”',
    accentColor: '#3B291A',
  },
  'Crime and Punishment': {
    vibe: 'Psychological, Tormented & Redemptive',
    clues: [
      'A destitute student, an old pawnbroker, and a terrifying theory.',
      'A murder committed to test whether great men are above the law.',
      'A fever dream of guilt, conscience, and detective mind games in Saint Petersburg.',
      'The deepest psychological exploration in world literature.',
    ],
    tagline: '“Pain and suffering are always inevitable for a large intelligence.”',
    accentColor: '#2D1F1C',
  },
  'Pride and Prejudice': {
    vibe: 'Witty, Romantic & Solace',
    clues: [
      'Spirited banter, countryside ballrooms, and disastrous first impressions.',
      'A proud aristocrat with ten thousand a year and a fiercely independent heroine.',
      'Overcoming societal snobbery and stubborn judgments for true connection.',
      'The most charming romantic comedy in English history.',
    ],
    tagline: '“My good opinion once lost, is lost forever.”',
    accentColor: '#302621',
  },
  "Man's Search for Meaning": {
    vibe: 'Transcendent, Profound & Fortifying',
    clues: [
      'Memoirs from the depths of human darkness where survival was an act of purpose.',
      'The birth of a therapeutic philosophy centered on finding meaning.',
      'Even in extreme suffering, man retains the freedom to choose his attitude.',
      'A book that permanently alters how you view adversity.',
    ],
    tagline: '“He who has a why to live can bear almost any how.”',
    accentColor: '#252922',
  },
  'Fahrenheit 451': {
    vibe: 'Fiery, Poetic & Urgent',
    clues: [
      'A society where firemen do not extinguish blazes—they ignite books.',
      'Kerosene on pages, mechanical hounds, and parlor walls of shallow noise.',
      'A rebel fireman memorizes forbidden literature to keep human memory alive.',
      'A poetic tribute to the sacred power of the printed page.',
    ],
    tagline: '“It was a pleasure to burn.”',
    accentColor: '#3D1C16',
  },
  'The Hobbit': {
    vibe: 'Whimsical, Comforting & Heroic',
    clues: [
      'An unexpected party of thirteen dwarves and a cozy hole in the ground.',
      'Riddles in the dark with a creature in subterranean depths.',
      'A journey to the Lonely Mountain to reclaim lost treasure from a dragon.',
      'The legendary preamble to high fantasy lore.',
    ],
    tagline: '“In a hole in the ground there lived a hobbit.”',
    accentColor: '#1D2E24',
  },
  'The Great Gatsby': {
    vibe: 'Luminous, Melancholic & Jazz Age',
    clues: [
      'Silk shirts, champagne fountains, and jazz drifting across Long Island Sound.',
      'A green light at the end of a dock symbolizing an unreachable dream.',
      'A mysterious millionaire holding lavish parties hoping for one person to arrive.',
      'The quintessential American tragedy of love, illusion, and longing.',
    ],
    tagline: '“So we beat on, boats against the current...”',
    accentColor: '#242033',
  },
  'The Alchemist': {
    vibe: 'Philosophical, Mystical & Warm',
    clues: [
      'An Andalusian shepherd dreams of hidden treasure beneath the Egyptian pyramids.',
      'Learning to read omens and speak the universal language of the heart.',
      'A desert odyssey guided by kings, desert warriors, and wise alchemists.',
      'A fable on pursuing your personal legend without hesitation.',
    ],
    tagline: '“When you want something, all the universe conspires in helping you.”',
    accentColor: '#382B1B',
  },
};

// Fallback clues generator for any book
const generateGenericClues = (book) => {
  return {
    vibe: book.category ? `${book.category} Discovery` : 'Literary Treasure',
    clues: [
      `A celebrated title in the ${book.category || 'classic'} genre.`,
      `Authored by ${book.author}, first published in ${book.publishYear || 'classic era'}.`,
      book.pageCount ? `A compelling read spanning approximately ${book.pageCount} pages.` : 'An essential volume cataloged in our digital library.',
      book.description ? book.description.slice(0, 95) + '...' : 'Filled with human insight, timeless prose, and memorable characters.',
    ],
    tagline: 'A hand-selected story waiting to be discovered without preconceptions.',
    accentColor: '#332720',
  };
};

const BlindDateModal = ({ isOpen, onClose, books = [] }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [unwrappingState, setUnwrappingState] = useState('sealed'); // 'sealed' | 'breaking' | 'unwrapped'
  const [parcelIndex, setParcelIndex] = useState(0);
  const [popping, setPopping] = useState(false);

  const navigate = useNavigate();
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  // Filter books with curated clues or rich descriptions
  const candidateBooks = books.length > 0
    ? books
    : [
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
      ];

  // Pick or change book
  useEffect(() => {
    if (isOpen && candidateBooks.length > 0) {
      const b = candidateBooks[parcelIndex % candidateBooks.length];
      setSelectedBook(b);
      setUnwrappingState('sealed');
    }
  }, [isOpen, parcelIndex, candidateBooks.length]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedBook) return null;

  const cluesProfile = CURATED_MYSTERY_CLUES[selectedBook.title] || generateGenericClues(selectedBook);
  const isSaved = isBookSaved(selectedBook._id);

  const handleCrackSeal = () => {
    if (unwrappingState !== 'sealed') return;

    // Phase 1: Snap & crack sound + seal shattering
    playWaxSealCrack();
    setUnwrappingState('breaking');

    // Phase 2: Paper unwrapping swoosh
    setTimeout(() => {
      playPaperUnwrap();
    }, 280);

    // Phase 3: Book reveals with celestial chime
    setTimeout(() => {
      playRevealChime();
      setUnwrappingState('unwrapped');
    }, 720);
  };

  const handleShuffle = () => {
    setUnwrappingState('sealed');
    setParcelIndex((prev) => (prev + 1) % candidateBooks.length);
  };

  const handleBookmark = () => {
    setPopping(true);
    toggleBook(selectedBook);
    setTimeout(() => setPopping(false), 450);
  };

  const handleNavigateDetails = () => {
    onClose();
    navigate(`/books/details/${selectedBook._id}`);
  };

  const imageUrl = selectedBook.image
    ? selectedBook.image.startsWith('http')
      ? selectedBook.image
      : `http://localhost:5555${selectedBook.image}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blind-date-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E0D7C7] overflow-hidden relative flex flex-col max-h-[92vh] animate-modal-in"
      >
        {/* Subtle decorative top banner */}
        <div className="bg-[#7B1826] text-white px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <PiHeartFill className="text-amber-300 text-sm animate-pulse" />
            <span className="font-mono uppercase tracking-widest text-[10px] font-bold">
              Literary Serendipity &bull; Parcel No. 0{(parcelIndex % 99) + 1}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <PiXBold className="text-xs" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {/* Header Title */}
          <div className="text-center mb-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B1826] font-bold block mb-1">
              CAN YOU JUDGE A BOOK WITHOUT ITS COVER?
            </span>
            <h2 id="blind-date-title" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              Blind Date with a Book
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-1 max-w-md mx-auto">
              Wrapped in brown kraft paper, tied with twine, and sealed in crimson wax.
            </p>
          </div>

          {/* PARCEL CONTAINER AREA */}
          <div className="relative mx-auto max-w-sm sm:max-w-md min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
            {unwrappingState === 'unwrapped' ? (
              /* ================= THE REVEALED BOOK ================= */
              <div className="w-full animate-book-reveal relative z-20">
                <div className="reveal-radiance" />

                <div className="editorial-sheet p-5 sm:p-6 bg-white relative z-10 border border-[#DBD0C0] shadow-xl flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  {/* Book Cover */}
                  <div className="book-cover-wrap w-36 sm:w-40 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0 shadow-book bg-[#F5F0E6]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={selectedBook.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full fallback-jacket p-3 flex flex-col justify-between text-stone-100 text-center">
                        <span className="text-[9px] font-mono text-amber-200/60 uppercase">
                          {selectedBook.category}
                        </span>
                        <p className="font-serif text-xs font-bold text-amber-100">
                          {selectedBook.title}
                        </p>
                        <span className="text-[9px] text-stone-300 italic truncate">
                          {selectedBook.author}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold text-burgundy bg-burgundy-faint px-2.5 py-0.5 rounded-full border border-burgundy/15">
                          {selectedBook.category || 'Featured'}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">
                          {selectedBook.publishYear}
                        </span>
                        {selectedBook.averageRating > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.2 rounded-full">
                            <PiStarFill className="text-amber-500 text-[10px]" />
                            <span>{selectedBook.averageRating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                        {selectedBook.title}
                      </h3>

                      <p className="text-xs font-medium text-stone-600 mt-0.5">
                        by <span className="font-bold text-stone-900">{selectedBook.author}</span>
                      </p>

                      <p className="text-xs text-stone-700 leading-relaxed mt-2.5 line-clamp-3 sm:line-clamp-4">
                        {selectedBook.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={handleBookmark}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
                          isSaved
                            ? 'bg-burgundy text-white hover:bg-[#63121E]'
                            : 'btn-paper text-stone-800'
                        }`}
                      >
                        {isSaved ? (
                          <PiBookmarkSimpleFill
                            className={`text-sm text-amber-300 ${popping ? 'animate-bookmark-pop' : ''}`}
                          />
                        ) : (
                          <PiBookmarkSimpleBold className="text-sm text-burgundy" />
                        )}
                        <span>{isSaved ? 'On Your Shelf' : 'Save to Shelf'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNavigateDetails}
                        className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xs"
                      >
                        <span>Full Journal</span>
                        <PiArrowRightBold className="text-xs transform group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= WRAPPED KRAFT PAPER PARCEL ================= */
              <div
                className={`kraft-parcel w-full p-6 sm:p-7 relative select-none ${
                  unwrappingState === 'breaking' ? 'parcel-unwrapped' : ''
                }`}
              >
                {/* 3D Paper Flaps */}
                <div className="paper-flap paper-flap-top absolute inset-x-0 top-0 h-1/2 bg-[#C6AD90] border-b border-[#A88E70] shadow-sm z-10 pointer-events-none" />
                <div className="paper-flap paper-flap-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#BF9F7E] border-t border-[#A88E70] shadow-sm z-10 pointer-events-none" />

                {/* Vertical & Horizontal Twine Strings */}
                <div
                  className={`twine-v ${
                    unwrappingState === 'breaking' ? 'twine-snapped-v' : ''
                  }`}
                />
                <div
                  className={`twine-h ${
                    unwrappingState === 'breaking' ? 'twine-snapped-h' : ''
                  }`}
                />

                {/* Stamped Shipping Luggage Tag */}
                <div className="kraft-tag rounded-xl p-5 sm:p-6 mb-2 relative z-10 text-left">
                  <div className="flex items-center justify-between mb-3 border-b border-stone-300/80 pb-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold pl-3">
                      LITERARY CLUES NO. 0{(parcelIndex % 99) + 1}
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold text-burgundy bg-burgundy-faint px-2 py-0.5 rounded-full">
                      {cluesProfile.vibe}
                    </span>
                  </div>

                  {/* Bullet Point Mystery Clues */}
                  <ul className="space-y-2 font-serif text-xs sm:text-sm text-stone-800 leading-snug">
                    {cluesProfile.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-burgundy font-bold text-xs select-none">&bull;</span>
                        <span className="italic">{clue}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Typewritten Quote / Tagline */}
                  {cluesProfile.tagline && (
                    <div className="mt-4 pt-2.5 border-t border-dashed border-stone-300 text-[11px] font-mono text-stone-600 italic">
                      {cluesProfile.tagline}
                    </div>
                  )}
                </div>

                {/* Interactive Crimson Wax Seal Stamp in Center */}
                <div className="relative z-20 flex flex-col items-center justify-center mt-3">
                  <button
                    type="button"
                    onClick={handleCrackSeal}
                    title="Click to break the wax seal and unwrap the book"
                    aria-label="Break wax seal and unwrap book"
                    className={`wax-seal-btn flex items-center justify-center text-amber-100 group ${
                      unwrappingState === 'breaking' ? 'animate-wax-crack' : ''
                    }`}
                  >
                    {/* Debossed Emblem in Wax */}
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <span className="font-serif font-black text-sm tracking-widest text-amber-200 drop-shadow-xs">
                        PT
                      </span>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-amber-200/80 -mt-0.5">
                        SEAL
                      </span>
                    </div>
                  </button>

                  {/* Interactive Prompt below Wax Seal */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-stone-900 bg-amber-50/90 border border-amber-800/20 px-3 py-1 rounded-full shadow-xs">
                    <PiSparkleBold className="text-burgundy text-xs animate-bounce" />
                    <span className="text-[11px] font-mono font-semibold tracking-tight text-stone-800">
                      Click the crimson wax seal to unwrap
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-burgundy transition-colors font-medium"
            >
              <PiArrowsClockwiseBold className="text-sm" />
              <span>Draw a Different Mystery Book</span>
            </button>

            <span className="text-[11px] font-mono text-stone-400">
              {candidateBooks.length} mystery parcels available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindDateModal;
