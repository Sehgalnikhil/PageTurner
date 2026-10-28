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
  PiCompassBold,
  PiSparkleBold,
  PiMagnifyingGlassBold,
  PiMoonBold,
  PiSunBold,
  PiFlameBold,
  PiSpeakerSlashBold,
  PiCloudRainBold,
  PiClockBold,
  PiTagBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { ThemeContext } from '../context/ThemeContext';
import { startAmbientSound, stopAmbientSound } from '../utils/soundEffects';
import CommandKModal from './common/CommandKModal';
import BookplateModal from './home/BookplateModal';

const Navbar = ({ totalBooks = 0, onOpenBlindDate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'rain' | 'fireplace' | 'clock'

  const { user, logout, isAdmin } = useContext(AuthContext);
  const { count: bookmarkCount, setIsDrawerOpen } = useContext(ReadingListContext);
  const { theme, cycleTheme } = useContext(ThemeContext);
  const location = useLocation();

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
      startAmbientSound('fireplace', 0.25);
      setAmbientSound('fireplace');
    } else if (ambientSound === 'fireplace') {
      startAmbientSound('clock', 0.2);
      setAmbientSound('clock');
    } else {
      stopAmbientSound();
      setAmbientSound('off');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${
          theme === 'midnight'
            ? 'bg-[#151218]/95 border-[#2E2734] text-[#FAF5ED]'
            : theme === 'candlelight'
            ? 'bg-[#261E18]/95 border-[#45362B] text-[#FAF2E8]'
            : 'bg-[#FAF7F2]/95 border-[#E8E2D8] text-[#1C1917]'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Navigation */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-burgundy text-white flex items-center justify-center shadow-xs group-hover:bg-[#63121E] group-hover:scale-105 transition-all duration-200">
                <PiBooksBold className="text-xl group-hover:rotate-6 transition-transform duration-200" />
              </div>
              <div>
                <span
                  className={`font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none block group-hover:text-burgundy transition-colors duration-200 ${
                    theme === 'midnight'
                      ? 'text-[#FAF5ED]'
                      : theme === 'candlelight'
                      ? 'text-[#FAF2E8]'
                      : 'text-stone-900'
                  }`}
                >
                  PageTurner
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-burgundy font-semibold block mt-1">
                  Literary Journal &amp; Discovery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  location.pathname === '/'
                    ? theme === 'midnight' || theme === 'candlelight'
                      ? 'bg-amber-100/90 text-stone-950 shadow-xs'
                      : 'bg-stone-900 text-white shadow-xs'
                    : theme === 'midnight' || theme === 'candlelight'
                    ? 'text-stone-300 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                Discover
              </Link>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className={`group px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  theme === 'midnight' || theme === 'candlelight'
                    ? 'text-stone-300 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-burgundy text-white group-hover:scale-110 transition-transform duration-200">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  theme === 'midnight' || theme === 'candlelight'
                    ? 'text-stone-300 hover:text-white hover:bg-white/10'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                Collections
              </a>

              {onOpenBlindDate && (
                <button
                  type="button"
                  onClick={onOpenBlindDate}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-burgundy hover:text-white hover:bg-burgundy bg-rose-50/70 border border-burgundy/15 transition-all duration-200 flex items-center gap-1.5 shadow-2xs hover:scale-105 active:scale-95"
                >
                  <PiSparkleBold className="text-amber-500 text-xs animate-pulse" />
                  <span>Blind Date</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Command-K Omnisearch */}
            <button
              type="button"
              onClick={() => setShowCommandK(true)}
              title="Omnisearch Palette (⌘K / Ctrl+K)"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full btn-paper text-xs text-stone-600 hover:text-stone-900 shadow-2xs hover:border-burgundy/30 transition-all hover:scale-105 active:scale-95"
            >
              <PiMagnifyingGlassBold className="text-stone-500 text-xs" />
              <span className="hidden md:inline font-sans font-medium text-[11px]">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-stone-100 border border-stone-200 text-[10px] font-mono text-stone-500 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Reading Atmosphere (Ivory / Candlelight / Midnight) */}
            <button
              type="button"
              onClick={cycleTheme}
              title={`Reading Atmosphere: ${theme.toUpperCase()} (Click to cycle)`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full btn-paper text-xs shadow-2xs hover:scale-105 active:scale-95 transition-all"
            >
              {theme === 'midnight' ? (
                <PiMoonBold className="text-indigo-400 text-sm" />
              ) : theme === 'candlelight' ? (
                <PiFlameBold className="text-amber-500 text-sm" />
              ) : (
                <PiSunBold className="text-amber-600 text-sm" />
              )}
              <span className="hidden xl:inline capitalize text-[11px] font-mono font-semibold text-stone-700">
                {theme}
              </span>
            </button>

            {/* Ambient Bookstore Soundscape */}
            <button
              type="button"
              onClick={handleCycleAmbient}
              title={`Bookstore Soundscape: ${ambientSound.toUpperCase()} (Click to cycle)`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs shadow-2xs transition-all active:scale-95 ${
                ambientSound !== 'off'
                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300 shadow-xs'
                  : 'btn-paper text-stone-600'
              }`}
            >
              {ambientSound === 'rain' ? (
                <PiCloudRainBold className="text-cyan-600 text-sm animate-pulse" />
              ) : ambientSound === 'fireplace' ? (
                <PiFlameBold className="text-orange-500 text-sm animate-bounce" />
              ) : ambientSound === 'clock' ? (
                <PiClockBold className="text-stone-700 text-sm animate-spin" />
              ) : (
                <PiSpeakerSlashBold className="text-stone-400 text-sm" />
              )}
              <span className="hidden xl:inline text-[11px] font-mono font-semibold">
                {ambientSound === 'off' ? 'Sound' : ambientSound}
              </span>
            </button>

            {/* Shelf Drawer Trigger Pill */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              title="Open My Shelf"
              className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-paper text-xs shadow-xs"
            >
              <PiBookmarkSimpleBold className="text-burgundy text-sm group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline">Shelf</span>
              {bookmarkCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-burgundy text-white text-[10px] font-mono font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* CSV Stream Export */}
            <a
              href="http://localhost:5555/books/export/csv"
              download
              title="Export library records (CSV)"
              className="group hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-paper text-xs text-stone-700 shadow-xs"
            >
              <PiFileArrowDownBold className="text-stone-500 text-sm group-hover:translate-y-0.5 transition-transform duration-200" />
              <span>Export CSV</span>
            </a>

            {/* Add Book CTA */}
            <Link
              to={user ? "/books/create" : "/login"}
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-burgundy text-xs shadow-xs"
            >
              <PiPlusBold className="text-sm stroke-[3] group-hover:rotate-90 transition-transform duration-250 ease-out" />
              <span>Add Book</span>
            </Link>

            {/* User Auth Section */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-stone-300">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-stone-900 leading-tight">
                    {user.username}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                    {isAdmin ? (
                      <span className="text-burgundy font-bold">Admin</span>
                    ) : (
                      <span className="text-stone-500">Reader</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-full text-stone-400 hover:text-burgundy hover:bg-stone-100 transition-colors"
                >
                  <PiSignOutBold className="text-base" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-stone-300">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className={`md:hidden p-2 rounded-xl transition-colors ${
                theme === 'midnight' || theme === 'candlelight'
                  ? 'text-stone-300 hover:bg-white/10'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {mobileMenuOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-5 animate-in fade-in duration-200 ${
            theme === 'midnight'
              ? 'bg-[#151218] border-[#2E2734] text-[#FAF5ED]'
              : theme === 'candlelight'
              ? 'bg-[#261E18] border-[#45362B] text-[#FAF2E8]'
              : 'bg-[#FAF7F2] border-stone-200 text-stone-900'
          }`}
        >
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-900 bg-white border border-stone-200"
            >
              Discover
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsDrawerOpen(true);
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white text-left flex items-center justify-between"
            >
              <span>My Shelf</span>
              {bookmarkCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-burgundy text-white">
                  {bookmarkCount}
                </span>
              )}
            </button>
            <a
              href="#curated-collections"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white"
            >
              Curated Collections
            </a>
            {onOpenBlindDate && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBlindDate();
                }}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-burgundy bg-rose-50/70 hover:bg-rose-100/70 text-left flex items-center gap-2"
              >
                <PiSparkleBold className="text-amber-500 text-xs animate-pulse" />
                <span>Blind Date with a Book</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowCommandK(true);
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <PiMagnifyingGlassBold className="text-burgundy" />
                <span>Search Omnisearch</span>
              </div>
              <kbd className="px-2 py-0.5 rounded bg-stone-100 text-xs font-mono text-stone-500 font-bold">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={cycleTheme}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {theme === 'midnight' ? (
                  <PiMoonBold className="text-indigo-400" />
                ) : theme === 'candlelight' ? (
                  <PiFlameBold className="text-amber-500" />
                ) : (
                  <PiSunBold className="text-amber-600" />
                )}
                <span>Atmosphere</span>
              </div>
              <span className="capitalize font-mono text-xs text-stone-500">{theme}</span>
            </button>

            <button
              type="button"
              onClick={handleCycleAmbient}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-cyan-600" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-orange-500" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-stone-700" />
                ) : (
                  <PiSpeakerSlashBold className="text-stone-400" />
                )}
                <span>Soundscape</span>
              </div>
              <span className="capitalize font-mono text-xs text-stone-500">{ambientSound}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowBookplate(true);
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-burgundy hover:bg-white text-left flex items-center gap-2"
            >
              <PiTagBold className="text-burgundy" />
              <span>Print Ex Libris Bookplate</span>
            </button>

            <a
              href="http://localhost:5555/books/export/csv"
              download
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-white"
            >
              Export CSV
            </a>

            {user ? (
              <div className="pt-3 mt-2 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">{user.username}</span>
                  <span className="text-[10px] text-stone-500 uppercase font-mono">{user.role}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-stone-200 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-burgundy text-white"
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
    <BookplateModal
      isOpen={showBookplate}
      onClose={() => setShowBookplate(false)}
    />
  </>
  );
};

export default Navbar;
