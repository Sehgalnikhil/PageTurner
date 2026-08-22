import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PiBookOpenText, PiUserCircle, PiEyeBold, PiPencilSimpleBold, PiTrashBold, PiArticleMediumBold } from 'react-icons/pi';
import BookModal from './BookModal';

const BookSingleCard = ({ book }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      {/* Card Top: Year badge & Quick Modal Trigger */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            {book.publishYear}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            title="Quick Preview"
          >
            <PiArticleMediumBold className="text-sm" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex items-start gap-3 my-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <PiBookOpenText className="text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
              {book.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs font-medium">
              <PiUserCircle className="text-sm text-slate-400" />
              <span className="truncate">{book.author}</span>
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
