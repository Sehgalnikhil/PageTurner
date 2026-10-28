import React, { useEffect, useState, useContext, useMemo } from 'react';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import BooksTable from '../components/home/BooksTable';
import BooksMasonry from '../components/home/BooksMasonry';
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
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { bookService } from '../services/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('masonry'); // 'masonry' | 'table'
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Compact Above-the-Fold Editorial Masthead (Reduced height by ~35-40%) */}
        <header className="mb-6 pb-5 border-b border-stone-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-burgundy block mb-1">
                Digital Reading Journal &bull; Issue No. 24
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-none">
                Fall into <span className="italic font-normal text-burgundy">another world.</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-1.5">
                Stories to keep. Ideas to collect. Worlds to get lost in.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                to={user ? "/books/create" : "/login"}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-burgundy text-xs shadow-xs"
              >
                <PiPlusBold className="text-xs group-hover:rotate-90 transition-transform duration-250 ease-out" />
                <span>Add Story</span>
              </Link>

              <div className="text-[11px] font-mono text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-full shadow-xs">
                <span className="font-bold text-stone-800">{totalBooks}</span> works cataloged
              </div>
            </div>
          </div>
        </header>

        {/* Curated Atmospheric Collections: Sophisticated, Image-Led Tiles (No Emojis) */}
        <CuratedCollectionTiles
          selectedMood={selectedMood}
          onSelectMood={handleMoodSelect}
          onClearMood={() => setSelectedMood(null)}
        />

        {/* Blind Date with a Book Spotlight Invitation Banner */}
        <BlindDateBanner books={books} />

        {/* Streamlined Discovery Toolbar (Search, Filter, Tab toggles) */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
            {/* View Tab Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMainTab('discover')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                  mainTab === 'discover'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                All Stories
              </button>

              <button
                type="button"
                onClick={() => setMainTab('shelf')}
                className={`group px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                  mainTab === 'shelf'
                    ? 'bg-burgundy text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                <PiBookmarkSimpleFill
                  className={`${
                    mainTab === 'shelf' ? 'text-amber-300' : 'text-burgundy'
                  } group-hover:scale-110 transition-transform duration-200`}
                />
                <span>My Shelf</span>
                {savedCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold transition-all duration-200 group-hover:scale-105 ${
                      mainTab === 'shelf'
                        ? 'bg-white text-burgundy'
                        : 'bg-burgundy text-white'
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
              <div className="relative flex-1 sm:w-56 group/search">
                <PiMagnifyingGlassBold className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within/search:text-burgundy text-xs pointer-events-none transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search title, author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="editorial-input w-full pl-8 pr-7 py-1.5 rounded-full text-xs placeholder-stone-400 bg-white hover:border-stone-400 focus:hover:border-burgundy"
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
                  className="editorial-input text-stone-700 text-xs font-semibold rounded-full px-3 py-1.5 pr-6 cursor-pointer appearance-none bg-white hover:border-stone-400 transition-colors"
                >
                  <option value="All">All Genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Biography">Biography</option>
                  <option value="Technology">Technology</option>
                  <option value="Uncategorized">Uncategorized</option>
                </select>
                <PiFunnelBold className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 group-hover/genre:text-stone-700 text-[11px] pointer-events-none transition-colors" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative group/sort">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="editorial-input text-stone-700 text-xs font-semibold rounded-full px-3 py-1.5 pr-6 cursor-pointer appearance-none bg-white hover:border-stone-400 transition-colors"
                >
                  <option value="createdAt">Recently Added</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="year-newest">Year (Newest)</option>
                  <option value="year-oldest">Year (Oldest)</option>
                </select>
                <PiSortAscendingBold className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 group-hover/sort:text-stone-700 text-[11px] pointer-events-none transition-colors" />
              </div>

              {/* Layout Switcher (Masonry vs Table) */}
              <div className="inline-flex rounded-full bg-white p-0.5 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowType('masonry')}
                  title="Organic Masonry Gallery"
                  className={`p-1.5 rounded-full transition-all ${
                    showType === 'masonry'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <PiSquaresFourBold className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowType('table')}
                  title="Bibliographic Table View"
                  className={`p-1.5 rounded-full transition-all ${
                    showType === 'table'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <PiListBulletsBold className="text-xs" />
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
            ) : (
              <BooksMasonry books={displayedBooks} />
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
