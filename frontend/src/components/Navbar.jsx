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
  PiFeatherBold,
} from 'react-icons/pi';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { adminService, bookService } from '../services/api';
import { startAmbientSound, stopAmbientSound } from '../utils/soundEffects';
import CommandKModal from './common/CommandKModal';
import BookplateModal from './home/BookplateModal';
import ReaderPassportModal from './ReaderPassportModal';
import AtmosphereDrawer from './common/AtmosphereDrawer';

const Navbar = ({ totalBooks = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCommandK, setShowCommandK] = useState(false);
  const [showBookplate, setShowBookplate] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showAtmosphereDrawer, setShowAtmosphereDrawer] = useState(false);
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
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-2.5 text-center min-w-0 px-2">
            <PiSparkleBold
              className={`text-[11px] flex-shrink-0 ${
                announcement.tone === 'amber' ? 'text-[#8D263B]' : 'text-[#C6A16B]'
              }`}
            />

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

      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DACB] transition-colors duration-150 w-full overflow-x-clip shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] sm:h-[78px] gap-2.5 sm:gap-3">
            
            {/* 1. BRAND SECTION (LEFT) */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="group flex items-center py-0.5" title="PageTurner — Return to Sanctuary">
                {/* Official Full PageTurner Logo Artwork & Typography with cute tilt & drop shadow */}
                <img
                  src="/images/pageturner-full-transparent.png"
                  alt="PageTurner"
                  className="h-[52px] sm:h-[62px] w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1 filter drop-shadow-[0_2px_10px_rgba(60,30,15,0.14)]"
                />
              </Link>
            </div>

            {/* 2. NAVIGATION ROW (Pill-shaped cute micro-interactions with literary motifs) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-0" aria-label="Main Navigation">
              {/* Discover */}
              <Link
                to="/"
                className={`text-xs font-medium transition-all duration-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cute-pill-hover ${
                  isDiscoverActive
                    ? 'text-[#8D263B] font-semibold bg-[#8D263B]/10 shadow-2xs'
                    : 'text-[#675C54] hover:text-[#8D263B] hover:bg-[#8D263B]/5'
                }`}
              >
                <PiCompassBold className={`text-xs ${isDiscoverActive ? 'text-[#8D263B]' : 'text-[#81766D]'}`} />
                <span>Discover</span>
              </Link>

              {/* My Shelf with animated heart badge */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-all px-3 py-1.5 rounded-full hover:bg-[#8D263B]/5 flex items-center gap-1.5 cursor-pointer group/shelf cute-pill-hover"
                title="Open My Personal Reading Shelf"
              >
                <PiBooksBold className="text-xs text-[#81766D] group-hover/shelf:text-[#8D263B] transition-colors" />
                <span>My Shelf</span>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#8D263B] text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-xs animate-heart-cute ml-0.5">
                    {bookmarkCount}
                  </span>
                )}
              </button>

              {/* Collections — Opens Curated Atmospheric Anthologies Drawer */}
              <button
                type="button"
                onClick={() => setShowAtmosphereDrawer(true)}
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-all px-3 py-1.5 rounded-full hover:bg-[#8D263B]/5 cursor-pointer flex items-center gap-1.5 group/col cute-pill-hover"
                title="Explore 6 Curated Atmospheric Anthologies"
              >
                <PiStackBold className="text-xs text-[#81766D] group-hover/col:text-[#8D263B] transition-colors" />
                <span>Collections</span>
                <span className="text-[9px] font-mono uppercase bg-[#C6A16B]/20 text-[#8D263B] px-1.5 py-0.2 rounded-full font-bold">
                  6
                </span>
              </button>

              {/* Bookplates */}
              <button
                type="button"
                onClick={() => setShowBookplate(true)}
                className="text-xs font-medium text-[#675C54] hover:text-[#8D263B] transition-all px-3 py-1.5 rounded-full hover:bg-[#8D263B]/5 cursor-pointer flex items-center gap-1.5 group/bp cute-pill-hover"
                title="Create Custom Vintage Ex-Libris Bookplates"
              >
                <PiTagBold className="text-xs text-[#81766D] group-hover/bp:text-[#8D263B] transition-colors" />
                <span>Bookplates</span>
              </button>

              {/* Community (The Readers' Salon) */}
              <Link
                to="/community"
                state={{ fromNavbar: true, triggerTimestamp: Date.now() }}
                className={`text-xs font-serif tracking-wide px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cute-press shadow-2xs ${
                  location.pathname === '/community'
                    ? 'bg-gradient-to-r from-[#6E1929] to-[#8D263B] text-[#FDFBF7] shadow-sm font-semibold'
                    : 'text-[#5A4B42] hover:text-[#8D263B] bg-[#FFFDF9] border border-[#E5DACB] hover:border-[#8D263B]/40'
                }`}
              >
                <PiFeatherBold className="text-xs text-[#E8C28A]" />
                <span className="font-medium">The Salon</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8C28A] animate-pulse" />
              </Link>

              {/* Admin Curator Desk Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs font-medium transition-all px-3 py-1.5 rounded-full flex items-center gap-1.5 cute-pill-hover ${
                    location.pathname === '/admin'
                      ? 'text-[#8D263B] font-semibold bg-[#8D263B]/10 shadow-2xs'
                      : 'text-[#C6A16B] hover:text-[#8D263B] hover:bg-[#8D263B]/5'
                  }`}
                  title="Curator Studio & Admin Desk"
                >
                  <PiCrownBold className="text-xs" />
                  <span>Curator Desk</span>
                </Link>
              )}
            </nav>

            {/* 3. INTEGRATED SEARCH UTILITY (CENTER - Charming Scroll Capsule) */}
            <div className="hidden md:flex items-center flex-1 max-w-[250px] min-w-[140px] mx-1">
              <button
                type="button"
                onClick={() => setShowCommandK(true)}
                title="Omnisearch Palette (⌘K)"
                className="w-full h-8.5 rounded-full border border-[#E5DACB] bg-[#FFFDF9] hover:border-[#C6A16B] hover:bg-[#FFFDFA] px-3.5 flex items-center justify-between text-left transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PiMagnifyingGlassBold className="text-[#81766D] group-hover:text-[#8D263B] text-xs flex-shrink-0 transition-colors" />
                  <span className="text-xs text-[#81766D] group-hover:text-[#302A27] font-normal truncate transition-colors">
                    Search books, authors, ideas...
                  </span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded-md bg-[#F0E9DE]/80 border border-[#E2D5C3] text-[9.5px] font-mono text-[#7A6C60] font-semibold leading-none flex-shrink-0 ml-1.5 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* 4. RIGHT ACTIONS (Sound Charm, + Add Book, Profile, Logout, Mobile Toggles) */}
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

              {/* Sound Ambiance: Tactile Cute Charm Button */}
              {user && (
                <button
                  type="button"
                  onClick={handleCycleAmbient}
                  title={`Atmospheric Soundscape: ${ambientSound === 'off' ? 'Off (Click to play)' : ambientSound.charAt(0).toUpperCase() + ambientSound.slice(1)}`}
                  className={`h-8.5 px-2.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs cute-press ${
                    ambientSound !== 'off'
                      ? 'border-[#8D263B] bg-[#8D263B]/10 text-[#8D263B] font-medium shadow-xs'
                      : 'border-[#E5DACB] bg-[#FFFDF9] hover:bg-[#F7F3EC] text-[#7A6C60] hover:text-[#302A27]'
                  }`}
                >
                  {ambientSound === 'rain' ? (
                    <>
                      <PiCloudRainBold className="text-sm text-[#8D263B] animate-pulse" />
                      <span className="text-[11px] font-serif capitalize hidden xl:inline">Rain</span>
                    </>
                  ) : ambientSound === 'fireplace' ? (
                    <>
                      <PiFlameBold className="text-sm text-[#8D263B] animate-pulse" />
                      <span className="text-[11px] font-serif capitalize hidden xl:inline">Hearth</span>
                    </>
                  ) : ambientSound === 'clock' ? (
                    <>
                      <PiClockBold className="text-sm text-[#8D263B] animate-pulse" />
                      <span className="text-[11px] font-serif capitalize hidden xl:inline">Clock</span>
                    </>
                  ) : (
                    <>
                      <PiSpeakerHighBold className="text-sm text-[#81766D]" />
                      <span className="text-[11px] font-serif hidden xl:inline text-[#81766D]">Vibes</span>
                    </>
                  )}
                </button>
              )}

              {/* + Add Book Primary CTA */}
              {user && (
                <Link
                  to="/books/create"
                  className="flex items-center gap-1.5 h-8.5 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#7D1D2D] to-[#8D263B] hover:from-[#671725] hover:to-[#7D1D2D] text-[#FFFDF9] text-xs font-medium transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md active:scale-95 group/addbtn cute-pill-hover border border-[#C6A16B]/30"
                >
                  <PiPlusBold className="text-xs text-[#E8C28A] transition-transform duration-300 group-hover/addbtn:rotate-90 group-hover/addbtn:scale-125" />
                  <span className="font-sans font-medium">Add Book</span>
                </Link>
              )}

              {/* User Profile & Passport Charm */}
              {user ? (
                <div className="flex items-center gap-1.5 pl-2 border-l border-[#E5DACB]">
                  <button
                    type="button"
                    onClick={() => setShowPassport(true)}
                    title="View Reader Passport, Level & Welcome Package"
                    className="flex items-center gap-2 py-1 px-1.5 rounded-full hover:bg-[#8D263B]/5 border border-transparent hover:border-[#E5DACB] transition-all group cursor-pointer text-left cute-pill-hover"
                  >
                    <div className="relative">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-[#C6A16B]/70 ring-offset-1 ring-offset-[#F7F3EC] shadow-2xs group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#F0E9DE] text-[#67202F] font-serif font-bold text-xs flex items-center justify-center flex-shrink-0 border border-[#C6A16B]/50 group-hover:scale-105 transition-transform">
                          {user.username ? user.username.charAt(0).toUpperCase() : 'R'}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-white" />
                    </div>

                    <div className="hidden sm:block text-left leading-tight">
                      <span className="text-xs font-serif font-bold text-[#2A1E17] block truncate max-w-[85px] group-hover:text-[#8D263B] transition-colors">
                        {user.username}
                      </span>
                      <span className="text-[9px] font-mono text-[#8D263B] uppercase tracking-wider block font-semibold">
                        {isAdmin ? 'Curator' : 'Reader'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={logout}
                    title="Sign out of sanctuary"
                    className="w-7.5 h-7.5 rounded-full text-[#81766D] hover:text-[#8D263B] hover:bg-[#8D263B]/10 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PiSignOutBold className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E5DACB]">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-medium text-[#302A27] hover:text-[#8D263B] hover:bg-[#8D263B]/5 rounded-full transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="h-8.5 px-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7D1D2D] to-[#8D263B] hover:from-[#671725] hover:to-[#7D1D2D] text-[#FFFDFA] text-xs font-medium transition-all shadow-sm active:scale-95 border border-[#C6A16B]/30"
                  >
                    <span>Join</span>
                    <PiArrowRightBold className="text-xs text-[#E8C28A]" />
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

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAtmosphereDrawer(true);
                }}
                className="w-full px-4 py-2.5 rounded-full text-xs font-medium text-[#302A27] hover:bg-[#8D263B]/5 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <PiStackBold className="text-base text-[#81766D]" />
                <span>Collections &amp; Atmospheres</span>
              </button>

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
                href={bookService.getExportCsvUrl()}
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

      {/* Curated Atmospheric Anthologies Drawer */}
      <AtmosphereDrawer
        isOpen={showAtmosphereDrawer}
        onClose={() => setShowAtmosphereDrawer(false)}
      />
    </>
  );
};

export default Navbar;
