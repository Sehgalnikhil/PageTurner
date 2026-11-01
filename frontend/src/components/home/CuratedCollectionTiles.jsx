import React, { useRef } from 'react';
import { PiXBold, PiArrowRightBold, PiCaretLeftBold, PiCaretRightBold, PiPlusBold, PiCaretRight, PiSparkleBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';

// 6 Distinct, high-quality, authentic curated atmospheric collections with verified local assets
const COLLECTIONS_DATA = [
  {
    id: 'dark-academia',
    vol: 'I',
    title: 'Dark Academia',
    subtitle: 'Gothic obsession & intellectual desire.',
    keywords: ['secret history', 'dorian', 'villains', 'babel', 'crime and punishment', 'frankenstein'],
    fallbackCategory: 'Fiction',
    theme: 'dark',
    bgImage: '/images/salon-hero-backdrop.jpg',
  },
  {
    id: 'mind-bending',
    vol: 'II',
    title: 'Mind-Bending Fiction',
    subtitle: 'Dystopias & cosmic curiosity.',
    keywords: ['dune', '1984', 'brave new world', 'fahrenheit', 'klara', 'solitude'],
    fallbackCategory: 'Sci-Fi',
    theme: 'dark',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'comforting-stories',
    vol: 'III',
    title: 'Quiet, Comforting Stories',
    subtitle: 'Solace, warmth & gentle worlds.',
    keywords: ['pride and prejudice', 'hobbit', 'before the coffee', 'alchemist', 'little women', 'gentle reminder'],
    fallbackCategory: 'Fiction',
    theme: 'dark',
    bgImage: '/images/editorial/moodboard_open_book.jpg',
  },
  {
    id: 'perspective-shifts',
    vol: 'IV',
    title: 'Perspective Shifts',
    subtitle: 'Philosophy & human experience.',
    keywords: ['meditations', 'meaning', 'sapiens', 'mockingbird', 'metamorphosis', 'thinking'],
    fallbackCategory: 'Non-Fiction',
    theme: 'dark',
    bgImage: '/images/editorial/moodboard_mountain.jpg',
  },
  {
    id: 'late-night',
    vol: 'V',
    title: 'Late-Night Reads',
    subtitle: 'Page-turners read past midnight.',
    keywords: ['great gatsby', 'shadow of the wind', 'norwegian wood', 'bell jar', 'stoner', 'kafka on the shore'],
    fallbackCategory: 'Fiction',
    theme: 'dark',
    bgImage: '/images/login-reading-nook-hd.jpg',
  },
  {
    id: 'personal-growth',
    vol: 'VI',
    title: 'Personal Growth & Craft',
    subtitle: 'Habits, mastery & clearer thinking.',
    keywords: ['atomic habits', 'steve jobs', 'educated', 'thinking', 'beyond good and evil', 'alchemist'],
    fallbackCategory: 'Non-Fiction',
    theme: 'dark',
    bgImage: '/images/signup-desk-scene-hd.jpg',
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
          <div className="w-7 h-7 rounded-full bg-[#8D263B]/10 text-[#8D263B] flex items-center justify-center text-xs">
            <PiSparkleBold />
          </div>
          <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#2A1E17] tracking-tight">
            Curated Atmospheres
          </h2>
          <span className="text-xs sm:text-sm text-[#7A6C60] font-serif italic">
            &bull; Image-led moodboards
          </span>
        </div>

        {/* Action Controls Group: Reset Filter, + Add Story, Works Count, & Carousel Arrows */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedMood && (
            <button
              type="button"
              onClick={onClearMood}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8D263B]/10 text-[#8D263B] hover:bg-[#8D263B]/20 text-xs font-medium transition-colors shadow-2xs mr-1 cursor-pointer"
            >
              <span>Reset &ldquo;{selectedMood.title}&rdquo;</span>
              <PiXBold className="text-xs" />
            </button>
          )}

          <Link
            to="/books/create"
            className="h-8 px-3.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm cute-pill-hover group"
          >
            <PiPlusBold className="text-xs transition-transform duration-300 group-hover:rotate-90 group-hover:scale-125" />
            <span>Add Story</span>
          </Link>

          <div className="h-8 px-3 rounded-full bg-[#FFFDFA] border border-[#E8DED1] text-xs font-mono text-[#302A27] flex items-center gap-1.5 shadow-2xs">
            <span className="font-medium text-[#8D263B]">{totalBooks}</span> works
            <PiCaretRight className="text-xs text-[#81766D]" />
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous atmospheric collections"
              className="w-8 h-8 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] flex items-center justify-center text-xs text-[#302A27] hover:text-[#8D263B] shadow-2xs transition-colors cursor-pointer"
            >
              <PiCaretLeftBold />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next atmospheric collections"
              className="w-8 h-8 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] flex items-center justify-center text-xs text-[#302A27] hover:text-[#8D263B] shadow-2xs transition-colors cursor-pointer"
            >
              <PiCaretRightBold />
            </button>
          </div>
        </div>
      </div>

      {/* 2. GALLERY CARDS: Responsive Horizontal Carousel on Mobile/Tablet & 6-Col Grid on Desktop */}
      <div
        ref={carouselRef}
        className="flex lg:grid lg:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {COLLECTIONS_DATA.map((col) => {
          const isSelected = selectedMood?.id === col.id;

          return (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectMood(col)}
              className={`group relative overflow-hidden rounded-2xl text-left h-[225px] sm:h-[235px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ease-out border shadow-sm w-[250px] sm:w-[270px] lg:w-auto flex-shrink-0 snap-start cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-[#C6A16B] ring-offset-2 ring-offset-[#F7F3EC] border-[#8D263B] -translate-y-1.5 shadow-[0_14px_32px_rgba(141,38,59,0.28)]'
                  : 'border-[#E2D5C3] hover:-translate-y-1.5 hover:border-[#8D263B]/60 hover:shadow-[0_12px_28px_rgba(40,25,15,0.2)] active:translate-y-0'
              }`}
            >
              {/* Background Imagery with Subtle Smooth Hover Zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                style={{ backgroundImage: `url(${col.bgImage})` }}
              />

              {/* Rich Cinematic Dark Gradient for 100% Guaranteed Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 pointer-events-none" />

              {/* Top Typography: Eyebrow Tag & Prominent Serif Title */}
              <div className="relative z-10">
                <span className="text-[9.5px] uppercase font-mono tracking-[0.22em] block font-bold mb-1.5 text-[#E8C28A] drop-shadow-sm">
                  ✦ Vol. {col.vol}
                </span>
                <h3 className="font-serif text-[18px] sm:text-[19px] font-bold leading-snug line-clamp-2 text-white drop-shadow-sm group-hover:text-[#FDECC8] transition-colors">
                  {col.title}
                </h3>
              </div>

              {/* Bottom Row: Subtitle Description & Gilded Circular Arrow Button */}
              <div className="relative z-10 flex items-end justify-between gap-2 pt-2">
                <p className="text-[11.5px] leading-snug line-clamp-2 font-serif italic text-stone-200/95 drop-shadow-xs">
                  {col.subtitle}
                </p>

                {/* Circular Arrow Button */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#8D263B] text-white border-[#C6A16B] shadow-sm'
                      : 'bg-black/50 border-white/30 text-white group-hover:bg-[#8D263B] group-hover:border-[#C6A16B] group-hover:scale-110'
                  }`}
                >
                  <PiArrowRightBold />
                </div>
              </div>

              {/* Active Selection Indicator Dot */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#E8C28A] ring-2 ring-white z-20 shadow-sm animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CuratedCollectionTiles;
