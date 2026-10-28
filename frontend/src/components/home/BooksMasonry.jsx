import React from 'react';
import BookPinCard from './BookPinCard';
import EditorialQuoteTile from './EditorialQuoteTile';

const BooksMasonry = ({ books = [] }) => {
  if (!books.length) return null;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
      {books.map((book, idx) => {
        // Every 5th book receives featured curator treatment with synopsis excerpt
        const isFeatured = idx % 5 === 2;

        return (
          <React.Fragment key={book._id}>
            {/* Inject literary quote tile after book 2 and book 9 */}
            {idx === 2 && <EditorialQuoteTile quoteIndex={0} />}
            {idx === 8 && <EditorialQuoteTile quoteIndex={1} />}
            {idx === 15 && <EditorialQuoteTile quoteIndex={2} />}

            <BookPinCard
              book={book}
              index={idx}
              isFeatured={isFeatured}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BooksMasonry;
