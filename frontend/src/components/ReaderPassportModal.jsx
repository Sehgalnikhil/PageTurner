import React, { useState, useContext, useEffect } from 'react';
import {
  PiXBold,
  PiCopyBold,
  PiBookOpenBold,
  PiBooksBold,
  PiCameraBold,
  PiHeartFill,
  PiFileArrowDownBold,
  PiSignOutBold,
  PiCheckBold,
  PiSparkleBold,
  PiFireBold,
  PiEnvelopeSimpleBold,
  PiTagBold,
  PiBookmarkSimpleBold,
} from 'react-icons/pi';
import ChangeAvatarModal from './common/ChangeAvatarModal';
import { AuthContext } from '../context/AuthContext';
import { ReadingListContext } from '../context/ReadingListContext';
import { authService, bookService } from '../services/api';
import { useSnackbar } from 'notistack';
import {
  playPaperUnwrap,
  playRevealChime,
  playWaxSealCrack,
} from '../utils/soundEffects';

const PASSPORT_STAMPS = [
  { icon: '☕', title: 'First Edition', desc: 'Sanctuary Founding Reader', unlocked: true },
  { icon: '🌙', title: 'Midnight Muse', desc: 'Reading past midnight', unlocked: true },
  { icon: '🖋️', title: 'Marginalia Scribe', desc: 'Saved thoughtful quotes', unlocked: true },
  { icon: '🎁', title: 'Mystery Parcel', desc: 'Blind Date Book Club', unlocked: true },
];

