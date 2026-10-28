import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PiBooksBold,
  PiPlusBold,
  PiSignOutBold,
  PiBookmarkSimpleBold,
  PiBookmarkSimpleFill,
  PiFileArrowDownBold,
  PiUserBold,
  PiShieldCheckBold,
  PiListBold,
  PiXBold,
  PiMagnifyingGlassBold,
  PiMoonBold,
  PiSunBold,
  PiFlameBold,
  PiSpeakerSlashBold,
  PiCloudRainBold,
  PiClockBold,
  PiTagBold,
  PiSparkleFill,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { ThemeContext } from '../context/ThemeContext';
import { startAmbientSound, stopAmbientSound } from '../utils/soundEffects';
import CommandKModal from './common/CommandKModal';
import BookplateModal from './home/BookplateModal';

const Navbar = ({ totalBooks = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'rain' | 'fireplace' | 'clock'
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, logout, isAdmin } = useContext(AuthContext);
  const { count: bookmarkCount, setIsDrawerOpen } = useContext(ReadingListContext);
  const { theme, cycleTheme } = useContext(ThemeContext);
  const location = useLocation();

  // Scroll detection for dynamic elevation and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Command-K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandK((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCycleAmbient = () => {
    if (ambientSound === 'off') {
      startAmbientSound('rain', 0.25);
      setAmbientSound('rain');
    } else if (ambientSound === 'rain') {
      startAmbientSound('fireplace', 0.35);
      setAmbientSound('fireplace');
    } else if (ambientSound === 'fireplace') {
      startAmbientSound('clock', 0.35);
      setAmbientSound('clock');
    } else {
      stopAmbientSound();
      setAmbientSound('off');
    }
  };

  // Dynamic theme-aware classes
  const isDark = theme === 'midnight' || theme === 'candlelight';

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? isDark
              ? 'bg-[#151218]/92 backdrop-blur-xl border-b border-[#2E2734]/80 shadow-[0_8px_30px_rgb(0,0,0,0.35)] py-2.5 sm:py-3'
              : 'bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E8E2D8]/80 shadow-[0_8px_25px_rgb(0,0,0,0.05)] py-2.5 sm:py-3'
            : isDark
            ? 'bg-[#151218]/70 backdrop-blur-md border-b border-[#2E2734]/40 py-3.5 sm:py-4'
            : 'bg-[#FAF7F2]/75 backdrop-blur-md border-b border-[#E8E2D8]/50 py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Desktop Nav Links */}
            <div className="flex items-center gap-7 lg:gap-9">
              {/* Brand Logo with Smooth 3D Hover & Ambient Glow */}
              <Link to="/" className="group flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#7B1826] via-[#63121E] to-[#450B14] text-white flex items-center justify-center shadow-md shadow-burgundy/20 group-hover:shadow-lg group-hover:shadow-burgundy/35 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 ease-out ring-1 ring-white/20">
                    <PiBooksBold className="text-xl sm:text-2xl group-hover:rotate-6 transition-transform duration-300" />
                  </div>
                  {/* Subtle active glow dot */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-[#FAF7F2]"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none group-hover:text-burgundy transition-colors duration-200 ${
                        theme === 'midnight'
                          ? 'text-[#FAF5ED]'
                          : theme === 'candlelight'
                          ? 'text-[#FAF2E8]'
                          : 'text-stone-900'
                      }`}
                    >
                      PageTurner
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-burgundy block mt-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-stone-200/40 dark:bg-stone-800/40 backdrop-blur-md border border-stone-300/40 dark:border-stone-700/40">
                <Link
                  to="/"
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    location.pathname === '/'
                      ? isDark
                        ? 'bg-amber-100 text-stone-950 shadow-xs scale-[1.02]'
                        : 'bg-stone-900 text-white shadow-xs scale-[1.02]'
                      : isDark
                      ? 'text-stone-300 hover:text-white hover:bg-white/10'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  Discover
                </Link>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className={`group relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isDark
                      ? 'text-stone-300 hover:text-white hover:bg-white/10'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  <PiBookmarkSimpleBold className="text-xs group-hover:scale-110 transition-transform duration-200" />
                  <span>My Shelf</span>
                  {bookmarkCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-burgundy text-white group-hover:scale-110 transition-transform duration-200 shadow-2xs">
                      {bookmarkCount}
                    </span>
                  )}
                </button>

                <a
                  href="#curated-collections"
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isDark
                      ? 'text-stone-300 hover:text-white hover:bg-white/10'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/70'
                  }`}
                >
                  Collections
                </a>

                <button
                  type="button"
                  onClick={() => setShowBookplate(true)}
                  title="Design Ex Libris Bookplate Stamp"
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                    isDark
                      ? 'text-stone-400 hover:text-amber-200 hover:bg-white/10'
                      : 'text-stone-500 hover:text-burgundy hover:bg-stone-200/70'
                  }`}
                >
                  <PiTagBold className="text-xs" />
                  <span>Bookplates</span>
                </button>
              </nav>
            </div>

            {/* Right Action Items */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Quick Command-K Omnisearch */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch Palette (⌘K / Ctrl+K)"
                className={`group inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white border border-stone-700/70 hover:border-amber-400/40'
                    : 'bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200/90 hover:border-burgundy/30'
                }`}
              >
                <PiMagnifyingGlassBold className="text-stone-400 group-hover:text-burgundy dark:group-hover:text-amber-400 text-xs transition-colors" />
                <span className="hidden md:inline font-sans font-medium text-[11px]">Search</span>
                <kbd
                  className={`hidden sm:inline px-1.5 py-0.2 rounded text-[10px] font-mono font-bold transition-colors ${
                    isDark
                      ? 'bg-stone-900 text-stone-400 border border-stone-700'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}
                >
                  ⌘K
                </kbd>
              </button>

              {/* Atmosphere Switcher (Ivory / Candlelight / Midnight) */}
              <button
                type="button"
                onClick={cycleTheme}
                title={`Reading Atmosphere: ${theme.toUpperCase()} (Click to cycle)`}
                className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border border-stone-700/70'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90'
                }`}
              >
                {theme === 'midnight' ? (
                  <PiMoonBold className="text-indigo-400 text-sm group-hover:rotate-45 transition-transform duration-300" />
                ) : theme === 'candlelight' ? (
                  <PiFlameBold className="text-amber-500 text-sm group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <PiSunBold className="text-amber-600 text-sm group-hover:rotate-45 transition-transform duration-300" />
                )}
                <span className="hidden xl:inline capitalize text-[11px] font-mono font-medium opacity-85">
                  {theme}
                </span>
              </button>

              {/* Ambient Bookstore Soundscape with Live Visualizer */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Bookstore Soundscape: ${ambientSound.toUpperCase()} (Click to cycle)`}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 ${
                  ambientSound !== 'off'
                    ? isDark
                      ? 'bg-amber-950/60 border border-amber-600/40 text-amber-200 shadow-amber-950/30'
                      : 'bg-amber-50 border border-amber-300/80 text-amber-900 shadow-amber-100'
                    : isDark
                    ? 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-400 hover:text-stone-200 border border-stone-700/70'
                    : 'bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-800 border border-stone-200/90'
                }`}
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-cyan-500 text-sm animate-pulse" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-orange-500 text-sm animate-bounce" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-amber-500 text-sm animate-spin" />
                ) : (
                  <PiSpeakerSlashBold className="text-stone-400 text-sm group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" />
                )}

                {/* Animated micro-waveform when audio is active */}
                {ambientSound !== 'off' && (
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 rounded-full bg-amber-500 animate-wave-1"></span>
                    <span className="w-0.5 rounded-full bg-amber-500 animate-wave-2"></span>
                    <span className="w-0.5 rounded-full bg-amber-500 animate-wave-3"></span>
                  </div>
                )}

                <span className="hidden xl:inline text-[11px] font-mono font-semibold capitalize">
                  {ambientSound === 'off' ? 'Sound' : ambientSound}
                </span>
              </button>

              {/* CSV Stream Export */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export entire catalog as CSV"
                className={`group hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white border border-stone-700/70'
                    : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200/90'
                }`}
              >
                <PiFileArrowDownBold className="text-stone-400 group-hover:text-burgundy dark:group-hover:text-amber-400 text-sm group-hover:translate-y-0.5 transition-transform duration-200" />
                <span className="font-medium text-[11px]">Export</span>
              </a>

              {/* Add Book CTA with Shimmer & Spring Icon */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#7B1826] via-[#8E1C2D] to-[#63121E] hover:from-[#63121E] hover:to-[#500E18] shadow-md shadow-burgundy/25 hover:shadow-lg hover:shadow-burgundy/40 hover:scale-105 active:scale-95 transition-all duration-200 ring-1 ring-white/20"
              >
                {/* Light Sweep Shimmer Effect on Hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"></span>
                <PiPlusBold className="text-sm stroke-[3] group-hover:rotate-90 transition-transform duration-300 ease-out" />
                <span>Add Book</span>
              </Link>

              {/* User Profile / Auth State */}
              {user ? (
                <div
                  className={`hidden sm:flex items-center gap-2 pl-2 sm:pl-3 border-l ${
                    isDark ? 'border-stone-700/70' : 'border-stone-300/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* User Avatar Circle */}
                    <div className="w-7 h-7 rounded-full bg-burgundy/10 dark:bg-amber-400/10 border border-burgundy/20 dark:border-amber-400/20 text-burgundy dark:text-amber-300 flex items-center justify-center font-serif font-bold text-xs">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <div className="flex flex-col text-left leading-tight">
                      <span
                        className={`text-xs font-bold truncate max-w-[90px] ${
                          isDark ? 'text-stone-100' : 'text-stone-900'
                        }`}
                      >
                        {user.username}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-wider font-semibold">
                        {isAdmin ? (
                          <span className="text-burgundy dark:text-amber-400 font-bold">Admin</span>
                        ) : (
                          <span className="text-stone-400">Reader</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign out of PageTurner"
                    className="p-1.5 rounded-full text-stone-400 hover:text-burgundy hover:bg-rose-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <PiSignOutBold className="text-sm" />
                  </button>
                </div>
              ) : (
                <div
                  className={`hidden sm:flex items-center gap-1.5 pl-2 sm:pl-3 border-l ${
                    isDark ? 'border-stone-700/70' : 'border-stone-300/80'
                  }`}
                >
                  <Link
                    to="/login"
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isDark
                        ? 'text-stone-300 hover:text-white hover:bg-stone-800'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-black dark:bg-amber-100 dark:hover:bg-amber-200 text-white dark:text-stone-950 text-xs font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button with Smooth Icon Animation */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className={`md:hidden p-2 rounded-xl transition-all duration-200 active:scale-90 ${
                  isDark
                    ? 'text-stone-300 hover:bg-stone-800'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {mobileMenuOpen ? (
                  <PiXBold className="text-xl rotate-90 transition-transform duration-200" />
                ) : (
                  <PiListBold className="text-xl transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth Slide & Blur */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t px-4 py-5 animate-in fade-in slide-in-from-top-3 duration-200 ${
              theme === 'midnight'
                ? 'bg-[#151218]/98 border-[#2E2734] text-[#FAF5ED]'
                : theme === 'candlelight'
                ? 'bg-[#261E18]/98 border-[#45362B] text-[#FAF2E8]'
                : 'bg-[#FAF7F2]/98 border-stone-200 text-stone-900 shadow-xl'
            }`}
          >
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  location.pathname === '/'
                    ? isDark
                      ? 'bg-amber-100 text-stone-950'
                      : 'bg-stone-900 text-white'
                    : isDark
                    ? 'hover:bg-white/10 text-stone-200'
                    : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <span>Discover</span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">Home</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/10 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PiBookmarkSimpleBold className="text-burgundy" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-burgundy text-white">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isDark ? 'hover:bg-white/10 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                Curated Collections
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/10 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PiTagBold className="text-burgundy" />
                  <span>Ex Libris Bookplates</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Printable</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowCommandK(true);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-white/10 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PiMagnifyingGlassBold className="text-burgundy" />
                  <span>Search Catalog</span>
                </div>
                <kbd className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-xs font-mono font-bold">
                  ⌘K
                </kbd>
              </button>

              <div className="grid grid-cols-2 gap-2 my-1">
                <button
                  type="button"
                  onClick={cycleTheme}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between border ${
                    isDark
                      ? 'border-stone-700 bg-stone-800/50 text-stone-200'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <span className="capitalize">{theme}</span>
                  {theme === 'midnight' ? (
                    <PiMoonBold className="text-indigo-400" />
                  ) : theme === 'candlelight' ? (
                    <PiFlameBold className="text-amber-500" />
                  ) : (
                    <PiSunBold className="text-amber-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCycleAmbient}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between border ${
                    isDark
                      ? 'border-stone-700 bg-stone-800/50 text-stone-200'
                      : 'border-stone-200 bg-white text-stone-800'
                  }`}
                >
                  <span className="capitalize">{ambientSound}</span>
                  {ambientSound === 'rain' ? (
                    <PiCloudRainBold className="text-cyan-500" />
                  ) : ambientSound === 'fireplace' ? (
                    <PiFlameBold className="text-orange-500" />
                  ) : ambientSound === 'clock' ? (
                    <PiClockBold className="text-amber-500" />
                  ) : (
                    <PiSpeakerSlashBold className="text-stone-400" />
                  )}
                </button>
              </div>

              <a
                href="http://localhost:5555/books/export/csv"
                download
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                  isDark ? 'hover:bg-white/10 text-stone-200' : 'hover:bg-stone-100 text-stone-800'
                }`}
              >
                <PiFileArrowDownBold className="text-stone-400" />
                <span>Export Catalog CSV</span>
              </a>

              {user ? (
                <div
                  className={`pt-3 mt-2 border-t flex items-center justify-between ${
                    isDark ? 'border-stone-700' : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center font-bold text-xs">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{user.username}</span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {isAdmin ? 'Admin' : 'Reader'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div
                  className={`pt-3 mt-2 border-t flex items-center gap-2 ${
                    isDark ? 'border-stone-700' : 'border-stone-200'
                  }`}
                >
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-burgundy text-white shadow-xs"
                  >
                    Join
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Command-K Omnisearch Palette Modal */}
      <CommandKModal
        isOpen={showCommandK}
        onClose={() => setShowCommandK(false)}
        onOpenBookplate={() => setShowBookplate(true)}
      />

      {/* Custom Vintage Ex Libris Bookplate Generator Modal */}
      <BookplateModal isOpen={showBookplate} onClose={() => setShowBookplate(false)} />
    </>
  );
};

export default Navbar;
