import React, { useState, useContext, useRef } from 'react';
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
import { bookService } from '../../services/api';

const BookPinCard = ({ book, index = 0, isFeatured = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [popping, setPopping] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  const isSaved = isBookSaved(book._id);
  const imageUrl = getBookCoverUrl(book.image, book.title, book.isbn);

  // Stagger fallback jacket heights naturally for books without image covers
  const fallbackHeight =
    index % 3 === 0 ? 'h-72' : index % 3 === 1 ? 'h-64' : 'h-80';

  const authorInitial = book.author ? book.author.trim().charAt(0).toUpperCase() : 'A';

  // 3D Parallax Tilt with Cursor-Tracking Specular Gleam
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 7.5; // Max 7.5 deg
    const rotateY = ((x - centerX) / centerX) * 7.5;
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`,
      '--sheen-x': `${sheenX.toFixed(1)}%`,
      '--sheen-y': `${sheenY.toFixed(1)}%`,
    });
  };

  const handleMouseEnter = () => {
    // 0ms hover prefetching
    bookService.prefetchById(book._id);
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    });
  };

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
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${book.title} by ${book.author}`}
        className={`book-pin group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D263B] focus-visible:ring-offset-2 relative transition-[box-shadow] duration-200 ${
          isFeatured
            ? 'bg-[#FFFDFA] border-[#D9A9A6]/60 shadow-card hover:border-[#8D263B]'
            : 'bg-[#FFFDFA] border-[#E8DED1] shadow-subtle hover:border-[#D9A9A6]'
        }`}
      >
        {/* Dynamic Specular Sheen Layer that follows cursor */}
        <div
          className="absolute inset-0 rounded-[0.875rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
          style={{
            background:
              'radial-gradient(circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)',
          }}
        />
        {/* Curated Spotlight Banner: Fixed initial height, never expands on hover */}
        {isFeatured && (
          <div className="px-3.5 py-1.5 bg-[#8D263B] text-[#FFFDF9] flex items-center justify-between text-[10.5px] font-sans font-semibold uppercase tracking-wider rounded-t-[0.875rem]">
            <span className="flex items-center gap-1.5">
              <PiSparkleBold className="text-[#E8C4A0] text-xs" />
              <span>Curator&apos;s Pick</span>
            </span>
            <span className="text-[#E8C4A0] text-[9.5px] font-medium tracking-widest">{book.category || 'Featured'}</span>
          </div>
        )}

        {/* Cover Artwork Container with natural aspect ratio & authentic spine depth */}
        <div className={`book-cover-wrap relative w-full overflow-hidden bg-[#F0E9DE] ${!isFeatured ? 'rounded-t-[0.875rem]' : ''}`}>
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={`Cover of ${book.title}`}
              onError={() => setImgError(true)}
              loading={index < 4 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-auto block object-cover max-h-[420px] transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            /* Fallback Cloth Book Jacket with varied natural proportions */
            <div className={`w-full ${fallbackHeight} fallback-jacket p-5 flex flex-col justify-between text-stone-100`}>
              <div className="border border-[#C6A16B]/30 p-4 h-full flex flex-col justify-between rounded-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A16B]/80 block mb-2 font-mono">
                    {book.category || 'Literary Work'}
                  </span>
                  <h4 className="font-serif text-lg font-medium text-[#FFFDFA] leading-tight">
                    {book.title}
                  </h4>
                </div>
                <div>
                  <p className="text-xs text-[#E8DED1] italic font-serif">by {book.author}</p>
                  <span className="text-[10px] text-[#C6A16B]/60 font-mono mt-1 block">
                    {book.publishYear}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Restrained Description Overlay: Revealed smoothly on hover WITHOUT changing layout height */}
          {book.description && (
            <div className="absolute inset-x-0 bottom-0 p-3.5 pt-10 bg-gradient-to-t from-[#18151B]/95 via-[#18151B]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none z-10">
              <p className="text-[11px] font-serif italic text-[#EDE4D8] line-clamp-3 leading-relaxed">
                &ldquo;{book.description}&rdquo;
              </p>
            </div>
          )}

          {/* Pinterest-Inspired Overlay with tactile microactions */}
          <div className="pin-actions-overlay absolute inset-0 p-3 flex flex-col justify-between pointer-events-none z-20 transition-opacity duration-200">
            {/* Top Bar: Quick Preview & Save Pill */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <div className="flex items-center gap-1.5">
                <div className="relative group/preview">
                  <button
                    type="button"
                    onClick={handleQuickPreview}
                    title="Quick preview"
                    aria-label="Quick preview"
                    className="w-8 h-8 rounded-full bg-[#FFFDFA]/95 hover:bg-[#FFFDFA] text-[#302A27] shadow-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 border border-[#E8DED1] backdrop-blur-xs cursor-pointer"
                  >
                    <PiEyeBold className="text-sm" />
                  </button>
                  <span className="pointer-events-none absolute -bottom-7 left-0 whitespace-nowrap rounded-md bg-[#302A27] px-2 py-0.5 text-[10px] font-medium text-[#FFFDFA] opacity-0 transition-opacity duration-150 group-hover/preview:opacity-100 z-30 shadow-xs">
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 transition-all duration-150 cute-pill-hover border cursor-pointer ${
                    popping ? 'scale-110 rotate-[-3deg]' : ''
                  } ${
                    isSaved
                      ? 'bg-[#302A27] text-[#C6A16B] border-[#C6A16B]/30'
                      : 'bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] border-transparent'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <PiBookmarkSimpleFill
                        className={`text-xs text-[#C6A16B] ${popping ? 'animate-bookmark-pop' : ''}`}
                      />
                      <span className="font-sans text-[11px] font-medium">Saved</span>
                    </>
                  ) : (
                    <>
                      <PiBookmarkSimpleBold className="text-xs" />
                      <span className="font-sans text-[11px] font-medium">Save</span>
                    </>
                  )}
                </button>
                <span className="pointer-events-none absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-[#302A27] px-2 py-0.5 text-[10px] font-medium text-[#FFFDFA] opacity-0 transition-opacity duration-150 group-hover/bookmark:opacity-100 z-30 shadow-xs">
                  {isSaved ? 'On your shelf' : 'Save to shelf'}
                </span>
              </div>
            </div>

            {/* Bottom Bar: Category & Rating */}
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#FFFDF9] text-[10px] font-sans font-medium uppercase tracking-wider shadow-xs border border-white/15">
                {book.category || 'Classic'}
              </span>

              {book.averageRating > 0 && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#F4D086] text-[10.5px] font-sans font-semibold shadow-xs border border-white/15">
                  <PiStarFill className="text-[#F4D086] text-xs" />
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
              <h3 className="font-serif text-[17px] sm:text-[18px] font-semibold text-[#221B16] leading-snug tracking-normal group-hover:text-[#8D263B] transition-colors duration-200 line-clamp-2">
                {book.title}
              </h3>

              {isAdmin && (
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleMenuClick}
                    className="p-1 -mr-1 text-[#81766D] hover:text-[#302A27] hover:bg-[#F0E9DE] rounded-md transition-colors cursor-pointer"
                    title="Admin options"
                    aria-label="Admin options"
                  >
                    <PiDotsThreeVerticalBold className="text-base" />
                  </button>

                  {/* Admin Dropdown */}
                  {showMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-1 w-32 bg-[#FFFDFA] rounded-xl shadow-card border border-[#E8DED1] py-1.5 z-40 animate-modal-in"
                    >
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#302A27] hover:bg-[#F7F3EC] transition-colors"
                      >
                        <PiPencilSimpleBold className="text-sm" />
                        <span>Edit</span>
                      </Link>
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#8D263B] hover:bg-[#8D263B]/10 transition-colors"
                      >
                        <PiTrashBold className="text-sm" />
                        <span>Delete</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Author Attribution */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-5 h-5 rounded-full bg-[#F4EDE2] text-[#8D263B] font-serif text-[11px] font-bold flex items-center justify-center flex-shrink-0 border border-[#DECDBA] shadow-2xs">
                {authorInitial}
              </div>
              <p className="text-[12.5px] font-sans text-[#786C62] truncate">
                <span className="font-serif italic text-[11.5px] text-[#9A8D82] mr-1">by</span>
                <span className="font-medium text-[#332922] group-hover:text-[#8D263B] transition-colors">{book.author}</span>
              </p>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-3.5 pt-2.5 border-t border-[#EFE8DC] flex items-center justify-between text-[11.5px] font-sans text-[#7A6D63]">
            <span className="flex items-center gap-1.5 font-medium">
              <span>{book.publishYear}</span>
              {book.pageCount && (
                <>
                  <span className="text-[#C8BCAD]">&bull;</span>
                  <span>{book.pageCount}p</span>
                </>
              )}
            </span>

            {book.averageRating > 0 && (
              <span className="flex items-center gap-1 font-sans text-[11.5px] font-semibold text-[#2C211A] bg-[#F7F2E8] px-2 py-0.5 rounded-full border border-[#E8DFC9] shadow-2xs">
                <PiStarFill className="text-[#C69B4C] text-[11px]" />
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
