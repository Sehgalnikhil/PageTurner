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
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EAE3DA] transition-colors duration-200">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-[88px] lg:h-[96px]">
            {/* 1. BRAND SECTION (LEFT - Prominent literary typography & flat emblem) */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="group flex items-center gap-3.5 sm:gap-4 transition-opacity duration-200 hover:opacity-95"
              >
                {/* 48-50px flat burgundy brand icon with moderate 13-14px corner radius */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] rounded-[13px] sm:rounded-[14px] bg-[#861D2D] text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-[#731826]">
                  <PiBooksBold className="text-2xl sm:text-[26px] lg:text-[28px]" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-serif text-[26px] sm:text-[29px] lg:text-[32px] font-bold text-[#292522] tracking-tight leading-none">
                      PageTurner
                    </span>
                    {/* Tiny intentional amber accent dot */}
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8A32A] inline-block ml-1.5 sm:ml-2 mb-1 flex-shrink-0"></span>
                  </div>
                  <span className="text-[10px] sm:text-[10.5px] uppercase font-mono tracking-[0.25em] text-[#861D2D] font-medium block mt-1 leading-none">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION ROW (CENTER - Spatially generous, fluid, completely flat on ivory) */}
            <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-3.5 flex-1 mx-4 lg:mx-8">
              {/* Discover */}
              <Link
                to="/"
                className={`relative px-4 py-2.5 lg:px-5 rounded-lg text-[14px] lg:text-[15px] font-medium transition-all duration-200 ease-out flex items-center justify-center ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F5E9E7]'
                    : 'text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7]/60'
                }`}
              >
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-[#861D2D] rounded-full"></span>
                )}
              </Link>

              {/* My Shelf with integrated typography count badge */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative px-4 py-2.5 lg:px-5 rounded-lg text-[14px] lg:text-[15px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7]/60 transition-all duration-200 ease-out flex items-center gap-2"
              >
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#861D2D] text-white leading-none">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="px-4 py-2.5 lg:px-5 rounded-lg text-[14px] lg:text-[15px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7]/60 transition-all duration-200 ease-out"
              >
                Collections
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="px-4 py-2.5 lg:px-5 rounded-lg text-[14px] lg:text-[15px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7]/60 transition-all duration-200 ease-out flex items-center gap-1.5"
              >
                <PiTagBold className="text-[14px] text-[#8D847C]" />
                <span>Bookplates</span>
              </button>
            </nav>

            {/* 3. ACTIONS SECTION (RIGHT - Cohesive, well-proportioned utility cluster) */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5 flex-shrink-0">
              {/* Wider Search Field (155-190px on desktop) */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch Palette (⌘K)"
                className="hidden sm:flex items-center justify-between w-[155px] lg:w-[190px] pl-3.5 pr-2.5 h-[42px] rounded-lg border border-[#EAE3DA] bg-white hover:border-[#D6CCC0] hover:bg-[#FAF7F2] focus:border-[#861D2D] transition-all duration-200 group text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#8D847C] group-hover:text-[#861D2D] text-sm flex-shrink-0 transition-colors" />
                  <span className="text-[13px] text-[#8D847C] font-normal truncate">Search books…</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#EAE3DA] text-[10px] font-mono text-[#8D847C] font-semibold leading-none flex-shrink-0">
                  ⌘K
                </kbd>
              </button>

              {/* Sound Ambiance Minimal Toggle (No button borders, soft blush hover) */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Ambient Soundscape: ${ambientSound.toUpperCase()} (Click to cycle)`}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] lg:text-[14px] font-medium transition-colors duration-200 ${
                  ambientSound !== 'off'
                    ? 'bg-[#F5E9E7] text-[#861D2D]'
                    : 'text-[#8D847C] hover:text-[#861D2D] hover:bg-[#F5E9E7]'
                }`}
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-base text-[#861D2D]" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-base text-[#861D2D]" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-base text-[#861D2D]" />
                ) : (
                  <PiSpeakerSimpleSlashBold className="text-base" />
                )}

                <span className="capitalize">{ambientSound === 'off' ? 'Sound' : ambientSound}</span>

                {ambientSound !== 'off' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8A32A] flex-shrink-0"></span>
                )}
              </button>

              {/* Quiet Export Action */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export catalog as CSV"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] lg:text-[14px] font-medium text-[#8D847C] hover:text-[#861D2D] hover:bg-[#F5E9E7] transition-colors duration-200"
              >
                <PiFileArrowDownBold className="text-base" />
                <span>Export</span>
              </a>

              {/* Add Book CTA (46-48px height, 14-15px text, moderate 12-14px corner radius) */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-2 h-[44px] lg:h-[48px] px-4 sm:px-5 lg:px-6 rounded-[12px] lg:rounded-[14px] bg-[#861D2D] hover:bg-[#701624] text-white text-[13.5px] lg:text-[15px] font-medium transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 flex-shrink-0"
              >
                <PiPlusBold className="text-sm stroke-[3]" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout (38-40px circular avatar, readable text) */}
              {user ? (
                <div className="hidden sm:flex items-center gap-3 pl-3 lg:pl-4 border-l border-[#EAE3DA]">
                  {/* 38-40px circular avatar with amber initial */}
                  <div className="w-[38px] h-[38px] lg:w-10 lg:h-10 rounded-full bg-[#FAF1DF] border border-[#EED7B0] text-[#C27803] font-serif font-semibold text-sm flex items-center justify-center flex-shrink-0">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>

                  <div className="flex flex-col text-left leading-tight min-w-0">
                    <span className="text-[13.5px] lg:text-[14px] font-semibold text-[#292522] truncate max-w-[110px]">
                      {user.username}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#8D847C] mt-0.5">
                      {isAdmin ? 'ADMIN' : 'READER'}
                    </span>
                  </div>

                  {/* Discreet logout button */}
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="w-8 h-8 rounded-lg text-[#8D847C] hover:text-[#861D2D] hover:bg-[#F5E9E7] flex items-center justify-center transition-colors duration-180 ml-1"
                  >
                    <PiSignOutBold className="text-base" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-3 lg:pl-4 border-l border-[#EAE3DA]">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-[13.5px] font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7] rounded-lg transition-colors duration-180"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-[42px] px-4 flex items-center rounded-lg bg-[#292522] hover:bg-black text-white text-[13.5px] font-medium transition-colors duration-180"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Search Button & Menu Toggle */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                className="sm:hidden p-2.5 rounded-lg text-[#8D847C] hover:text-[#292522] hover:bg-[#F5E9E7] transition-colors"
                aria-label="Search"
              >
                <PiMagnifyingGlassBold className="text-lg" />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2.5 rounded-lg text-[#292522] hover:bg-[#F5E9E7] transition-colors duration-180"
              >
                {mobileMenuOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. MOBILE SLIDE-DOWN DRAWER (Flat, warm ivory paper) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE3DA] bg-[#FAF7F2] px-6 py-5 transition-all duration-200">
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                  isDiscoverActive
                    ? 'text-[#861D2D] bg-[#F5E9E7]'
                    : 'text-[#292522] hover:bg-[#F5E9E7]/60'
                }`}
              >
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="w-2 h-2 rounded-full bg-[#861D2D]"></span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#292522] hover:bg-[#F5E9E7]/60 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PiBookmarkSimpleBold className="text-base text-[#861D2D]" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-[#861D2D] text-white">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#292522] hover:bg-[#F5E9E7]/60 transition-colors"
              >
                Curated Collections
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#292522] hover:text-[#861D2D] hover:bg-[#F5E9E7]/60 text-left flex items-center gap-2.5 transition-colors"
              >
                <PiTagBold className="text-base text-[#8D847C]" />
                <span>Ex Libris Bookplates</span>
              </button>

              {/* Sound Ambiance Row */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#292522] hover:bg-[#F5E9E7]/60 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {ambientSound === 'rain' ? (
                    <PiCloudRainBold className="text-[#861D2D] text-base" />
                  ) : ambientSound === 'fireplace' ? (
                    <PiFlameBold className="text-[#861D2D] text-base" />
                  ) : ambientSound === 'clock' ? (
                    <PiClockBold className="text-[#861D2D] text-base" />
                  ) : (
                    <PiSpeakerSimpleSlashBold className="text-[#8D847C] text-base" />
                  )}
                  <span>Soundscape</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize font-mono text-xs text-[#8D847C]">
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
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#8D847C] hover:text-[#292522] hover:bg-[#F5E9E7]/60 flex items-center gap-2.5 transition-colors"
              >
                <PiFileArrowDownBold className="text-base" />
                <span>Export Catalog (CSV)</span>
              </a>

              {/* Auth / Profile in Mobile Drawer */}
              {user ? (
                <div className="pt-4 mt-3 border-t border-[#EAE3DA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF1DF] border border-[#EED7B0] text-[#C27803] font-serif font-semibold text-sm flex items-center justify-center">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-[#292522] block leading-none">
                        {user.username}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-[#8D847C] tracking-wider mt-1 block">
                        {isAdmin ? 'ADMIN' : 'READER'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-[#861D2D] hover:bg-[#F5E9E7] rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-3 border-t border-[#EAE3DA] grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-medium rounded-lg border border-[#EAE3DA] bg-white text-[#292522] hover:bg-[#FAF7F2] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-sm font-medium rounded-lg bg-[#861D2D] text-white hover:bg-[#701624] transition-colors"
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
