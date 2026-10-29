import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PiEyeBold,
  PiBookmarkSimpleFill,
  PiBookmarkSimpleBold,
  PiStarFill,
  PiBookOpenBold,
  PiArrowRightBold,
  PiXBold,
  PiBookBookmarkBold,
  PiSparkleBold,
  PiClockBold,
  PiBookOpenTextBold,
  PiSquaresFourBold,
  PiColumnsBold,
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { ReadingListContext } from '../../context/ReadingListContext';
import { playBookSpineSlide, playWaxSealCrack, playRevealChime } from '../../utils/soundEffects';
import { getBookCoverUrl } from '../../utils/imageHelper';
import PageFlipPreview from './PageFlipPreview';

// Distinctive luxury bookbinding colorways & foil styling
const getSpineStyle = (category = '', idx = 0) => {
  const cat = category.toLowerCase();

  if (cat.includes('sci-fi') || cat.includes('dystopia') || cat.includes('space')) {
    return {
      bg: 'bg-[#101D2D]',
      border: 'border-[#1E334D]',
      gradient: 'from-[#142336] via-[#101D2D] to-[#0A131E]',
      foil: 'text-[#DCE7F5]',
      rib: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(16, 29, 45, 0.6)',
      ribbon: 'bg-[#4375A3]',
      tag: 'Sci-Fi Epic',
    };
  }

  if (cat.includes('non-fiction') || cat.includes('philosophy') || cat.includes('nature')) {
    return {
      bg: 'bg-[#142A1D]',
      border: 'border-[#224530]',
      gradient: 'from-[#193625] via-[#142A1D] to-[#0D1C13]',
      foil: 'text-[#E8F3E9]',
      rib: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(20, 42, 29, 0.6)',
      ribbon: 'bg-[#3A6B4C]',
      tag: 'Philosophy',
    };
  }

  if (cat.includes('biography') || cat.includes('memoir') || cat.includes('history')) {
    return {
      bg: 'bg-[#3D2516]',
      border: 'border-[#5A3822]',
      gradient: 'from-[#4A2D1B] via-[#3D2516] to-[#2B190E]',
      foil: 'text-[#F5E2C8]',
      rib: 'rgba(255, 255, 255, 0.14)',
      shadow: 'rgba(61, 37, 22, 0.6)',
      ribbon: 'bg-[#9C663B]',
      tag: 'Memoir',
    };
  }

  // Classic literary leather & cloth palettes (Burgundy, Deep Plum, Obsidian, Burnt Umber)
  const classicPalettes = [
    {
      bg: 'bg-[#501622]',
      border: 'border-[#752435]',
      gradient: 'from-[#611C2B] via-[#501622] to-[#390F18]',
      foil: 'text-[#FDECC8]',
      rib: 'rgba(255, 255, 255, 0.14)',
      shadow: 'rgba(80, 22, 34, 0.65)',
      ribbon: 'bg-[#861D2D]',
      tag: 'Classic',
    },
    {
      bg: 'bg-[#321722]',
      border: 'border-[#4F2637]',
      gradient: 'from-[#3D1D2A] via-[#321722] to-[#241018]',
      foil: 'text-[#F6DFD2]',
      rib: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(50, 23, 34, 0.6)',
      ribbon: 'bg-[#6B2B47]',
      tag: 'Gothic',
    },
    {
      bg: 'bg-[#1C1A19]',
      border: 'border-[#332F2D]',
      gradient: 'from-[#282524] via-[#1C1A19] to-[#121110]',
      foil: 'text-[#F8E7B9]',
      rib: 'rgba(255, 255, 255, 0.12)',
      shadow: 'rgba(28, 26, 25, 0.7)',
      ribbon: 'bg-[#C99A48]',
      tag: 'Fine Press',
    },
    {
      bg: 'bg-[#442217]',
      border: 'border-[#633324]',
      gradient: 'from-[#52291C] via-[#442217] to-[#30170F]',
      foil: 'text-[#F9EAD4]',
      rib: 'rgba(255, 255, 255, 0.13)',
      shadow: 'rgba(68, 34, 23, 0.6)',
      ribbon: 'bg-[#B05B3B]',
      tag: 'Literature',
    },
  ];

  return classicPalettes[idx % classicPalettes.length];
};

