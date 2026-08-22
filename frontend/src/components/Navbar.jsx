import React from 'react';
import { Link } from 'react-router-dom';
import { PiBooks, PiPlusBold } from 'react-icons/pi';

const Navbar = ({ totalBooks = 0 }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
              <PiBooks className="text-2xl" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                PageTurner
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Book Management System
              </span>
            </div>
          </Link>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Total Books Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{totalBooks} {totalBooks === 1 ? 'Book' : 'Books'} in Library</span>
            </div>

            {/* Add Book CTA */}
            <Link
              to="/books/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
            >
              <PiPlusBold className="text-sm" />
              <span>Add Book</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