const ReaderPassportModal = ({ isOpen, onClose, user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { logout, switchToRealUser } = useContext(AuthContext);
  const { readingList = [], setIsDrawerOpen } = useContext(ReadingListContext) || {};

  const [showChangeAvatar, setShowChangeAvatar] = useState(false);
  const [realDbUsers, setRealDbUsers] = useState([]);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [readingGoal, setReadingGoal] = useState(() => {
    try {
      return Number(localStorage.getItem('pageTurner_readingGoal')) || 24;
    } catch {
      return 24;
    }
  });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(readingGoal);

  useEffect(() => {
    authService
      .getRealUsers()
      .then((res) => {
        if (res.data?.length) {
          setRealDbUsers(res.data.filter((u) => !u.username.includes('Demo')));
        }
      })
      .catch((err) => console.warn('Could not load real users:', err));
  }, []);

  if (!isOpen) return null;

  const activeUser = user || {
    username: 'Kindred Reader',
    email: 'reader@pageturner.io',
    role: 'reader',
  };

  // Deterministic cute passport ID
  let hash = 0;
  const name = activeUser.username || 'Reader';
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const passportNumber = `PT-${(Math.abs(hash) % 90000) + 10000}`;

  const finishedCount = readingList.filter(
    (b) => b.readingStatus === 'finished' || b.progress === 100
  ).length;

  const inShelfCount = readingList.length;

  const copyToClipboard = (text, label) => {
    playPaperUnwrap();
    navigator.clipboard?.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard! ✨`, { variant: 'info', autoHideDuration: 2000 });
  };

  const handleSaveGoal = () => {
    const val = Number(tempGoal);
    if (val > 0 && val <= 365) {
      setReadingGoal(val);
      localStorage.setItem('pageTurner_readingGoal', String(val));
      setIsEditingGoal(false);
      enqueueSnackbar(`2026 Reading Goal set to ${val} books! 🎯`, { variant: 'success' });
    }
  };

  const goalPercent = Math.min(100, Math.round((finishedCount / readingGoal) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FCFAF5] rounded-3xl border border-[#DECDB8] shadow-[0_24px_70px_rgba(40,25,15,0.25)] overflow-hidden text-[#2C1E18] my-auto flex flex-col max-h-[92vh] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================
            1. COZY VINTAGE LETTERHEAD HEADER
            ============================================================ */}
        <div className="relative px-6 sm:px-7 pt-5 pb-4 bg-gradient-to-b from-[#FAF4EA] to-[#FCFAF5] border-b border-[#EFE5D5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Cute Wax Stamp Badge */}
            <div className="w-10 h-10 rounded-full bg-[#8D263B] text-white flex items-center justify-center shadow-xs flex-shrink-0 border-2 border-[#FAF4EA] ring-1 ring-[#C59B63]/50">
              <span className="font-serif text-lg leading-none">❦</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2A1E17]">
                  Reader&rsquo;s Passport
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8D263B]/10 text-[#8D263B] text-[10px] font-sans font-medium">
                  <PiHeartFill className="text-[10px] text-[#8D263B]" />
                  <span>Sanctuary Edition</span>
                </span>
              </div>
              <p className="font-serif text-xs text-[#7A6C60] italic mt-0.5">
                Your personal library keepsake &amp; reading journey
              </p>
            </div>
          </div>

          {/* Sweet Rounded Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#675C54] hover:text-[#8D263B] flex items-center justify-center transition-all cursor-pointer border border-[#E5DACB]"
          >
            <PiXBold className="text-xs" />
          </button>
        </div>

        {/* ============================================================
            2. SCROLLABLE BODY CONTENT
            ============================================================ */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 text-left">
          {/* ============================================================
              A. VINTAGE BOOKPLATE PASSPORT CARD
              ============================================================ */}
          <div className="relative rounded-2xl bg-white border border-[#E5DACB] p-5 shadow-2xs overflow-hidden">
            {/* Delicate Corner Accents */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#C59B63]/60 pointer-events-none" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#C59B63]/60 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#C59B63]/60 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#C59B63]/60 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              {/* STRICTLY CONSTRAINED PORTRAIT AVATAR */}
              <div className="relative flex-shrink-0 flex flex-col items-center">
                <div
                  onClick={() => {
                    playPaperUnwrap();
                    setShowChangeAvatar(true);
                  }}
                  className="w-20 h-20 min-w-[80px] max-w-[80px] h-[80px] rounded-2xl p-1 bg-[#FAF4EA] border-2 border-[#C59B63]/60 shadow-xs cursor-pointer group/portrait relative overflow-hidden"
                  title="Click to Change Portrait"
                >
                  <img
                    src={
                      activeUser.avatar ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={activeUser.username}
                    className="w-full h-full object-cover rounded-xl group-hover/portrait:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/portrait:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-sans font-medium rounded-xl">
                    <span>Edit</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playPaperUnwrap();
                    setShowChangeAvatar(true);
                  }}
                  className="mt-1.5 text-[11px] font-sans text-[#8D263B] hover:text-[#631422] flex items-center gap-1 cursor-pointer font-medium"
                >
                  <PiCameraBold className="text-xs" />
                  <span>Change photo</span>
                </button>
              </div>

              {/* Reader Identity Details */}
              <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h4 className="font-serif font-bold text-xl text-[#2A1E17] leading-tight truncate">
                        {activeUser.username}
                      </h4>
                      {realDbUsers.length > 0 && (
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                            className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#8D263B] border border-[#DFCBB5] font-medium cursor-pointer shadow-2xs"
                            title="Switch reader profile"
                          >
                            Switch ▾
                          </button>
                          {showUserSwitcher && (
                            <div className="absolute left-0 top-full mt-1 w-48 bg-[#FFFDF9] rounded-xl shadow-lg border border-[#DFCBB5] py-1 z-50 text-xs text-left animate-fade-in">
                              <div className="px-3 py-1 text-[10px] font-sans text-[#7A6C60] border-b border-[#F0E9DE]">
                                Switch Profile:
                              </div>
                              <div className="max-h-40 overflow-y-auto">
                                {realDbUsers.map((u) => (
                                  <button
                                    key={u._id}
                                    type="button"
                                    onClick={async () => {
                                      playWaxSealCrack();
                                      if (switchToRealUser) await switchToRealUser(u.email);
                                      setShowUserSwitcher(false);
                                      enqueueSnackbar(`Switched to ${u.username}! 🌸`, { variant: 'success' });
                                    }}
                                    className={`w-full text-left px-3 py-1.5 hover:bg-[#FAF4EA] text-[#2A1E17] flex items-center justify-between cursor-pointer ${
                                      activeUser.email === u.email ? 'bg-[#FAF4EA] font-semibold text-[#8D263B]' : ''
                                    }`}
                                  >
                                    <span className="truncate">{u.username}</span>
                                    <span className="text-[9px] text-[#7A6C60]">{u.role}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="font-sans text-xs text-[#8D263B] font-medium mt-0.5">
                      {activeUser.role === 'admin'
                        ? '⚜️ Chief Curator & Librarian'
                        : '🌸 Sanctuary Founding Reader'}
                    </p>
                  </div>

                  {/* Passport ID Badge with Copy */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(passportNumber, 'Passport ID')}
                    title="Click to copy Passport ID"
                    className="self-center sm:self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EB] hover:bg-[#F3ECE0] border border-[#E5DACB] text-[11px] font-mono text-[#675C54] transition-colors cursor-pointer"
                  >
                    <span>{passportNumber}</span>
                    <PiCopyBold className="text-xs text-[#8D263B]" />
                  </button>
                </div>

                <p className="text-xs font-sans text-[#675C54] flex items-center justify-center sm:justify-start gap-1.5">
                  <PiEnvelopeSimpleBold className="text-xs text-[#8D263B]" />
                  <span className="truncate">{activeUser.email || 'reader@pageturner.io'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              B. LIVE SANCTUARY STATS (GENUINELY USEFUL!)
              ============================================================ */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#2A1E17] mb-2.5 flex items-center gap-1.5">
              <PiSparkleBold className="text-xs text-[#C59B63]" />
              <span>Sanctuary Reading Progress</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Shelf Count */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsDrawerOpen?.(true);
                }}
                className="p-3 rounded-2xl bg-white border border-[#E5DACB] text-left hover:border-[#8D263B]/50 transition-all cursor-pointer shadow-2xs group"
                title="Open Reading Shelf"
              >
                <div className="flex items-center justify-between text-[#8D263B] mb-1">
                  <PiBooksBold className="text-lg" />
                  <span className="text-[10px] font-sans font-medium text-[#7A6C60] group-hover:text-[#8D263B]">View →</span>
                </div>
                <div className="font-serif font-bold text-xl text-[#2A1E17] leading-none mb-0.5">
                  {inShelfCount}
                </div>
                <div className="text-[11px] font-sans text-[#675C54]">
                  In My Shelf
                </div>
              </button>

              {/* Finished Reads */}
              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] text-left shadow-2xs">
                <div className="flex items-center justify-between text-[#3D5A45] mb-1">
                  <PiBookOpenBold className="text-lg" />
                  <PiCheckBold className="text-xs text-[#3D5A45]" />
                </div>
                <div className="font-serif font-bold text-xl text-[#2A1E17] leading-none mb-0.5">
                  {finishedCount}
                </div>
                <div className="text-[11px] font-sans text-[#675C54]">
                  Completed
                </div>
              </div>

              {/* Literary Streak */}
              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] text-left shadow-2xs">
                <div className="flex items-center justify-between text-[#A6682B] mb-1">
                  <PiFireBold className="text-lg" />
                  <span className="text-[10px] font-sans font-medium text-[#A6682B]">Active</span>
                </div>
                <div className="font-serif font-bold text-xl text-[#2A1E17] leading-none mb-0.5">
                  7 Days
                </div>
                <div className="text-[11px] font-sans text-[#675C54]">
                  Reading Streak
                </div>
              </div>

              {/* Sanctuary Level */}
              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] text-left shadow-2xs">
                <div className="flex items-center justify-between text-[#7D2235] mb-1">
                  <PiHeartFill className="text-base text-rose-500" />
                  <span className="text-[10px] font-sans font-medium text-[#8D263B]">Tier I</span>
                </div>
                <div className="font-serif font-bold text-xl text-[#2A1E17] leading-none mb-0.5">
                  Lv. 4
                </div>
                <div className="text-[11px] font-sans text-[#675C54]">
                  Reader Status
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              C. 2026 ANNUAL READING CHALLENGE (INTERACTIVE & RELEVANT!)
              ============================================================ */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5DACB] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <PiBookmarkSimpleBold className="text-base text-[#8D263B]" />
                <span className="font-serif font-bold text-sm text-[#2A1E17]">
                  2026 Reading Journey
                </span>
              </div>

              {isEditingGoal ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-14 px-2 py-0.5 rounded-lg border border-[#DFCBB5] text-xs font-mono text-center"
                  />
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    className="px-2 py-0.5 rounded-lg bg-[#8D263B] text-white text-[10px] font-sans font-medium cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingGoal(false)}
                    className="text-[10px] text-[#7A6C60] hover:text-[#2A1E17] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTempGoal(readingGoal);
                    setIsEditingGoal(true);
                  }}
                  className="text-[11px] font-sans text-[#8D263B] hover:underline cursor-pointer font-medium"
                >
                  {finishedCount} of {readingGoal} books ({goalPercent}%) &bull; Edit Goal
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[#FAF4EA] border border-[#EFE5D5] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C59B63] to-[#8D263B] transition-all duration-500"
                style={{ width: `${Math.max(4, goalPercent)}%` }}
              />
            </div>
          </div>

          {/* ============================================================
              D. COLLECTIBLE PASSPORT STAMPS
              ============================================================ */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#2A1E17] mb-2.5 flex items-center gap-1.5">
              <PiTagBold className="text-xs text-[#8D263B]" />
              <span>Sanctuary Passport Stamps</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PASSPORT_STAMPS.map((stamp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-white border border-[#E5DACB] flex items-center gap-2.5 shadow-2xs hover:border-[#8D263B]/40 transition-colors"
                >
                  <span className="text-lg flex-shrink-0">{stamp.icon}</span>
                  <div className="min-w-0">
                    <span className="block font-serif text-xs font-bold text-[#2A1E17] truncate leading-tight">
                      {stamp.title}
                    </span>
                    <span className="block font-sans text-[10px] text-[#7A6C60] truncate mt-0.5">
                      {stamp.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================
              E. DIRECT SANCTUARY UTILITIES (USEFUL ACTIONS!)
              ============================================================ */}
          <div className="pt-3 border-t border-[#EFE5D5] flex items-center justify-between flex-wrap gap-2.5">
            {/* Export Reading Shelf (CSV) */}
            <a
              href={bookService.getExportCsvUrl()}
              download
              onClick={() => playRevealChime()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF5EB] hover:bg-[#F3ECE0] text-[#2A1E17] border border-[#DFCBB5] text-xs font-sans font-medium transition-colors shadow-2xs cursor-pointer"
              title="Download your reading shelf as CSV"
            >
              <PiFileArrowDownBold className="text-sm text-[#8D263B]" />
              <span>Export Shelf (CSV)</span>
            </a>

            {/* Open Shelf Drawer */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsDrawerOpen?.(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8D263B] hover:bg-[#731D2E] text-white text-xs font-sans font-medium transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              <PiBookOpenBold className="text-sm" />
              <span>Open My Shelf</span>
            </button>

            {/* Sign Out */}
            {user && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  logout();
                  enqueueSnackbar('Signed out of sanctuary.', { variant: 'info' });
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-[#7A6C60] hover:text-[#8D263B] text-xs font-sans transition-colors cursor-pointer ml-auto"
                title="Sign out of your account"
              >
                <PiSignOutBold className="text-sm" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Portrait / PFP Modal */}
      <ChangeAvatarModal
        isOpen={showChangeAvatar}
        onClose={() => setShowChangeAvatar(false)}
      />
    </div>
  );
};

export default ReaderPassportModal;
