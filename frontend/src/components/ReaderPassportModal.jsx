import React, { useState } from 'react';
import {
  PiXBold,
  PiEnvelopeSimpleBold,
  PiArrowSquareOutBold,
  PiCheckBold,
  PiSpinnerGapBold,
  PiBooksBold,
  PiShieldCheckFill,
  PiPaperPlaneTiltBold,
  PiKeyBold,
  PiShieldCheckBold,
  PiIdentificationCardBold,
  PiTrayBold,
  PiCopyBold,
  PiEyeBold,
  PiArrowsClockwiseBold,
  PiSparkleBold,
  PiBookOpenBold,
  PiDeviceMobileBold,
  PiDesktopBold,
  PiLockBold,
  PiSealCheckBold,
  PiCameraBold,
} from 'react-icons/pi';
import ChangeAvatarModal from './common/ChangeAvatarModal';
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
    tagColor: 'bg-[#7D2235]/15 text-[#7D2235] border-[#7D2235]/30',
    quote: 'Behind every exquisite thing that existed, there was something tragic.',
    readTime: '6 hrs',
  },
  {
    id: 'starter-2',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    movement: 'Stoic Philosophy',
    coverImage: '/images/covers/meditations.jpg',
    tagColor: 'bg-[#9C5A20]/15 text-[#9C5A20] border-[#9C5A20]/30',
    quote: 'You have power over your mind - not outside events. Realise this, and you will find strength.',
    readTime: '4 hrs',
  },
  {
    id: 'starter-3',
    title: 'Dune',
    author: 'Frank Herbert',
    movement: 'Speculative Epic',
    coverImage: '/images/covers/dune.jpg',
    tagColor: 'bg-[#2E5A36]/15 text-[#2E5A36] border-[#2E5A36]/30',
    quote: 'I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration.',
    readTime: '18 hrs',
  },
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

  // Inspector tab state
  const [inspectorType, setInspectorType] = useState('welcome'); // 'welcome' | 'login' | 'reset'
  const [inspectorDevice, setInspectorDevice] = useState('desktop'); // 'desktop' | 'mobile'

  if (!isOpen) return null;

  const activeUser = user || {
    username: 'Kindred Reader',
    email: 'reader@pageturner.io',
    role: 'reader',
  };

  // Deterministic passport number
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
      enqueueSnackbar('No dispatch address provided', { variant: 'error' });
      return;
    }

    setLoadingType('welcome');
    try {
      playWaxSealCrack();
      const res = await authService.sendWelcomeEmail({
        email: emailToSend,
        username: activeUser.username,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Welcome Package & Passport', email: emailToSend });
        enqueueSnackbar(`✉️ Welcome package dispatched to ${emailToSend}!`, {
          variant: 'success',
        });
        if (customEmail) setCustomEmail('');
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send dispatch', { variant: 'error' });
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
      enqueueSnackbar('No dispatch address provided', { variant: 'error' });
      return;
    }

    setLoadingType('login');
    try {
      playPaperUnwrap();
      const res = await authService.sendLoginAlert({
        email: emailToSend,
        username: activeUser.username,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Session Security Alert', email: emailToSend });
        enqueueSnackbar(`🛡️ Session security notification dispatched to ${emailToSend}!`, {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send security alert', { variant: 'error' });
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
      enqueueSnackbar('No dispatch address provided', { variant: 'error' });
      return;
    }

    setLoadingType('reset');
    try {
      playWaxSealCrack();
      const res = await authService.forgotPassword(emailToSend);

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Password Recovery Token', email: emailToSend });
        enqueueSnackbar(`🗝️ Password recovery dispatch sent to ${emailToSend}!`, {
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
    enqueueSnackbar(`${label} copied to clipboard!`, { variant: 'info', autoHideDuration: 2200 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF5EB] rounded-3xl border-2 border-[#D8C7B0] shadow-[0_25px_80px_rgba(20,15,10,0.55)] overflow-hidden text-[#2F2620] my-auto flex flex-col max-h-[92vh] select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================
            1. BESPOKE LEATHER-BOUND CRIMSON HEADER BANNER
            ============================================================ */}
        <div className="relative bg-gradient-to-r from-[#4A0E18] via-[#7B1826] to-[#4A0E18] px-6 py-4 text-white flex items-center justify-between flex-shrink-0 border-b-2 border-[#C59B63]/40 shadow-inner">
          {/* Subtle gold filigree accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F7D8A4]/70 to-transparent" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8D263B] to-[#3B0810] border-2 border-[#E9C38B]/80 flex items-center justify-center text-[#F7D8A4] text-base shadow-md">
              ❦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FFFDF8] leading-none">
                  Ex-Libris Passport &amp; Literary Mailbox
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#F7D8A4] text-[10px] font-mono font-medium border border-white/15">
                  <PiSealCheckBold className="text-xs" />
                  Verified Folio
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#E9C38B]/80 mt-1">
                PAGETURNER ARCHIVAL GUILD &bull; ISSUE NO. 24 &bull; DISPATCH HUB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5EB] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 hover:rotate-90"
          >
            <PiXBold className="text-sm" />
          </button>
        </div>

        {/* ============================================================
            2. REFINED TAB NAVIGATION RIBBON & SMTP STATUS
            ============================================================ */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#EFE8DA] border-b border-[#D8C7B0] flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-[#E3D7C3] rounded-xl border border-[#D0C0A8]">
            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('passport');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'passport'
                  ? 'bg-[#7D2235] text-white shadow-xs font-bold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <PiIdentificationCardBold className="text-sm" />
              <span>Reader Passport</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('mailbox');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mailbox'
                  ? 'bg-[#7D2235] text-white shadow-xs font-bold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <PiTrayBold className="text-sm" />
              <span>Literary Mailbox (3 Dispatches)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPageFlipSound();
                setActiveTab('inspector');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-[#7D2235] text-white shadow-xs font-bold'
                  : 'text-[#645548] hover:text-[#2F2620]'
              }`}
            >
              <PiEyeBold className="text-sm" />
              <span>Live Inspector</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-[#695D53]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E5DBCB] border border-[#D5C6AF]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>SMTP Live: <strong className="text-[#2F2620]">Gmail Cloud</strong></span>
            </span>
          </div>
        </div>

        {/* ============================================================
            3. SCROLLABLE BODY CONTENT
            ============================================================ */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-left">
          {/* ------------------------------------------------------------
              TAB 1: OFFICIAL READER PASSPORT & STARTER BOOKS
              ------------------------------------------------------------ */}
          {activeTab === 'passport' && (
            <div className="space-y-6 animate-fade-in">
              {/* AUTHENTIC ARCHIVAL PASSPORT CERTIFICATE */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#F3E9DA] border-2 border-[#D1BFA8] p-5 sm:p-6 shadow-[0_8px_25px_rgba(40,30,20,0.06)] overflow-hidden">
                {/* Vintage Washi Tape Top Tab */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-4.5 bg-[#8D263B]/25 rounded-xs transform -rotate-1 border-x border-dashed border-[#8D263B]/40 shadow-xs pointer-events-none" />

                {/* Gilded Corner Filigrees */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#C59B63]/60 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C59B63]/60 pointer-events-none" />

                {/* Archival Library Accession Rubber Stamp Impression */}
                <div className="absolute -bottom-2 right-4 pointer-events-none opacity-60 mix-blend-multiply rotate-[-8deg] hidden sm:block">
                  <img
                    src="/images/login-passport-stamp-clean.png"
                    alt="Accession Stamp"
                    className="w-28 h-auto object-contain filter sepia"
                  />
                </div>

                {/* Top Certificate Header */}
                <div className="flex items-center justify-between border-b border-[#DFCBB5] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#7D2235] flex items-center gap-1.5">
                      <PiShieldCheckFill className="text-sm text-[#7D2235]" />
                      Verified Library Member
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#C59B63]" />
                    <span className="font-mono text-[10px] text-[#817265] hidden sm:inline">
                      Cathedral Registry No. 8924
                    </span>
                  </div>

                  {/* Passport Number with One-Click Copy */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(passportNumber, 'Passport ID')}
                    title="Click to copy Passport ID"
                    className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#EADBC8] text-[#4A392C] border border-[#D5C2AC] flex items-center gap-1.5 hover:bg-[#DFCDB8] transition-colors cursor-pointer group"
                  >
                    <span>{passportNumber}</span>
                    <PiCopyBold className="text-xs text-[#817265] group-hover:text-[#7D2235]" />
                  </button>
                </div>

                {/* Identity Layout: Avatar Medallion + Typography */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Circular Portrait Frame with Change PFP Action */}
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div
                      onClick={() => {
                        playPaperUnwrap();
                        setShowChangeAvatar(true);
                      }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E2D4C0] to-[#C9B59C] p-1 border-2 border-[#C59B63] shadow-md cursor-pointer group/portrait relative"
                      title="Click to Change Reader Portrait / PFP"
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden bg-[#2D241E] relative">
                        <img
                          src={
                            activeUser.avatar ||
                            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'
                          }
                          alt={activeUser.username}
                          className="w-full h-full object-cover group-hover/portrait:scale-105 transition-transform"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/portrait:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-mono gap-0.5">
                          <PiCameraBold className="text-sm text-[#F7D8A4]" />
                          <span>Edit PFP</span>
                        </div>
                      </div>

                      {/* Small Wax Medallion Badge */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7D2235] border-2 border-[#FAF5EB] flex items-center justify-center text-[#F7D8A4] text-[10px] shadow-sm font-serif">
                        ❦
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playPaperUnwrap();
                        setShowChangeAvatar(true);
                      }}
                      className="mt-1.5 text-[10px] font-mono font-semibold text-[#7D2235] hover:text-[#92283F] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <PiCameraBold className="text-xs" />
                      <span>Change PFP</span>
                    </button>
                  </div>

                  {/* Reader Details */}
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#7A6A5E] tracking-wider block">
                          Reader Name
                        </span>
                        <h4 className="font-serif font-bold text-lg sm:text-xl text-[#2F2620] leading-tight">
                          {activeUser.username}
                        </h4>
                      </div>

                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#7A6A5E] tracking-wider block">
                          Member Tier
                        </span>
                        <p className="font-serif font-bold text-sm text-[#7D2235] leading-tight flex items-center gap-1.5">
                          <span>
                            {activeUser.role === 'admin'
                              ? 'Curator & Chief Librarian'
                              : 'Verified Founding Reader'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#7A6A5E] tracking-wider block">
                        Dispatch Address
                      </span>
                      <p className="font-mono text-xs text-[#3D3128] mt-0.5 flex items-center gap-1.5">
                        <PiLockBold className="text-xs text-emerald-700" />
                        <span>{activeUser.email || 'admin@pageturner.io'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Privileges Strip */}
                <div className="mt-4 pt-3 border-t border-[#DFCBB5] text-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7A6A5E] font-bold block mb-2">
                    Active Archival Privileges:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { icon: '📌', label: 'Unlimited Shelf Pins' },
                      { icon: '🎁', label: 'Mystery Parcel Blind Dates' },
                      { icon: '📜', label: 'Full CSV Catalog Export' },
                      { icon: '🎧', label: 'Ambient Cathedral Solace' },
                      { icon: '🛡️', label: 'Instant Session Alerts' },
                    ].map((priv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFE5D5] text-[#3D3128] text-[11px] font-sans font-medium border border-[#D9C8B0]"
                      >
                        <span>{priv.icon}</span>
                        <span>{priv.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------
                  STARTER PACK BOOKS INCLUDED IN YOUR PACKAGE (3 CURATED VOLUMES)
                  ------------------------------------------------------------ */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PiBooksBold className="text-lg text-[#7D2235]" />
                    <h4 className="font-serif text-base font-bold text-[#2F2620]">
                      Starter Pack Books Bound to Your Registry
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] text-[#7A6A5E] uppercase tracking-wider bg-[#EAE0D0] px-2.5 py-0.5 rounded-full border border-[#D5C6AF]">
                    3 Curated Volumes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STARTER_BOOKS.map((book) => (
                    <div
                      key={book.id}
                      className="group p-3 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] shadow-xs hover:shadow-md hover:border-[#7D2235]/40 transition-all flex flex-col justify-between text-left relative overflow-hidden"
                    >
                      {/* Top Genre Badge & Read Time */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${book.tagColor}`}
                        >
                          {book.movement}
                        </span>
                        <span className="font-mono text-[10px] text-[#8C7A68]">
                          {book.readTime}
                        </span>
                      </div>

                      {/* Cover Thumbnail & Metadata */}
                      <div className="flex items-center gap-3 my-1">
                        <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm flex-shrink-0 border border-[#D9CCB7] bg-[#2E2520]">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif font-bold text-xs sm:text-sm text-[#2F2620] truncate group-hover:text-[#7D2235] transition-colors">
                            {book.title}
                          </h5>
                          <p className="text-[11px] text-[#7A6A5E] italic truncate">
                            {book.author}
                          </p>
                          <span className="text-[10px] font-mono text-[#8C7A68] block mt-1">
                            Chapter Excerpt Ready
                          </span>
                        </div>
                      </div>

                      {/* Quote Snippet */}
                      <p className="text-[10px] text-[#645548] font-serif italic line-clamp-2 mt-2 pt-2 border-t border-[#EFE5D5]">
                        “{book.quote}”
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------------------
                  DISPATCH ACTION BAR
                  ------------------------------------------------------------ */}
              <div className="pt-3 border-t border-[#DFCBB5] space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Primary Dispatch Button */}
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(activeUser.email)}
                    disabled={loadingType === 'welcome' || !activeUser.email}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6A1624] via-[#7D2235] to-[#5C101B] hover:brightness-105 text-[#FFFDF8] text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingType === 'welcome' ? (
                      <>
                        <PiSpinnerGapBold className="text-base animate-spin text-[#F7D8A4]" />
                        <span>Dispatching Folio to Mailbox...</span>
                      </>
                    ) : (
                      <>
                        <PiEnvelopeSimpleBold className="text-base text-[#F7D8A4]" />
                        <span>Send Welcome Package to My Inbox</span>
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
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#EFE5D5] hover:bg-[#E5D7C2] text-[#2F2620] text-xs font-semibold border border-[#D5C2AC] transition-colors shadow-2xs cursor-pointer"
                  >
                    <PiEyeBold className="text-sm text-[#7D2235]" />
                    <span>Live Preview</span>
                  </button>

                  {/* External Tab Link */}
                  <a
                    href={welcomePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open full inspector in new tab"
                    className="p-3 rounded-full bg-[#EFE5D5] hover:bg-[#E5D7C2] text-[#2F2620] border border-[#D5C2AC] transition-colors shadow-2xs"
                  >
                    <PiArrowSquareOutBold className="text-sm text-[#7D2235]" />
                  </a>
                </div>

                {/* Custom Email Toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="text-[11px] font-mono text-[#7A6A5E] hover:text-[#7D2235] hover:underline transition-colors cursor-pointer"
                  >
                    {showCustomInput
                      ? '▲ Hide custom address dispatch'
                      : '▼ Send a copy to another email address'}
                  </button>
                </div>

                {/* Custom Dispatch Drawer */}
                {showCustomInput && (
                  <div className="flex items-center gap-2 pt-1 animate-fade-in bg-[#EFE6D7] p-2.5 rounded-2xl border border-[#D9C8B0]">
                    <input
                      type="email"
                      placeholder="Enter recipient email (e.g. kindred@example.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#D8C7B0] focus:outline-none focus:border-[#7D2235] text-[#2F2620]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(customEmail)}
                      disabled={loadingType === 'welcome' || !customEmail.trim()}
                      className="px-4 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      <PiPaperPlaneTiltBold className="text-xs" />
                      <span>Dispatch</span>
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
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFCBB5]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#2F2620]">
                    The PageTurner Postal Archive
                  </h4>
                  <p className="text-xs text-[#7A6A5E] font-serif italic mt-0.5">
                    Three handcrafted epistolary dispatches styled with deckled vellum, classical typography, and wax seals.
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#7D2235] px-2.5 py-1 bg-[#7D2235]/10 rounded-full border border-[#7D2235]/20">
                  Gmail SMTP Active
                </span>
              </div>

              {/* 3 Postal Letters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LETTER 01: WELCOME & PASSPORT */}
                <div className="relative rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] p-4.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-3 bg-[#7D2235]/20 rounded-xs transform -rotate-1 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#7D2235] tracking-wider bg-[#7D2235]/10 px-2 py-0.5 rounded-full">
                        Letter No. 01
                      </span>
                      <span className="text-xs">📜</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2F2620] group-hover:text-[#7D2235] transition-colors">
                      Welcome &amp; Passport Folio
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Librarian greeting, member ID badge, and 3 starter pack classics.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#FAF4EA] border border-[#E9DCB8] text-[10px] font-mono text-[#7A6A5E]">
                      Trigger: <strong>New Account Sign-up</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE5D5] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(activeUser.email)}
                      disabled={loadingType === 'welcome'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'welcome' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiPaperPlaneTiltBold className="text-xs" />
                      )}
                      <span>Dispatch Copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('welcome');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#EFE5D5] hover:bg-[#E5D7C2] text-[#2F2620] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#D5C2AC] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#7D2235]" />
                      <span>Inspect Template</span>
                    </button>
                  </div>
                </div>

                {/* LETTER 02: LOGIN ALERT */}
                <div className="relative rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] p-4.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-3 bg-[#2E5A36]/20 rounded-xs transform rotate-1 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#2E5A36] tracking-wider bg-[#2E5A36]/10 px-2 py-0.5 rounded-full">
                        Letter No. 02
                      </span>
                      <span className="text-xs">🛡️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2F2620] group-hover:text-[#2E5A36] transition-colors">
                      Session Login Alert
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Instant security receipt with device, origin IP, timestamp, and lock trigger.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#FAF4EA] border border-[#E9DCB8] text-[10px] font-mono text-[#7A6A5E]">
                      Trigger: <strong>Every Session Login</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE5D5] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendLoginAlert(activeUser.email)}
                      disabled={loadingType === 'login'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#2E5A36] hover:bg-[#234529] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'login' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiShieldCheckBold className="text-xs" />
                      )}
                      <span>Dispatch Alert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('login');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#EFE5D5] hover:bg-[#E5D7C2] text-[#2F2620] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#D5C2AC] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#2E5A36]" />
                      <span>Inspect Template</span>
                    </button>
                  </div>
                </div>

                {/* LETTER 03: PASSWORD RECOVERY */}
                <div className="relative rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] p-4.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-3 bg-[#9C5A20]/20 rounded-xs transform -rotate-1 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#9C5A20] tracking-wider bg-[#9C5A20]/10 px-2 py-0.5 rounded-full">
                        Letter No. 03
                      </span>
                      <span className="text-xs">🗝️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#2F2620] group-hover:text-[#9C5A20] transition-colors">
                      Cryptographic Recovery Key
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Wax-sealed 60-minute cryptographic recovery token with instant access link.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#FAF4EA] border border-[#E9DCB8] text-[10px] font-mono text-[#7A6A5E]">
                      Trigger: <strong>Forgot Password Request</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE5D5] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendPasswordReset(activeUser.email)}
                      disabled={loadingType === 'reset'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#9C5A20] hover:bg-[#7D4616] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {loadingType === 'reset' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiKeyBold className="text-xs" />
                      )}
                      <span>Request Reset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playPageFlipSound();
                        setActiveTab('inspector');
                        setInspectorType('reset');
                      }}
                      className="w-full py-1.5 px-3 rounded-full bg-[#EFE5D5] hover:bg-[#E5D7C2] text-[#2F2620] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#D5C2AC] cursor-pointer"
                    >
                      <PiEyeBold className="text-xs text-[#9C5A20]" />
                      <span>Inspect Template</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Postal Sandbox Console */}
              <div className="p-4 rounded-2xl bg-[#EFE6D7] border border-[#D9C8B0] text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-[#645548] block mb-2">
                  Postal Dispatch Sandbox &bull; Deliver Any Template to Custom Address:
                </span>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter recipient (e.g. librarian@sanctuary.org)"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#D8C7B0] focus:outline-none focus:border-[#7D2235] text-[#2F2620]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#2F2620] border border-[#D5C2AC] text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Welcome
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendLoginAlert(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#2F2620] border border-[#D5C2AC] text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendPasswordReset(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------
              TAB 3: IN-SANCTUM LIVE EMAIL INSPECTOR
              ------------------------------------------------------------ */}
          {activeTab === 'inspector' && (
            <div className="space-y-4 animate-fade-in">
              {/* Controls Header */}
              <div className="p-3.5 rounded-2xl bg-[#EFE5D5] border border-[#D8C7B0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Template Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-[#E3D7C3] rounded-xl border border-[#D0C0A8]">
                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setInspectorType('welcome');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inspectorType === 'welcome'
                        ? 'bg-[#7D2235] text-white shadow-xs font-bold'
                        : 'text-[#645548] hover:text-[#2F2620]'
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
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inspectorType === 'login'
                        ? 'bg-[#2E5A36] text-white shadow-xs font-bold'
                        : 'text-[#645548] hover:text-[#2F2620]'
                    }`}
                  >
                    Security Alert
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setInspectorType('reset');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inspectorType === 'reset'
                        ? 'bg-[#9C5A20] text-white shadow-xs font-bold'
                        : 'text-[#645548] hover:text-[#2F2620]'
                    }`}
                  >
                    Recovery Key
                  </button>
                </div>

                {/* Device & External Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 bg-[#E3D7C3] rounded-lg border border-[#D0C0A8]">
                    <button
                      type="button"
                      onClick={() => setInspectorDevice('desktop')}
                      title="Desktop Width View"
                      className={`p-1.5 rounded-md text-xs cursor-pointer ${
                        inspectorDevice === 'desktop'
                          ? 'bg-white text-[#7D2235] shadow-xs'
                          : 'text-[#645548]'
                      }`}
                    >
                      <PiDesktopBold className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorDevice('mobile')}
                      title="Mobile Width View"
                      className={`p-1.5 rounded-md text-xs cursor-pointer ${
                        inspectorDevice === 'mobile'
                          ? 'bg-white text-[#7D2235] shadow-xs'
                          : 'text-[#645548]'
                      }`}
                    >
                      <PiDeviceMobileBold className="text-sm" />
                    </button>
                  </div>

                  <a
                    href={getActiveInspectorUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF5EB] hover:bg-white text-[#2F2620] text-xs font-semibold border border-[#D5C2AC] shadow-2xs"
                  >
                    <span>Open Standalone</span>
                    <PiArrowSquareOutBold className="text-xs text-[#7D2235]" />
                  </a>
                </div>
              </div>

              {/* Iframe Frame Viewport */}
              <div className="rounded-2xl border-2 border-[#D8C7B0] bg-[#2E2520] p-2 sm:p-4 shadow-inner flex justify-center overflow-hidden">
                <div
                  className={`transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D5C2AC] ${
                    inspectorDevice === 'mobile' ? 'w-[375px]' : 'w-full'
                  }`}
                  style={{ height: '420px' }}
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
            <div className="text-[11px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2 shadow-xs">
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
