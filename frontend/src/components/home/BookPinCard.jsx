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
import { getBookCoverUrl } from '../../utils/imageHelper';

const BookPinCard = ({ book, index = 0, isFeatured = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [popping, setPopping] = useState(false);

  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  const isSaved = isBookSaved(book._id);
  const imageUrl = getBookCoverUrl(book.image, book.title, book.isbn);

  // Stagger fallback jacket heights naturally for books without image covers
  const fallbackHeight =
    index % 3 === 0 ? 'h-72' : index % 3 === 1 ? 'h-64' : 'h-80';

  const authorInitial = book.author ? book.author.trim().charAt(0).toUpperCase() : 'A';

  const handleCardClick = () => {
    navigate(`/books/details/${book._id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setPopping(true);
    toggleBook(book);
    setTimeout(() => setPopping(false), 400);
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
        className={`book-pin group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#861D2D] focus-visible:ring-offset-2 ${
          isFeatured
            ? 'bg-[#FFFDF9] border-[#D8C7B0] shadow-sm hover:border-[#861D2D]/40'
            : 'bg-white border-[#ECE5D9] shadow-2xs hover:border-[#D8CCBA]'
        }`}
      >
        {/* Curated Spotlight Banner: Fixed initial height, never expands on hover */}
        {isFeatured && (
          <div className="px-3.5 py-1.5 bg-[#861D2D] text-white flex items-center justify-between text-[10px] font-mono uppercase tracking-wider font-semibold rounded-t-[1.125rem]">
            <span className="flex items-center gap-1.5">
              <PiSparkleBold className="text-amber-300 text-xs" />
              <span>Curator&apos;s Choice</span>
            </span>
            <span className="opacity-80 text-[9px] font-normal">{book.category || 'Featured'}</span>
          </div>
        )}

        {/* Cover Artwork Container with natural aspect ratio & authentic spine depth */}
        <div className={`book-cover-wrap relative w-full overflow-hidden bg-[#F5F0E6] ${!isFeatured ? 'rounded-t-[1.125rem]' : ''}`}>
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={`Cover of ${book.title}`}
              onError={() => setImgError(true)}
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-auto block object-cover max-h-[420px] transition-transform duration-250 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            /* Fallback Cloth Book Jacket with varied natural proportions */
            <div className={`w-full ${fallbackHeight} fallback-jacket p-5 flex flex-col justify-between text-stone-100`}>
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

          {/* Restrained Description Overlay: Revealed smoothly on hover WITHOUT changing layout height */}
          {book.description && (
            <div className="absolute inset-x-0 bottom-0 p-3.5 pt-10 bg-gradient-to-t from-stone-950/92 via-stone-950/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none z-10">
              <p className="text-[11px] font-serif italic text-stone-200 line-clamp-3 leading-relaxed">
                &ldquo;{book.description}&rdquo;
              </p>
            </div>
          )}

          {/* Pinterest-Inspired Overlay with tactile microactions */}
          <div className="pin-actions-overlay absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-20 transition-opacity duration-200">
            {/* Top Bar: Quick Preview & Pin Studio on Left, Signature Pinterest "Save" Pill on Right */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <div className="flex items-center gap-1.5">
                <div className="relative group/preview">
                  <button
                    type="button"
                    onClick={handleQuickPreview}
                    title="Quick preview"
                    aria-label="Quick preview"
                    className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 shadow-md flex items-center justify-center transition-all duration-180 hover:scale-108 active:scale-92 border border-stone-200/80 backdrop-blur-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#861D2D] cursor-pointer"
                  >
                    <PiEyeBold className="text-sm" />
                  </button>
                  <span className="pointer-events-none absolute -bottom-7 left-0 whitespace-nowrap rounded-md bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-stone-100 opacity-0 transition-opacity duration-150 group-hover/preview:opacity-100 z-30 shadow-xs">
                    Quick preview
                  </span>
                </div>
              </div>

              {/* Signature Pinterest "Save" / "Saved" Pill Button */}
              <div className="relative group/bookmark">
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  title={isSaved ? 'Remove from shelf' : 'Save to shelf'}
                  aria-label={isSaved ? 'Saved to shelf' : 'Save to shelf'}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all duration-180 hover:scale-105 active:scale-95 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#861D2D] ${
                    isSaved
                      ? 'bg-[#292522] text-amber-300 border-amber-300/30'
                      : 'bg-[#861D2D] hover:bg-[#701826] text-white border-transparent'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <PiBookmarkSimpleFill
                        className={`text-xs text-amber-300 ${popping ? 'animate-spring-pop' : ''}`}
                      />
                      <span className="font-sans text-[11px] font-bold">Saved</span>
                    </>
                  ) : (
                    <>
                      <PiBookmarkSimpleBold className="text-xs" />
                      <span className="font-sans text-[11px] font-bold">Save</span>
                    </>
                  )}
                </button>
                <span className="pointer-events-none absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-stone-900/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-stone-100 opacity-0 transition-opacity duration-150 group-hover/bookmark:opacity-100 z-30 shadow-xs">
                  {isSaved ? 'On your shelf' : 'Save to shelf'}
                </span>
              </div>
            </div>

            {/* Bottom Bar: Ambient tag pills (Category & Rating) */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <span className="px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-stone-100 text-[10px] font-mono font-medium shadow-xs border border-white/10 tracking-wide">
                {book.category || 'Classic'}
              </span>

              {book.averageRating > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold shadow-xs border border-white/10">
                  <PiStarFill className="text-amber-400 text-xs" />
                  <span>{book.averageRating.toFixed(1)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Editorial Book Typography Information: Statically structured, ZERO layout shift on hover */}
        <div className="p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-[15px] sm:text-base font-bold text-[#292522] leading-snug tracking-tight group-hover:text-[#861D2D] transition-colors duration-200 line-clamp-2">
                {book.title}
              </h3>

              {isAdmin && (
                <div className="relative flex-shrink-0">
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
                      className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-40 animate-fade-in"
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

            {/* Pinterest-Style Author Attribution with Monogram Avatar */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-5 h-5 rounded-full bg-[#861D2D]/10 text-[#861D2D] font-serif text-[10px] font-bold flex items-center justify-center flex-shrink-0 border border-[#861D2D]/20">
                {authorInitial}
              </div>
              <p className="text-xs text-stone-600 font-serif italic truncate">
                by <span className="text-stone-800 font-medium not-italic">{book.author}</span>
              </p>
            </div>
          </div>

          {/* Footer Metadata: Consistent, fixed placement */}
          <div className="mt-3 pt-2.5 border-t border-[#ECE5D9]/80 flex items-center justify-between text-[11px] font-mono text-stone-500">
            <span className="flex items-center gap-1.5">
              <span>{book.publishYear}</span>
              {book.pageCount && (
                <>
                  <span className="text-stone-300">&bull;</span>
                  <span>{book.pageCount}p</span>
                </>
              )}
            </span>

            {book.averageRating > 0 && (
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <PiStarFill className="text-amber-500 text-xs" />
                <span>{book.averageRating.toFixed(1)}</span>
              </span>
            )}
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
