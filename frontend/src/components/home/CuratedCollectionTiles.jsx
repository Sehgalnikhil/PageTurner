import React, { useRef } from 'react';
import { PiXBold, PiArrowRightBold, PiCaretLeftBold, PiCaretRightBold, PiPlusBold, PiCaretRight } from 'react-icons/pi';
import { Link } from 'react-router-dom';

// 6 Rich, image-led Pinterest-style curated atmospheric collections
const COLLECTIONS_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    subtitle: 'Gothic obsession & intellectual desire.',
    keywords: ['dorian', 'crime', 'gatsby', 'catcher'],
    fallbackCategory: 'Fiction',
    accentTag: 'Scholarly Classic',
    bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Fiction',
    subtitle: 'Dystopias & cosmic curiosity.',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit'],
    fallbackCategory: 'Sci-Fi',
    accentTag: 'Speculative',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'comforting-stories',
    title: 'Quiet, Comforting Stories',
    subtitle: 'Solace, warmth & gentle worlds.',
    keywords: ['pride', 'hobbit', 'alchemist', 'fellowship'],
    fallbackCategory: 'Fiction',
    accentTag: 'Comfort Reads',
    bgImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'perspective-shifts',
    title: 'Perspective Shifts',
    subtitle: 'Philosophy & human experience.',
    keywords: ['sapiens', 'meaning', 'mockingbird', 'thinking'],
    fallbackCategory: 'Non-Fiction',
    accentTag: 'Philosophy',
    bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'late-night',
    title: 'Late-Night Reads',
    subtitle: 'Page-turners read past midnight.',
    keywords: ['gatsby', 'alchemist', 'dorian', 'dune'],
    fallbackCategory: 'Fiction',
    accentTag: 'Suspense',
    bgImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth & Craft',
    subtitle: 'Habits, mastery & clearer thinking.',
    keywords: ['atomic habits', 'thinking, fast', 'educated', 'steve jobs'],
    fallbackCategory: 'Non-Fiction',
    accentTag: 'Mindset & Craft',
    bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
  },
];

const CuratedCollectionTiles = ({
  selectedMood,
  onSelectMood,
  onClearMood,
  totalBooks = 21,
}) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="curated-collections" className="mb-12 scroll-mt-28">
      {/* 1. SECTION HEADER ROW: Title, Metadata, Actions, & Carousel Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-xl sm:text-[23px] font-bold text-[#292522] tracking-tight">
            Curated Atmospheres
          </h2>
          <span className="text-xs sm:text-sm text-[#827870] font-sans">
            &bull; Image-led collections
          </span>
        </div>

        {/* Action Controls Group: Reset Filter, + Add Story, Works Count, & Carousel Arrows */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedMood && (
            <button
              type="button"
              onClick={onClearMood}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4E8E6] text-[#861D2D] hover:bg-[#ebd8d5] text-xs font-semibold transition-colors shadow-2xs mr-1"
            >
              <span>Reset &ldquo;{selectedMood.title}&rdquo;</span>
              <PiXBold className="text-xs" />
            </button>
          )}

          <Link
            to="/books/create"
            className="h-8 sm:h-9 px-4 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95"
          >
            <PiPlusBold className="text-xs stroke-[3]" />
            <span>Add Story</span>
          </Link>

          <div className="h-8 sm:h-9 px-3.5 rounded-full bg-[#FFFDF9] border border-[#E8DED2] text-xs font-mono text-[#292522] flex items-center gap-1.5 shadow-2xs">
            <span className="font-bold text-[#861D2D]">{totalBooks}</span> works cataloged
            <PiCaretRight className="text-xs text-[#827870]" />
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous atmospheric collections"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8DED2] flex items-center justify-center text-xs text-[#292522] hover:text-[#861D2D] shadow-2xs transition-colors active:scale-95"
            >
              <PiCaretLeftBold />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next atmospheric collections"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#E8DED2] flex items-center justify-center text-xs text-[#292522] hover:text-[#861D2D] shadow-2xs transition-colors active:scale-95"
            >
              <PiCaretRightBold />
            </button>
          </div>
        </div>
      </div>

      {/* 2. GALLERY CARDS: Responsive Horizontal Carousel on Mobile/Tablet & 6-Col Grid on Desktop */}
      <div
        ref={carouselRef}
        className="flex lg:grid lg:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {COLLECTIONS_DATA.map((col) => {
          const isSelected = selectedMood?.id === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectMood(col)}
              className={`group relative overflow-hidden rounded-2xl text-left h-48 sm:h-52 p-4 flex flex-col justify-between transition-all duration-300 ease-out border shadow-2xs w-[250px] sm:w-[270px] lg:w-auto flex-shrink-0 snap-start ${
                isSelected
                  ? 'ring-2 ring-[#861D2D] ring-offset-2 ring-offset-[#FAF7F2] border-[#861D2D] -translate-y-1 shadow-md'
                  : 'border-[#E8DED2] hover:-translate-y-1 hover:border-[#861D2D]/40 hover:shadow-md active:translate-y-0'
              }`}
            >
              {/* High-Resolution Background Imagery */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                style={{ backgroundImage: `url(${col.bgImage})` }}
              />

              {/* Dual Directional Dark Vignette Gradient for 100% Readable Text (No Washed-Out Gray) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/35 pointer-events-none" />

              {/* Subtle top subtle sheen on hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />

              {/* Top Typography: Eyebrow Tag & Prominent Serif Title */}
              <div className="relative z-10">
                <span className="text-[9.5px] uppercase font-mono tracking-[0.22em] block font-bold text-[#C99A48] drop-shadow-xs mb-1.5">
                  Collection
                </span>
                <h3 className="font-serif text-[17px] sm:text-[18px] font-bold leading-tight text-white drop-shadow-sm group-hover:text-amber-100 transition-colors line-clamp-2">
                  {col.title}
                </h3>
              </div>

              {/* Bottom Row: Subtitle Description & Discreet Circular Arrow */}
              <div className="relative z-10 flex items-end justify-between gap-2 pt-2">
                <p className="text-[11.5px] leading-snug line-clamp-2 text-[#FAF7F2]/90 font-normal drop-shadow-xs">
                  {col.subtitle}
                </p>

                {/* Circular Arrow Button with Burgundy Fill on Hover */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#861D2D] text-white border-[#861D2D]'
                      : 'bg-black/40 border-white/25 text-white group-hover:bg-[#861D2D] group-hover:border-[#861D2D]'
                  }`}
                >
                  <PiArrowRightBold />
                </div>
              </div>

              {/* Active Selection Indicator Dot */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#C99A48] ring-2 ring-white z-20 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedCollectionTiles;
