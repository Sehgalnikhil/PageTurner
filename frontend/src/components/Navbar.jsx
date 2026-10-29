import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PiBooksBold,
  PiPlusBold,
  PiSignOutBold,
  PiFileArrowDownBold,
  PiListBold,
  PiXBold,
  PiMagnifyingGlassBold,
  PiSpeakerHighBold,
  PiCloudRainBold,
  PiFlameBold,
  PiClockBold,
  PiTagBold,
  PiCompassBold,
  PiStackBold,
  PiBookOpenBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { startAmbientSound, stopAmbientSound } from '../utils/soundEffects';
import CommandKModal from './common/CommandKModal';
import BookplateModal from './home/BookplateModal';

const Navbar = ({ totalBooks = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'rain' | 'fireplace' | 'clock'

  const { user, logout, isAdmin } = useContext(AuthContext);
  const { count: bookmarkCount, setIsDrawerOpen } = useContext(ReadingListContext);
  const location = useLocation();

  // Global Command-K keyboard shortcut
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

  const isDiscoverActive = location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#E8DED2] transition-colors duration-150">
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[90px] sm:h-[96px] gap-3 lg:gap-6">
            
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="group flex items-center gap-3.5">
                {/* Burgundy brand emblem with warm gold corner dot */}
                <div className="relative">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#861D2D] text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-[#701826] shadow-2xs">
                    <PiBooksBold className="text-2xl sm:text-[26px]" />
                  </div>
                  {/* Amber/Gold corner seal dot */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C99A48] ring-2 ring-[#FAF7F2]" />
                </div>

                <div className="flex flex-col">
                  <span className="font-serif text-[24px] sm:text-[27px] font-bold text-[#292522] tracking-tight leading-none group-hover:text-[#861D2D] transition-colors">
                    PageTurner
                  </span>
                  <span className="text-[9.5px] uppercase font-mono tracking-[0.24em] text-[#861D2D] font-bold block mt-1 leading-none">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>

              {/* Vertical divider */}
              <div className="hidden lg:block h-8 w-[1px] bg-[#E8DED2] ml-6 mr-4 flex-shrink-0" />
            </div>

            {/* 2. NAVIGATION ROW (Discover, My Shelf, Collections, Bookplates) */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 flex-shrink-0" aria-label="Main Navigation">
              {/* Discover */}
              <Link
                to="/"
                className={`relative px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-150 flex items-center gap-2 ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F4E8E6] font-semibold'
                    : 'text-[#292522] hover:text-[#861D2D] hover:bg-[#F4E8E6]/60'
                }`}
              >
                <PiCompassBold className="text-base text-[#861D2D]" />
                <span>Discover</span>
              </Link>

              {/* My Shelf with saved count badge */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="px-3.5 py-2 rounded-xl text-[14px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F4E8E6]/60 transition-colors flex items-center gap-2"
              >
                <PiBookOpenBold className="text-base text-[#292522]" />
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="ml-0.5 px-2 py-0.5 rounded-full bg-[#861D2D] text-white text-[11px] font-mono font-bold leading-none shadow-2xs">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="px-3.5 py-2 rounded-xl text-[14px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F4E8E6]/60 transition-colors flex items-center gap-2"
              >
                <PiStackBold className="text-base text-[#292522]" />
                <span>Collections</span>
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="px-3.5 py-2 rounded-xl text-[14px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F4E8E6]/60 transition-colors flex items-center gap-2"
              >
                <PiTagBold className="text-base text-[#292522]" />
                <span>Bookplates</span>
              </button>
            </nav>

            {/* 3. INTEGRATED SEARCH UTILITY (CENTER) */}
            <div className="hidden lg:flex items-center flex-1 max-w-[320px] xl:max-w-[380px] mx-1">
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch (⌘K)"
                className="w-full h-[42px] rounded-xl border border-[#E8DED2] bg-white hover:border-[#861D2D]/40 hover:bg-[#FFFDF9] px-3.5 flex items-center justify-between text-left transition-colors duration-150 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#827870] text-sm flex-shrink-0" />
                  <span className="text-xs text-[#827870] font-normal truncate">
                    Search books, authors, ideas...
                  </span>
                </div>
                <kbd className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DED2] text-[10px] font-mono text-[#827870] font-semibold leading-none flex-shrink-0 ml-2">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* 4. RIGHT ACTIONS (Sound, Export, + Add Book, Profile, Logout) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Sound Ambiance Control */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Ambient Soundscape: ${ambientSound.toUpperCase()}`}
                className="hidden xl:flex items-center gap-1.5 h-[42px] px-3.5 rounded-xl border border-[#E8DED2] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#292522] hover:text-[#861D2D] transition-colors shadow-2xs"
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-sm text-[#861D2D]" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-sm text-[#861D2D]" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-sm text-[#861D2D]" />
                ) : (
                  <PiSpeakerHighBold className="text-sm text-[#827870]" />
                )}
                <span>Sound</span>
              </button>

              {/* Export Catalog CSV */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export library catalog (CSV)"
                className="hidden xl:flex items-center gap-1.5 h-[42px] px-3.5 rounded-xl border border-[#E8DED2] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#292522] hover:text-[#861D2D] transition-colors shadow-2xs"
              >
                <PiFileArrowDownBold className="text-sm text-[#827870]" />
                <span>Export</span>
              </a>

              {/* + Add Book Primary CTA */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-2 h-[42px] px-4 sm:px-5 rounded-xl bg-[#861D2D] hover:bg-[#701826] text-white text-xs sm:text-[13px] font-semibold transition-colors duration-150 flex-shrink-0 shadow-2xs active:scale-95"
              >
                <PiPlusBold className="text-xs stroke-[3]" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2.5 pl-2">
                  <div className="w-8 h-8 rounded-full bg-[#FCEAD2] border border-[#F3D7B5] text-[#B45309] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>

                  <div className="flex flex-col text-left leading-none min-w-0">
                    <span className="text-xs font-bold text-[#292522] truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#C99A48] mt-1">
                      {isAdmin ? 'ADMIN' : 'READER'}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 rounded-lg text-[#292522] hover:text-[#861D2D] hover:bg-[#F4E8E6] transition-colors ml-0.5"
                  >
                    <PiSignOutBold className="text-base" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-xs font-medium text-[#292522] hover:text-[#861D2D] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-[38px] px-4 flex items-center rounded-xl bg-[#292522] hover:bg-black text-white text-xs font-medium transition-colors shadow-2xs"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Search Icon & Menu Toggle */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                className="lg:hidden p-2 rounded-xl text-[#292522] hover:bg-[#F4E8E6] transition-colors"
                aria-label="Search catalog"
              >
                <PiMagnifyingGlassBold className="text-lg" />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-xl text-[#292522] hover:bg-[#F4E8E6] transition-colors"
              >
                {mobileMenuOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DED2] bg-[#FAF7F2] px-5 py-4 transition-all">
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F4E8E6] font-semibold'
                    : 'text-[#292522] hover:bg-[#F4E8E6]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PiCompassBold className="text-base text-[#861D2D]" />
                  <span>Discover</span>
                </div>
                {isDiscoverActive && <span className="w-1.5 h-1.5 rounded-full bg-[#861D2D]" />}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-4 py-3 rounded-xl text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <PiBookOpenBold className="text-base text-[#292522]" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#861D2D] text-white text-[10px] font-mono font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 flex items-center gap-2.5"
              >
                <PiStackBold className="text-base text-[#292522]" />
                <span>Collections</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className="px-4 py-3 rounded-xl text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 text-left flex items-center gap-2.5"
              >
                <PiTagBold className="text-base text-[#292522]" />
                <span>Bookplates</span>
              </button>

              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-4 py-3 rounded-xl text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <PiSpeakerHighBold className="text-base text-[#292522]" />
                  <span>Soundscape</span>
                </div>
                <span className="capitalize font-mono text-[11px] text-[#861D2D] font-bold">
                  {ambientSound}
                </span>
              </button>

              <a
                href="http://localhost:5555/books/export/csv"
                download
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 flex items-center gap-2.5"
              >
                <PiFileArrowDownBold className="text-base text-[#827870]" />
                <span>Export Catalog (CSV)</span>
              </a>

              {user ? (
                <div className="pt-3.5 mt-2 border-t border-[#E8DED2] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FCEAD2] border border-[#F3D7B5] text-[#B45309] font-serif font-bold text-xs flex items-center justify-center">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#292522] block leading-none">
                        {user.username}
                      </span>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#C99A48] mt-1 block">
                        {isAdmin ? 'ADMIN' : 'READER'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-[#861D2D] hover:bg-[#F4E8E6] rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3.5 mt-2 border-t border-[#E8DED2] grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-medium rounded-xl border border-[#E8DED2] bg-white text-[#292522]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold rounded-xl bg-[#861D2D] text-white"
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
