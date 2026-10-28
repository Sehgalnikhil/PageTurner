import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiMagnifyingGlassBold,
  PiXBold,
  PiBookOpenBold,
  PiBookmarkSimpleBold,
  PiSparkleBold,
  PiTagBold,
  PiPlusBold,
  PiArrowRightBold,
  PiSpeakerHighBold,
  PiMoonBold,
  PiSunDimBold,
} from 'react-icons/pi';
import { ThemeContext } from '../../context/ThemeContext';
import { ReadingListContext } from '../../context/ReadingListContext';
import { bookService } from '../../services/api';

const CommandKModal = ({ isOpen, onClose, books = [], onOpenBookplate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [catalogBooks, setCatalogBooks] = useState(books);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { theme, cycleTheme } = useContext(ThemeContext);
  const { setIsDrawerOpen } = useContext(ReadingListContext);

  useEffect(() => {
    if (books.length > 0) {
      setCatalogBooks(books);
    } else if (isOpen) {
      bookService.getAll({ limit: 60 })
        .then((res) => {
          if (res?.data?.data) {
            setCatalogBooks(res.data.data);
          }
        })
        .catch(() => {});
    }
  }, [books, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Standard quick actions available in the command palette
  const quickActions = [
    {
      id: 'action-blind-date',
      title: 'Draw Mystery Parcel (Blind Date)',
      subtitle: 'Crack the wax seal and unwrap a fate-chosen volume',
      icon: PiSparkleBold,
      badge: 'Interactive',
      perform: () => {
        onClose();
        const el = document.getElementById('blind-date-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
    },
    {
      id: 'action-open-shelf',
      title: 'Open My Reading Shelf',
      subtitle: 'View saved books, status badges, and reading telemetry',
      icon: PiBookmarkSimpleBold,
      badge: 'Library',
      perform: () => {
        onClose();
        setIsDrawerOpen(true);
      },
    },
    {
      id: 'action-bookplate',
      title: 'Custom "Ex Libris" Bookplate Generator',
      subtitle: 'Design and print personalized vintage library bookplates',
      icon: PiTagBold,
      badge: 'Print Studio',
      perform: () => {
        onClose();
        if (onOpenBookplate) onOpenBookplate();
      },
    },
    {
      id: 'action-cycle-theme',
      title: `Switch Atmosphere (Current: ${theme.toUpperCase()})`,
      subtitle: 'Cycle between Ivory Vellum, Candlelight Sepia, and Midnight Library',
      icon: theme === 'midnight' ? PiMoonBold : PiSunDimBold,
      badge: 'Theme',
      perform: () => {
        cycleTheme();
      },
    },
    {
      id: 'action-add-book',
      title: 'Catalog a New Story',
      subtitle: 'Add a new publication to the digital journal archive',
      icon: PiPlusBold,
      badge: 'Admin',
      perform: () => {
        onClose();
        navigate('/books/create');
      },
    },
  ];

  // Filter books matching search
  const filteredBooks = query.trim()
    ? (catalogBooks || []).filter((b) => {
        const q = query.toLowerCase();
        return (
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
        );
      }).slice(0, 7)
    : [];

  // Filter actions matching search
  const filteredActions = query.trim()
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  // Flattened searchable list for keyboard navigation
  const totalItems = [...filteredBooks.map((b) => ({ type: 'book', item: b })), ...filteredActions.map((a) => ({ type: 'action', item: a }))];

  // Keyboard navigation listener (Arrow Up / Down / Enter / Escape)
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems.length) % Math.max(1, totalItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = totalItems[selectedIndex];
      if (current) {
        if (current.type === 'book') {
          onClose();
          navigate(`/books/details/${current.item._id}`);
        } else if (current.type === 'action') {
          current.item.perform();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF7F2] text-stone-900 rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200 bg-white">
          <PiMagnifyingGlassBold className="text-xl text-stone-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search books, authors, genres, or actions..."
            className="w-full bg-transparent border-none text-base sm:text-lg font-serif text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
            >
              <PiXBold />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-medium text-stone-500 uppercase">
              ESC
            </span>
          )}
        </div>

        {/* Results Body */}
        <div ref={listRef} className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* Matching Books Section */}
          {filteredBooks.length > 0 && (
            <div>
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-stone-400 block mb-1">
                Books in Archive ({filteredBooks.length})
              </span>
              <div className="space-y-1">
                {filteredBooks.map((book, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={book._id}
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate(`/books/details/${book._id}`);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-burgundy text-white shadow-xs'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-8 h-11 object-cover rounded-md flex-shrink-0 shadow-2xs border border-stone-200/50"
                          />
                        ) : (
                          <div className="w-8 h-11 bg-stone-300 rounded-md flex items-center justify-center flex-shrink-0">
                            <PiBookOpenBold className="text-stone-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className={`font-serif text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                            {book.title}
                          </p>
                          <p className={`text-xs truncate ${isSelected ? 'text-amber-200' : 'text-stone-500 font-serif italic'}`}>
                            by {book.author} &bull; {book.publishYear}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-200/70 text-stone-600'
                      }`}>
                        {book.category || 'Fiction'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Section */}
          {filteredActions.length > 0 && (
            <div>
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider font-bold text-stone-400 block mb-1">
                Quick Commands &amp; Navigation
              </span>
              <div className="space-y-1">
                {filteredActions.map((action, aIdx) => {
                  const itemIndex = filteredBooks.length + aIdx;
                  const isSelected = selectedIndex === itemIndex;
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={action.perform}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-burgundy text-white shadow-xs'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-white/20 text-amber-200' : 'bg-stone-200 text-stone-700'
                        }`}>
                          <Icon className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-serif text-sm font-semibold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                            {action.title}
                          </p>
                          <p className={`text-xs truncate ${isSelected ? 'text-amber-100/90' : 'text-stone-500'}`}>
                            {action.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-200/70 text-stone-600'
                      }`}>
                        {action.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredBooks.length === 0 && filteredActions.length === 0 && (
            <div className="py-12 text-center text-stone-400">
              <PiBookOpenBold className="text-4xl mx-auto mb-2 opacity-50" />
              <p className="font-serif text-sm">No stories or actions matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-stone-400 mt-1 font-mono">Try searching by genre, author, or keyword</p>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-2.5 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
          <div className="flex items-center gap-3">
            <span><strong className="text-stone-800">↑↓</strong> Navigate</span>
            <span><strong className="text-stone-800">↵</strong> Select</span>
            <span><strong className="text-stone-800">ESC</strong> Close</span>
          </div>
          <span className="text-burgundy font-semibold">PageTurner Omnisearch</span>
        </div>
      </div>
    </div>
  );
};

export default CommandKModal;
