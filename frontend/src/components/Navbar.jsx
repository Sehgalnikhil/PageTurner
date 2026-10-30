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
  PiSparkleBold,
  PiArrowRightBold,
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
          className={`w-full py-2 px-4 text-xs flex items-center justify-between relative transition-all duration-300 z-50 ${
            announcement.tone === 'burgundy'
              ? 'bg-gradient-to-r from-[#67202F] via-[#8D263B] to-[#67202F] text-[#FFFDFA] border-b border-[#521724]/40 shadow-xs'
              : announcement.tone === 'amber'
              ? 'bg-[#FAF5ED] text-[#302A27] border-b border-[#E8DED1] shadow-2xs'
              : 'bg-gradient-to-r from-[#141118] via-[#1E1924] to-[#141118] text-[#EDE4D8] border-b border-[#352D3C] shadow-xs'
          }`}
        >
          <div className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 text-center min-w-0 px-2">
            {/* Elegant Dispatch Pill Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-sans font-medium uppercase tracking-[0.14em] flex-shrink-0 shadow-2xs ${
                announcement.tone === 'burgundy'
                  ? 'bg-white/12 border border-white/20 text-[#FFFDFA]'
                  : announcement.tone === 'amber'
                  ? 'bg-[#C6A16B]/20 border border-[#C6A16B]/35 text-[#67202F]'
                  : 'bg-white/10 border border-white/15 text-[#DCD4E8]'
              }`}
            >
              <PiSparkleBold
                className={`text-[10px] ${
                  announcement.tone === 'amber' ? 'text-[#8D263B]' : 'text-[#C6A16B]'
                }`}
              />
              <span className="leading-none">{announcement.badge || 'Curator Dispatch'}</span>
            </span>

            {/* Primary Announcement Message */}
            <span className="font-serif font-normal text-xs sm:text-[13px] tracking-wide truncate">
              {announcement.text}
            </span>

            {/* Secondary Italic Subtext & Star Separator */}
            {announcement.subtext && (
              <span className="hidden md:inline-flex items-center gap-2">
                <span
                  className={`text-[9px] select-none ${
                    announcement.tone === 'amber' ? 'text-[#8D263B]/60' : 'text-[#C6A16B]'
                  }`}
                >
                  ✦
                </span>
                <span
                  className={`font-serif italic text-[11.5px] sm:text-[12px] truncate ${
                    announcement.tone === 'amber' ? 'text-[#81766D]' : 'text-[#FAF5ED]/85'
                  }`}
                >
                  {announcement.subtext}
                </span>
              </span>
            )}

            {/* Optional Callout / Explore action */}
            {announcement.link && (
              <a
                href={announcement.link}
                className={`hidden lg:inline-flex items-center gap-1 text-[11px] font-sans font-medium underline underline-offset-4 ml-1 transition-colors ${
                  announcement.tone === 'amber'
                    ? 'text-[#8D263B] hover:text-[#67202F]'
                    : 'text-[#C6A16B] hover:text-white'
                }`}
              >
                <span>Read More</span>
                <PiArrowRightBold className="text-[9px]" />
              </a>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              announcement.tone === 'amber'
                ? 'text-[#81766D] hover:text-[#302A27] hover:bg-black/5'
                : 'text-white/60 hover:text-white hover:bg-white/15'
            }`}
            title="Dismiss notification"
          >
            <PiXBold className="text-[10px]" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-b border-[#E8DED1] transition-colors duration-150 w-full overflow-x-clip">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[66px] sm:h-[70px] gap-3">
            
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="group flex items-center gap-3">
                {/* Refined Burgundy Emblem */}
                <div className="w-9 h-9 rounded-md bg-[#8D263B] text-[#FFFDFA] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#67202F] shadow-sm">
                  <PiBookOpenBold className="text-xl" />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="font-serif text-[22px] sm:text-[24px] font-semibold text-[#302A27] tracking-tight leading-none group-hover:text-[#8D263B] transition-colors">
                    PageTurner
                  </span>
                  <span className="font-serif italic text-[11px] sm:text-[11.5px] text-[#81766D] mt-1 leading-none group-hover:text-[#67202F] transition-colors">
                    A Curated Literary Sanctuary
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. NAVIGATION ROW (Clean Editorial Typography, No Pill Overload) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0" aria-label="Main Navigation">
              {/* Discover */}
              <Link
                to="/"
                className={`text-xs font-medium transition-all duration-150 relative py-1 ${
                  isDiscoverActive
                    ? 'text-[#8D263B] font-semibold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#8D263B] after:rounded-full'
                    : 'text-[#675C54] hover:text-[#8D263B]'
                }`}
              >
                Discover
              </Link>

              {/* My Shelf with count indicator */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
              >
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#8D263B]/10 text-[#8D263B] text-[10px] font-mono font-semibold">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections */}
              <a
                href="#curated-collections"
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-colors py-1"
              >
                Collections
              </a>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-colors cursor-pointer py-1"
              >
                Bookplates
              </button>

              {/* Admin Curator Desk Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs font-medium transition-all duration-150 flex items-center gap-1 py-1 ${
                    location.pathname === '/admin'
                      ? 'text-[#8D263B] font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#8D263B] after:rounded-full'
                      : 'text-[#C6A16B] hover:text-[#8D263B]'
                  }`}
                  title="Curator Studio & Admin Desk"
                >
                  <PiCrownBold className="text-xs" />
                  <span>Curator Desk</span>
                </Link>
              )}
            </nav>

            {/* 3. INTEGRATED SEARCH UTILITY (CENTER - Flexible) */}
            <div className="hidden md:flex items-center flex-1 max-w-[240px] min-w-[140px] mx-1">
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch (⌘K)"
                className="w-full h-8 rounded-full border border-[#E8DED1] bg-[#FFFDFA] hover:border-[#C6A16B]/60 hover:bg-[#FDFBF7] px-3.5 flex items-center justify-between text-left transition-all duration-150 cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#81766D] group-hover:text-[#8D263B] text-xs flex-shrink-0 transition-colors" />
                  <span className="text-xs text-[#81766D] group-hover:text-[#302A27] font-normal truncate transition-colors">
                    Search library...
                  </span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-[#F0E9DE]/60 border border-[#E8DED1] text-[9.5px] font-mono text-[#81766D] font-medium leading-none flex-shrink-0 ml-1.5">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* 4. RIGHT ACTIONS (Sound, + Add Book, Profile, Logout, Mobile Toggles) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              
              {/* Optional Search icon on small screens where search input is hidden */}
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch (⌘K)"
                className="md:hidden p-1.5 rounded-full text-[#302A27] hover:bg-[#8D263B]/5 transition-colors cursor-pointer"
                aria-label="Search catalog"
              >
                <PiMagnifyingGlassBold className="text-lg" />
              </button>

              {/* Sound Ambiance: Clean circular icon button with subtle active state */}
              <button
                type="button"
                onClick={handleCycleAmbient}
                title={`Soundscape: ${ambientSound === 'off' ? 'Off' : ambientSound.charAt(0).toUpperCase() + ambientSound.slice(1)}`}
                className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                  ambientSound !== 'off'
                    ? 'border-[#8D263B] bg-[#8D263B]/10 text-[#8D263B]'
                    : 'border-[#E8DED1] bg-[#FFFDFA] hover:bg-[#F7F3EC] text-[#81766D] hover:text-[#302A27]'
                }`}
              >
                {ambientSound === 'rain' ? (
                  <PiCloudRainBold className="text-sm animate-pulse" />
                ) : ambientSound === 'fireplace' ? (
                  <PiFlameBold className="text-sm animate-pulse" />
                ) : ambientSound === 'clock' ? (
                  <PiClockBold className="text-sm animate-pulse" />
                ) : (
                  <PiSpeakerHighBold className="text-sm" />
                )}
              </button>

              {/* + Add Book Primary CTA */}
              <Link
                to={user ? '/books/create' : '/login'}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium transition-all duration-150 flex-shrink-0 shadow-sm active:scale-95"
              >
                <PiPlusBold className="text-xs" />
                <span>Add Book</span>
              </Link>

              {/* User Profile & Logout */}
              {user ? (
                <div className="flex items-center gap-1 pl-1.5 border-l border-[#E8DED1]">
                  <button
                    type="button"
                    onClick={() => setShowPassport(true)}
                    title="View Reader Passport"
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#8D263B]/5 transition-colors group cursor-pointer text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F0E9DE] text-[#67202F] font-serif font-semibold text-xs flex items-center justify-center flex-shrink-0 border border-[#E8DED1] group-hover:border-[#8D263B]/30 transition-colors">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                    </div>

                    <span className="hidden sm:inline text-xs font-medium text-[#302A27] truncate max-w-[80px] group-hover:text-[#8D263B] transition-colors">
                      {user.username}
                    </span>
                  </button>

                  <button
                    onClick={logout}
                    title="Sign out"
                    className="w-7 h-7 rounded-full text-[#81766D] hover:text-[#8D263B] hover:bg-[#8D263B]/5 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PiSignOutBold className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-1.5 border-l border-[#E8DED1]">
                  <Link
                    to="/login"
                    className="px-2 py-1 text-xs font-medium text-[#302A27] hover:text-[#8D263B] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-8 px-3.5 flex items-center rounded-full bg-[#302A27] hover:bg-black text-[#FFFDFA] text-xs font-medium transition-colors shadow-2xs"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-1.5 rounded-lg text-[#302A27] hover:bg-[#8D263B]/5 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <PiXBold className="text-lg" /> : <PiListBold className="text-lg" />}
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
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 flex items-center gap-2.5 transition-colors"
              >
                <PiStackBold className="text-base text-[#81766D]" />
                <span>Collections</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookplate(true);
                }}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 text-left flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <PiTagBold className="text-base text-[#81766D]" />
                <span>Bookplates</span>
              </button>

              <button
                type="button"
                onClick={handleCycleAmbient}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 text-left flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PiSpeakerHighBold className="text-base text-[#81766D]" />
                  <span>Soundscape</span>
                </div>
                <span className="capitalize font-mono text-[11px] text-[#8D263B] font-semibold">
                  {ambientSound}
                </span>
              </button>

              <a
                href="http://localhost:5555/books/export/csv"
                download
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 flex items-center gap-2.5 transition-colors"
              >
                <PiFileArrowDownBold className="text-base text-[#81766D]" />
                <span>Export Catalog (CSV)</span>
              </a>

              {user ? (
                <div className="pt-3 mt-2 border-t border-[#E8DED1]">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-3.5 py-2.5 rounded-full text-xs font-medium text-[#8D263B] hover:bg-[#8D263B]/10 flex items-center justify-between mb-2 border border-[#8D263B]/30 bg-[#FFFDFA] shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <PiCrownBold className="text-base text-[#C6A16B]" />
                        <span>Curator Desk &amp; Admin Studio</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-[#C6A16B]/20 text-[#67202F] px-2 py-0.5 rounded-full font-medium">
                        ADMIN
                      </span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowPassport(true);
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-full text-xs font-medium text-[#8D263B] hover:bg-[#8D263B]/10 flex items-center gap-2 mb-2.5 border border-[#8D263B]/20 bg-[#FFFDFA] cursor-pointer"
                  >
                    <span>✉️</span>
                    <span>Reader Passport &amp; Welcome Email</span>
                  </button>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#F0E9DE] border border-[#E8DED1] text-[#67202F] font-serif font-semibold text-xs flex items-center justify-center">
                        {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-[#302A27] block leading-none">
                          {user.username}
                        </span>
                        <span className="text-[9px] uppercase font-mono font-medium tracking-wider text-[#C6A16B] mt-0.5 block">
                          {isAdmin ? 'ADMIN' : 'READER'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-[#8D263B] hover:bg-[#8D263B]/10 rounded-full cursor-pointer transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-[#E8DED1] grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-medium rounded-full border border-[#E8DED1] bg-[#FFFDFA] text-[#302A27]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-medium rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA]"
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
