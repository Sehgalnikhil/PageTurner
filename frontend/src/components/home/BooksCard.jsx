import React from 'react';
import BooksMasonry from './BooksMasonry';

const BooksCard = ({ books = [] }) => {
  return <BooksMasonry books={books} />;
};

export default BooksCard;
