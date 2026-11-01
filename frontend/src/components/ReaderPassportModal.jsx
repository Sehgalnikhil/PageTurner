import React, { useState, useContext, useEffect } from 'react';
import {
  PiXBold,
  PiEnvelopeSimpleBold,
  PiArrowSquareOutBold,
  PiCheckBold,
  PiSpinnerGapBold,
  PiBooksBold,
  PiPaperPlaneTiltBold,
  PiKeyBold,
  PiShieldCheckBold,
  PiCopyBold,
  PiEyeBold,
  PiSparkleBold,
  PiBookOpenBold,
  PiDeviceMobileBold,
  PiDesktopBold,
  PiLockBold,
  PiCameraBold,
  PiHeartFill,
  PiBookmarkSimpleBold,
} from 'react-icons/pi';
import ChangeAvatarModal from './common/ChangeAvatarModal';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import { useSnackbar } from 'notistack';
import {
  playPaperUnwrap,
  playRevealChime,
  playWaxSealCrack,
  playPageFlipSound,
} from '../utils/soundEffects';

const STARTER_BOOKS = [
  {
    id: 'starter-1',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    movement: 'Gothic Aestheticism',
    coverImage: '/images/dorian-open-book-spread.jpg',
    tagColor: 'bg-[#8D263B]/10 text-[#8D263B] border-[#8D263B]/20',
    quote: 'Behind every exquisite thing that existed, there was something tragic.',
    readTime: '6 hrs',
  },
  {
    id: 'starter-2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    movement: 'Stoic Philosophy',
    coverImage: '/images/covers/meditations.jpg',
    tagColor: 'bg-[#A67C4A]/10 text-[#7D5428] border-[#A67C4A]/20',
    quote: 'You have power over your mind - not outside events.',
    readTime: '4 hrs',
  },
  {
    id: 'starter-3',
    title: 'Dune',
    author: 'Frank Herbert',
    movement: 'Speculative Epic',
    coverImage: '/images/covers/dune.jpg',
    tagColor: 'bg-[#43644B]/10 text-[#2D4D35] border-[#43644B]/20',
    quote: 'I must not fear. Fear is the mind-killer.',
    readTime: '18 hrs',
  },
];

const PASSPORT_STAMPS = [
  { icon: '☕', title: 'Quiet Mornings', desc: 'Coffee & warm pages' },
  { icon: '🌙', title: 'Midnight Reader', desc: 'Reading past 12am' },
  { icon: '🕯️', title: 'Curator Circle', desc: 'Thoughtful reflections' },
  { icon: '🎁', title: 'Mystery Parcels', desc: 'Blind dates with books' },
];

