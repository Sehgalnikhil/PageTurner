import React, { useRef } from 'react';
import { PiXBold, PiArrowRightBold, PiCaretLeftBold, PiCaretRightBold, PiPlusBold, PiCaretRight } from 'react-icons/pi';
import { Link } from 'react-router-dom';

// 6 Distinct, high-quality, relevant curated atmospheric collections
const COLLECTIONS_DATA = [
  {
    id: 'dark-academia',
    title: 'Dark Academia',
    subtitle: 'Gothic obsession & intellectual desire.',
    keywords: ['dorian', 'crime', 'gatsby', 'catcher'],
    fallbackCategory: 'Fiction',
    theme: 'dark',
    bgImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mind-bending',
    title: 'Mind-Bending Fiction',
    subtitle: 'Dystopias & cosmic curiosity.',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit'],
    fallbackCategory: 'Sci-Fi',
    theme: 'dark',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'comforting-stories',
    title: 'Quiet, Comforting Stories',
    subtitle: 'Solace, warmth & gentle worlds.',
    keywords: ['pride', 'hobbit', 'alchemist', 'fellowship'],
    fallbackCategory: 'Fiction',
    theme: 'light', // Deliberate dark-text treatment on intentionally warm light aesthetic
    bgImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'perspective-shifts',
    title: 'Perspective Shifts',
    subtitle: 'Philosophy & human experience.',
    keywords: ['sapiens', 'meaning', 'mockingbird', 'thinking'],
    fallbackCategory: 'Non-Fiction',
    theme: 'dark',
    bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'late-night',
    title: 'Late-Night Reads',
    subtitle: 'Page-turners read past midnight.',
    keywords: ['gatsby', 'alchemist', 'dorian', 'dune'],
    fallbackCategory: 'Fiction',
    theme: 'dark',
    bgImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'personal-growth',
    title: 'Personal Growth & Craft',
    subtitle: 'Habits, mastery & clearer thinking.',
    keywords: ['atomic habits', 'thinking, fast', 'educated', 'steve jobs'],
    fallbackCategory: 'Non-Fiction',
    theme: 'dark',
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
    <section id="curated-collections" className="mb-12 scroll-mt-24">
      {/* 1. SECTION HEADER: Title, Metadata, Actions, & Carousel Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-serif text-2xl sm:text-[25px] font-medium text-[#302A27] tracking-tight">
            Curated Atmospheres
          </h2>
          <span className="text-xs sm:text-sm text-[#81766D] font-sans">
            &bull; Image-led moodboards
          </span>
        </div>

        {/* Action Controls Group: Reset Filter, + Add Story, Works Count, & Carousel Arrows */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedMood && (
            <button
              type="button"
              onClick={onClearMood}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8D263B]/10 text-[#8D263B] hover:bg-[#8D263B]/15 text-xs font-medium transition-colors shadow-subtle mr-1 cursor-pointer"
            >
              <span>Reset &ldquo;{selectedMood.title}&rdquo;</span>
              <PiXBold className="text-xs" />
            </button>
          )}

          <Link
            to="/books/create"
            className="h-8 px-3.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium flex items-center gap-1.5 transition-all shadow-subtle cute-pill-hover group"
          >
            <PiPlusBold className="text-xs transition-transform duration-300 group-hover:rotate-90 group-hover:scale-125" />
            <span>Add Story</span>
          </Link>

          <div className="h-8 px-3 rounded-full bg-[#FFFDFA] border border-[#E8DED1] text-xs font-mono text-[#302A27] flex items-center gap-1.5 shadow-subtle">
            <span className="font-medium text-[#8D263B]">{totalBooks}</span> works
            <PiCaretRight className="text-xs text-[#81766D]" />
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous atmospheric collections"
              className="w-8 h-8 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] flex items-center justify-center text-xs text-[#302A27] hover:text-[#8D263B] shadow-subtle transition-colors cursor-pointer"
            >
              <PiCaretLeftBold />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next atmospheric collections"
              className="w-8 h-8 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] flex items-center justify-center text-xs text-[#302A27] hover:text-[#8D263B] shadow-subtle transition-colors cursor-pointer"
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
          const isLight = col.theme === 'light';

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectMood(col)}
              className={`group relative overflow-hidden rounded-xl text-left h-[210px] sm:h-[220px] p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-200 ease-out border shadow-subtle w-[250px] sm:w-[270px] lg:w-auto flex-shrink-0 snap-start cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#8D263B] ring-offset-2 ring-offset-[#F7F3EC] border-[#8D263B] -translate-y-1 shadow-card'
                  : 'border-[#E8DED2] hover:-translate-y-1 hover:border-[#861D2D]/40 hover:shadow-md active:translate-y-0'
              }`}
            >
              {/* Background Imagery */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-106"
                style={{ backgroundImage: `url(${col.bgImage})` }}
              />

              {/* Contrast Overlays: Warm paper gradient for light theme; Deep dark gradient for dark theme */}
              {isLight ? (
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5EFE6]/98 via-[#F5EFE6]/75 to-[#F5EFE6]/50 pointer-events-none" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />
              )}

              {/* Top Typography: Eyebrow Tag & Prominent Serif Title */}
              <div className="relative z-10">
                <span
                  className={`text-[9.5px] uppercase font-mono tracking-[0.22em] block font-bold mb-1.5 ${
                    isLight ? 'text-[#861D2D]' : 'text-[#C99A48] drop-shadow-xs'
                  }`}
                >
                  Collection
                </span>
                <h3
                  className={`font-serif text-[17px] sm:text-[18px] font-bold leading-snug line-clamp-2 transition-colors ${
                    isLight
                      ? 'text-[#292522] group-hover:text-[#861D2D]'
                      : 'text-white drop-shadow-sm group-hover:text-amber-100'
                  }`}
                >
                  {col.title}
                </h3>
              </div>

              {/* Bottom Row: Subtitle Description & Discreet Circular Arrow */}
              <div className="relative z-10 flex items-end justify-between gap-2 pt-2">
                <p
                  className={`text-[11.5px] leading-snug line-clamp-2 font-normal ${
                    isLight ? 'text-[#5A4D41]' : 'text-[#FAF7F2]/90 drop-shadow-xs'
                  }`}
                >
                  {col.subtitle}
                </p>

                {/* Circular Arrow Button */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#861D2D] text-white border-[#861D2D]'
                      : isLight
                      ? 'bg-[#292522] border-[#292522] text-white group-hover:bg-[#861D2D] group-hover:border-[#861D2D]'
                      : 'bg-black/50 border-white/25 text-white group-hover:bg-[#861D2D] group-hover:border-[#861D2D]'
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
