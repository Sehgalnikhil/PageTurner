import React from 'react';
import { PiXBold, PiArrowRightBold, PiCaretLeftBold, PiCaretRightBold, PiPlusBold, PiCaretRight } from 'react-icons/pi';
import { Link } from 'react-router-dom';

// Curated collections with photographic backgrounds matching the editorial aesthetic
const COLLECTIONS_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    subtitle: 'Gothic obsession & intellectual desire.',
    keywords: ['dorian', 'crime', 'gatsby', 'catcher'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#1C1714]',
    textColor: 'text-white',
    subColor: 'text-[#D5C9B8]',
    borderStyle: 'border-[#3D352E]',
    bgImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780141439570-M.jpg', // Dorian Gray
    ],
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Fiction',
    subtitle: 'Dystopias & cosmic curiosity.',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit'],
    fallbackCategory: 'Sci-Fi',
    accentBg: 'bg-[#151D24]',
    textColor: 'text-white',
    subColor: 'text-[#B0C3D4]',
    borderStyle: 'border-[#323D48]',
    bgImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg', // Dune
    ],
  },
  {
    id: 'comforting-stories',
    title: 'Quiet, Comforting Stories',
    subtitle: 'Solace, warmth & gentle worlds.',
    keywords: ['pride', 'hobbit', 'alchemist', 'fellowship'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#EDE4D5]',
    textColor: 'text-[#2C241E]',
    subColor: 'text-[#6D5E51]',
    borderStyle: 'border-[#E2D5C3]',
    bgImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg', // Pride and Prejudice
    ],
  },
  {
    id: 'perspective-shifts',
    title: 'Perspective Shifts',
    subtitle: 'Philosophy & human experience.',
    keywords: ['sapiens', 'meaning', 'mockingbird', 'thinking'],
    fallbackCategory: 'Non-Fiction',
    accentBg: 'bg-[#241F1A]',
    textColor: 'text-white',
    subColor: 'text-[#C9BBAA]',
    borderStyle: 'border-[#423932]',
    bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg', // Sapiens
    ],
  },
  {
    id: 'late-night',
    title: 'Late-Night Reads',
    subtitle: 'Page-turners read past midnight.',
    keywords: ['gatsby', 'alchemist', 'dorian', 'dune'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#26171E]',
    textColor: 'text-white',
    subColor: 'text-[#CCA8B5]',
    borderStyle: 'border-[#44303B]',
    bgImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', // The Great Gatsby
    ],
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth & Craft',
    subtitle: 'Habits, mastery & clearer thinking.',
    keywords: ['atomic habits', 'thinking, fast', 'educated', 'steve jobs'],
    fallbackCategory: 'Non-Fiction',
    accentBg: 'bg-[#18241B]',
    textColor: 'text-white',
    subColor: 'text-[#A9C4B0]',
    borderStyle: 'border-[#334437]',
    bgImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg', // Atomic Habits
    ],
  },
];

const CuratedCollectionTiles = ({ selectedMood, onSelectMood, onClearMood, totalBooks = 21 }) => {
  return (
    <div className="mb-10">
      {/* Section Header Row matching the user reference screenshot */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-lg sm:text-[21px] font-bold text-[#1C1917] tracking-tight">
            Curated Atmospheres
          </h2>
          <span className="text-xs sm:text-sm text-[#8C827A] font-sans">
            &bull; Image-led collections
          </span>
        </div>

        {/* Right action group matching screenshot: + Add Story, 21 works cataloged, < > navigation */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedMood && (
            <button
              type="button"
              onClick={onClearMood}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#7E1A27] hover:underline mr-1"
            >
              <span>Reset filter</span>
              <PiXBold className="text-xs" />
            </button>
          )}

          <Link
            to="/books/create"
            className="h-8 px-4 rounded-full bg-[#7E1A27] hover:bg-[#68141F] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <PiPlusBold className="text-xs stroke-[3]" />
            <span>Add Story</span>
          </Link>

          <div className="h-8 px-3 rounded-full bg-white border border-[#E5DFD5] text-xs font-mono text-[#1C1917] flex items-center gap-1 shadow-2xs">
            <span className="font-bold">{totalBooks}</span> works cataloged
            <PiCaretRight className="text-xs text-[#8C827A]" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous collections"
              className="w-8 h-8 rounded-full bg-[#EAE3DA]/50 hover:bg-[#EAE3DA] flex items-center justify-center text-xs text-[#1C1917] transition-colors"
            >
              <PiCaretLeftBold />
            </button>
            <button
              type="button"
              aria-label="Next collections"
              className="w-8 h-8 rounded-full bg-[#EAE3DA]/50 hover:bg-[#EAE3DA] flex items-center justify-center text-xs text-[#1C1917] transition-colors"
            >
              <PiCaretRightBold />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Atmospheric Collection Cards matching the reference screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {COLLECTIONS_DATA.map((col) => {
          const isSelected = selectedMood?.id === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectMood(col)}
              className={`group relative overflow-hidden rounded-xl text-left h-36 sm:h-40 p-3.5 flex flex-col justify-between transition-all duration-200 ease-out border shadow-2xs ${
                col.borderStyle
              } ${
                isSelected
                  ? 'ring-2 ring-[#7E1A27] shadow-md -translate-y-0.5'
                  : 'hover:-translate-y-1 hover:shadow-md active:translate-y-0'
              }`}
            >
              {/* Rich Background Image with Soft Contrast Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${col.bgImage})` }}
              />

              {/* Tint overlay gradient for readability */}
              <div
                className={`absolute inset-0 ${
                  col.id === 'comforting-stories'
                    ? 'bg-gradient-to-t from-black/85 via-black/40 to-black/20'
                    : 'bg-gradient-to-t from-black/90 via-black/55 to-black/35'
                }`}
              />

              {/* Top Typography: COLLECTION tag & Title */}
              <div className="relative z-10">
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] block font-semibold text-white/70 mb-1">
                  Collection
                </span>
                <h3 className="font-serif text-[15px] sm:text-[16px] font-bold leading-tight text-white group-hover:text-amber-100 transition-colors">
                  {col.title}
                </h3>
              </div>

              {/* Bottom: Subtitle & Circular Arrow button */}
              <div className="relative z-10 flex items-end justify-between gap-1.5 pt-2">
                <p className="text-[11px] leading-snug line-clamp-2 text-white/85 font-normal">
                  {col.subtitle}
                </p>

                {/* Circular arrow button matching the screenshot */}
                <div className="w-6 h-6 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center text-[10px] flex-shrink-0 group-hover:bg-[#7E1A27] group-hover:border-[#7E1A27] transition-colors">
                  <PiArrowRightBold />
                </div>
              </div>

              {/* Active selection dot */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E58929] ring-2 ring-white z-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CuratedCollectionTiles;
