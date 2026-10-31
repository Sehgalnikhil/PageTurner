import React from 'react';
import { PiQuotesBold, PiBookOpenTextBold } from 'react-icons/pi';

const EDITORIAL_QUOTES = [
  {
    quote: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero",
    work: "De Republica",
    tone: "bg-[#FFFDFA] border-[#E8DED1]",
  },
  {
    quote: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    work: "Literary Reflections",
    tone: "bg-[#FAF5ED] border-[#E8DED1]",
  },
  {
    quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    work: "A Dance with Dragons",
    tone: "bg-[#FFFDFA] border-[#D9A9A6]/40",
  },
  {
    quote: "Books are a uniquely portable magic.",
    author: "Stephen King",
    work: "On Writing",
    tone: "bg-[#F7F3EC] border-[#E8DED1]",
  },
];

const EditorialQuoteTile = ({ quoteIndex = 0 }) => {
  const item = EDITORIAL_QUOTES[quoteIndex % EDITORIAL_QUOTES.length];

  return (
    <div
      className={`group w-full rounded-2xl p-6 sm:p-7 border ${item.tone} text-[#302A27] shadow-subtle hover:shadow-card cute-card-tilt transition-all duration-200 ease-out relative overflow-hidden flex flex-col justify-between`}
    >
      {/* Decorative quote mark with subtle color change and float */}
      <PiQuotesBold className="text-3xl text-[#8D263B]/25 group-hover:text-[#8D263B]/60 group-hover:scale-115 transition-all duration-300 mb-3" />

      {/* Quote text: elegant Cormorant Garamond */}
      <blockquote className="font-serif text-lg sm:text-xl italic font-normal text-[#302A27] leading-snug mb-4">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      {/* Author & Attribution */}
      <div className="pt-3 border-t border-[#E8DED1] flex items-center justify-between text-xs">
        <div>
          <span className="font-serif font-medium text-[#302A27] block text-sm">
            {item.author}
          </span>
          <span className="text-[10px] text-[#81766D] font-mono">
            {item.work}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFDFA] border border-[#E8DED1] text-[10px] text-[#81766D] group-hover:border-[#8D263B]/30 transition-all duration-200 shadow-subtle cute-pill-hover cursor-pointer">
          <PiBookOpenTextBold className="text-xs text-[#8D263B] group-hover:rotate-6 transition-transform" />
          <span className="font-medium text-[#81766D] group-hover:text-[#302A27] transition-colors">
            Excerpt
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditorialQuoteTile;
