import React from 'react';

export const LITERARY_MOODS = [
  { id: 'All', label: 'All', matchCategories: [] },
  { id: 'Classics', label: 'Classics', matchCategories: ['Russian Classics', 'Gothic & Victorian', 'Slow Reading'] },
  { id: 'Gothic Fiction', label: 'Gothic Fiction', matchCategories: ['Gothic & Victorian', 'Gothic'] },
  { id: 'Philosophy', label: 'Philosophy', matchCategories: ['Nocturnal Philosophy', 'Philosophy'] },
  { id: 'Poetry', label: 'Poetry', matchCategories: ['Romantic Poetry', 'Poetry'] },
  { id: 'Mystery', label: 'Mystery', matchCategories: ['Gothic & Victorian', 'Mystery'] },
  { id: 'Romance', label: 'Romance', matchCategories: ['Romantic Poetry', 'Romance'] },
  { id: 'Fantasy', label: 'Fantasy', matchCategories: ['Sci-Fi', 'Fantasy', 'Gothic & Victorian'] },
  { id: 'Psychology', label: 'Psychology', matchCategories: ['Russian Classics', 'Nocturnal Philosophy'] },
  { id: 'Historical Fiction', label: 'Historical Fiction', matchCategories: ['Russian Classics', 'Historical'] },
  { id: 'Slow Reading', label: 'Slow Reading', matchCategories: ['Slow Reading'] },
];

const LiteraryMoodPills = ({ selectedMood = 'All', onSelectMood }) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {LITERARY_MOODS.map((mood) => {
          const isActive = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(mood.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#812638] text-[#FFFDF9] shadow-[0_2px_8px_rgba(129,38,56,0.3)] ring-1 ring-[#B18A51]/40 font-semibold'
                  : 'bg-[#FFFCF6] text-[#63554A] hover:text-[#32221D] hover:bg-[#F3ECE1] border border-[#E9DDCC]'
              }`}
            >
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LiteraryMoodPills;
