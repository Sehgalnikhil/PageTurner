import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../services/api';
import { useSnackbar } from 'notistack';
import { PiWarningBold, PiTrashBold } from 'react-icons/pi';

const DeleteBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    bookService
      .getById(id)
      .then((res) => {
        setBook(res.data);
        setFetching(false);
      })
      .catch((err) => {
        setFetching(false);
        console.error(err);
      });
  }, [id]);

  const handleDeleteBook = () => {
    setLoading(true);
    bookService
      .delete(id)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book was permanently removed from the collection.', { variant: 'success' });
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(
          error.customMessage || error.response?.data?.message || 'Failed to remove book.',
          { variant: 'error' }
        );
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-12 relative z-10 flex flex-col justify-center">
        <div className="mb-6">
          <BackButton destination={`/books/details/${id}`} label="Cancel & Return" />
        </div>

        {fetching ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="editorial-sheet p-8 sm:p-10 bg-white border border-stone-200 shadow-paper-hover">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <PiWarningBold className="text-2xl" />
            </div>

            <h1 className="font-serif text-2xl font-bold text-stone-900 text-center mb-2">
              Confirm Archival Removal
            </h1>

            <p className="text-xs text-stone-600 text-center max-w-sm mx-auto mb-6 leading-relaxed">
              Are you certain you wish to delete this book record? This will permanently remove its catalog entry, reader ratings, and associated reviews.
            </p>

            {book && (
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-stone-200 mb-6 flex items-center gap-3">
                <div className="w-12 h-16 rounded overflow-hidden bg-stone-200 flex-shrink-0">
                  {book.image ? (
                    <img
                      src={book.image.startsWith('http') ? book.image : `http://localhost:5555${book.image}`}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full fallback-jacket p-1 flex items-center justify-center text-[9px] text-amber-100 text-center font-serif">
                      Cover
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-500">by {book.author}</p>
                  <span className="text-[11px] font-mono text-stone-400">Published {book.publishYear}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => navigate(`/books/details/${id}`)}
                className="px-4 py-2 rounded-full btn-paper text-xs"
              >
                Keep Book
              </button>

              <button
                type="button"
                onClick={handleDeleteBook}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                <PiTrashBold className="text-sm" />
                <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DeleteBook;
