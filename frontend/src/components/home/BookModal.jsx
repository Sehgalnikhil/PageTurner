import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PiXBold, PiBookOpenText, PiUserCircle, PiCalendarBlank, PiIdentificationBadge, PiPencilSimple, PiTrashSimple } from 'react-icons/pi';

const BookModal = ({ book, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 shadow-modal border border-slate-200 relative flex flex-col gap-6"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200">
              <PiBookOpenText className="text-2xl" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold tracking-wide">
                Published {book.publishYear}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                {book.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <PiXBold className="text-lg" />
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm">
          <div className="flex items-center gap-2.5 text-slate-700">
            <PiUserCircle className="text-lg text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Author</span>
              <span className="font-semibold text-slate-800">{book.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700">
            <PiCalendarBlank className="text-lg text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Release Year</span>
              <span className="font-semibold text-slate-800">{book.publishYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700 sm:col-span-2">
            <PiIdentificationBadge className="text-lg text-slate-400 flex-shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block">Database Record ID</span>
              <code className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {book._id}
              </code>
            </div>
          </div>
        </div>

        {/* Book Overview / Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            "{book.title}" is an authorized entry in the library catalog by {book.author}. Complete metadata and tracking details are stored and managed through the REST API database backend.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/books/edit/${book._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <PiPencilSimple className="text-sm" />
              <span>Edit</span>
            </Link>
            <Link
              to={`/books/delete/${book._id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
            >
              <PiTrashSimple className="text-sm" />
              <span>Delete</span>
            </Link>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
