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
  PiSquaresFourBold,
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
      <div className="min-h-screen bg-[#F7F3EC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-[#FFF9ED] border-2 border-[#EADFC9] text-[#8D263B] flex items-center justify-center mb-4 shadow-sm animate-bounce">
            <span className="text-3xl">☕</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#302A27]">
            Brewing tea &amp; opening the desk...
          </h2>
          <p className="text-xs text-[#81766D] font-mono mt-1">
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
    <div className="min-h-screen bg-[#F7F3EC] text-[#302A27] selection:bg-[#8D263B] selection:text-[#FFFDFA] flex flex-col relative font-sans">
      <Navbar />

      {/* MODERN LITERARY EDITORIAL HEADER */}
      <section className="relative pt-7 pb-6 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED1] bg-[#FFFDFA]">
        <div className="max-w-7xl mx-auto">
          {/* Top greeting pill & quick badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F3EC] border border-[#E8DED1] shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-[#8D263B]" />
              <span className="font-serif font-medium text-[#302A27]">
                Curator Station &bull; {user?.username || 'Librarian'}
              </span>
              <span className="text-[#81766D]/50">&bull;</span>
              <span className="text-[11px] font-mono text-[#81766D]">
                Catalog Engine Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Snapshot Backup Download */}
              <a
                href={adminService.getBackupJsonUrl()}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] text-[#302A27] hover:text-[#8D263B] text-xs font-medium shadow-subtle transition-all cursor-pointer"
                title="Download JSON backup snapshot"
              >
                <PiDownloadSimpleBold className="text-xs" />
                <span>Backup JSON</span>
              </a>

              {/* Refresh Desk */}
              <button
                type="button"
                onClick={() => loadDashboardData(false)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] border border-[#E8DED1] text-[#302A27] hover:text-[#8D263B] text-xs font-medium shadow-subtle transition-all cursor-pointer"
              >
                <PiArrowClockwiseBold className={`text-xs ${refreshing ? 'animate-spin text-[#8D263B]' : ''}`} />
                <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Hero Row */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8D263B] text-[#FFFDFA] flex items-center justify-center flex-shrink-0 shadow-subtle">
                <PiCrownBold className="text-2xl text-[#C6A16B]" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#302A27] tracking-tight">
                    Curator Studio &amp; Archive
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/20 text-[10px] font-mono font-medium">
                    ADMIN DESK
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#81766D] font-serif italic mt-1 max-w-2xl leading-relaxed">
                  Pin stories to the front window, oversee the reader community, moderate literary reviews, and manage library archives.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/books/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium shadow-subtle hover:shadow-card active:scale-95 transition-all cursor-pointer"
              >
                <PiPlusBold className="text-xs" />
                <span>Add New Story</span>
              </Link>

              <a
                href={adminService.getExportCsvUrl()}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFFDFA] hover:bg-[#F7F3EC] text-[#302A27] border border-[#E8DED1] text-xs font-medium shadow-subtle hover:border-[#8D263B]/40 transition-colors cursor-pointer"
              >
                <PiFileArrowDownBold className="text-xs text-[#81766D]" />
                <span>Export CSV</span>
              </a>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-transparent hover:bg-black/5 text-[#81766D] hover:text-[#302A27] text-xs font-medium transition-colors"
              >
                <span>Public Shelves &rarr;</span>
              </Link>
            </div>
          </div>

          {/* EDITORIAL REFINED TABS */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-t border-[#E8DED1] pt-3">
            {[
              { id: 'overview', icon: PiSquaresFourBold, label: 'Overview', badge: null },
              { id: 'books', icon: PiBooksBold, label: 'Book Archive', badge: booksList.length },
              { id: 'readers', icon: PiUsersThreeBold, label: 'Reader Directory', badge: usersList.length },
              { id: 'reviews', icon: PiChatCircleDotsBold, label: 'Review Moderation', badge: reviewsList.length },
              { id: 'announcement', icon: PiMegaphoneBold, label: 'Public Dispatch', badge: announcementData?.active ? 'Active' : null },
              { id: 'audit', icon: PiClockCounterClockwiseBold, label: 'Activity Ledger', badge: auditLogsList.length },
              { id: 'system', icon: PiCpuBold, label: 'System Diagnostics', badge: null },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-[#302A27] text-[#FFFDFA] shadow-subtle'
                      : 'bg-[#FFFDFA] hover:bg-[#F7F3EC] text-[#81766D] hover:text-[#302A27] border border-[#E8DED1]'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                  {tab.badge !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium leading-tight ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.badge === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#F0E9DE] text-[#81766D]'
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
            
            {/* 4 Editorial Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Metric 1: Total Cataloged Works */}
              <div className="bg-[#FFFDFA] rounded-xl p-5 border border-[#E8DED1] shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-medium tracking-wider text-[#81766D]">
                    Cataloged Works
                  </span>
                  <PiBooksBold className="text-base text-[#8D263B]" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#302A27]">
                    {stats?.totalBooks || booksList.length || 0}
                  </span>
                  <p className="text-xs text-[#81766D] font-serif italic mt-0.5">
                    bound volumes in active circulation
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DED1] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#81766D]">
                    {stats?.featuredBooksCount || 0} Staff Picks
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className="font-medium text-[#8D263B] hover:text-[#67202F] cursor-pointer"
                  >
                    View Archive &rarr;
                  </button>
                </div>
              </div>

              {/* Metric 2: Registered Readers */}
              <div className="bg-[#FFFDFA] rounded-xl p-5 border border-[#E8DED1] shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-medium tracking-wider text-[#81766D]">
                    Reader Passports
                  </span>
                  <PiUsersThreeBold className="text-base text-[#C6A16B]" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#302A27]">
                    {stats?.totalUsers || usersList.length || 0}
                  </span>
                  <p className="text-xs text-[#81766D] font-serif italic mt-0.5">
                    registered member readers
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DED1] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#81766D]">Active Directory</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('readers')}
                    className="font-medium text-[#8D263B] hover:text-[#67202F] cursor-pointer"
                  >
                    Directory &rarr;
                  </button>
                </div>
              </div>

              {/* Metric 3: Reader Critiques */}
              <div className="bg-[#FFFDFA] rounded-xl p-5 border border-[#E8DED1] shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-medium tracking-wider text-[#81766D]">
                    Reflections &amp; Reviews
                  </span>
                  <PiChatCircleDotsBold className="text-base text-[#879783]" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#302A27]">
                    {stats?.totalReviews || reviewsList.length || 0}
                  </span>
                  <p className="text-xs text-[#81766D] font-serif italic mt-0.5">
                    published literary reflections
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DED1] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#81766D]">Moderated Feed</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className="font-medium text-[#8D263B] hover:text-[#67202F] cursor-pointer"
                  >
                    Moderate &rarr;
                  </button>
                </div>
              </div>

              {/* Metric 4: Library Community Rating */}
              <div className="bg-[#FFFDFA] rounded-xl p-5 border border-[#E8DED1] shadow-subtle hover:shadow-card transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-medium tracking-wider text-[#81766D]">
                    Average Rating
                  </span>
                  <PiStarFill className="text-base text-[#C6A16B]" />
                </div>
                <div className="mt-3">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#302A27]">
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : '4.8'}
                  </span>
                  <p className="text-xs text-[#81766D] font-serif italic mt-0.5">
                    out of 5.0 community acclaim
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DED1] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-0.5 text-[#C6A16B]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <PiStarFill key={i} className="text-xs" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#81766D]">5-Star Scale</span>
                </div>
              </div>
            </div>

            {/* Split Section: Aesthetic Genre Swatches & Star Sentiment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Genre Atmosphere Swatches */}
              <div className="bg-white rounded-xl p-6 border border-[#E8DED1] shadow-xs relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#302A27]">
                        Genre Atmosphere &amp; Colorways
                      </h3>
                      <p className="text-xs text-[#81766D] font-serif italic">
                        The palette of stories filling our quiet room
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#F7F3EC] border border-[#E8DED1] text-[10px] font-mono font-bold text-[#8D263B]">
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
                          <span className="font-serif font-bold text-[#302A27] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8D263B]" />
                            <span>{item.category}</span>
                          </span>
                          <span className="font-mono text-[#81766D] text-[11px]">
                            {item.count} stories ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#F7F3EC] overflow-hidden border border-[#E8DED1]/50">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx % 4 === 0
                                ? 'bg-[#8D263B]'
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
              <div className="bg-white rounded-xl p-6 border border-[#E8DED1] shadow-xs relative">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#302A27]">
                        Reader Love &amp; Star Jars
                      </h3>
                      <p className="text-xs text-[#81766D] font-serif italic">
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
                        <span className="w-12 font-mono font-bold text-[#302A27] flex items-center gap-1 flex-shrink-0">
                          <span>{star}</span>
                          <PiStarFill className="text-amber-400 text-xs" />
                        </span>

                        <div className="flex-1 h-3 rounded-full bg-[#F7F3EC] overflow-hidden border border-[#E8DED1]/60">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              star >= 4 ? 'bg-amber-400' : star === 3 ? 'bg-amber-300' : 'bg-stone-300'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <span className="w-16 text-right font-mono text-[11px] text-[#81766D] font-semibold flex-shrink-0">
                          {count} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cozy Sentiment Pill */}
                <div className="mt-5 p-3 rounded-xl bg-[#FBF6EE] border border-[#E8DED1] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-base">🌸</span>
                    <span className="font-serif font-bold text-[#302A27]">
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
              <div className="bg-white rounded-xl p-6 border border-[#E8DED1] shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📖</span>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      Fresh Volumes on the Table
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className="text-xs text-[#8D263B] hover:underline font-bold"
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
                          <div className="w-10 h-14 rounded-lg bg-[#F7F3EC] border border-[#E8DED1] overflow-hidden flex-shrink-0 shadow-2xs">
                            {cover ? (
                              <img src={cover} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-serif text-[11px] text-[#8D263B] font-bold">
                                {book.title?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#302A27] truncate group-hover:text-[#8D263B] transition-colors">
                                {book.title}
                              </h4>
                              {book.isFeatured && (
                                <span className="text-amber-500 text-xs flex-shrink-0" title="Staff Pick">
                                  ✨
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#81766D] font-serif italic truncate">
                              by {book.author}
                            </p>
                            <span className="inline-block text-[9px] font-mono text-[#8D263B] bg-[#FAF0F2] px-2 py-0.2 rounded-full mt-1 font-bold">
                              {book.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditDrawerBook(book)}
                            className="p-2 rounded-full hover:bg-[#FAF0F2] text-[#81766D] hover:text-[#8D263B] transition-colors cursor-pointer"
                            title="Quick Edit in slide drawer"
                          >
                            <PiPencilSimpleBold className="text-xs" />
                          </button>
                          <Link
                            to={`/books/details/${book._id}`}
                            className="p-2 rounded-full hover:bg-[#F7F3EC] text-[#81766D] hover:text-[#302A27] transition-colors"
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
              <div className="bg-white rounded-xl p-6 border border-[#E8DED1] shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#FAF3E8]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💌</span>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      New Book Club Bookworms
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('readers')}
                    className="text-xs text-[#8D263B] hover:underline font-bold"
                  >
                    view all &rarr;
                  </button>
                </div>

                <div className="mt-4 divide-y divide-[#FAF3E8]">
                  {recentUsers.slice(0, 4).map((member) => (
                    <div key={member._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#FAF0F2] border border-[#F3D3CC] text-[#8D263B] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-[#302A27] truncate">
                              {member.username}
                            </h4>
                            {member.role === 'admin' && (
                              <span className="px-2 py-0.2 rounded-full bg-[#FEF8E3] text-[#8A793A] text-[9px] font-mono font-bold">
                                Librarian
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#81766D] font-mono truncate">
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
            <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Cozy Search */}
              <div className="relative w-full md:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="find a cozy story, author, or ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white transition-colors placeholder-[#A89F95]"
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
                  className="px-3.5 py-2 rounded-full border border-[#E8DED1] bg-white text-xs font-semibold text-[#302A27] focus:outline-none focus:border-[#8D263B] cursor-pointer shadow-2xs"
                >
                  <option value="all">All Stories</option>
                  <option value="featured">✨ Staff Picks Only</option>
                  <option value="standard">Standard Catalog</option>
                </select>

                <select
                  value={bookCategoryFilter}
                  onChange={(e) => setBookCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-full border border-[#E8DED1] bg-white text-xs font-semibold text-[#302A27] focus:outline-none focus:border-[#8D263B] cursor-pointer shadow-2xs"
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
                  className="px-3.5 py-2 rounded-full border border-[#E8DED1] bg-white text-xs font-semibold text-[#302A27] focus:outline-none focus:border-[#8D263B] cursor-pointer shadow-2xs"
                >
                  <option value="latest">Latest Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Publish Year</option>
                </select>

                <Link
                  to="/books/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DED1] text-xs font-semibold text-[#302A27] hover:bg-[#F7F3EC] transition-colors shadow-2xs cursor-pointer"
                >
                  {selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0 ? (
                    <PiCheckSquareFill className="text-base text-[#8D263B]" />
                  ) : (
                    <PiSquareBold className="text-base text-stone-400" />
                  )}
                  <span>
                    {selectedBookIds.size === filteredBooks.length && filteredBooks.length > 0
                      ? 'Deselect All'
                      : 'Select All Books'}
                  </span>
                </button>

                <span className="font-mono text-[#81766D] text-[11px]">
                  {selectedBookIds.size} of {filteredBooks.length} picked
                </span>
              </div>

              {/* Cute Floating Washi-Tape Bulk Action Bar */}
              {selectedBookIds.size > 0 && (
                <div className="flex items-center gap-2 p-1.5 px-3.5 rounded-full bg-[#302A27] text-white shadow-md animate-fade-in flex-wrap">
                  <span className="text-[11px] font-mono text-[#FAF0F2] font-bold pr-1">
                    ✨ {selectedBookIds.size} PICKED:
                  </span>

                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="New genre..."
                      value={bulkCategoryTarget}
                      onChange={(e) => setBulkCategoryTarget(e.target.value)}
                      className="px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] border border-white/20 placeholder-stone-400 focus:outline-none focus:bg-white focus:text-[#302A27] w-24"
                    />
                    <button
                      type="button"
                      onClick={handleExecuteBulkCategory}
                      disabled={!bulkCategoryTarget.trim() || actionLoading}
                      className="px-2.5 py-1 rounded-full bg-[#FAF0F2] text-[#8D263B] font-bold text-[11px] hover:bg-white transition-colors disabled:opacity-50"
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
                    className={`group bg-white rounded-xl p-3 pb-4 border transition-all flex flex-col justify-between relative shadow-xs hover:shadow-md hover:-translate-y-1.5 hover:rotate-0 ${tilt} ${
                      isSelected
                        ? 'border-[#8D263B] ring-2 ring-[#8D263B]/30'
                        : 'border-[#E8DED1]'
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
                        <PiCheckSquareFill className="text-lg text-[#8D263B]" />
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
                      <div className="relative aspect-[3/4] rounded-xl bg-[#F7F3EC] overflow-hidden border border-[#E8DED1]/60 mt-1">
                        {cover ? (
                          <img
                            src={cover}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-4xl mb-1">📖</span>
                            <span className="font-serif font-bold text-xs text-[#302A27]">
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
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#302A27] text-[10px] font-mono font-bold shadow-xs flex items-center gap-1">
                            <PiStarFill className="text-amber-400 text-xs" />
                            <span>{book.averageRating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {/* Handwritten-Style Book Info */}
                      <div className="pt-3 px-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-[#302A27] leading-snug group-hover:text-[#8D263B] transition-colors line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#81766D] font-serif italic mt-0.5 truncate">
                          by <span className="text-[#3F3731] font-medium not-italic">{book.author}</span>
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#FAF3E8] flex items-center justify-between text-[11px] font-mono text-[#81766D]">
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
                          className="p-1.5 rounded-full bg-[#F7F3EC] hover:bg-[#FAF0F2] text-[#81766D] hover:text-[#8D263B] text-xs transition-colors cursor-pointer"
                          title="Peek inside"
                        >
                          <PiEyeBold />
                        </button>

                        <Link
                          to={`/books/details/${book._id}`}
                          className="px-2.5 py-0.5 rounded-full bg-[#F7F3EC] hover:bg-[#FAF0F2] text-[#81766D] hover:text-[#8D263B] text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </Link>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditDrawerBook(book)}
                          className="p-1.5 rounded-full bg-[#F7F3EC] hover:bg-[#FAF0F2] text-[#81766D] hover:text-[#8D263B] text-xs transition-colors cursor-pointer"
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
                          className="p-1.5 rounded-full bg-[#F7F3EC] hover:bg-red-50 text-[#81766D] hover:text-red-700 text-xs transition-colors cursor-pointer"
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
              <div className="text-center py-16 bg-white rounded-xl border border-[#E8DED1] p-8">
                <span className="text-5xl block mb-2">🍂</span>
                <h4 className="font-serif text-lg font-bold text-[#302A27]">No Stories Found in This Stack</h4>
                <p className="text-xs text-[#81766D] font-serif italic mt-1">
                  Try clearing the search or category filter to reveal more lovely reads.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBookSearch('');
                    setBookCategoryFilter('All');
                    setFeaturedFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-[#8D263B] text-white text-xs font-semibold"
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
            <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="search bookworms by moniker or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white transition-colors placeholder-[#A89F95]"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-[#E8DED1] bg-white text-xs font-semibold text-[#302A27] focus:outline-none focus:border-[#8D263B] cursor-pointer shadow-2xs"
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
                    className="relative bg-white rounded-xl p-5 border border-[#E8DED1] shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    {/* Washi tape header */}
                    <div className="absolute top-0 right-8 w-14 h-3 bg-[#E8DED1]/80 rounded-b -rotate-1 pointer-events-none" />

                    <div>
                      {/* Avatar & Header */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-lg flex-shrink-0 shadow-2xs ${
                            isMemberAdmin
                              ? 'bg-[#FEF8E3] border border-[#EFE3B8] text-[#8A793A]'
                              : 'bg-[#FAF0F2] border border-[#F3D3CC] text-[#8D263B]'
                          }`}
                        >
                          {member.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-serif text-sm font-bold text-[#302A27] truncate">
                              {member.username}
                            </h4>
                            {isSelf && (
                              <span className="text-[9px] font-mono text-[#8D263B] bg-[#FAF0F2] px-1.5 py-0.2 rounded-full font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#81766D] font-mono truncate mt-0.5">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      {/* Borrower card tag details */}
                      <div className="mt-4 p-3 rounded-xl bg-[#F7F3EC] border border-[#E8DED1]/60 text-[11px] font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#81766D]">Rank:</span>
                          <span
                            className={`font-bold uppercase ${
                              isMemberAdmin ? 'text-[#8A793A]' : 'text-[#8D263B]'
                            }`}
                          >
                            {isMemberAdmin ? '👑 Librarian' : '📖 Reader'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#81766D]">Enrolled:</span>
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
                        className="p-1.5 px-2.5 rounded-full bg-[#F7F3EC] hover:bg-[#FAF0F2] text-[#81766D] hover:text-[#8D263B] font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
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
                              : 'bg-[#F7F3EC] hover:bg-[#FAF0F2] text-[#8D263B] cursor-pointer'
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
            <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <PiMagnifyingGlassBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  placeholder="search reviews by reader, book, or thoughts..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white transition-colors placeholder-[#A89F95]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAllReviews}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DED1] text-xs font-semibold text-[#302A27] hover:bg-[#F7F3EC] transition-colors shadow-2xs cursor-pointer"
                >
                  {selectedReviewItems.length === filteredReviews.length && filteredReviews.length > 0 ? (
                    <PiCheckSquareFill className="text-base text-[#8D263B]" />
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
                    className={`relative rounded-xl p-5 border shadow-xs hover:shadow-md hover:rotate-0 transition-all flex flex-col justify-between ${stickyTone} ${tilt} ${
                      isSelected ? 'ring-2 ring-[#8D263B]' : ''
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
                          <PiCheckSquareFill className="text-lg text-[#8D263B]" />
                        ) : (
                          <PiSquareBold className="text-lg text-stone-300 hover:text-stone-600" />
                        )}
                      </button>

                      {/* Book header link */}
                      <Link
                        to={`/books/details/${rev.bookId}`}
                        className="flex items-center gap-3 pb-3 mb-3 border-b border-black/5 group"
                      >
                        <div className="w-9 h-12 rounded-lg bg-white border border-[#E8DED1] overflow-hidden flex-shrink-0 shadow-2xs">
                          {cover ? (
                            <img src={cover} alt={rev.bookTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif text-[10px] text-[#8D263B] font-bold">
                              {rev.bookTitle?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#302A27] truncate group-hover:text-[#8D263B] transition-colors">
                            {rev.bookTitle}
                          </h4>
                          <span className="text-[10px] text-[#81766D] font-serif italic block">
                            by {rev.bookAuthor}
                          </span>
                        </div>
                      </Link>

                      {/* Review author & rating */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-serif font-bold text-xs text-[#302A27] flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-white text-[#8D263B] flex items-center justify-center text-[10px] font-mono shadow-2xs">
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
                      <p className="font-serif italic text-xs text-[#3D352F] leading-relaxed bg-white/70 p-3 rounded-xl border border-black/5 line-clamp-4">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    {/* Bottom toolbar */}
                    <div className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[10px] font-mono text-[#81766D]">
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
              <div className="text-center py-16 bg-white rounded-xl border border-[#E8DED1] p-8">
                <span className="text-5xl block mb-2">💭</span>
                <h4 className="font-serif text-lg font-bold text-[#302A27]">No Marginalia Found</h4>
                <p className="text-xs text-[#81766D] font-serif italic mt-1">
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
            <div className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs relative">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#81766D] block mb-3 flex items-center gap-1">
                <span>📌</span>
                <span>Live Public Notice Preview</span>
              </span>

              {announcementData.active ? (
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all ${
                    announcementData.tone === 'burgundy'
                      ? 'bg-gradient-to-r from-[#67202F] via-[#8D263B] to-[#67202F] text-[#FFFDFA] border-[#521724]/40 shadow-xs'
                      : announcementData.tone === 'amber'
                      ? 'bg-[#FAF5ED] text-[#302A27] border-[#E8DED1] shadow-2xs'
                      : 'bg-gradient-to-r from-[#141118] via-[#1E1924] to-[#141118] text-[#EDE4D8] border-[#352D3C] shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PiSparkleBold
                      className={`text-[11px] flex-shrink-0 ${
                        announcementData.tone === 'amber' ? 'text-[#8D263B]' : 'text-[#C6A16B]'
                      }`}
                    />
                    <span className="font-serif text-xs sm:text-sm font-normal tracking-wide">
                      {announcementData.text || 'Type your message below...'}
                    </span>
                  </div>

                  {announcementData.subtext && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] select-none ${
                          announcementData.tone === 'amber' ? 'text-[#8D263B]/60' : 'text-[#C6A16B]'
                        }`}
                      >
                        ✦
                      </span>
                      <span
                        className={`text-[12px] font-serif italic truncate ${
                          announcementData.tone === 'amber' ? 'text-[#81766D]' : 'text-[#FAF5ED]/85'
                        }`}
                      >
                        {announcementData.subtext}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8DED1] text-[#81766D] text-xs text-center font-serif italic">
                  Notice is currently quiet (hidden from all readers).
                </div>
              )}
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSaveAnnouncement} className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF3E8]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#302A27]">
                    Pin a Bulletin Announcement
                  </h3>
                  <p className="text-xs text-[#81766D] font-serif italic">
                    Broadcast reading salon updates, weekend events, or book club prompts
                  </p>
                </div>

                {/* Active Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-mono font-bold text-[#302A27]">
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
                      announcementData.active ? 'bg-[#8D263B]' : 'bg-stone-300'
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
                <label className="block text-xs font-mono uppercase font-bold text-[#81766D] mb-2">
                  Paper Vibe Tone
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'burgundy', label: 'Vintage Cherry 🍒', bg: 'bg-[#8D263B] text-white' },
                    { id: 'amber', label: 'Buttercup Honey 🍯', bg: 'bg-[#FEF8E3] text-[#8A793A] border border-[#EFE3B8]' },
                    { id: 'midnight', label: 'Midnight Library 🌙', bg: 'bg-[#1C1A19] text-[#F8E7B9]' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAnnouncementData({ ...announcementData, tone: t.id })}
                      className={`p-3 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${t.bg} ${
                        announcementData.tone === t.id
                          ? 'ring-2 ring-offset-2 ring-[#8D263B]'
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
                <label className="block text-xs font-mono uppercase font-bold text-[#81766D] mb-1">
                  Sticker Badge
                </label>
                <input
                  type="text"
                  value={announcementData.badge}
                  onChange={(e) => setAnnouncementData({ ...announcementData, badge: e.target.value })}
                  placeholder="e.g. Curator Dispatch 🌸, Reading Salon ☕, Weekend Pick ✨"
                  className="w-full px-4 py-2 rounded-xl border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#81766D] mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  required
                  value={announcementData.text}
                  onChange={(e) => setAnnouncementData({ ...announcementData, text: e.target.value })}
                  placeholder="e.g. Autumn Reading Salon: Gothic & Classic Volumes spotlighted."
                  className="w-full px-4 py-2 rounded-xl border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white"
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#81766D] mb-1">
                  Sweet Secondary Note (Optional)
                </label>
                <input
                  type="text"
                  value={announcementData.subtext}
                  onChange={(e) => setAnnouncementData({ ...announcementData, subtext: e.target.value })}
                  placeholder="e.g. Gather by the fireplace and discover something timeless."
                  className="w-full px-4 py-2 rounded-xl border border-[#E8DED1] bg-[#F7F3EC] text-xs focus:outline-none focus:border-[#8D263B] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
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
            <div className="bg-white rounded-xl border border-[#E8DED1] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📓</span>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#302A27]">
                    The Curator&apos;s Reading Desk Diary
                  </h3>
                  <p className="text-xs text-[#81766D] font-serif italic">
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
                        ? 'bg-[#8D263B] text-white'
                        : 'bg-[#F7F3EC] text-[#81766D] hover:bg-[#FAF0F2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Diary Timeline Feed */}
            <div className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs divide-y divide-[#FAF3E8]">
              {filteredAuditLogs.map((log) => (
                <div key={log._id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7F3EC] border border-[#E8DED1] text-[#8D263B] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                      ✍️
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#8D263B]">
                          {log.action}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-mono uppercase tracking-wider bg-[#F7F3EC] text-[#81766D] font-bold">
                          {log.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#302A27] font-serif mt-1">
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
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3EA] text-emerald-800 flex items-center justify-center text-xl">
                    🗄️
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      Database Vault
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
                      ● Active MongoDB Cluster
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Database:</span>
                    <strong className="text-[#302A27]">{system?.dbName || 'books-collection'}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Host:</span>
                    <strong className="text-[#302A27]">{system?.dbHost || '127.0.0.1'}</strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#81766D]">Collections:</span>
                    <strong className="text-[#302A27]">Books, Users, Notes, Logs</strong>
                  </div>
                </div>
              </div>

              {/* Vault 2: Engine Runtime */}
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#8D263B] flex items-center justify-center text-xl">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      Runtime Engine
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-[#8D263B] font-bold">
                      ● Node.js {system?.nodeVersion}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Heap Used:</span>
                    <strong className="text-[#302A27]">
                      {system?.memoryHeapUsedMB} MB / {system?.memoryHeapTotalMB} MB
                    </strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Desk Uptime:</span>
                    <strong className="text-[#302A27]">
                      {Math.floor((system?.uptimeSeconds || 0) / 60)} minutes
                    </strong>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#81766D]">Environment:</span>
                    <strong className="text-[#302A27] uppercase">{system?.environment}</strong>
                  </div>
                </div>
              </div>

              {/* Vault 3: Postal Courier */}
              <div className="bg-white rounded-xl border border-[#E8DED1] p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-[#FAF3E8]">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF8E3] text-[#8A793A] flex items-center justify-center text-xl">
                    📮
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#302A27]">
                      Postal Courier
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-[#8A793A] font-bold">
                      {system?.emailConfigured ? '● Gmail SMTP Ready' : '○ Preview Mode'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Dispatcher:</span>
                    <strong className="text-[#302A27]">Nodemailer SMTP</strong>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#FAF3E8]">
                    <span className="text-[#81766D]">Free Tier:</span>
                    <strong className="text-[#302A27]">500 letters / day</strong>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href="http://localhost:5555/auth/email/preview"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8D263B] hover:underline font-semibold text-[11px]"
                    >
                      Peek at Letter Template &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Reseed Card */}
            <div className="bg-gradient-to-r from-[#FFFDFA] via-[#F7F3EC] to-[#FFFDFA] rounded-xl border border-[#E8DED1] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#302A27] flex items-center gap-2">
                  <span>🌸</span>
                  <span>Emergency Archival Restore</span>
                </h3>
                <p className="text-xs text-[#81766D] font-serif italic mt-0.5">
                  Download offline JSON snapshots or verify the 20 famous canonical library books.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={adminService.getBackupJsonUrl()}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F7F3EC] border border-[#E8DED1] text-[#302A27] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
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

          <div className="w-full max-w-lg bg-[#F7F3EC] border-l border-[#E8DED1] shadow-2xl flex flex-col justify-between h-full overflow-y-auto animate-slide-left p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DED1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF0F2] text-[#8D263B] flex items-center justify-center text-lg">
                    📖
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#302A27]">
                      Librarian&apos;s Quick Edit
                    </h3>
                    <span className="text-[10px] font-mono text-[#81766D] uppercase">
                      In-Place Story Journal
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditDrawerBook(null)}
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#81766D] hover:text-[#302A27] cursor-pointer"
                >
                  <PiXBold className="text-base" />
                </button>
              </div>

              {/* Mini Polaroid Preview */}
              <div className="my-5 p-4 rounded-xl bg-white border border-[#E8DED1] flex items-center gap-4 shadow-2xs relative">
                <div className="w-14 h-20 rounded-xl bg-[#F7F3EC] border border-[#E8DED1] overflow-hidden flex-shrink-0 shadow-2xs">
                  {getBookCoverUrl(editDrawerBook.image, editDrawerBook.title, editDrawerBook.isbn) ? (
                    <img
                      src={getBookCoverUrl(editDrawerBook.image, editDrawerBook.title, editDrawerBook.isbn)}
                      alt={editDrawerBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-xs font-bold text-[#8D263B]">
                      {editDrawerBook.title?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[#302A27] truncate">
                    {editDrawerBook.title || 'Untitled Story'}
                  </h4>
                  <p className="text-xs text-[#81766D] font-serif italic truncate">
                    by {editDrawerBook.author || 'Unknown Author'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[9px] font-mono uppercase bg-[#FAF0F2] text-[#8D263B] px-2 py-0.2 rounded-full font-bold">
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
                  <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                    Story Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editDrawerBook.title || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                      Author
                    </label>
                    <input
                      type="text"
                      required
                      value={editDrawerBook.author || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                      Publish Year
                    </label>
                    <input
                      type="number"
                      required
                      value={editDrawerBook.publishYear || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, publishYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                      Genre / Category
                    </label>
                    <input
                      type="text"
                      required
                      value={editDrawerBook.category || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={editDrawerBook.pageCount || ''}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, pageCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                    ISBN Identifier
                  </label>
                  <input
                    type="text"
                    value={editDrawerBook.isbn || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, isbn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                    Cover Artwork URL / Path
                  </label>
                  <input
                    type="text"
                    value={editDrawerBook.image || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, image: e.target.value })}
                    placeholder="/uploads/covers/... or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase font-bold text-[#81766D] mb-1 text-[11px]">
                    Story Synopsis
                  </label>
                  <textarea
                    rows={3}
                    value={editDrawerBook.description || ''}
                    onChange={(e) => setEditDrawerBook({ ...editDrawerBook, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-white focus:outline-none focus:border-[#8D263B]"
                  />
                </div>

                {/* Staff Pick Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white border border-[#E8DED1] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editDrawerBook.isFeatured}
                      onChange={(e) => setEditDrawerBook({ ...editDrawerBook, isFeatured: e.target.checked })}
                      className="rounded text-[#8D263B] focus:ring-[#8D263B]"
                    />
                    <div>
                      <span className="font-serif font-bold text-xs text-[#302A27] block flex items-center gap-1">
                        <span>✨</span>
                        <span>Feature as Staff Pick on Front Page</span>
                      </span>
                      <span className="text-[10px] text-[#81766D] font-serif italic block">
                        Places volume under the spotlight banner on the homepage
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E8DED1] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditDrawerBook(null)}
                className="px-4 py-2 rounded-full border border-[#E8DED1] bg-white hover:bg-[#F7F3EC] text-xs font-semibold text-[#302A27] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="quick-edit-form"
                disabled={actionLoading}
                className="px-6 py-2 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
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
          <div className="bg-white rounded-xl border border-[#E8DED1] max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#FAF0F2] rounded-b shadow-2xs" />

            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-lg flex-shrink-0">
                🍂
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#302A27]">
                  {deleteModal.type === 'reseed' ? 'Restore Canonical Stories?' : 'Confirm Archival Removal'}
                </h3>
                <span className="text-[10px] font-mono text-[#81766D] uppercase">
                  {deleteModal.type === 'reseed' ? 'Library Verification' : 'Action Cannot Be Undone'}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#81766D] font-serif leading-relaxed">
              {deleteModal.type === 'reseed'
                ? 'Are you certain you wish to verify and re-seed the 20 famous canonical library volumes?'
                : deleteModal.type === 'bulk-books'
                ? `Are you certain you wish to remove ${deleteModal.count} picked stories from the stacks?`
                : deleteModal.type === 'bulk-reviews'
                ? `Are you certain you wish to remove ${deleteModal.count} picked critiques?`
                : `Are you certain you wish to remove "${deleteModal.title}" from the PageTurner shelves?`}
            </p>

            <div className="mt-6 pt-4 border-t border-[#E8DED1] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({ isOpen: false, type: null, id: null, secondaryId: null, title: '', count: 0 })
                }
                disabled={actionLoading}
                className="px-4 py-2 rounded-full border border-[#E8DED1] bg-[#F7F3EC] hover:bg-stone-100 text-xs font-semibold text-[#302A27] transition-colors cursor-pointer"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-full text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ${
                  deleteModal.type === 'reseed' ? 'bg-[#8D263B] hover:bg-[#67202F]' : 'bg-red-700 hover:bg-red-800'
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
