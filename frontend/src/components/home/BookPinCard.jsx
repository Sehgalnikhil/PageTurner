import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiEyeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiStarFill,
  PiDotsThreeVerticalBold,
  PiSparkleBold,
} from 'react-icons/pi';
import BookModal from './BookModal';
import { AuthContext } from '../../context/AuthContext';
import { ReadingListContext } from '../../context/ReadingListContext';

const BookPinCard = ({ book, index = 0, isFeatured = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [popping, setPopping] = useState(false);

  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  const isSaved = isBookSaved(book._id);
  const imageUrl = book.image
    ? book.image.startsWith('http')
      ? book.image
      : `http://localhost:5555${book.image}`
    : null;

  // Alternate organic micro-tilt (at most 0.38 deg)
  const tiltClass = index % 2 === 0 ? 'book-pin-tilt-right' : 'book-pin-tilt-left';

  const handleCardClick = () => {
    navigate(`/books/details/${book._id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setPopping(true);
    toggleBook(book);
    setTimeout(() => setPopping(false), 450);
  };

  const handleQuickPreview = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  return (
    <>
      <article
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${book.title} by ${book.author}`}
        className={`book-pin group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 ${tiltClass} ${
          isFeatured
            ? 'bg-[#FCFAF7] border-amber-800/20 shadow-md ring-1 ring-amber-700/10'
            : 'bg-white border-[#ECE5D9] shadow-sm hover:border-[#D8CCBA]'
        }`}
      >
        {/* Featured Curator Spotlight Banner */}
        {isFeatured && (
          <div className="px-3.5 py-1.5 bg-burgundy text-white flex items-center justify-between text-[10px] font-mono uppercase tracking-wider font-semibold">
            <span className="flex items-center gap-1">
              <PiSparkleBold className="text-amber-300 text-xs" />
              <span>Curator&apos;s Choice</span>
            </span>
            <span className="opacity-80">{book.category || 'Featured'}</span>
          </div>
        )}

        {/* Cover Artwork Container with natural cover proportion */}
        <div className="book-cover-wrap relative w-full overflow-hidden bg-[#F5F0E6]">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={`Cover of ${book.title}`}
              onError={() => setImgError(true)}
              className="w-full h-auto block object-cover max-h-[500px] transition-transform duration-350 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            /* Fallback Cloth Book Jacket */
            <div className="w-full h-64 fallback-jacket p-5 flex flex-col justify-between text-stone-100">
              <div className="border border-amber-200/20 p-4 h-full flex flex-col justify-between rounded-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-200/70 block mb-2 font-mono">
                    {book.category || 'Literary Work'}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-amber-50 leading-tight">
                    {book.title}
                  </h4>
                </div>
                <div>
                  <p className="text-xs text-amber-100/80 italic">by {book.author}</p>
                  <span className="text-[10px] text-amber-200/50 font-mono mt-1 block">
                    {book.publishYear}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pinterest-Inspired Overlay with tactile microactions */}
          <div className="pin-actions-overlay absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-10 transition-opacity duration-250">
            {/* Top Bar: Quick Preview on Left, Floating Bookmark on Right */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <div className="relative group/preview">
                <button
                  type="button"
                  onClick={handleQuickPreview}
                  title="Quick preview"
                  aria-label="Quick preview"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2]/95 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 border border-[#ECE5D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
                >
                  <PiEyeBold className="text-sm sm:text-base" />
                </button>
                <span className="pointer-events-none absolute -bottom-7 left-0 whitespace-nowrap rounded-md bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-stone-100 opacity-0 transition-opacity duration-150 group-hover/preview:opacity-100 z-20 shadow-xs">
                  Quick preview
                </span>
              </div>

              {/* Floating Bookmark Button */}
              <div className="relative group/bookmark">
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  title={isSaved ? 'Remove from shelf' : 'Save to shelf'}
                  aria-label={isSaved ? 'Saved to shelf' : 'Save to shelf'}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2]/95 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 border border-[#ECE5D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy ${
                    isSaved ? 'text-burgundy' : 'text-stone-700 hover:text-burgundy'
                  }`}
                >
                  {isSaved ? (
                    <PiBookmarkSimpleFill
                      className={`text-sm sm:text-base ${popping ? 'animate-spring-pop' : ''}`}
                    />
                  ) : (
                    <PiBookmarkSimpleBold className="text-sm sm:text-base" />
                  )}
                </button>
                <span className="pointer-events-none absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-stone-100 opacity-0 transition-opacity duration-150 group-hover/bookmark:opacity-100 z-20 shadow-xs">
                  {isSaved ? 'On your shelf' : 'Save to shelf'}
                </span>
              </div>
            </div>

            {/* Bottom Bar: Ambient tag pills (Category & Rating) */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <span className="px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-medium shadow-xs">
                {book.category || 'Classic'}
              </span>

              {book.averageRating > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-mono font-bold shadow-xs">
                  <PiStarFill className="text-amber-400 text-xs" />
                  <span>{book.averageRating.toFixed(1)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Book Typography Information */}
        <div className="p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug tracking-tight group-hover:text-burgundy transition-colors duration-200">
                {book.title}
              </h3>

              {isAdmin && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleMenuClick}
                    className="p-1 -mr-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                    title="Admin options"
                    aria-label="Admin options"
                  >
                    <PiDotsThreeVerticalBold className="text-base" />
                  </button>

                  {/* Admin Dropdown */}
                  {showMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-30 animate-fade-in"
                    >
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 transition-colors"
                      >
                        <PiPencilSimpleBold className="text-sm" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        <PiTrashBold className="text-sm" />
                        <span>Delete</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-stone-600 italic font-serif mt-1">
              by <span className="text-stone-800 font-medium not-italic">{book.author}</span>
            </p>

            {/* Featured Book Synopsis Snippet */}
            {isFeatured && book.description && (
              <p className="mt-2.5 text-xs text-stone-600 font-serif line-clamp-3 leading-relaxed border-t border-stone-200/80 pt-2.5">
                {book.description}
              </p>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
            <span>{book.publishYear}</span>
            {book.pageCount && <span>{book.pageCount} pages</span>}
          </div>
        </div>
      </article>

      {/* Quick Preview Modal */}
      {showModal && (
        <BookModal book={book} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default BookPinCard;
