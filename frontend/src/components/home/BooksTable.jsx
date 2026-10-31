import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  PiEyeBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiBookOpenTextBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiStarFill,
} from 'react-icons/pi';
import { AuthContext } from '../../context/AuthContext';
import { ReadingListContext } from '../../context/ReadingListContext';

const getCategoryBadgeClass = (cat = '') => {
  switch (cat.toLowerCase()) {
    case 'fiction':
      return 'bg-burgundy-faint text-burgundy border-burgundy/20';
    case 'sci-fi':
      return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'non-fiction':
      return 'bg-sage-faint text-sage-dark border-sage/20';
    case 'biography':
      return 'bg-stone-100 text-[#302A27] border-[#E8DED1]';
    default:
      return 'bg-stone-100 text-[#302A27] border-[#E8DED1]';
  }
};

const BooksTable = ({ books = [] }) => {
  const { isAdmin } = useContext(AuthContext);
  const { isBookSaved, toggleBook } = useContext(ReadingListContext);

  if (!books.length) return null;

  return (
    <div className="editorial-sheet overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E8DED1] bg-[#F0E9DE] text-[11px] font-semibold text-[#81766D] uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-5 w-12 text-center">#</th>
              <th scope="col" className="py-3.5 px-5">Book Title</th>
              <th scope="col" className="py-3.5 px-5">Author</th>
              <th scope="col" className="py-3.5 px-5">Category</th>
              <th scope="col" className="py-3.5 px-5 text-center">Year</th>
              <th scope="col" className="py-3.5 px-5 text-center">Rating</th>
              <th scope="col" className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm text-[#302A27] bg-white">
            {books.map((book, index) => {
              const isSaved = isBookSaved(book._id);
              return (
                <tr
                  key={book._id}
                  className="hover:bg-[#FAF7F2] transition-colors group"
                >
                  {/* Index */}
                  <td className="py-3.5 px-5 text-center font-mono text-xs text-stone-400">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FAF4EA] text-[#302A27] border border-[#E8DED1] flex items-center justify-center flex-shrink-0 group-hover:border-burgundy/30 transition-transform group-hover:scale-110 group-hover:rotate-[-4deg]">
                        <PiBookOpenTextBold className="text-base text-burgundy" />
                      </div>
                      <div>
                        <Link
                          to={`/books/details/${book._id}`}
                          className="font-serif font-bold text-[#302A27] hover:text-burgundy block transition-colors leading-snug"
                        >
                          {book.title}
                        </Link>
                        <span className="text-[11px] text-stone-400 font-mono">
                          #{book._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-5 text-[#302A27] text-xs font-medium">
                    {book.author}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border transition-transform group-hover:scale-105 ${getCategoryBadgeClass(book.category)}`}>
                      {book.category || 'General'}
                    </span>
                  </td>

                  {/* Publish Year */}
                  <td className="py-3.5 px-5 text-center font-mono text-xs text-[#81766D]">
                    {book.publishYear}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-5 text-center">
                    {book.averageRating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <PiStarFill className="text-amber-500 text-xs" />
                        <span>{book.averageRating.toFixed(1)}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">&mdash;</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => toggleBook(book)}
                        title={isSaved ? 'Remove from shelf' : 'Save to shelf'}
                        className={`p-1.5 rounded-lg transition-all cute-press ${
                          isSaved
                            ? 'text-burgundy bg-burgundy-faint'
                            : 'text-stone-400 hover:text-burgundy hover:bg-stone-100'
                        }`}
                      >
                        {isSaved ? <PiBookmarkSimpleFill className="text-base animate-jelly-pop" /> : <PiBookmarkSimpleBold className="text-base" />}
                      </button>

                      <Link
                        to={`/books/details/${book._id}`}
                        title="View Details"
                        className="p-1.5 rounded-lg text-[#81766D] hover:text-burgundy hover:bg-stone-100 transition-colors"
                      >
                        <PiEyeBold className="text-base" />
                      </Link>

                      {isAdmin && (
                        <>
                          <Link
                            to={`/books/edit/${book._id}`}
                            title="Edit Book"
                            className="p-1.5 rounded-lg text-[#81766D] hover:text-[#302A27] hover:bg-stone-100 transition-colors"
                          >
                            <PiPencilSimpleBold className="text-base" />
                          </Link>
                          <Link
                            to={`/books/delete/${book._id}`}
                            title="Delete Book"
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <PiTrashBold className="text-base" />
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksTable;
