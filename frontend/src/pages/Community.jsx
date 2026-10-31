import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiUsersBold,
  PiBookOpenBold,
  PiSparkleBold,
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiPaperPlaneTiltBold,
  PiQuotesBold,
  PiPlusBold,
  PiCompassBold,
  PiCrownBold,
  PiCheckBold,
  PiClockBold,
  PiFeatherBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { useSnackbar } from 'notistack';

// Curated Literary Parlours (Micro-Clubs)
const INITIAL_PARLOURS = [
  {
    id: 'parlour-midnight',
    title: 'The Midnight Philosophers',
    atmosphere: 'Late-night classics, existential reflections & quiet tea',
    theme: 'Philosophy & Gothic',
    membersCount: 342,
    activeNow: 28,
    currentRead: {
      title: 'The Picture of Dorian Gray',
      author: 'Oscar Wilde',
      cover: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
      chapter: 'Discussing Chapter 4: The Art of Temptation',
    },
    accent: '#8D263B',
    joined: false,
  },
  {
    id: 'parlour-gothic',
    title: 'The Gothic Study',
    atmosphere: 'Candlelight, Victorian mystery & brooding atmospheres',
    theme: 'Dark Academia & Gothic',
    membersCount: 512,
    activeNow: 41,
    currentRead: {
      title: '1984',
      author: 'George Orwell',
      cover: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      chapter: 'Discussing Part Two: The Memory Hole',
    },
    accent: '#3E2A1B',
    joined: true,
  },
  {
    id: 'parlour-slow',
    title: 'Slow Readers Society',
    atmosphere: 'One chapter a week. Close reading, sentence appreciation & margins',
    theme: 'Literary Fiction & Memoirs',
    membersCount: 820,
    activeNow: 64,
    currentRead: {
      title: 'Educated',
      author: 'Tara Westover',
      cover: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
      chapter: 'Discussing Chapter 8: Buck’s Peak Shadows',
    },
    accent: '#5B1E28',
    joined: false,
  },
  {
    id: 'parlour-morning',
    title: 'Dawn & Espresso Guild',
    atmosphere: 'Fresh coffee, morning poetry, and early creative clarity',
    theme: 'Essays & Naturalist Prose',
    membersCount: 219,
    activeNow: 15,
    currentRead: {
      title: 'The Daily Stoic',
      author: 'Ryan Holiday',
      cover: 'https://covers.openlibrary.org/b/isbn/9780735211735-L.jpg',
      chapter: 'Daily Meditation: The Art of Acquiescence',
    },
    accent: '#735A47',
    joined: false,
  },
];

// Initial Community Reflection Dispatches
const INITIAL_REFLECTIONS = [
  {
    id: 'ref-1',
    author: 'Eleanor Vance',
    handle: 'eleanor_reads',
    avatar: 'E',
    time: '22m ago',
    parlour: 'The Gothic Study',
    bookTitle: 'The Picture of Dorian Gray',
    bookAuthor: 'Oscar Wilde',
    quote: '“Behind every exquisite thing that existed, there was something tragic.”',
    reflection:
      'Wilde captures this ache so perfectly. How often do we trade authentic contentment for the aesthetic illusion of it? Rereading this in the parlor tonight has completely transformed my perspective on Lord Henry’s cynicism.',
    likes: 47,
    commentsCount: 12,
    liked: false,
    comments: [
      { id: 'c-1', user: 'Julian Morrow', text: 'Lord Henry is dazzling, but Basil is the moral heartbeat of the novel.' },
      { id: 'c-2', user: 'Clara Oswald', text: 'Especially the line about youth being the only thing worth having!' },
    ],
  },
  {
    id: 'ref-2',
    author: 'Arthur Pendelton',
    handle: 'arthur_scribe',
    avatar: 'A',
    time: '1h ago',
    parlour: 'Slow Readers Society',
    bookTitle: 'Educated',
    bookAuthor: 'Tara Westover',
    quote: '“You can love someone and still choose to say goodbye to them.”',
    reflection:
      'Reading Chapter 8 this morning with a pot of Darjeeling. What struck me most is Tara’s restraint—she never writes with vengeance, only with the patient curiosity of someone recovering their own mind.',
    likes: 89,
    commentsCount: 18,
    liked: true,
    comments: [
      { id: 'c-3', user: 'TaraFan_99', text: 'Her voice has such quiet dignity.' },
    ],
  },
  {
    id: 'ref-3',
    author: 'Sophia Chen',
    handle: 'sophia_margins',
    avatar: 'S',
    time: '3h ago',
    parlour: 'The Midnight Philosophers',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    quote: '“Freedom is the freedom to say that two plus two make four.”',
    reflection:
      'The horror of 1984 isn’t just physical torture; it’s the systematic erasure of memory. When a society loses its relationship with the written word, truth becomes whatever power declares it to be.',
    likes: 124,
    commentsCount: 29,
    liked: false,
    comments: [],
  },
];

