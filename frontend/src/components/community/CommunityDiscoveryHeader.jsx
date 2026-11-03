import React from 'react';
import {
  PiMagnifyingGlassBold,
  PiFeatherBold,
  PiPlusBold,
  PiPaperPlaneRightBold,
  PiXBold,
  PiBookOpenBold,
  PiUsersBold,
} from 'react-icons/pi';

const CommunityDiscoveryHeader = ({
  searchQuery = '',
  onSearchChange,
  onOpenCompose,
  onOpenCreateParlour,
  onOpenLetters,
  activeReadersCount = 218,
  totalReadersCount = 12480,
}) => {
  return (
    <header className="mb-6 rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] p-5 sm:p-7 shadow-[0_4px_20px_rgba(50,34,29,0.04)] relative overflow-hidden text-left">
      {/* Delicate Antique Watermark Corner Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#B18A51]/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* Left Column: Heading, Subtitle & Live Sanctuary Badge */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-[1px] w-5 bg-[#B18A51]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#812638]">
              The Readers’ Salon &bull; Community Sanctuary
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#2D5A3C] bg-[#2D5A3C]/10 px-2.5 py-0.5 rounded-full ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3C] animate-pulse" />
              {activeReadersCount} Reading Now
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#32221D] tracking-tight leading-tight">
            Find your literary people.
          </h1>

          <p className="font-serif italic text-xs sm:text-[13.5px] text-[#827363] mt-1.5 leading-relaxed">
            A gathering place for readers, thoughtful conversations and stories worth sharing.
          </p>
        </div>

        {/* Right Column: Prominent Primary Actions */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenCompose}
            className="h-10 px-5 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-[#FFFCF6] text-xs sm:text-[13px] font-medium tracking-wide flex items-center gap-2 shadow-[0_4px_14px_rgba(129,38,56,0.3)] hover:shadow-[0_6px_18px_rgba(129,38,56,0.4)] transition-all cursor-pointer active:scale-95 flex-shrink-0"
          >
            <PiFeatherBold className="text-sm text-[#F7D8A4]" />
            <span>Share a Reflection</span>
          </button>

          {/* Secondary Action: Create Parlour */}
          <button
            type="button"
            onClick={onOpenCreateParlour}
            className="h-10 px-4 rounded-full bg-[#F7F2E9] hover:bg-[#EFE7D8] text-[#32221D] text-xs sm:text-[13px] font-medium border border-[#E9DDCC] hover:border-[#B18A51]/60 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 flex-shrink-0"
          >
            <PiPlusBold className="text-xs text-[#812638]" />
            <span>Create a Parlour</span>
          </button>

          {/* Tertiary Action: Poste Restante Letters */}
          <button
            type="button"
            onClick={onOpenLetters}
            title="Open your Literary Mailbox & Dispatched Letters"
            className="h-10 px-3.5 rounded-full bg-[#F7F2E9] hover:bg-[#EFE7D8] text-[#812638] text-xs sm:text-[13px] font-medium border border-[#E9DDCC] hover:border-[#812638]/40 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 flex-shrink-0"
          >
            <span>✉️</span>
            <span className="hidden sm:inline">Poste Restante</span>
          </button>
        </div>
      </div>

      {/* Prominent Functional Search Input Bar */}
      <div className="mt-4 pt-4 border-t border-[#E9DDCC]/70">
        <div className="relative w-full group/search">
          <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#827363] group-focus-within/search:text-[#812638] transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search books, parlours, readers and conversations..."
            className="w-full h-10.5 pl-10 pr-9 rounded-full bg-[#F7F2E9]/70 hover:bg-[#F7F2E9] focus:bg-[#FFFCF6] border border-[#E9DDCC] hover:border-[#B18A51]/50 focus:border-[#812638] text-xs sm:text-[13px] text-[#32221D] placeholder-[#827363]/75 focus:outline-none focus:ring-2 focus:ring-[#812638]/15 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#827363] hover:text-[#32221D] rounded-full cursor-pointer"
            >
              <PiXBold className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CommunityDiscoveryHeader;

