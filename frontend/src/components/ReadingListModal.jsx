import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiXBold,
  PiBookmarkSimpleFill,
  PiTrashBold,
  PiDotsThreeVerticalBold,
  PiStarFill,
  PiStampBold,
  PiBookOpenBold,
  PiBookOpenTextBold,
  PiMagnifyingGlassBold,
  PiSlidersHorizontalBold,
  PiCaretDownBold,
  PiCheckBold,
  PiWarningBold,
  PiSquaresFourBold,
  PiBooksBold,
} from 'react-icons/pi';
import { ReadingListContext } from '../context/ReadingListContext';
import BookplateModal from './home/BookplateModal';
import BookSpineShelf from './home/BookSpineShelf';

const getStatusBadgeStyle = (status = 'want-to-read') => {
  switch (status) {
    case 'currently-reading':
      return 'bg-[#F4E8E6] text-[#861D2D] border-[#861D2D]/20';
    case 'finished':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'want-to-read':
    default:
      return 'bg-[#FAF7F2] text-[#827870] border-[#E8DED2]';
  }
};

const getStatusLabel = (status = 'want-to-read') => {
  switch (status) {
    case 'currently-reading':
      return 'Reading Now';
    case 'finished':
      return 'Finished';
    case 'want-to-read':
    default:
      return 'Want to Read';
  }
};

const getBookQuote = (book) => {
  if (book.notes && book.notes.trim().length > 0) return book.notes.trim();
  if (book.description && book.description.trim().length > 0) {
    const trimmed = book.description.trim();
    return trimmed.length > 95 ? `${trimmed.slice(0, 92)}...` : trimmed;
  }
  const t = book.title?.toLowerCase() || '';
  if (t.includes('educated')) {
    return 'A breathtaking memoir about family, freedom, and the power of education.';
  }
  if (t.includes('thinking, fast')) {
    return "A masterclass in how we think, and why we so often don't think clearly.";
  }
  if (t.includes('dune')) {
    return 'A sprawling epic of destiny, power, and ecological reverence.';
  }
  if (t.includes('1984')) {
    return 'A hauntingly prophetic vision of truth, surveillance, and memory.';
  }
  if (t.includes('meditations')) {
    return 'Timeless Stoic reflections on endurance, humility, and human reason.';
  }
  if (t.includes('great gatsby')) {
    return 'A lyrical portrait of gilded ambition, longing, and American dreams.';
  }
  return 'A thoughtful volume chosen for quiet contemplation and lifelong discovery.';
};