const BookSpineShelf = ({ books = [], onSelectBook }) => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showPageFlip, setShowPageFlip] = useState(false);
  const [shelfLayout, setShelfLayout] = useState('double'); // 'double' (2-tier) | 'single' (1-tier wide)
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isBookSaved, toggleBook } = React.useContext(ReadingListContext);

  if (!books.length) {
    return (
      <div className="py-20 text-center rounded-3xl bg-[#FAF7F2] border border-[#E8DED2] text-[#827870] font-serif p-8">
        <PiBookOpenBold className="text-5xl mx-auto mb-3 text-[#CBB499] opacity-70" />
        <h3 className="font-serif text-xl font-bold text-[#292522]">No Volumes on This Shelf</h3>
        <p className="text-xs text-[#827870] mt-1 italic max-w-sm mx-auto">
          Try clearing your active filters or explore our Curated Atmospheres above.
        </p>
      </div>
    );
  }

  // Calculate library telemetry stats
  const totalPages = books.reduce((acc, b) => acc + (b.pageCount || 280), 0);
  const totalHours = Math.round(totalPages / 50); // ~50 pages/hr reading speed
  const averagePages = Math.round(totalPages / books.length);

  // Partition books across 2 tiers if double layout is chosen and we have enough books
  const shouldSplit = shelfLayout === 'double' && books.length >= 6;
  const midPoint = Math.ceil(books.length / 2);
  const tiers = shouldSplit
    ? [
        { label: 'STACK NO. 01 • CURATED FIRST EDITIONS & MEMOIR', books: books.slice(0, midPoint) },
        { label: 'STACK NO. 02 • PHILOSOPHY, SPECULATIVE & GOTHIC', books: books.slice(midPoint) },
      ]
    : [{ label: 'MAIN LIBRARY STACK • COMPLETE HOLDINGS', books: books }];

  const handleSpineClick = (book) => {
    playWaxSealCrack();
    setSelectedBook(book);
  };

  const handleToggleShelfBookmark = (e, book) => {
    e.stopPropagation();
    toggleBook(book);
    const currentlySaved = isBookSaved(book._id);
    if (!currentlySaved) {
      playRevealChime();
      enqueueSnackbar(`Pinned "${book.title}" to your reading shelf! 🔖`, { variant: 'success' });
    } else {
      enqueueSnackbar(`Removed "${book.title}" from your reading shelf.`, { variant: 'info' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Header Bar with Layout Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED2] shadow-2xs font-mono">
        <div className="flex items-center gap-6 divide-x divide-[#E8DED2] text-xs">
          <div className="pr-4">
            <span className="text-[10px] uppercase text-[#786C62] block tracking-wider">
              Volumes Shelved
            </span>
            <span className="font-serif text-lg font-bold text-[#292522]">{books.length}</span>
          </div>

          <div className="px-4">
            <span className="text-[10px] uppercase text-[#786C62] block tracking-wider">
              Total Pages
            </span>
            <span className="font-serif text-lg font-bold text-[#861D2D]">
              {totalPages.toLocaleString()}
            </span>
          </div>

          <div className="px-4">
            <span className="text-[10px] uppercase text-[#786C62] block tracking-wider">
              Est. Library Time
            </span>
            <span className="font-serif text-lg font-bold text-[#292522]">~{totalHours} hrs</span>
          </div>

          <div className="hidden md:block pl-4">
            <span className="text-[10px] uppercase text-[#786C62] block tracking-wider">
              Average Volume
            </span>
            <span className="font-serif text-lg font-bold text-[#5A4F45]">
              {averagePages} pages
            </span>
          </div>
        </div>

        {/* Shelf Arrangement Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[10px] uppercase tracking-wider text-[#786C62] hidden lg:inline">
            Shelf Stack:
          </span>
          <div className="inline-flex rounded-xl bg-white p-0.5 border border-[#E8DED2] shadow-2xs">
            <button
              type="button"
              onClick={() => setShelfLayout('double')}
              title="Two-Tier Bookcase"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                shelfLayout === 'double'
                  ? 'bg-[#292522] text-white shadow-2xs'
                  : 'text-[#786C62] hover:text-[#292522]'
              }`}
            >
              <PiColumnsBold className="text-sm" />
              <span>Two Tiers</span>
            </button>
            <button
              type="button"
              onClick={() => setShelfLayout('single')}
              title="Single Horizontal Shelf"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                shelfLayout === 'single'
                  ? 'bg-[#292522] text-white shadow-2xs'
                  : 'text-[#786C62] hover:text-[#292522]'
              }`}
            >
              <PiSquaresFourBold className="text-sm" />
              <span>Single Ledge</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D HARDWOOD BOOKCASE UNIT */}
      <div className="relative rounded-3xl bg-[#140D09] border-4 border-[#2A1B12] shadow-2xl overflow-hidden p-3 sm:p-5">
        {/* Deep Wood Grain Ambient Shadows & Crown Molding */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/25 to-black/85 pointer-events-none" />

        {/* Side Solid Wood Pilasters with Brass Shelf Pin Inlays */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#20150E] to-[#120B07] border-r border-[#3A2417] pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#20150E] to-[#120B07] border-l border-[#3A2417] pointer-events-none" />

        <div className="relative z-10 space-y-8 py-2">
          {tiers.map((tier, tierIdx) => (
            <div key={tierIdx} className="relative pt-6">
              {/* Shelf Compartment Backboard with Vertical Wood Slats */}
              <div
                className="absolute inset-x-2 top-0 bottom-4 bg-[#19100B] rounded-xl opacity-90 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.015) 49px, transparent 50px)',
                }}
              />

              {/* Standing Book Spines Flex Container */}
              <div className="relative z-10 flex items-end justify-center overflow-x-auto no-scrollbar gap-1 sm:gap-1.5 px-4 sm:px-6 h-[310px] pb-3">
                {/* Left Brass Antique Bookend */}
                <div className="flex-shrink-0 flex flex-col items-center justify-end h-[220px] w-9 mr-1 select-none pointer-events-none opacity-85">
                  <div className="w-6 h-36 rounded-t-lg bg-gradient-to-r from-[#8C6D39] via-[#D4B36A] to-[#6A522A] shadow-md border-t border-l border-[#FFE8A3]/50 flex items-center justify-center">
                    <span className="font-serif text-amber-950 font-bold text-xs opacity-70">
                      ❦
                    </span>
                  </div>
                  <div className="w-9 h-4 bg-gradient-to-r from-[#6A522A] via-[#B89851] to-[#543F1D] rounded-xs shadow-md border-t border-[#FFE8A3]/30" />
                </div>

                {tier.books.map((book, idx) => {
                  const globalIdx = tierIdx * midPoint + idx;
                  const pages = book.pageCount || 280;
                  // Width proportional to page count: 34px to 62px
                  const width = Math.min(62, Math.max(34, Math.round(pages / 11)));
                  // Height naturally staggered between 245px and 290px
                  const height = Math.min(290, Math.max(242, 248 + ((globalIdx * 7) % 44)));
                  const spine = getSpineStyle(book.category, globalIdx);
                  const isHovered = hoveredBook?._id === book._id;
                  const isLast = idx === tier.books.length - 1 && tier.books.length > 4;

                  return (
                    <div
                      key={book._id}
                      onMouseEnter={() => {
                        playBookSpineSlide();
                        setHoveredBook(book);
                      }}
                      onMouseLeave={() => setHoveredBook(null)}
                      onClick={() => handleSpineClick(book)}
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        transform: isHovered
                          ? 'translateY(-26px) scale(1.04)'
                          : isLast
                          ? 'rotate(8deg) translateY(4px)'
                          : 'translateY(0)',
                        boxShadow: isHovered
                          ? `0 24px 32px -8px ${spine.shadow}, 0 0 16px rgba(255,223,150,0.25)`
                          : `0 8px 16px -4px rgba(0,0,0,0.6)`,
                        transition:
                          'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
                      }}
                      className={`group relative flex-shrink-0 cursor-pointer select-none rounded-t-sm bg-gradient-to-r ${spine.gradient} border-t-2 border-r border-l ${spine.border} flex flex-col justify-between py-3 px-1 text-center`}
                    >
                      {/* Top Horizontal Leather Raised Spine Ribs */}
                      <div className="space-y-1.5 w-full opacity-80">
                        <div
                          className="w-full h-1 rounded-full shadow-inner"
                          style={{ backgroundColor: spine.rib }}
                        />
                        <div
                          className="w-full h-1 rounded-full shadow-inner"
                          style={{ backgroundColor: spine.rib }}
                        />
                      </div>

                      {/* Vertical Embossed Title in Gold/Silver Leaf Foil */}
                      <div className="my-auto flex items-center justify-center overflow-hidden px-0.5">
                        <span
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            textShadow:
                              '0 1px 2px rgba(0,0,0,0.9), 0 0 1px rgba(255,230,170,0.5)',
                          }}
                          className={`font-serif text-[11px] sm:text-[12px] font-bold tracking-widest uppercase truncate max-h-[160px] ${spine.foil}`}
                        >
                          {book.title}
                        </span>
                      </div>

                      {/* Bottom Spine Details: Library Stamp & Author Initials */}
                      <div className="mt-auto space-y-1 w-full opacity-85">
                        <div
                          className="w-full h-1 rounded-full shadow-inner"
                          style={{ backgroundColor: spine.rib }}
                        />
                        <div className="flex items-center justify-center gap-1 font-mono text-[8px] uppercase font-bold text-amber-100/70">
                          <span>❦</span>
                          <span className="truncate">
                            {book.author
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || 'PT'}
                          </span>
                        </div>
                      </div>

                      {/* Hanging Silk Velvet Bookmark Ribbon Tail extending below shelf */}
                      <div
                        className={`absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-2.5 h-4.5 ${spine.ribbon} rounded-b-xs shadow-md pointer-events-none transition-transform duration-200 group-hover:translate-y-1`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}
                      />

                      {/* Pinned Bookmark Icon Pill if already in Reading Shelf */}
                      {isBookSaved(book._id) && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#861D2D] text-amber-200 flex items-center justify-center text-[8px] shadow-xs">
                          ★
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Right Decorative Brass Bookend or Terracotta Trinket */}
                <div className="flex-shrink-0 flex flex-col items-center justify-end h-[220px] w-10 ml-2 select-none pointer-events-none">
                  {tierIdx === 0 ? (
                    // Terracotta Potted Plant on top shelf
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-0.5 filter drop-shadow">🌿</span>
                      <div className="w-7 h-8 bg-gradient-to-b from-[#C46A45] to-[#8C3F22] rounded-b-lg border-t-2 border-[#D9825F] shadow-md flex items-center justify-center">
                        <span className="text-[7px] font-mono text-amber-200/80">PT</span>
                      </div>
                    </div>
                  ) : (
                    // Antique Hourglass / Brass Bookend on bottom shelf
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-36 rounded-t-lg bg-gradient-to-r from-[#6A522A] via-[#D4B36A] to-[#8C6D39] shadow-md border-t border-r border-[#FFE8A3]/50 flex items-center justify-center">
                        <span className="font-serif text-amber-950 font-bold text-xs opacity-70">
                          ⏳
                        </span>
                      </div>
                      <div className="w-9 h-4 bg-gradient-to-r from-[#543F1D] via-[#B89851] to-[#6A522A] rounded-xs shadow-md border-t border-[#FFE8A3]/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* SOLID OAK HARDWOOD LEDGE BASE */}
              <div className="relative z-20 h-6 bg-gradient-to-b from-[#69422A] via-[#462B1A] to-[#2E1A0F] border-t-2 border-[#96633E] shadow-2xl rounded-sm flex items-center justify-between px-5 sm:px-8">
                {/* Brass screw heads on wooden ledge */}
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#E6C687] to-[#8C6D39] border border-[#523B17] shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-[0.5px] bg-[#3B280E]" />
                </div>

                {/* Antiqued Brass Library Tier Label Plaque */}
                <div className="px-3 py-0.5 rounded-xs bg-gradient-to-b from-[#D4B36A] via-[#AA863D] to-[#755923] border border-[#FFE8A3]/40 shadow-xs flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-amber-950/60" />
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold text-amber-950">
                    {tier.label}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-amber-950/60" />
                </div>

                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#E6C687] to-[#8C6D39] border border-[#523B17] shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-[0.5px] bg-[#3B280E]" />
                </div>
              </div>

              {/* Deep Cast Shadow Below Shelf Base */}
              <div className="h-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hover Card Summary Callout */}
      {hoveredBook && !selectedBook && (
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8DED2] shadow-xl flex items-center justify-between gap-4 animate-fade-in transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            {hoveredBook.image ? (
              <img
                src={getBookCoverUrl(hoveredBook.image, hoveredBook.title, hoveredBook.isbn)}
                alt={hoveredBook.title}
                loading="lazy"
                decoding="async"
                className="w-12 h-16 object-cover rounded-md shadow-sm border border-[#E8DED2] flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-16 bg-[#FAF7F2] rounded-md flex items-center justify-center flex-shrink-0 border border-[#E8DED2]">
                <PiBookOpenBold className="text-[#827870] text-xl" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#861D2D] font-bold">
                  {hoveredBook.category || 'Curated Volume'} &bull; {hoveredBook.publishYear}
                </span>
                <span className="text-[10px] font-mono text-[#827870]">
                  &bull; {hoveredBook.pageCount || 280} pages
                </span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#292522] truncate mt-0.5">
                {hoveredBook.title}
              </h4>
              <p className="text-xs text-[#695D53] font-serif italic truncate">
                by {hoveredBook.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => handleToggleShelfBookmark(e, hoveredBook)}
              className="p-2 rounded-xl border border-[#E8DED2] hover:bg-[#FAF7F2] text-[#861D2D] transition-colors cursor-pointer"
              title={isBookSaved(hoveredBook._id) ? 'Remove from Shelf' : 'Add to Shelf'}
            >
              {isBookSaved(hoveredBook._id) ? (
                <PiBookmarkSimpleFill className="text-base" />
              ) : (
                <PiBookmarkSimpleBold className="text-base" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSpineClick(hoveredBook)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span>Pull From Shelf</span>
              <PiArrowRightBold className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3D "READING EASEL & BOOKSTAND" INSPECTOR MODAL               */}
      {/* ============================================================== */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs transition-opacity animate-fade-in"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#FFFDF9] rounded-3xl border border-[#E8DED2] shadow-2xl overflow-hidden text-[#292522] my-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Washi Tape Ribbon at Top */}
            <div className="w-28 h-4 bg-[#C99A48]/30 mx-auto -mt-2 mb-2 rounded-xs transform -rotate-1 border-x border-dashed border-white/60 pointer-events-none" />

            {/* Header Ribbon */}
            <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E8DED2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#861D2D]/10 text-[#861D2D] flex items-center justify-center text-sm font-bold">
                  📖
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#292522] leading-none">
                    Volume Pulled From Shelf
                  </h3>
                  <p className="font-mono text-[10px] uppercase text-[#786C62] tracking-wider mt-1">
                    Ex-Libris Reading Stand &bull; {selectedBook.category || 'Literary Classic'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="w-8 h-8 rounded-full hover:bg-[#EFE8DD] flex items-center justify-center text-[#786C62] hover:text-[#292522] transition-colors cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Book Cover on Easel Stand */}
                <div className="relative group flex-shrink-0">
                  {selectedBook.image ? (
                    <img
                      src={getBookCoverUrl(selectedBook.image, selectedBook.title, selectedBook.isbn)}
                      alt={selectedBook.title}
                      loading="eager"
                      decoding="async"
                      className="w-32 h-48 sm:w-36 sm:h-52 object-cover rounded-xl shadow-xl border border-[#E8DED2] transform group-hover:scale-102 transition-transform"
                    />
                  ) : (
                    <div className="w-32 h-48 sm:w-36 sm:h-52 bg-[#FAF7F2] rounded-xl flex items-center justify-center border border-[#E8DED2]">
                      <PiBookOpenBold className="text-3xl text-[#827870]" />
                    </div>
                  )}

                  {/* Bookmark Silk Ribbon Tag */}
                  <div className="absolute -top-1.5 left-4 w-3.5 h-6 bg-[#861D2D] rounded-b-xs shadow-xs pointer-events-none" />
                </div>

                {/* Details Column */}
                <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#861D2D] block">
                      Published in {selectedBook.publishYear}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#292522] leading-snug mt-0.5">
                      {selectedBook.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#695D53] font-serif italic mt-0.5">
                      by {selectedBook.author}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DED2] text-[10px] font-mono font-semibold text-[#786C62]">
                      📄 {selectedBook.pageCount || 280} Pages
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DED2] text-[10px] font-mono font-semibold text-[#786C62]">
                      ⏳ ~{Math.round((selectedBook.pageCount || 280) / 50)} hrs read
                    </span>
                    {selectedBook.rating && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono font-bold text-amber-800 flex items-center gap-1">
                        <PiStarFill className="text-amber-500 text-xs" />
                        <span>{selectedBook.rating} / 5</span>
                      </span>
                    )}
                  </div>

                  {/* Synopsis / Excerpt */}
                  <p className="text-xs text-[#5A4F45] font-serif leading-relaxed line-clamp-3 italic">
                    &ldquo;
                    {selectedBook.description ||
                      'An extraordinary literary journey celebrating the depths of imagination, timeless human truths, and quiet contemplative reading.'}
                    &rdquo;
                  </p>
                </div>
              </div>

              {/* Embedded Interactive Page Flip Preview when toggled */}
              {showPageFlip && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED2] animate-fade-in">
                  <PageFlipPreview book={selectedBook} />
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-[#E8DED2] flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => navigate(`/books/details/${selectedBook._id}`)}
                  className="flex-1 py-2.5 px-5 rounded-full bg-gradient-to-r from-[#7B1826] via-[#861D2D] to-[#6E1421] text-white text-xs font-semibold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PiBookOpenTextBold className="text-sm" />
                  <span>Open Full Volume</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPageFlip(!showPageFlip)}
                  className="py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#292522] text-xs font-semibold border border-[#E8DED2] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PiSparkleBold className="text-xs text-[#861D2D]" />
                  <span>{showPageFlip ? 'Hide Sample Pages' : 'Flip Pages'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleToggleShelfBookmark(e, selectedBook)}
                  className={`py-2.5 px-4 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isBookSaved(selectedBook._id)
                      ? 'bg-[#861D2D] text-white'
                      : 'bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#292522] border border-[#E8DED2]'
                  }`}
                >
                  {isBookSaved(selectedBook._id) ? (
                    <>
                      <PiBookmarkSimpleFill className="text-xs" />
                      <span>On Shelf</span>
                    </>
                  ) : (
                    <>
                      <PiBookmarkSimpleBold className="text-xs text-[#861D2D]" />
                      <span>Pin to Shelf</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSpineShelf;
