import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import { Link } from 'react-router-dom';
import {
  PiMagnifyingGlassBold,
  PiListBulletsBold,
  PiSquaresFourBold,
  PiBooks,
  PiPlusBold,
  PiSortAscendingBold,
  PiBookBookmark
} from 'react-icons/pi';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/books')
      .then((response) => {
        setBooks(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  // Filter and Sort Books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          String(b.publishYear).includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'title-az') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'title-za') {
        return (b.title || '').localeCompare(a.title || '');
      }
      if (sortBy === 'year-desc') {
        return (Number(b.publishYear) || 0) - (Number(a.publishYear) || 0);
      }
      if (sortBy === 'year-asc') {
        return (Number(a.publishYear) || 0) - (Number(b.publishYear) || 0);
      }
      return 0;
    });

    return result;
  }, [books, searchQuery, sortBy]);

  // Statistics
  const uniqueAuthors = useMemo(() => {
    return new Set(books.map((b) => b.author?.trim()).filter(Boolean)).size;
  }, [books]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar totalBooks={books.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              <PiBookBookmark className="text-slate-700 text-sm" />
              <span>Library Management Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Catalog & Collections
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Browse, search, edit, and organize all book records stored in your database.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-card flex flex-col min-w-[110px]">
              <span className="text-xs font-medium text-slate-400">Total Books</span>
              <span className="text-lg font-bold text-slate-900">{books.length}</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-card flex flex-col min-w-[110px]">
              <span className="text-xs font-medium text-slate-400">Authors</span>
              <span className="text-lg font-bold text-slate-900">{uniqueAuthors}</span>
            </div>
          </div>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="my-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, author, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all shadow-card"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Sorting + View Toggle */}
          <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 hidden lg:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-800 transition-all shadow-card"
              >
                <option value="newest">Recently Added</option>
                <option value="oldest">First Added</option>
                <option value="title-az">Title (A - Z)</option>
                <option value="title-za">Title (Z - A)</option>
                <option value="year-desc">Year (Newest first)</option>
                <option value="year-asc">Year (Oldest first)</option>
              </select>
            </div>

            {/* Segmented View Switcher */}
            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 border border-slate-200">
              <button
                onClick={() => setShowType('card')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showType === 'card'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PiSquaresFourBold className="text-sm" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setShowType('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showType === 'table'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PiListBulletsBold className="text-sm" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <Spinner />
        ) : filteredAndSortedBooks.length > 0 ? (
          <div>
            {showType === 'table' ? (
              <BooksTable books={filteredAndSortedBooks} />
            ) : (
              <BooksCard books={filteredAndSortedBooks} />
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center rounded-2xl bg-white border border-slate-200/80 shadow-card max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto mb-4">
              <PiBooks className="text-3xl" />
            </div>
            {searchQuery ? (
              <>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No matching books found
                </h3>
                <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
                  We couldn't find any results matching "{searchQuery}". Try searching with a different keyword.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Clear Search Filter
                </button>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Your library is currently empty
                </h3>
                <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
                  Get started by adding your very first book title to the catalog.
                </p>
                <Link
                  to="/books/create"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <PiPlusBold />
                  <span>Add First Book</span>
                </Link>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
