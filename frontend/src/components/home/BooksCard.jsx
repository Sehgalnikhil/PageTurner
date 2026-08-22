import React from 'react';
import BookSingleCard from './BookSingleCard';

const BooksCard = ({ books = [] }) => {
  if (!books.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {books.map((item) => (
        <BookSingleCard key={item._id} book={item} />
      ))}
    </div>
  );
};

export default BooksCard;
