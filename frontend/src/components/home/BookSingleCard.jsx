import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PiBookOpenText, PiUserCircle, PiEyeBold, PiPencilSimpleBold, PiTrashBold, PiArticleMediumBold, PiStarFill } from 'react-icons/pi';
import BookModal from './BookModal';
import { AuthContext } from '../../context/AuthContext';

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  
  const isAdmin = user && user.role === 'admin';
  const imageUrl = book.image ? `http://localhost:5555${book.image}` : null;

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Card Top: Year badge & Category */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              {book.publishYear}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              {book.category || 'Uncategorized'}
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            title="Quick Preview"
          >
            <PiArticleMediumBold className="text-sm" />
          </button>
        </div>

        {/* Image & Title */}
        <div className="flex flex-col gap-3 my-2">
          {imageUrl ? (
            <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
              <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-48 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-slate-100 transition-colors">
              <PiBookOpenText className="text-4xl" />
            </div>
          )}

          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
              {book.title}
            </h3>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <PiUserCircle className="text-sm text-slate-400" />
                <span className="truncate">{book.author}</span>
              </div>
              {book.averageRating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                  <PiStarFill />
                  <span>{book.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Bottom: Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          ID: {book._id.slice(-6)}
        </span>

        <div className="flex items-center gap-1">
          <Link
            to={`/books/details/${book._id}`}
            title="View Details"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <PiEyeBold className="text-base" />
          </Link>
          {isAdmin && (
            <>
              <Link
                to={`/books/edit/${book._id}`}
                title="Edit"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <PiPencilSimpleBold className="text-base" />
              </Link>
              <Link
                to={`/books/delete/${book._id}`}
                title="Delete"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <PiTrashBold className="text-base" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Modal View */}
      {showModal && (
        <BookModal book={book} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default BookSingleCard;
