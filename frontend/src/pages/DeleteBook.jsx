import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PiWarningCircleBold, PiTrashBold, PiBookOpenTextBold } from 'react-icons/pi';

const DeleteBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFetchLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setFetchLoading(false);
      })
      .catch((error) => {
        setFetchLoading(false);
        console.error(error);
      });
  }, [id]);

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/books/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book removed from library', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Failed to delete book record', { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 text-center">
          {/* Warning Icon */}
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <PiWarningCircleBold className="text-3xl" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
            Delete Book Record
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Are you sure you want to permanently remove this book from your collection? This action cannot be undone.
          </p>

          {/* Book Summary Card */}
          {fetchLoading ? (
            <Spinner message="Fetching record info..." />
          ) : book ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                <PiBookOpenTextBold className="text-base" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-500">
                  By {book.author} ({book.publishYear})
                </p>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleDeleteBook}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <PiTrashBold />
              <span>{loading ? 'Deleting...' : 'Yes, Delete Record'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteBook;
