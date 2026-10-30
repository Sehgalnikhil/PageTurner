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
  PiCrownBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { adminService } from '../services/api';
import { startAmbientSound, stopAmbientSound } from '../utils/soundEffects';
import CommandKModal from './common/CommandKModal';
import BookplateModal from './home/BookplateModal';
import ReaderPassportModal from './ReaderPassportModal';

const Navbar = ({ totalBooks = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [ambientSound, setAmbientSound] = useState('off'); // 'off' | 'rain' | 'fireplace' | 'clock'
  const [announcement, setAnnouncement] = useState(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  const { user, logout, isAdmin } = useContext(AuthContext);
  const { count: bookmarkCount, setIsDrawerOpen } = useContext(ReadingListContext);
  const location = useLocation();

  // Load public broadcast banner
  useEffect(() => {
    adminService
      .getPublicAnnouncement()
      .then((res) => {
        if (res?.data?.announcement?.active) {
          setAnnouncement(res.data.announcement);
        }
      })
      .catch(() => {});
  }, []);

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
      {/* 0. SITE-WIDE BROADCAST BANNER (CURATOR ANNOUNCEMENTS) */}
      {announcement?.active && !announcementDismissed && (
        <div
          className={`w-full py-1.5 px-4 text-xs flex items-center justify-between transition-colors z-50 ${
            announcement.tone === 'burgundy'
              ? 'bg-[#8D263B] text-[#FFFDFA]'
              : announcement.tone === 'amber'
              ? 'bg-[#FAF5ED] text-[#A68350] border-b border-[#E8DED1]'
              : 'bg-[#18151B] text-[#EDE4D8] border-b border-[#352D3C]'
          }`}
        >
          <div className="flex-1 flex items-center justify-center gap-2.5 text-center truncate px-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${
                announcement.tone === 'burgundy'
                  ? 'bg-white/15 text-[#FFFDFA]'
                  : announcement.tone === 'amber'
                  ? 'bg-[#C6A16B]/20 text-[#67202F]'
                  : 'bg-white/10 text-[#DCD4E8]'
              }`}
            >
              {announcement.badge || 'Curator Dispatch'}
            </span>
            <span className="font-serif font-medium text-xs sm:text-[13px] truncate tracking-wide">
              {announcement.text}
            </span>
            {announcement.subtext && (
              <span className="hidden md:inline text-[11px] font-serif italic opacity-85">
                &bull; {announcement.subtext}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            className="p-1 rounded hover:bg-black/10 transition-colors opacity-75 hover:opacity-100 flex-shrink-0 cursor-pointer"
            title="Dismiss notification"
          >
            <PiXBold className="text-xs" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-b border-[#E8DED1] transition-colors duration-150">
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] sm:h-[76px] gap-2 lg:gap-4">
            
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="group flex items-center gap-3">
                {/* Refined Burgundy Emblem */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-[#8D263B] text-[#FFFDFA] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#67202F] shadow-subtle">
                    <PiBooksBold className="text-xl" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C6A16B] ring-2 ring-[#F7F3EC]" />
                </div>

                <div className="flex flex-col">
                  <span className="font-serif text-[23px] sm:text-[26px] font-medium text-[#302A27] tracking-tight leading-none group-hover:text-[#8D263B] transition-colors">
                    PageTurner
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-[0.24em] text-[#81766D] font-medium block mt-1 leading-none">
                    Literary Journal &amp; Discovery
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION ROW (Discover, My Shelf, Collections, Bookplates) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 flex-shrink-0" aria-label="Main Navigation">
              {/* Discover */}
              <Link
                to="/"
                className={`relative h-8 px-3.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
                  isDiscoverActive
                    ? 'text-[#8D263B] bg-[#8D263B]/10 font-semibold'
                    : 'text-[#302A27] hover:text-[#8D263B] hover:bg-[#8D263B]/5'
                }`}
              >
                <PiCompassBold className="text-sm text-[#8D263B]" />
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="w-1 h-1 rounded-full bg-[#8D263B] ml-0.5" />
                )}
              </Link>

              {/* My Shelf with saved count badge */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="h-8 px-3.5 rounded-full text-xs sm:text-[13px] font-medium text-[#302A27] hover:text-[#8D263B] hover:bg-[#8D263B]/5 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PiBookOpenBold className="text-sm text-[#81766D]" />
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#8D263B] text-white text-[10px] font-mono font-medium flex items-center justify-center leading-none">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="h-8 px-3.5 rounded-full text-xs sm:text-[13px] font-medium text-[#302A27] hover:text-[#8D263B] hover:bg-[#8D263B]/5 transition-colors flex items-center gap-1.5"
              >
                <PiStackBold className="text-sm text-[#81766D]" />
                <span>Collections</span>
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="h-8 px-3.5 rounded-full text-xs sm:text-[13px] font-medium text-[#302A27] hover:text-[#8D263B] hover:bg-[#8D263B]/5 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PiTagBold className="text-sm text-[#81766D]" />
                <span>Bookplates</span>
              </button>

              {/* Admin Curator Desk Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`h-8 px-3.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    location.pathname === '/admin'
                      ? 'text-[#8D263B] bg-[#8D263B]/10 font-semibold border border-[#8D263B]/30'
                      : 'text-[#67202F] bg-[#FAF5ED] hover:bg-[#F0E9DE] border border-[#E8DED1]'
                  }`}
                  title="Curator Studio & Admin Desk"
                >
                  <PiCrownBold className="text-sm text-[#C6A16B]" />
                  <span>Curator Desk</span>
                </Link>
              )}
            </nav>

            {/* 3. INTEGRATED SEARCH UTILITY (CENTER) */}
            <div className="hidden lg:flex items-center flex-1 max-w-[280px] xl:max-w-[320px] mx-1">
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch (⌘K)"
                className="w-full h-8 rounded-full border border-[#E8DED1] bg-[#FFFDFA] hover:border-[#8D263B]/40 px-3.5 flex items-center justify-between text-left transition-colors duration-150 cursor-pointer shadow-subtle"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#81766D] text-xs flex-shrink-0" />
                  <span className="text-xs text-[#81766D] font-normal truncate">
                    Search books, authors, ideas...
                  </span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#F7F3EC] border border-[#E8DED1] text-[10px] font-mono text-[#81766D] font-medium leading-none flex-shrink-0 ml-2">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* 4. RIGHT ACTIONS (Sound, Export, + Add Book, Profile, Logout) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Sound Ambiance Control */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Ambient Soundscape: ${ambientSound.toUpperCase()}`}
                className="hidden xl:flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#E8DED1] bg-[#FFFDFA] hover:bg-[#F7F3EC] text-xs font-medium text-[#302A27] hover:text-[#8D263B] transition-colors shadow-subtle cursor-pointer"
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-sm text-[#8D263B]" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-sm text-[#8D263B]" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-sm text-[#8D263B]" />
                ) : (
                  <PiSpeakerHighBold className="text-sm text-[#81766D]" />
                )}
                <span>Sound</span>
              </button>

              {/* Export Catalog CSV */}
              <a
                href="http://localhost:5555/books/export/csv"
                download
                title="Export library catalog (CSV)"
                className="hidden xl:flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#E8DED1] bg-[#FFFDFA] hover:bg-[#F7F3EC] text-xs font-medium text-[#302A27] hover:text-[#8D263B] transition-colors shadow-subtle"
              >
                <PiFileArrowDownBold className="text-sm text-[#81766D]" />
                <span>Export</span>
              </a>

              {/* + Add Book Primary CTA */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium transition-colors duration-150 flex-shrink-0 shadow-subtle"
              >
                <PiPlusBold className="text-xs" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout */}
              {user ? (
                <div className="hidden sm:flex items-center gap-1.5 pl-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPassport(true)}
                    title="View Reader Passport"
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#8D263B]/5 border border-transparent hover:border-[#E8DED1] transition-all group cursor-pointer text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F0E9DE] border border-[#E8DED1] text-[#67202F] font-serif font-semibold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>

                    <div className="flex flex-col text-left leading-none min-w-0">
                      <span className="text-xs font-medium text-[#302A27] truncate max-w-[100px] group-hover:text-[#8D263B] transition-colors">
                        {user.username}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#8D263B] mt-0.5">
                        Passport
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={logout}
                    title="Sign out"
                    className="p-1.5 rounded-full text-[#81766D] hover:text-[#8D263B] hover:bg-[#8D263B]/5 transition-colors ml-0.5 cursor-pointer"
                  >
                    <PiSignOutBold className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-1.5">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-medium text-[#302A27] hover:text-[#8D263B] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-8 px-3.5 flex items-center rounded-full bg-[#302A27] hover:bg-black text-[#FFFDFA] text-xs font-medium transition-colors shadow-subtle"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Search Icon & Menu Toggle */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                className="lg:hidden p-2 rounded-full text-[#302A27] hover:bg-[#8D263B]/5 transition-colors"
                aria-label="Search catalog"
              >
                <PiMagnifyingGlassBold className="text-lg" />
              </button>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="md:hidden p-2 rounded-full text-[#302A27] hover:bg-[#8D263B]/5 transition-colors"
              >
                {mobileMenuOpen ? <PiXBold className="text-xl" /> : <PiListBold className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DED1] bg-[#F7F3EC] px-5 py-4 transition-all">
            <nav className="flex flex-col gap-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-full text-xs font-medium flex items-center justify-between ${
                  isDiscoverActive
                    ? 'text-[#8D263B] bg-[#8D263B]/10 font-semibold'
                    : 'text-[#302A27] hover:bg-[#8D263B]/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PiCompassBold className="text-base text-[#8D263B]" />
                  <span>Discover</span>
                </div>
                {isDiscoverActive && <span className="w-1.5 h-1.5 rounded-full bg-[#8D263B]" />}
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <PiBookOpenBold className="text-base text-[#81766D]" />
                  <span>My Shelf</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#8D263B] text-white text-[10px] font-mono font-medium">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              <a
                href="#curated-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 flex items-center gap-2.5"
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
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 text-left flex items-center gap-2.5 cursor-pointer"
              >
                <PiTagBold className="text-base text-[#292522]" />
                <span>Bookplates</span>
              </button>

              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 text-left flex items-center justify-between"
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
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#292522] hover:bg-[#F4E8E6]/60 flex items-center gap-2.5"
              >
                <PiFileArrowDownBold className="text-base text-[#827870]" />
                <span>Export Catalog (CSV)</span>
              </a>

              {user ? (
                <div className="pt-3 mt-2 border-t border-[#E8DED2]">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-3.5 py-2.5 rounded-full text-xs font-bold text-[#B45309] hover:bg-[#FCEAD2] flex items-center justify-between mb-2 border border-[#F3D7B5] bg-[#FFF9F2] shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <PiCrownBold className="text-base text-[#C99A48]" />
                        <span>Curator Desk &amp; Admin Studio</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-[#C99A48]/20 px-2 py-0.5 rounded-full font-bold">
                        ADMIN
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowPassport(true);
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-full text-xs font-semibold text-[#861D2D] hover:bg-[#F4E8E6]/60 flex items-center gap-2 mb-2.5 border border-[#861D2D]/20 bg-[#FBF5F2]"
                  >
                    <span>✉️</span>
                    <span>Reader Passport &amp; Welcome Email</span>
                  </button>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FCEAD2] border border-[#F3D7B5] text-[#B45309] font-serif font-bold text-xs flex items-center justify-center">
                        {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#292522] block leading-none">
                          {user.username}
                        </span>
                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[#C99A48] mt-0.5 block">
                          {isAdmin ? 'ADMIN' : 'READER'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-[#861D2D] hover:bg-[#F4E8E6] rounded-full"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-[#E8DED2] grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-medium rounded-full border border-[#E8DED2] bg-white text-[#292522]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold rounded-full bg-[#861D2D] text-white"
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

      {/* Official Reader Passport & Welcome Package Modal */}
      <ReaderPassportModal isOpen={showPassport} onClose={() => setShowPassport(false)} user={user} />
    </>
  );
};

export default Navbar;
