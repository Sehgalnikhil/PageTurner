import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
  PiArrowLeftBold,
  PiArrowRightBold,
  PiBookOpenBold,
  PiSparkleBold,
  PiArrowsOutBold,
  PiArrowsInBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiDeviceMobileBold,
  PiBookBookmarkBold,
  PiXBold,
} from 'react-icons/pi';
import { playPageFlipSound } from '../../utils/soundEffects';
import { ReadingListContext } from '../../context/ReadingListContext';

// Comprehensive, authentic multi-page literary excerpts (6 pages / 3 Duo Spreads per book)
const BOOK_VOLUMES = {
  'Educated': {
    author: 'Tara Westover',
    year: 2018,
    edition: 'Random House &bull; First Edition',
    pages: [
      {
        type: 'titleplate',
        ornament: '✤',
        title: 'Educated',
        author: 'TARA WESTOVER',
        publisher: 'RANDOM HOUSE &bull; NEW YORK',
        year: 'M M X V I I I',
        subtext: 'A Celebrated Memoir of Resilience, Knowledge, and Identity',
        frontispieceQuote: '“You can love someone and still choose to say goodbye to them.”',
      },
      {
        type: 'chapter',
        chapterNum: 'CHAPTER I',
        runningHead: 'EDUCATED',
        firstLine: 'An unforgettable memoir about a young girl kept out of school and isolated from society in rural Idaho by survivalist parents, who eventually teaches herself enough mathematics and grammar to enter college and earn a PhD from Cambridge.',
        body: [
          'The printed page captures a realm of imagination and memory, providing solace and intellectual clarity across generations.',
          'Through crafted prose and disciplined imagination, this volume captures the delicate texture of human circumstance with nuance and enduring resonance.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'BUCK’S PEAK',
        runningHead: 'MEMORY OF CHILDHOOD',
        firstLine: 'I am only seven, but I understand that it is this fact, more than any other, that makes my family different: we don’t go to school.',
        body: [
          'Dad worried that the government would force us into public education, so he kept no birth certificates for us, no hospital files. We had no medical records because none of us had ever seen a doctor or nurse.',
          'Instead, we worked in the junkyard under the shadow of the mountain, sorting scraps and hauling rusted iron, listening to father talk of the Days of Abomination.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'THE TRANSFORMATION',
        runningHead: 'THE POWER OF KNOWLEDGE',
        firstLine: 'It is a marvelous thing, the discovery of one’s own mind.',
        body: [
          'Sitting in the lecture halls of Brigham Young University, staring blankly at words like "Holocaust" that I had never heard in seventeen years on the mountain, I realized how vast and unmapped the world remained.',
          'Education is not merely the accumulation of facts; it is the process of self-invention, the capacity to view one’s history with compassion and clear eyes.',
        ],
      },
      {
        type: 'critique',
        chapterNum: 'BIBLIOGRAPHIC RECORD',
        runningHead: 'CURATOR’S NOTES',
        firstLine: 'Published in 2018, Tara Westover’s memoir spent more than two years atop the New York Times bestseller list.',
        body: [
          'Praised by critics worldwide as an extraordinary exploration of family loyalty, estrangement, and the redemptive liberation of learning.',
        ],
        metrics: {
          pages: 334,
          words: '112,000 words',
          readTime: '~8.2 hours',
          theme: 'Memoir &bull; Self-Invention & Family',
        },
      },
      {
        type: 'sanctuary',
        chapterNum: 'READER SANCTUARY',
        runningHead: 'PERSONAL JOURNAL',
        firstLine: '“Whomever you become, whatever you make yourself into, that is who you always were.”',
        body: [
          'Consider the tensions between the world your family built for you and the world you choose to inhabit.',
          'Add personal annotations, favorite bookmarks, and reading reflections to your private shelf.',
        ],
      },
    ],
  },

  'The Picture of Dorian Gray': {
    author: 'Oscar Wilde',
    year: 1890,
    edition: 'Lippincott’s Monthly Magazine &bull; First Edition',
    pages: [
      {
        type: 'titleplate',
        ornament: '❦',
        title: 'The Picture of Dorian Gray',
        author: 'OSCAR WILDE',
        publisher: 'WARD LOCK AND CO. &bull; LONDON & NEW YORK',
        year: 'M D C C C X C',
        subtext: 'A Moral Fantasy in Twenty Chapters with Ornate Typography',
        frontispieceQuote: '“To reveal art and conceal the artist is art’s aim.”',
      },
      {
        type: 'chapter',
        chapterNum: 'CHAPTER I',
        runningHead: 'THE PICTURE OF DORIAN GRAY',
        firstLine: 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.',
        body: [
          'From the corner of the divan of Persian saddle-bags on which he was lying, smoking innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet blossoms of a laburnum.',
          'In the centre of the room stood the full-length portrait of a young man of extraordinary personal beauty, and sitting before it was the artist himself, Basil Hallward.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'CHAPTER I &bull; CONTINUED',
        runningHead: 'THE ARTIST’S DILEMMA',
        firstLine: '“It is your best work, Basil, the best thing you have ever done,” said Lord Henry languidly.',
        body: [
          '“You must certainly send it next year to the Grosvenor. The Academy is too large and too vulgar. Whenever I go there, either there are so many people I cannot see the pictures, or so many pictures I cannot see the people.”',
          '“I don’t think I shall send it anywhere,” the painter answered. “I have put too much of myself into it.”',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'THE PREFACE',
        runningHead: 'AESTHETIC MANIFESTO',
        firstLine: 'The artist can express everything. Thought and language are to the artist instruments of an art. Vice and virtue are to the artist materials for an art.',
        body: [
          '“There is no such thing as a moral or an immoral book. Books are well written, or badly written. That is all.”',
          '“Diversity of opinion about a work of art shows that the work is new, complex, and vital.”',
        ],
      },
      {
        type: 'critique',
        chapterNum: 'CRITICAL HERITAGE',
        runningHead: 'BIBLIOGRAPHIC RECORD',
        firstLine: 'Published in 1890, the novella sparked Victorian scandal before establishing itself as a pinnacle of Gothic literature.',
        body: [
          'A glittering exploration of vanity, psychological decay, and the consequences of pleasure detached from conscience.',
        ],
        metrics: {
          pages: 254,
          words: '78,400 words',
          readTime: '~6.5 hours',
          theme: 'Gothic Decadence &bull; Aesthetic Philosophy',
        },
      },
      {
        type: 'sanctuary',
        chapterNum: 'READER SANCTUARY',
        runningHead: 'LITERARY REFLECTION',
        firstLine: '“Behind every exquisite thing that existed, there was something tragic.”',
        body: [
          'How does Wilde’s exploration of private vice and public virtue mirror contemporary society?',
          'Save this title to your shelf for personal reflections and quote notes.',
        ],
      },
    ],
  },

  '1984': {
    author: 'George Orwell',
    year: 1949,
    edition: 'Secker & Warburg &bull; First London Edition',
    pages: [
      {
        type: 'titleplate',
        ornament: '👁',
        title: 'Nineteen Eighty-Four',
        author: 'GEORGE ORWELL',
        publisher: 'SECKER & WARBURG &bull; LONDON',
        year: 'M C M X L I X',
        subtext: 'A Novel of Totalitarian Shadows, Memory, and Truth',
        frontispieceQuote: '“Freedom is the freedom to say that two plus two make four.”',
      },
      {
        type: 'chapter',
        chapterNum: 'PART ONE &bull; CHAPTER I',
        runningHead: 'NINETEEN EIGHTY-FOUR',
        firstLine: 'It was a bright cold day in April, and the clocks were striking thirteen.',
        body: [
          'Winston Smith, his chin nuzzled into his breast to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.',
          'At the end of the hallway, an enormous face gazed from the wall: BIG BROTHER IS WATCHING YOU, the caption said.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'THE TELESCREEN',
        runningHead: 'OCEANIA 1984',
        firstLine: 'The telescreen received and transmitted simultaneously.',
        body: [
          'Any sound that Winston made, above the level of a very low whisper, would be picked up by it; moreover, so long as he remained within the field of vision, he could be seen as well as heard.',
          'You had to live—did live, from habit that became instinct—in the assumption that every sound you made was overheard, and every movement scrutinized.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'THE DIARY',
        runningHead: 'THE ACT OF MEMORY',
        firstLine: 'The thing that he was about to do was to open a diary.',
        body: [
          'The beautiful creamy paper deserved to be written on with a real nib instead of being scratched with an ink-pencil. He dipped the pen into the ink and then hesitated for just a second.',
          'To mark the paper was the decisive act. In small clumsy letters he wrote: April 4th, 1984.',
        ],
      },
      {
        type: 'critique',
        chapterNum: 'CRITICAL CONTEXT',
        runningHead: 'ORWELLIAN LEGACY',
        firstLine: 'Orwell’s vision of totalitarian control and doublespeak fundamentally altered twentieth-century political discourse.',
        body: [
          'A masterclass in psychological tension and an enduring guardian of intellectual clarity.',
        ],
        metrics: {
          pages: 328,
          words: '88,940 words',
          readTime: '~7.5 hours',
          theme: 'Dystopian Politics &bull; Memory & Language',
        },
      },
      {
        type: 'sanctuary',
        chapterNum: 'READER SANCTUARY',
        runningHead: 'LITERARY REFLECTION',
        firstLine: '“Until they become conscious they will never rebel, and until after they have rebelled they cannot become conscious.”',
        body: [
          'Contemplate how language shapes what thoughts can be conceived and remembered.',
        ],
      },
    ],
  },
};

// Fallback generator for other books
const generateBookPages = (book) => {
  const title = book?.title || 'Literary Classic';
  const author = book?.author || 'PageTurner Author';
  const year = book?.publishYear || 1920;
  const category = book?.category || 'Fiction';
  const desc = book?.description || 'A timeless narrative captured within the digital catalog, inviting readers into its quiet universe of inquiry.';
  const sentences = desc.split('. ').filter(Boolean);
  const firstSentence = sentences[0] ? sentences[0] + '.' : 'Every book begins with an unspoken promise between author and reader.';
  const remaining = sentences.slice(1).join('. ') || 'The printed page captures a realm of imagination and memory, providing solace and intellectual clarity across generations.';

  return {
    author,
    year,
    edition: `PageTurner Heritage Collection &bull; ${category}`,
    pages: [
      {
        type: 'titleplate',
        ornament: '✤',
        title,
        author: author.toUpperCase(),
        publisher: 'PAGETURNER PRESS &bull; SANCTUARY ARCHIVE',
        year: `PUBLISHED ${year}`,
        subtext: `A Celebrated Entry in the Canon of ${category}`,
        frontispieceQuote: '“A reader lives a thousand lives before he dies.”',
      },
      {
        type: 'chapter',
        chapterNum: 'CHAPTER I',
        runningHead: title.toUpperCase(),
        firstLine: firstSentence,
        body: [
          remaining,
          'Through crafted prose and disciplined imagination, this volume captures the delicate texture of human circumstance with nuance and enduring resonance.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'THE STORY UNFOLDS',
        runningHead: 'PASSAGE & FORM',
        firstLine: 'The narrative invites quiet contemplation, exploring the complexities of its characters with measured eloquence.',
        body: [
          'Each chapter builds upon an intricate thematic tapestry, weaving together observations of human nature and timeless moral questions.',
          'Whether read in the quiet hours of early dawn or under the warmth of evening candlelight, its prose continues to reward close attention.',
        ],
      },
      {
        type: 'narrative',
        chapterNum: 'CORE THEMATIC RESONANCE',
        runningHead: 'THEMATIC INQUIRY',
        firstLine: 'Great literature does not merely describe circumstances; it reveals the interior architecture of the human condition.',
        body: [
          'Across these pages, the author constructs an unforgettable portrait of longing, choice, and discovery that echoes beyond its closing sentence.',
        ],
      },
      {
        type: 'critique',
        chapterNum: 'BIBLIOGRAPHIC RECORD',
        runningHead: 'CURATOR’S NOTES',
        firstLine: `Cataloged within the PageTurner library collection under the ${category} discipline.`,
        body: [
          `First published in ${year}, this volume stands as a testament to the enduring vitality of the printed word and physical reading culture.`,
        ],
        metrics: {
          pages: book?.pageCount || 280,
          words: `${((book?.pageCount || 280) * 310).toLocaleString()} words`,
          readTime: `~${Math.round((book?.pageCount || 280) / 45)} hours`,
          theme: `${category} &bull; Archival Volume`,
        },
      },
      {
        type: 'sanctuary',
        chapterNum: 'READER SANCTUARY',
        runningHead: 'PERSONAL JOURNAL',
        firstLine: '“A small shelf now, a lifelong collection ahead.”',
        body: [
          'Add personal annotations, favorite bookmarks, and reading stages to your private library shelf.',
        ],
      },
    ],
  };
};

const PageFlipPreview = ({ book }) => {
  const volumeData = BOOK_VOLUMES[book?.title] || generateBookPages(book);

  // 'single' (iPhone view) or 'duo' (two-page open book spread)
  // Default to Duo on desktop (>=768px) and iPhone view on mobile
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768 ? 'duo' : 'single'
  );
  const [singlePageIndex, setSinglePageIndex] = useState(0); // 0 to 5
  const [currentSpread, setCurrentSpread] = useState(0); // 0 to 2
  const [isFlipping, setIsFlipping] = useState(null); // 'forward' | 'backward' | null
  const [paperTheme, setPaperTheme] = useState('ivory'); // 'ivory' | 'sepia' | 'obsidian'
  const [fontSize, setFontSize] = useState(1); // 0 (compact), 1 (normal), 2 (large)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { isBookSaved, toggleBook } = useContext(ReadingListContext);
  const isSaved = book?._id ? isBookSaved(book._id) : false;

  const totalPages = volumeData.pages.length;
  const totalSpreads = Math.ceil(totalPages / 2);

  const wheelLockRef = useRef(false);
  const touchStartXRef = useRef(null);

  // Fullscreen Theater toggle (integrates native Fullscreen API & Portal overlay)
  const handleToggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        }
      } catch (e) {}
    }
  };

  // Synchronize fullscreenchange event (e.g. if user exits via browser Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

  // Lock body scroll when full-view reading theater is active
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isFullscreen]);

  // Natural scroll to turn pages like in a real book (Trackpad & Mouse Wheel)
  const handleWheel = (e) => {
    if (wheelLockRef.current || isFlipping) return;

    const dominantDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(dominantDelta) < 20) return;

    if (dominantDelta > 20) {
      wheelLockRef.current = true;
      handleTurnForward();
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 540);
    } else if (dominantDelta < -20) {
      wheelLockRef.current = true;
      handleTurnBackward();
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 540);
    }
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        handleTurnForward();
      } else {
        handleTurnBackward();
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleTurnForward();
      } else if (e.key === 'ArrowLeft') {
        handleTurnBackward();
      } else if (e.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, singlePageIndex, currentSpread, isFlipping, isFullscreen]);

  // Turn Forward (Synchronized with 520ms hardware-accelerated GPU curve)
  const handleTurnForward = () => {
    if (isFlipping) return;

    if (viewMode === 'single') {
      if (singlePageIndex >= totalPages - 1) return;
      playPageFlipSound();
      setIsFlipping('forward');
      setTimeout(() => {
        setSinglePageIndex((prev) => prev + 1);
        setIsFlipping(null);
      }, 520);
    } else {
      if (currentSpread >= totalSpreads - 1) return;
      playPageFlipSound();
      setIsFlipping('forward');
      setTimeout(() => {
        setCurrentSpread((prev) => prev + 1);
        setIsFlipping(null);
      }, 520);
    }
  };

  // Turn Backward (Synchronized with 520ms hardware-accelerated GPU curve)
  const handleTurnBackward = () => {
    if (isFlipping) return;

    if (viewMode === 'single') {
      if (singlePageIndex <= 0) return;
      playPageFlipSound();
      setIsFlipping('backward');
      setTimeout(() => {
        setSinglePageIndex((prev) => prev - 1);
        setIsFlipping(null);
      }, 520);
    } else {
      if (currentSpread <= 0) return;
      playPageFlipSound();
      setIsFlipping('backward');
      setTimeout(() => {
        setCurrentSpread((prev) => prev - 1);
        setIsFlipping(null);
      }, 520);
    }
  };

  // Theme palettes
  const getThemeStyles = () => {
    switch (paperTheme) {
      case 'sepia':
        return {
          bg: '#F3EBDD',
          text: '#2D2016',
          border: '#D9C8B2',
          subtext: '#765B43',
          lining: '#2F2117',
        };
      case 'obsidian':
        return {
          bg: '#1C1920',
          text: '#EDE5D8',
          border: '#322A38',
          subtext: '#A69AA8',
          lining: '#0F0D12',
        };
      case 'ivory':
      default:
        return {
          bg: '#FAF6EF',
          text: '#1C1714',
          border: '#E5D8C5',
          subtext: '#685444',
          lining: '#3C2419',
        };
    }
  };

  const themeStyle = getThemeStyles();

  // Helper: Renders clean drop cap without creating awkward gaps
  const renderDropCap = (firstLineText, isFullView = false) => {
    if (!firstLineText) return null;
    const trimmed = firstLineText.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('“') || trimmed.startsWith('"') || trimmed.startsWith("'")) {
      return (
        <p className={`font-serif italic leading-snug sm:leading-relaxed ${isFullView ? 'text-[13.5px] sm:text-[14.5px] mb-2.5' : 'text-[11px] sm:text-[11.5px] mb-1.5'}`}>
          {trimmed}
        </p>
      );
    }

    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
      const firstChar = trimmed[0];
      const restOfWord = trimmed.slice(1);
      return (
        <p className={`font-serif leading-snug sm:leading-relaxed ${isFullView ? 'text-[13.5px] sm:text-[14.5px] mb-2.5' : 'text-[11px] sm:text-[11.5px] mb-1.5'}`}>
          <span className={`float-left ${isFullView ? 'text-3.5xl sm:text-4xl mr-1.5' : 'text-2.5xl sm:text-3xl mr-1'} font-serif font-bold text-burgundy leading-none select-none`}>
            {firstChar}
          </span>
          <span className={`font-serif tracking-wider uppercase font-bold text-current ${isFullView ? 'text-[11px] sm:text-[12px]' : 'text-[9.5px] sm:text-[10px]'}`}>
            {restOfWord}
          </span>
        </p>
      );
    }

    const firstWord = trimmed.slice(0, spaceIndex);
    const remainingText = trimmed.slice(spaceIndex + 1);
    const firstChar = firstWord[0];
    const restOfWord = firstWord.slice(1);

    return (
      <p className={`font-serif leading-snug sm:leading-relaxed ${isFullView ? 'text-[13.5px] sm:text-[14.5px] mb-2.5' : 'text-[11px] sm:text-[11.5px] mb-1.5'}`}>
        <span className={`float-left ${isFullView ? 'text-3.5xl sm:text-4xl mr-1.5' : 'text-2.5xl sm:text-3xl mr-1'} font-serif font-bold text-burgundy leading-none select-none`}>
          {firstChar}
        </span>
        {restOfWord && (
          <span className={`font-serif tracking-wider uppercase font-bold text-current mr-1 ${isFullView ? 'text-[11px] sm:text-[12px]' : 'text-[9.5px] sm:text-[10px]'}`}>
            {restOfWord}
          </span>
        )}
        <span className="opacity-95">{remainingText}</span>
      </p>
    );
  };

  // Render Page Content cleanly with proportional typography and guaranteed zero clipping
  const renderPageContent = (pageData, pageNum, isFullView = false) => {
    if (!pageData) return null;

    if (pageData.type === 'titleplate') {
      return (
        <div className={`h-full flex flex-col justify-between overflow-hidden select-none text-center ${isFullView ? 'py-3 sm:py-5 px-2' : 'py-1 sm:py-2 px-0.5'}`}>
          <div className={`border border-current/20 ${isFullView ? 'p-5 sm:p-7' : 'p-2 sm:p-3'} rounded-xl relative my-auto shadow-xs`}>
            {/* Victorian Corner Accents */}
            <span className="absolute top-1 left-1.5 text-[10px] opacity-40">⌜</span>
            <span className="absolute top-1 right-1.5 text-[10px] opacity-40">⌝</span>
            <span className="absolute bottom-1 left-1.5 text-[10px] opacity-40">⌞</span>
            <span className="absolute bottom-1 right-1.5 text-[10px] opacity-40">⌟</span>

            <div className={`${isFullView ? 'text-2xl sm:text-3xl mb-2' : 'text-base sm:text-lg mb-1'} opacity-70`}>{pageData.ornament}</div>
            <span className={`font-mono ${isFullView ? 'text-[9.5px]' : 'text-[7.5px]'} uppercase tracking-widest block opacity-60 mb-1`}>
              PAGETURNER PRESS &bull; HERITAGE CANON
            </span>

            <h2 className={`font-serif ${isFullView ? 'text-xl sm:text-2xl mb-2' : 'text-sm sm:text-base mb-1'} font-bold tracking-tight leading-snug`}>
              {pageData.title}
            </h2>
            <p className={`font-serif italic ${isFullView ? 'text-xs sm:text-sm mb-2.5' : 'text-[9.5px] sm:text-[10px] mb-1'} opacity-80`}>
              {pageData.subtext}
            </p>

            <div className="w-8 h-px bg-current/25 mx-auto my-1.5" />
            <span className={`font-mono font-bold ${isFullView ? 'text-xs' : 'text-[9.5px]'} tracking-wider uppercase block text-burgundy mb-1`}>
              BY {pageData.author}
            </span>

            <p className={`font-serif italic ${isFullView ? 'text-xs max-w-[260px]' : 'text-[9px] max-w-[180px]'} opacity-75 mx-auto leading-tight mb-1`}>
              &ldquo;{pageData.frontispieceQuote}&rdquo;
            </p>
            <p className={`font-mono ${isFullView ? 'text-[9px]' : 'text-[7.5px]'} opacity-50 uppercase tracking-widest`}>
              {pageData.year}
            </p>
          </div>

          <div className="flex-shrink-0 text-right font-mono text-[8.5px] opacity-40 pt-1 pb-0.5">
            Page {pageNum}
          </div>
        </div>
      );
    }

    if (pageData.type === 'critique') {
      return (
        <div className="h-full flex flex-col justify-between overflow-hidden text-left">
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-current/15 pb-1 mb-2 font-mono text-[8.5px] uppercase tracking-widest opacity-60">
              <span>{pageData.chapterNum}</span>
              <span>{pageData.runningHead}</span>
            </div>

            <p className={`font-serif font-semibold ${isFullView ? 'text-[13px] sm:text-[14px] mb-2 leading-relaxed' : 'text-[11px] sm:text-[11.5px] mb-1.5 leading-snug'}`}>
              {pageData.firstLine}
            </p>

            <div className={`font-serif ${isFullView ? 'space-y-2 text-[12px] sm:text-[13px] leading-relaxed' : 'space-y-1 text-[10px] sm:text-[10.5px] leading-snug'} opacity-90`}>
              {pageData.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {pageData.metrics && (
              <div className={`mt-2 ${isFullView ? 'p-3 text-[10px]' : 'p-2 text-[8.5px]'} rounded-lg border border-current/15 bg-black/3 font-mono space-y-1`}>
                <span className="text-[8px] uppercase tracking-wider block font-bold text-burgundy">
                  Bibliographic Cadence
                </span>
                <div className="grid grid-cols-2 gap-1">
                  <div>Pages: <strong>{pageData.metrics.pages}</strong></div>
                  <div>Pacing: <strong>{pageData.metrics.readTime}</strong></div>
                  <div className="col-span-2">Discipline: <em>{pageData.metrics.theme}</em></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 text-left font-mono text-[8.5px] opacity-40 pt-1 pb-0.5">
            Page {pageNum}
          </div>
        </div>
      );
    }

    if (pageData.type === 'sanctuary') {
      return (
        <div className="h-full flex flex-col justify-between overflow-hidden text-center">
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-current/15 pb-1 mb-2 font-mono text-[8.5px] uppercase tracking-widest opacity-60 text-left">
              <span>{pageData.chapterNum}</span>
              <span>{pageData.runningHead}</span>
            </div>

            <div className={`rounded-lg border border-dashed border-burgundy/30 bg-burgundy/5 ${isFullView ? 'p-3 my-2.5' : 'p-2 my-1'}`}>
              <p className={`font-serif italic font-semibold text-burgundy ${isFullView ? 'text-xs sm:text-sm leading-relaxed' : 'text-[10.5px] sm:text-[11px] leading-snug'}`}>
                {pageData.firstLine}
              </p>
            </div>

            <div className={`font-serif ${isFullView ? 'space-y-2 text-[12px] sm:text-[13px] leading-relaxed' : 'space-y-1 text-[10px] sm:text-[10.5px] leading-snug'} opacity-90 text-left`}>
              {pageData.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {book?._id && (
              <button
                type="button"
                onClick={() => toggleBook(book)}
                className={`mt-2 w-full ${isFullView ? 'py-2 px-3 text-xs' : 'py-1 px-2.5 text-[10.5px]'} rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  isSaved
                    ? 'bg-burgundy text-white'
                    : 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-50'
                }`}
              >
                {isSaved ? (
                  <>
                    <PiBookmarkSimpleFill className="text-amber-300 text-xs" />
                    <span>Saved on Shelf</span>
                  </>
                ) : (
                  <>
                    <PiBookmarkSimpleBold className="text-xs" />
                    <span>Bookmark to Shelf</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-shrink-0 text-right font-mono text-[8.5px] opacity-40 pt-1 pb-0.5">
            Page {pageNum}
          </div>
        </div>
      );
    }

    // Default Chapter / Narrative Page
    return (
      <div className="h-full flex flex-col justify-between overflow-hidden text-left">
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Running Head */}
          <div className="flex items-center justify-between border-b border-current/15 pb-1 mb-2 font-mono text-[8.5px] uppercase tracking-widest opacity-60">
            <span>{pageData.chapterNum}</span>
            <span>{pageData.runningHead}</span>
          </div>

          {/* Opening paragraph with clean unified drop cap */}
          <div className="font-serif">
            {pageData.chapterNum?.includes('CHAPTER I') && !pageData.chapterNum?.includes('CONTINUED') ? (
              renderDropCap(pageData.firstLine, isFullView)
            ) : (
              <p
                className={`font-serif italic font-medium ${
                  isFullView
                    ? 'text-[13.5px] sm:text-[15px] mb-2.5 leading-relaxed'
                    : 'text-[11px] sm:text-[11.5px] mb-1.5 leading-snug sm:leading-relaxed'
                }`}
              >
                {pageData.firstLine}
              </p>
            )}

            {pageData.body?.map((para, i) => (
              <p
                key={i}
                className={`font-serif ${
                  isFullView
                    ? 'text-[13px] sm:text-[14.5px] mb-2 leading-relaxed'
                    : 'text-[10.5px] sm:text-[11px] mb-1.5 leading-snug sm:leading-relaxed'
                } opacity-90 indent-2.5`}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Page Footer Number with flex-shrink-0 so it is never clipped */}
        <div
          className={`flex-shrink-0 font-mono text-[8.5px] sm:text-[9px] opacity-40 pt-1 pb-0.5 ${
            pageNum % 2 === 1 ? 'text-left' : 'text-right'
          }`}
        >
          Page {pageNum}
        </div>
      </div>
    );
  };

  // Calculations for current page views
  const leftPageIndex = currentSpread * 2;
  const rightPageIndex = currentSpread * 2 + 1;
  const leftPage = volumeData.pages[leftPageIndex];
  const rightPage = volumeData.pages[rightPageIndex];

  const singlePage = volumeData.pages[singlePageIndex];
  const nextSinglePage = volumeData.pages[singlePageIndex + 1];
  const prevSinglePage = volumeData.pages[singlePageIndex - 1];

  // Render the core 3D Book Stage (reusable in both inline and full-view portal modes)
  const renderBookStage = (isFullView = false) => {
    const stageContainerClasses = isFullView
      ? viewMode === 'duo'
        ? 'w-full max-w-5xl mx-auto h-[540px] sm:h-[620px] xl:h-[680px]'
        : 'w-full max-w-[420px] sm:max-w-[460px] mx-auto h-[580px] sm:h-[660px]'
      : viewMode === 'duo'
        ? 'w-full max-w-[660px] mx-auto h-[440px] sm:h-[470px]'
        : 'w-full max-w-[380px] sm:max-w-[410px] mx-auto h-[500px] sm:h-[530px]';

    return (
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`book-stage-3d ${stageContainerClasses}`}
      >
        {/* Leather/Cloth Outer Cover Casing */}
        <div
          className={`w-full h-full rounded-2xl ${
            isFullView ? 'p-3.5 sm:p-5' : 'p-2 sm:p-2.5'
          } relative overflow-hidden transition-colors duration-300 stacked-page-block-edges flex flex-col`}
          style={{ backgroundColor: themeStyle.lining }}
        >
          {/* Center Spine Silk Ribbon (in Duo mode) */}
          {viewMode === 'duo' && (
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 ${
                isFullView ? 'w-4 h-12' : 'w-3 h-10'
              } bg-gradient-to-b from-[#7B1826] via-[#61121E] to-[#450C15] z-30 shadow-md pointer-events-none rounded-b-xs`}
            >
              <div
                className={`absolute ${isFullView ? '-bottom-2 h-2.5' : '-bottom-1.5 h-2'} left-0 right-0 bg-[#450C15]`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />
            </div>
          )}

          {/* THE PAGES SPREAD CONTAINER */}
          <div
            className="relative flex-1 rounded-xl flex overflow-hidden border transition-colors duration-300 book-spread-container"
            style={{
              backgroundColor: themeStyle.bg,
              color: themeStyle.text,
              borderColor: themeStyle.border,
            }}
          >
            {/* MODE 1: DUO TWO-PAGE SPREAD */}
            {viewMode === 'duo' && (
              <>
                {/* Center Gutter Spine Crease Shadow */}
                <div className="book-gutter-shadow" />

                {/* Left Page (Verso) */}
                <div
                  onClick={handleTurnBackward}
                  className={`w-1/2 ${
                    isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'
                  } border-r transition-colors duration-300 cursor-pointer relative overflow-hidden ${
                    currentSpread === 0 ? 'cursor-default' : 'hover:bg-black/[0.015]'
                  }`}
                  style={{ borderColor: themeStyle.border }}
                >
                  {renderPageContent(
                    isFlipping === 'backward' && currentSpread > 0
                      ? volumeData.pages[(currentSpread - 1) * 2]
                      : leftPage,
                    isFlipping === 'backward' && currentSpread > 0
                      ? (currentSpread - 1) * 2 + 1
                      : leftPageIndex + 1,
                    isFullView
                  )}

                  {currentSpread > 0 && !isFullView && (
                    <div className="absolute bottom-2 left-2 p-1 rounded-full bg-black/5 hover:bg-black/10 text-current transition-all">
                      <PiCaretLeftBold className="text-xs" />
                    </div>
                  )}
                </div>

                {/* Right Page (Recto) */}
                <div
                  onClick={handleTurnForward}
                  className={`w-1/2 ${
                    isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'
                  } transition-colors duration-300 cursor-pointer relative overflow-hidden ${
                    currentSpread >= totalSpreads - 1 ? 'cursor-default' : 'hover:bg-black/[0.015]'
                  }`}
                >
                  {renderPageContent(
                    isFlipping === 'forward' && currentSpread < totalSpreads - 1
                      ? volumeData.pages[(currentSpread + 1) * 2 + 1]
                      : rightPage,
                    isFlipping === 'forward' && currentSpread < totalSpreads - 1
                      ? (currentSpread + 1) * 2 + 2
                      : rightPageIndex + 1,
                    isFullView
                  )}

                  {currentSpread < totalSpreads - 1 && !isFullView && (
                    <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/5 hover:bg-black/10 text-current transition-all">
                      <PiCaretRightBold className="text-xs" />
                    </div>
                  )}

                  {currentSpread < totalSpreads - 1 && (
                    <div
                      className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none apple-books-peel-corner"
                      style={{
                        background:
                          'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.14) 50%, rgba(255,255,255,0.7) 56%, transparent 60%)',
                      }}
                    />
                  )}
                </div>

                {/* 3D Page Turn Leaf for Duo Mode */}
                {isFlipping === 'forward' && (
                  <div
                    className="book-turning-leaf book-turning-leaf-forward"
                    style={{
                      backgroundColor: themeStyle.bg,
                      color: themeStyle.text,
                      borderColor: themeStyle.border,
                    }}
                  >
                    <div
                      className={`book-page-face-front ${isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'} border-l`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(rightPage, rightPageIndex + 1, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                    <div
                      className={`book-page-face-back ${isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'} border-r`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(
                        volumeData.pages[(currentSpread + 1) * 2],
                        (currentSpread + 1) * 2 + 1,
                        isFullView
                      )}
                      <div className="cylinder-curl-shadow" />
                    </div>
                  </div>
                )}

                {isFlipping === 'backward' && (
                  <div
                    className="book-turning-leaf book-turning-leaf-backward"
                    style={{
                      backgroundColor: themeStyle.bg,
                      color: themeStyle.text,
                      borderColor: themeStyle.border,
                    }}
                  >
                    <div
                      className={`book-page-face-front ${isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'} border-r`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(leftPage, leftPageIndex + 1, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                    <div
                      className={`book-page-face-back ${isFullView ? 'p-6 sm:p-8' : 'p-3 sm:p-4'} border-l`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(
                        volumeData.pages[(currentSpread - 1) * 2 + 1],
                        (currentSpread - 1) * 2 + 2,
                        isFullView
                      )}
                      <div className="cylinder-curl-shadow" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* MODE 2: IPHONE SINGLE PAGE VIEW */}
            {viewMode === 'single' && (
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  if (clickX < rect.width * 0.35) {
                    handleTurnBackward();
                  } else {
                    handleTurnForward();
                  }
                }}
                className={`w-full h-full ${
                  isFullView ? 'p-6 sm:p-8' : 'p-4 sm:p-5'
                } transition-colors duration-300 cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />

                {renderPageContent(
                  isFlipping === 'forward' && singlePageIndex < totalPages - 1
                    ? nextSinglePage
                    : isFlipping === 'backward' && singlePageIndex > 0
                    ? prevSinglePage
                    : singlePage,
                  isFlipping === 'forward' && singlePageIndex < totalPages - 1
                    ? singlePageIndex + 2
                    : isFlipping === 'backward' && singlePageIndex > 0
                    ? singlePageIndex
                    : singlePageIndex + 1,
                  isFullView
                )}

                {singlePageIndex > 0 && !isFullView && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTurnBackward();
                    }}
                    className="absolute bottom-3 left-3 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-current transition-all z-20"
                    title="Previous page"
                  >
                    <PiCaretLeftBold className="text-xs" />
                  </button>
                )}

                {singlePageIndex < totalPages - 1 && !isFullView && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTurnForward();
                    }}
                    className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-current transition-all z-20"
                    title="Next page"
                  >
                    <PiCaretRightBold className="text-xs" />
                  </button>
                )}

                {singlePageIndex < totalPages - 1 && (
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none apple-books-peel-corner"
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%, rgba(255,255,255,0.7) 56%, transparent 60%)',
                    }}
                  />
                )}

                {/* 3D Page Turn Leaf for iPhone Mode */}
                {isFlipping === 'forward' && (
                  <div
                    className="book-turning-leaf-single book-turning-leaf-single-forward"
                    style={{
                      backgroundColor: themeStyle.bg,
                      color: themeStyle.text,
                      borderColor: themeStyle.border,
                    }}
                  >
                    <div
                      className={`book-page-face-front ${isFullView ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(singlePage, singlePageIndex + 1, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                    <div
                      className={`book-page-face-back ${isFullView ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(nextSinglePage, singlePageIndex + 2, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                  </div>
                )}

                {isFlipping === 'backward' && (
                  <div
                    className="book-turning-leaf-single book-turning-leaf-single-backward"
                    style={{
                      backgroundColor: themeStyle.bg,
                      color: themeStyle.text,
                      borderColor: themeStyle.border,
                    }}
                  >
                    <div
                      className={`book-page-face-front ${isFullView ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(singlePage, singlePageIndex + 1, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                    <div
                      className={`book-page-face-back ${isFullView ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}
                      style={{ backgroundColor: themeStyle.bg, borderColor: themeStyle.border }}
                    >
                      {renderPageContent(prevSinglePage, singlePageIndex, isFullView)}
                      <div className="cylinder-curl-shadow" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full my-4 relative select-none">
      {/* 1. INLINE HUD CONTROL BAR */}
      <div className="w-full max-w-[660px] mx-auto flex items-center justify-between bg-black/75 backdrop-blur-md text-stone-200 px-3.5 py-1.5 rounded-xl mb-3 border border-white/10 text-xs shadow-md">
        <div className="flex items-center gap-1.5 truncate">
          <PiBookOpenBold className="text-amber-400 text-sm flex-shrink-0" />
          <span className="font-serif font-bold text-stone-100 truncate text-[11px] sm:text-xs">
            {book?.title || 'Apple Books'}
          </span>
        </div>

        {/* Center: Layout View Mode Toggle [ 📱 iPhone | 📖 Duo ] */}
        <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/15 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
              viewMode === 'single'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Apple Books iPhone View (Single Page)"
          >
            <PiDeviceMobileBold className="text-xs" />
            <span className="hidden sm:inline">iPhone</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('duo')}
            className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
              viewMode === 'duo'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Apple Books Duo Spread (Two Facing Pages)"
          >
            <PiBookBookmarkBold className="text-xs" />
            <span className="hidden sm:inline">Duo Spread</span>
          </button>
        </div>

        {/* Right: Paper Shade & Fullscreen Expand */}
        <div className="flex items-center gap-2">
          {/* Paper Theme */}
          <div className="flex items-center bg-white/10 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setPaperTheme('ivory')}
              title="Ivory Archival"
              className={`w-4 h-4 rounded-full transition-all ${
                paperTheme === 'ivory' ? 'ring-2 ring-amber-400 scale-110' : 'opacity-60'
              }`}
              style={{ backgroundColor: '#FAF6EF' }}
            />
            <button
              type="button"
              onClick={() => setPaperTheme('sepia')}
              title="Warm Sepia"
              className={`w-4 h-4 rounded-full transition-all ml-1 ${
                paperTheme === 'sepia' ? 'ring-2 ring-amber-400 scale-110' : 'opacity-60'
              }`}
              style={{ backgroundColor: '#F3EBDD' }}
            />
            <button
              type="button"
              onClick={() => setPaperTheme('obsidian')}
              title="Obsidian Dark"
              className={`w-4 h-4 rounded-full transition-all ml-1 ${
                paperTheme === 'obsidian' ? 'ring-2 ring-amber-400 scale-110' : 'opacity-60'
              }`}
              style={{ backgroundColor: '#1C1920' }}
            />
          </div>

          {/* Expand in Full View Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title="Expand to Full View"
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-all active:scale-95"
          >
            <PiArrowsOutBold className="text-xs text-amber-300" />
          </button>
        </div>
      </div>

      {/* 2. THE BOOK STAGE (Inline View) */}
      {renderBookStage(false)}

      {/* 3. APPLE BOOKS FOOTER BAR (Inline View) */}
      <div
        className={`mt-2.5 flex items-center justify-between text-xs font-mono text-stone-500 w-full ${
          viewMode === 'duo' ? 'max-w-[660px]' : 'max-w-[400px]'
        } mx-auto px-1`}
      >
        <button
          type="button"
          onClick={handleTurnBackward}
          disabled={(viewMode === 'single' ? singlePageIndex === 0 : currentSpread === 0) || isFlipping}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-all text-[11px]"
        >
          <PiArrowLeftBold className="text-xs" />
          <span>Prev</span>
        </button>

        {/* Page Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-stone-700">
            {viewMode === 'single'
              ? `Page ${singlePageIndex + 1} of ${totalPages}`
              : `Pages ${leftPageIndex + 1}–${rightPageIndex + 1} of ${totalPages}`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleTurnForward}
          disabled={
            (viewMode === 'single' ? singlePageIndex >= totalPages - 1 : currentSpread >= totalSpreads - 1) ||
            isFlipping
          }
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-burgundy hover:bg-[#60121D] text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs text-[11px]"
        >
          <span>Next</span>
          <PiArrowRightBold className="text-xs" />
        </button>
      </div>

      {/* 4. EXPANDED FULL-SCREEN THEATER: ONLY THE BOOK IS VISIBLE (Rendered in React Portal directly to document.body) */}
      {isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 select-none animate-in fade-in duration-300 text-stone-100 overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, #17120e 0%, #070605 100%)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Full Screen Book Reader"
          >
            {/* Ambient Library Warm Illumination behind the book */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[600px] rounded-full pointer-events-none opacity-25 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(123, 24, 38, 0.12) 50%, transparent 70%)',
              }}
            />

            {/* Minimalist Discreet Close Button in Top-Right Corner */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 text-stone-400 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-md transition-all text-xs font-mono shadow-xl group active:scale-95"
              title="Close Full Screen (or press Esc)"
            >
              <PiXBold className="text-xs transition-transform duration-200 group-hover:rotate-90" />
              <span>Close</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 bg-white/10 text-[9px] rounded font-mono border border-white/15">
                Esc
              </kbd>
            </button>

            {/* Center Book Stage - ONLY element visible on screen */}
            <div className="w-full flex items-center justify-center relative z-10 max-w-5xl">
              {renderBookStage(true)}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PageFlipPreview;