const ReaderPassportModal = ({ isOpen, onClose, user }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Tab State: 'passport' | 'mailbox' | 'inspector'
  const [activeTab, setActiveTab] = useState('passport');
  const [loadingType, setLoadingType] = useState(null); // 'welcome' | 'login' | 'reset'
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [lastDispatched, setLastDispatched] = useState(null);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);

  const { switchToRealUser } = useContext(AuthContext);
  const [realDbUsers, setRealDbUsers] = useState([]);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

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

  const [inspectorType, setInspectorType] = useState('welcome'); // 'welcome' | 'login' | 'reset'
  const [inspectorDevice, setInspectorDevice] = useState('desktop'); // 'desktop' | 'mobile'

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

  const welcomePreviewUrl = authService.getEmailPreviewUrl(activeUser.username, activeUser.email);
  const loginPreviewUrl = authService.getLoginEmailPreviewUrl(activeUser.username, activeUser.email);
  const resetPreviewUrl = authService.getResetEmailPreviewUrl(activeUser.username, activeUser.email);

  const getActiveInspectorUrl = () => {
    if (inspectorType === 'login') return loginPreviewUrl;
    if (inspectorType === 'reset') return resetPreviewUrl;
    return welcomePreviewUrl;
  };

  const handleSendWelcomeEmail = async (targetEmail) => {
    const emailToSend = targetEmail || activeUser.email;
    if (!emailToSend) {
      enqueueSnackbar('No email address provided', { variant: 'error' });
      return;
    }

    setLoadingType('welcome');
    try {
      playWaxSealCrack();
      const res = await authService.sendWelcomeEmail({
        email: emailToSend,
        username: activeUser.username,
        frontendUrl: typeof window !== 'undefined' ? window.location.origin : undefined,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Welcome Letter & Passport', email: emailToSend });
        enqueueSnackbar(`💌 Welcome package dispatched to ${emailToSend}!`, {
          variant: 'success',
        });
        if (customEmail) setCustomEmail('');
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send letter', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.customMessage || err.message || 'Failed to dispatch email', {
        variant: 'error',
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleSendLoginAlert = async (targetEmail) => {
    const emailToSend = targetEmail || activeUser.email;
    if (!emailToSend) {
      enqueueSnackbar('No email address provided', { variant: 'error' });
      return;
    }

    setLoadingType('login');
    try {
      playPaperUnwrap();
      const res = await authService.sendLoginAlert({
        email: emailToSend,
        username: activeUser.username,
        frontendUrl: typeof window !== 'undefined' ? window.location.origin : undefined,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Security Notice', email: emailToSend });
        enqueueSnackbar(`🛡️ Security notification sent to ${emailToSend}!`, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send notice', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.customMessage || err.message || 'Failed to dispatch alert', {
        variant: 'error',
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleSendPasswordReset = async (targetEmail) => {
    const emailToSend = targetEmail || activeUser.email;
    if (!emailToSend) {
      enqueueSnackbar('No email address provided', { variant: 'error' });
      return;
    }

    setLoadingType('reset');
    try {
      playWaxSealCrack();
      const res = await authService.forgotPassword(emailToSend);

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Password Recovery Token', email: emailToSend });
        enqueueSnackbar(`🗝️ Recovery letter sent to ${emailToSend}!`, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send reset email', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(err.customMessage || err.message || 'Failed to dispatch reset', {
        variant: 'error',
      });
    } finally {
      setLoadingType(null);
    }
  };

  const copyToClipboard = (text, label) => {
    playPaperUnwrap();
    navigator.clipboard?.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard!`, { variant: 'info', autoHideDuration: 2000 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FCFAF5] rounded-3xl border border-[#DECDB8] shadow-[0_24px_70px_rgba(40,25,15,0.25)] overflow-hidden text-[#2C1E18] my-auto flex flex-col max-h-[90vh] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================
            1. COZY VINTAGE LETTERHEAD HEADER
            ============================================================ */}
        <div className="relative px-6 sm:px-8 pt-6 pb-4 bg-gradient-to-b from-[#FAF4EA] to-[#FCFAF5] border-b border-[#EFE5D5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Cute Wax Stamp Badge */}
            <div className="w-10 h-10 rounded-full bg-[#8D263B] text-white flex items-center justify-center shadow-sm flex-shrink-0 border-2 border-[#FAF4EA] ring-1 ring-[#C59B63]/50">
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
                Your personal library keepsake &amp; postal dispatches
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
            2. CUTE NAVIGATION PILLS
            ============================================================ */}
        <div className="px-6 sm:px-8 py-3 bg-[#FCFAF5] border-b border-[#EFE5D5] flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="inline-flex p-1 rounded-full bg-[#F3ECE0] border border-[#E5DACB]">
            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('passport');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
                activeTab === 'passport'
                  ? 'bg-[#8D263B] text-white font-medium shadow-xs'
                  : 'text-[#675C54] hover:text-[#2A1E17]'
              }`}
            >
              <span>🌸</span>
              <span>My Passport</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('mailbox');
              }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
                activeTab === 'mailbox'
                  ? 'bg-[#8D263B] text-white font-medium shadow-xs'
                  : 'text-[#675C54] hover:text-[#2A1E17]'
              }`}
            >
              <span>💌</span>
              <span>Letters (3)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('inspector');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-serif transition-all cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-[#8D263B] text-white font-medium shadow-xs'
                  : 'text-[#675C54] hover:text-[#2A1E17]'
              }`}
            >
              <span>📖</span>
              <span>Email Preview</span>
            </button>
          </div>

          {/* Cute subtle ID tag */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[#7A6C60] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#E8DEC9]">
            <span>Registry:</span>
            <strong className="text-[#8D263B] font-bold">{passportNumber}</strong>
          </div>
        </div>

        {/* ============================================================
            3. SCROLLABLE BODY CONTENT
            ============================================================ */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-left">
          {/* ------------------------------------------------------------
              TAB 1: PASSPORT & STARTER COMPANIONS
              ------------------------------------------------------------ */}
          {activeTab === 'passport' && (
            <div className="space-y-6 animate-fade-in">
              {/* VINTAGE BOOKPLATE PASSPORT CARD */}
              <div className="relative rounded-2xl bg-white border border-[#E5DACB] p-5 sm:p-6 shadow-xs overflow-hidden">
                {/* Delicate Corner Accents */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#C59B63]/60 pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                  {/* Portrait with cute scalloped ring */}
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div
                      onClick={() => {
                        playPaperUnwrap();
                        setShowChangeAvatar(true);
                      }}
                      className="w-18 h-18 rounded-2xl p-1 bg-[#FAF4EA] border-2 border-[#C59B63]/60 shadow-xs cursor-pointer group/portrait relative overflow-hidden"
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
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/portrait:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-serif rounded-xl">
                        <span>Edit</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playPaperUnwrap();
                        setShowChangeAvatar(true);
                      }}
                      className="mt-1.5 text-[11px] font-serif italic text-[#8D263B] hover:text-[#631422] flex items-center gap-1 cursor-pointer"
                    >
                      <PiCameraBold className="text-xs" />
                      <span>Change photo</span>
                    </button>
                  </div>

                  {/* Reader Identity Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-xl text-[#2A1E17] leading-tight">
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
                                    Readers:
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

                        <p className="font-serif italic text-xs text-[#8D263B] mt-0.5">
                          {activeUser.role === 'admin'
                            ? '⚜️ Chief Curator & Librarian'
                            : '🌸 Founding Reader of the Sanctuary'}
                        </p>
                      </div>

                      {/* Passport Badge with One-Click Copy */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(passportNumber, 'Passport ID')}
                        title="Copy Passport ID"
                        className="self-center sm:self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EB] hover:bg-[#F3ECE0] border border-[#E5DACB] text-[11px] font-mono font-medium text-[#675C54] transition-colors cursor-pointer"
                      >
                        <span>{passportNumber}</span>
                        <PiCopyBold className="text-xs text-[#8D263B]" />
                      </button>
                    </div>

                    <p className="text-xs font-sans text-[#675C54] flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                      <PiEnvelopeSimpleBold className="text-xs text-[#8D263B]" />
                      <span>{activeUser.email || 'reader@pageturner.io'}</span>
                    </p>

                    {/* Cute Passport Stamps Grid */}
                    <div className="pt-3 mt-3 border-t border-[#F0E9DE] grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PASSPORT_STAMPS.map((stamp, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-[#FAF6F0] border border-[#EFE5D8] flex items-center gap-2"
                        >
                          <span className="text-base">{stamp.icon}</span>
                          <div className="min-w-0">
                            <span className="block font-serif text-[11.5px] font-bold text-[#2A1E17] truncate leading-tight">
                              {stamp.title}
                            </span>
                            <span className="block font-serif italic text-[10px] text-[#7A6C60] truncate">
                              {stamp.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STARTER PACK BOOKS (3 CURATED COMPANIONS) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PiBookOpenBold className="text-base text-[#8D263B]" />
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#2A1E17]">
                      Curated Companion Starter Books
                    </h4>
                  </div>
                  <span className="font-serif italic text-xs text-[#7A6C60]">
                    Bound to your registry
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STARTER_BOOKS.map((book) => (
                    <div
                      key={book.id}
                      className="p-3 rounded-2xl bg-white border border-[#E5DACB] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-15 rounded-lg overflow-hidden shadow-2xs flex-shrink-0 border border-[#E5DACB] bg-[#2E2520]">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block text-[9px] font-sans font-semibold px-2 py-0.5 rounded-full border mb-1 ${book.tagColor}`}
                          >
                            {book.movement}
                          </span>
                          <h5 className="font-serif font-bold text-xs text-[#2A1E17] truncate group-hover:text-[#8D263B] transition-colors">
                            {book.title}
                          </h5>
                          <p className="text-[11px] text-[#7A6C60] font-serif italic truncate">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      <p className="text-[10.5px] text-[#675C54] font-serif italic line-clamp-2 mt-2 pt-2 border-t border-[#F5EFE6]">
                        &ldquo;{book.quote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DISPATCH ACTION BAR */}
              <div className="pt-3 border-t border-[#EFE5D5] space-y-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Primary Dispatch Button */}
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(activeUser.email)}
                    disabled={loadingType === 'welcome' || !activeUser.email}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#8D263B] hover:bg-[#731D2E] text-white text-xs sm:text-[13px] font-serif font-medium shadow-xs hover:shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingType === 'welcome' ? (
                      <>
                        <PiSpinnerGapBold className="text-sm animate-spin" />
                        <span>Sending your keepsake...</span>
                      </>
                    ) : (
                      <>
                        <PiEnvelopeSimpleBold className="text-sm" />
                        <span>Send Welcome Keepsake to My Inbox</span>
                      </>
                    )}
                  </button>

                  {/* Live Preview Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playPageFlipSound();
                      setActiveTab('inspector');
                      setInspectorType('welcome');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#2A1E17] text-xs font-serif transition-colors border border-[#DFCBB5] cursor-pointer"
                  >
                    <PiEyeBold className="text-xs text-[#8D263B]" />
                    <span>Preview Letter</span>
                  </button>

                  {/* External Tab Link */}
                  <a
                    href={welcomePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open standalone preview in new tab"
                    className="p-2.5 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#675C54] hover:text-[#8D263B] border border-[#DFCBB5] transition-colors"
                  >
                    <PiArrowSquareOutBold className="text-xs" />
                  </a>
                </div>

                {/* Custom Email Toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="text-[11.5px] font-serif italic text-[#7A6C60] hover:text-[#8D263B] hover:underline transition-colors cursor-pointer"
                  >
                    {showCustomInput
                      ? '▲ Hide custom address'
                      : '▾ Send a copy to another email address'}
                  </button>
                </div>

                {/* Custom Dispatch Drawer */}
                {showCustomInput && (
                  <div className="flex items-center gap-2 pt-1 animate-fade-in bg-[#FAF5EB] p-2 rounded-2xl border border-[#E5DACB]">
                    <input
                      type="email"
                      placeholder="Enter recipient email (e.g. friend@readingnook.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#DFCBB5] focus:outline-none focus:border-[#8D263B] text-[#2A1E17] font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(customEmail)}
                      disabled={loadingType === 'welcome' || !customEmail.trim()}
                      className="px-4 py-2 rounded-xl bg-[#8D263B] hover:bg-[#731D2E] text-white text-xs font-serif font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      <PiPaperPlaneTiltBold className="text-xs" />
                      <span>Send</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------
              TAB 2: LITERARY MAILBOX (3 HANDCRAFTED TEMPLATES)
              ------------------------------------------------------------ */}
          {activeTab === 'mailbox' && (
            <div className="space-y-4 animate-fade-in">
              <div className="pb-3 border-b border-[#EFE5D5]">
                <h4 className="font-serif text-lg font-bold text-[#2A1E17]">
                  Postal Letters &amp; Dispatches
                </h4>
                <p className="text-xs text-[#7A6C60] font-serif italic mt-0.5">
                  Three handcrafted epistolary letters sealed with deckled edges and literary typography.
                </p>
              </div>

              {/* 3 Postal Letters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* LETTER 01: WELCOME & PASSPORT */}
                <div className="rounded-2xl bg-white border border-[#E5DACB] p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-semibold text-[#8D263B] bg-[#8D263B]/10 px-2.5 py-0.5 rounded-full">
                        Letter 01
                      </span>
                      <span className="text-sm">📜</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2A1E17] group-hover:text-[#8D263B] transition-colors">
                      Welcome Folio
                    </h5>
                    <p className="text-[11px] text-[#675C54] font-serif italic mt-1 leading-relaxed">
                      Librarian greeting, member ID badge, and 3 companion classics.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5EFE6] space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(activeUser.email)}
                      disabled={loadingType === 'welcome'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#8D263B] hover:bg-[#731D2E] text-white text-xs font-serif font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'welcome' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiPaperPlaneTiltBold className="text-xs" />
                      )}
                      <span>Send to Inbox</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('welcome');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#2A1E17] text-xs font-serif flex items-center justify-center gap-1.5 transition-colors border border-[#DFCBB5] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#8D263B]" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {/* LETTER 02: LOGIN ALERT */}
                <div className="rounded-2xl bg-white border border-[#E5DACB] p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-semibold text-[#3D5A45] bg-[#3D5A45]/10 px-2.5 py-0.5 rounded-full">
                        Letter 02
                      </span>
                      <span className="text-sm">🛡️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2A1E17] group-hover:text-[#3D5A45] transition-colors">
                      Security Notice
                    </h5>
                    <p className="text-[11px] text-[#675C54] font-serif italic mt-1 leading-relaxed">
                      Instant session receipt with device, origin, and time.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5EFE6] space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendLoginAlert(activeUser.email)}
                      disabled={loadingType === 'login'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#3D5A45] hover:bg-[#2C4433] text-white text-xs font-serif font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'login' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiShieldCheckBold className="text-xs" />
                      )}
                      <span>Send Notice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('login');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#2A1E17] text-xs font-serif flex items-center justify-center gap-1.5 transition-colors border border-[#DFCBB5] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#3D5A45]" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {/* LETTER 03: PASSWORD RECOVERY */}
                <div className="rounded-2xl bg-white border border-[#E5DACB] p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-semibold text-[#8C6239] bg-[#8C6239]/10 px-2.5 py-0.5 rounded-full">
                        Letter 03
                      </span>
                      <span className="text-sm">🗝️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2A1E17] group-hover:text-[#8C6239] transition-colors">
                      Recovery Key
                    </h5>
                    <p className="text-[11px] text-[#675C54] font-serif italic mt-1 leading-relaxed">
                      Wax-sealed 60-minute token with instant sanctuary link.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F5EFE6] space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handleSendPasswordReset(activeUser.email)}
                      disabled={loadingType === 'reset'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#8C6239] hover:bg-[#704E2B] text-white text-xs font-serif font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'reset' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiKeyBold className="text-xs" />
                      )}
                      <span>Send Recovery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('reset');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#F3ECE0] hover:bg-[#EAE0D0] text-[#2A1E17] text-xs font-serif flex items-center justify-center gap-1.5 transition-colors border border-[#DFCBB5] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#8C6239]" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Postal Sandbox Box */}
              <div className="p-4 rounded-2xl bg-[#FAF5EB] border border-[#E5DACB] text-xs">
                <span className="font-serif font-bold text-[#2A1E17] block mb-1.5">
                  Deliver Any Template to a Custom Email:
                </span>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter recipient (e.g. companion@sanctuary.org)"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#DFCBB5] focus:outline-none focus:border-[#8D263B] text-[#2A1E17]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF4EA] text-[#2A1E17] border border-[#DFCBB5] text-xs font-serif disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Welcome
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendLoginAlert(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF4EA] text-[#2A1E17] border border-[#DFCBB5] text-xs font-serif disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendPasswordReset(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-[#8D263B] hover:bg-[#731D2E] text-white text-xs font-serif font-medium disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------
              TAB 3: LIVE EMAIL INSPECTOR
              ------------------------------------------------------------ */}
          {activeTab === 'inspector' && (
            <div className="space-y-4 animate-fade-in">
              {/* Controls Header */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E5DACB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Template Selector */}
                <div className="inline-flex p-1 rounded-full bg-[#F3ECE0] border border-[#DFCBB5]">
                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setInspectorType('welcome');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                      inspectorType === 'welcome'
                        ? 'bg-[#8D263B] text-white font-medium shadow-xs'
                        : 'text-[#675C54] hover:text-[#2A1E17]'
                    }`}
                  >
                    Welcome Folio
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setInspectorType('login');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                      inspectorType === 'login'
                        ? 'bg-[#3D5A45] text-white font-medium shadow-xs'
                        : 'text-[#675C54] hover:text-[#2A1E17]'
                    }`}
                  >
                    Security Notice
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setInspectorType('reset');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
                      inspectorType === 'reset'
                        ? 'bg-[#8C6239] text-white font-medium shadow-xs'
                        : 'text-[#675C54] hover:text-[#2A1E17]'
                    }`}
                  >
                    Recovery Key
                  </button>
                </div>

                {/* Device & External Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-0.5 bg-[#F3ECE0] rounded-full border border-[#DFCBB5]">
                    <button
                      type="button"
                      onClick={() => setInspectorDevice('desktop')}
                      title="Desktop view"
                      className={`p-1.5 rounded-full text-xs cursor-pointer ${
                        inspectorDevice === 'desktop'
                          ? 'bg-white text-[#8D263B] shadow-2xs'
                          : 'text-[#675C54]'
                      }`}
                    >
                      <PiDesktopBold className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorDevice('mobile')}
                      title="Mobile view"
                      className={`p-1.5 rounded-full text-xs cursor-pointer ${
                        inspectorDevice === 'mobile'
                          ? 'bg-white text-[#8D263B] shadow-2xs'
                          : 'text-[#675C54]'
                      }`}
                    >
                      <PiDeviceMobileBold className="text-sm" />
                    </button>
                  </div>

                  <a
                    href={getActiveInspectorUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF4EA] text-[#2A1E17] text-xs font-serif border border-[#DFCBB5] shadow-2xs"
                  >
                    <span>Full Tab</span>
                    <PiArrowSquareOutBold className="text-xs text-[#8D263B]" />
                  </a>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div className="rounded-2xl border border-[#DFCBB5] bg-[#FAF5EB] p-2 sm:p-4 shadow-inner flex justify-center overflow-hidden">
                <div
                  className={`transition-all duration-300 bg-white rounded-xl shadow-md overflow-hidden border border-[#E5DACB] ${
                    inspectorDevice === 'mobile' ? 'w-[375px]' : 'w-full'
                  }`}
                  style={{ height: '400px' }}
                >
                  <iframe
                    key={`${inspectorType}-${inspectorDevice}`}
                    src={getActiveInspectorUrl()}
                    title="Email Preview"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Persistent Dispatched Banner */}
          {lastDispatched && (
            <div className="text-xs font-serif text-emerald-900 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
              <span className="flex items-center gap-2">
                <PiCheckBold className="text-sm text-emerald-600 font-bold" />
                <span>
                  Dispatched <strong>{lastDispatched.type}</strong> to{' '}
                  <span className="underline font-semibold">{lastDispatched.email}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setLastDispatched(null)}
                className="text-emerald-700 hover:text-emerald-950 text-sm cursor-pointer font-bold px-1"
              >
                &times;
              </button>
            </div>
          )}
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
