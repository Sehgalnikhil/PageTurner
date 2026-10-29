import React, { useState, useEffect, useMemo } from 'react';
import BookPinCard from './BookPinCard';
import EditorialQuoteTile from './EditorialQuoteTile';

/**
 * BooksMasonry — Authentic Pinterest-Style Discovery Layout
 *
 * Implements a true row-ordered waterfall column masonry system:
 * - Distributes books left-to-right across responsive columns
 * - Staggers card heights naturally according to actual cover dimensions
 * - When a collection is selected (e.g. 2–3 books), caps column count and centers them
 *   at natural pin width (~260–290px) without giant stretched cards or blank columns
 * - Completely eliminates hover-induced layout shifts
 */
const BooksMasonry = ({ books = [], isCollectionActive = false }) => {
  if (!books || books.length === 0) return null;

  // Responsive column count matching Pinterest density
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 60);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine standard Pinterest column count based on available screen width
  const responsiveColumns = useMemo(() => {
    if (windowWidth < 520) return 1;
    if (windowWidth < 780) return 2;
    if (windowWidth < 1120) return 3;
    if (windowWidth < 1440) return 4;
    return 5;
  }, [windowWidth]);

  // When filtered to a small collection (e.g. 1–3 books), cap columns to avoid
  // giant stretched posters and ensure books appear side-by-side in row 1
  const columnCount = Math.max(1, Math.min(responsiveColumns, books.length));

  // Prepare items list: interleave editorial quote tiles ONLY in full catalog browsing
  const items = useMemo(() => {
    if (isCollectionActive || books.length < 8) {
      return books.map((book, idx) => ({
        type: 'book',
        book,
        key: book._id || idx,
        isFeatured: idx % 6 === 2,
        index: idx,
      }));
    }

    // Interleave quotes at widely spaced intervals so they never cluster together
    const list = [];
    let quoteIndex = 0;
    books.forEach((book, idx) => {
      if (idx === 4) {
        list.push({ type: 'quote', quoteIndex: quoteIndex++, key: 'quote-0' });
      } else if (idx === 11) {
        list.push({ type: 'quote', quoteIndex: quoteIndex++, key: 'quote-1' });
      } else if (idx === 18) {
        list.push({ type: 'quote', quoteIndex: quoteIndex++, key: 'quote-2' });
      }

      list.push({
        type: 'book',
        book,
        key: book._id || idx,
        isFeatured: idx % 6 === 2,
        index: idx,
      });
    });
    return list;
  }, [books, isCollectionActive]);

  // Distribute items across columns in left-to-right round-robin order
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols;
  }, [items, columnCount]);

  // Constrain container width for small collections so pins remain at standard Pinterest width (~270px)
  const containerMaxWidth = useMemo(() => {
    if (columnCount === 1) return 'max-w-[320px]';
    if (columnCount === 2) return 'max-w-[620px]';
    if (columnCount === 3) return 'max-w-[940px]';
    if (columnCount === 4) return 'max-w-[1260px]';
    return 'max-w-[1540px]';
  }, [columnCount]);

  return (
    <div className={`w-full mx-auto ${containerMaxWidth} transition-all duration-300`}>
      <div className="flex justify-center items-start gap-5 sm:gap-6">
        {columns.map((colItems, colIdx) => (
          <div
            key={colIdx}
            className="flex-1 min-w-0 max-w-[310px] flex flex-col gap-5 sm:gap-6"
          >
            {colItems.map((item) => {
              if (item.type === 'quote') {
                return (
                  <EditorialQuoteTile
                    key={item.key}
                    quoteIndex={item.quoteIndex}
                  />
                );
              }
              return (
                <BookPinCard
                  key={item.key}
                  book={item.book}
                  index={item.index}
                  isFeatured={item.isFeatured}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksMasonry;
