import React from 'react';
import { PiBookOpenBold } from 'react-icons/pi';

const PageLoader = () => {
  return (
    <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6EE] text-[#302A27] px-4">
      <div className="relative flex flex-col items-center">
        {/* Pulsing book icon in ivory card */}
        <div className="w-14 h-14 rounded-2xl bg-[#FFFDF9] border border-[#E9DED0] shadow-sm flex items-center justify-center text-[#92283F] animate-pulse">
          <PiBookOpenBold className="text-2xl animate-bounce" />
        </div>

        {/* Shimmer line */}
        <div className="w-32 h-1 bg-[#E9DED0] rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#92283F] to-transparent animate-[shimmer_1.4s_infinite]" />
        </div>

        <span className="font-serif italic text-xs text-[#84766B] mt-2 tracking-wide">
          Turning pages...
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
