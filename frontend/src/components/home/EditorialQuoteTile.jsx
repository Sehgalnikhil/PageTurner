import React from 'react';
import { PiQuotesBold, PiBookOpenTextBold } from 'react-icons/pi';

const EDITORIAL_QUOTES = [
  {
    quote: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
    work: "De Republica",
    tone: "bg-[#F7F2E7] border-[#E8DEC8]",
  },
  {
    quote: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    work: "Literary Reflections",
    tone: "bg-[#F3EFE6] border-[#E2D8C3]",
  },
  {
    quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    work: "A Dance with Dragons",
    tone: "bg-[#FAF4EB] border-[#EADECB]",
  },
  {
    quote: "Books are a uniquely portable magic.",
    author: "Stephen King",
    work: "On Writing",
    tone: "bg-[#F4EEE4] border-[#DECFC0]",
  },
];

const EditorialQuoteTile = ({ quoteIndex = 0 }) => {
  const item = EDITORIAL_QUOTES[quoteIndex % EDITORIAL_QUOTES.length];

  return (
    <div
      className={`group w-full rounded-2xl p-6 sm:p-7 border ${item.tone} text-stone-900 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-220 ease-out relative overflow-hidden flex flex-col justify-between`}
    >
      {/* Decorative quote mark with micro-rotation & scale on hover */}
      <PiQuotesBold className="text-3xl sm:text-4xl text-burgundy/25 group-hover:text-burgundy/45 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 ease-out mb-3 origin-top-left" />

      {/* Quote text: stationary and readable */}
      <blockquote className="font-serif text-base sm:text-lg italic font-normal text-stone-800 leading-snug mb-4">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      {/* Author & Attribution with refined badge */}
      <div className="pt-3 border-t border-stone-300/60 flex items-center justify-between text-xs">
        <div>
          <span className="font-serif font-bold text-stone-900 block">
            {item.author}
          </span>
          <span className="text-[10px] text-stone-500 font-mono">
            {item.work}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-stone-200/80 text-[10px] text-stone-600 group-hover:border-burgundy/30 group-hover:bg-white transition-all duration-200 shadow-xs">
          <PiBookOpenTextBold className="text-xs text-burgundy group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
            Excerpt
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditorialQuoteTile;
