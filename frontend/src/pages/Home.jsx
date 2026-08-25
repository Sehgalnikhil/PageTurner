import React, { useEffect, useState, useMemo, useContext } from 'react';
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
  PiBookBookmark
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const { user } = useContext(AuthContext);
  const limit = 8; // Number of items per page

  const fetchBooks = () => {
    setLoading(true);
    let url = `http://localhost:5555/books?page=${page}&limit=${limit}`;
    if (searchQuery) url += `&search=${searchQuery}`;
    if (category && category !== 'All') url += `&category=${category}`;

    axios
      .get(url)
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
  }, [page, category]);

  // Trigger search when user presses Enter or clicks button, to avoid spamming the backend
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1); // Reset to page 1 on new search
      fetchBooks();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
    fetchBooks();
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar totalBooks={totalBooks} />

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
            <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col min-w-[110px]">
              <span className="text-xs font-medium text-slate-400">Total Books</span>
              <span className="text-lg font-bold text-slate-900">{totalBooks}</span>
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
              placeholder="Search and hit enter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Category Filter + View Toggle */}
          <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
            {/* Category Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 hidden lg:inline">Category:</span>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-800 transition-all shadow-sm"
              >
                <option value="All">All Categories</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Biography">Biography</option>
                <option value="Uncategorized">Uncategorized</option>
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
        ) : books.length > 0 ? (
          <div>
            {showType === 'table' ? (
              <BooksTable books={books} />
            ) : (
              <BooksCard books={books} />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-4 text-center rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-lg mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto mb-4">
              <PiBooks className="text-3xl" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No matching books found
            </h3>
            <p className="text-xs text-slate-500 mb-5 max-w-xs mx-auto">
              We couldn't find any results.
            </p>
            {user?.role === 'admin' && (
              <Link
                to="/books/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <PiPlusBold />
                <span>Add Book</span>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