const Community = () => {
  const { user } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'kindred'
  const [parlours, setParlours] = useState(INITIAL_PARLOURS);
  const [reflections, setReflections] = useState(INITIAL_REFLECTIONS);
  
  // New reflection input state
  const [newQuote, setNewQuote] = useState('');
  const [newText, setNewText] = useState('');
  const [selectedBook, setSelectedBook] = useState('The Picture of Dorian Gray');
  const [selectedParlour, setSelectedParlour] = useState('The Gothic Study');
  const [showCompose, setShowCompose] = useState(false);

  // Toggle Parlour Membership
  const handleToggleParlour = (parlourId) => {
    setParlours((prev) =>
      prev.map((p) => {
        if (p.id === parlourId) {
          const willJoin = !p.joined;
          enqueueSnackbar(
            willJoin
              ? `You have entered ${p.title} 🕯️`
              : `You have departed ${p.title}`,
            { variant: willJoin ? 'success' : 'info' }
          );
          return {
            ...p,
            joined: willJoin,
            membersCount: willJoin ? p.membersCount + 1 : p.membersCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Toggle Like on Reflection
  const handleToggleLike = (refId) => {
    setReflections((prev) =>
      prev.map((r) => {
        if (r.id === refId) {
          const isLiked = !r.liked;
          return {
            ...r,
            liked: isLiked,
            likes: isLiked ? r.likes + 1 : r.likes - 1,
          };
        }
        return r;
      })
    );
  };

  // Submit Reflection
  const handlePostReflection = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const authorName = user?.username || 'Curious Reader';
    const newEntry = {
      id: `ref-${Date.now()}`,
      author: authorName,
      handle: authorName.toLowerCase().replace(/\s+/g, '_'),
      avatar: authorName.charAt(0).toUpperCase(),
      time: 'Just now',
      parlour: selectedParlour,
      bookTitle: selectedBook,
      bookAuthor: 'Literary Canon',
      quote: newQuote.trim() ? `“${newQuote.trim()}”` : null,
      reflection: newText.trim(),
      likes: 1,
      commentsCount: 0,
      liked: true,
      comments: [],
    };

    setReflections([newEntry, ...reflections]);
    setNewQuote('');
    setNewText('');
    setShowCompose(false);
    enqueueSnackbar('Your literary reflection has been shared to the Salon ✒️', {
      variant: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#302722] selection:bg-[#92283F]/15">
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* ============================================================
            1. SALON MASTHEAD: The Sanctuary Common Room
            ============================================================ */}
        <header className="mb-10 rounded-3xl bg-gradient-to-r from-[#201A18] via-[#332526] to-[#201A18] text-[#F7F2E9] p-7 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl border border-[#C6A16B]/30">
          {/* Subtle warm amber candle glow behind heading */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-[#C6A16B]" />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C6A16B] font-bold">
                The Literary Salon &bull; Issue No. 1
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FFFCF7] leading-tight">
              A community of kindred minds.
            </h1>

            <p className="font-serif italic text-sm sm:text-base text-[#D9CFC4] mt-3 leading-relaxed">
              Step into intimate book parlours, exchange handwritten marginalia, and share the passages that altered the way you see the world.
            </p>

            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <button
                type="button"
                onClick={() => setShowCompose((prev) => !prev)}
                className="px-5 py-2.5 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-xs sm:text-[13px] font-semibold flex items-center gap-2 shadow-md cute-press cursor-pointer"
              >
                <PiFeatherBold className="text-sm" />
                <span>Share a Reflection</span>
              </button>

              <div className="flex items-center gap-3 text-xs font-mono text-[#D9CFC4]/80 pl-2 border-l border-white/20">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>148 Readers Reading Now</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================
            2. NAVIGATION TABS (Salon Feed | Parlours | Kindred Readers)
            ============================================================ */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E8DED1] flex-wrap gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'feed', label: 'Salon Dispatches', icon: PiChatCircleBold },
              { id: 'parlours', label: 'Literary Parlours', icon: PiBookOpenBold },
              { id: 'kindred', label: 'Kindred Readers', icon: PiUsersBold },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium flex items-center gap-2 transition-all cute-pill-hover cursor-pointer ${
                    isActive
                      ? 'bg-[#92283F] text-white shadow-xs'
                      : 'bg-[#FFFCF7] text-[#302722] hover:text-[#92283F] border border-[#E8DED1]'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono text-[#84766B]">
            Showing <strong>{reflections.length}</strong> dispatches across <strong>{parlours.length}</strong> active circles
          </span>
        </div>

        {/* ============================================================
            3. COMPOSE REFLECTION MODAL / EXPANDED DRAWER
            ============================================================ */}
        {showCompose && (
          <div className="mb-8 p-6 sm:p-7 rounded-2xl bg-[#FFFCF7] border border-[#C6A16B]/40 shadow-xl animate-drawer-spring relative">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#302722] mb-3 flex items-center gap-2">
              <PiFeatherBold className="text-[#92283F]" />
              <span>Inscribe a New Literary Reflection</span>
            </h3>

            <form onSubmit={handlePostReflection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#302722] mb-1">
                    Select Literary Parlour
                  </label>
                  <select
                    value={selectedParlour}
                    onChange={(e) => setSelectedParlour(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] focus:outline-none focus:border-[#92283F]"
                  >
                    {parlours.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302722] mb-1">
                    Book Reference
                  </label>
                  <input
                    type="text"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    placeholder="e.g. The Picture of Dorian Gray"
                    className="w-full p-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] focus:outline-none focus:border-[#92283F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#302722] mb-1">
                  Quotation or Passage (Optional)
                </label>
                <input
                  type="text"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="e.g. “To define is to limit...”"
                  className="w-full p-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] font-serif italic focus:outline-none focus:border-[#92283F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#302722] mb-1">
                  Your Reflection or Marginalia Note
                </label>
                <textarea
                  rows="3"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Share what this chapter revealed, how it made you feel, or an idea it sparked..."
                  className="w-full p-3 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#302722] focus:outline-none focus:border-[#92283F]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-xs text-[#84766B] hover:text-[#302722] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center gap-1.5"
                >
                  <PiPaperPlaneTiltBold />
                  <span>Publish to Salon</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            4. TAB 1: SALON DISPATCHES FEED
            ============================================================ */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Dispatches List */}
            <div className="lg:col-span-8 space-y-6">
              {reflections.map((ref) => (
                <article
                  key={ref.id}
                  className="p-6 sm:p-7 rounded-2xl bg-[#FFFCF7] border border-[#E9DED0] shadow-subtle cute-card-tilt relative overflow-hidden"
                >
                  {/* Top Bar: Author, Avatar, Time & Parlour Tag */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF5ED] text-[#92283F] font-serif font-bold text-sm flex items-center justify-center border border-[#E9DED0] shadow-2xs">
                        {ref.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#302722]">
                            {ref.author}
                          </h4>
                          <span className="text-[11px] font-mono text-[#84766B]">
                            @{ref.handle}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#84766B] block">
                          {ref.time} &bull; in <strong className="text-[#92283F] font-medium">{ref.parlour}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-[#FAF5ED] border border-[#E9DED0] text-[10px] font-mono text-[#84766B]">
                      {ref.bookTitle}
                    </div>
                  </div>

                  {/* Highlighted Quote Box if present */}
                  {ref.quote && (
                    <div className="p-4 rounded-xl bg-[#FAF5ED] border-l-4 border-[#92283F] text-[#302722] mb-3.5">
                      <PiQuotesBold className="text-lg text-[#92283F]/40 mb-1" />
                      <p className="font-serif italic text-xs sm:text-[13.5px] leading-relaxed">
                        {ref.quote}
                      </p>
                      <span className="text-[10px] font-mono text-[#84766B] mt-1.5 block">
                        — {ref.bookAuthor}
                      </span>
                    </div>
                  )}

                  {/* Main Reflection Prose */}
                  <p className="text-xs sm:text-[13px] text-[#302722] leading-relaxed font-sans mb-4">
                    {ref.reflection}
                  </p>

                  {/* Action Bar (Like, Comments, Shelf) */}
                  <div className="pt-3 border-t border-[#E9DED0]/70 flex items-center justify-between text-xs text-[#84766B]">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike(ref.id)}
                        className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                          ref.liked ? 'text-[#92283F] font-semibold' : 'hover:text-[#92283F]'
                        }`}
                      >
                        {ref.liked ? (
                          <PiHeartFill className="text-sm text-[#92283F] animate-jelly-pop" />
                        ) : (
                          <PiHeartBold className="text-sm" />
                        )}
                        <span>{ref.likes}</span>
                      </button>

                      {/* Comments count */}
                      <div className="flex items-center gap-1.5 hover:text-[#302722] cursor-pointer">
                        <PiChatCircleBold className="text-sm" />
                        <span>{ref.commentsCount} reflections</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        enqueueSnackbar(`Added "${ref.bookTitle}" to your reading wish list 📚`, {
                          variant: 'success',
                        })
                      }
                      className="inline-flex items-center gap-1 hover:text-[#92283F] transition-colors cute-press cursor-pointer text-[11px]"
                    >
                      <PiBookmarkSimpleBold />
                      <span>Bookmark Volume</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Right 4 Columns: Active Parlours Mini-Widget & Ambient Room */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Active Parlours Spotlight */}
              <div className="p-6 rounded-2xl bg-[#FFFCF7] border border-[#E9DED0] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-bold text-[#302722]">
                    Featured Parlours
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('parlours')}
                    className="text-[11px] font-semibold text-[#92283F] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {parlours.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] hover:border-[#92283F]/30 transition-all flex flex-col justify-between gap-2"
                    >
                      <div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#302722]">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-[#84766B] mt-0.5 line-clamp-2">
                          {p.atmosphere}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#E9DED0]/50 text-[10px] font-mono text-[#84766B]">
                        <span>{p.membersCount} members</span>
                        <button
                          type="button"
                          onClick={() => handleToggleParlour(p.id)}
                          className={`px-2.5 py-0.5 rounded-full font-semibold transition-all cute-press cursor-pointer ${
                            p.joined
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-[#92283F] text-white'
                          }`}
                        >
                          {p.joined ? 'Entered ✓' : '+ Enter'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Silent Reading Room Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#2B231F] to-[#1E1815] text-[#F7F2E9] border border-[#C6A16B]/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-[#C6A16B]">
                  <PiClockBold className="text-sm animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                    Virtual Reading Room
                  </span>
                </div>
                <h4 className="font-serif text-lg font-normal text-[#FFFCF7]">
                  The Midnight Library Study
                </h4>
                <p className="text-xs text-[#D9CFC4] mt-1 mb-4 leading-relaxed font-serif italic">
                  Sit silently with 48 kindred readers. Soft fireplace &amp; rain ambiance streaming.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    enqueueSnackbar('Entering Virtual Study Room with soft hearth ambiance... 🕯️', {
                      variant: 'success',
                    })
                  }
                  className="w-full py-2 rounded-full bg-[#C6A16B] hover:bg-[#B58E55] text-[#1E1815] font-semibold text-xs transition-all cute-press cursor-pointer text-center"
                >
                  Join Quiet Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            5. TAB 2: LITERARY PARLOURS GRID
            ============================================================ */}
        {activeTab === 'parlours' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {parlours.map((p) => (
              <div
                key={p.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#FFFCF7] border border-[#E9DED0] shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-[#92283F]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5ED] text-[#92283F] font-mono text-[10px] font-semibold border border-[#E9DED0]">
                      {p.theme}
                    </span>
                    <span className="text-xs font-mono text-[#84766B]">
                      {p.membersCount} readers &bull; {p.activeNow} active
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#302A27] tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#84766B] mt-1.5 leading-relaxed">
                    {p.atmosphere}
                  </p>

                  {/* Current Reading Spotlight */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#FAF5ED] border border-[#E9DED0] flex items-center gap-3.5">
                    <img
                      src={p.currentRead.cover}
                      alt={p.currentRead.title}
                      className="w-11 aspect-[2/3] object-cover rounded shadow-2xs border border-[#E9DED0]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#92283F] font-bold block">
                        Currently Reading
                      </span>
                      <h5 className="font-serif font-bold text-xs sm:text-sm text-[#302A27] truncate">
                        {p.currentRead.title}
                      </h5>
                      <p className="text-[11px] text-[#84766B] italic truncate">
                        {p.currentRead.chapter}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9DED0]/70 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#84766B]">
                    New chapter discussion opens Friday
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleParlour(p.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cute-press cursor-pointer flex items-center gap-1.5 ${
                      p.joined
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-[#92283F] hover:bg-[#702338] text-white shadow-xs'
                    }`}
                  >
                    {p.joined ? (
                      <>
                        <PiCheckBold />
                        <span>Member of Parlour</span>
                      </>
                    ) : (
                      <>
                        <PiPlusBold />
                        <span>Join Parlour</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            6. TAB 3: KINDRED READERS SOULMATES
            ============================================================ */}
        {activeTab === 'kindred' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-[#FFFCF7] border border-[#E9DED0]">
              <h3 className="font-serif text-lg font-bold text-[#302A27]">
                Literary Soulmates &bull; Kindred Readers
              </h3>
              <p className="text-xs text-[#84766B] mt-0.5">
                Matched based on shared library shelves, reading velocities, and marginalia notes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Julian Morrow',
                  handle: 'ancient_greek_scribe',
                  match: '96% Literary Match',
                  shared: ['The Picture of Dorian Gray', 'The Odyssey', 'Meditations'],
                  status: 'Currently reading Book 4 of The Odyssey',
                  avatar: 'J',
                },
                {
                  name: 'Clara Oswald',
                  handle: 'clara_library',
                  match: '92% Literary Match',
                  shared: ['1984', 'Educated', 'Fahrenheit 451'],
                  status: 'Reviewing Tara Westover’s memoir',
                  avatar: 'C',
                },
                {
                  name: 'Sebastian Croft',
                  handle: 'victorian_ink',
                  match: '88% Literary Match',
                  shared: ['Crime and Punishment', 'Dune', 'The Great Gatsby'],
                  status: 'Annotating Chapter 5 of Dostoevsky',
                  avatar: 'S',
                },
              ].map((reader, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#FFFCF7] border border-[#E9DED0] shadow-sm flex flex-col justify-between gap-4 cute-card-tilt"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#FAF5ED] text-[#92283F] font-serif font-bold text-base flex items-center justify-center border border-[#E9DED0]">
                        {reader.avatar}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#92283F]/10 text-[#92283F] font-mono text-[10px] font-bold">
                        {reader.match}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#302A27]">
                      {reader.name}
                    </h4>
                    <span className="text-xs font-mono text-[#84766B] block">
                      @{reader.handle}
                    </span>

                    <p className="text-xs text-[#302A27] italic mt-2.5 font-serif">
                      &ldquo;{reader.status}&rdquo;
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-[#E9DED0]/60">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#84766B] block mb-1.5 font-bold">
                        Mutual Shelf Treasures:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {reader.shared.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#FAF5ED] text-[#302A27] text-[10.5px] border border-[#E9DED0]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      enqueueSnackbar(`Connected with kindred reader ${reader.name}! ✉️`, {
                        variant: 'success',
                      })
                    }
                    className="w-full py-2 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-xs font-semibold transition-all cute-press cursor-pointer text-center"
                  >
                    Send Literary Note
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;
