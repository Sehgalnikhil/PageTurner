import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import {
  PiBookOpenTextBold,
  PiUserBold,
  PiCalendarBold,
  PiClockBold,
  PiIdentificationBadgeBold,
  PiPencilSimpleBold,
  PiTrashBold
} from 'react-icons/pi';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/books/${id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {loading ? (
          <Spinner message="Loading book details..." />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8">
            {/* Header / Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <PiBookOpenTextBold className="text-2xl" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide mb-1.5">
                    Published in {book.publishYear}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {book.title}
                  </h1>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    By <span className="text-slate-800">{book.author}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start">
                <Link
                  to={`/books/edit/${book._id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <PiPencilSimpleBold className="text-sm" />
                  <span>Edit</span>
                </Link>
                <Link
                  to={`/books/delete/${book._id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                >
                  <PiTrashBold className="text-sm" />
                  <span>Delete</span>
                </Link>
              </div>
            </div>

            {/* Structured Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <PiIdentificationBadgeBold className="text-sm" />
                  <span>Database ID</span>
                </div>
                <code className="text-xs font-mono text-slate-800 select-all">
                  {book._id}
                </code>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <PiUserBold className="text-sm" />
                  <span>Author</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {book.author}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <PiCalendarBold className="text-sm" />
                  <span>Publish Year</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {book.publishYear}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <PiClockBold className="text-sm" />
                  <span>Created At</span>
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {formatDate(book.createdAt)}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  <PiClockBold className="text-sm" />
                  <span>Last Modified</span>
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {formatDate(book.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShowBook;
