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
  PiSpeakerSlashBold,
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
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#E8E2D8] transition-colors duration-150">
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[82px] sm:h-[88px] gap-2 lg:gap-4">
            
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="group flex items-center gap-3">
                {/* Burgundy brand emblem with amber corner dot */}
                <div className="relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] bg-[#7E1A27] text-white flex items-center justify-center flex-shrink-0 transition-colors duration-150 group-hover:bg-[#68141F]">
                    <PiBooksBold className="text-xl sm:text-2xl" />
                  </div>
                  {/* Distinct warm amber corner dot */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E58929] ring-2 ring-[#FAF7F2]"></span>
                </div>

                <div className="flex flex-col">
                  <span className="font-serif text-[22px] sm:text-[25px] font-bold text-[#1C1917] tracking-tight leading-none">
                    PageTurner
                  </span>
                  <span className="text-[9px] sm:text-[9.5px] uppercase font-mono tracking-[0.24em] text-[#7E1A27] font-semibold block mt-1 leading-none">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>

              {/* Vertical divider line */}
              <div className="hidden md:block h-8 w-[1px] bg-[#E2DBD0] ml-5 mr-3 flex-shrink-0"></div>
            </div>

            {/* 2. NAVIGATION ROW (Discover with flourish underline, My Shelf with badge, Collections, Bookplates) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0">
              {/* Discover */}
              <Link
                to="/"
                className={`relative px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-150 flex flex-col items-center justify-center ${
                  isDiscoverActive
                    ? 'text-[#7E1A27] bg-[#F5EBE8]'
                    : 'text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <PiCompassBold className="text-sm text-[#7E1A27]" />
                  <span>Discover</span>
                </div>
                {/* Vintage literary flourish underline: ―◆― */}
                {isDiscoverActive && (
                  <div className="flex items-center justify-center w-full mt-0.5 text-[#7E1A27] leading-none">
                    <span className="h-[1px] w-4 bg-[#7E1A27]/60"></span>
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#7E1A27] mx-0.5"></span>
                    <span className="h-[1px] w-4 bg-[#7E1A27]/60"></span>
                  </div>
                )}
              </Link>

              {/* My Shelf */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60 transition-colors flex items-center gap-1.5"
              >
                <PiBookOpenBold className="text-sm text-[#292522]" />
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="ml-0.5 w-4 h-4 rounded-full bg-[#7E1A27] text-white text-[10px] font-mono font-bold flex items-center justify-center leading-none">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60 transition-colors flex items-center gap-1.5"
              >
                <PiStackBold className="text-sm text-[#292522]" />
                <span>Collections</span>
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60 transition-colors flex items-center gap-1.5"
              >
                <PiTagBold className="text-sm text-[#292522]" />
                <span>Bookplates</span>
              </button>
            </nav>

            {/* 3. SEARCH FIELD (CENTER) */}
            <div className="hidden lg:flex items-center flex-1 max-w-[340px] xl:max-w-[380px] mx-2">
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch (⌘K)"
                className="w-full h-[38px] rounded-lg border border-[#E5DFD5] bg-white hover:border-[#D6CCC0] hover:bg-[#FCFAF7] px-3 flex items-center justify-between text-left transition-colors duration-150 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#9E948B] text-sm flex-shrink-0" />
                  <span className="text-xs text-[#9E948B] font-normal truncate">
                    Search books, authors, ideas...
                  </span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E5DFD5] text-[10px] font-mono text-[#9E948B] font-medium leading-none flex-shrink-0 ml-2">
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
                title={`Ambient Sound: ${ambientSound.toUpperCase()}`}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60 transition-colors"
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-sm text-[#7E1A27]" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-sm text-[#7E1A27]" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-sm text-[#7E1A27]" />
                ) : (
                  <PiSpeakerHighBold className="text-sm" />
                )}
                <span>Sound</span>
              </button>

              {/* Export Catalog CSV */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export catalog (CSV)"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#292522] hover:text-[#7E1A27] hover:bg-[#F5EBE8]/60 transition-colors"
              >
                <PiFileArrowDownBold className="text-sm" />
                <span>Export</span>
              </a>

              {/* + Add Book CTA */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-1.5 h-[38px] px-3.5 sm:px-4 rounded-lg bg-[#7E1A27] hover:bg-[#68141F] text-white text-xs font-medium transition-colors duration-150 flex-shrink-0 shadow-2xs"
              >
                <PiPlusBold className="text-xs stroke-[3]" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  {/* Circular Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#FCEAD2] border border-[#F3D7B5] text-[#B45309] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </div>

                  <div className="flex flex-col text-left leading-none min-w-0">
                    <span className="text-xs font-bold text-[#1C1917] truncate max-w-[100px]">
                      {user.username}
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#C98A2C] mt-1">
                      {isAdmin ? 'ADMIN' : 'READER'}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1 rounded-md text-[#1C1917] hover:text-[#7E1A27] hover:bg-[#F5EBE8] transition-colors ml-1"
                  >
                    <PiSignOutBold className="text-base" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    to="/login"
                    className="px-2.5 py-1.5 text-xs font-medium text-[#292522] hover:text-[#7E1A27] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-[36px] px-3.5 flex items-center rounded-lg bg-[#1C1917] hover:bg-black text-white text-xs font-medium transition-colors"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Search Icon & Menu Toggle */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                className="lg:hidden p-2 rounded-lg text-[#292522] hover:bg-[#F5EBE8] transition-colors"
                aria-label="Search"
              >
                <PiMagnifyingGlassBold className="text-lg" />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-lg text-[#292522] hover:bg-[#F5EBE8] transition-colors"
              >
                {mobileMenuOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E2D8] bg-[#FAF7F2] px-5 py-4 transition-all">
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                  isDiscoverActive
                    ? 'text-[#7E1A27] bg-[#F5EBE8]'
                    : 'text-[#292522] hover:bg-[#F5EBE8]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PiCompassBold className="text-sm text-[#7E1A27]" />
                  <span>Discover</span>
                </div>
                {isDiscoverActive && <span className="w-1.5 h-1.5 rounded-full bg-[#7E1A27]"></span>}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#F5EBE8]/60 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <PiBookOpenBold className="text-sm text-[#292522]" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#7E1A27] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#F5EBE8]/60 flex items-center gap-2"
              >
                <PiStackBold className="text-sm text-[#292522]" />
                <span>Collections</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#F5EBE8]/60 text-left flex items-center gap-2"
              >
                <PiTagBold className="text-sm text-[#292522]" />
                <span>Bookplates</span>
              </button>

              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#F5EBE8]/60 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <PiSpeakerHighBold className="text-sm text-[#292522]" />
                  <span>Soundscape</span>
                </div>
                <span className="capitalize font-mono text-[11px] text-[#7E1A27]">
                  {ambientSound}
                </span>
              </button>

              <a
                href="http://localhost:5555/books/export/csv"
                download
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#292522] hover:bg-[#F5EBE8]/60 flex items-center gap-2"
              >
                <PiFileArrowDownBold className="text-sm" />
                <span>Export Catalog (CSV)</span>
              </a>

              {user ? (
                <div className="pt-3 mt-2 border-t border-[#E8E2D8] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FCEAD2] border border-[#F3D7B5] text-[#B45309] font-serif font-bold text-xs flex items-center justify-center">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1C1917] block leading-none">
                        {user.username}
                      </span>
                      <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#C98A2C] mt-1 block">
                        {isAdmin ? 'ADMIN' : 'READER'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-[#7E1A27] hover:bg-[#F5EBE8] rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-[#E8E2D8] grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-medium rounded-lg border border-[#E8E2D8] bg-white text-[#1C1917]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-center text-xs font-medium rounded-lg bg-[#7E1A27] text-white"
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
