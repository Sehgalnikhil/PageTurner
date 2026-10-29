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

  const toggleBook = (book, initialStatus = 'want-to-read') => {
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
            readingStatus: initialStatus,
            progress: initialStatus === 'finished' ? 100 : initialStatus === 'currently-reading' ? 68 : 0,
            notes: '',
            journalNotes: [],
            highlights: [],
            savedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const updateBookStatus = (bookId, status, notes = null, progress = null) => {
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const newStatus = status !== undefined && status !== null ? status : item.readingStatus;
          let newProgress = progress !== null && progress !== undefined ? progress : item.progress;
          if (progress === null || progress === undefined) {
            if (newStatus === 'finished') newProgress = 100;
            else if (newStatus === 'currently-reading' && (!newProgress || newProgress === 0)) newProgress = 68;
            else if (newStatus === 'want-to-read' && newProgress === 100) newProgress = 0;
          }

          return {
            ...item,
            readingStatus: newStatus,
            progress: newProgress,
            notes: notes !== null ? notes : item.notes,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const updateBookProgress = (bookId, progress) => {
    const clampedProgress = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const newStatus = clampedProgress >= 100 ? 'finished' : clampedProgress > 0 ? 'currently-reading' : item.readingStatus;
          return {
            ...item,
            progress: clampedProgress,
            readingStatus: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const addBookNote = (bookId, noteText) => {
    if (!noteText || !noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: noteText.trim(),
      createdAt: new Date().toISOString(),
    };
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const currentNotes = Array.isArray(item.journalNotes) ? item.journalNotes : [];
          return {
            ...item,
            notes: item.notes ? `${item.notes}\n\n${noteText.trim()}` : noteText.trim(),
            journalNotes: [newNote, ...currentNotes],
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const deleteBookNote = (bookId, noteId) => {
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const currentNotes = Array.isArray(item.journalNotes) ? item.journalNotes : [];
          const filtered = currentNotes.filter((n) => n.id !== noteId);
          return {
            ...item,
            journalNotes: filtered,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const addBookHighlight = (bookId, { quote, page = '', note = '' }) => {
    if (!quote || !quote.trim()) return;
    const newHighlight = {
      id: `hl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      quote: quote.trim(),
      page: page ? String(page).trim() : '',
      note: note ? note.trim() : '',
      createdAt: new Date().toISOString(),
    };
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const currentHl = Array.isArray(item.highlights) ? item.highlights : [];
          return {
            ...item,
            highlights: [newHighlight, ...currentHl],
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const deleteBookHighlight = (bookId, highlightId) => {
    setReadingList((prev) =>
      prev.map((item) => {
        if (item._id === bookId) {
          const currentHl = Array.isArray(item.highlights) ? item.highlights : [];
          return {
            ...item,
            highlights: currentHl.filter((h) => h.id !== highlightId),
            lastUpdated: new Date().toISOString(),
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
        updateBookProgress,
        addBookNote,
        deleteBookNote,
        addBookHighlight,
        deleteBookHighlight,
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
