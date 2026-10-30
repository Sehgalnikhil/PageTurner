import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  PiBooksBold,
  PiUsersThreeBold,
  PiChatCircleDotsBold,
  PiStarFill,
  PiPlusBold,
  PiTrashBold,
  PiPencilSimpleBold,
  PiEyeBold,
  PiArrowClockwiseBold,
  PiFileArrowDownBold,
  PiSparkleBold,
  PiCpuBold,
  PiDatabaseBold,
  PiEnvelopeSimpleBold,
  PiTagBold,
  PiCheckBold,
  PiXBold,
  PiMagnifyingGlassBold,
  PiCrownBold,
  PiSealCheckBold,
  PiArrowLeftBold,
  PiShieldCheckBold,
  PiBookmarksBold,
  PiSquareBold,
  PiCheckSquareFill,
  PiSlidersHorizontalBold,
  PiMegaphoneBold,
  PiClockCounterClockwiseBold,
  PiListBulletsBold,
  PiDownloadSimpleBold,
  PiTrendUpBold,
} from 'react-icons/pi';

import { AuthContext } from '../context/AuthContext';
import { adminService, bookService } from '../services/api';
import { getBookCoverUrl } from '../utils/imageHelper';
import Spinner from '../components/Spinner';
import BookModal from '../components/home/BookModal';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // Active Tab: 'overview' | 'books' | 'readers' | 'reviews' | 'announcement' | 'audit' | 'system'
  const [activeTab, setActiveTab] = useState('overview');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Core Data
  const [statsData, setStatsData] = useState(null);
  const [booksList, setBooksList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);
  const [announcementData, setAnnouncementData] = useState({
    text: '',
    subtext: '',
    badge: 'Curator Dispatch 🌸',
    active: true,
    tone: 'burgundy',
    link: '',
  });

  // Filtering & Search
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategoryFilter, setBookCategoryFilter] = useState('All');
  const [bookSortBy, setBookSortBy] = useState('latest');
  const [featuredFilter, setFeaturedFilter] = useState('all'); // 'all' | 'featured' | 'standard'
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [reviewSearch, setReviewSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('all');

  // Multi-Select States
  const [selectedBookIds, setSelectedBookIds] = useState(new Set());
  const [selectedReviewItems, setSelectedReviewItems] = useState([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');

  // Modals & In-Place Drawers
  const [previewBook, setPreviewBook] = useState(null);
  const [editDrawerBook, setEditDrawerBook] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'book' | 'user' | 'review' | 'bulk-books' | 'bulk-reviews' | 'reseed'
    id: null,
    secondaryId: null,
    title: '',
    count: 0,
  });

  // Load All Telemetry & Administrative Data
  const loadDashboardData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, booksRes, usersRes, reviewsRes, logsRes, announceRes] = await Promise.all([
        adminService.getStats(),
        bookService.getAll({ limit: 150 }),
        adminService.getUsers(),
        adminService.getReviews(),
        adminService.getAuditLogs(),
        adminService.getAnnouncement(),
      ]);

      if (statsRes?.data?.stats) setStatsData(statsRes.data);
      if (booksRes?.data?.data) setBooksList(booksRes.data.data);
      if (usersRes?.data?.users) setUsersList(usersRes.data.users);
      if (reviewsRes?.data?.reviews) setReviewsList(reviewsRes.data.reviews);
      if (logsRes?.data?.logs) setAuditLogsList(logsRes.data.logs);
      if (announceRes?.data?.announcement) setAnnouncementData(announceRes.data.announcement);
    } catch (err) {
      console.error('Error fetching admin telemetry:', err);
      enqueueSnackbar(err.customMessage || 'Failed to load library desk data', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    let result = [...booksList];

    if (bookSearch.trim()) {
      const query = bookSearch.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(query) ||
          b.author?.toLowerCase().includes(query) ||
          b.isbn?.toLowerCase().includes(query)
      );
    }

    if (bookCategoryFilter !== 'All') {
      result = result.filter(
        (b) => b.category?.toLowerCase() === bookCategoryFilter.toLowerCase()
      );
    }

    if (featuredFilter === 'featured') {
      result = result.filter((b) => b.isFeatured);
    } else if (featuredFilter === 'standard') {
      result = result.filter((b) => !b.isFeatured);
    }

    if (bookSortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (bookSortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (bookSortBy === 'rating') {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (bookSortBy === 'year') {
      result.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }

    return result;
  }, [booksList, bookSearch, bookCategoryFilter, featuredFilter, bookSortBy]);

  // Unique categories
  const allCategories = useMemo(() => {
    const set = new Set();
    booksList.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [booksList]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    let result = [...usersList];

    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    if (userRoleFilter !== 'All') {
      result = result.filter((u) => u.role === userRoleFilter);
    }

    return result;
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviewsList];

    if (reviewSearch.trim()) {
      const q = reviewSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.bookTitle?.toLowerCase().includes(q) ||
          r.username?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [reviewsList, reviewSearch]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    let result = [...auditLogsList];
    if (auditCategoryFilter !== 'all') {
      result = result.filter((l) => l.category === auditCategoryFilter);
    }
    return result;
  }, [auditLogsList, auditCategoryFilter]);

  // 1. Feature / Spotlight Toggle
  const handleToggleSpotlight = async (book, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await adminService.toggleFeatureBook(book._id);
      enqueueSnackbar(res.data.message || 'Staff Pick updated ✨', { variant: 'success' });
      setBooksList((prev) =>
        prev.map((b) => (b._id === book._id ? { ...b, isFeatured: res.data.isFeatured } : b))
      );
      if (editDrawerBook && editDrawerBook._id === book._id) {
        setEditDrawerBook((prev) => ({ ...prev, isFeatured: res.data.isFeatured }));
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Could not update spotlight', {
        variant: 'error',
      });
    }
  };

  // 2. In-Place Quick Edit Save
  const handleSaveQuickEdit = async (e) => {
    e.preventDefault();
    if (!editDrawerBook) return;

    try {
      setActionLoading(true);
      const res = await adminService.quickEditBook(editDrawerBook._id, editDrawerBook);
      enqueueSnackbar(res.data.message || 'Story updated in the catalog! 🌸', { variant: 'success' });
      setBooksList((prev) =>
        prev.map((b) => (b._id === editDrawerBook._id ? { ...b, ...res.data.book } : b))
      );
      setEditDrawerBook(null);
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to save changes', {
        variant: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Multi-Select Handlers
  const handleToggleSelectBook = (id) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllBooks = () => {
    if (selectedBookIds.size === filteredBooks.length) {
      setSelectedBookIds(new Set());
    } else {
      setSelectedBookIds(new Set(filteredBooks.map((b) => b._id)));
    }
  };

  const handleExecuteBulkDeleteBooks = async () => {
    try {
      setActionLoading(true);
      const ids = Array.from(selectedBookIds);
      const res = await adminService.bulkDeleteBooks(ids);
      enqueueSnackbar(res.data.message || `Removed ${ids.length} stories`, { variant: 'success' });
      setBooksList((prev) => prev.filter((b) => !selectedBookIds.has(b._id)));
      setSelectedBookIds(new Set());
      setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 });
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Bulk delete failed', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteBulkCategory = async () => {
    if (!bulkCategoryTarget.trim() || selectedBookIds.size === 0) return;
    try {
      setActionLoading(true);
      const ids = Array.from(selectedBookIds);
      const res = await adminService.bulkUpdateCategory(ids, bulkCategoryTarget.trim());
      enqueueSnackbar(res.data.message || 'Genres updated ✨', { variant: 'success' });
      setBooksList((prev) =>
        prev.map((b) => (selectedBookIds.has(b._id) ? { ...b, category: bulkCategoryTarget.trim() } : b))
      );
      setSelectedBookIds(new Set());
      setBulkCategoryTarget('');
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Bulk category update failed', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportSelectedCsv = () => {
    const selected = booksList.filter((b) => selectedBookIds.has(b._id));
    if (!selected.length) return;

    const headers = ['Title', 'Author', 'Publish Year', 'Category', 'Rating', 'Pages', 'ISBN'];
    const rows = selected.map((b) => [
      `"${(b.title || '').replace(/"/g, '""')}"`,
      `"${(b.author || '').replace(/"/g, '""')}"`,
      b.publishYear || '',
      `"${(b.category || '').replace(/"/g, '""')}"`,
      b.averageRating || 0,
      b.pageCount || 0,
      `"${b.isbn || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `picked-stories-${selected.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    enqueueSnackbar(`Exported ${selected.length} books as CSV 📎`, { variant: 'info' });
  };

  const handleToggleSelectReview = (bookId, reviewId) => {
    setSelectedReviewItems((prev) => {
      const exists = prev.some((item) => item.reviewId === reviewId);
      if (exists) {
        return prev.filter((item) => item.reviewId !== reviewId);
      }
      return [...prev, { bookId, reviewId }];
    });
  };

  const handleSelectAllReviews = () => {
    if (selectedReviewItems.length === filteredReviews.length) {
      setSelectedReviewItems([]);
    } else {
      setSelectedReviewItems(filteredReviews.map((r) => ({ bookId: r.bookId, reviewId: r.reviewId })));
    }
  };

  const handleExecuteBulkDeleteReviews = async () => {
    try {
      setActionLoading(true);
      const res = await adminService.bulkDeleteReviews(selectedReviewItems);
      enqueueSnackbar(res.data.message || 'Marginalia moderated ✨', { variant: 'success' });
      const removedIds = new Set(selectedReviewItems.map((r) => r.reviewId));
      setReviewsList((prev) => prev.filter((r) => !removedIds.has(r.reviewId)));
      setSelectedReviewItems([]);
      setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 });
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to moderate reviews', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      setActionLoading(true);
      const res = await adminService.updateUserRole(targetUser._id, nextRole);
      enqueueSnackbar(res.data.message || `Member rank changed to ${nextRole} 🏷️`, { variant: 'success' });
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: nextRole } : u))
      );
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update role', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendWelcomeEmail = async (targetUser) => {
    try {
      setActionLoading(true);
      const res = await adminService.sendWelcomeEmail(targetUser._id);
      enqueueSnackbar(res.data.message || 'Passport dispatched to member inbox! 💌', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Could not dispatch email', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await adminService.updateAnnouncement(announcementData);
      enqueueSnackbar(res.data.message || 'Bulletin notice pinned! 📌', { variant: 'success' });
      setAnnouncementData(res.data.announcement);
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update announcement', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteReseed = async () => {
    try {
      setActionLoading(true);
      const res = await adminService.reseedCatalog();
      enqueueSnackbar(res.data.message || 'Classic library restored 🌸', { variant: 'success' });
      setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 });
      loadDashboardData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Reseed failed', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteDelete = async () => {
    const { type, id, secondaryId } = deleteModal;
    if (type === 'bulk-books') return handleExecuteBulkDeleteBooks();
    if (type === 'bulk-reviews') return handleExecuteBulkDeleteReviews();
    if (type === 'reseed') return handleExecuteReseed();
    if (!type || !id) return;

    try {
      setActionLoading(true);
      if (type === 'book') {
        await bookService.delete(id);
        enqueueSnackbar('Story removed from the shelves 🍂', { variant: 'success' });
        setBooksList((prev) => prev.filter((b) => b._id !== id));
        setReviewsList((prev) => prev.filter((r) => r.bookId !== id));
      } else if (type === 'user') {
        await adminService.deleteUser(id);
        enqueueSnackbar('Library card cancelled 🏷️', { variant: 'success' });
        setUsersList((prev) => prev.filter((u) => u._id !== id));
      } else if (type === 'review') {
        await adminService.deleteReview(id, secondaryId);
        enqueueSnackbar('Marginalia note removed ✨', { variant: 'success' });
        setReviewsList((prev) => prev.filter((r) => r.reviewId !== secondaryId));
      }
      setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 });
      loadDashboardData(true);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Could not complete removal', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#FFF9ED] border-2 border-[#EADFC9] text-[#861D2D] flex items-center justify-center mb-4 shadow-sm animate-bounce">
            <span className="text-3xl">☕</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2723]">
            Brewing tea &amp; opening the desk...
          </h2>
          <p className="text-xs text-[#8C827A] font-mono mt-1">
            pulling the book stacks and reader ledger onto the board ✨
          </p>
          <div className="mt-5">
            <Spinner />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { stats, system, recentBooks = [], recentUsers = [] } = statsData || {};
  const histogram = stats?.ratingHistogram || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalHistogramReviews = Object.values(histogram).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#2C2723] selection:bg-[#F2D7D9] selection:text-[#7A1D28] flex flex-col relative font-sans">
      <Navbar />

      {/* CUTE PINTEREST SCRAPBOOK HEADER */}
      <section className="relative pt-7 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[#EADBCC]/70 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FBF8F2]">
        
        {/* Subtle washi tape accent strips in background */}
        <div className="absolute top-2 left-10 w-20 h-4 bg-[#F2DDD9]/80 rounded-xs shadow-2xs -rotate-2 pointer-events-none hidden md:block" />
        <div className="absolute top-3 right-16 w-24 h-4 bg-[#E2EBDC]/80 rounded-xs shadow-2xs rotate-1 pointer-events-none hidden md:block" />

        <div className="max-w-7xl mx-auto">
          {/* Top greeting pill & quick badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#EADBCC] shadow-2xs">
              <span className="text-sm">🌸</span>
              <span className="font-serif font-bold text-[#7A1D28]">
                Good day, {user?.username || 'Librarian'}!
              </span>
              <span className="text-[#A89F95]">&bull;</span>
              <span className="text-[11px] font-mono text-[#8C827A]">
                The cozy reading room is quiet today
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Snapshot Backup Download */}
              <a
                href={adminService.getBackupJsonUrl()}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF4EB] border border-[#EADBCC] text-[#2C2723] hover:text-[#7A1D28] text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Download cute JSON backup of all stories & reviews"
              >
                <span>📦</span>
                <span>Backup Archive</span>
              </a>

              {/* Refresh Desk */}
              <button
                type="button"
                onClick={() => loadDashboardData(false)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF4EB] border border-[#EADBCC] text-[#2C2723] hover:text-[#7A1D28] text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <PiArrowClockwiseBold className={`text-xs ${refreshing ? 'animate-spin text-[#7A1D28]' : ''}`} />
                <span>{refreshing ? 'Tidying desk...' : 'Tidy Desk ✨'}</span>
              </button>
            </div>
          </div>

          {/* Hero Collage Row */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Cute Polaroid Avatar with tape */}
              <div className="relative group flex-shrink-0">
                <div className="w-16 h-18 p-1.5 pb-3 bg-white rounded-xl shadow-sm border border-[#EADBCC] -rotate-2 group-hover:rotate-0 transition-transform">
                  <div className="w-full h-11 rounded-lg bg-[#FCEEEB] text-[#7A1D28] flex items-center justify-center font-serif text-2xl font-bold">
                    ☕
                  </div>
                  <span className="text-[9px] font-mono font-bold text-center block text-[#8C827A] mt-0.5">
                    HEAD DESK
                  </span>
                </div>
                {/* Gold washi tape sticker */}
                <div className="absolute -top-2 left-3 w-10 h-3.5 bg-[#F6E5B8]/90 rounded-xs shadow-2xs -rotate-6 pointer-events-none" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2723] tracking-tight">
                    The Head Librarian&apos;s Desk
                  </h1>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FCEEEB] text-[#861D2D] border border-[#F3D3CC] text-[11px] font-mono font-bold">
                    <span>🎀</span>
                    <span>COZY CURATOR</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#7D736A] font-serif italic mt-1 max-w-2xl leading-relaxed">
                  Pin stories to the front window, welcome fellow bookworms, manage reading shelves, and keep the library lovely.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/books/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                <span>➕</span>
                <span>Pin New Story</span>
              </Link>

              <a
                href={adminService.getExportCsvUrl()}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-[#FAF4EB] text-[#2C2723] border border-[#EADBCC] text-xs font-semibold shadow-2xs hover:border-[#861D2D]/40 transition-colors cursor-pointer"
              >
                <span>📑</span>
                <span>Export CSV</span>
              </a>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-transparent hover:bg-black/5 text-[#7D736A] hover:text-[#2C2723] text-xs font-medium transition-colors"
              >
                <span>📖</span>
                <span>Public Shelves</span>
              </Link>
            </div>
          </div>

          {/* CUTE SCRAPBOOK PINNED TABS */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: 'overview', emoji: '📌', label: 'The Pinboard', badge: null, color: 'bg-[#FFF9EE]' },
              { id: 'books', emoji: '📚', label: 'Book Stacks', badge: booksList.length, color: 'bg-[#FCEEEB]' },
              { id: 'readers', emoji: '💌', label: 'Book Club', badge: usersList.length, color: 'bg-[#EBF3EA]' },
              { id: 'reviews', emoji: '💭', label: 'Little Critiques', badge: reviewsList.length, color: 'bg-[#F2EEF9]' },
              { id: 'announcement', emoji: '📢', label: 'Bulletin Board', badge: announcementData?.active ? 'Active' : null, color: 'bg-[#FEF8E3]' },
              { id: 'audit', emoji: '📓', label: "Curator's Diary", badge: auditLogsList.length, color: 'bg-[#FAF2EB]' },
              { id: 'system', emoji: '🗄️', label: 'The Vault', badge: null, color: 'bg-[#EDF4F5]' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 border ${
                    isActive
                      ? 'bg-[#861D2D] text-white border-[#701826] shadow-xs -translate-y-0.5'
                      : 'bg-white/80 hover:bg-white text-[#4A423C] border-[#EADBCC] hover:-translate-y-0.5 shadow-2xs'
                  }`}
                >
                  <span className="text-sm">{tab.emoji}</span>
                  <span className="font-serif">{tab.label}</span>
                  {tab.badge !== null && (
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold leading-tight ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.badge === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#F0E6D8] text-[#7D736A]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CUTE CORKBOARD / LINEN CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* ========================================================= */}
        {/* TAB 1: THE PINBOARD (COLLAGE METRICS & COZY MOOD)         */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 4 Cute Tilted Sticky Notes Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Sticky Note 1: Buttercream Story Stack */}
              <div className="relative bg-[#FEF9E7] rounded-3xl p-5 border border-[#EFE3B8] shadow-xs -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all">
                {/* Mint washi tape on top */}
                <div className="absolute -top-2.5 left-10 w-16 h-4 bg-[#DCE7D3]/90 rounded-xs shadow-2xs rotate-2 pointer-events-none" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#8A793A]">
                    📚 The Shelves
                  </span>
                  <span className="text-base">✨</span>
                </div>
                <div className="mt-2.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#42340F]">
                    {stats?.totalBooks || booksList.length || 0}
                  </span>
                  <p className="text-xs text-[#7A6A32] font-serif italic mt-0.5">
                    stories lovingly bound &amp; cataloged
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0E1AE] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#8A793A]">
                    {stats?.featuredBooksCount || 0} Staff Picks 🍒
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className="font-bold text-[#861D2D] hover:underline"
                  >
                    browse &rarr;
                  </button>
                </div>
              </div>

              {/* Sticky Note 2: Blush Pink Book Club */}
              <div className="relative bg-[#FDF0ED] rounded-3xl p-5 border border-[#F5D5CE] shadow-xs rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all">
                {/* Kraft washi tape */}
                <div className="absolute -top-2.5 right-10 w-16 h-4 bg-[#EADCC8]/90 rounded-xs shadow-2xs -rotate-1 pointer-events-none" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#A25042]">
                    💌 Book Club
                  </span>
                  <span className="text-base">🌸</span>
                </div>
                <div className="mt-2.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#56221A]">
                    {stats?.totalUsers || usersList.length || 0}
                  </span>
                  <p className="text-xs text-[#904437] font-serif italic mt-0.5">
                    fellow bookworms with passports
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F5C7BD] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#A25042]">Active Readers</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('readers')}
                    className="font-bold text-[#861D2D] hover:underline"
                  >
                    meet &rarr;
                  </button>
                </div>
              </div>

              {/* Sticky Note 3: Sage Mint Critiques */}
              <div className="relative bg-[#EDF4EB] rounded-3xl p-5 border border-[#D5E6D1] shadow-xs -rotate-0.5 hover:rotate-0 hover:-translate-y-1 transition-all">
                {/* Pastel pink tape */}
                <div className="absolute -top-2.5 left-8 w-16 h-4 bg-[#F5DCD7]/90 rounded-xs shadow-2xs rotate-1 pointer-events-none" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#4D754B]">
                    💭 Little Notes
                  </span>
                  <span className="text-base">📎</span>
                </div>
                <div className="mt-2.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#20401E]">
                    {stats?.totalReviews || reviewsList.length || 0}
                  </span>
                  <p className="text-xs text-[#40683E] font-serif italic mt-0.5">
                    penned margin notes &amp; reviews
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#CCE2C7] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#4D754B]">Centralized</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="font-bold text-[#861D2D] hover:underline"
                  >
                    moderate &rarr;
                  </button>
                </div>
              </div>

              {/* Sticky Note 4: Lavender Glow Rating */}
              <div className="relative bg-[#F3EEF9] rounded-3xl p-5 border border-[#E0D4EF] shadow-xs rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all">
                {/* Yellow tape */}
                <div className="absolute -top-2.5 right-8 w-16 h-4 bg-[#FCECB5]/90 rounded-xs shadow-2xs -rotate-2 pointer-events-none" />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#684C8A]">
                    ⭐ Library Glow
                  </span>
                  <span className="text-base">🌙</span>
                </div>
                <div className="mt-2.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#351E52]">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : '4.8'}
                  </span>
                  <p className="text-xs text-[#5D427D] font-serif italic mt-0.5">
                    out of 5.0 stars community acclaim
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DACBEB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <PiStarFill key={i} className="text-xs" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#684C8A] font-bold">Pure Love</span>
                </div>
              </div>
            </div>

            {/* Split Section: Aesthetic Genre Swatches & Star Sentiment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Genre Atmosphere Swatches */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADBCC] shadow-xs relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C2723]">
                        Genre Atmosphere &amp; Colorways
                      </h3>
                      <p className="text-xs text-[#8C827A] font-serif italic">
                        The palette of stories filling our quiet room
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF4EB] border border-[#EADBCC] text-[10px] font-mono font-bold text-[#861D2D]">
                    {stats?.categoryDistribution?.length || 0} GENRES
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {(stats?.categoryDistribution || []).slice(0, 6).map((item, idx) => {
                    const total = stats?.totalBooks || booksList.length || 1;
                    const pct = Math.round((item.count / total) * 100);
                    return (
                      <div key={item.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-serif font-bold text-[#2C2723] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#861D2D]" />
                            <span>{item.category}</span>
                          </span>
                          <span className="font-mono text-[#8C827A] text-[11px]">
                            {item.count} stories ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#FAF6EE] overflow-hidden border border-[#EADBCC]/50">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx % 4 === 0
                                ? 'bg-[#861D2D]'
                                : idx % 4 === 1
                                ? 'bg-[#C99A48]'
                                : idx % 4 === 2
                                ? 'bg-[#4D754B]'
                                : 'bg-[#7A5B94]'
                            }`}
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reader Sentiment & Star Review Jars */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADBCC] shadow-xs relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C2723]">
                        Reader Love &amp; Star Jars
                      </h3>
                      <p className="text-xs text-[#8C827A] font-serif italic">
                        Heartfelt ratings penned across our volumes
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FEF8E3] border border-[#EFE3B8] text-[10px] font-mono font-bold text-[#8A793A]">
                    {reviewsList.length} NOTES
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = histogram[star] || 0;
                    const pct = Math.round((count / totalHistogramReviews) * 100);
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-12 font-mono font-bold text-[#2C2723] flex items-center gap-1 flex-shrink-0">
                          <span>{star}</span>
                          <PiStarFill className="text-amber-400 text-xs" />
                        </span>

                        <div className="flex-1 h-3 rounded-full bg-[#FAF6EE] overflow-hidden border border-[#EADBCC]/60">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              star >= 4 ? 'bg-amber-400' : star === 3 ? 'bg-amber-300' : 'bg-stone-300'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <span className="w-16 text-right font-mono text-[11px] text-[#8C827A] font-semibold flex-shrink-0">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cozy Sentiment Pill */}
                <div className="mt-5 p-3 rounded-2xl bg-[#FBF6EE] border border-[#EADBCC] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-base">🌸</span>
                    <span className="font-serif font-bold text-[#2C2723]">
                      Community Glow Index:
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {Math.round(((histogram[5] + histogram[4]) / totalHistogramReviews) * 100)}% Positive Acclaim
                  </span>
                </div>
              </div>
            </div>

            {/* Split Section: Fresh Stacks Polaroid Stream & Guild Readers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recently Shelved Stories */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📖</span>
                    <h3 className="font-serif text-base font-bold text-[#2C2723]">
                      Fresh Volumes on the Table
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className="text-xs text-[#861D2D] hover:underline font-bold"
                  >
                    view all &rarr;
                  </button>
                </div>

                <div className="mt-4 divide-y divide-[#FAF3E8]">
                  {recentBooks.slice(0, 4).map((book) => {
                    const cover = getBookCoverUrl(book.image, book.title);
                    return (
                      <div key={book._id} className="py-3 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-14 rounded-lg bg-[#FAF6EE] border border-[#EADBCC] overflow-hidden flex-shrink-0 shadow-2xs">
                            {cover ? (
                              <img src={cover} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-serif text-[11px] text-[#861D2D] font-bold">
                                {book.title?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#2C2723] truncate group-hover:text-[#861D2D] transition-colors">
                                {book.title}
                              </h4>
                              {book.isFeatured && (
                                <span className="text-amber-500 text-xs flex-shrink-0" title="Staff Pick">
                                  ✨
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#8C827A] font-serif italic truncate">
                              by {book.author}
                            </p>
                            <span className="inline-block text-[9px] font-mono text-[#861D2D] bg-[#FCEEEB] px-2 py-0.2 rounded-full mt-1 font-bold">
                              {book.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditDrawerBook(book)}
                            className="p-2 rounded-full hover:bg-[#FCEEEB] text-[#7D736A] hover:text-[#861D2D] transition-colors cursor-pointer"
                            title="Quick Edit in slide drawer"
                          >
                            <PiPencilSimpleBold className="text-xs" />
                          </button>
                          <Link
                            to={`/books/details/${book._id}`}
                            className="p-2 rounded-full hover:bg-[#FAF4EB] text-[#7D736A] hover:text-[#2C2723] transition-colors"
                            title="View Public Details"
                          >
                            <PiEyeBold className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Newly Welcomed Readers */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADBCC] shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💌</span>
                    <h3 className="font-serif text-base font-bold text-[#2C2723]">
                      New Book Club Bookworms
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('readers')}
                    className="text-xs text-[#861D2D] hover:underline font-bold"
                  >
                    view all &rarr;
                  </button>
                </div>

                <div className="mt-4 divide-y divide-[#FAF3E8]">
                  {recentUsers.slice(0, 4).map((member) => (
                    <div key={member._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#FCEEEB] border border-[#F3D3CC] text-[#861D2D] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-[#2C2723] truncate">
                              {member.username}
                            </h4>
                            {member.role === 'admin' && (
                              <span className="px-2 py-0.2 rounded-full bg-[#FEF8E3] text-[#8A793A] text-[9px] font-mono font-bold">
                                Librarian
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8C827A] font-mono truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-[#A89F95] flex-shrink-0">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BOOK STACKS (POLAROID PINTEREST PINBOARD)           */}
        {/* ========================================================= */}
        {activeTab === 'books' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Cute Filter Toolbar */}
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Cozy Search */}
              <div className="relative w-full md:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="find a cozy story, author, or ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white transition-colors placeholder-[#A89F95]"
                />
                {bookSearch && (
                  <button
                    onClick={() => setBookSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    <PiXBold />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-full border border-[#EADBCC] bg-white text-xs font-semibold text-[#2C2723] focus:outline-none focus:border-[#861D2D] cursor-pointer shadow-2xs"
                >
                  <option value="all">All Stories</option>
                  <option value="featured">✨ Staff Picks Only</option>
                  <option value="standard">Standard Catalog</option>
                </select>

                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-full border border-[#EADBCC] bg-white text-xs font-semibold text-[#2C2723] focus:outline-none focus:border-[#861D2D] cursor-pointer shadow-2xs"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Genres' : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={bookSortBy}
                  onChange={(e) => setBookSortBy(e.target.value)}
                  className="px-3.5 py-2 rounded-full border border-[#EADBCC] bg-white text-xs font-semibold text-[#2C2723] focus:outline-none focus:border-[#861D2D] cursor-pointer shadow-2xs"
                >
                  <option value="latest">Latest Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Publish Year</option>
                </select>

                <Link
                  to="/books/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <span>➕</span>
                  <span>Pin Story</span>
                </Link>
              </div>
            </div>

            {/* Select All Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSelectAllBooks}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADBCC] text-xs font-semibold text-[#2C2723] hover:bg-[#FAF4EB] transition-colors shadow-2xs cursor-pointer"
                >
                  {selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0 ? (
                    <PiCheckSquareFill className="text-base text-[#861D2D]" />
                  ) : (
                    <PiSquareBold className="text-base text-stone-400" />
                  )}
                  <span>
                    {selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0
                      ? 'Deselect All'
                      : 'Select All Books'}
                  </span>
                </button>

                <span className="font-mono text-[#8C827A] text-[11px]">
                  {selectedBookIds.size} of {filteredBooks.length} picked
                </span>
              </div>

              {/* Cute Floating Washi-Tape Bulk Action Bar */}
              {selectedBookIds.size > 0 && (
                <div className="flex items-center gap-2 p-1.5 px-3.5 rounded-full bg-[#2C2723] text-white shadow-md animate-fade-in flex-wrap">
                  <span className="text-[11px] font-mono text-[#FCEEEB] font-bold pr-1">
                    ✨ {selectedBookIds.size} PICKED:
                  </span>

                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="New genre..."
                      value={bulkCategoryTarget}
                      onChange={(e) => setBulkCategoryTarget(e.target.value)}
                      className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] border border-white/20 placeholder-stone-400 focus:outline-none focus:bg-white focus:text-[#2C2723] w-24"
                    />
                    <button
                      type="button"
                      onClick={handleExecuteBulkCategory}
                      disabled={!bulkCategoryTarget.trim() || actionLoading}
                      className="px-2.5 py-1 rounded-full bg-[#FCEEEB] text-[#7A1D28] font-bold text-[11px] hover:bg-white transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportSelectedCsv}
                    className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-[11px] transition-colors flex items-center gap-1"
                  >
                    <span>📥</span>
                    <span>CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'bulk-books',
                        count: selectedBookIds.size,
                        title: `${selectedBookIds.size} Picked Stories`,
                      })
                    }
                    className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* PINTEREST POLAROID BOOK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book, idx) => {
                const cover = getBookCoverUrl(book.image, book.title, book.isbn);
                const isSelected = selectedBookIds.has(book._id);
                // Subtle organic tilt
                const tilt = idx % 3 === 0 ? '-rotate-[0.5deg]' : idx % 3 === 1 ? 'rotate-[0.5deg]' : 'rotate-0';

                return (
                  <div
                    key={book._id}
                    className={`group bg-white rounded-3xl p-3 pb-4 border transition-all flex flex-col justify-between relative shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:rotate-0 ${tilt} ${
                      isSelected
                        ? 'border-[#861D2D] ring-2 ring-[#861D2D]/30'
                        : 'border-[#EADBCC]'
                    }`}
                  >
                    {/* Cute washi tape on top of polaroid */}
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-xs shadow-2xs pointer-events-none ${
                        idx % 4 === 0
                          ? 'bg-[#F2DDD9]/90 rotate-1'
                          : idx % 4 === 1
                          ? 'bg-[#E2EBDC]/90 -rotate-2'
                          : idx % 4 === 2
                          ? 'bg-[#FEF5D4]/90 rotate-2'
                          : 'bg-[#EFE8F7]/90 -rotate-1'
                      }`}
                    />

                    {/* Multi-select round check pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectBook(book._id)}
                      className="absolute top-4 left-4 z-20 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-700 shadow-xs hover:scale-110 transition-transform"
                      title={isSelected ? 'Deselect story' : 'Select story'}
                    >
                      {isSelected ? (
                        <PiCheckSquareFill className="text-lg text-[#861D2D]" />
                      ) : (
                        <PiSquareBold className="text-base text-stone-400 group-hover:text-stone-700" />
                      )}
                    </button>

                    {/* Cute Staff Pick Sparkle Sticker */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSpotlight(book, e)}
                      title={book.isFeatured ? 'Staff Pick ✨ (Click to unpin)' : 'Pin as Staff Pick'}
                      className={`absolute top-4 right-4 z-20 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1 ${
                        book.isFeatured
                          ? 'bg-amber-300 text-stone-900 border border-amber-400 shadow-sm'
                          : 'bg-white/80 hover:bg-white text-stone-400 hover:text-amber-500'
                      }`}
                    >
                      <span>✨</span>
                      {book.isFeatured && <span>PICK</span>}
                    </button>

                    <div>
                      {/* Polaroid Cover Window */}
                      <div className="relative aspect-[3/4] rounded-2xl bg-[#FAF6EE] overflow-hidden border border-[#EADBCC]/60 mt-1">
                        {cover ? (
                          <img
                            src={cover}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-4xl mb-1">📖</span>
                            <span className="font-serif font-bold text-xs text-[#2C2723]">
                              {book.title}
                            </span>
                          </div>
                        )}

                        {/* Category Tag Pill */}
                        <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                          {book.category}
                        </span>

                        {/* Rating Badge */}
                        {book.averageRating > 0 && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#2C2723] text-[10px] font-mono font-bold shadow-xs flex items-center gap-1">
                            <PiStarFill className="text-amber-400 text-xs" />
                            <span>{book.averageRating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {/* Handwritten-Style Book Info */}
                      <div className="pt-3 px-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-[#2C2723] leading-snug group-hover:text-[#861D2D] transition-colors line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#7D736A] font-serif italic mt-0.5 truncate">
                          by <span className="text-[#3F3731] font-medium not-italic">{book.author}</span>
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#FAF3E8] flex items-center justify-between text-[11px] font-mono text-[#8C827A]">
                          <span>{book.publishYear}</span>
                          {book.pageCount > 0 && <span>{book.pageCount} pages</span>}
                        </div>
                      </div>
                    </div>

                    {/* Cute Action Bar */}
                    <div className="mt-3 pt-2.5 border-t border-[#FAF3E8] flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewBook(book)}
                          className="p-1.5 rounded-full bg-[#FAF6EE] hover:bg-[#FCEEEB] text-[#7D736A] hover:text-[#861D2D] text-xs transition-colors cursor-pointer"
                          title="Peek inside"
                        >
                          <PiEyeBold />
                        </button>

                        <Link
                          to={`/books/details/${book._id}`}
                          className="px-2.5 py-0.5 rounded-full bg-[#FAF6EE] hover:bg-[#FCEEEB] text-[#7D736A] hover:text-[#861D2D] text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </Link>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditDrawerBook(book)}
                          className="p-1.5 rounded-full bg-[#FAF6EE] hover:bg-[#FCEEEB] text-[#7D736A] hover:text-[#861D2D] text-xs transition-colors cursor-pointer"
                          title="Quick Edit in slide drawer"
                        >
                          <PiPencilSimpleBold />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: 'book',
                              id: book._id,
                              title: book.title,
                            })
                          }
                          className="p-1.5 rounded-full bg-[#FAF6EE] hover:bg-red-50 text-[#7D736A] hover:text-red-700 text-xs transition-colors cursor-pointer"
                          title="Remove from stacks"
                        >
                          <PiTrashBold />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCC] p-8">
                <span className="text-5xl block mb-2">🍂</span>
                <h4 className="font-serif text-lg font-bold text-[#2C2723]">No Stories Found in This Stack</h4>
                <p className="text-xs text-[#8C827A] font-serif italic mt-1">
                  Try clearing the search or category filter to reveal more lovely reads.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBookSearch('');
                    setBookCategoryFilter('All');
                    setFeaturedFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-[#861D2D] text-white text-xs font-semibold"
                >
                  Clear Filters 🌸
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BOOK CLUB (CUTE LIBRARY CARD LEDGER)                */}
        {/* ========================================================= */}
        {activeTab === 'readers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="search bookworms by moniker or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white transition-colors placeholder-[#A89F95]"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-[#EADBCC] bg-white text-xs font-semibold text-[#2C2723] focus:outline-none focus:border-[#861D2D] cursor-pointer shadow-2xs"
              >
                <option value="All">All Bookworms ({usersList.length})</option>
                <option value="admin">Librarians Only 🎀</option>
                <option value="user">Fellow Readers Only 🌸</option>
              </select>
            </div>

            {/* Aesthetic Borrower Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredUsers.map((member) => {
                const isSelf = member._id === user?._id;
                const isMemberAdmin = member.role === 'admin';
                return (
                  <div
                    key={member._id}
                    className="relative bg-white rounded-3xl p-5 border border-[#EADBCC] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    {/* Washi tape header */}
                    <div className="absolute top-0 right-8 w-14 h-3 bg-[#EADBCC]/80 rounded-b -rotate-1 pointer-events-none" />

                    <div>
                      {/* Avatar & Header */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif font-bold text-lg flex-shrink-0 shadow-2xs ${
                            isMemberAdmin
                              ? 'bg-[#FEF8E3] border border-[#EFE3B8] text-[#8A793A]'
                              : 'bg-[#FCEEEB] border border-[#F3D3CC] text-[#861D2D]'
                          }`}
                        >
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif text-sm font-bold text-[#2C2723] truncate">
                              {member.username}
                            </h4>
                            {isSelf && (
                              <span className="text-[9px] font-mono text-[#861D2D] bg-[#FCEEEB] px-1.5 py-0.2 rounded-full font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8C827A] font-mono truncate mt-0.5">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      {/* Borrower card tag details */}
                      <div className="mt-4 p-3 rounded-2xl bg-[#FAF6EE] border border-[#EADBCC]/60 text-[11px] font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C827A]">Rank:</span>
                          <span
                            className={`font-bold uppercase ${
                              isMemberAdmin ? 'text-[#8A793A]' : 'text-[#861D2D]'
                            }`}
                          >
                            {isMemberAdmin ? '👑 Librarian' : '📖 Reader'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C827A]">Enrolled:</span>
                          <span className="text-[#4A423C]">
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Member Action Bar */}
                    <div className="mt-4 pt-3 border-t border-[#FAF3E8] flex items-center justify-between gap-1 text-xs">
                      {/* Send Passport */}
                      <button
                        type="button"
                        onClick={() => handleSendWelcomeEmail(member)}
                        disabled={actionLoading}
                        title="Send reader passport welcome email"
                        className="p-1.5 px-2.5 rounded-full bg-[#FAF6EE] hover:bg-[#FCEEEB] text-[#7D736A] hover:text-[#861D2D] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>💌</span>
                        <span>Passport</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Promote / Demote */}
                        <button
                          type="button"
                          onClick={() => handleToggleUserRole(member)}
                          disabled={isSelf || actionLoading}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            isSelf
                              ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400'
                              : isMemberAdmin
                              ? 'bg-[#FEF8E3] hover:bg-[#FDF0CE] text-[#8A793A] cursor-pointer'
                              : 'bg-[#FAF6EE] hover:bg-[#FCEEEB] text-[#861D2D] cursor-pointer'
                          }`}
                        >
                          {isMemberAdmin ? 'Revoke Admin' : 'Make Admin 👑'}
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              type: 'user',
                              id: member._id,
                              title: member.username,
                            })
                          }
                          disabled={isSelf || actionLoading}
                          className="p-1.5 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                          title="Cancel library card"
                        >
                          <PiTrashBold />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LITTLE CRITIQUES (STICKY NOTES PINBOARD)           */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="search reviews by reader, book, or thoughts..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white transition-colors placeholder-[#A89F95]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllReviews}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADBCC] text-xs font-semibold text-[#2C2723] hover:bg-[#FAF4EB] transition-colors shadow-2xs cursor-pointer"
                >
                  {selectedReviewItems.length === filteredReviews.length && filteredReviews.length > 0 ? (
                    <PiCheckSquareFill className="text-base text-[#861D2D]" />
                  ) : (
                    <PiSquareBold className="text-base text-stone-400" />
                  )}
                  <span>Select All</span>
                </button>

                {selectedReviewItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'bulk-reviews',
                        count: selectedReviewItems.length,
                        title: `${selectedReviewItems.length} Reader Critiques`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                  >
                    <span>🗑️</span>
                    <span>Moderate Selected ({selectedReviewItems.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reviews Sticky Notes Pinboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((rev, idx) => {
                const cover = getBookCoverUrl(rev.bookImage, rev.bookTitle);
                const isSelected = selectedReviewItems.some((item) => item.reviewId === rev.reviewId);
                const stickyTone =
                  idx % 3 === 0 ? 'bg-[#FEF9E7] border-[#EFE3B8]' : idx % 3 === 1 ? 'bg-[#FDF0ED] border-[#F5D5CE]' : 'bg-[#EDF4EB] border-[#D5E6D1]';
                const tilt = idx % 2 === 0 ? '-rotate-1' : 'rotate-1';

                return (
                  <div
                    key={rev.reviewId}
                    className={`relative rounded-3xl p-5 border shadow-xs hover:shadow-md hover:rotate-0 transition-all flex flex-col justify-between ${stickyTone} ${tilt} ${
                      isSelected ? 'ring-2 ring-[#861D2D]' : ''
                    }`}
                  >
                    {/* Cute paperclip at top right */}
                    <div className="absolute -top-3 right-8 text-xl text-stone-600 pointer-events-none">
                      📎
                    </div>

                    <div>
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleSelectReview(rev.bookId, rev.reviewId)}
                        className="text-stone-400 hover:text-stone-700 mb-2 block"
                      >
                        {isSelected ? (
                          <PiCheckSquareFill className="text-lg text-[#861D2D]" />
                        ) : (
                          <PiSquareBold className="text-lg text-stone-300 hover:text-stone-600" />
                        )}
                      </button>

                      {/* Book header link */}
                      <Link
                        to={`/books/details/${rev.bookId}`}
                        className="flex items-center gap-3 pb-3 mb-3 border-b border-black/5 group"
                      >
                        <div className="w-9 h-12 rounded-lg bg-white border border-[#EADBCC] overflow-hidden flex-shrink-0 shadow-2xs">
                          {cover ? (
                            <img src={cover} alt={rev.bookTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif text-[10px] text-[#861D2D] font-bold">
                              {rev.bookTitle?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#2C2723] truncate group-hover:text-[#861D2D] transition-colors">
                            {rev.bookTitle}
                          </h4>
                          <span className="text-[10px] text-[#8C827A] font-serif italic block">
                            by {rev.bookAuthor}
                          </span>
                        </div>
                      </Link>

                      {/* Review author & rating */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-serif font-bold text-xs text-[#2C2723] flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-white text-[#861D2D] flex items-center justify-center text-[10px] font-mono shadow-2xs">
                            {rev.username?.charAt(0).toUpperCase()}
                          </span>
                          <span>{rev.username}</span>
                        </span>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <PiStarFill
                              key={s}
                              className={`text-xs ${
                                s <= rev.rating ? 'text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review text */}
                      <p className="font-serif italic text-xs text-[#3D352F] leading-relaxed bg-white/70 p-3 rounded-2xl border border-black/5 line-clamp-4">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    {/* Bottom toolbar */}
                    <div className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
                      <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: 'review',
                            id: rev.bookId,
                            secondaryId: rev.reviewId,
                            title: `Review by "${rev.username}" on "${rev.bookTitle}"`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-red-700 hover:underline font-semibold cursor-pointer"
                      >
                        <PiTrashBold />
                        <span>Moderate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCC] p-8">
                <span className="text-5xl block mb-2">💭</span>
                <h4 className="font-serif text-lg font-bold text-[#2C2723]">No Marginalia Found</h4>
                <p className="text-xs text-[#8C827A] font-serif italic mt-1">
                  Reader reviews will appear here for centralized curator moderation.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BULLETIN BOARD (LIVE SITE ANNOUNCEMENTS)           */}
        {/* ========================================================= */}
        {activeTab === 'announcement' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            
            {/* Live Preview Sticky Note */}
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs relative">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C827A] block mb-3 flex items-center gap-1">
                <span>📌</span>
                <span>Live Public Notice Preview</span>
              </span>

              {announcementData.active ? (
                <div
                  className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all ${
                    announcementData.tone === 'burgundy'
                      ? 'bg-[#861D2D] text-white border-[#701826]'
                      : announcementData.tone === 'amber'
                      ? 'bg-[#FEF8E3] text-[#8A793A] border-[#EFE3B8]'
                      : 'bg-[#1C1A19] text-[#F8E7B9] border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        announcementData.tone === 'burgundy'
                          ? 'bg-white/20 text-white'
                          : announcementData.tone === 'amber'
                          ? 'bg-[#8A793A]/15 text-[#8A793A]'
                          : 'bg-[#C99A48]/20 text-[#F8E7B9]'
                      }`}
                    >
                      {announcementData.badge || 'Curator Dispatch 🌸'}
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-semibold">
                      {announcementData.text || 'Type your message below...'}
                    </span>
                  </div>

                  {announcementData.subtext && (
                    <span className="text-[11px] font-serif italic opacity-85">
                      {announcementData.subtext}
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EADBCC] text-[#8C827A] text-xs text-center font-serif italic">
                  Notice is currently quiet (hidden from all readers).
                </div>
              )}
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSaveAnnouncement} className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF3E8]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C2723]">
                    Pin a Bulletin Announcement
                  </h3>
                  <p className="text-xs text-[#8C827A] font-serif italic">
                    Broadcast reading salon updates, weekend events, or book club prompts
                  </p>
                </div>

                {/* Active Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-mono font-bold text-[#2C2723]">
                    {announcementData.active ? 'Notice Live ✨' : 'Sleeping 💤'}
                  </span>
                  <input
                    type="checkbox"
                    checked={announcementData.active}
                    onChange={(e) => setAnnouncementData({ ...announcementData, active: e.target.checked })}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      announcementData.active ? 'bg-[#861D2D]' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        announcementData.active ? 'translate-x-5' : ''
                      }`}
                    />
                  </div>
                </label>
              </div>

              {/* Tone / Color selector */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#8C827A] mb-2">
                  Paper Vibe Tone
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'burgundy', label: 'Vintage Cherry 🍒', bg: 'bg-[#861D2D] text-white' },
                    { id: 'amber', label: 'Buttercup Honey 🍯', bg: 'bg-[#FEF8E3] text-[#8A793A] border border-[#EFE3B8]' },
                    { id: 'midnight', label: 'Midnight Library 🌙', bg: 'bg-[#1C1A19] text-[#F8E7B9]' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAnnouncementData({ ...announcementData, tone: t.id })}
                      className={`p-3 rounded-2xl text-xs font-semibold text-center transition-all cursor-pointer ${t.bg} ${
                        announcementData.tone === t.id
                          ? 'ring-2 ring-offset-2 ring-[#861D2D]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Label */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#8C827A] mb-1">
                  Sticker Badge
                </label>
                <input
                  type="text"
                  value={announcementData.badge}
                  onChange={(e) => setAnnouncementData({ ...announcementData, badge: e.target.value })}
                  placeholder="e.g. Curator Dispatch 🌸, Reading Salon ☕, Weekend Pick ✨"
                  className="w-full px-4 py-2 rounded-2xl border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#8C827A] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={announcementData.text}
                  onChange={(e) => setAnnouncementData({ ...announcementData, text: e.target.value })}
                  placeholder="e.g. Autumn Reading Salon: Gothic & Classic Volumes spotlighted."
                  className="w-full px-4 py-2 rounded-2xl border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white"
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#8C827A] mb-1">
                  Sweet Secondary Note (Optional)
                </label>
                <input
                  type="text"
                  value={announcementData.subtext}
                  onChange={(e) => setAnnouncementData({ ...announcementData, subtext: e.target.value })}
                  placeholder="e.g. Gather by the fireplace and discover something timeless."
                  className="w-full px-4 py-2 rounded-2xl border border-[#EADBCC] bg-[#FAF6EE] text-xs focus:outline-none focus:border-[#861D2D] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {actionLoading && <PiArrowClockwiseBold className="text-xs animate-spin" />}
                  <span>Pin Notice to Board ✨</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CURATOR'S DIARY (SCRAPBOOK AUDIT TRAIL)            */}
        {/* ========================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📓</span>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2C2723]">
                    The Curator&apos;s Reading Desk Diary
                  </h3>
                  <p className="text-xs text-[#8C827A] font-serif italic">
                    Chronological ledger of stack updates, promotions, and notes
                  </p>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['all', 'books', 'users', 'reviews', 'announcement', 'system'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAuditCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold transition-all cursor-pointer ${
                      auditCategoryFilter === cat
                        ? 'bg-[#861D2D] text-white'
                        : 'bg-[#FAF6EE] text-[#8C827A] hover:bg-[#FCEEEB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Diary Timeline Feed */}
            <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs divide-y divide-[#FAF3E8]">
              {filteredAuditLogs.map((log) => (
                <div key={log._id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#EADBCC] text-[#861D2D] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                      ✍️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#861D2D]">
                          {log.action}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-mono uppercase tracking-wider bg-[#FAF6EE] text-[#8C827A] font-bold">
                          {log.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#2C2723] font-serif mt-1">
                        {log.details}
                      </p>
                      <span className="text-[10px] font-mono text-[#A89F95] block mt-1">
                        By: <strong>{log.adminUsername}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#A89F95] flex-shrink-0">
                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>
              ))}

              {filteredAuditLogs.length === 0 && (
                <div className="text-center py-12 text-[#A89F95] font-serif italic text-xs">
                  No diary entries recorded for this tag yet 🌸
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: THE ARCHIVE VAULT & SEED RECOVERY                  */}
        {/* ========================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Vault 1: MongoDB Database */}
              <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF3EA] text-emerald-800 flex items-center justify-center text-xl">
                    🗄️
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C2723]">
                      Database Vault
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                      ● Active MongoDB Cluster
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Database:</span>
                    <strong className="text-[#2C2723]">{system?.dbName || 'books-collection'}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Host:</span>
                    <strong className="text-[#2C2723]">{system?.dbHost || '127.0.0.1'}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#8C827A]">Collections:</span>
                    <strong className="text-[#2C2723]">Books, Users, Notes, Logs</strong>
                  </div>
                </div>
              </div>

              {/* Vault 2: Engine Runtime */}
              <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] text-[#861D2D] flex items-center justify-center text-xl">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C2723]">
                      Runtime Engine
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-[#861D2D] font-bold">
                      ● Node.js {system?.nodeVersion}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Heap Used:</span>
                    <strong className="text-[#2C2723]">
                      {system?.memoryHeapUsedMB} MB / {system?.memoryHeapTotalMB} MB
                    </strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Desk Uptime:</span>
                    <strong className="text-[#2C2723]">
                      {Math.floor((system?.uptimeSeconds || 0) / 60)} minutes
                    </strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#8C827A]">Environment:</span>
                    <strong className="text-[#2C2723] uppercase">{system?.environment}</strong>
                  </div>
                </div>
              </div>

              {/* Vault 3: Postal Courier */}
              <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF8E3] text-[#8A793A] flex items-center justify-center text-xl">
                    📮
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2C2723]">
                      Postal Courier
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-[#8A793A] font-bold">
                      {system?.emailConfigured ? '● Gmail SMTP Ready' : '○ Preview Mode'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Dispatcher:</span>
                    <strong className="text-[#2C2723]">Nodemailer SMTP</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#8C827A]">Free Tier:</span>
                    <strong className="text-[#2C2723]">500 letters / day</strong>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href="http://localhost:5555/auth/email/preview"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#861D2D] hover:underline font-semibold text-[11px]"
                    >
                      Peek at Letter Template &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Reseed Card */}
            <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9] rounded-3xl border border-[#EADBCC] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2723] flex items-center gap-2">
                  <span>🌸</span>
                  <span>Emergency Archival Restore</span>
                </h3>
                <p className="text-xs text-[#8C827A] font-serif italic mt-0.5">
                  Download offline JSON snapshots or verify the 20 famous canonical library books.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={adminService.getBackupJsonUrl()}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  <span>📦</span>
                  <span>JSON Snapshot</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      type: 'reseed',
                      title: 'Verify & Reseed 20 Canonical Stories',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF4EB] border border-[#EADBCC] text-[#2C2723] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <span>🔄</span>
                  <span>Reseed Stacks</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* IN-PLACE QUICK EDIT DRAWER: THE LIBRARIAN'S JOURNAL */}
      {editDrawerBook && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="flex-1" onClick={() => setEditDrawerBook(null)} />

          <div className="w-full max-w-lg bg-[#FAF6EE] border-l border-[#EADBCC] shadow-2xl flex flex-col justify-between h-full overflow-y-auto animate-slide-left p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBCC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#FCEEEB] text-[#861D2D] flex items-center justify-center text-lg">
                    📖
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C2723]">
                      Librarian&apos;s Quick Edit
                    </h3>
                    <span className="text-[10px] font-mono text-[#8C827A] uppercase">
                      In-Place Story Journal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditDrawerBook(null)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#8C827A] hover:text-[#2C2723] cursor-pointer"
                >
                  <PiXBold className="text-base" />
                </button>
              </div>

              {/* Mini Polaroid Preview */}
              <div className="my-5 p-4 rounded-3xl bg-white border border-[#EADBCC] flex items-center gap-4 shadow-2xs relative">
                <div className="w-14 h-20 rounded-xl bg-[#FAF6EE] border border-[#EADBCC] overflow-hidden flex-shrink-0 shadow-2xs">
                  {getBookCoverUrl(editDrawerBook.image, editDrawerBook.title, editDrawerBook.isbn) ? (
                    <img
                      src={getBookCoverUrl(editDrawerBook.image, editDrawerBook.title, editDrawerBook.isbn)}
                      alt={editDrawerBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-xs font-bold text-[#861D2D]">
                      {editDrawerBook.title?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[#2C2723] truncate">
                    {editDrawerBook.title || 'Untitled Story'}
                  </h4>
                  <p className="text-xs text-[#8C827A] font-serif italic truncate">
                    by {editDrawerBook.author || 'Unknown Author'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[9px] font-mono uppercase bg-[#FCEEEB] text-[#861D2D] px-2 py-0.2 rounded-full font-bold">
                      {editDrawerBook.category}
                    </span>
                    {editDrawerBook.isFeatured && (
                      <span className="text-[9px] font-mono uppercase bg-[#FEF8E3] text-[#8A793A] px-2 py-0.2 rounded-full font-bold">
                        ✨ Staff Pick
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form id="quick-edit-form" onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                    Story Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editDrawerBook.title || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                      Author
                    </label>
                    <input
                      type="text"
                      required
                      value={editDrawerBook.author || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                      Publish Year
                    </label>
                    <input
                      type="number"
                      required
                      value={editDrawerBook.publishYear || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, publishYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                      Genre / Category
                    </label>
                    <input
                      type="text"
                      required
                      value={editDrawerBook.category || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={editDrawerBook.pageCount || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, pageCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                    ISBN Identifier
                  </label>
                  <input
                    type="text"
                    value={editDrawerBook.isbn || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, isbn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                    Cover Artwork URL / Path
                  </label>
                  <input
                    type="text"
                    value={editDrawerBook.image || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, image: e.target.value })}
                    placeholder="/uploads/covers/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#8C827A] mb-1 text-[11px]">
                    Story Synopsis
                  </label>
                  <textarea
                    rows={3}
                    value={editDrawerBook.description || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EADBCC] bg-white focus:outline-none focus:border-[#861D2D]"
                  />
                </div>

                {/* Staff Pick Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-[#EADBCC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editDrawerBook.isFeatured}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, isFeatured: e.target.checked })}
                      className="rounded text-[#861D2D] focus:ring-[#861D2D]"
                    />
                    <div>
                      <span className="font-serif font-bold text-xs text-[#2C2723] block flex items-center gap-1">
                        <span>✨</span>
                        <span>Feature as Staff Pick on Front Page</span>
                      </span>
                      <span className="text-[10px] text-[#8C827A] font-serif italic block">
                        Places volume under the spotlight banner on the homepage
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EADBCC] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditDrawerBook(null)}
                className="px-4 py-2 rounded-full border border-[#EADBCC] bg-white hover:bg-[#FAF4EB] text-xs font-semibold text-[#2C2723] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="quick-edit-form"
                disabled={actionLoading}
                className="px-6 py-2 rounded-full bg-[#861D2D] hover:bg-[#701826] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading && <PiArrowClockwiseBold className="text-xs animate-spin" />}
                <span>Save to Stacks 🌸</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EADBCC] max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#FCEEEB] rounded-b shadow-2xs" />

            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-lg flex-shrink-0">
                🍂
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2723]">
                  {deleteModal.type === 'reseed' ? 'Restore Canonical Stories?' : 'Confirm Archival Removal'}
                </h3>
                <span className="text-[10px] font-mono text-[#8C827A] uppercase">
                  {deleteModal.type === 'reseed' ? 'Library Verification' : 'Action Cannot Be Undone'}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#7D736A] font-serif leading-relaxed">
              {deleteModal.type === 'reseed'
                ? 'Are you certain you wish to verify and re-seed the 20 famous canonical library volumes?'
                : deleteModal.type === 'bulk-books'
                ? `Are you certain you wish to remove ${deleteModal.count} picked stories from the stacks?`
                : deleteModal.type === 'bulk-reviews'
                ? `Are you certain you wish to remove ${deleteModal.count} picked critiques?`
                : `Are you certain you wish to remove "${deleteModal.title}" from the PageTurner shelves?`}
            </p>

            <div className="mt-6 pt-4 border-t border-[#EADBCC] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 })
                }
                disabled={actionLoading}
                className="px-4 py-2 rounded-full border border-[#EADBCC] bg-[#FAF6EE] hover:bg-stone-100 text-xs font-semibold text-[#2C2723] transition-colors cursor-pointer"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-full text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ${
                  deleteModal.type === 'reseed' ? 'bg-[#861D2D] hover:bg-[#701826]' : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {actionLoading && <PiArrowClockwiseBold className="text-xs animate-spin" />}
                <span>
                  {deleteModal.type === 'reseed' ? 'Reseed Stacks ✨' : 'Confirm Removal'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-PLACE BOOK PREVIEW MODAL */}
      {previewBook && (
        <BookModal book={previewBook} onClose={() => setPreviewBook(null)} />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
