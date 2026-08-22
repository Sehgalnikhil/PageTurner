import React from 'react';

const Spinner = ({ message = 'Loading books...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-slate-800 animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;