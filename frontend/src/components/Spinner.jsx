import React from 'react';

const Spinner = ({ message = 'Loading collection...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-stone-200 border-t-burgundy animate-spin"></div>
      </div>
      {message && (
        <p className="mt-3 text-xs font-serif italic text-stone-500">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;