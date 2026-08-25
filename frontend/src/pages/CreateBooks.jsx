import React, { useState, useContext } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PiBookOpenTextBold, PiUserBold, PiCalendarBold, PiPlusBold, PiImageBold } from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [language, setLanguage] = useState('English');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const handleSaveBook = (e) => {
    e?.preventDefault();

    if (!title.trim() || !author.trim() || !publishYear) {
      enqueueSnackbar('Please fill out all required fields', { variant: 'warning' });
      return;
    }

    if (!user || !user.token) {
      enqueueSnackbar('Please log in as an Admin to create a book', { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('publishYear', publishYear);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('isbn', isbn);
    formData.append('pageCount', pageCount);
    formData.append('language', language);
    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    axios
      .post('http://localhost:5555/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book added to collection successfully', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(error.response?.data?.message || 'Failed to create book record.', { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <PiBookOpenTextBold className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Add New Book
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter book details to add a new record to your library database.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <Spinner message="Saving book record..." />
          ) : (
            <form onSubmit={handleSaveBook} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Book Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <PiBookOpenTextBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. To Kill a Mockingbird"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* Author Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Author Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harper Lee"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* Publish Year Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Publication Year <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <PiCalendarBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1960"
                      min="1000"
                      max={new Date().getFullYear() + 5}
                      value={publishYear}
                      onChange={(e) => setPublishYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Biography">Biography</option>
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Synopsis or description..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/10 focus:border-slate-800 transition-all"
                />
              </div>

              {/* Extra Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    placeholder="ISBN number"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Cover Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
                >
                  <PiPlusBold />
                  <span>Save Book</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateBooks;