import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiXBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiTrashBold,
  PiArrowRightBold,
  PiBookmarksBold,
  PiClockBold,
  PiBookOpenTextBold,
  PiSealCheckBold,
  PiDotsThreeVerticalBold,
  PiSparkleBold,
  PiWarningBold,
  PiBookOpenBold,
  PiStarFill,
  PiStampBold,
  PiPrinterBold,
  PiBooksBold,
  PiSquaresFourBold,
} from 'react-icons/pi';
import { ReadingListContext } from '../context/ReadingListContext';
import BookplateModal from './home/BookplateModal';
import BookSpineShelf from './home/BookSpineShelf';

const getStatusBadgeStyle = (status = 'want-to-read') => {
  switch (status) {
    case 'currently-reading':
      return 'bg-amber-100/90 text-amber-900 border-amber-300';
    case 'finished':
      return 'bg-emerald-100/90 text-emerald-900 border-emerald-300';
    case 'want-to-read':
    default:
      return 'bg-[#FAF0F2] text-[#7B1826] border-[#7B1826]/25';
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
        } else {
          setIsDrawerOpen(false);
        }
      }
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, showClearConfirm, setIsDrawerOpen]);

  // Close contextual menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

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

  // Filtered books
  const filteredList = readingList.filter((item) => {
    if (activeFilter === 'all') return true;
    return (item.readingStatus || 'want-to-read') === activeFilter;
  });

  const handleBookNavigate = (bookId) => {
    setIsDrawerOpen(false);
    navigate(`/books/details/${bookId}`);
  };

  const handleConfirmClear = () => {
    clearList();
    setShowClearConfirm(false);
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
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          if (showClearConfirm) setShowClearConfirm(false);
          else setIsDrawerOpen(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-lg sm:max-w-xl bg-[#FAF7F2] border-l border-[#E2D8C7] shadow-2xl flex flex-col relative overflow-hidden text-[#1C1917] animate-drawer-in">
          {/* Subtle warm paper texture background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-rose-100/25 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-100/25 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          {/* 1. POLISHED COMPACT HEADER */}
          <header className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#E8E0D1] bg-[#FFFDF9] relative z-10">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Private Library label + Title & Count */}
              <div className="min-w-0">
                <span className="text-[10px] font-mono tracking-widest text-[#7B1826] font-bold uppercase block">
                  YOUR PRIVATE LIBRARY
                </span>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h2
                    id="shelf-drawer-title"
                    className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-none truncate"
                  >
                    My Reading Shelf
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#FAF0F2] border border-[#7B1826]/20 text-[#7B1826] text-[11px] font-mono font-bold whitespace-nowrap">
                    {count} {count === 1 ? 'Volume' : 'Volumes'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-serif italic mt-1">
                  Books you&apos;ve chosen to keep close.
                </p>
              </div>

              {/* Right: View Mode Toggle + Custom Ex Libris Bookplate Button + Refined Close Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* View Mode Toggle: Cards vs Spines */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    title="Grid Cards View"
                    className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-burgundy shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <PiSquaresFourBold className="text-sm" />
                    <span className="hidden sm:inline text-[11px]">Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('spines')}
                    title="3D Hardwood Bookshelf Spines"
                    className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                      viewMode === 'spines'
                        ? 'bg-white text-burgundy shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <PiBooksBold className="text-sm" />
                    <span className="hidden sm:inline text-[11px]">Spine Shelf</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBookplate(true)}
                  title="Design & Print Custom Ex Libris Bookplate"
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0F2] hover:bg-[#F3DEE2] text-[#7B1826] border border-[#7B1826]/20 text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95"
                >
                  <PiStampBold className="text-sm text-[#7B1826] group-hover:rotate-12 transition-transform duration-200" />
                  <span className="hidden sm:inline">Ex Libris</span>
                  <span className="sm:hidden">Bookplate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close reading shelf drawer"
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors border border-stone-200/80"
                >
                  <PiXBold className="text-sm" />
                </button>
              </div>
            </div>

            {/* 2. HIGH-CONTRAST STATUS NAVIGATION SELECTORS */}
            <nav className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs" aria-label="Reading shelf status filters">
              {[
                {
                  id: 'all',
                  label: 'All Saved',
                  count: countAll,
                  icon: <PiBookmarksBold className="text-sm" />,
                },
                {
                  id: 'want-to-read',
                  label: 'Want to Read',
                  count: countWant,
                  icon: <PiClockBold className="text-sm" />,
                },
                {
                  id: 'currently-reading',
                  label: 'Reading',
                  count: countReading,
                  icon: <PiBookOpenBold className="text-sm" />,
                },
                {
                  id: 'finished',
                  label: 'Finished',
                  count: countFinished,
                  icon: <PiSealCheckBold className="text-sm" />,
                },
              ].map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`h-9 px-2.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-between border font-medium text-xs ${
                      isActive
                        ? 'bg-[#7B1826] text-white border-[#7B1826] shadow-xs'
                        : 'bg-white hover:bg-[#FDFBF7] text-stone-800 border-stone-200 hover:border-stone-300 shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={isActive ? 'text-white' : 'text-[#7B1826]'}>
                        {tab.icon}
                      </span>
                      <span className="font-semibold text-[11px] truncate">
                        {tab.label}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ml-1 flex-shrink-0 ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </header>

          {/* 3. SCROLLABLE SHELF CONTENT */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5 relative z-10">
            {viewMode === 'spines' ? (
              <BookSpineShelf books={filteredList} onSelectBook={handleBookNavigate} />
            ) : (
              <>
                {filteredList.length === 0 ? (
              /* Thoughtful Empty State */
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F5EFE6] border border-[#E5DAC8] text-[#7B1826] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <PiBookOpenTextBold className="text-2xl" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {readingList.length === 0
                    ? 'Your reading shelf is empty'
                    : `No books in "${getStatusLabel(activeFilter)}"`}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {readingList.length === 0
                    ? 'Click the "Save" bookmark icon on any book in the gallery to curate your private library.'
                    : 'Switch your status filter above or update a book&apos;s reading stage to organize your library.'}
                </p>
                {readingList.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="mt-4 px-5 py-2 rounded-full btn-burgundy text-xs shadow-xs"
                  >
                    Explore Discovery Catalog
                  </button>
                )}
              </div>
            ) : (
              filteredList.map((book, idx) => {
                // First book is featured when viewing all saved or single book
                const isFirstBook = idx === 0;
                const imageUrl = book.image
                  ? book.image.startsWith('http')
                    ? book.image
                    : `http://localhost:5555${book.image}`
                  : null;

                const isMenuOpen = activeMenuId === book._id;

                if (isFirstBook) {
                  /* FEATURED BOOK CARD */
                  return (
                    <article
                      key={book._id}
                      className="rounded-2xl border border-[#DFD4C2] bg-white p-4 sm:p-5 shadow-paper relative overflow-hidden transition-all"
                    >
                      {/* Featured Curator Ribbon */}
                      <div className="mb-3 pb-2 border-b border-stone-100 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7B1826]">
                          <PiSparkleBold className="text-amber-500 text-xs" />
                          <span>Curator&apos;s Choice on Your Shelf</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(book.readingStatus)}`}>
                          {getStatusLabel(book.readingStatus)}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Properly Proportioned Featured Cover */}
                        <div
                          onClick={() => handleBookNavigate(book._id)}
                          className="book-cover-wrap w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 cursor-pointer shadow-book group"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full fallback-jacket p-2 flex flex-col justify-between text-stone-100 text-center">
                              <span className="text-[8px] font-mono text-amber-200/60 uppercase">
                                {book.category}
                              </span>
                              <p className="font-serif text-[11px] font-bold text-amber-100 leading-tight line-clamp-2">
                                {book.title}
                              </p>
                              <span className="text-[8px] text-stone-300 italic truncate">
                                {book.author}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Featured Information & Controls */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {/* Card Header Actions */}
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                onClick={() => handleBookNavigate(book._id)}
                                className="font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-[#7B1826] cursor-pointer leading-snug transition-colors line-clamp-2"
                              >
                                {book.title}
                              </h4>

                              {/* Circular Bookmark Toggle & Context Menu */}
                              <div className="flex items-center gap-1 relative flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromList(book._id);
                                  }}
                                  title="Remove from shelf"
                                  aria-label={`Remove ${book.title} from reading shelf`}
                                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors border border-stone-200"
                                >
                                  <PiBookmarkSimpleFill className="text-sm text-[#7B1826] hover:text-red-600" />
                                </button>

                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(isMenuOpen ? null : book._id);
                                    }}
                                    aria-label="More options"
                                    className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors border border-stone-200"
                                  >
                                    <PiDotsThreeVerticalBold className="text-sm" />
                                  </button>

                                  {/* Contextual Popover */}
                                  {isMenuOpen && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30 animate-in fade-in zoom-in-95 text-xs text-stone-700"
                                    >
                                      <div className="px-3 py-1 text-[10px] font-mono text-stone-400 uppercase tracking-wider border-b border-stone-100">
                                        Reading Stage
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateBookStatus(book._id, 'want-to-read');
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center justify-between"
                                      >
                                        <span>Want to Read</span>
                                        {(book.readingStatus || 'want-to-read') === 'want-to-read' && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#7B1826]" />
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateBookStatus(book._id, 'currently-reading');
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center justify-between"
                                      >
                                        <span>Currently Reading</span>
                                        {book.readingStatus === 'currently-reading' && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        )}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateBookStatus(book._id, 'finished');
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 flex items-center justify-between"
                                      >
                                        <span>Finished</span>
                                        {book.readingStatus === 'finished' && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                      </button>

                                      <div className="my-1 border-t border-stone-100" />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          removeFromList(book._id);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-1.5"
                                      >
                                        <PiTrashBold className="text-xs" />
                                        <span>Remove from Shelf</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-stone-600 font-medium italic mt-0.5">
                              by {book.author}
                            </p>

                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400 font-mono">
                              {book.publishYear && <span>{book.publishYear}</span>}
                              {book.publishYear && book.category && <span>&bull;</span>}
                              {book.category && (
                                <span className="text-stone-600 font-sans font-semibold">
                                  {book.category}
                                </span>
                              )}
                            </div>

                            {book.description && (
                              <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                                {book.description}
                              </p>
                            )}
                          </div>

                          {/* View Details Action Row */}
                          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleBookNavigate(book._id)}
                              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-burgundy text-xs shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                              <span>View Details</span>
                              <PiArrowRightBold className="text-xs transform group-hover:translate-x-1 transition-transform duration-200" />
                            </button>

                            {book.averageRating > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-stone-600">
                                <PiStarFill className="text-amber-500 text-xs" />
                                <span>{book.averageRating.toFixed(1)} / 5</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }

                /* COMPACT SUBSEQUENT BOOK CARD */
                return (
                  <article
                    key={book._id}
                    className="rounded-xl border border-[#EAE2D5] bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Compact Book Cover */}
                      <div
                        onClick={() => handleBookNavigate(book._id)}
                        className="book-cover-wrap w-16 sm:w-20 aspect-[2/3] rounded-md overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 cursor-pointer shadow-2xs group"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full fallback-jacket p-1.5 flex flex-col justify-between text-stone-100 text-center">
                            <p className="font-serif text-[10px] font-bold text-amber-100 leading-tight line-clamp-2">
                              {book.title}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Compact Details & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <h4
                              onClick={() => handleBookNavigate(book._id)}
                              className="font-serif text-sm font-bold text-stone-900 hover:text-[#7B1826] cursor-pointer leading-snug transition-colors line-clamp-1"
                            >
                              {book.title}
                            </h4>

                            {/* Circular Bookmark Control & 3-Dot Menu */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromList(book._id);
                                }}
                                title="Remove from shelf"
                                aria-label={`Remove ${book.title}`}
                                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 flex items-center justify-center transition-colors"
                              >
                                <PiBookmarkSimpleFill className="text-xs text-[#7B1826] hover:text-red-600" />
                              </button>

                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(isMenuOpen ? null : book._id);
                                  }}
                                  aria-label="Options"
                                  className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
                                >
                                  <PiDotsThreeVerticalBold className="text-xs" />
                                </button>

                                {isMenuOpen && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-30 animate-in fade-in zoom-in-95 text-xs text-stone-700"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateBookStatus(book._id, 'want-to-read');
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-stone-50"
                                    >
                                      Want to Read
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateBookStatus(book._id, 'currently-reading');
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-stone-50"
                                    >
                                      Currently Reading
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        updateBookStatus(book._id, 'finished');
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-stone-50"
                                    >
                                      Finished
                                    </button>
                                    <div className="my-1 border-t border-stone-100" />
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

                          <p className="text-xs text-stone-600 italic">
                            by {book.author}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.2 rounded-full text-[9px] font-semibold border ${getStatusBadgeStyle(book.readingStatus)}`}>
                              {getStatusLabel(book.readingStatus)}
                            </span>
                            {book.publishYear && (
                              <span className="text-[10px] text-stone-400 font-mono">
                                {book.publishYear}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleBookNavigate(book._id)}
                            className="group inline-flex items-center gap-1 text-[11px] font-semibold text-[#7B1826] hover:text-[#63121E] transition-colors"
                          >
                            <span>View Details</span>
                            <PiArrowRightBold className="text-[10px] transform group-hover:translate-x-1 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}

            {/* 4. REFINED COMPACT EDITORIAL QUOTE (Intelligent use of space) */}
            {filteredList.length > 0 && (
              <div className="pt-3 pb-1 text-center border-t border-[#E8E0D1]/70 mt-4">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F5EFE6] text-[#7B1826] mb-1">
                  <PiBookmarkSimpleBold className="text-xs" />
                </div>
                <p className="font-serif italic text-xs text-stone-600">
                  &ldquo;A small shelf now, a lifelong collection ahead.&rdquo;
                </p>
                <span className="text-[9px] text-stone-400 font-mono uppercase tracking-widest block mt-0.5">
                  PageTurner Sanctuary
                </span>
              </div>
            )}
          </>
        )}
      </div>

          {/* 5. ANCHORED FOOTER & GUARDED DESTRUCTIVE ACTION */}
          <footer className="px-5 sm:px-6 py-3.5 border-t border-[#E8E0D1] bg-[#FFFDF9] relative z-20">
            {showClearConfirm ? (
              <div className="p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-xs animate-in fade-in zoom-in-95">
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
                    className="px-3 py-1 rounded-full btn-paper text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClear}
                    className="px-3.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
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
                    className="text-[11px] font-semibold text-stone-500 hover:text-red-700 hover:underline transition-colors flex items-center gap-1"
                  >
                    <PiTrashBold className="text-xs text-stone-400" />
                    <span>Clear Entire Shelf...</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-stone-400">
                    Shelf synchronized
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookplate(true)}
                    className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full btn-paper text-xs text-stone-800 shadow-xs hover:border-[#7B1826]/40"
                  >
                    <PiStampBold className="text-sm text-[#7B1826] group-hover:scale-110 transition-transform duration-200" />
                    <span>Print My Bookplate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-2 rounded-full btn-burgundy text-xs shadow-xs hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </footer>
        </div>
      </div>

      {/* Custom Vintage Ex Libris Bookplate Generator Modal */}
      <BookplateModal
        isOpen={showBookplate}
        onClose={() => setShowBookplate(false)}
      />
    </div>
  );
};

export default ReadingListModal;
