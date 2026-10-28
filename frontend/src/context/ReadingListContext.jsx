import React, { createContext, useState, useEffect } from 'react';

// Global Context for Bookmarks & Reading List
export const ReadingListContext = createContext();

export const ReadingListProvider = ({ children }) => {
  const [readingList, setReadingList] = useState(() => {
    try {
      const stored = localStorage.getItem('pageTurner_readingList');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('pageTurner_readingList', JSON.stringify(readingList));
    } catch (e) {
      console.error('Failed to save reading list to localStorage', e);
    }
  }, [readingList]);

  const toggleBook = (book) => {
    setReadingList((prev) => {
      const exists = prev.some((b) => b._id === book._id);
      if (exists) {
        return prev.filter((b) => b._id !== book._id);
      } else {
        return [
          {
            _id: book._id,
            title: book.title,
            author: book.author,
            publishYear: book.publishYear,
            category: book.category,
            image: book.image,
            averageRating: book.averageRating || 0,
            readingStatus: 'want-to-read',
            notes: '',
            savedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const updateBookStatus = (bookId, status, notes = null) => {
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          return {
            ...item,
            readingStatus: status !== undefined ? status : item.readingStatus,
            notes: notes !== null ? notes : item.notes,
          };
        }
        return item;
      })
    );
  };

  const removeFromList = (bookId) => {
    setReadingList((prev) => prev.filter((b) => b._id !== bookId));
  };

  const isBookSaved = (bookId) => {
    return readingList.some((b) => b._id === bookId);
  };

  const getSavedBook = (bookId) => {
    return readingList.find((b) => b._id === bookId);
  };

  const clearList = () => {
    setReadingList([]);
  };

  return (
    <ReadingListContext.Provider
      value={{
        readingList,
        count: readingList.length,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleBook,
        updateBookStatus,
        removeFromList,
        isBookSaved,
        getSavedBook,
        clearList,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
};
