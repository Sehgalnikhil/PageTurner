import React, { useRef } from 'react';
import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiPlusBold,
  PiSparkleBold,
  PiClockBold,
  PiFireBold,
  PiHeartBold,
} from 'react-icons/pi';
import ParlourCard from './ParlourCard';

const ParlourCarouselRow = ({ title, icon: Icon, badge, parlours, onEnter, onToggleJoin }) => {
  const rowRef = useRef(null);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 360, behavior: 'smooth' });
  };

  if (!parlours || parlours.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Row Header with Category Title & Carousel Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9DDCC]/70">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-base text-[#812638]" />}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#32221D]">
            {title}
          </h3>
          {badge && (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#812638]/10 text-[#812638] font-semibold">
              {badge}
            </span>
          )}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label={`Scroll ${title} left`}
            className="w-7 h-7 rounded-full bg-[#FFFCF6] hover:bg-[#F7F2E9] border border-[#E9DDCC] flex items-center justify-center text-xs text-[#32221D] hover:text-[#812638] shadow-2xs transition-colors cursor-pointer"
          >
            <PiCaretLeftBold />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label={`Scroll ${title} right`}
            className="w-7 h-7 rounded-full bg-[#FFFCF6] hover:bg-[#F7F2E9] border border-[#E9DDCC] flex items-center justify-center text-xs text-[#32221D] hover:text-[#812638] shadow-2xs transition-colors cursor-pointer"
          >
            <PiCaretRightBold />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none scroll-smooth"
      >
        {parlours.map((p) => (
          <div key={p.id || p._id || p.slug} className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start">
            <ParlourCard
              parlour={p}
              onEnter={onEnter}
              onToggleJoin={onToggleJoin}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ParlourDiscoverySections = ({
  parlours = [],
  selectedMood = 'All',
  searchQuery = '',
  onEnterParlour,
  onToggleJoin,
  onOpenCreateModal,
}) => {
  const joinedParlours = parlours.filter((p) => p.joined);

  // Filter parlours by search and mood
  const filteredBySearch = parlours.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.desc?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.currentBook?.toLowerCase().includes(q)
    );
  });

  // Parlours Popular This Week (sorted by members)
  const popularParlours = [...parlours].sort((a, b) => (b.members || 0) - (a.members || 0));

  // Parlours Starting Soon / with meeting times
  const startingSoonParlours = parlours.filter((p) => p.meetingTime || p.readingWeek);

  // Discover by Mood (matching category)
  const moodParlours = filteredBySearch.filter((p) => {
    if (selectedMood === 'All') return true;
    const cat = (p.category || '').toLowerCase();
    const mood = selectedMood.toLowerCase();
    return cat.includes(mood) || mood.includes(cat);
  });

  return (
    <div className="space-y-6 text-left">
      {/* 1. YOUR LITERARY CIRCLES (If joined any) */}
      {joinedParlours.length > 0 && (
        <ParlourCarouselRow
          title="Your Literary Circles"
          icon={PiHeartBold}
          badge={`${joinedParlours.length} Active`}
          parlours={joinedParlours}
          onEnter={onEnterParlour}
          onToggleJoin={onToggleJoin}
        />
      )}

      {/* 2. POPULAR THIS WEEK */}
      <ParlourCarouselRow
        title="Popular This Week"
        icon={PiFireBold}
        badge="Trending"
        parlours={popularParlours}
        onEnter={onEnterParlour}
        onToggleJoin={onToggleJoin}
      />

      {/* 3. PARLOURS STARTING SOON */}
      <ParlourCarouselRow
        title="Parlours Starting Soon"
        icon={PiClockBold}
        badge="Active Sittings"
        parlours={startingSoonParlours}
        onEnter={onEnterParlour}
        onToggleJoin={onToggleJoin}
      />

      {/* 4. DISCOVER BY READING MOOD / ALL PARLOURS GRID */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9DDCC]/70">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#32221D]">
              {selectedMood === 'All' ? 'Discover All Literary Parlours' : `Parlours in ${selectedMood}`}
            </h3>
            <p className="text-xs text-[#827363] mt-0.5">
              Explore intimate thematic sanctuaries gathered around specific canons and philosophical inquiry.
            </p>
          </div>
          <span className="font-mono text-xs text-[#827363]">
            {moodParlours.length} available
          </span>
        </div>

        {/* 3-Column Parlours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {moodParlours.map((p) => (
            <ParlourCard
              key={p.id || p._id || p.slug}
              parlour={p}
              onEnter={onEnterParlour}
              onToggleJoin={onToggleJoin}
            />
          ))}

          {/* Found a New Parlour Studio Card */}
          <div
            onClick={onOpenCreateModal}
            className="p-6 rounded-2xl border-2 border-dashed border-[#E9DDCC] hover:border-[#812638] bg-[#FFFCF6]/60 flex flex-col items-center justify-center text-center cursor-pointer group transition-all min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#F7F2E9] group-hover:bg-[#812638] group-hover:text-white text-[#812638] flex items-center justify-center transition-all mb-3 shadow-xs">
              <PiPlusBold className="text-xl" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#32221D] group-hover:text-[#812638] transition-colors">
              Found a New Parlour
            </h3>
            <p className="text-xs text-[#827363] mt-1 max-w-xs leading-relaxed">
              Create a dedicated sanctuary for an author, book series, or philosophy reading group.
            </p>
            <span className="mt-4 text-xs font-semibold text-[#812638] group-hover:underline">
              Open Parlour Studio &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParlourDiscoverySections;

