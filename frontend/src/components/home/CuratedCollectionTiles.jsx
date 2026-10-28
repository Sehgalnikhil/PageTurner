import React from 'react';
import { PiXBold, PiArrowRightBold } from 'react-icons/pi';

// Curated collections mapped to actual books in the catalog
const COLLECTIONS_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    subtitle: 'Gothic obsession & intellect',
    keywords: ['dorian', 'crime', 'gatsby', 'catcher'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#241F1C]',
    textColor: 'text-[#FAF5ED]',
    subColor: 'text-[#D5C9B8]',
    borderStyle: 'border-[#3D352E]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780141439570-M.jpg', // Dorian Gray
      'https://covers.openlibrary.org/b/isbn/9780140449136-M.jpg', // Crime and Punishment
    ],
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Fiction',
    subtitle: 'Dystopias & cosmic odysseys',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit'],
    fallbackCategory: 'Sci-Fi',
    accentBg: 'bg-[#1D242B]',
    textColor: 'text-[#F3F7FA]',
    subColor: 'text-[#B0C3D4]',
    borderStyle: 'border-[#323D48]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg', // Dune
      'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg', // 1984
    ],
  },
  {
    id: 'comforting-stories',
    title: 'Quiet, Comforting Stories',
    subtitle: 'Solace, warmth & gentle prose',
    keywords: ['pride', 'hobbit', 'alchemist', 'fellowship'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#F4EEE2]',
    textColor: 'text-[#2C241E]',
    subColor: 'text-[#7D6E5F]',
    borderStyle: 'border-[#E2D5C3]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg', // Pride and Prejudice
      'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg', // The Hobbit
    ],
  },
  {
    id: 'perspective-shifts',
    title: 'Perspective Shifts',
    subtitle: 'Philosophy & human origins',
    keywords: ['sapiens', 'meaning', 'mockingbird', 'thinking'],
    fallbackCategory: 'Non-Fiction',
    accentBg: 'bg-[#29231E]',
    textColor: 'text-[#FBF7F0]',
    subColor: 'text-[#C9BBAA]',
    borderStyle: 'border-[#423932]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg', // Sapiens
      'https://covers.openlibrary.org/b/isbn/9780807014295-M.jpg', // Man's Search for Meaning
    ],
  },
  {
    id: 'late-night',
    title: 'Late-Night Reads',
    subtitle: 'Page-turners read past dawn',
    keywords: ['gatsby', 'alchemist', 'dorian', 'dune'],
    fallbackCategory: 'Fiction',
    accentBg: 'bg-[#2B1D24]',
    textColor: 'text-[#FAF0F3]',
    subColor: 'text-[#CCA8B5]',
    borderStyle: 'border-[#44303B]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', // The Great Gatsby
      'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg', // The Alchemist
    ],
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth & Craft',
    subtitle: 'Habits, mastery & clear thinking',
    keywords: ['atomic habits', 'thinking, fast', 'educated', 'steve jobs'],
    fallbackCategory: 'Non-Fiction',
    accentBg: 'bg-[#1F2922]',
    textColor: 'text-[#F2FAF4]',
    subColor: 'text-[#A9C4B0]',
    borderStyle: 'border-[#334437]',
    coverThumbnails: [
      'https://covers.openlibrary.org/b/isbn/9780735211292-M.jpg', // Atomic Habits
      'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg', // Thinking, Fast and Slow
    ],
  },
];

const CuratedCollectionTiles = ({ selectedMood, onSelectMood, onClearMood }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            Curated Atmospheres
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            &bull; Image-led collections
          </span>
        </div>

        {selectedMood && (
          <button
            type="button"
            onClick={onClearMood}
            className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy hover:underline"
          >
            <span>Reset mood filter</span>
            <PiXBold className="text-xs" />
          </button>
        )}
      </div>

      {/* 6 Image-Led Tiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {COLLECTIONS_DATA.map((col) => {
          const isSelected = selectedMood?.id === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectMood(col)}
              className={`group relative overflow-hidden rounded-xl text-left h-24 sm:h-28 p-3 flex flex-col justify-between transition-all duration-250 ease-out border ${
                col.accentBg
              } ${col.borderStyle} ${
                isSelected
                  ? 'ring-2 ring-burgundy shadow-lg -translate-y-1'
                  : 'hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {/* Miniature Overlapping Cover Collage with subtle hover zoom */}
              <div className="absolute -right-3 -bottom-4 flex items-end pointer-events-none opacity-85 group-hover:opacity-100 transform group-hover:scale-105 transition-all duration-300 ease-out">
                {col.coverThumbnails[0] && (
                  <img
                    src={col.coverThumbnails[0]}
                    alt=""
                    className="w-11 sm:w-13 h-16 sm:h-18 object-cover rounded shadow-md transform -rotate-12 translate-y-1 translate-x-2 border border-white/20"
                    loading="lazy"
                  />
                )}
                {col.coverThumbnails[1] && (
                  <img
                    src={col.coverThumbnails[1]}
                    alt=""
                    className="w-12 sm:w-14 h-18 sm:h-20 object-cover rounded shadow-lg transform rotate-6 z-10 border border-white/25"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Tint overlay gradient for readability with gentle hover shift */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent group-hover:from-black/75 group-hover:via-black/35 pointer-events-none transition-all duration-300" />

              {/* Foreground Typography */}
              <div className="relative z-10 max-w-[70%] sm:max-w-[65%]">
                <span className={`text-[9px] uppercase font-mono tracking-widest block font-bold mb-0.5 ${col.subColor}`}>
                  Collection
                </span>
                <h3 className={`font-serif text-xs sm:text-[13px] font-bold leading-tight group-hover:text-amber-100 transition-colors duration-200 ${col.textColor}`}>
                  {col.title}
                </h3>
              </div>

              {/* Subtitle & Animated Sliding Arrow */}
              <div className="relative z-10 flex items-center justify-between gap-1">
                <p className={`text-[10px] leading-tight line-clamp-1 font-medium ${col.subColor}`}>
                  {col.subtitle}
                </p>
                <span className="flex-shrink-0 text-[11px] text-white/90 transform -translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                  <PiArrowRightBold />
                </span>
              </div>

              {/* Active selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-burgundy ring-2 ring-white z-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CuratedCollectionTiles;
