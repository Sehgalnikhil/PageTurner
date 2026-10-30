import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  PiXBold,
  PiBookOpenTextBold,
  PiCalendarBlankBold,
  PiStarFill,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiArrowRightBold,
  PiSparkleBold,
} from 'react-icons/pi';
import { AuthContext } from '../../context/AuthContext';
import { ReadingListContext } from '../../context/ReadingListContext';
import PageFlipPreview from './PageFlipPreview';
import { getBookCoverUrl } from '../../utils/imageHelper';

const BookModal = ({ book, onClose }) => {
  const [popping, setPopping] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'first-lines'
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const isSaved = isBookSaved(book._id);
  const imageUrl = getBookCoverUrl(book.image, book.title, book.isbn);

  const handleToggle = () => {
    setPopping(true);
    toggleBook(book);
    setTimeout(() => setPopping(false), 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#F7F3EC] rounded-2xl shadow-2xl border border-[#E8DED1] overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] animate-modal-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#81766D] hover:text-[#302A27] flex items-center justify-center shadow-xs transition-all duration-200 hover:rotate-90 active:scale-90"
        >
          <PiXBold className="text-base" />
        </button>

        {/* Cover Column */}
        <div className="w-full md:w-5/12 bg-stone-100 flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-[#E8DED1]">
          <div className="book-cover-wrap w-full max-w-[200px] aspect-[2/3] rounded-lg overflow-hidden shadow-book">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full fallback-jacket p-4 flex flex-col justify-between text-stone-100">
                <span className="text-[10px] font-mono text-amber-200/60 uppercase">{book.category}</span>
                <p className="font-serif text-sm font-bold text-amber-100">{book.title}</p>
                <p className="text-[11px] text-stone-300 italic">{book.author}</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="w-full md:w-7/12 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold text-burgundy bg-burgundy-faint px-2.5 py-0.5 rounded-full border border-burgundy/15">
                {book.category || 'General'}
              </span>
              <span className="text-xs text-[#81766D] font-mono">
                {book.publishYear}
              </span>
            </div>

            <h2 id="modal-book-title" className="font-serif text-2xl font-bold text-[#302A27] leading-snug">
              {book.title}
            </h2>

            <p className="text-xs text-[#81766D] font-medium mt-1">
              by <span className="text-[#302A27] font-semibold">{book.author}</span>
            </p>

            {/* Rating */}
            {book.averageRating > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="flex items-center text-amber-500 text-xs">
                  <PiStarFill />
                </div>
                <span className="text-xs font-bold text-[#302A27]">
                  {book.averageRating.toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-stone-400">
                  ({book.reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            {/* Tabs: Overview vs First Lines */}
            <div className="mt-4 pt-3 border-t border-[#E8DED1]">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`text-[11px] font-semibold pb-1 border-b-2 transition-all ${
                    activeTab === 'overview'
                      ? 'border-burgundy text-burgundy'
                      : 'border-transparent text-[#81766D] hover:text-[#302A27]'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('first-lines')}
                  className={`text-[11px] font-semibold pb-1 border-b-2 transition-all flex items-center gap-1 ${
                    activeTab === 'first-lines'
                      ? 'border-burgundy text-burgundy'
                      : 'border-transparent text-[#81766D] hover:text-[#302A27]'
                  }`}
                >
                  <PiSparkleBold className="text-amber-500 text-xs" />
                  <span>First Lines</span>
                </button>
              </div>

              {activeTab === 'overview' ? (
                <p className="text-xs text-[#302A27] leading-relaxed max-h-36 overflow-y-auto pr-1">
                  {book.description || `An essential title in the digital library collection. Explore full reader discussions and complete bibliographic metadata.`}
                </p>
              ) : (
                <div className="w-full">
                  <PageFlipPreview book={book} />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-[#E8DED1] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleToggle}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
                isSaved
                  ? 'bg-burgundy text-white hover:bg-[#63121E]'
                  : 'bg-white text-[#302A27] border border-stone-300 hover:bg-stone-50 hover:border-burgundy/30'
              }`}
            >
              {isSaved ? (
                <PiBookmarkSimpleFill
                  className={`text-sm text-amber-300 ${popping ? 'animate-bookmark-pop' : ''}`}
                />
              ) : (
                <PiBookmarkSimpleBold className="text-sm" />
              )}
              <span>{isSaved ? 'Saved to Shelf' : 'Save Book'}</span>
            </button>

            <Link
              to={`/books/details/${book._id}`}
              onClick={onClose}
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xs"
            >
              <span>Full Experience</span>
              <PiArrowRightBold className="text-xs transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
