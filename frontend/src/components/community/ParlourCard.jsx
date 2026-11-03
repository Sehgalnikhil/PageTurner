import React from 'react';
import {
  PiUsersBold,
  PiBookOpenBold,
  PiClockBold,
  PiCheckBold,
  PiArrowRightBold,
  PiSparkleBold,
} from 'react-icons/pi';

const ParlourCard = ({
  parlour,
  onEnter,
  onToggleJoin,
  compact = false,
}) => {
  const isJoined = Boolean(parlour.joined);

  return (
    <article
      onClick={() => onEnter(parlour.id || parlour.slug)}
      className="group relative rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] hover:border-[#B18A51]/60 shadow-[0_2px_12px_rgba(50,34,29,0.04)] hover:shadow-[0_12px_32px_rgba(50,34,29,0.08)] transition-all duration-300 flex flex-col justify-between overflow-hidden text-left cursor-pointer"
    >
      <div>
        {/* Artwork Header with 16:9 Aspect Ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F0E9DE] select-none">
          <img
            src={parlour.img || '/images/parlour-gothic.jpg'}
            alt={parlour.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/parlour-gothic.jpg';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Genre / Category Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#FFFCF6]/90 backdrop-blur-md text-[#32221D] text-[10.5px] font-mono uppercase tracking-wider font-semibold border border-[#E9DDCC]/80 shadow-xs">
            {parlour.category || 'Reading Circle'}
          </div>

          {/* Active Readers Online Badge */}
          {parlour.activeNow > 0 && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#E8C4A0] text-[10px] font-mono flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{parlour.activeNow} online</span>
            </div>
          )}

          {/* Joined Status Badge on Image */}
          {isJoined && (
            <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-full bg-[#812638] text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs border border-white/20">
              <PiCheckBold className="text-xs" />
              <span>Joined</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Title & Description */}
          <h3 className="font-serif text-base sm:text-[17px] font-bold text-[#32221D] group-hover:text-[#812638] transition-colors leading-snug">
            {parlour.title}
          </h3>

          <p className="text-xs text-[#827363] mt-1 line-clamp-2 leading-relaxed">
            {parlour.desc}
          </p>

          {/* Current Group Read Pill (Fable Inspiration) */}
          {(parlour.currentBook || parlour.currentBookCover) && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-[#F7F2E9]/80 border border-[#E9DDCC] flex items-center gap-2.5">
              {parlour.currentBookCover ? (
                <img
                  src={parlour.currentBookCover}
                  alt={parlour.currentBook}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80';
                  }}
                  className="w-7 h-10 object-cover rounded shadow-2xs border border-[#E9DDCC] flex-shrink-0"
                />
              ) : (
                <div className="w-7 h-10 rounded bg-[#812638]/10 text-[#812638] flex items-center justify-center flex-shrink-0">
                  <PiBookOpenBold className="text-xs" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#812638] font-bold block leading-none mb-0.5">
                  Current Group Read
                </span>
                <p className="font-serif font-bold text-xs text-[#32221D] truncate">
                  {parlour.currentBook || 'Reading in Progress'}
                </p>
                <span className="text-[10.5px] text-[#827363] truncate block">
                  {parlour.currentBookAuthor || 'Canonical Selection'}
                </span>
              </div>
            </div>
          )}

          {/* Next Discussion / Meeting Schedule if available */}
          {parlour.meetingTime && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-[#827363] font-mono">
              <PiClockBold className="text-xs text-[#B18A51]" />
              <span className="truncate">{parlour.meetingTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Members & Actions */}
      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-[#E9DDCC]/70 flex items-center justify-between gap-2 mt-2">
        {/* Member Count & Avatars */}
        <div className="flex items-center gap-1.5 text-xs text-[#827363]">
          <PiUsersBold className="text-sm text-[#827363]" />
          <span className="font-mono text-[11px] font-medium text-[#32221D]">
            {parlour.members || 0}
          </span>
          <span className="text-[11px] hidden sm:inline">members</span>
        </div>

        {/* Action Buttons: Join Toggle + Enter */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleJoin(parlour.id || parlour.slug);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              isJoined
                ? 'bg-transparent text-[#827363] hover:text-[#812638] hover:bg-[#812638]/5 border border-[#E9DDCC]'
                : 'bg-[#FFFCF6] hover:bg-[#812638] text-[#812638] hover:text-white border border-[#812638]/40 shadow-2xs'
            }`}
          >
            {isJoined ? 'Leave' : 'Join'}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnter(parlour.id || parlour.slug);
            }}
            className="px-3.5 py-1 rounded-full bg-[#812638] hover:bg-[#6A1F2E] text-white text-[11px] font-medium transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Enter</span>
            <PiArrowRightBold className="text-[10px]" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ParlourCard;

