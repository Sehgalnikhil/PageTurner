import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import {
  PiBookOpenTextBold,
  PiUserBold,
  PiCalendarBold,
  PiClockBold,
  PiIdentificationBadgeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiStarFill,
  PiTextAaBold
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const fetchBookDetails = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      enqueueSnackbar('You must be logged in to leave a review', { variant: 'error' });
      return;
    }

    setReviewLoading(true);
    try {
      await axios.post(
        `http://localhost:5555/books/${id}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      enqueueSnackbar('Review submitted successfully', { variant: 'success' });
      setComment('');
      setRating(5);
      fetchBookDetails(); // Refresh book details to get the new review
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit review', { variant: 'error' });
    } finally {
      setReviewLoading(false);
    }
  };

  const isAdmin = user && user.role === 'admin';
  const imageUrl = book.image ? `http://localhost:5555${book.image}` : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {loading ? (
          <Spinner message="Loading book details..." />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Image and Actions */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center">
                {imageUrl ? (
                  <img src={imageUrl} alt={book.title} className="w-full rounded-xl object-cover mb-4" />
                ) : (
                  <div className="w-full aspect-[2/3] bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <PiBookOpenTextBold className="text-6xl text-slate-300" />
                  </div>
                )}

                {book.averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <PiStarFill className="text-yellow-500 text-xl" />
                    <span className="text-lg font-bold text-slate-800">{book.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">({book.reviews?.length} reviews)</span>
                  </div>
                )}
                
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center gap-2 w-full mt-4">
                    <Link
                      to={`/books/edit/${book._id}`}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <PiPencilSimpleBold className="text-sm" />
                      <span>Edit</span>
                    </Link>
                    <Link
                      to={`/books/delete/${book._id}`}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                    >
                      <PiTrashBold className="text-sm" />
                      <span>Delete</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details and Reviews */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="mb-6">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide mb-3">
                    {book.category || 'Uncategorized'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-2">
                    {book.title}
                  </h1>
                  <p className="text-lg font-medium text-slate-600">
                    By <span className="text-slate-900">{book.author}</span>
                  </p>
                </div>

                {book.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <PiTextAaBold /> Description
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Structured Info Grid */}
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <PiCalendarBold className="text-sm" />
                      <span>Publish Year</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {book.publishYear}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <PiBookOpenTextBold className="text-sm" />
                      <span>Page Count</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {book.pageCount || 'N/A'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <PiIdentificationBadgeBold className="text-sm" />
                      <span>ISBN</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {book.isbn || 'N/A'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <PiClockBold className="text-sm" />
                      <span>Language</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {book.language || 'English'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Reviews</h2>

                {/* Review Form */}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Write a Customer Review</h3>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Rating</label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(e.target.value)}
                        className="p-2 border rounded text-sm w-32"
                      >
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Comment</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows="3"
                        placeholder="What did you think about this book?"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-sm">
                    Please <Link to="/login" className="font-bold underline">log in</Link> to write a review.
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((review) => (
                      <div key={review._id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-800">{review.username}</span>
                          <div className="flex items-center text-yellow-500 text-xs">
                            <PiStarFill />
                            <span className="ml-1 font-bold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No reviews yet. Be the first to review this book!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShowBook;
