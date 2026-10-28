import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  PiBooksBold,
  PiPlusBold,
  PiSignOutBold,
  PiBookmarkSimpleBold,
  PiFileArrowDownBold,
  PiListBold,
  PiXBold,
  PiMagnifyingGlassBold,
  PiSpeakerSimpleHighBold,
  PiSpeakerSimpleSlashBold,
  PiCloudRainBold,
  PiFlameBold,
  PiClockBold,
  PiTagBold,
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
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE3DA] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px] lg:h-[88px]">
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                to="/"
                className="group flex items-center gap-3 transition-opacity duration-180 hover:opacity-90"
              >
                {/* Flat, clean burgundy emblem */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#861D2D] text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-[#701624]">
                  <PiBooksBold className="text-lg sm:text-xl" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-serif text-[21px] sm:text-[23px] font-semibold text-[#292522] tracking-tight leading-none">
                      PageTurner
                    </span>
                    {/* Tiny restrained amber accent dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A32A] inline-block ml-1.5 mb-1 flex-shrink-0"></span>
                  </div>
                  <span className="text-[9.5px] uppercase font-mono tracking-[0.22em] text-[#861D2D] font-medium block mt-1 leading-none">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION ROW (CENTER - Completely flat on ivory canvas) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {/* Discover */}
              <Link
                to="/"
                className={`relative px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-200 ease-out flex items-center ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F8ECE9]'
                    : 'text-[#292522] hover:text-[#861D2D] hover:bg-[#FBF2F0]'
                }`}
              >
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] bg-[#861D2D] rounded-full"></span>
                )}
              </Link>

              {/* My Shelf with integrated typography badge */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative px-3.5 py-2 rounded-md text-xs font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#FBF2F0] transition-all duration-200 ease-out flex items-center gap-1.5"
              >
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#861D2D] text-white leading-none">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="px-3.5 py-2 rounded-md text-xs font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#FBF2F0] transition-all duration-200 ease-out"
              >
                Collections
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="px-3.5 py-2 rounded-md text-xs font-medium text-[#8D847C] hover:text-[#861D2D] hover:bg-[#FBF2F0] transition-all duration-200 ease-out flex items-center gap-1.5"
              >
                <PiTagBold className="text-xs text-[#8D847C]" />
                <span>Bookplates</span>
              </button>
            </nav>

            {/* 3. ACTIONS SECTION (RIGHT) */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Compact Search Field */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch Palette (⌘K)"
                className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-[#EAE3DA] bg-white hover:border-[#D6CCC0] hover:bg-[#FAF7F2] transition-colors duration-200 group text-left cursor-pointer"
              >
                <PiMagnifyingGlassBold className="text-[#8D847C] group-hover:text-[#861D2D] text-xs transition-colors" />
                <span className="text-xs text-[#8D847C] font-normal pr-1">Search books…</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#EAE3DA] text-[10px] font-mono text-[#8D847C] font-semibold leading-none">
                  ⌘K
                </kbd>
              </button>

              {/* Sound Ambiance Minimal Toggle */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Ambient Soundscape: ${ambientSound.toUpperCase()} (Click to cycle)`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  ambientSound !== 'off'
                    ? 'border-[#861D2D]/20 bg-[#F8ECE9] text-[#861D2D]'
                    : 'border-transparent hover:border-[#EAE3DA] hover:bg-white text-[#8D847C] hover:text-[#292522]'
                }`}
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-sm text-[#861D2D]" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-sm text-[#861D2D]" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-sm text-[#861D2D]" />
                ) : (
                  <PiSpeakerSimpleSlashBold className="text-sm" />
                )}

                <span className="hidden xl:inline capitalize text-[11px]">
                  {ambientSound === 'off' ? 'Sound' : ambientSound}
                </span>

                {ambientSound !== 'off' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A32A] flex-shrink-0"></span>
                )}
              </button>

              {/* Quiet Export Action */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export catalog as CSV"
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-[#EAE3DA] hover:bg-white text-xs font-medium text-[#8D847C] hover:text-[#292522] transition-all duration-200"
              >
                <PiFileArrowDownBold className="text-sm text-[#8D847C]" />
                <span className="text-[11px]">Export</span>
              </a>

              {/* Add Book CTA (Primary Action - Moderately rounded, rich flat burgundy) */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#861D2D] hover:bg-[#701624] text-white text-xs font-medium transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0"
              >
                <PiPlusBold className="text-xs stroke-[2.5]" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout (Editorial Minimalist) */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 pl-2 lg:pl-3 border-l border-[#EAE3DA]">
                  {/* Minimalist circular avatar with amber initial */}
                  <div className="w-7 h-7 rounded-full bg-[#FAF1DF] border border-[#EED7B0] text-[#C27803] font-serif font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>

                  <div className="flex flex-col text-left leading-none">
                    <span className="text-xs font-semibold text-[#292522] truncate max-w-[105px]">
                      {user.username}
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-[#8D847C] mt-0.5">
                      {isAdmin ? 'ADMIN' : 'READER'}
                    </span>
                  </div>

                  {/* Discreet logout button */}
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 rounded-md text-[#8D847C] hover:text-[#861D2D] hover:bg-white transition-colors duration-180 ml-0.5"
                  >
                    <PiSignOutBold className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 pl-2 lg:pl-3 border-l border-[#EAE3DA]">
                  <Link
                    to="/login"
                    className="px-2.5 py-1.5 text-xs font-medium text-[#292522] hover:text-[#861D2D] hover:bg-white rounded-md transition-colors duration-180"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg bg-[#292522] hover:bg-black text-white text-xs font-medium transition-colors duration-180"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Search Button & Menu Toggle */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                className="sm:hidden p-2 rounded-lg text-[#8D847C] hover:text-[#292522] hover:bg-white transition-colors"
                aria-label="Search"
              >
                <PiMagnifyingGlassBold className="text-base" />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg text-[#292522] hover:bg-white transition-colors duration-180"
              >
                {mobileMenuOpen ? <PiXBold className="text-lg" /> : <PiListBold className="text-lg" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. MOBILE SLIDE-DOWN DRAWER (Flat, warm ivory paper) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE3DA] bg-[#FAF7F2] px-4 py-4 transition-all duration-200">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F8ECE9]'
                    : 'text-[#292522] hover:bg-[#FBF2F0]'
                }`}
              >
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#861D2D]"></span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#FBF2F0] text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PiBookmarkSimpleBold className="text-sm text-[#861D2D]" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#861D2D] text-white">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#FBF2F0] transition-colors"
              >
                Curated Collections
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#8D847C] hover:text-[#861D2D] hover:bg-[#FBF2F0] text-left flex items-center gap-2 transition-colors"
              >
                <PiTagBold className="text-sm" />
                <span>Ex Libris Bookplates</span>
              </button>

              {/* Sound Ambiance Row */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#FBF2F0] text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  {ambientSound === 'rain' ? (
                    <PiCloudRainBold className="text-[#861D2D]" />
                  ) : ambientSound === 'fireplace' ? (
                    <PiFlameBold className="text-[#861D2D]" />
                  ) : ambientSound === 'clock' ? (
                    <PiClockBold className="text-[#861D2D]" />
                  ) : (
                    <PiSpeakerSimpleSlashBold className="text-[#8D847C]" />
                  )}
                  <span>Soundscape</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="capitalize font-mono text-[11px] text-[#8D847C]">
                    {ambientSound}
                  </span>
                  {ambientSound !== 'off' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A32A]"></span>
                  )}
                </div>
              </button>

              {/* Export Catalog CSV */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#8D847C] hover:text-[#292522] hover:bg-[#FBF2F0] flex items-center gap-2 transition-colors"
              >
                <PiFileArrowDownBold className="text-sm" />
                <span>Export Catalog (CSV)</span>
              </a>

              {/* Auth / Profile in Mobile Drawer */}
              {user ? (
                <div className="pt-3 mt-2 border-t border-[#EAE3DA] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FAF1DF] border border-[#EED7B0] text-[#C27803] font-serif font-semibold text-xs flex items-center justify-center">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#292522] block leading-none">
                        {user.username}
                      </span>
                      <span className="text-[9px] uppercase font-mono text-[#8D847C] tracking-wider mt-0.5 block">
                        {isAdmin ? 'ADMIN' : 'READER'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-[#861D2D] hover:bg-[#F8ECE9] rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-[#EAE3DA] grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-medium rounded-lg border border-[#EAE3DA] bg-white text-[#292522] hover:bg-[#FAF7F2] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-medium rounded-lg bg-[#861D2D] text-white hover:bg-[#701624] transition-colors"
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
