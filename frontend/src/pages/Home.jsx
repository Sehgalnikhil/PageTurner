import React, { useEffect, useState, useContext, useMemo } from 'react';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import BooksTable from '../components/home/BooksTable';
import BooksMasonry from '../components/home/BooksMasonry';
import BookSpineShelf from '../components/home/BookSpineShelf';
import CuratedCollectionTiles from '../components/home/CuratedCollectionTiles';
import BlindDateBanner from '../components/home/BlindDateBanner';
import BlindDateModal from '../components/home/BlindDateModal';
import { Link, useLocation } from 'react-router-dom';
import {
  PiMagnifyingGlassBold,
  PiListBulletsBold,
  PiSquaresFourBold,
  PiBooksBold,
  PiPlusBold,
  PiFunnelBold,
  PiSortAscendingBold,
  PiBookmarkSimpleFill,
  PiXBold,
  PiArrowRightBold,
  PiCompassBold,
  PiCheckBold,
  PiCaretDownBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { bookService } from '../services/api';

const EDITORIAL_ISSUES = [
  {
    issue: 'Issue No. 24',
    titlePrefix: 'Fall into',
    titleAccent: 'another world.',
    subtitle: 'Stories to cherish. Ideas to collect. Worlds to get lost in.',
    image: '/images/clean_hero_window.jpg',
    tagline: 'A curated universe of books, ideas & quieter days.',
  },
  {
    issue: 'Issue No. 23',
    titlePrefix: 'In the quiet of',
    titleAccent: 'the midnight hour.',
    subtitle: 'Gothic obsession, celestial wonders, and pages read past 2 AM.',
    image: '/images/hero_issue_23_midnight.jpg',
    tagline: 'Intellectual passion, mystery & candlelit soliloquies.',
  },
  {
    issue: 'Issue No. 22',
    titlePrefix: 'Ideas that shift',
    titleAccent: 'your perspective.',
    subtitle: 'Timeless philosophy, human experience, and mountain horizons.',
    image: '/images/hero_issue_22_philosophy.jpg',
    tagline: 'Clearer thinking, deep clarity & expansive views.',
  },
  {
    issue: 'Issue No. 21',
    titlePrefix: 'Quiet rituals &',
    titleAccent: 'the craftsman’s desk.',
    subtitle: 'Habits, deliberate focus, and timeless volumes bound in cloth.',
    image: '/images/hero_issue_21_craft.jpg',
    tagline: 'Refinement, tactile craft & intentional days.',
  },
];

const GENRE_OPTIONS = [
  'All Genres',
  'Fiction',
  'Non-Fiction',
  'Sci-Fi',
  'Biography',
  'Technology',
  'Uncategorized',
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'year-newest', label: 'Year (Newest)' },
  { value: 'year-oldest', label: 'Year (Oldest)' },
];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('masonry'); // 'masonry' | 'shelf' | 'table'
  const [mainTab, setMainTab] = useState('discover'); // 'discover' | 'shelf'
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [issueIndex, setIssueIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const location = useLocation();

  // Automatically advance hero editorial issue every 5 seconds (pauses on hover)
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setIssueIndex((prev) => (prev + 1) % EDITORIAL_ISSUES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  useEffect(() => {
    if (location.hash === '#curated-collections' || location.search.includes('curated-collections')) {
      setTimeout(() => {
        const el = document.getElementById('curated-collections');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [location]);
  const [showBlindDate, setShowBlindDate] = useState(false);

  const { user } = useContext(AuthContext);
  const { readingList, count: savedCount } = useContext(ReadingListContext);

  const limit = 20;

  const fetchBooks = () => {
    setLoading(true);
    const params = {
      page,
      limit,
      sortBy,
    };
    if (searchQuery) params.search = searchQuery;
    if (category && category !== 'All') params.category = category;

    bookService
      .getAll(params)
      .then((response) => {
        setBooks(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalBooks(response.data.count || 0);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, [page, category, sortBy]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      setSelectedMood(null);
      fetchBooks();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    setSelectedMood(null);
    fetchBooks();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSelectedMood(null);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleMoodSelect = (mood) => {
    if (selectedMood?.id === mood.id) {
      setSelectedMood(null);
      setCategory('All');
    } else {
      setSelectedMood(mood);
      setCategory(mood.fallbackCategory);
      setPage(1);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setSelectedMood(null);
    setMainTab('discover');
    setPage(1);
    fetchBooks();
  };

  // Filter books locally if mood has specific keywords or saved tab is active
  const displayedBooks = useMemo(() => {
    if (mainTab === 'shelf') {
      return readingList;
    }

    if (!selectedMood) {
      return books;
    }

    // Prioritize books matching mood keywords
    const keywords = selectedMood.keywords;
    const moodMatches = books.filter((b) => {
      const text = `${b.title} ${b.description || ''}`.toLowerCase();
      return keywords.some((kw) => text.includes(kw));
    });

    return moodMatches.length > 0 ? moodMatches : books;
  }, [books, selectedMood, mainTab, readingList]);

  const handleOpenBlindDate = () => {
    const el = document.getElementById('blind-date-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setShowBlindDate(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent transition-colors duration-300 relative overflow-x-hidden">
      <Navbar totalBooks={totalBooks} />

      <main className="flex-1 max-w-[1480px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Seamlessly Integrated Editorial Masthead Banner matching Mockup */}
        <header
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="mb-6 rounded-2xl sm:rounded-3xl border border-[#DFCBB5] overflow-hidden shadow-[0_12px_36px_rgba(40,25,15,0.08)] relative group bg-[#FAF5EE]"
        >
          {/* Right Window Scene with Sleeping Cat, Warm Lamp, Mug, Books, & Pinned Note */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[50%] md:w-[48%] lg:w-[46%] overflow-hidden pointer-events-none select-none">
            <img
              key={EDITORIAL_ISSUES[issueIndex].image}
              src={EDITORIAL_ISSUES[issueIndex].image}
              alt={EDITORIAL_ISSUES[issueIndex].titlePrefix}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/clean_hero_window.jpg';
              }}
              className="w-full h-full object-cover object-left-top opacity-95 group-hover:scale-102 transition-all duration-700 animate-fade-in"
            />
            {/* Soft feathered blend so the paper background transitions seamlessly into the window */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5EE] via-[#FAF5EE]/30 to-transparent pointer-events-none" />

            {/* Deckle-Edge Ragged Paper Transition Contour */}
            <svg
              className="absolute inset-y-0 left-0 h-full w-6 text-[#FAF5EE] fill-current pointer-events-none hidden sm:block"
              preserveAspectRatio="none"
              viewBox="0 0 20 100"
              aria-hidden="true"
            >
              <path d="M0 0 C 7 12, 3 24, 8 36 C 14 48, 4 60, 9 72 C 15 84, 6 92, 10 100 L 0 100 Z" />
            </svg>
          </div>

          {/* Left Content Column with Deckle-Edge Parchment feel */}
          <div className="relative z-10 p-8 sm:p-10 lg:p-12 max-w-xl xl:max-w-2xl min-h-[220px] sm:min-h-[240px] lg:min-h-[260px] flex flex-col justify-center">
            {/* Archival Tag */}
            <div className="flex items-center gap-2 mb-3 sm:mb-3.5">
              <span className="h-[1px] w-6 bg-[#C6A16B]" />
              <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-[#8D263B]">
                Digital Reading Journal &bull; {EDITORIAL_ISSUES[issueIndex].issue}
              </span>
            </div>

            {/* Serif Headline with Italic Crimson Accent */}
            <h1
              key={`title-${issueIndex}`}
              className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#2A1E17] tracking-tight leading-tight mb-2 animate-fade-in"
            >
              {EDITORIAL_ISSUES[issueIndex].titlePrefix}{' '}
              <span className="italic font-normal text-[#8D263B]">
                {EDITORIAL_ISSUES[issueIndex].titleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${issueIndex}`}
              className="text-xs sm:text-[13px] text-[#7A6C60] font-serif italic mt-0 mb-6 leading-relaxed max-w-lg animate-fade-in"
            >
              {EDITORIAL_ISSUES[issueIndex].subtitle}
            </p>

            {/* Start Exploring Button & Curated Universe Subtext */}
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('curated-collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7D1D2D] to-[#6B1829] hover:from-[#8D263B] hover:to-[#7B1D30] text-[#FFFDF9] font-serif text-xs sm:text-[13px] font-medium tracking-wide shadow-[0_4px_12px_rgba(125,29,45,0.3)] hover:shadow-[0_6px_16px_rgba(125,29,45,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Start Exploring</span>
                <PiArrowRightBold className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-1">
                <span className="h-5 w-[1px] bg-[#DFCBB5]" aria-hidden="true" />
                <span className="text-[9.5px] sm:text-[10.5px] font-mono text-[#7A6C60] uppercase tracking-wider max-w-[240px] leading-relaxed">
                  {EDITORIAL_ISSUES[issueIndex].tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Crimson Wax Seal pinned at the seam with tactile hover rotation */}
          <div className="hidden md:block absolute bottom-5 sm:bottom-7 left-[50%] lg:left-[52%] -translate-x-1/2 z-20 pointer-events-auto select-none group/seal cursor-pointer" title="PageTurner Editorial Ex-Libris Seal">
            <img
              src="/images/clean_wax_seal.png"
              alt="PageTurner Crimson Wax Seal"
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-[0_4px_12px_rgba(40,10,15,0.4)] transition-all duration-300 group-hover/seal:scale-110 group-hover/seal:rotate-6 group-hover/seal:drop-shadow-[0_8px_20px_rgba(141,38,59,0.5)]"
            />
          </div>
        </header>

        {/* Interactive Carousel Pagination Dots */}
        <div
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="flex items-center justify-center gap-2 mt-2 mb-8"
          aria-label="Select Editorial Issue"
        >
          {EDITORIAL_ISSUES.map((iss, idx) => (
            <button
              key={iss.issue}
              type="button"
              onClick={() => setIssueIndex(idx)}
              title={`Switch to ${iss.issue}: ${iss.titlePrefix} ${iss.titleAccent}`}
              className={`transition-all duration-500 ease-out cursor-pointer ${
                issueIndex === idx
                  ? 'w-7 h-2.5 rounded-full bg-[#3B2219] shadow-xs ring-2 ring-[#C6A16B]/30'
                  : 'w-2.5 h-2.5 rounded-full border border-[#8C7667] bg-transparent hover:bg-[#8C7667]/40'
              }`}
              aria-label={iss.issue}
            />
          ))}
        </div>

        {/* Curated Atmospheric Collections: Sophisticated, Image-Led Tiles matching reference screenshot */}
        <CuratedCollectionTiles
          selectedMood={selectedMood}
          onSelectMood={handleMoodSelect}
          onClearMood={() => setSelectedMood(null)}
          totalBooks={totalBooks}
        />

        {/* Blind Date with a Book Spotlight Invitation Banner */}
        <BlindDateBanner books={books} />

        {/* Streamlined Discovery Toolbar (Search, Filter, Tab toggles) */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DED1]">
            {/* View Tab Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMainTab('discover')}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-150 cute-pill-hover cursor-pointer ${mainTab === 'discover'
                  ? 'bg-[#302A27] text-[#FFFDFA] shadow-subtle'
                  : 'bg-[#FFFDFA] text-[#302A27] hover:text-[#8D263B] border border-[#E8DED1]'
                  }`}
              >
                All Stories
              </button>

              <button
                type="button"
                onClick={() => setMainTab('shelf')}
                className={`group px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-150 flex items-center gap-1.5 cute-pill-hover cursor-pointer ${mainTab === 'shelf'
                  ? 'bg-[#8D263B] text-[#FFFDFA] shadow-subtle'
                  : 'bg-[#FFFDFA] text-[#302A27] hover:text-[#8D263B] border border-[#E8DED1]'
                  }`}
              >
                <PiBookmarkSimpleFill
                  className={`${mainTab === 'shelf' ? 'text-[#C6A16B]' : 'text-[#8D263B]'
                    } text-xs`}
                />
                <span>My Shelf</span>
                {savedCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium ${mainTab === 'shelf'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#8D263B] text-white'
                      }`}
                  >
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter and Search controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Bar with focus elevation & icon accent */}
              <div className="relative flex-1 sm:w-60 group/search">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] group-focus-within/search:text-[#8D263B] text-xs pointer-events-none transition-colors" />
                <input
                  type="text"
                  placeholder="Search title, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-9 pr-8 h-8.5 rounded-full text-xs text-[#302A27] placeholder-[#81766D]/70 bg-[#FFFDFA] border border-[#DFCBB5] hover:border-[#C6A16B] focus:outline-none focus:border-[#8D263B] shadow-2xs transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#81766D] hover:text-[#302A27] transition-colors p-0.5 rounded-full cursor-pointer"
                  >
                    <PiXBold className="text-xs" />
                  </button>
                )}
              </div>

              {/* Custom Editorial Genre Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setGenreOpen((prev) => !prev);
                    setSortOpen(false);
                  }}
                  className={`h-8.5 px-3.5 rounded-full text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs border ${
                    genreOpen || (category && category !== 'All')
                      ? 'border-[#8D263B] bg-[#8D263B]/5 text-[#8D263B]'
                      : 'border-[#DFCBB5] bg-[#FFFDFA] hover:border-[#C6A16B] text-[#5C4F46] hover:text-[#2C1E18]'
                  }`}
                >
                  <PiFunnelBold className="text-xs" />
                  <span>{category === 'All' ? 'All Genres' : category}</span>
                  <PiCaretDownBold className={`text-[10px] transition-transform ${genreOpen ? 'rotate-180' : ''}`} />
                </button>

                {genreOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-[#FFFDF9] border border-[#DECDBA] shadow-card py-2 z-50 animate-modal-in"
                  >
                    <div className="px-3 py-1 text-[10px] font-mono text-[#8C7E72] uppercase tracking-wider font-semibold border-b border-[#EFE8DC] mb-1">
                      Literary Genres
                    </div>
                    {GENRE_OPTIONS.map((g) => {
                      const isSelected = category === g || (g === 'All Genres' && category === 'All');
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setCategory(g === 'All Genres' ? 'All' : g);
                            setSelectedMood(null);
                            setPage(1);
                            setGenreOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-sans flex items-center justify-between hover:bg-[#FAF4EA] transition-colors cursor-pointer ${
                            isSelected ? 'font-semibold text-[#8D263B]' : 'text-[#3D322A]'
                          }`}
                        >
                          <span>{g}</span>
                          {isSelected && <PiCheckBold className="text-xs text-[#8D263B]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Custom Editorial Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSortOpen((prev) => !prev);
                    setGenreOpen(false);
                  }}
                  className={`h-8.5 px-3.5 rounded-full text-xs font-sans font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs border ${
                    sortOpen || sortBy !== 'createdAt'
                      ? 'border-[#8D263B] bg-[#8D263B]/5 text-[#8D263B]'
                      : 'border-[#DFCBB5] bg-[#FFFDFA] hover:border-[#C6A16B] text-[#5C4F46] hover:text-[#2C1E18]'
                  }`}
                >
                  <PiSortAscendingBold className="text-xs" />
                  <span>
                    {SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Sort'}
                  </span>
                  <PiCaretDownBold className={`text-[10px] transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-[#FFFDF9] border border-[#DECDBA] shadow-card py-2 z-50 animate-modal-in"
                  >
                    <div className="px-3 py-1 text-[10px] font-mono text-[#8C7E72] uppercase tracking-wider font-semibold border-b border-[#EFE8DC] mb-1">
                      Order Stories By
                    </div>
                    {SORT_OPTIONS.map((s) => {
                      const isSelected = sortBy === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => {
                            setSortBy(s.value);
                            setPage(1);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-sans flex items-center justify-between hover:bg-[#FAF4EA] transition-colors cursor-pointer ${
                            isSelected ? 'font-semibold text-[#8D263B]' : 'text-[#3D322A]'
                          }`}
                        >
                          <span>{s.label}</span>
                          {isSelected && <PiCheckBold className="text-xs text-[#8D263B]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Unified Rounded-Full Layout Switcher */}
              <div className="inline-flex rounded-full bg-[#FFFDFA] p-0.5 border border-[#DFCBB5] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowType('masonry')}
                  title="Gallery"
                  className={`flex items-center gap-1.5 h-7.5 px-3 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    showType === 'masonry'
                      ? 'bg-[#292522] text-[#FFFDF9] shadow-2xs'
                      : 'text-[#81766D] hover:text-[#292522]'
                  }`}
                >
                  <PiSquaresFourBold className="text-sm" />
                  <span className="hidden md:inline">Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowType('shelf')}
                  title="Oak Hardwood Bookshelf"
                  className={`flex items-center gap-1.5 h-7.5 px-3 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    showType === 'shelf'
                      ? 'bg-[#292522] text-[#FFFDF9] shadow-2xs'
                      : 'text-[#81766D] hover:text-[#292522]'
                  }`}
                >
                  <PiBooksBold className="text-sm text-[#C6A16B]" />
                  <span className="hidden md:inline">Oak Shelf</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowType('table')}
                  title="Bibliographic Table View"
                  className={`flex items-center gap-1.5 h-7.5 px-3 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    showType === 'table'
                      ? 'bg-[#292522] text-[#FFFDF9] shadow-2xs'
                      : 'text-[#81766D] hover:text-[#292522]'
                  }`}
                >
                  <PiListBulletsBold className="text-sm" />
                  <span className="hidden md:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter State Notice */}
          {(selectedMood || (category && category !== 'All') || searchQuery || mainTab === 'shelf') && (
            <div className="mt-3 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F6F1E8] border border-stone-200 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-stone-600 text-[11px]">Filtered view:</span>

                {mainTab === 'shelf' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-burgundy text-white text-[10px] font-semibold">
                    <span>Personal Saved Shelf</span>
                  </span>
                )}

                {selectedMood && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-stone-800 border border-stone-300 text-[10px] font-semibold">
                    <span>Atmosphere: {selectedMood.title}</span>
                  </span>
                )}

                {category && category !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-stone-800 border border-stone-300 text-[10px] font-semibold">
                    <span>Genre: {category}</span>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-stone-800 border border-stone-300 text-[10px] font-semibold">
                    <span>&ldquo;{searchQuery}&rdquo;</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-burgundy hover:underline flex-shrink-0"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Pinterest-Inspired Organic Gallery */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[0.875rem] border border-[#E8DED1] bg-[#FFFDFA] p-3 space-y-3 shadow-subtle animate-pulse"
              >
                <div
                  className={`w-full bg-[#EAE2D5] rounded-lg ${
                    i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-52' : 'h-72'
                  }`}
                />
                <div className="space-y-2 pt-1">
                  <div className="h-4 bg-[#EAE2D5] rounded w-4/5" />
                  <div className="h-3 bg-[#EFE8DD] rounded w-3/5" />
                  <div className="h-3 bg-[#EFE8DD] rounded w-2/5 pt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedBooks.length > 0 ? (
          <div>
            {showType === 'table' ? (
              <BooksTable books={displayedBooks} />
            ) : showType === 'shelf' ? (
              <BookSpineShelf books={displayedBooks} />
            ) : (
              <BooksMasonry
                books={displayedBooks}
                isCollectionActive={Boolean(selectedMood || (category && category !== 'All') || searchQuery || mainTab === 'shelf')}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && mainTab === 'discover' && (
              <div className="mt-10 flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full btn-paper disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &larr; Previous
                </button>
                <span className="text-xs font-mono font-medium text-stone-600 px-3 py-1 rounded-full bg-white border border-stone-200">
                  Page <strong className="text-burgundy font-bold">{page}</strong> of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full btn-paper disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 px-6 text-center editorial-sheet max-w-md mx-auto my-6">
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 text-stone-500 flex items-center justify-center mx-auto mb-3">
              <PiBooksBold className="text-2xl text-burgundy" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              No matching stories found
            </h3>
            <p className="text-xs text-stone-600 mb-5 max-w-xs mx-auto leading-relaxed">
              We couldn&apos;t find any books matching your active filters. Try adjusting your search query or selecting another atmosphere.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-full btn-burgundy text-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Blind Date with a Book Interactive Modal */}
        <BlindDateModal
          isOpen={showBlindDate}
          onClose={() => setShowBlindDate(false)}
          books={books}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
