import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PiEyeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiStarFill,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiBookOpenTextBold,
} from 'react-icons/pi';
import BookModal from './BookModal';
import { AuthContext } from '../../context/AuthContext';
import { ReadingListContext } from '../../context/ReadingListContext';
import { getBookCoverUrl } from '../../utils/imageHelper';

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  const isSaved = isBookSaved(book._id);
  const imageUrl = getBookCoverUrl(book.image, book.title, book.isbn);

  return (
    <>
      <div
        onClick={() => navigate(`/books/details/${book._id}`)}
        className="editorial-card p-4 flex flex-col justify-between group cursor-pointer hover:border-stone-300 hover:shadow-paper-hover transition-all duration-300"
      >
        <div>
          {/* Top header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              {book.publishYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBook(book);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSaved
                    ? 'text-burgundy bg-burgundy-faint'
                    : 'text-stone-400 hover:text-burgundy hover:bg-stone-100'
                }`}
                title={isSaved ? 'Saved to shelf' : 'Save to shelf'}
              >
                {isSaved ? <PiBookmarkSimpleFill className="text-base" /> : <PiBookmarkSimpleBold className="text-base" />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                title="Quick preview"
              >
                <PiEyeBold className="text-base" />
              </button>
            </div>
          </div>

          {/* Book Cover */}
          <div className="book-cover-wrap w-full h-52 rounded-lg overflow-hidden mb-3 bg-stone-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full fallback-jacket p-4 flex flex-col justify-between text-stone-100">
                <span className="text-[10px] font-mono text-amber-200/60 uppercase">{book.category}</span>
                <p className="font-serif text-sm font-bold text-amber-100">{book.title}</p>
                <p className="text-[11px] text-stone-300 italic">{book.author}</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">
              {book.category || 'General'}
            </span>
            <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-burgundy leading-snug line-clamp-1 transition-colors">
              {book.title}
            </h3>
            <p className="text-xs text-stone-600 truncate mt-0.5 font-medium">by {book.author}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
          {book.averageRating > 0 ? (
            <span className="flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
              <PiStarFill className="text-amber-500 text-xs" />
              {book.averageRating.toFixed(1)}
            </span>
          ) : (
            <span className="text-stone-400 text-[11px]">No reviews</span>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Link
                to={`/books/edit/${book._id}`}
                className="p-1 rounded text-stone-400 hover:text-stone-800"
                title="Edit"
              >
                <PiPencilSimpleBold />
              </Link>
              <Link
                to={`/books/delete/${book._id}`}
                className="p-1 rounded text-stone-400 hover:text-red-600"
                title="Delete"
              >
                <PiTrashBold />
              </Link>
            </div>
          )}
        </div>
      </div>

      {showModal && <BookModal book={book} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default BookSingleCard;
