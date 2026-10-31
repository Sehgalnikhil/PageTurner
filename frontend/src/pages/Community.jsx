import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiFeatherBold,
  PiPlusBold,
  PiHeartBold,
  PiHeartFill,
  PiChatCircleBold,
  PiBookmarkSimpleBold,
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
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Community = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'rooms' | 'marginalia' | 'matches'
  const [sortOption, setSortOption] = useState('Recent');
  const [filterParlour, setFilterParlour] = useState('All Parlours');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [parlourDropdownOpen, setParlourDropdownOpen] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // New Reflection input state
  const [newReflectionText, setNewReflectionText] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('');

  // Parlours State
  const [parlours, setParlours] = useState([
    {
      id: 'midnight',
      title: 'The Midnight Philosophers',
      desc: 'Late-night classics, existential reflections & quiet tea.',
      members: 342,
      joined: false,
      img: '/images/parlour-midnight.jpg',
    },
    {
      id: 'gothic',
      title: 'The Gothic Study',
      desc: 'Candlelight, Victorian mystery & brooding atmospheres.',
      members: 512,
      joined: true,
      img: '/images/parlour-gothic.jpg',
    },
    {
      id: 'slow',
      title: 'Slow Readers Society',
      desc: 'One chapter a week. Close reading & deep conversations.',
      members: 820,
      joined: false,
      img: '/images/parlour-slow.jpg',
    },
  ]);

  // Feed Posts State
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
      comments: 12,
      liked: false,
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
      comments: 18,
      liked: true,
    },
  ]);

  const handleToggleJoin = (id) => {
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

  const handlePublishReflection = (e) => {
    e.preventDefault();
    if (!newReflectionText.trim()) return;

    const authorName = user?.username || 'Nikhil Sehgal';
    const newPost = {
      id: `post-${Date.now()}`,
      author: authorName,
      handle: authorName.toLowerCase().replace(/\s+/g, '_'),
      avatar: '/images/eleanor-avatar.jpg',
      time: 'Just now',
      parlour: 'The Gothic Study',
      quote: newQuoteText.trim() ? `“${newQuoteText.trim()}”` : null,
      quoteAuthor: newQuoteAuthor.trim() || 'Author',
      quoteImg: '/images/dorian-open-book-spread.jpg',
      content: newReflectionText.trim(),
      likes: 1,
      comments: 0,
      liked: true,
    };

    setPosts([newPost, ...posts]);
    setNewReflectionText('');
    setNewQuoteText('');
    setNewQuoteAuthor('');
    setShowCompose(false);
    enqueueSnackbar('Reflection shared to the Salon Common Room ✒️', { variant: 'success' });
  };

  const readerName = user?.username || 'Nikhil Sehgal';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#2F2620] selection:bg-[#92283F]/15 font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* ============================================================
            1. HERO & RIBBON SECTION MATCHING REFERENCE SPECIFICATION
            ============================================================ */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-[#DCD0BE] shadow-[0_12px_45px_rgba(40,30,22,0.22)] select-none mb-6">
          {/* Main Visual Header */}
          <div className="relative w-full">
            <img
              src="/images/salon-hero-illustration.jpg"
              alt="The Readers' Salon"
              className="w-full h-auto block max-h-[360px] object-cover object-top"
            />

            {/* Clickable Overlay Hitboxes for the Two Buttons on the Artwork */}
            <div className="absolute left-[3%] sm:left-[5%] bottom-[12%] flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCompose((prev) => !prev)}
                aria-label="Share a Reflection"
                className="h-9 px-4 sm:px-5 rounded-full bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                title="Share a Reflection"
              />
              <button
                type="button"
                onClick={() =>
                  enqueueSnackbar('Parlour creation studio opens for curators...', { variant: 'info' })
                }
                aria-label="Create a Parlour"
                className="h-9 px-4 sm:px-5 rounded-full bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                title="Create a Parlour"
              />
            </div>
          </div>

          {/* Warm Archival Navigation Ribbon Bar Directly Integrated */}
          <div className="w-full bg-[#EFE7D8] border-t border-[#DCD0BE] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs flex-wrap gap-2">
            {/* 5 Distinct Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'feed'
                    ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620]'
                }`}
              >
                <span>Salon Feed</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('parlours')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'parlours'
                    ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620]'
                }`}
              >
                <span>Literary Parlours</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('rooms');
                  enqueueSnackbar('Opening Silent Reading Room with fireplace ambiance... 🕯️', {
                    variant: 'info',
                  });
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620]'
                }`}
              >
                <span>Reading Rooms</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('marginalia');
                  enqueueSnackbar('Browsing community margin notes...', { variant: 'info' });
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'marginalia'
                    ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620]'
                }`}
              >
                <span>Marginalia Exchange</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('matches');
                  enqueueSnackbar('Matching kindred readers by literary velocity...', {
                    variant: 'info',
                  });
                }}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                  activeTab === 'matches'
                    ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                    : 'text-[#645548] hover:text-[#2F2620]'
                }`}
              >
                <span>Reader Matches</span>
              </button>
            </div>

            {/* Right Telemetry */}
            <div className="flex items-center gap-3 text-xs text-[#645548] font-sans">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block w-5 h-5 rounded-full bg-[#8E283F] text-white text-[9px] font-bold text-center leading-5 ring-1 ring-white">
                  E
                </span>
                <span className="inline-block w-5 h-5 rounded-full bg-[#C6A16B] text-[#1E1815] text-[9px] font-bold text-center leading-5 ring-1 ring-white">
                  A
                </span>
                <span className="inline-block w-5 h-5 rounded-full bg-[#735A47] text-white text-[9px] font-bold text-center leading-5 ring-1 ring-white">
                  S
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#483B32]">
                12,480 Readers
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#483B32]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>218 Reading Now</span>
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================
            NEW REFLECTION COMPOSE CARD (EXPANDABLE)
            ============================================================ */}
        {showCompose && (
          <div className="mb-6 p-6 rounded-2xl bg-[#FAF5EB] border-2 border-[#8E283F]/30 shadow-lg animate-drawer-spring text-left">
            <h3 className="font-serif text-lg font-bold text-[#2F2620] mb-3 flex items-center gap-2">
              <PiFeatherBold className="text-[#8E283F]" />
              <span>Inscribe Reflection to the Common Room</span>
            </h3>

            <form onSubmit={handlePublishReflection} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Quotation or passage (e.g. “To define is to limit...”)"
                  className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs font-serif italic text-[#2F2620] focus:outline-none focus:border-[#8E283F]"
                />
                <input
                  type="text"
                  value={newQuoteAuthor}
                  onChange={(e) => setNewQuoteAuthor(e.target.value)}
                  placeholder="Author (e.g. Oscar Wilde)"
                  className="w-full p-2.5 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs text-[#2F2620] focus:outline-none focus:border-[#8E283F]"
                />
              </div>

              <textarea
                rows="3"
                value={newReflectionText}
                onChange={(e) => setNewReflectionText(e.target.value)}
                placeholder="What did this passage reveal? Share your thoughts with fellow readers..."
                className="w-full p-3 rounded-xl border border-[#D9CDB8] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#2F2620] focus:outline-none focus:border-[#8E283F]"
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
                  className="px-5 py-2 rounded-full bg-[#8E283F] hover:bg-[#741E32] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer"
                >
                  Publish to Common Room
                </button>
              </div>
            </form>
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
              {/* Metallic Clipboard Clamp */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-16 h-7 bg-gradient-to-b from-[#7A6A5E] to-[#4A3D34] rounded-t-md shadow-md border border-[#3C312A] flex items-center justify-center">
                <div className="w-8 h-2 rounded-full bg-[#2B231D]/80 border border-white/20" />
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
                    <PiMoonFill className="text-[#8E283F] text-xs" />
                    <span>Night Owl Reader</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                    <PiPenNibBold className="text-[#8E283F] text-xs" />
                    <span>Marginalia Scribe</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#2F2620] text-[10px] font-sans font-medium border border-[#D5C2A5]">
                    <PiColumnsBold className="text-[#8E283F] text-xs" />
                    <span>Classics Initiate</span>
                  </span>
                </div>

                {/* Level Progress Station */}
                <div className="mt-5 pt-4 border-t border-[#E5D4BC] text-left text-xs font-sans">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#76675B]">Literary Level</span>
                    <span className="font-bold text-[#8E283F]">Lv. 4</span>
                  </div>
                  <div className="text-xs font-serif font-bold text-[#2F2620] mb-2">
                    The Attentive Reader
                  </div>

                  {/* XP Bar */}
                  <div className="w-full h-2 rounded-full bg-[#E5D7C2] overflow-hidden">
                    <div className="h-full bg-[#8E283F] rounded-full w-[78%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#76675B] mt-1.5">
                    <span>1,240 / 1,500 XP</span>
                    <span>78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              MIDDLE COLUMN (6 COLS): FROM THE COMMON ROOM (FEED)
              ============================================================ */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Header with Filters */}
            <div className="flex items-center justify-between pb-2 mb-1">
              <h2 className="font-serif text-lg font-bold text-[#2F2620] flex items-center gap-2 border-b-2 border-[#8E283F] pb-1">
                <span>From the Common Room</span>
                <PiFeatherBold className="text-sm text-[#8E283F]" />
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
                    <div className="absolute right-0 top-full mt-1 w-32 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                      {['Recent', 'Top Reflections', 'Most Discussed'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortOption(opt);
                            setSortDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Parlours Dropdown */}
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
                    <div className="absolute right-0 top-full mt-1 w-44 bg-[#FAF5ED] rounded-xl shadow-lg border border-[#D8CCB8] py-1 z-30 text-xs">
                      {['All Parlours', 'The Gothic Study', 'The Midnight Philosophers', 'Slow Readers Society'].map(
                        (opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setFilterParlour(opt);
                              setParlourDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#EFE7D8] text-[#2F2620]"
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
            {posts.map((post) => (
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
                        <strong className="text-[#8E283F] font-medium">
                          {post.parlour}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
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
                          alt="Open book"
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
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cute-press cursor-pointer ${
                        post.liked ? 'text-[#8E283F] font-bold' : 'hover:text-[#8E283F]'
                      }`}
                    >
                      {post.liked ? (
                        <PiHeartFill className="text-sm text-[#8E283F] animate-jelly-pop" />
                      ) : (
                        <PiHeartBold className="text-sm" />
                      )}
                      <span>{post.likes}</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 hover:text-[#2F2620] cursor-pointer"
                    >
                      <PiChatCircleBold className="text-sm" />
                      <span>{post.comments}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        enqueueSnackbar('Saved reflection to your marginalia archive 📖', {
                          variant: 'success',
                        })
                      }
                      className="p-1 rounded hover:text-[#8E283F] transition-colors cute-press cursor-pointer"
                      title="Bookmark"
                    >
                      <PiBookmarkSimpleBold className="text-sm" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        enqueueSnackbar('Copied dispatch link to clipboard', {
                          variant: 'info',
                        })
                      }
                      className="flex items-center gap-1 hover:text-[#2F2620] cute-press cursor-pointer text-xs"
                    >
                      <PiShareNetworkBold className="text-xs" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
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
                onClick={() => setActiveTab('parlours')}
                className="text-xs text-[#8E283F] font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            {/* Parlour Cards */}
            {parlours.map((parlour) => (
              <div
                key={parlour.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF5EB] border border-[#D9CDB8] shadow-sm flex items-start gap-3.5 group hover:border-[#8E283F]/40 transition-all text-left"
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
                          : 'bg-[#8E283F] hover:bg-[#741E32] text-white shadow-xs'
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
