import React from 'react';
import { Link } from 'react-router-dom';
import { PiEyeBold, PiPencilSimpleBold, PiTrashBold, PiBookOpenText } from 'react-icons/pi';

const BooksTable = ({ books = [] }) => {
  if (!books.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-4 sm:px-6 w-16 text-center">#</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Book Title</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6">Author</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-center">Published</th>
              <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {books.map((book, index) => (
              <tr
                key={book._id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Index */}
                <td className="py-4 px-4 sm:px-6 text-center font-mono text-xs text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </td>

                {/* Title */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <PiBookOpenText className="text-base" />
                    </div>
                    <div>
                      <Link
                        to={`/books/details/${book._id}`}
                        className="font-semibold text-slate-900 hover:text-slate-700 block transition-colors"
                      >
                        {book.title}
                      </Link>
                      <span className="text-xs text-slate-400 font-mono">
                        {book._id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Author */}
                <td className="py-4 px-4 sm:px-6 font-medium text-slate-600">
                  {book.author}
                </td>

                {/* Publish Year */}
                <td className="py-4 px-4 sm:px-6 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                    {book.publishYear}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <Link
                      to={`/books/details/${book._id}`}
                      title="View Details"
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <PiEyeBold className="text-base" />
                    </Link>
                    <Link
                      to={`/books/edit/${book._id}`}
                      title="Edit Book"
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <PiPencilSimpleBold className="text-base" />
                    </Link>
                    <Link
                      to={`/books/delete/${book._id}`}
                      title="Delete Book"
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <PiTrashBold className="text-base" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksTable;
