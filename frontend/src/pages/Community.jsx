import React, { useState, useEffect, useContext, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiFeatherBold,
  PiPlusBold,
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiShareNetworkBold,
  PiDotsThreeBold,
  PiMoonFill,
  PiPenNibBold,
  PiColumnsBold,
  PiCaretDownBold,
  PiBookOpenBold,
  PiUsersBold,
  PiSparkleBold,
  PiCheckBold,
  PiHouseBold,
  PiHeadphonesBold,
  PiNotePencilBold,
  PiXBold,
  PiClockBold,
  PiFlameBold,
  PiCloudRainBold,
  PiPaperPlaneRightBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
  PiArrowsClockwiseBold,
  PiCaretRightBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playPageFlipSound,
  playRevealChime,
  playBookSpineSlide,
  startAmbientSound,
  stopAmbientSound,
} from '../utils/soundEffects';

const Community = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // ============================================================
  // 1. EXTRAORDINARY ENTRANCE ANIMATION STATE
  // ============================================================
  const [hasEntered, setHasEntered] = useState(false);
  const [isOpeningDoors, setIsOpeningDoors] = useState(false);
  const [showEntranceOverlay, setShowEntranceOverlay] = useState(true);

  // Trigger grand door opening
  const handleOpenSalonDoors = () => {
    if (isOpeningDoors) return;
    setIsOpeningDoors(true);
    playWaxSealCrack();
    playRevealChime();

    setTimeout(() => {
      playPaperUnwrap();
    }, 400);

    setTimeout(() => {
      setHasEntered(true);
      setShowEntranceOverlay(false);
      enqueueSnackbar('Welcome kindred mind, the Salon doors stand open 🕯️', {
        variant: 'success',
      });
    }, 1300);
  };

  // Re-trigger entrance animation anytime
  const handleReplayEntrance = () => {
    setShowEntranceOverlay(true);
    setIsOpeningDoors(false);
    setHasEntered(false);
    playBookSpineSlide();
  };

  // Auto-prompt sound check
  const [activeAmbiance, setActiveAmbiance] = useState('off'); // 'off' | 'rain' | 'fireplace' | 'clock'
  const handleToggleAmbiance = (type) => {
    if (activeAmbiance === type) {
      stopAmbientSound();
      setActiveAmbiance('off');
      enqueueSnackbar('Ambiance silenced 🔇', { variant: 'info' });
    } else {
      startAmbientSound(type);
      setActiveAmbiance(type);
      enqueueSnackbar(
        type === 'rain'
          ? 'Listening to rain against cathedral glass 🌧️'
          : type === 'fireplace'
          ? 'Hearth fire crackling in the salon 🕯️'
          : 'Grandfather clock chiming softly 🕰️',
        { variant: 'info' }
      );
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  // ============================================================
  // 2. ACTIVE CHAMBER TAB NAVIGATION
  // ============================================================
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'rooms' | 'marginalia' | 'matches'
  const [sortOption, setSortOption] = useState('Recent');
  const [filterParlour, setFilterParlour] = useState('All Parlours');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [parlourDropdownOpen, setParlourDropdownOpen] = useState(false);

  // Modals
  const [showCompose, setShowCompose] = useState(false);
  const [showCreateParlourModal, setShowCreateParlourModal] = useState(false);
  const [selectedTableBook, setSelectedTableBook] = useState(null);

  // Compose State
  const [newReflectionText, setNewReflectionText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');
  const [selectedComposeParlour, setSelectedComposeParlour] = useState('The Gothic Study');
  const [parchmentTone, setParchmentTone] = useState('vellum'); // 'vellum' | 'linen' | 'nocturne'

  // Create Parlour State
  const [newParlourTitle, setNewParlourTitle] = useState('');
  const [newParlourDesc, setNewParlourDesc] = useState('');

  // Silent Reading Room Timer
  const [readingTimerRunning, setReadingTimerRunning] = useState(false);
  const [readingSeconds, setReadingSeconds] = useState(1485); // 24m 45s
  const [readingPagesGoal, setReadingPagesGoal] = useState(24);
  const [readingPagesRead, setReadingPagesRead] = useState(18);

  useEffect(() => {
    let interval = null;
    if (readingTimerRunning) {
      interval = setInterval(() => {
        setReadingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [readingTimerRunning]);

  // ============================================================
  // 3. PHYSICAL BOOKS CURRENTLY SPREAD ON THE SALON TABLE
  // ============================================================
  const tableBooks = [
    {
      id: 'tb-1',
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      activeReaders: 14,
      tag: 'Victorian Aestheticism',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
      recentNote: '“Behind every exquisite thing that existed, there was something tragic.”',
      noteAuthor: 'Eleanor Vance',
    },
    {
      id: 'tb-2',
      title: 'The Odyssey',
      author: 'Homer',
      activeReaders: 9,
      tag: 'Epic Archaic Canon',
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=300&auto=format&fit=crop&q=80',
      recentNote: '“There is a time for many words, and there is also a time for sleep.”',
      noteAuthor: 'Julian Frost',
    },
    {
      id: 'tb-3',
      title: '1984',
      author: 'George Orwell',
      activeReaders: 21,
      tag: 'Dystopian Vigil',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
      recentNote: '“Perhaps one did not want to be loved so much as to be understood.”',
      noteAuthor: 'Arthur Pendelton',
    },
    {
      id: 'tb-4',
      title: 'Crime and Punishment',
      author: 'Fyodor Dostoevsky',
      activeReaders: 18,
      tag: 'Psychological Realism',
      cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
      recentNote: '“Pain and suffering are always inevitable for a large intelligence and a deep heart.”',
      noteAuthor: 'Clara Oswald',
    },
  ];

  // ============================================================
  // 4. PARLOURS DIRECTORY STATE
  // ============================================================
  const [parlours, setParlours] = useState([
    {
      id: 'midnight',
      title: 'The Midnight Philosophers',
      desc: 'Late-night classics, existential reflections & quiet tea.',
      members: 342,
      joined: false,
      img: '/images/parlour-midnight.jpg',
      tags: ['Philosophy', 'Nocturnal', 'Kierkegaard'],
    },
    {
      id: 'gothic',
      title: 'The Gothic Study',
      desc: 'Candlelight, Victorian mystery & brooding atmospheres.',
      members: 512,
      joined: true,
      img: '/images/parlour-gothic.jpg',
      tags: ['Victorian', 'Gothic', 'Wilde'],
    },
    {
      id: 'slow',
      title: 'Slow Readers Society',
      desc: 'One chapter a week. Close reading & deep conversations.',
      members: 820,
      joined: false,
      img: '/images/parlour-slow.jpg',
      tags: ['Close Reading', 'Annotated', 'Weekly'],
    },
  ]);

  // ============================================================
  // 5. FEED POSTS & INTERACTIVE MARGINALIA COMMENTS
  // ============================================================
  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Eleanor Vance',
      handle: 'eleanor_reads',
      avatar: '/images/eleanor-avatar.jpg',
      time: '22m ago',
      parlour: 'The Gothic Study',
      quote: '“Behind every exquisite thing that existed, there was something tragic.”',
      quoteAuthor: 'Oscar Wilde',
      quoteImg: '/images/dorian-open-book-spread.jpg',
      content:
        'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it?',
      likes: 47,
      commentsCount: 12,
      liked: false,
      bookmarked: false,
      showComments: false,
      commentsList: [
        {
          id: 'c-1',
          author: 'Julian Frost',
          handle: 'jfrost',
          text: 'The portrait decaying while he remains untouched is the ultimate metaphor for moral dissociation.',
          time: '15m ago',
        },
        {
          id: 'c-2',
          author: 'Clara Oswald',
          handle: 'clara_books',
          text: 'This line stopped me cold when I first read Dorian Gray at university.',
          time: '8m ago',
        },
      ],
    },
    {
      id: 'post-2',
      author: 'Arthur Pendelton',
      handle: 'arthur_scribe',
      avatar: '/images/arthur-avatar.jpg',
      time: '1h ago',
      parlour: 'Slow Readers Society',
      quote: null,
      quoteAuthor: null,
      quoteImg: null,
      content:
        'Rereading Part Two this morning under soft rain. What terrifies me most about 1984 isn’t the torture; it’s the quiet compliance of forgetting.',
      likes: 89,
      commentsCount: 18,
      liked: true,
      bookmarked: false,
      showComments: false,
      commentsList: [
        {
          id: 'c-3',
          author: 'Maya Lin',
          handle: 'mayareads',
          text: 'Doublethink is so insidious precisely because it demands total cognitive surrender.',
          time: '45m ago',
        },
      ],
    },
  ]);

  const [commentInputs, setCommentInputs] = useState({});

  const handleToggleJoin = (id) => {
    playBookSpineSlide();
    setParlours((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.joined;
          enqueueSnackbar(next ? `Entered ${p.title} 🕯️` : `Departed ${p.title}`, {
            variant: next ? 'success' : 'info',
          });
          return { ...p, joined: next, members: next ? p.members + 1 : p.members - 1 };
        }
        return p;
      })
    );
  };

  const handleLike = (id) => {
    playWaxSealCrack();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.liked;
          return { ...p, liked: next, likes: next ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      })
    );
  };

  const handleBookmark = (id) => {
    playPageFlipSound();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.bookmarked;
          enqueueSnackbar(
            next
              ? 'Saved reflection to your marginalia archive 📖'
              : 'Removed reflection from saved archive',
            { variant: 'info' }
          );
          return { ...p, bookmarked: next };
        }
        return p;
      })
    );
  };

  const toggleComments = (postId) => {
    playPaperUnwrap();
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, showComments: !p.showComments } : p))
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    playPageFlipSound();
    const authorName = user?.username || 'Nikhil Sehgal';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newC = {
            id: `c-${Date.now()}`,
            author: authorName,
            handle: authorName.toLowerCase().replace(/\s+/g, '_'),
            text,
            time: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...p.commentsList, newC],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    enqueueSnackbar('Marginalia inscribed to the discussion ✒️', { variant: 'success' });
  };

  const handlePublishReflection = (e) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;

    playWaxSealCrack();
    playRevealChime();

    const authorName = user?.username || 'Nikhil Sehgal';
    const newPost = {
      id: `post-${Date.now()}`,
      author: authorName,
      handle: authorName.toLowerCase().replace(/\s+/g, '_'),
      avatar: '/images/eleanor-avatar.jpg',
      time: 'Just now',
      parlour: selectedComposeParlour,
      quote: newQuoteText.trim() ? `“${newQuoteText.trim()}”` : null,
      quoteAuthor: newQuoteAuthor.trim() || 'Author',
      quoteImg: newQuoteText.trim() ? '/images/dorian-open-book-spread.jpg' : null,
      content: newReflectionText.trim(),
      likes: 1,
      commentsCount: 0,
      liked: true,
      bookmarked: false,
      showComments: false,
      commentsList: [],
    };

    setPosts([newPost, ...posts]);
    setNewReflectionText('');
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setShowCompose(false);
    enqueueSnackbar('Reflection inscribed to the Common Room ✒️', { variant: 'success' });
  };

  const handleCreateParlour = (e) => {
    e.preventDefault();
    if (!newParlourTitle.trim()) return;

    playRevealChime();
    const newParlour = {
      id: `parlour-${Date.now()}`,
      title: newParlourTitle.trim(),
      desc: newParlourDesc.trim() || 'A new literary parlour for kindred minds.',
      members: 1,
      joined: true,
      img: '/images/parlour-midnight.jpg',
      tags: ['Custom Parlour', 'Salon'],
    };

    setParlours([newParlour, ...parlours]);
    setNewParlourTitle('');
    setNewParlourDesc('');
    setShowCreateParlourModal(false);
    enqueueSnackbar(`Literary Parlour "${newParlour.title}" established! 🕯️`, {
      variant: 'success',
    });
  };

  const handleWaxSealFortune = () => {
    playWaxSealCrack();
    const fortunes = [
      '“A classic is a book that has never finished saying what it has to say.” — Italo Calvino',
      '“You can never get a cup of tea large enough or a book long enough to suit me.” — C.S. Lewis',
      '“There is no friend as loyal as a book.” — Ernest Hemingway',
      '“We read to know we’re not alone.” — William Nicholson',
    ];
    const picked = fortunes[Math.floor(Math.random() * fortunes.length)];
    enqueueSnackbar(picked, { variant: 'info', autoHideDuration: 6000 });
  };

  const readerName = user?.username || 'Nikhil Sehgal';

  const filteredPosts = posts.filter((p) => {
    if (filterParlour === 'All Parlours') return true;
    return p.parlour === filterParlour;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === 'Top Reflections') return b.likes - a.likes;
    if (sortOption === 'Most Discussed') return b.commentsCount - a.commentsCount;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#2F2620] selection:bg-[#7D2235]/25 font-sans relative">
      
      {/* ============================================================
          0. GRAND ENTRANCE FOLIO OVERLAY WITH 3D DOORS OPENING
          ============================================================ */}
      {showEntranceOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 perspective-salon">
          
          {/* Ambient Lighting Rays when Opening */}
          {isOpeningDoors && (
            <div className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.45)_0%,_rgba(125,34,53,0.3)_40%,_transparent_75%)] animate-light-rays pointer-events-none" />
          )}

          {/* Left Antique Leather Door */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1/2 leather-bound flex flex-col justify-between p-8 sm:p-14 z-20 border-r border-[#D4AF37]/40 ${
              isOpeningDoors ? 'animate-folio-left' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl text-[#D4AF37]">⚜️</span>
              <span className="font-serif uppercase tracking-[0.25em] text-xs gold-emboss">
                PageTurner Heritage Sanctum
              </span>
            </div>

            <div className="my-auto max-w-sm ml-auto text-right pr-4">
              <span className="font-mono text-[11px] tracking-widest text-[#A8947C] uppercase block mb-2">
                Curated Literary Order
              </span>
              <h2 className="font-serif italic text-3xl sm:text-4xl text-[#F5EDE0] leading-tight gold-emboss">
                The Readers’ Salon
              </h2>
              <p className="font-serif italic text-sm text-[#CDBBA7] mt-3 leading-relaxed">
                “A private haven where kindred minds linger over tea, ink, and ancient bindings.”
              </p>
            </div>

            <div className="font-mono text-[10px] text-[#8C7A68] tracking-widest uppercase">
              Chamber Folio • Volume I
            </div>
          </div>

          {/* Right Antique Leather Door */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-1/2 leather-bound flex flex-col justify-between p-8 sm:p-14 z-20 border-l border-[#D4AF37]/40 ${
              isOpeningDoors ? 'animate-folio-right' : ''
            }`}
          >
            <div className="flex items-center justify-end gap-3">
              <span className="font-serif uppercase tracking-[0.25em] text-xs gold-emboss">
                Est. MDCCCXC
              </span>
              <span className="text-2xl text-[#D4AF37]">⚜️</span>
            </div>

            <div className="my-auto max-w-sm mr-auto text-left pl-4">
              <span className="font-mono text-[11px] tracking-widest text-[#A8947C] uppercase block mb-2">
                Sanctuary Inscription
              </span>
              <p className="font-serif text-sm text-[#E6D7C3] leading-relaxed italic">
                “Enter all who read not merely to pass the hours, but to dwell within them.”
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs text-[#BFA890]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>218 readers currently gathered inside</span>
              </div>
            </div>

            <div className="font-mono text-[10px] text-[#8C7A68] tracking-widest uppercase text-right">
              Non Omnis Moriar
            </div>
          </div>

          {/* Central Wax Seal & Enter Trigger */}
          <div
            className={`relative z-30 flex flex-col items-center justify-center cursor-pointer group ${
              isOpeningDoors ? 'animate-seal-break' : ''
            }`}
            onClick={handleOpenSalonDoors}
          >
            {/* Molten Red Wax Seal */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#781B2A] border-4 border-[#52101B] shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-105 active:scale-95 ring-4 ring-[#9B2538]/50">
              <PiFlameBold className="text-amber-300 text-2xl animate-candle-glow mb-1" />
              <span className="font-serif text-[11px] uppercase tracking-widest text-[#FDE8EC] font-bold">
                Enter
              </span>
              <span className="font-serif text-xs text-[#F2BBC5] italic font-semibold">
                Salon
              </span>
              <span className="font-mono text-[8px] text-[#D4AF37] tracking-wider mt-0.5">
                PT • 1890
              </span>
            </div>

            <span className="mt-4 px-4 py-1.5 rounded-full bg-black/60 text-[#F5EDE0] text-xs font-serif italic border border-[#D4AF37]/30 backdrop-blur-md shadow-lg group-hover:bg-[#781B2A] group-hover:text-white transition-all">
              Touch Wax Seal to Step Inside 🕯️
            </span>
          </div>

        </div>
      )}

      {/* Main Page Navbar */}
      <Navbar />

      {/* ============================================================
          TOP AMBIENT TICKER & SOUND BAR
          ============================================================ */}
      <div className="w-full bg-[#271E18] text-[#E0D3C1] border-b border-[#3D3027] px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-10">
        
        {/* Live Community Pulse Ticker */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#8E283F] text-white text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            Live Dispatch
          </span>
          <span className="text-xs text-[#D8C7B0] truncate max-w-xs sm:max-w-md font-serif italic">
            🕯️ 218 readers reading now &bull; Eleanor Vance annotated Chapter IV of Dorian Gray &bull; Arthur started Part II of 1984
          </span>
        </div>

        {/* Tactile Ambient Sounds Controller */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <span className="text-[#968372] hidden md:inline font-mono text-[11px]">Ambiance:</span>
          
          <button
            type="button"
            onClick={() => handleToggleAmbiance('rain')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] ${
              activeAmbiance === 'rain'
                ? 'bg-[#8E283F] text-white font-semibold shadow-xs'
                : 'hover:bg-white/10 text-[#C7B5A0]'
            }`}
            title="Rain against gothic window"
          >
            <PiCloudRainBold />
            <span>Rain</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleAmbiance('fireplace')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] ${
              activeAmbiance === 'fireplace'
                ? 'bg-[#8E283F] text-white font-semibold shadow-xs'
                : 'hover:bg-white/10 text-[#C7B5A0]'
            }`}
            title="Crackling salon hearth flame"
          >
            <PiFlameBold />
            <span>Hearth</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleAmbiance('clock')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all text-[11px] ${
              activeAmbiance === 'clock'
                ? 'bg-[#8E283F] text-white font-semibold shadow-xs'
                : 'hover:bg-white/10 text-[#C7B5A0]'
            }`}
            title="Grandfather clock & Turning Pages"
          >
            <PiClockBold />
            <span>Clock</span>
          </button>

          {/* Re-trigger Grand Entrance Button */}
          <button
            type="button"
            onClick={handleReplayEntrance}
            className="p-1 rounded-md hover:bg-white/10 text-[#C7B5A0] ml-1"
            title="Close & Re-open Grand Doors"
          >
            <PiArrowsClockwiseBold className="text-sm" />
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* ============================================================
            1. HERO SANCTUARY BANNER (100% NATIVE REACT & CSS OVER SCENIC BACKDROP)
            ============================================================ */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-[#D5C6AF] shadow-[0_16px_50px_rgba(35,26,18,0.22)] bg-[#191512] mb-6 select-none">
          
          {/* Panoramic Atmospheric Visual Window (NO TEXT IN IMAGE) */}
          <div className="relative w-full min-h-[320px] sm:min-h-[350px] md:min-h-[370px] overflow-hidden flex flex-col justify-between">
            <img
              src="/images/salon-hero-backdrop.jpg"
              alt="The Readers' Salon Window Sanctuary"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] pointer-events-none"
            />

            {/* Gradient overlays to ensure crystal-clear text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

            {/* Top / Main Hero Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              {/* Left Column: Heading, Subtitle, Description, and CTA Buttons */}
              <div className="max-w-xl text-left">
                <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#F7EFE2] tracking-wide leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  The Readers’ Salon
                </h1>
                
                <p className="font-serif italic text-base sm:text-lg text-[#E6D4BD] mt-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                  A private literary haven for kindred minds.
                </p>
                
                <p className="text-xs sm:text-[13px] text-[#CBC0B0] mt-1.5 max-w-md leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  Join intimate parlours, share reflections, exchange marginalia, and find readers who read the world like you do.
                </p>

                {/* The Two Authentic Action Buttons */}
                <div className="flex items-center gap-3 mt-6">
                  {/* Primary Burgundy Button: Share a Reflection */}
                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setShowCompose((prev) => !prev);
                    }}
                    className="h-10 px-5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-[#FDFBF7] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(125,34,53,0.45)] border border-[#A4344C]/40 cute-press cursor-pointer transition-all"
                  >
                    <PiFeatherBold className="text-sm text-[#F7D8A4]" />
                    <span>Share a Reflection</span>
                  </button>

                  {/* Frosted Glass Outline Button: + Create a Parlour */}
                  <button
                    type="button"
                    onClick={() => {
                      playBookSpineSlide();
                      setShowCreateParlourModal(true);
                    }}
                    className="h-10 px-5 rounded-full bg-black/40 hover:bg-black/60 text-[#EADBCC] text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-[#D1B898]/30 shadow-sm cute-press cursor-pointer transition-all"
                  >
                    <PiPlusBold className="text-xs text-[#EADBCC]" />
                    <span>Create a Parlour</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Real Parchment Note Card (Today in the Salon ♡) */}
              <div className="relative self-end md:self-auto w-full max-w-[280px] sm:max-w-[300px]">
                <div className="relative bg-[#FAF4E8] text-[#2F241C] rounded-lg p-5 border border-[#D8C7B0] shadow-[0_16px_35px_rgba(0,0,0,0.45)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  
                  {/* Card Header */}
                  <div className="text-center font-serif text-xs text-[#7B6856] tracking-wide mb-2 flex items-center justify-center gap-1">
                    <span>Today in the Salon</span>
                    <span className="text-[#8D263B] text-[10px]">♡</span>
                  </div>
                  
                  {/* Card Quote */}
                  <blockquote className="font-serif italic text-sm text-[#2F241C] text-center leading-snug">
                    “A book is a dream you hold in your hands.”
                  </blockquote>
                  
                  {/* Author Attribution */}
                  <p className="font-serif text-[11px] text-[#867362] text-right mt-3">
                    — Neil Gaiman
                  </p>

                  {/* Authentic Dark Red Wax Seal Medallion in Corner (Interactive Fortune) */}
                  <div
                    onClick={handleWaxSealFortune}
                    className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#7C1E2D] border-2 border-[#57131F] shadow-[0_6px_14px_rgba(0,0,0,0.4)] flex items-center justify-center text-[#E89EAA] font-serif text-[11px] font-bold ring-2 ring-[#992537]/40 select-none rotate-12 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                    title="Click for a secret literary fortune"
                  >
                    PT
                  </div>
                </div>
              </div>

            </div>

            <div className="h-2" />
          </div>

          {/* ============================================================
              NAVIGATION RIBBON BAR (DIRECTLY INTEGRATED UNDER WINDOW SILL)
              ============================================================ */}
          <div className="w-full bg-[#EFE8DA] border-t border-[#D9CCB7] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs flex-wrap gap-3">
            
            {/* 5 Distinct Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium flex-wrap">
              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('feed');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiHouseBold className="text-xs" />
                <span>Salon Feed</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('parlours');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'parlours'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiUsersBold className="text-xs" />
                <span>Literary Parlours</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('rooms');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiHeadphonesBold className="text-xs" />
                <span>Reading Rooms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('marginalia');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'marginalia'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiNotePencilBold className="text-xs" />
                <span>Marginalia Exchange</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('matches');
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'matches'
                    ? 'bg-[#7D2235] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620] hover:bg-[#E2D6C3]'
                }`}
              >
                <PiSparkleBold className="text-xs" />
                <span>Reader Matches</span>
              </button>
            </div>

            {/* Metrics & Avatars on the Right */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs">
              <div className="flex -space-x-2 overflow-hidden items-center">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] object-cover"
                  src="/images/eleanor-avatar.jpg"
                  alt="Eleanor Vance"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] object-cover"
                  src="/images/arthur-avatar.jpg"
                  alt="Arthur Pendelton"
                />
                <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-[#EFE8DA] bg-[#C59B63] text-white items-center justify-center text-[10px] font-bold">
                  PT
                </div>
              </div>
              <span className="text-[#645548] font-medium hidden sm:inline">12,480 Readers</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#286337] bg-[#286337]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#286337] animate-pulse" />
                218 Reading Now
              </span>
            </div>

          </div>
        </section>

        {/* ============================================================
            PHYSICAL BOOKS SPREAD ON THE SALON TABLE (IMMERSIVE COMMUNITY VIBE)
            ============================================================ */}
        {activeTab === 'feed' && (
          <section className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#EFE6D7] border border-[#D5C6AF] shadow-md text-left">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DACBB5]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2A2018] flex items-center gap-2">
                  <span>Open on the Salon Tables</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#8E283F] text-white font-sans font-medium">
                    Live Volumes
                  </span>
                </h3>
                <p className="text-xs text-[#736354] mt-0.5">
                  Pick up any volume to see readers currently reading at that table and their margin scribbles.
                </p>
              </div>
              <span className="text-xs font-mono text-[#8C7A68] hidden sm:inline">
                4 Volumes in Circulation
              </span>
            </div>

            {/* Physical 3D Books Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tableBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    playBookSpineSlide();
                    setSelectedTableBook(book);
                  }}
                  className="table-book-3d p-3 rounded-xl bg-[#FAF5EB] border border-[#D8C7B0] cursor-pointer flex flex-col justify-between group shadow-sm"
                >
                  <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden mb-2.5 shadow-md">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-amber-200 text-[10px] font-mono backdrop-blur-sm">
                      {book.activeReaders} reading
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#8E283F] uppercase block tracking-wider font-semibold">
                      {book.tag}
                    </span>
                    <h4 className="font-serif font-bold text-xs text-[#2A2018] leading-snug line-clamp-1 group-hover:text-[#8E283F] transition-colors">
                      {book.title}
                    </h4>
                    <span className="text-[11px] text-[#736354] block mt-0.5">
                      {book.author}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E5D7C2] flex items-center justify-between text-[11px] text-[#8E283F] font-medium">
                    <span>Pull up a chair</span>
                    <PiCaretRightBold className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modal when a table book is clicked */}
        {selectedTableBook && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 shadow-2xl text-left animate-drawer-spring">
              <button
                type="button"
                onClick={() => setSelectedTableBook(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#7A6A5E] cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>

              <div className="flex gap-4 items-start">
                <img
                  src={selectedTableBook.cover}
                  alt={selectedTableBook.title}
                  className="w-24 h-32 rounded-lg object-cover border border-[#D8C7B0] shadow-md flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono text-[#8E283F] font-bold uppercase tracking-wider">
                    {selectedTableBook.tag}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2F2620] leading-snug mt-0.5">
                    {selectedTableBook.title}
                  </h3>
                  <span className="text-xs text-[#7A6A5E] block">{selectedTableBook.author}</span>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {selectedTableBook.activeReaders} readers at this table
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                <span className="text-[10px] font-mono text-[#7A6A5E] uppercase block mb-1">
                  Latest Margin Annotation by {selectedTableBook.noteAuthor}:
                </span>
                <blockquote className="font-serif italic text-xs sm:text-sm text-[#2F2620] leading-relaxed">
                  {selectedTableBook.recentNote}
                </blockquote>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setSelectedTableBook(null)}
                  className="px-4 py-2 text-xs text-[#7A6A5E] hover:text-[#2F2620]"
                >
                  Close Volume
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playWaxSealCrack();
                    enqueueSnackbar(`Joined table discussion for ${selectedTableBook.title}! 📖`, {
                      variant: 'success',
                    });
                    setSelectedTableBook(null);
                  }}
                  className="px-5 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-md cute-press cursor-pointer"
                >
                  Join Reading Circle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            CREATE PARLOUR MODAL (INTERACTIVE)
            ============================================================ */}
        {showCreateParlourModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 shadow-2xl text-left animate-drawer-spring">
              <button
                type="button"
                onClick={() => setShowCreateParlourModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-[#7A6A5E] cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#2F2620] mb-1 flex items-center gap-2">
                <PiUsersBold className="text-[#7D2235]" />
                <span>Establish a Literary Parlour</span>
              </h3>
              <p className="text-xs text-[#7A6A5E] mb-4">
                Found an intimate circle dedicated to an author, era, philosophical inquiry, or reading discipline.
              </p>

              <form onSubmit={handleCreateParlour} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-[#2F2620] mb-1">
                    Parlour Name
                  </label>
                  <input
                    type="text"
                    value={newParlourTitle}
                    onChange={(e) => setNewParlourTitle(e.target.value)}
                    placeholder="e.g. The Dostoevsky Circle"
                    className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs sm:text-sm text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-[#2F2620] mb-1">
                    Sanctuary Description & Vibe
                  </label>
                  <textarea
                    rows="3"
                    value={newParlourDesc}
                    onChange={(e) => setNewParlourDesc(e.target.value)}
                    placeholder="e.g. Delving into Russian existentialism, psychological torment, and the search for redemption..."
                    className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateParlourModal(false)}
                    className="px-4 py-2 text-xs text-[#7A6A5E] hover:text-[#2F2620]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-md cute-press cursor-pointer flex items-center gap-1.5"
                  >
                    <PiPlusBold className="text-xs" />
                    <span>Open Parlour to Kindred Minds</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            SHARE A REFLECTION COMPOSER (EXPANDABLE)
            ============================================================ */}
        {showCompose && (
          <div className="mb-6 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#7D2235]/30 shadow-lg text-left animate-drawer-spring">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2">
                <PiFeatherBold className="text-[#7D2235]" />
                <span>Inscribe a Reflection to the Common Room</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E]"
              >
                <PiXBold className="text-sm" />
              </button>
            </div>

            <form onSubmit={handlePublishReflection} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Quotation / passage (e.g. “To define is to limit...”)"
                  className="sm:col-span-2 w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs font-serif italic text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                />
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Author (e.g. Oscar Wilde)"
                  className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#76675B] mb-1">
                  Post to Literary Parlour:
                </label>
                <select
                  value={selectedComposeParlour}
                  onChange={(e) => setSelectedComposeParlour(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                >
                  {parlours.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows="3"
                value={newReflectionText}
                onChange={(e) => setNewReflectionText(e.target.value)}
                placeholder="What did this passage reveal? Share your thoughts with fellow readers..."
                className="w-full p-3 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                required
              />

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-1.5 text-xs text-[#7A6A5E] hover:text-[#2F2620]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center gap-1.5"
                >
                  <PiFeatherBold className="text-xs text-[#F7D8A4]" />
                  <span>Publish to Common Room</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB VIEW: READING ROOMS (LIVE AMBIENT TIMER & SOUND AMBIANCE)
            ============================================================ */}
        {activeTab === 'rooms' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5D7C2] gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2F2620] flex items-center gap-2">
                  <PiHeadphonesBold className="text-[#7D2235]" />
                  <span>The Grand Silent Reading Room</span>
                </h3>
                <p className="text-xs text-[#7A6A5E] mt-0.5">
                  Synchronous deep reading chamber. No talking; only pages turning and ambient solace.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playWaxSealCrack();
                    setReadingTimerRunning((prev) => !prev);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs cute-press cursor-pointer ${
                    readingTimerRunning
                      ? 'bg-amber-800 text-white'
                      : 'bg-[#7D2235] hover:bg-[#92283F] text-white'
                  }`}
                >
                  <PiClockBold className="text-sm" />
                  <span>{readingTimerRunning ? 'Pause Session' : 'Begin Reading Session'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              {/* Timer Display */}
              <div className="p-5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] text-center flex flex-col justify-center items-center">
                <span className="text-xs font-mono uppercase text-[#7A6A5E] tracking-wider">
                  Session Duration
                </span>
                <span className="font-mono text-3xl font-bold text-[#2F2620] my-2">
                  {Math.floor(readingSeconds / 60)}:
                  {String(readingSeconds % 60).padStart(2, '0')}
                </span>
                <span className="text-[11px] text-[#7A6A5E]">
                  {readingTimerRunning ? '🟢 Deep focus active' : 'Session paused'}
                </span>
              </div>

              {/* Reading Sprint Goal */}
              <div className="p-5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-[#2F2620]">
                    Session Page Goal
                  </span>
                  <span className="text-xs font-mono text-[#7D2235] font-bold">
                    {readingPagesRead} / {readingPagesGoal} pages
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#D8C7B0] overflow-hidden my-2">
                  <div
                    className="h-full bg-[#7D2235] rounded-full transition-all duration-300"
                    style={{ width: `${(readingPagesRead / readingPagesGoal) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      playPageFlipSound();
                      setReadingPagesRead((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-2.5 py-1 rounded bg-[#FAF5EB] border border-[#DECDB8] hover:bg-white text-[11px]"
                  >
                    - 1 Page
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPageFlipSound();
                      setReadingPagesRead((prev) => Math.min(readingPagesGoal + 10, prev + 1));
                    }}
                    className="px-2.5 py-1 rounded bg-[#7D2235] text-white hover:bg-[#92283F] text-[11px] font-semibold"
                  >
                    + 1 Page Turn 📖
                  </button>
                </div>
              </div>

              {/* Readers Present */}
              <div className="p-5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-[#2F2620]">
                    Readers in Sanctum
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    218 Online
                  </span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-xs">
                  <div className="flex items-center justify-between text-[#2F2620]">
                    <span>Eleanor Vance</span>
                    <span className="text-[10px] text-[#7A6A5E] italic">Dorian Gray (p. 84)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#2F2620]">
                    <span>Arthur Pendelton</span>
                    <span className="text-[10px] text-[#7A6A5E] italic">1984 (p. 162)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#2F2620]">
                    <span>Clara Oswald</span>
                    <span className="text-[10px] text-[#7A6A5E] italic">Frankenstein (p. 91)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB VIEW: MARGINALIA EXCHANGE
            ============================================================ */}
        {activeTab === 'marginalia' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-[#2F2620] mb-1 flex items-center gap-2">
              <PiNotePencilBold className="text-[#7D2235]" />
              <span>Marginalia & Scribe Exchange</span>
            </h3>
            <p className="text-xs text-[#7A6A5E] mb-5">
              Explore authentic handwritten annotations, ink notes, and marginal comments left by readers in classic editions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold">
                  The Picture of Dorian Gray &bull; Chapter IV
                </span>
                <p className="font-serif italic text-sm text-[#2F2620] mt-1">
                  “Youth! Youth! There is absolutely nothing in the world but youth!”
                </p>
                <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF5EB] border border-[#D8C7B0] text-xs text-[#52443A]">
                  <em>Note by Eleanor:</em> Notice how Lord Henry sells youth as a currency Dorian never knew he was spending until this exact moment.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F0E6D5] border border-[#DECDB8]">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold">
                  Crime and Punishment &bull; Part I, Ch. 2
                </span>
                <p className="font-serif italic text-sm text-[#2F2620] mt-1">
                  “Poverty is not a vice, that’s a true saying. But destitution, sir, destitution is a vice.”
                </p>
                <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF5EB] border border-[#D8C7B0] text-xs text-[#52443A]">
                  <em>Note by Arthur:</em> Marmeladov’s distinction between poverty and degradation. Here Dostoevsky lays the philosophical groundwork for Raskolnikov’s collapse.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB VIEW: READER MATCHES
            ============================================================ */}
        {activeTab === 'matches' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in">
            <h3 className="font-serif text-xl font-bold text-[#2F2620] mb-1 flex items-center gap-2">
              <PiSparkleBold className="text-[#7D2235]" />
              <span>Kindred Reader Affinity Matches</span>
            </h3>
            <p className="text-xs text-[#7A6A5E] mb-5">
              Calculated using your reading velocity, highlight themes, and favourite literary movements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  name: 'Eleanor Vance',
                  handle: 'eleanor_reads',
                  match: '96%',
                  shared: 'Victorian Gothic, Oscar Wilde, Mary Shelley',
                  avatar: '/images/eleanor-avatar.jpg',
                },
                {
                  name: 'Arthur Pendelton',
                  handle: 'arthur_scribe',
                  match: '91%',
                  shared: 'Dystopian Classics, George Orwell, Franz Kafka',
                  avatar: '/images/arthur-avatar.jpg',
                },
                {
                  name: 'Clara Oswald',
                  handle: 'clara_books',
                  match: '88%',
                  shared: 'Romantic Poetry, Keats, Lord Byron',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
                },
              ].map((m) => (
                <div key={m.handle} className="p-4 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-11 h-11 rounded-full object-cover border border-[#D8C7B0]" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#2F2620]">{m.name}</h4>
                      <span className="text-[11px] text-[#7A6A5E]">@{m.handle}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#7A6A5E]">Literary Affinity:</span>
                      <strong className="text-[#7D2235]">{m.match}</strong>
                    </div>
                    <p className="text-[11px] text-[#52443A]"><strong>Shared:</strong> {m.shared}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      enqueueSnackbar(`Exchange request dispatched to ${m.name}! ✉️`, { variant: 'success' });
                    }}
                    className="mt-3 w-full py-1.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cute-press cursor-pointer"
                  >
                    Initiate Marginalia Exchange
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            2. THREE-COLUMN SPECIFICATION LAYOUT
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
          
          {/* ============================================================
              LEFT COLUMN (3 COLS): CLIPBOARD "MY READER PASSPORT"
              ============================================================ */}
          <div className="lg:col-span-3">
            <div className="relative pt-4">
              
              {/* Metallic Clipboard Binder Clamp */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-16 h-7 bg-gradient-to-b from-[#56493F] to-[#2E2520] rounded-t-md shadow-md border border-[#2B231D] flex items-center justify-center">
                <div className="w-8 h-2 rounded-full bg-[#1C1714] border border-white/20 shadow-inner" />
              </div>

              {/* Textured Passport Card */}
              <div className="relative z-10 bg-[#FAF4EA] rounded-2xl border-2 border-[#D8C7B0] p-6 text-center shadow-[0_8px_30px_rgba(40,30,20,0.08)]">
                
                {/* Heading */}
                <h3 className="font-serif text-lg font-bold text-[#2F2620] mt-1 mb-4">
                  My Reader Passport
                </h3>

                {/* Circular Profile Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[#D9C4A6] shadow-inner bg-[#2C231E]">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                    alt={readerName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Reader Identity */}
                <h4 className="font-serif font-bold text-base text-[#2F2620] leading-tight">
                  {readerName}
                </h4>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#817265] block mt-0.5">
                  PT-48127
                </span>

                {/* Passport Badges */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                    <PiMoonFill className="text-[#7D2235] text-xs" />
                    <span>Night Owl Reader</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                    <PiPenNibBold className="text-[#7D2235] text-xs" />
                    <span>Marginalia Scribe</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                    <PiColumnsBold className="text-[#7D2235] text-xs" />
                    <span>Classics Initiate</span>
                  </span>
                </div>

                {/* Level Progress Station */}
                <div className="mt-5 pt-4 border-t border-[#E5D4BC] text-left text-xs font-sans">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#76675B]">Literary Level</span>
                    <span className="font-bold text-[#7D2235]">Lv. 4</span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#2F2620] mb-2">
                    The Attentive Reader
                  </div>

                  {/* XP Bar */}
                  <div className="w-full h-2 rounded-full bg-[#E5D7C2] overflow-hidden">
                    <div className="h-full bg-[#7D2235] rounded-full w-[78%] transition-all duration-500" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#76675B] mt-1.5">
                    <span>1,240 / 1,500 XP</span>
                    <span>Lv. 4</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ============================================================
              MIDDLE COLUMN (6 COLS): FROM THE COMMON ROOM (FEED)
              ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Header with Sorting & Filtering Dropdowns */}
            <div className="flex items-center justify-between pb-2 mb-1">
              <h2 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2 border-b-2 border-[#7D2235] pb-1">
                <span>From the Common Room</span>
                <PiFeatherBold className="text-sm text-[#7D2235]" />
              </h2>

              <div className="flex items-center gap-2 text-xs">
                {/* Recent Sort Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSortDropdownOpen((prev) => !prev);
                      setParlourDropdownOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-[#D8CCB8] bg-[#FAF5ED] text-[#483B32] font-medium flex items-center gap-1.5 cute-press cursor-pointer"
                  >
                    <span>{sortOption}</span>
                    <PiCaretDownBold className="text-[10px]" />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                      {['Recent', 'Top Reflections', 'Most Discussed'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortOption(opt);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620] ${
                            sortOption === opt ? 'font-bold text-[#7D2235]' : ''
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Parlours Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setParlourDropdownOpen((prev) => !prev);
                      setSortDropdownOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-[#D8CCB8] bg-[#FAF5ED] text-[#483B32] font-medium flex items-center gap-1.5 cute-press cursor-pointer"
                  >
                    <span>{filterParlour}</span>
                    <PiCaretDownBold className="text-[10px]" />
                  </button>
                  {parlourDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                      {['All Parlours', 'The Gothic Study', 'The Midnight Philosophers', 'Slow Readers Society'].map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setFilterParlour(opt);
                              setParlourDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620] ${
                              filterParlour === opt ? 'font-bold text-[#7D2235]' : ''
                            }`}
                          >
                            {opt}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Cards */}
            {sortedPosts.map((post) => (
              <article
                key={post.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm relative overflow-hidden text-left"
              >
                {/* Author Top Row */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-9 h-9 rounded-full object-cover border border-[#D8CCB8] shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-sm text-[#2F2620]">
                          {post.author}
                        </span>
                        <span className="text-[11px] font-sans text-[#7A6A5E]">
                          @{post.handle}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-[#7A6A5E] block">
                        {post.time} &bull; in{' '}
                        <strong className="text-[#7D2235] font-medium">
                          {post.parlour}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => enqueueSnackbar(`Options for @${post.handle}`, { variant: 'info' })}
                    className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E]"
                  >
                    <PiDotsThreeBold className="text-base" />
                  </button>
                </div>

                {/* Highlighted Quote Box with image thumbnail */}
                {post.quote && (
                  <div className="p-4 rounded-xl bg-[#F0E6D5] border border-[#D8C7B0] mb-3.5 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <blockquote className="font-serif italic text-xs sm:text-[13px] text-[#2F2620] leading-relaxed">
                        {post.quote}
                      </blockquote>
                      <span className="font-serif text-[11px] text-[#7A6A5E] mt-1 block">
                        — {post.quoteAuthor}
                      </span>
                    </div>

                    {post.quoteImg && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-[#D8C7B0] flex-shrink-0 shadow-2xs">
                        <img
                          src={post.quoteImg}
                          alt="Open book spread with dried flowers"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Main Reflection Text */}
                <p className="text-xs sm:text-[12.5px] text-[#2F2620] leading-relaxed mb-4 font-sans">
                  {post.content}
                </p>

                {/* Bottom Interactive Actions */}
                <div className="pt-3 border-t border-[#E5D7C2] flex items-center justify-between text-xs text-[#6E5F53]">
                  <div className="flex items-center gap-4">
                    {/* Heart Like */}
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                        post.liked ? 'text-[#7D2235] font-bold' : 'hover:text-[#7D2235]'
                      }`}
                    >
                      {post.liked ? (
                        <PiHeartFill className="text-sm text-[#7D2235] animate-jelly-pop" />
                      ) : (
                        <PiHeartBold className="text-sm" />
                      )}
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                        post.showComments ? 'text-[#7D2235] font-bold' : 'hover:text-[#2F2620]'
                      }`}
                    >
                      <PiChatCircleBold className="text-sm" />
                      <span>{post.commentsCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={() => handleBookmark(post.id)}
                      className="p-1 rounded hover:text-[#7D2235] transition-colors cute-press cursor-pointer"
                      title={post.bookmarked ? 'Saved to marginalia' : 'Save reflection'}
                    >
                      {post.bookmarked ? (
                        <PiBookmarkSimpleFill className="text-sm text-[#7D2235]" />
                      ) : (
                        <PiBookmarkSimpleBold className="text-sm" />
                      )}
                    </button>

                    {/* Share */}
                    <button
                      type="button"
                      onClick={() => {
                        playPaperUnwrap();
                        navigator.clipboard?.writeText(window.location.href);
                        enqueueSnackbar('Copied reflection link to clipboard 📜', { variant: 'info' });
                      }}
                      className="flex items-center gap-1 hover:text-[#2F2620] cute-press cursor-pointer text-xs"
                    >
                      <PiShareNetworkBold className="text-xs" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Comments Section */}
                {post.showComments && (
                  <div className="mt-4 pt-3 border-t border-[#E5D7C2] space-y-3 animate-fade-in">
                    <span className="text-[11px] font-serif font-bold text-[#7A6A5E] block">
                      Common Room Discussion ({post.commentsCount})
                    </span>

                    {/* Comment list */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {post.commentsList.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-[#F0E6D5] border border-[#DECDB8] text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif font-bold text-[#2F2620]">{c.author}</span>
                            <span className="text-[10px] text-[#7A6A5E]">{c.time}</span>
                          </div>
                          <p className="text-[#3E3228] leading-snug">{c.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add comment input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Inscribe a thought..."
                        className="flex-1 p-2 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#7D2235]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cute-press cursor-pointer"
                      >
                        <PiPaperPlaneRightBold className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}

              </article>
            ))}
          </div>

          {/* ============================================================
              RIGHT COLUMN (3 COLS): FEATURED LITERARY PARLOURS
              ============================================================ */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="flex items-center justify-between pb-2 mb-1">
              <h3 className="font-serif text-lg font-bold text-[#2F2620]">
                Featured Literary Parlours
              </h3>
              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setActiveTab('parlours');
                }}
                className="text-xs text-[#7D2235] font-semibold hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Parlour Cards */}
            {parlours.map((parlour) => (
              <div
                key={parlour.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm flex items-start gap-3.5 group hover:border-[#7D2235]/40 transition-all text-left"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D8C7B0] flex-shrink-0 shadow-2xs">
                  <img
                    src={parlour.img}
                    alt={parlour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#2F2620] leading-snug">
                    {parlour.title}
                  </h4>
                  <p className="text-[11px] text-[#7A6A5E] mt-0.5 line-clamp-2 leading-tight font-sans">
                    {parlour.desc}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E5D7C2]/60">
                    <span className="text-[10px] font-mono text-[#7A6A5E]">
                      {parlour.members} members
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleJoin(parlour.id)}
                      className={`px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cute-press cursor-pointer ${
                        parlour.joined
                          ? 'bg-[#EAE0CF] text-[#4A3D34] border border-[#D5C2A5]'
                          : 'bg-[#7D2235] hover:bg-[#92283F] text-white shadow-xs'
                      }`}
                    >
                      {parlour.joined ? '✓ Entered' : 'Enter →'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
