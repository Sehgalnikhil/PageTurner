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
import { Link } from 'react-router-dom';
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
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { bookService } from '../services/api';

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
    <div className="min-h-screen flex flex-col bg-transparent transition-colors duration-300">
      <Navbar totalBooks={totalBooks} />

      <main className="flex-1 max-w-[1480px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Seamlessly Integrated Editorial Masthead Banner */}
        <header className="mb-8 rounded-3xl bg-[#FAF7F2] border border-[#E8DED2] overflow-hidden shadow-2xs relative">
          {/* Seamlessly Embedded Moodboard Artwork with Feathered Editorial Blend */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[65%] md:w-[58%] lg:w-[52%] xl:w-[48%] overflow-hidden pointer-events-none select-none">
            <img
              src="/images/hero-moodboard.jpg"
              alt="Literary Moodboard - A quieter brighter you"
              className="w-full h-full object-cover object-right sm:object-center"
            />
            {/* Seamless feathering gradient from paper canvas background to transparent */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 sm:via-[#FAF7F2]/45 to-transparent pointer-events-none" />
            {/* Top and bottom subtle edge softening */}
            <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#FAF7F2]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#FAF7F2]/60 to-transparent pointer-events-none" />
          </div>

          {/* Left Content Column */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-xl xl:max-w-2xl min-h-[200px] sm:min-h-[210px] lg:min-h-[230px] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="h-[1px] w-5 bg-[#C99A48]"></span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#861D2D]">
                Digital Reading Journal &bull; Issue No. 24
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#292522] tracking-tight leading-tight">
              Fall into <span className="italic font-normal text-[#861D2D]">another world.</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-[#827870] font-serif italic mt-2 mb-5 leading-relaxed max-w-lg">
              Stories to keep. Ideas to collect. Worlds to get lost in.
            </p>

            {/* Start Exploring Button & Curated Universe Subtext */}
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('curated-collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-[#7B1826] via-[#861D2D] to-[#6E1421] text-[#FAF7F2] font-sans text-xs sm:text-[13px] font-semibold tracking-wide shadow-[0_4px_16px_-2px_rgba(123,24,38,0.38),0_2px_4px_-1px_rgba(123,24,38,0.2)] hover:shadow-[0_8px_24px_-4px_rgba(123,24,38,0.5),0_4px_8px_-2px_rgba(123,24,38,0.25)] border border-[#A83242]/40 ring-1 ring-inset ring-white/15 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Subtle ambient shine overlay on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                <PiCompassBold className="text-[#F1CFA0] text-sm sm:text-base group-hover:rotate-45 transition-transform duration-300 relative z-10" />
                <span className="relative z-10 font-medium">Start Exploring</span>

                {/* Circular badge with gliding arrow */}
                <span className="relative z-10 w-6 h-6 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white transition-all duration-200 group-hover:bg-white group-hover:text-[#7B1826] group-hover:translate-x-0.5 shadow-xs">
                  <PiArrowRightBold className="text-[11px]" />
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-1">
                <span className="h-6 w-[1px] bg-[#E8DED2]" aria-hidden="true" />
                <span className="text-[10px] sm:text-[11px] font-mono text-[#827870] uppercase tracking-wider max-w-[240px] leading-relaxed">
                  A curated universe of books, ideas &amp; quieter days.
                </span>
              </div>
            </div>
          </div>
        </header>

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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DED2]">
            {/* View Tab Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMainTab('discover')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-180 active:scale-95 ${
                  mainTab === 'discover'
                    ? 'bg-[#292522] text-white shadow-2xs'
                    : 'bg-[#FFFDF9] text-[#292522] hover:bg-white hover:text-[#861D2D] border border-[#E8DED2]'
                }`}
              >
                All Stories
              </button>

              <button
                type="button"
                onClick={() => setMainTab('shelf')}
                className={`group px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-180 active:scale-95 flex items-center gap-2 ${
                  mainTab === 'shelf'
                    ? 'bg-[#861D2D] text-white shadow-2xs'
                    : 'bg-[#FFFDF9] text-[#292522] hover:bg-white hover:text-[#861D2D] border border-[#E8DED2]'
                }`}
              >
                <PiBookmarkSimpleFill
                  className={`${
                    mainTab === 'shelf' ? 'text-amber-300' : 'text-[#861D2D]'
                  } group-hover:scale-105 transition-transform duration-200 text-sm`}
                />
                <span>My Shelf</span>
                {savedCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all duration-200 ${
                      mainTab === 'shelf'
                        ? 'bg-white text-[#861D2D]'
                        : 'bg-[#861D2D] text-white'
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
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827870] group-focus-within/search:text-[#861D2D] text-xs pointer-events-none transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search title, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs text-[#292522] placeholder-[#827870]/70 bg-white border border-[#E8DED2] hover:border-[#861D2D]/40 focus:outline-none focus:border-[#861D2D] shadow-2xs transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded-full hover:bg-stone-100"
                  >
                    <PiXBold className="text-xs" />
                  </button>
                )}
              </div>

              {/* Genre Dropdown with hover border transition */}
              <div className="relative group/genre">
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="text-[#292522] text-xs font-semibold rounded-xl px-3 py-2 pr-7 cursor-pointer appearance-none bg-white border border-[#E8DED2] hover:border-[#861D2D]/40 focus:outline-none focus:border-[#861D2D] shadow-2xs transition-colors"
                >
                  <option value="All">All Genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Biography">Biography</option>
                  <option value="Technology">Technology</option>
                  <option value="Uncategorized">Uncategorized</option>
                </select>
                <PiFunnelBold className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#827870] group-hover/genre:text-[#861D2D] text-[11px] pointer-events-none transition-colors" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative group/sort">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="text-[#292522] text-xs font-semibold rounded-xl px-3 py-2 pr-7 cursor-pointer appearance-none bg-white border border-[#E8DED2] hover:border-[#861D2D]/40 focus:outline-none focus:border-[#861D2D] shadow-2xs transition-colors"
                >
                  <option value="createdAt">Recently Added</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="year-newest">Year (Newest)</option>
                  <option value="year-oldest">Year (Oldest)</option>
                </select>
                <PiSortAscendingBold className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#827870] group-hover/sort:text-[#861D2D] text-[11px] pointer-events-none transition-colors" />
              </div>

              {/* Layout Switcher (Masonry Gallery vs Oak Hardwood Shelf vs Table) */}
              <div className="inline-flex rounded-xl bg-white p-0.5 border border-[#E8DED2] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowType('masonry')}
                  title="Organic Masonry Gallery"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    showType === 'masonry'
                      ? 'bg-[#292522] text-white shadow-2xs'
                      : 'text-[#827870] hover:text-[#292522]'
                  }`}
                >
                  <PiSquaresFourBold className="text-sm" />
                  <span className="hidden md:inline">Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowType('shelf')}
                  title="Oak Hardwood Bookshelf"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    showType === 'shelf'
                      ? 'bg-[#292522] text-white shadow-2xs'
                      : 'text-[#827870] hover:text-[#292522]'
                  }`}
                >
                  <PiBooksBold className="text-sm text-amber-500" />
                  <span className="hidden md:inline">Oak Shelf</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowType('table')}
                  title="Bibliographic Table View"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    showType === 'table'
                      ? 'bg-[#292522] text-white shadow-2xs'
                      : 'text-[#827870] hover:text-[#292522]'
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
          <div className="py-24 flex justify-center items-center">
            <Spinner />
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
