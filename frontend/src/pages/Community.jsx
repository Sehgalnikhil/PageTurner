import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  PiCheckBold,
  PiMoonFill,
  PiPenNibBold,
  PiColumnsBold,
  PiUsersBold,
  PiSparkleBold,
  PiCaretDownBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { useSnackbar } from 'notistack';

const Community = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'parlours' | 'rooms' | 'marginalia' | 'matches'
  const [sortOption, setSortOption] = useState('Recent');
  const [filterParlour, setFilterParlour] = useState('All Parlours');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [parlourDropdownOpen, setParlourDropdownOpen] = useState(false);

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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      time: '1h ago',
      parlour: 'Slow Readers Society',
      quote: '“Freedom is the freedom to say that two plus two make four.”',
      quoteAuthor: 'George Orwell',
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
          const willJoin = !p.joined;
          enqueueSnackbar(willJoin ? `Entered ${p.title} 🕯️` : `Departed ${p.title}`, {
            variant: willJoin ? 'success' : 'info',
          });
          return { ...p, joined: willJoin, members: willJoin ? p.members + 1 : p.members - 1 };
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

  const readerName = user?.username || 'Nikhil Sehgal';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#2F2620] selection:bg-[#92283F]/15 font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1260px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* ============================================================
            1. HERO ILLUMINATED LIBRARY BANNER
            ============================================================ */}
        <section
          className="relative w-full rounded-2xl overflow-hidden border border-[#DCD0BE] shadow-[0_12px_45px_rgba(40,30,22,0.22)] select-none mb-4"
          style={{
            backgroundImage: `url('/images/salon-hero-artwork.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            minHeight: '340px',
          }}
        >
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent pointer-events-none" />

          {/* Hero Content Left */}
          <div className="relative z-10 p-7 sm:p-10 md:p-12 max-w-xl text-[#F9F5EE] flex flex-col justify-center">
            <h1 className="font-serif italic text-3xl sm:text-4xl md:text-[46px] font-normal leading-tight text-[#FAF6EE] drop-shadow-md">
              The Readers’ Salon
            </h1>
            
            <p className="font-serif italic text-sm sm:text-base text-[#E5D7C5] mt-1.5 drop-shadow-sm">
              A private literary haven for kindred minds.
            </p>

            <p className="text-xs sm:text-[13px] text-[#D8C7B3] mt-2.5 leading-relaxed max-w-md font-sans opacity-90">
              Join intimate parlours, share reflections, exchange marginalia, and find readers who read the world like you do.
            </p>

            {/* Hero CTAs */}
            <div className="flex items-center gap-3.5 mt-6 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  enqueueSnackbar('Opening reflection prompt...', { variant: 'info' })
                }
                className="px-5 py-2.5 rounded-full bg-[#8E283F] hover:bg-[#741E32] text-[#FAF5EE] text-xs font-semibold tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(142,40,63,0.45)] cute-press cursor-pointer border border-[#C97B89]/40"
              >
                <PiFeatherBold className="text-sm" />
                <span>Share a Reflection</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  enqueueSnackbar('Parlour creation studio opens for curators...', {
                    variant: 'info',
                  })
                }
                className="px-5 py-2.5 rounded-full bg-[#1F1916]/75 hover:bg-[#1F1916]/90 text-[#F5ECE0] text-xs font-semibold tracking-wide flex items-center gap-1.5 backdrop-blur-xs border border-[#C6A16B]/50 cute-press cursor-pointer shadow-sm"
              >
                <PiPlusBold className="text-xs" />
                <span>Create a Parlour</span>
              </button>
            </div>
          </div>

          {/* Today in the Salon Quote Box (Top Right) */}
          <div className="hidden lg:block absolute top-7 right-8 z-10 select-none">
            <div className="relative w-[215px] p-5 rounded-lg bg-[#FAF4EB]/95 text-[#2F2620] shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-[#D9CDB8] rotate-[0.8deg] font-serif">
              {/* Wax Seal Decoration hanging on right edge */}
              <div className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-[#8E283F] text-amber-200 border-2 border-[#D9A9A6] flex items-center justify-center shadow-lg rotate-12">
                <span className="font-serif text-[10px] font-bold">PT</span>
              </div>

              <div className="text-[11px] font-sans font-semibold tracking-wide text-[#8D263B] flex items-center justify-between mb-2 pb-1 border-b border-[#E8DED1]">
                <span>Today in the Salon ♡</span>
              </div>

              <blockquote className="italic text-xs leading-relaxed text-[#2F2620]">
                “A book is a dream you hold in your hands.”
              </blockquote>

              <p className="text-[10px] text-[#7A6A5E] font-sans font-medium text-right mt-2">
                — Neil Gaiman
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. NAVIGATION RIBBON BAR (Pill tabs & live telemetry)
            ============================================================ */}
        <div className="w-full bg-[#EFE7D8] rounded-xl px-4 py-2 border border-[#D8CCB8] flex items-center justify-between shadow-2xs mb-6 flex-wrap gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                activeTab === 'parlours'
                  ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <span>Literary Parlours</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rooms')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <span>Reading Rooms</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('marginalia')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                activeTab === 'marginalia'
                  ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <span>Marginalia Exchange</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press cursor-pointer ${
                activeTab === 'matches'
                  ? 'bg-[#8E283F] text-white shadow-xs font-semibold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <span>Reader Matches</span>
            </button>
          </div>

          {/* Right Live Readers Telemetry */}
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
            <span className="text-[11.5px] font-medium text-[#483B32]">
              12,480 Readers
            </span>
            <span className="flex items-center gap-1 text-[11.5px] font-medium text-[#483B32]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>218 Reading Now</span>
            </span>
          </div>
        </div>

        {/* ============================================================
            3. THREE-COLUMN PIXEL-PERFECT CONTENT SECTION
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
            <div className="flex items-center justify-between pb-2 mb-2">
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
            
            <div className="flex items-center justify-between pb-2 mb-2">
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
