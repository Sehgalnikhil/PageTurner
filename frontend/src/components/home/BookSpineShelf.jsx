import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiEyeBold,
  PiBookmarkSimpleFill,
  PiStarFill,
  PiBookOpenBold,
  PiArrowRightBold,
} from 'react-icons/pi';

const getSpineColor = (category, idx) => {
  const cat = category?.toLowerCase();
  if (cat?.includes('sci-fi')) return { bg: 'bg-[#162432]', border: 'border-[#263E56]', foil: 'text-cyan-200', rib: 'rgba(255,255,255,0.08)' };
  if (cat?.includes('non-fiction')) return { bg: 'bg-[#192D21]', border: 'border-[#2A4B37]', foil: 'text-emerald-200', rib: 'rgba(255,255,255,0.08)' };
  if (cat?.includes('biography')) return { bg: 'bg-[#382315]', border: 'border-[#5C3A23]', foil: 'text-amber-200', rib: 'rgba(255,255,255,0.08)' };
  if (cat?.includes('philosophy')) return { bg: 'bg-[#2B1B17]', border: 'border-[#4D3028]', foil: 'text-rose-200', rib: 'rgba(255,255,255,0.08)' };
  // Default classic burgundy / leather alternation
  const alternates = [
    { bg: 'bg-[#4A1521]', border: 'border-[#732234]', foil: 'text-amber-100', rib: 'rgba(255,255,255,0.1)' },
    { bg: 'bg-[#2E1D22]', border: 'border-[#52333D]', foil: 'text-amber-200', rib: 'rgba(255,255,255,0.08)' },
    { bg: 'bg-[#361912]', border: 'border-[#5C2B1F]', foil: 'text-amber-100', rib: 'rgba(255,255,255,0.09)' },
  ];
  return alternates[idx % alternates.length];
};

const BookSpineShelf = ({ books = [], onSelectBook }) => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const navigate = useNavigate();

  if (!books.length) {
    return (
      <div className="py-16 text-center text-stone-400 font-serif">
        <PiBookOpenBold className="text-4xl mx-auto mb-2 opacity-40" />
        <p>No volumes currently placed on your virtual shelf.</p>
      </div>
    );
  }

  // Calculate library telemetry stats
  const totalPages = books.reduce((acc, b) => acc + (b.pageCount || 280), 0);
  const totalHours = Math.round(totalPages / 50); // ~50 pages per hour

  return (
    <div className="space-y-6">
      {/* Telemetry Header Bar */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-center font-mono">
        <div>
          <span className="text-[10px] uppercase text-stone-500 block">Volumes Standing</span>
          <span className="font-serif text-lg font-bold text-stone-900">{books.length}</span>
        </div>
        <div className="border-x border-stone-200">
          <span className="text-[10px] uppercase text-stone-500 block">Total Pages Queued</span>
          <span className="font-serif text-lg font-bold text-burgundy">{totalPages.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-stone-500 block">Estimated Read Time</span>
          <span className="font-serif text-lg font-bold text-stone-900">~{totalHours} hrs</span>
        </div>
      </div>

      {/* 3D Hardwood Shelf Unit */}
      <div className="relative pt-8 pb-4 px-4 bg-[#1E140E] rounded-2xl shadow-2xl border border-[#3E281C] overflow-x-auto">
        {/* Shelf Back Wall Shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none" />

        {/* Standing Book Spines Flex Container */}
        <div className="relative z-10 flex items-end justify-center min-w-max gap-1 px-4 h-[320px] pb-3">
          {books.map((book, idx) => {
            const pages = book.pageCount || 280;
            // Width proportional to page count: 32px to 62px
            const width = Math.min(64, Math.max(34, Math.round(pages / 11)));
            const height = Math.min(290, Math.max(240, 250 + (idx % 4) * 12));
            const spineStyle = getSpineColor(book.category, idx);
            const isHovered = hoveredBook?._id === book._id;

            return (
              <div
                key={book._id}
                onMouseEnter={() => setHoveredBook(book)}
                onMouseLeave={() => setHoveredBook(null)}
                onClick={() => {
                  if (onSelectBook) onSelectBook(book);
                  else navigate(`/books/details/${book._id}`);
                }}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  transform: isHovered ? 'translateY(-22px) scale(1.03)' : 'translateY(0)',
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
                }}
                className={`group relative cursor-pointer select-none rounded-t-sm ${spineStyle.bg} border-t-2 border-r border-l ${spineStyle.border} shadow-lg flex flex-col justify-between py-3 px-1 text-center`}
              >
                {/* Horizontal Leather Spine Ribbing Ridges */}
                <div
                  className="w-full h-1.5 rounded-full mb-1 opacity-70"
                  style={{ backgroundColor: spineStyle.rib }}
                />
                <div
                  className="w-full h-1.5 rounded-full mb-auto opacity-70"
                  style={{ backgroundColor: spineStyle.rib }}
                />

                {/* Vertical Embossed Title in Gold/Silver Foil */}
                <div className="my-auto flex items-center justify-center overflow-hidden">
                  <span
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                    }}
                    className={`font-serif text-[11px] sm:text-xs font-bold tracking-wider uppercase truncate max-h-[160px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] ${spineStyle.foil}`}
                  >
                    {book.title}
                  </span>
                </div>

                {/* Bottom Spine Ribs & Author Initials */}
                <div
                  className="w-full h-1.5 rounded-full mt-auto opacity-70"
                  style={{ backgroundColor: spineStyle.rib }}
                />
                <span className="font-mono text-[8px] font-bold uppercase opacity-60 text-white truncate px-0.5">
                  {book.author?.split(' ').map((n) => n[0]).join('') || 'PT'}
                </span>

                {/* Bookmark Silk Ribbon Tail hanging below shelf */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-burgundy rounded-b-xs shadow-xs pointer-events-none"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}
                />
              </div>
            );
          })}
        </div>

        {/* Heavy Hardwood Shelf Base Rail */}
        <div className="relative z-20 h-5 bg-gradient-to-b from-[#4A2F1E] via-[#352115] to-[#20140D] border-t-2 border-[#66432C] shadow-2xl rounded-b-lg flex items-center justify-between px-6">
          <div className="w-12 h-1 bg-black/40 rounded-full" />
          <span className="font-mono text-[8px] uppercase tracking-widest text-amber-200/40">
            PageTurner Solid Oak Stacks
          </span>
          <div className="w-12 h-1 bg-black/40 rounded-full" />
        </div>
      </div>

      {/* Floating Hover Card Detail Callout */}
      {hoveredBook && (
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xl flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5 min-w-0">
            {hoveredBook.image ? (
              <img
                src={hoveredBook.image}
                alt={hoveredBook.title}
                className="w-11 h-16 object-cover rounded-md shadow-xs border border-stone-200 flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-16 bg-stone-200 rounded-md flex items-center justify-center flex-shrink-0">
                <PiBookOpenBold className="text-stone-500 text-lg" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-burgundy font-bold block">
                {hoveredBook.category || 'Curated Volume'} &bull; {hoveredBook.publishYear}
              </span>
              <h4 className="font-serif text-base font-bold text-stone-900 truncate">
                {hoveredBook.title}
              </h4>
              <p className="text-xs text-stone-600 font-serif italic truncate">
                by {hoveredBook.author} &bull; {hoveredBook.pageCount || 280} pages
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/books/details/${hoveredBook._id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-burgundy hover:bg-[#63121E] text-white text-xs font-serif font-semibold shadow-xs flex-shrink-0 transition-transform active:scale-95"
          >
            <span>Read Details</span>
            <PiArrowRightBold className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BookSpineShelf;