const ReadingListModal = () => {
  const {
    readingList,
    count,
    isDrawerOpen,
    setIsDrawerOpen,
    removeFromList,
    updateBookStatus,
    clearList,
  } = useContext(ReadingListContext);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'title' | 'author' | 'rating'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'spines'

  const navigate = useNavigate();

  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showClearConfirm) {
          setShowClearConfirm(false);
        } else if (showSortMenu || showFilterMenu) {
          setShowSortMenu(false);
          setShowFilterMenu(false);
        } else {
          setIsDrawerOpen(false);
        }
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, showClearConfirm, showSortMenu, showFilterMenu, setIsDrawerOpen]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
      setShowSortMenu(false);
      setShowFilterMenu(false);
    };
    if (activeMenuId || showSortMenu || showFilterMenu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuId, showSortMenu, showFilterMenu]);

  if (!isDrawerOpen) return null;

  // Accurate status-specific counts
  const countAll = readingList.length;
  const countWant = readingList.filter(
    (b) => (b.readingStatus || 'want-to-read') === 'want-to-read'
  ).length;
  const countReading = readingList.filter(
    (b) => b.readingStatus === 'currently-reading'
  ).length;
  const countFinished = readingList.filter(
    (b) => b.readingStatus === 'finished'
  ).length;

  // Unique categories for filter
  const availableCategories = [
    'all',
    ...Array.from(new Set(readingList.map((b) => b.category).filter(Boolean))),
  ];

  // Filtered & sorted book list
  const processedList = readingList.filter((item) => {
    // 1. Reading status filter
    if (activeFilter !== 'all') {
      const status = item.readingStatus || 'want-to-read';
      if (status !== activeFilter) return false;
    }
    // 2. Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchAuthor = item.author?.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchCategory && !matchNotes) return false;
    }
    return true;
  });

  // Sorting
  const sortedList = [...processedList].sort((a, b) => {
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'author') {
      return (a.author || '').localeCompare(b.author || '');
    }
    if (sortBy === 'rating') {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    // 'recent' by default (savedAt or original list order)
    if (a.savedAt && b.savedAt) {
      return new Date(b.savedAt) - new Date(a.savedAt);
    }
    return 0;
  });

  const handleBookNavigate = (bookId) => {
    setIsDrawerOpen(false);
    navigate(`/books/details/${bookId}`);
  };

  const handleConfirmClear = () => {
    clearList();
    setShowClearConfirm(false);
  };

  const getSortLabel = (key) => {
    switch (key) {
      case 'title':
        return 'Title (A–Z)';
      case 'author':
        return 'Author';
      case 'rating':
        return 'Highest Rated';
      case 'recent':
      default:
        return 'Recently Added';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shelf-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          if (showClearConfirm) setShowClearConfirm(false);
          else setIsDrawerOpen(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-[520px] bg-[#FAF7F2] border-l border-[#E8DED2] shadow-2xl flex flex-col relative overflow-hidden text-[#292522] animate-drawer-in">
          
          {/* 1. EDITORIAL HEADER WITH MOODBOARD COLLAGE */}
          <header className="px-6 pt-7 pb-4 bg-[#FAF7F2] relative overflow-hidden border-b border-[#E8DED2]/80">
            {/* Aesthetic moodboard background collage fading into ivory */}
            <div className="absolute top-0 right-0 w-64 h-48 pointer-events-none select-none overflow-hidden z-0">
              <img
                src="/images/hero-moodboard.jpg"
                alt=""
                className="w-full h-full object-cover object-top opacity-70 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FAF7F2]/60 to-[#FAF7F2]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent" />
            </div>

            {/* Discreet Circular Close Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close shelf drawer"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-[#E8DED2] shadow-2xs flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-10"
            >
              <PiXBold className="text-sm" />
            </button>

            {/* Header Content */}
            <div className="relative z-10 pr-10">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#861D2D] font-bold block mb-1.5">
                YOUR PRIVATE LIBRARY
              </span>
              <h2
                id="shelf-drawer-title"
                className="font-serif text-[34px] sm:text-[38px] font-bold text-[#292522] tracking-tight leading-none"
              >
                My Reading Shelf.
              </h2>
              <p className="font-serif italic text-sm text-[#827870] mt-1.5">
                Books you&apos;ve chosen to keep close.
              </p>
            </div>

            {/* 2. REFINED READING STATUS NAVIGATION */}
            <nav className="mt-5 grid grid-cols-4 gap-2 text-xs" aria-label="Reading shelf status filters">
              {[
                { id: 'all', label: 'All Saved', count: countAll },
                { id: 'want-to-read', label: 'Want to Read', count: countWant },
                { id: 'currently-reading', label: 'Reading', count: countReading },
                { id: 'finished', label: 'Finished', count: countFinished },
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`h-9 px-2.5 rounded-lg transition-all duration-180 flex items-center justify-between text-xs font-medium border ${
                      isActive
                        ? 'bg-[#861D2D] text-white border-[#861D2D] shadow-2xs'
                        : 'bg-[#FFFDF9] hover:bg-white text-[#292522] border-[#E8DED2]'
                    }`}
                  >
                    <span className="truncate text-[11px] font-semibold">{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ml-1 flex-shrink-0 ${
                        isActive
                          ? 'bg-white text-[#861D2D]'
                          : 'bg-[#FAF7F2] text-[#827870]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* 3. REFINED CONTROL ROW: SEARCH, FILTER, SORT */}
            <div className="mt-3.5 flex items-center gap-2">
              {/* Search Field */}
              <div className="relative flex-1">
                <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your shelf..."
                  className="w-full h-10 pl-9 pr-7 text-xs bg-white border border-[#E8DED2] rounded-lg text-[#292522] placeholder-[#827870]/70 focus:outline-none focus:border-[#861D2D] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label="Clear search"
                  >
                    <PiXBold className="text-xs" />
                  </button>
                )}
              </div>

              {/* Genre Filter Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFilterMenu((prev) => !prev);
                    setShowSortMenu(false);
                  }}
                  title="Filter by genre or view mode"
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                    selectedCategory !== 'all' || viewMode === 'spines'
                      ? 'bg-[#F4E8E6] text-[#861D2D] border-[#861D2D]/40'
                      : 'bg-white text-stone-600 border-[#E8DED2] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <PiSlidersHorizontalBold className="text-base" />
                </button>

                {/* Filter Popover Menu */}
                {showFilterMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-[#E8DED2] py-2 z-30 text-xs text-[#292522] animate-in fade-in zoom-in-95"
                  >
                    <div className="px-3 py-1 text-[10px] font-mono text-[#827870] uppercase tracking-wider border-b border-[#FAF7F2]">
                      Display Mode
                    </div>
                    <div className="p-1.5 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setViewMode('cards')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          viewMode === 'cards'
                            ? 'bg-[#861D2D] text-white'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                        }`}
                      >
                        <PiSquaresFourBold className="text-xs" />
                        <span>Journal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('spines')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          viewMode === 'spines'
                            ? 'bg-[#861D2D] text-white'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                        }`}
                      >
                        <PiBooksBold className="text-xs" />
                        <span>Spines</span>
                      </button>
                    </div>

                    <div className="px-3 pt-2 pb-1 text-[10px] font-mono text-[#827870] uppercase tracking-wider border-t border-[#FAF7F2]">
                      Filter by Genre
                    </div>
                    <div className="max-h-40 overflow-y-auto py-1">
                      {availableCategories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowFilterMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between text-xs"
                        >
                          <span className="capitalize">{cat === 'all' ? 'All Genres' : cat}</span>
                          {selectedCategory === cat && (
                            <PiCheckBold className="text-[#861D2D] text-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSortMenu((prev) => !prev);
                    setShowFilterMenu(false);
                  }}
                  className="h-10 px-3 bg-white border border-[#E8DED2] rounded-lg text-xs font-medium text-[#292522] flex items-center gap-1.5 hover:bg-[#FAF7F2] transition-colors whitespace-nowrap"
                >
                  <span>{getSortLabel(sortBy)}</span>
                  <PiCaretDownBold className="text-stone-400 text-xs" />
                </button>

                {/* Sort Popover Menu */}
                {showSortMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-[#E8DED2] py-1.5 z-30 text-xs text-[#292522] animate-in fade-in zoom-in-95"
                  >
                    {[
                      { key: 'recent', label: 'Recently Added' },
                      { key: 'title', label: 'Title (A–Z)' },
                      { key: 'author', label: 'Author' },
                      { key: 'rating', label: 'Highest Rated' },
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSortBy(option.key);
                          setShowSortMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between"
                      >
                        <span>{option.label}</span>
                        {sortBy === option.key && (
                          <PiCheckBold className="text-[#861D2D] text-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* 4. SCROLLABLE SHELF CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 relative z-10">
            {viewMode === 'spines' ? (
              <BookSpineShelf books={sortedList} onSelectBook={handleBookNavigate} />
            ) : (
              <>
                {sortedList.length === 0 ? (
                  /* Refined Literary Empty State */
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F4E8E6] border border-[#861D2D]/20 text-[#861D2D] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      <PiBookOpenTextBold className="text-2xl" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#292522]">
                      A little room for your next favorite.
                    </h3>
                    <p className="text-xs text-[#827870] mt-1.5 max-w-xs mx-auto leading-relaxed">
                      {readingList.length === 0
                        ? 'Click the bookmark ribbon on any book in the literary discovery catalog to curate your private reading sanctuary.'
                        : 'No saved volumes matched your current status or filter criteria.'}
                    </p>
                    {readingList.length === 0 && (
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="mt-4 px-5 py-2 rounded-lg bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                      >
                        Explore Discovery Catalog
                      </button>
                    )}
                  </div>
                ) : (
                  sortedList.map((book) => {
                    const imageUrl = book.image
                      ? book.image.startsWith('http')
                        ? book.image
                        : `http://localhost:5555${book.image}`
                      : null;

                    const isMenuOpen = activeMenuId === book._id;
                    const progressValue =
                      book.progress ||
                      (book.readingStatus === 'currently-reading' ? 68 : null);

                    return (
                      <article
                        key={book._id}
                        className="rounded-xl border border-[#E8DED2] bg-[#FFFDF9] p-4 transition-all hover:border-[#861D2D]/35 hover:shadow-2xs relative group/card"
                      >
                        <div className="flex items-start gap-4">
                          {/* Book Cover Thumbnail */}
                          <div
                            onClick={() => handleBookNavigate(book._id)}
                            className="w-20 sm:w-24 aspect-[2/3] rounded-md overflow-hidden flex-shrink-0 bg-[#FAF7F2] border border-[#E8DED2] shadow-2xs cursor-pointer group"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full p-2 flex flex-col justify-between text-center bg-[#292522] text-[#FAF7F2]">
                                <span className="text-[7px] font-mono text-amber-200/60 uppercase truncate">
                                  {book.category}
                                </span>
                                <p className="font-serif text-[10px] font-bold leading-tight line-clamp-2">
                                  {book.title}
                                </p>
                                <span className="text-[8px] text-stone-400 italic truncate">
                                  {book.author}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Book Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              {/* Title + Bookmark + 3-Dots Menu */}
                              <div className="flex items-start justify-between gap-2">
                                <h3
                                  onClick={() => handleBookNavigate(book._id)}
                                  className="font-serif text-[16px] sm:text-[17px] font-bold text-[#292522] leading-snug cursor-pointer hover:text-[#861D2D] transition-colors line-clamp-1"
                                >
                                  {book.title}
                                </h3>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromList(book._id);
                                    }}
                                    title="Saved to shelf — click to remove"
                                    aria-label={`Remove ${book.title} from reading shelf`}
                                    className="p-1 text-[#861D2D] hover:opacity-75 transition-opacity"
                                  >
                                    <PiBookmarkSimpleFill className="text-base" />
                                  </button>

                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(isMenuOpen ? null : book._id);
                                      }}
                                      aria-label="Reading options"
                                      className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                                    >
                                      <PiDotsThreeVerticalBold className="text-base" />
                                    </button>

                                    {/* Context Popover Menu */}
                                    {isMenuOpen && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#E8DED2] py-1.5 z-30 text-xs text-[#292522] animate-in fade-in zoom-in-95"
                                      >
                                        <div className="px-3 py-1 text-[10px] font-mono text-[#827870] uppercase tracking-wider border-b border-[#FAF7F2]">
                                          Reading Stage
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            updateBookStatus(book._id, 'want-to-read');
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between"
                                        >
                                          <span>Want to Read</span>
                                          {(book.readingStatus || 'want-to-read') === 'want-to-read' && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#861D2D]" />
                                          )}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            updateBookStatus(book._id, 'currently-reading');
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between"
                                        >
                                          <span>Reading Now</span>
                                          {book.readingStatus === 'currently-reading' && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#861D2D]" />
                                          )}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            updateBookStatus(book._id, 'finished');
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] flex items-center justify-between"
                                        >
                                          <span>Finished</span>
                                          {book.readingStatus === 'finished' && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#861D2D]" />
                                          )}
                                        </button>
                                        <div className="my-1 border-t border-[#FAF7F2]" />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleBookNavigate(book._id);
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F2] text-[#292522]"
                                        >
                                          View Details
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            removeFromList(book._id);
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600"
                                        >
                                          Remove from Shelf
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Author */}
                              <p className="font-serif italic text-xs text-[#827870] mt-0.5">
                                by {book.author}
                              </p>

                              {/* Year & Category */}
                              <p className="text-[11px] font-sans text-[#827870] mt-0.5">
                                {book.publishYear ? `${book.publishYear}  ·  ` : ''}
                                {book.category || 'Literature'}
                              </p>

                              {/* Status Badge + Rating Row */}
                              <div className="flex items-center justify-between gap-2 mt-2">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(
                                    book.readingStatus
                                  )}`}
                                >
                                  {getStatusLabel(book.readingStatus)}
                                </span>

                                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#292522]">
                                  <PiStarFill className="text-[#E58929] text-xs" />
                                  <span>{(book.averageRating || 4.8).toFixed(1)} / 5</span>
                                </div>
                              </div>

                              {/* Short Editorial Quote / Notes */}
                              <p className="font-serif italic text-xs text-[#827870] mt-2 line-clamp-2 leading-relaxed">
                                &ldquo;{getBookQuote(book)}&rdquo;
                              </p>

                              {/* Reading Progress Bar (if reading) */}
                              {progressValue !== null && (
                                <div className="mt-2.5 flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-[#E8DED2] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#861D2D] rounded-full"
                                      style={{ width: `${progressValue}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-mono font-medium text-[#827870]">
                                    {progressValue}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}

                {/* 5. INSPIRATIONAL STAMP QUOTE BANNER */}
                {sortedList.length > 0 && (
                  <div className="pt-4 pb-2 text-center mt-2">
                    <div className="w-7 h-7 rounded-full bg-[#F4E8E6] text-[#861D2D] flex items-center justify-center mx-auto mb-1.5">
                      <PiBookOpenBold className="text-xs" />
                    </div>
                    <p className="font-serif italic text-xs text-[#292522]">
                      &ldquo;A small shelf now, a lifelong collection ahead.&rdquo;
                    </p>
                    <span className="text-[9px] font-mono text-[#827870] uppercase tracking-[0.2em] block mt-0.5">
                      PAGETURNER SANCTUARY
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 6. ANCHORED REFINED FOOTER */}
          <footer className="px-6 py-4 border-t border-[#E8DED2] bg-[#FFFDF9] relative z-20">
            {showClearConfirm ? (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs animate-in fade-in">
                <div className="flex items-start gap-2.5 mb-2.5">
                  <PiWarningBold className="text-red-600 text-base flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-serif font-bold text-stone-900 leading-tight">
                      Clear all {count} saved books from your shelf?
                    </h5>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                      This removes saved bookmarks from your device shelf. The library&apos;s master catalog records will remain untouched.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 rounded-md border border-[#E8DED2] bg-white text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="px-3.5 py-1 rounded-md bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    Yes, Clear Shelf
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                {readingList.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs text-[#827870] hover:text-red-700 transition-colors flex items-center gap-1.5 group"
                  >
                    <PiTrashBold className="text-xs text-stone-400 group-hover:text-red-700 transition-colors" />
                    <span>Clear Entire Shelf...</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-[#827870]">
                    Shelf synchronized
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookplate(true)}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E8DED2] text-xs font-semibold text-[#292522] shadow-2xs hover:bg-[#FAF7F2] transition-colors"
                  >
                    <PiStampBold className="text-sm text-[#861D2D] group-hover:scale-105 transition-transform" />
                    <span>Print My Bookplate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-2 rounded-lg bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-2xs active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </footer>
        </div>
      </div>

      {/* Vintage Ex Libris Bookplate Generator Modal */}
      <BookplateModal
        isOpen={showBookplate}
        onClose={() => setShowBookplate(false)}
      />
    </div>
  );
};

export default ReadingListModal;
