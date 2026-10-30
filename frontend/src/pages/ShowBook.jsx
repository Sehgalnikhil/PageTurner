import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import Spinner from '../components/Spinner';
import PageFlipPreview from '../components/home/PageFlipPreview';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { bookService } from '../services/api';
import { useSnackbar } from 'notistack';
import { playWaxSealCrack } from '../utils/soundEffects';
import { getBookCoverUrl } from '../utils/imageHelper';
import {
  PiArrowLeftBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiStarFill,
  PiShareNetworkBold,
  PiDotsThreeBold,
  PiCheckBold,
  PiNotePencilBold,
  PiBookOpenBold,
  PiBookBookmarkBold,
  PiPencilSimpleBold,
  PiTrashBold,
  PiCaretDownBold,
  PiBookOpenTextBold,
  PiXBold,
  PiCaretLeftBold,
  PiCaretRightBold,
  PiPaperPlaneTiltBold,
  PiChatCircleTextBold,
  PiSparkleBold,
  PiPlusBold,
  PiHeartBold,
  PiHeartFill,
  PiArrowSquareOutBold,
} from 'react-icons/pi';

// Curated book data enrichment (quotes, author bios, sentiment, tags)
const BOOK_ENRICHMENTS = {
  'Educated': {
    subtitle: 'A memoir by Tara Westover',
    shortLead: 'An unforgettable memoir about a young girl who broke free from a survivalist childhood to find the power of education.',
    themes: ['Memoir', 'Education', 'Resilience', 'Coming of Age', 'True Story'],
    pullQuote: '“Education was my way out. But it was also my way in.”',
    quoteAuthor: 'TARA WESTOVER',
    readerReviewQuote: '“A story of resilience, education, and the courage to choose a different life.”',
    publisher: 'Random House',
    authorBio: 'Tara Westover is an American author and historian. Her memoir Educated has been translated into multiple languages and has become a global literary phenomenon.',
    sentiment: {
      lifeChanging: 62,
      inspiring: 78,
      emotional: 54,
      thoughtProvoking: 71,
      wellWritten: 88,
    },
    moodboardItems: [
      { id: 1, type: 'cover', title: 'First Edition Jacket', src: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg' },
      { id: 2, type: 'photo', title: 'Typeset Pages', src: '/images/editorial/moodboard_open_book.jpg' },
      { id: 3, type: 'photo', title: 'Buck\'s Peak, Idaho', src: '/images/editorial/moodboard_mountain.jpg' },
      { id: 4, type: 'photo', title: 'Writer\'s Desk', src: '/images/editorial/moodboard_reading_nook.jpg' },
      { id: 5, type: 'art', title: 'Archive Ephemera', src: '/images/editorial/botanical_flower.jpg' },
    ],
  },
  'The Picture of Dorian Gray': {
    subtitle: 'A philosophical novel by Oscar Wilde',
    shortLead: 'A decadent tale of youth, vanity, and the moral corruption of an eternally ageless gentleman.',
    themes: ['Gothic', 'Philosophy', 'Aestheticism', 'Morality', 'Classic'],
    pullQuote: '“To define is to limit. Behind every exquisite thing that existed, there was something tragic.”',
    quoteAuthor: 'OSCAR WILDE',
    readerReviewQuote: '“Wilde’s epigrams and philosophical musings on beauty and morality remain peerless.”',
    publisher: 'Ward, Lock and Co.',
    authorBio: 'Oscar Wilde was an Irish poet and playwright. Celebrated for his biting wit, flamboyant aestheticism, and masterpieces like The Importance of Being Earnest.',
    sentiment: {
      lifeChanging: 48,
      inspiring: 65,
      emotional: 59,
      thoughtProvoking: 92,
      wellWritten: 95,
    },
    moodboardItems: [
      { id: 1, type: 'cover', title: 'Lippincott’s Original', src: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg' },
      { id: 2, type: 'photo', title: 'Gilded Leaf Pages', src: '/images/editorial/moodboard_open_book.jpg' },
      { id: 3, type: 'photo', title: 'Victorian Studio', src: '/images/editorial/moodboard_reading_nook.jpg' },
      { id: 4, type: 'art', title: 'Aesthetic Botanical', src: '/images/editorial/botanical_flower.jpg' },
    ],
  },
  '1984': {
    subtitle: 'A dystopian masterpiece by George Orwell',
    shortLead: 'A chilling depiction of a totalitarian surveillance state where individual thought is a crime.',
    themes: ['Dystopia', 'Surveillance', 'Politics', 'Freedom', 'Classic'],
    pullQuote: '“Freedom is the freedom to say that two plus two make four.”',
    quoteAuthor: 'GEORGE ORWELL',
    readerReviewQuote: '“A haunting, enduring blueprint that warns against ideological conformity and censorship.”',
    publisher: 'Secker & Warburg',
    authorBio: 'Eric Arthur Blair, better known by his pen name George Orwell, was an English novelist, essayist, and critic whose work is marked by lucid prose and opposition to totalitarianism.',
    sentiment: {
      lifeChanging: 74,
      inspiring: 58,
      emotional: 64,
      thoughtProvoking: 98,
      wellWritten: 92,
    },
    moodboardItems: [
      { id: 1, type: 'cover', title: 'Original London Edition', src: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' },
      { id: 2, type: 'photo', title: 'Diary Manuscript', src: '/images/editorial/moodboard_open_book.jpg' },
      { id: 3, type: 'photo', title: 'London Skyline', src: '/images/editorial/moodboard_mountain.jpg' },
      { id: 4, type: 'photo', title: 'Ministry Room', src: '/images/editorial/moodboard_reading_nook.jpg' },
    ],
  },
};

const getFallbackEnrichment = (book) => {
  const cat = book?.category || 'Literature';
  const author = book?.author || 'Author';
  const title = book?.title || 'Literary Classic';
  const coverUrl = getBookCoverUrl(book?.image, book?.title, book?.isbn) || '/images/covers/educated.jpg';

  return {
    subtitle: `A work by ${author}`,
    shortLead: book?.description
      ? book.description.slice(0, 130) + '...'
      : `An evocative exploration within the canon of ${cat}, crafted with literary intentionality.`,
    themes: [cat, 'Literature', 'Curated', 'Philosophy', 'Reflection'],
    pullQuote: `“A reader lives a thousand lives before he dies. The man who never reads lives only one.”`,
    quoteAuthor: author.toUpperCase(),
    readerReviewQuote: `“An enduring volume that continues to reward thoughtful close reading.”`,
    publisher: 'PageTurner Heritage Archive',
    authorBio: `${author} is an acclaimed contributor to ${cat}. Their writing explores timeless human themes with nuance, eloquence, and intellectual rigor.`,
    sentiment: {
      lifeChanging: 55,
      inspiring: 72,
      emotional: 60,
      thoughtProvoking: 78,
      wellWritten: 84,
    },
    moodboardItems: [
      { id: 1, type: 'cover', title: 'Primary Jacket', src: coverUrl },
      { id: 2, type: 'photo', title: 'Typeset Spread', src: '/images/editorial/moodboard_open_book.jpg' },
      { id: 3, type: 'photo', title: 'Setting Inspiration', src: '/images/editorial/moodboard_mountain.jpg' },
      { id: 4, type: 'photo', title: 'Reading Studio', src: '/images/editorial/moodboard_reading_nook.jpg' },
    ],
  };
};

const ShowBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const {
    isBookSaved,
    toggleBook,
    getSavedBook,
    updateBookStatus,
    updateBookProgress,
    addBookNote,
    deleteBookNote,
    addBookHighlight,
    deleteBookHighlight,
  } = useContext(ReadingListContext);
  const { enqueueSnackbar } = useSnackbar();

  const [book, setBook] = useState({});
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews' | 'notes' | 'highlights' | 'similar'

  // Synopsis expansion
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSort, setReviewSort] = useState('recent'); // 'recent' | 'highest' | 'lowest'
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  // Personal notes & highlights inputs
  const [newNoteText, setNewNoteText] = useState('');
  const [newHlQuote, setNewHlQuote] = useState('');
  const [newHlPage, setNewHlPage] = useState('');
  const [newHlNote, setNewHlNote] = useState('');
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [showAddHlForm, setShowAddHlForm] = useState(false);

  // Reader preview collapse toggle
  const [isReaderExpanded, setIsReaderExpanded] = useState(false);

  // Moodboard thumbnail lightbox modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  // More actions dropdown
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [shelfDropdownOpen, setShelfDropdownOpen] = useState(false);

  // Carousel ref
  const carouselRef = useRef(null);

  const isSaved = isBookSaved(id);
  const savedEntry = getSavedBook(id);
  const currentStatus = savedEntry?.readingStatus || 'want-to-read';
  const currentProgress = savedEntry?.progress !== undefined ? savedEntry.progress : currentStatus === 'currently-reading' ? 68 : currentStatus === 'finished' ? 100 : 0;

  const enrichment = useMemo(() => {
    const raw = BOOK_ENRICHMENTS[book.title] || getFallbackEnrichment(book);
    const coverUrl = getBookCoverUrl(book.image, book.title, book.isbn) || '/images/covers/educated.jpg';
    return {
      ...raw,
      moodboardItems: (raw.moodboardItems || []).map((item) => {
        if (item.type === 'cover' || item.title === 'Primary Jacket') {
          return { ...item, src: coverUrl };
        }
        return item;
      }),
    };
  }, [book]);

  const fetchBookDetails = () => {
    setLoading(true);
    bookService
      .getById(id)
      .then((response) => {
        const bookData = response.data;
        setBook(bookData);
        setLoading(false);

        // Fetch related books in same category
        if (bookData.category) {
          bookService
            .getAll({ category: bookData.category, limit: 12 })
            .then((res) => {
              const related = (res.data.data || []).filter((b) => b._id !== id);
              setRelatedBooks(related);
            })
            .catch(() => {});
        }
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Failed to load book profile', { variant: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
    setIsReaderExpanded(false);
  }, [id]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleGlobalClick = () => {
      setMoreActionsOpen(false);
      setShelfDropdownOpen(false);
    };
    if (moreActionsOpen || shelfDropdownOpen) {
      window.addEventListener('click', handleGlobalClick);
    }
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [moreActionsOpen, shelfDropdownOpen]);

  // Primary Shelf Action
  const handleToggleShelf = (targetStatus = 'want-to-read') => {
    playWaxSealCrack();
    if (!isSaved) {
      toggleBook(book, targetStatus);
      enqueueSnackbar(`"${book.title}" added to your shelf as ${targetStatus.replace(/-/g, ' ')}.`, {
        variant: 'success',
      });
    } else {
      updateBookStatus(id, targetStatus);
      enqueueSnackbar(`Reading stage updated to "${targetStatus.replace(/-/g, ' ')}".`, {
        variant: 'info',
      });
    }
    setShelfDropdownOpen(false);
  };

  // Quick Mark as Read Toggle
  const handleMarkAsReadToggle = () => {
    playWaxSealCrack();
    if (!isSaved) {
      toggleBook(book, 'finished');
      enqueueSnackbar(`"${book.title}" marked as read on your shelf.`, { variant: 'success' });
    } else {
      const nextStatus = currentStatus === 'finished' ? 'currently-reading' : 'finished';
      updateBookStatus(id, nextStatus);
      enqueueSnackbar(`Marked as ${nextStatus.replace(/-/g, ' ')}.`, { variant: 'info' });
    }
  };

  // Progress change
  const handleProgressChange = (newVal) => {
    if (!isSaved) {
      toggleBook(book, 'currently-reading');
    }
    updateBookProgress(id, newVal);
  };

  // Share book
  const handleShareBook = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${book.title} by ${book.author} — PageTurner`,
      text: `Read "${book.title}" on PageTurner Literary Journal & Discovery.`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        enqueueSnackbar('Book link copied to clipboard.', { variant: 'success' });
      } catch (e) {
        enqueueSnackbar('Failed to copy link', { variant: 'error' });
      }
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      enqueueSnackbar('Please sign in to publish your reflection.', { variant: 'warning' });
      return;
    }

    if (!comment.trim()) {
      enqueueSnackbar('Reflection comment cannot be empty.', { variant: 'error' });
      return;
    }

    setReviewLoading(true);
    try {
      await bookService.addReview(id, { rating: Number(rating), comment: comment.trim() });
      playWaxSealCrack();
      enqueueSnackbar('Your reflection has been published to the literary journal.', {
        variant: 'success',
      });
      setComment('');
      setRating(5);
      fetchBookDetails();
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Failed to submit reflection',
        { variant: 'error' }
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // Edit Review
  const handleStartEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleSaveEditReview = async (reviewId) => {
    if (!editComment.trim()) {
      enqueueSnackbar('Reflection text cannot be empty.', { variant: 'error' });
      return;
    }
    try {
      await bookService.updateReview(id, reviewId, {
        rating: Number(editRating),
        comment: editComment.trim(),
      });
      enqueueSnackbar('Reflection updated.', { variant: 'success' });
      setEditingReviewId(null);
      fetchBookDetails();
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Failed to update reflection',
        { variant: 'error' }
      );
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you wish to delete this reflection?')) return;
    try {
      await bookService.deleteReview(id, reviewId);
      enqueueSnackbar('Reflection removed.', { variant: 'success' });
      fetchBookDetails();
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Failed to remove reflection',
        { variant: 'error' }
      );
    }
  };

  // Add Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    if (!isSaved) {
      toggleBook(book);
    }
    addBookNote(id, newNoteText.trim());
    setNewNoteText('');
    setShowAddNoteForm(false);
    enqueueSnackbar('Personal reflection saved to your reading journal.', { variant: 'success' });
  };

  // Add Highlight
  const handleAddHighlight = (e) => {
    e.preventDefault();
    if (!newHlQuote.trim()) return;
    if (!isSaved) {
      toggleBook(book);
    }
    addBookHighlight(id, {
      quote: newHlQuote.trim(),
      page: newHlPage.trim(),
      note: newHlNote.trim(),
    });
    setNewHlQuote('');
    setNewHlPage('');
    setNewHlNote('');
    setShowAddHlForm(false);
    enqueueSnackbar('Bookmark added to your highlights.', { variant: 'success' });
  };

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    if (!book.reviews) return [];
    return [...book.reviews].sort((a, b) => {
      if (reviewSort === 'highest') return b.rating - a.rating;
      if (reviewSort === 'lowest') return a.rating - b.rating;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [book.reviews, reviewSort]);

  // Rating distribution counts
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!book.reviews || book.reviews.length === 0) return dist;
    book.reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });
    return dist;
  }, [book.reviews]);

  // Carousel controls
  const handleScrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const distance = 320;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const coverImageUrl = getBookCoverUrl(book.image, book.title, book.isbn) || '/images/covers/educated.jpg';

  const reviewsCount = book.reviews?.length || 0;
  const journalNotesList = savedEntry?.journalNotes || (savedEntry?.notes ? [{ id: 'legacy-1', text: savedEntry.notes, createdAt: savedEntry.savedAt }] : []);
  const highlightsList = savedEntry?.highlights || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27] selection:bg-[#8D263B] selection:text-[#F7F3EC]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9">
        {/* 2. Top Sub-Bar: Back button + Shelf Action Pill + Share + More */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8DED1]">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-semibold text-[#81766D] hover:text-[#8D263B] transition-colors"
          >
            <PiArrowLeftBold className="text-sm transition-transform group-hover:-translate-x-1" />
            <span>Back to Discover</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Primary Shelf Action Button with Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShelfDropdownOpen((prev) => !prev);
                  setMoreActionsOpen(false);
                }}
                className={`inline-flex items-center gap-2 h-10 px-4 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95 ${
                  isSaved
                    ? 'bg-[#8D263B] hover:bg-[#67202F] text-white'
                    : 'bg-[#FFFDFA] hover:bg-white text-[#302A27] border border-[#E8DED1]'
                }`}
              >
                {isSaved ? (
                  <>
                    <PiBookmarkSimpleFill className="text-amber-300 text-sm" />
                    <span>On Your Shelf</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 ml-0.5" />
                    <PiCaretDownBold className="text-[10px] opacity-80" />
                  </>
                ) : (
                  <>
                    <PiBookmarkSimpleBold className="text-[#8D263B] text-sm" />
                    <span>Add to Shelf</span>
                    <PiCaretDownBold className="text-[10px] text-[#81766D]" />
                  </>
                )}
              </button>

              {/* Shelf Status Selection Menu */}
              {shelfDropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#FFFDFA] rounded-2xl shadow-xl border border-[#E8DED1] py-2 z-40 text-xs text-[#302A27] animate-in fade-in zoom-in-95"
                >
                  <div className="px-3.5 py-1 text-[10px] font-mono text-[#81766D] uppercase tracking-wider border-b border-[#F7F3EC]">
                    Reading Stage
                  </div>

                  {[
                    { id: 'want-to-read', label: 'Want to Read' },
                    { id: 'currently-reading', label: 'Currently Reading' },
                    { id: 'finished', label: 'Finished' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleToggleShelf(st.id)}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#F7F3EC] flex items-center justify-between transition-colors"
                    >
                      <span className="font-medium">{st.label}</span>
                      {isSaved && currentStatus === st.id && (
                        <PiCheckBold className="text-[#8D263B] text-xs" />
                      )}
                    </button>
                  ))}

                  {isSaved && (
                    <>
                      <div className="my-1 border-t border-[#E8DED1]/60" />
                      <button
                        type="button"
                        onClick={() => {
                          toggleBook(book);
                          setShelfDropdownOpen(false);
                          enqueueSnackbar(`Removed "${book.title}" from your shelf.`, {
                            variant: 'info',
                          });
                        }}
                        className="w-full text-left px-3.5 py-2 text-red-700 hover:bg-red-50 text-xs transition-colors"
                      >
                        Remove from Shelf
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Share Book Button */}
            <button
              type="button"
              onClick={handleShareBook}
              title="Share book link"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#FFFDFA] hover:bg-white text-[#302A27] border border-[#E8DED1] text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <PiShareNetworkBold className="text-sm text-[#81766D]" />
              <span>Share</span>
            </button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreActionsOpen((prev) => !prev);
                  setShelfDropdownOpen(false);
                }}
                aria-label="More actions"
                className="w-10 h-10 rounded-full bg-[#FFFDFA] hover:bg-white text-[#302A27] border border-[#E8DED1] flex items-center justify-center shadow-xs transition-colors"
              >
                <PiDotsThreeBold className="text-base text-[#81766D]" />
              </button>

              {moreActionsOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#FFFDFA] rounded-2xl shadow-xl border border-[#E8DED1] py-2 z-40 text-xs text-[#302A27] animate-in fade-in zoom-in-95"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsReaderExpanded(true);
                      setMoreActionsOpen(false);
                      const el = document.getElementById('archival-reader-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F7F3EC] flex items-center gap-2"
                  >
                    <PiBookOpenTextBold className="text-[#8D263B] text-sm" />
                    <span>Open Reader Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMoreActionsOpen(false);
                      navigator.clipboard.writeText(`"${book.title}" by ${book.author}`);
                      enqueueSnackbar('Citation copied to clipboard.', { variant: 'success' });
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#F7F3EC] flex items-center gap-2"
                  >
                    <PiSparkleBold className="text-[#C99A48] text-sm" />
                    <span>Copy Citation</span>
                  </button>

                  {isAdmin && (
                    <>
                      <div className="my-1 border-t border-[#E8DED1]/60" />
                      <div className="px-3.5 py-1 text-[10px] font-mono text-[#81766D] uppercase tracking-wider">
                        Curator Controls
                      </div>
                      <Link
                        to={`/books/edit/${book._id}`}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#F7F3EC] flex items-center gap-2 text-[#302A27]"
                      >
                        <PiPencilSimpleBold className="text-sm text-stone-600" />
                        <span>Edit Catalog Record</span>
                      </Link>
                      <Link
                        to={`/books/delete/${book._id}`}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2"
                      >
                        <PiTrashBold className="text-sm text-red-600" />
                        <span>Delete Record</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-36 flex flex-col items-center justify-center gap-3">
            <Spinner />
            <span className="font-serif italic text-sm text-[#81766D]">
              Opening literary record...
            </span>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 3. CINEMATIC 3-COLUMN EDITORIAL HERO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
              
              {/* LEFT COLUMN (5 cols on lg/xl): Pinterest Moodboard & Reading Journal Actions */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* 3A. Layered Moodboard Canvas */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-[#F6EFE5] border border-[#E8DED1] shadow-sm overflow-hidden">
                  
                  {/* Subtle dried botanical sprig resting gracefully on the left edge */}
                  <div className="absolute -top-4 -left-6 w-36 h-48 pointer-events-none select-none z-10 opacity-80 mix-blend-multiply">
                    <img
                      src="/images/editorial/botanical_flower.jpg"
                      alt=""
                      className="w-full h-full object-contain -rotate-12"
                      loading="lazy"
                    />
                  </div>

                  {/* Handwritten vintage deckle paper scrap pinned softly */}
                  <div className="absolute top-44 -left-3 w-28 sm:w-32 z-20 pointer-events-none select-none -rotate-6 shadow-md rounded-sm overflow-hidden">
                    <img
                      src="/images/editorial/paper_note.jpg"
                      alt="Books build a kinder, brighter you."
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Main Book Cover Artwork */}
                  <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 pl-14 sm:pl-16">
                    {/* The Dominant Book Cover */}
                    <div className="relative group/cover flex-1 max-w-[270px] sm:max-w-[290px]">
                      <div className="rounded-xl overflow-hidden shadow-2xl border border-stone-800/10 bg-[#FFFDFA] transition-transform duration-300 group-hover/cover:scale-[1.015]">
                        <img
                          src={coverImageUrl}
                          alt={`Cover of ${book.title}`}
                          className="w-full h-auto max-h-[440px] sm:max-h-[470px] object-cover block"
                        />
                      </div>
                    </div>

                    {/* Vertical Strip of Moodboard / Cover Thumbnails (+4 more) */}
                    <div className="flex flex-col gap-2 flex-shrink-0 w-16 sm:w-18 z-20">
                      {enrichment.moodboardItems.slice(0, 4).map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedGalleryItem(item);
                            setGalleryModalOpen(true);
                          }}
                          title={item.title}
                          className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl overflow-hidden border border-[#E8DED1] bg-white shadow-2xs hover:border-[#8D263B] hover:scale-105 transition-all p-0.5 cursor-pointer relative group"
                        >
                          <img
                            src={item.src || coverImageUrl}
                            alt={item.title}
                            onError={(e) => {
                              if (coverImageUrl && e.target.src !== coverImageUrl) {
                                e.target.src = coverImageUrl;
                              }
                            }}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors rounded-lg" />
                        </button>
                      ))}

                      {/* +4 more modal button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGalleryItem(enrichment.moodboardItems[0]);
                          setGalleryModalOpen(true);
                        }}
                        className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl border border-dashed border-[#C99A48]/60 bg-[#FFFDFA] hover:bg-[#F4E8E6] text-[#8D263B] flex flex-col items-center justify-center transition-colors text-center p-1 shadow-2xs"
                      >
                        <span className="font-serif font-bold text-xs leading-none">+4</span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#81766D] mt-0.5 leading-none">
                          more
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Rating pill floating below cover */}
                  <div className="relative z-20 mt-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDFA]/95 backdrop-blur-xs border border-[#E8DED1] text-xs shadow-2xs">
                      <div className="flex items-center text-[#C99A48]">
                        <PiStarFill className="text-sm mr-1" />
                        <span className="font-bold text-[#302A27]">
                          {(book.averageRating || 5.0).toFixed(1)} / 5.0
                        </span>
                      </div>
                      <span className="text-[#81766D]">
                        ({reviewsCount > 0 ? `${reviewsCount.toLocaleString()} reviews` : '1,284 reviews'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3B. Personal Reading Journal & Tracking Box */}
                <div className="editorial-surface p-6 sm:p-7 space-y-5">
                  {/* Top Shelf Controls: Dropdown & Mark as Read */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleShelf(currentStatus)}
                      className={`h-11 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-95 ${
                        isSaved
                          ? 'bg-[#8D263B] hover:bg-[#67202F] text-white'
                          : 'bg-[#FFFDFA] hover:bg-white text-[#302A27] border border-[#E8DED1]'
                      }`}
                    >
                      <PiBookmarkSimpleFill className={isSaved ? 'text-amber-300' : 'text-[#8D263B]'} />
                      <span>{isSaved ? 'On Your Shelf' : 'Add to Shelf'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleMarkAsReadToggle}
                      className={`h-11 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 border ${
                        currentStatus === 'finished'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-[#FFFDFA] hover:bg-[#F7F3EC] text-[#302A27] border-[#E8DED1]'
                      }`}
                    >
                      <PiCheckBold className={currentStatus === 'finished' ? 'text-emerald-700' : 'text-[#81766D]'} />
                      <span>{currentStatus === 'finished' ? 'Read Complete' : 'Mark as Read'}</span>
                    </button>
                  </div>

                  {/* Reading Status Selector */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#81766D] font-semibold mb-2">
                      Reading Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'want-to-read', label: 'Want to Read' },
                        { id: 'currently-reading', label: 'Currently Reading' },
                        { id: 'finished', label: 'Finished' },
                      ].map((st) => {
                        const isCurrent = currentStatus === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => handleToggleShelf(st.id)}
                            className={`py-2 px-2 rounded-xl text-center text-xs font-semibold transition-all border ${
                              isCurrent
                                ? 'bg-[#F4E8E6] text-[#8D263B] border-[#8D263B]/40 shadow-2xs'
                                : 'bg-[#FFFDFA] text-[#302A27] hover:bg-[#F7F3EC] border-[#E8DED1]'
                            }`}
                          >
                            <span className="truncate block">{st.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reading Progress Tracker */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#81766D] font-semibold">
                        Reading Progress
                      </span>
                      <span className="font-mono font-bold text-[#8D263B]">
                        {currentProgress}% complete
                      </span>
                    </div>

                    <div className="relative w-full h-2.5 bg-[#E8DED1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8D263B] rounded-full transition-all duration-300"
                        style={{ width: `${currentProgress}%` }}
                      />
                    </div>

                    {/* Progress adjustment slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentProgress}
                      onChange={(e) => handleProgressChange(e.target.value)}
                      className="w-full mt-2 accent-[#8D263B] cursor-pointer"
                      title="Adjust reading progress"
                    />
                  </div>

                  {/* Quick Action Buttons: Add Note & Add Bookmark */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8DED1]/80">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('notes');
                        setShowAddNoteForm(true);
                      }}
                      className="h-10 px-3 rounded-xl bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] text-xs font-semibold text-[#302A27] flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <PiNotePencilBold className="text-sm text-[#8D263B]" />
                      <span>Add a Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('highlights');
                        setShowAddHlForm(true);
                      }}
                      className="h-10 px-3 rounded-xl bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] text-xs font-semibold text-[#302A27] flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      <PiBookBookmarkBold className="text-sm text-[#C99A48]" />
                      <span>Add a Bookmark</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN (4 cols on lg, 4 on xl): Book Identity, Editorial Tabs & Content */}
              <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6">
                
                {/* Book Metadata & Title Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-[#81766D] font-semibold">
                    <span className="text-[#8D263B] font-bold">{book.category || 'BIOGRAPHY'}</span>
                    <span>•</span>
                    <span>Published {book.publishYear || 2018}</span>
                    <span>•</span>
                    <span>{book.pageCount || 352} pages</span>
                  </div>

                  {/* Editorial Serif Title */}
                  <h1 className="font-cormorant text-4xl sm:text-5xl xl:text-[54px] font-bold text-[#302A27] leading-[1.08] tracking-tight mb-2">
                    {book.title}
                  </h1>

                  {/* Author line in italic serif */}
                  <p className="font-serif italic text-lg text-[#81766D] mb-3">
                    {enrichment.subtitle}
                  </p>

                  {/* Short lead preview synopsis */}
                  <p className="text-xs sm:text-[13px] text-[#302A27] leading-relaxed mb-4">
                    {enrichment.shortLead}
                  </p>

                  {/* Theme / Genre Tag Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {enrichment.themes.map((theme, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFFDFA] border border-[#E8DED1] text-[#81766D] hover:text-[#302A27] hover:border-[#8D263B]/30 transition-colors"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Navigation Tab Bar */}
                <div className="border-b border-[#E8DED1] pt-2">
                  <nav className="flex items-center gap-5 sm:gap-6 text-xs sm:text-[13px] overflow-x-auto scrollbar-none" aria-label="Book sections">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'reviews', label: `Reviews (${reviewsCount > 0 ? reviewsCount : '1.2K'})` },
                      { id: 'notes', label: `Notes (${journalNotesList.length > 0 ? journalNotesList.length : '43'})` },
                      { id: 'highlights', label: `Highlights (${highlightsList.length > 0 ? highlightsList.length : '12'})` },
                      { id: 'similar', label: 'Similar Books' },
                    ].map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`pb-3 font-semibold transition-all relative whitespace-nowrap ${
                            isActive
                              ? 'text-[#8D263B]'
                              : 'text-[#81766D] hover:text-[#302A27]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8D263B] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* TAB CONTENT PANELS */}
                <div className="editorial-surface p-6 sm:p-7">
                  
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div>
                        <h2 className="font-serif text-lg font-bold text-[#302A27] mb-3">
                          Overview
                        </h2>

                        <div className="text-xs sm:text-[13px] text-[#302A27] leading-relaxed font-sans space-y-3">
                          <p>
                            {book.description ||
                              'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure she received an education, and no one to intervene when one of her older brothers became violent.'}
                          </p>

                          {(!book.description || isSynopsisExpanded) && (
                            <p>
                              With no formal education, Tara later found her way to college, and then to Cambridge University, where she earned a PhD. <em>Educated</em> is a powerful memoir about family, resilience, and the transformative power of learning.
                            </p>
                          )}

                          {book.description && book.description.length > 180 && (
                            <button
                              type="button"
                              onClick={() => setIsSynopsisExpanded((prev) => !prev)}
                              className="text-xs font-semibold text-[#8D263B] hover:underline pt-1 block"
                            >
                              {isSynopsisExpanded ? 'Show less' : 'Read full synopsis...'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Editorial Pull Quote Box */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#FDF7F5] border border-[#F4E8E6] relative">
                        <span className="text-3xl font-serif text-[#8D263B] leading-none absolute top-3 left-4 select-none">
                          “
                        </span>
                        <div className="pl-6">
                          <p className="font-serif italic text-sm sm:text-base text-[#8D263B] leading-snug font-medium mb-2">
                            {enrichment.pullQuote.replace(/^[“"]|[”"]$/g, '')}
                          </p>
                          <div className="pt-2 border-t border-[#F4E8E6]">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#81766D] font-bold">
                              — {enrichment.quoteAuthor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* About the Author Section */}
                      <div className="pt-4 border-t border-[#E8DED1]">
                        <h3 className="font-serif text-sm font-bold text-[#302A27] mb-3">
                          About the Author
                        </h3>

                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E8DED1] flex-shrink-0 bg-[#F7F3EC] shadow-2xs">
                            <img
                              src="/images/editorial/author_portrait.jpg"
                              alt={book.author}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-sm text-[#302A27]">
                              {book.author}
                            </h4>
                            <p className="text-[11px] text-[#81766D] leading-snug line-clamp-2 mt-0.5">
                              {enrichment.authorBio}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: REVIEWS */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED1]">
                        <div>
                          <h2 className="font-serif text-lg font-bold text-[#302A27]">
                            Reader Reflections
                          </h2>
                          <p className="text-xs text-[#81766D] mt-0.5">
                            Community ratings &amp; thoughtful observations
                          </p>
                        </div>

                        {/* Sort selector */}
                        <select
                          value={reviewSort}
                          onChange={(e) => setReviewSort(e.target.value)}
                          className="text-xs bg-[#FFFDFA] border border-[#E8DED1] rounded-lg px-2.5 py-1 text-[#302A27] focus:outline-none"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="highest">Highest Rated</option>
                          <option value="lowest">Lowest Rated</option>
                        </select>
                      </div>

                      {/* Write a Review Section */}
                      {user ? (
                        <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1]">
                          <h4 className="font-serif text-xs font-bold text-[#302A27] mb-2">
                            Write a Reflection as <span className="text-[#8D263B]">{user.username}</span>
                          </h4>

                          <div className="mb-2.5">
                            <label className="block text-[11px] font-semibold text-[#81766D] mb-1">
                              Your Rating
                            </label>
                            <div className="flex items-center gap-1 text-lg text-stone-300">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none transition-transform hover:scale-110"
                                >
                                  <PiStarFill
                                    className={star <= rating ? 'text-[#C99A48]' : 'text-stone-300'}
                                  />
                                </button>
                              ))}
                              <span className="text-xs font-mono font-bold text-[#302A27] ml-2">
                                {rating} of 5
                              </span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <textarea
                              rows="3"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share your perspective on the characters, writing, or lasting impressions..."
                              className="w-full p-2.5 rounded-xl text-xs bg-white border border-[#E8DED1] text-[#302A27] placeholder-[#81766D]/70 focus:outline-none focus:border-[#8D263B]"
                              required
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={reviewLoading}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold shadow-2xs disabled:opacity-50 transition-all active:scale-95"
                            >
                              <PiPaperPlaneTiltBold className="text-xs" />
                              <span>{reviewLoading ? 'Publishing...' : 'Publish Reflection'}</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-4 rounded-2xl bg-[#F4E8E6] border border-[#8D263B]/20 flex items-center justify-between text-xs">
                          <span className="text-[#8D263B] font-medium">
                            Sign in to share your reflection on this book.
                          </span>
                          <Link
                            to="/login"
                            className="px-3 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs"
                          >
                            Sign In
                          </Link>
                        </div>
                      )}

                      {/* Reviews List */}
                      <div className="space-y-3">
                        {sortedReviews.length > 0 ? (
                          sortedReviews.map((rev) => {
                            const isOwner = user && rev.userId && (rev.userId._id === user._id || rev.userId === user._id);
                            const canModify = isOwner || isAdmin;
                            const isEditing = editingReviewId === rev._id;

                            return (
                              <div
                                key={rev._id}
                                className="p-4 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs space-y-2"
                              >
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1 text-base">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                          key={s}
                                          type="button"
                                          onClick={() => setEditRating(s)}
                                        >
                                          <PiStarFill
                                            className={s <= editRating ? 'text-[#C99A48]' : 'text-stone-300'}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                    <textarea
                                      rows="2"
                                      value={editComment}
                                      onChange={(e) => setEditComment(e.target.value)}
                                      className="w-full p-2 rounded-lg border border-[#E8DED1] text-xs"
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingReviewId(null)}
                                        className="px-2.5 py-1 text-xs border border-[#E8DED1] rounded-lg"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEditReview(rev._id)}
                                        className="px-3 py-1 text-xs bg-[#8D263B] text-white rounded-lg font-semibold"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[#FCEAD2] text-[#B45309] font-bold text-[10px] flex items-center justify-center">
                                          {rev.username ? rev.username[0].toUpperCase() : 'R'}
                                        </div>
                                        <span className="font-bold text-[#302A27]">
                                          {rev.username}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center text-[#C99A48] text-xs">
                                          <PiStarFill className="mr-0.5" />
                                          <span className="font-bold">{rev.rating}</span>
                                        </div>

                                        {canModify && (
                                          <div className="flex items-center gap-1 pl-2 border-l border-[#E8DED1]">
                                            {isOwner && (
                                              <button
                                                type="button"
                                                onClick={() => handleStartEditReview(rev)}
                                                className="text-[#81766D] hover:text-[#8D263B] p-1"
                                                title="Edit reflection"
                                              >
                                                <PiPencilSimpleBold className="text-xs" />
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteReview(rev._id)}
                                              className="text-stone-400 hover:text-red-700 p-1"
                                              title="Delete reflection"
                                            >
                                              <PiTrashBold className="text-xs" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <p className="text-[#302A27] leading-relaxed font-sans">
                                      {rev.comment}
                                    </p>
                                  </>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8">
                            <p className="font-serif italic text-xs text-[#81766D]">
                              No reader reflections recorded yet. Be the first to record your impressions.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: NOTES (Personal Reading Journal) */}
                  {activeTab === 'notes' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED1]">
                        <div>
                          <h2 className="font-serif text-lg font-bold text-[#302A27]">
                            My Reading Notes
                          </h2>
                          <p className="text-xs text-[#81766D]">
                            Private journal entries stored on your device shelf
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddNoteForm((prev) => !prev)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs hover:bg-[#67202F]"
                        >
                          <PiPlusBold className="text-xs" />
                          <span>New Note</span>
                        </button>
                      </div>

                      {/* Add Note Form */}
                      {showAddNoteForm && (
                        <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] space-y-2.5">
                          <label className="block text-[11px] font-semibold text-[#81766D]">
                            Add a Journal Reflection
                          </label>
                          <textarea
                            rows="3"
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            placeholder="Write your observation, key takeaway, or personal reaction..."
                            className="w-full p-2.5 rounded-xl text-xs bg-white border border-[#E8DED1] text-[#302A27] focus:outline-none focus:border-[#8D263B]"
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddNoteForm(false)}
                              className="px-3 py-1.5 text-xs text-[#81766D] hover:text-[#302A27]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs"
                            >
                              Save Note
                            </button>
                          </div>
                        </form>
                      )}

                      {/* List of Journal Notes */}
                      <div className="space-y-3">
                        {journalNotesList.length > 0 ? (
                          journalNotesList.map((n) => (
                            <div
                              key={n.id}
                              className="p-4 rounded-xl border border-[#E8DED1] bg-[#F7F3EC] space-y-2 relative group"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-[#81766D]">
                                <span>{n.createdAt ? new Date(n.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Saved note'}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteBookNote(id, n.id)}
                                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-700 transition-opacity p-0.5"
                                  title="Delete note"
                                >
                                  <PiTrashBold className="text-xs" />
                                </button>
                              </div>
                              <p className="text-xs text-[#302A27] leading-relaxed whitespace-pre-wrap font-sans">
                                {n.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <PiNotePencilBold className="text-3xl text-[#8D263B]/40 mx-auto mb-2" />
                            <p className="font-serif italic text-xs text-[#81766D]">
                              No journal notes recorded for this title yet.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowAddNoteForm(true)}
                              className="mt-3 px-4 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs"
                            >
                              Add First Note
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: HIGHLIGHTS */}
                  {activeTab === 'highlights' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED1]">
                        <div>
                          <h2 className="font-serif text-lg font-bold text-[#302A27]">
                            Saved Highlights &amp; Bookmarks
                          </h2>
                          <p className="text-xs text-[#81766D]">
                            Memorable passages and quotes
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddHlForm((prev) => !prev)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs hover:bg-[#67202F]"
                        >
                          <PiPlusBold className="text-xs" />
                          <span>Add Bookmark</span>
                        </button>
                      </div>

                      {/* Add Highlight Form */}
                      {showAddHlForm && (
                        <form onSubmit={handleAddHighlight} className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] space-y-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#81766D] mb-1">
                              Quotation / Passage
                            </label>
                            <textarea
                              rows="2"
                              value={newHlQuote}
                              onChange={(e) => setNewHlQuote(e.target.value)}
                              placeholder="“Quote from the book...”"
                              className="w-full p-2 rounded-xl text-xs bg-white border border-[#E8DED1] text-[#302A27] focus:outline-none"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#81766D] mb-1">
                                Page Number (Optional)
                              </label>
                              <input
                                type="text"
                                value={newHlPage}
                                onChange={(e) => setNewHlPage(e.target.value)}
                                placeholder="e.g. 142"
                                className="w-full p-2 rounded-xl text-xs bg-white border border-[#E8DED1] text-[#302A27]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#81766D] mb-1">
                                Annotation Note (Optional)
                              </label>
                              <input
                                type="text"
                                value={newHlNote}
                                onChange={(e) => setNewHlNote(e.target.value)}
                                placeholder="Why this resonated..."
                                className="w-full p-2 rounded-xl text-xs bg-white border border-[#E8DED1] text-[#302A27]"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddHlForm(false)}
                              className="px-3 py-1.5 text-xs text-[#81766D]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs"
                            >
                              Save Highlight
                            </button>
                          </div>
                        </form>
                      )}

                      {/* List of Highlights */}
                      <div className="space-y-3">
                        {highlightsList.length > 0 ? (
                          highlightsList.map((hl) => (
                            <div
                              key={hl.id}
                              className="p-4 rounded-xl border-l-4 border-l-[#8D263B] border border-[#E8DED1] bg-[#F7F3EC] space-y-1.5 relative group"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-[#81766D]">
                                <span>{hl.page ? `Page ${hl.page}` : 'Bookmark'}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteBookHighlight(id, hl.id)}
                                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-700 transition-opacity p-0.5"
                                  title="Delete highlight"
                                >
                                  <PiTrashBold className="text-xs" />
                                </button>
                              </div>
                              <p className="font-serif italic text-xs sm:text-sm text-[#302A27] leading-snug">
                                &ldquo;{hl.quote}&rdquo;
                              </p>
                              {hl.note && (
                                <p className="text-[11px] text-[#81766D] pt-1 border-t border-[#E8DED1]/50">
                                  {hl.note}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <PiBookBookmarkBold className="text-3xl text-[#C99A48]/50 mx-auto mb-2" />
                            <p className="font-serif italic text-xs text-[#81766D]">
                              No passages highlighted yet. Save memorable quotes as you read.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowAddHlForm(true)}
                              className="mt-3 px-4 py-1.5 rounded-full bg-[#8D263B] text-white text-xs font-semibold shadow-2xs"
                            >
                              Add First Highlight
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: SIMILAR BOOKS */}
                  {activeTab === 'similar' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h2 className="font-serif text-lg font-bold text-[#302A27]">
                          Companion Works
                        </h2>
                        <p className="text-xs text-[#81766D]">
                          Titles in <span className="font-semibold text-[#8D263B]">{book.category}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                        {relatedBooks.slice(0, 4).map((relBook) => {
                          const relImg =
                            getBookCoverUrl(relBook.image, relBook.title, relBook.isbn) ||
                            '/images/covers/educated.jpg';

                          return (
                            <Link
                              key={relBook._id}
                              to={`/books/details/${relBook._id}`}
                              className="p-3 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] hover:border-[#8D263B]/40 transition-all flex items-center gap-3 group"
                            >
                              <div className="w-12 aspect-[2/3] rounded overflow-hidden border border-[#E8DED1] flex-shrink-0 bg-[#F7F3EC]">
                                <img
                                  src={relImg}
                                  alt={relBook.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif font-bold text-xs text-[#302A27] truncate group-hover:text-[#8D263B] transition-colors">
                                  {relBook.title}
                                </h4>
                                <p className="text-[11px] text-[#81766D] italic truncate">
                                  by {relBook.author}
                                </p>
                                <span className="text-[10px] font-mono text-[#81766D]">
                                  {relBook.publishYear}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN (3 cols on lg/xl): At a Glance & Reader Sentiment & Reader Review Quote Card */}
              <div className="lg:col-span-3 xl:col-span-3 flex flex-col gap-6">
                
                {/* 1. At a Glance Metadata Card */}
                <div className="editorial-surface p-6 sm:p-7 space-y-3.5">
                  <h3 className="font-serif text-base font-bold text-[#302A27] mb-1">
                    At a Glance
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Rating</span>
                      <span className="font-mono font-bold text-[#302A27]">
                        {(book.averageRating || 5.0).toFixed(1)} / 5.0
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Reviews</span>
                      <span className="font-mono text-[#302A27]">
                        {reviewsCount > 0 ? reviewsCount.toLocaleString() : '1,284'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Pages</span>
                      <span className="font-mono text-[#302A27]">
                        {book.pageCount || 352}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Published</span>
                      <span className="font-mono text-[#302A27]">
                        {book.publishYear || 2018}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Publisher</span>
                      <span className="font-sans font-medium text-[#302A27] truncate max-w-[130px]">
                        {enrichment.publisher}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#E8DED1]/60">
                      <span className="text-[#81766D]">Genre</span>
                      <span className="font-medium text-[#8D263B]">
                        {book.category || 'Biography'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-[#81766D]">ISBN</span>
                      <span className="font-mono text-[11px] text-[#302A27]">
                        {book.isbn || '978-0399590504'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Reader Sentiment Breakdown Card */}
                <div className="editorial-surface p-6 sm:p-7 space-y-3.5">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      Reader Sentiment
                    </h3>
                    <p className="text-[11px] text-[#81766D] mt-0.5">
                      What readers are saying
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {[
                      { label: 'Life-changing', pct: enrichment.sentiment.lifeChanging },
                      { label: 'Inspiring', pct: enrichment.sentiment.inspiring },
                      { label: 'Emotional', pct: enrichment.sentiment.emotional },
                      { label: 'Thought-provoking', pct: enrichment.sentiment.thoughtProvoking },
                      { label: 'Well-written', pct: enrichment.sentiment.wellWritten },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <span className="text-[#81766D] min-w-[110px] text-xs font-medium">
                          {item.label}
                        </span>
                        <div className="flex-1 h-2 bg-[#E8DED1] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8D263B] rounded-full"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#81766D] w-7 text-right">
                          {item.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Aesthetic Editorial Quote / Moodboard Card */}
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F6EFE5] border border-[#E8DED1] relative overflow-hidden shadow-2xs">
                  {/* Botanical flower branch graphic on the left */}
                  <div className="w-16 h-24 pointer-events-none select-none opacity-85 mix-blend-multiply mb-3">
                    <img
                      src="/images/editorial/botanical_flower.jpg"
                      alt=""
                      className="w-full h-full object-contain -rotate-6"
                      loading="lazy"
                    />
                  </div>

                  <p className="font-serif italic text-sm text-[#302A27] leading-relaxed mb-3">
                    {enrichment.readerReviewQuote}
                  </p>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#81766D] font-bold block">
                    — READER REVIEW
                  </span>
                </div>
              </div>
            </div>

            {/* 4. REIMAGINED ARCHIVAL READER PREVIEW (Refined, Collapsible by Default) */}
            <section id="archival-reader-section" className="pt-6">
              <div className="editorial-surface overflow-hidden border border-[#E8DED1]">
                <div
                  onClick={() => setIsReaderExpanded((prev) => !prev)}
                  className="p-6 flex items-center justify-between cursor-pointer bg-[#FFFDFA] hover:bg-[#F7F3EC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4E8E6] text-[#8D263B] flex items-center justify-center flex-shrink-0">
                      <PiBookOpenTextBold className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#302A27]">
                        Reader Preview &bull; Archival Edition
                      </h3>
                      <p className="text-xs text-[#81766D]">
                        Experience typeset chapter excerpts with theme and sound ambiance
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-full border border-[#E8DED1] text-xs font-semibold text-[#8D263B] bg-[#FFFDFA] hover:bg-white shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{isReaderExpanded ? 'Collapse Reader' : 'Open Reader Preview'}</span>
                    <PiCaretDownBold className={`text-xs transition-transform ${isReaderExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isReaderExpanded && (
                  <div className="p-6 sm:p-8 bg-[#F7F3EC] border-t border-[#E8DED1] animate-in fade-in duration-300">
                    <PageFlipPreview book={book} />
                  </div>
                )}
              </div>
            </section>

            {/* 5. "IF THIS BOOK SPOKE TO YOU" HORIZONTAL PINTEREST-INSPIRED CAROUSEL */}
            {relatedBooks.length > 0 && (
              <section className="pt-8 pb-6 border-t border-[#E8DED1]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#302A27]">
                      If This Book Spoke to You
                    </h2>
                    <p className="text-xs text-[#81766D] mt-0.5">
                      Companion works curated in <span className="font-semibold text-[#8D263B]">{book.category}</span>
                    </p>
                  </div>

                  {/* Carousel navigation buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('left')}
                      aria-label="Scroll left"
                      className="w-9 h-9 rounded-full bg-[#FFFDFA] hover:bg-white border border-[#E8DED1] text-[#302A27] flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all"
                    >
                      <PiCaretLeftBold className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollCarousel('right')}
                      aria-label="Scroll right"
                      className="w-9 h-9 rounded-full bg-[#FFFDFA] hover:bg-white border border-[#E8DED1] text-[#302A27] flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition-all"
                    >
                      <PiCaretRightBold className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Carousel */}
                <div
                  ref={carouselRef}
                  className="flex gap-5 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 -mx-1 snap-x snap-mandatory"
                >
                  {relatedBooks.map((relBook) => {
                    const relImg =
                      getBookCoverUrl(relBook.image, relBook.title, relBook.isbn) ||
                      '/images/covers/educated.jpg';

                    return (
                      <article
                        key={relBook._id}
                        className="w-[200px] sm:w-[220px] flex-shrink-0 snap-start rounded-2xl bg-[#FFFDFA] border border-[#E8DED1] p-3 shadow-2xs hover:border-[#8D263B]/40 hover:shadow-md transition-all group/card flex flex-col justify-between"
                      >
                        <div>
                          {/* Book Cover */}
                          <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#F7F3EC] border border-[#E8DED1] mb-3 relative group">
                            <img
                              src={relImg}
                              alt={relBook.title}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>

                          {/* Category Tag */}
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8D263B] font-bold block mb-1">
                            {relBook.category || 'Literature'}
                          </span>

                          {/* Title */}
                          <h3 className="font-serif font-bold text-sm text-[#302A27] line-clamp-1 group-hover/card:text-[#8D263B] transition-colors">
                            {relBook.title}
                          </h3>

                          {/* Author */}
                          <p className="font-serif italic text-xs text-[#81766D] truncate mt-0.5">
                            by {relBook.author}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1 text-[11px] font-mono text-[#302A27] mt-2">
                            <PiStarFill className="text-[#C99A48] text-xs" />
                            <span>{(relBook.averageRating || 4.9).toFixed(1)}</span>
                            <span className="text-[#81766D]">({relBook.publishYear})</span>
                          </div>
                        </div>

                        {/* View Book Link */}
                        <Link
                          to={`/books/details/${relBook._id}`}
                          className="mt-3 w-full py-1.5 px-3 rounded-lg border border-[#E8DED1] hover:bg-[#8D263B] hover:text-white hover:border-[#8D263B] text-center text-xs font-semibold text-[#302A27] transition-all flex items-center justify-center gap-1"
                        >
                          <span>View Book</span>
                          <PiArrowSquareOutBold className="text-xs" />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* 6. LIGHT MOODBOARD GALLERY MODAL */}
      {galleryModalOpen && selectedGalleryItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setGalleryModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FFFDFA] rounded-3xl border border-[#E8DED1] p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#E8DED1] text-[#302A27] flex items-center justify-center hover:bg-[#F7F3EC] transition-colors"
            >
              <PiXBold className="text-sm" />
            </button>

            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8D263B] font-bold block mb-1">
              MOODBOARD &bull; {selectedGalleryItem.type.toUpperCase()}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#302A27] mb-4">
              {selectedGalleryItem.title}
            </h3>

            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#E8DED1] bg-[#F7F3EC]">
              <img
                src={selectedGalleryItem.src || coverImageUrl}
                alt={selectedGalleryItem.title}
                onError={(e) => {
                  if (coverImageUrl && e.target.src !== coverImageUrl) {
                    e.target.src = coverImageUrl;
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto py-1">
              {enrichment.moodboardItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedGalleryItem(item)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0 p-0.5 ${
                    selectedGalleryItem.id === item.id
                      ? 'border-[#8D263B] ring-2 ring-[#8D263B]/20'
                      : 'border-[#E8DED1]'
                  }`}
                >
                  <img
                    src={item.src || coverImageUrl}
                    alt={item.title}
                    onError={(e) => {
                      if (coverImageUrl && e.target.src !== coverImageUrl) {
                        e.target.src = coverImageUrl;
                      }
                    }}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShowBook;
