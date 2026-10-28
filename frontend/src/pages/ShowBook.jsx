import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import BookPinCard from '../components/home/BookPinCard';
import {
  PiCalendarBold,
  PiClockBold,
  PiIdentificationBadgeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiStarFill,
  PiUserCircleBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiPaperPlaneTiltBold,
  PiBookOpenTextBold,
  PiChatCircleTextBold,
  PiNotePencilBold,
  PiCheckBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { bookService } from '../services/api';
import { useSnackbar } from 'notistack';
import PageFlipPreview from '../components/home/PageFlipPreview';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Personal reading journal note state
  const [personalNotes, setPersonalNotes] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [popping, setPopping] = useState(false);

  const { id } = useParams();
  const { user, isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook, getSavedBook, updateBookStatus } = useContext(ReadingListContext);
  const { enqueueSnackbar } = useSnackbar();

  const isSaved = isBookSaved(id);
  const savedEntry = getSavedBook(id);

  // Sync personal notes when savedEntry changes
  useEffect(() => {
    if (savedEntry?.notes) {
      setPersonalNotes(savedEntry.notes);
    } else {
      setPersonalNotes('');
    }
  }, [savedEntry]);

  const fetchBookDetails = () => {
    setLoading(true);
    bookService
      .getById(id)
      .then((response) => {
        const bookData = response.data;
        setBook(bookData);
        setLoading(false);

        // Fetch related books with same category
        if (bookData.category) {
          bookService
            .getAll({ category: bookData.category, limit: 4 })
            .then((res) => {
              const related = (res.data.data || []).filter((b) => b._id !== id).slice(0, 3);
              setRelatedBooks(related);
            })
            .catch(() => {});
        }
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Failed to load book record', { variant: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      enqueueSnackbar('Please log in to submit a review', { variant: 'warning' });
      return;
    }

    if (!comment.trim()) {
      enqueueSnackbar('Review comment cannot be empty', { variant: 'error' });
      return;
    }

    setReviewLoading(true);
    try {
      await bookService.addReview(id, { rating: Number(rating), comment: comment.trim() });
      enqueueSnackbar('Your reflection has been published to the journal.', { variant: 'success' });
      setComment('');
      setRating(5);
      fetchBookDetails();
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Failed to submit review',
        { variant: 'error' }
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSaveNotes = () => {
    if (!isSaved) {
      toggleBook(book);
    }
    updateBookStatus(id, savedEntry?.readingStatus || 'want-to-read', personalNotes);
    setNoteSavedFeedback(true);
    enqueueSnackbar('Personal journal notes saved to shelf.', { variant: 'success' });
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  const handleStatusChange = (status) => {
    if (!isSaved) {
      toggleBook(book);
    }
    updateBookStatus(id, status, personalNotes);
    enqueueSnackbar(`Reading status updated to "${status.replace(/-/g, ' ')}"`, { variant: 'info' });
  };

  const imageUrl = book.image
    ? book.image.startsWith('http')
      ? book.image
      : `http://localhost:5555${book.image}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <BackButton />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPopping(true);
                toggleBook(book);
                setTimeout(() => setPopping(false), 450);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isSaved
                  ? 'bg-burgundy text-white shadow-xs hover:bg-[#63121E]'
                  : 'btn-paper text-stone-800'
              }`}
            >
              {isSaved ? (
                <>
                  <PiBookmarkSimpleFill
                    className={`text-sm text-amber-300 ${popping ? 'animate-bookmark-pop' : ''}`}
                  />
                  <span>On Your Shelf</span>
                </>
              ) : (
                <>
                  <PiBookmarkSimpleBold className="text-sm text-burgundy" />
                  <span>Save to Shelf</span>
                </>
              )}
            </button>

            {isAdmin && (
              <div className="flex items-center gap-1 pl-2 border-l border-stone-300">
                <Link
                  to={`/books/edit/${book._id}`}
                  className="px-3 py-2 rounded-full btn-paper text-xs text-stone-700"
                >
                  Edit
                </Link>
                <Link
                  to={`/books/delete/${book._id}`}
                  className="px-3 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium"
                >
                  Delete
                </Link>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Two-Column Editorial Spread */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column (5 cols): Cover & Shelf Tracking Sheet */}
              <div className="md:col-span-5 flex flex-col gap-6">
                {/* Book Cover Artwork with Spine depth */}
                <div className="editorial-sheet p-6 flex flex-col items-center bg-white">
                  <div className="book-cover-wrap w-full max-w-[320px] rounded-lg overflow-hidden shadow-book border border-stone-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-auto max-h-[480px] object-cover block"
                      />
                    ) : (
                      <div className="w-full h-80 fallback-jacket p-6 flex flex-col justify-between text-stone-100">
                        <span className="text-xs uppercase font-mono tracking-widest text-amber-200/60">{book.category}</span>
                        <h2 className="font-serif text-2xl font-bold text-amber-50">{book.title}</h2>
                        <p className="text-xs text-amber-100/70 italic">by {book.author}</p>
                      </div>
                    )}
                  </div>

                  {/* Rating Score */}
                  {book.averageRating > 0 && (
                    <div className="mt-5 flex items-center gap-2 bg-[#F6F1E8] px-4 py-1.5 rounded-full border border-stone-200 text-xs">
                      <div className="flex items-center text-amber-500">
                        <PiStarFill />
                      </div>
                      <span className="font-bold text-stone-900">
                        {book.averageRating.toFixed(1)} / 5.0
                      </span>
                      <span className="text-stone-500">
                        ({book.reviews?.length || 0} reader reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Personal Reading Journal & Tracking Card */}
                <div className="editorial-sheet p-6 bg-[#FAF7F2]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                      <PiNotePencilBold className="text-burgundy" />
                      <span>Reading Journal &amp; Notes</span>
                    </h3>
                    <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      Saved to Device Shelf
                    </span>
                  </div>

                  {/* Reading Status Selector */}
                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                      Your Reading Status
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {[
                        { id: 'want-to-read', label: 'Want to Read' },
                        { id: 'currently-reading', label: 'Reading' },
                        { id: 'finished', label: 'Finished' },
                      ].map((st) => {
                        const isCurrent = (savedEntry?.readingStatus || 'want-to-read') === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => handleStatusChange(st.id)}
                            className={`py-1.5 px-2 rounded-lg text-center text-[11px] font-semibold transition-all border ${
                              isCurrent
                                ? 'bg-burgundy text-white border-burgundy shadow-xs'
                                : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                            }`}
                          >
                            {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Notes Textarea */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                      Personal Reflections &amp; Annotations
                    </label>
                    <textarea
                      rows="3"
                      value={personalNotes}
                      onChange={(e) => setPersonalNotes(e.target.value)}
                      placeholder="Add key insights, quote bookmarks, or personal reflections..."
                      className="editorial-input w-full p-2.5 rounded-xl text-xs text-stone-800 placeholder-stone-400 bg-white"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          noteSavedFeedback
                            ? 'bg-emerald-600 text-white'
                            : 'btn-burgundy'
                        }`}
                      >
                        {noteSavedFeedback ? (
                          <>
                            <PiCheckBold className="text-xs" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <span>Save Note</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bibliographic Metadata Sheet */}
                <div className="editorial-sheet p-6 bg-white space-y-3 text-xs">
                  <h4 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Bibliographic Record
                  </h4>

                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">First Published</span>
                    <span className="font-mono font-semibold text-stone-800">{book.publishYear}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Genre / Category</span>
                    <span className="font-semibold text-burgundy">{book.category || 'General'}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Pages</span>
                    <span className="font-mono text-stone-800">{book.pageCount || 'Unknown'}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">ISBN</span>
                    <span className="font-mono text-stone-800">{book.isbn || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">Language</span>
                    <span className="text-stone-800">{book.language || 'English'}</span>
                  </div>

                  {book.createdBy?.username && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-stone-500">Archived By</span>
                      <span className="font-medium text-stone-800">{book.createdBy.username}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (7 cols): Editorial Typography, Synopsis, Reviews */}
              <div className="md:col-span-7 flex flex-col gap-8">
                {/* Title & Author Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-burgundy bg-burgundy-faint px-3 py-1 rounded-full border border-burgundy/15">
                      {book.category || 'Literary Classic'}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Published {book.publishYear}
                    </span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15] mb-3">
                    {book.title}
                  </h1>

                  <p className="text-lg text-stone-600 font-serif italic">
                    A work by <span className="font-semibold not-italic text-stone-900">{book.author}</span>
                  </p>
                </div>

                {/* Editorial Synopsis */}
                <div className="editorial-sheet p-6 sm:p-8 bg-white">
                  <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-200">
                    Editorial Overview &amp; Synopsis
                  </h3>

                  <div className="prose text-stone-700 text-sm leading-relaxed font-sans">
                    <p className="literary-dropcap leading-relaxed">
                      {book.description ||
                        `"${book.title}" represents an enduring entry in the canon of ${book.category || 'world literature'}. Crafted with intentional precision by ${book.author}, the work continues to engage readers and prompt critical contemplation across generations.`}
                    </p>
                  </div>
                </div>

                {/* Tactile Sample Chapter / First Lines Reader */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                      <PiBookOpenTextBold className="text-burgundy" />
                      <span>Archival First Edition Reader</span>
                    </h3>
                    <span className="text-[10px] font-mono text-stone-500">
                      Apple Books Engine
                    </span>
                  </div>
                  <PageFlipPreview book={book} />
                </div>

                {/* Reader Reviews & Critical Reflections */}
                <div className="editorial-sheet p-6 sm:p-8 bg-white">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                        <PiChatCircleTextBold className="text-burgundy" />
                        <span>Reader Reflections</span>
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        Observations and community ratings
                      </p>
                    </div>

                    {book.reviews && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-stone-100 text-stone-700">
                        {book.reviews.length} {book.reviews.length === 1 ? 'reflection' : 'reflections'}
                      </span>
                    )}
                  </div>

                  {/* Submit Review Form */}
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-[#FAF7F2] rounded-xl border border-stone-200">
                      <h4 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                        Write a Reflection as <span className="text-burgundy">{user.username}</span>
                      </h4>

                      <div className="mb-3">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Score (1 to 5 Stars)
                        </label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="editorial-input p-2 rounded-lg text-xs font-semibold text-stone-900 w-44 bg-white"
                        >
                          <option value="5">&#9733;&#9733;&#9733;&#9733;&#9733; (5 - Exceptional)</option>
                          <option value="4">&#9733;&#9733;&#9733;&#9733; (4 - Very Good)</option>
                          <option value="3">&#9733;&#9733;&#9733; (3 - Good)</option>
                          <option value="2">&#9733;&#9733; (2 - Fair)</option>
                          <option value="1">&#9733; (1 - Poor)</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Your Critical Thoughts
                        </label>
                        <textarea
                          rows="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                          placeholder="Share your perspective on the characters, writing, or lasting impressions..."
                          className="editorial-input w-full p-3 rounded-xl text-xs text-stone-900 placeholder-stone-400 bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={reviewLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 btn-burgundy text-xs rounded-full shadow-xs disabled:opacity-50"
                      >
                        <PiPaperPlaneTiltBold className="text-xs" />
                        <span>{reviewLoading ? 'Publishing...' : 'Publish Reflection'}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="mb-8 p-4 bg-[#F5F0E6] rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-700">
                      <span>Sign in to publish your critical notes on this book.</span>
                      <Link to="/login" className="px-3 py-1.5 rounded-full btn-burgundy text-xs">
                        Sign In
                      </Link>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {book.reviews && book.reviews.length > 0 ? (
                      book.reviews.map((rev) => (
                        <div
                          key={rev._id}
                          className="p-4 rounded-xl border border-stone-100 bg-[#FAF7F2] text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">
                              {rev.username}
                            </span>
                            <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                              <PiStarFill className="text-amber-500" />
                              <span>{rev.rating} / 5</span>
                            </div>
                          </div>
                          <p className="text-stone-700 leading-relaxed font-sans">{rev.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-6 font-serif italic">
                        No reflections recorded yet. Be the first reader to record your notes.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Works in Same Genre */}
            {relatedBooks.length > 0 && (
              <section className="pt-8 border-t border-stone-200">
                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Companion Discoveries
                  </h3>
                  <p className="text-xs text-stone-500">
                    Other works curated in <span className="font-semibold text-burgundy">{book.category}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBooks.map((relBook) => (
                    <BookPinCard key={relBook._id} book={relBook} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShowBook;
