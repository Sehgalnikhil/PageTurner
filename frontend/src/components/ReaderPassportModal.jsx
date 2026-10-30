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
} from 'react-icons/pi';
import { authService, API_BASE_URL } from '../services/api';
import { useSnackbar } from 'notistack';
import { playPaperUnwrap, playRevealChime, playWaxSealCrack } from '../utils/soundEffects';

const ReaderPassportModal = ({ isOpen, onClose, user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState('passport'); // 'passport' | 'mailbox'
  const [loadingType, setLoadingType] = useState(null); // 'welcome' | 'login' | 'reset'
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [lastDispatched, setLastDispatched] = useState(null);

  if (!isOpen || !user) return null;

  // Generate deterministic passport number
  let hash = 0;
  const name = user.username || 'Reader';
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const passportNumber = `PT-${(Math.abs(hash) % 90000) + 10000}`;

  const welcomePreviewUrl = authService.getEmailPreviewUrl(user.username, user.email);
  const loginPreviewUrl = authService.getLoginEmailPreviewUrl(user.username, user.email);
  const resetPreviewUrl = authService.getResetEmailPreviewUrl(user.username, user.email);

  const handleSendWelcomeEmail = async (targetEmail) => {
    const emailToSend = targetEmail || user.email;
    if (!emailToSend) {
      enqueueSnackbar('No email address provided', { variant: 'error' });
      return;
    }

    setLoadingType('welcome');
    try {
      playPaperUnwrap();
      const res = await authService.sendWelcomeEmail({
        email: emailToSend,
        username: user.username,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Welcome Package', email: emailToSend });
        enqueueSnackbar(`✉️ Welcome package dispatched to ${emailToSend}!`, {
          variant: 'success',
        });
        if (customEmail) setCustomEmail('');
      } else {
        enqueueSnackbar(res.data?.message || 'Could not send email', { variant: 'error' });
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
    const emailToSend = targetEmail || user.email;
    if (!emailToSend) {
      enqueueSnackbar('No email address provided', { variant: 'error' });
      return;
    }

    setLoadingType('login');
    try {
      playPaperUnwrap();
      const res = await authService.sendLoginAlert({
        email: emailToSend,
        username: user.username,
      });

      if (res.data?.success) {
        playRevealChime();
        setLastDispatched({ type: 'Session Alert', email: emailToSend });
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
    const emailToSend = targetEmail || user.email;
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
        setLastDispatched({ type: 'Password Recovery', email: emailToSend });
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
    navigator.clipboard?.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard!`, { variant: 'info', autoHideDuration: 2000 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FFFDFA] rounded-3xl border border-[#E8DED1] shadow-2xl overflow-hidden text-[#302A27] my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon with Pinterest/Editorial Aesthetics */}
        <div className="bg-gradient-to-r from-[#7B1826] via-[#8D263B] to-[#5C101B] px-6 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-amber-200 text-base shadow-2xs">
              ❦
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight leading-none">
                Ex-Libris Passport &amp; Literary Mailbox
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-200/80 mt-1">
                PageTurner Journal &bull; Issue No. 24 &bull; Dispatch Hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <PiXBold className="text-sm" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 pt-4 pb-2 bg-[#F7F3EC] border-b border-[#E8DED1] flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-[#EFE9DF] rounded-xl border border-[#DFD5C7]">
            <button
              type="button"
              onClick={() => {
                playPaperUnwrap();
                setActiveTab('passport');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'passport'
                  ? 'bg-white text-[#7B1826] shadow-2xs font-bold'
                  : 'text-[#695D53] hover:text-[#302A27]'
              }`}
            >
              <PiIdentificationCardBold className="text-sm" />
              <span>Reader Passport</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPaperUnwrap();
                setActiveTab('mailbox');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mailbox'
                  ? 'bg-white text-[#7B1826] shadow-2xs font-bold'
                  : 'text-[#695D53] hover:text-[#302A27]'
              }`}
            >
              <PiTrayBold className="text-sm" />
              <span>Literary Mailbox (3 Dispatches)</span>
            </button>
          </div>

          <span className="font-mono text-[11px] text-[#786C62] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SMTP Live: <strong>Gmail Cloud</strong></span>
          </span>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {activeTab === 'passport' ? (
            /* =================== TAB 1: OFFICIAL READER PASSPORT =================== */
            <div className="space-y-6 animate-fade-in">
              {/* Authentic Physical-Looking Reader Passport Card */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#FAF4EC] to-[#F1E5D5] border-2 border-dashed border-[#CBB499] p-5 sm:p-6 shadow-sm text-[#302A27] overflow-hidden">
                {/* Washi Tape Accent at Top Center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-4 bg-[#8D263B]/20 rounded-xs transform -rotate-1 border-x border-dashed border-white/60 pointer-events-none" />

                {/* Watermarked Ex Libris Stamp */}
                <div className="absolute -bottom-6 -right-6 text-[#7B1826]/10 text-9xl font-serif select-none pointer-events-none">
                  ❦
                </div>

                <div className="flex items-center justify-between border-b border-[#D6C3AA] pb-3 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#7B1826] flex items-center gap-1.5">
                    <PiShieldCheckFill className="text-xs" />
                    Verified Library Member
                  </span>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EADCCB] text-[#5A4535] border border-[#D5C3AF]">
                    {passportNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-serif">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#7A695A] block">
                      Reader Name:
                    </span>
                    <p className="font-bold text-sm sm:text-base text-[#1C140E] mt-0.5">
                      {user.username}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#7A695A] block">
                      Member Tier:
                    </span>
                    <p className="font-bold text-[#8D263B] mt-0.5">
                      {user.role === 'admin'
                        ? 'Curator & Chief Librarian'
                        : 'Verified Founding Reader'}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span className="font-mono text-[10px] uppercase text-[#7A695A] block">
                      Dispatch Address:
                    </span>
                    <p className="font-mono text-xs text-[#3D3128] mt-0.5 truncate">
                      {user.email || 'Not configured'}
                    </p>
                  </div>

                  <div className="col-span-2 border-t border-[#D6C3AA]/70 pt-2.5 text-[11px] text-[#695748] leading-relaxed">
                    <strong>Active Privileges:</strong> Unlimited Shelf Pins, Mystery Parcel Blind
                    Dates, Full CSV Catalog Export, Ambient Audio Companion, Instant Session Alerts.
                  </div>
                </div>
              </div>

              {/* Starter Pack Books Included in Your Package */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-serif text-sm font-bold text-[#302A27] flex items-center gap-1.5">
                    <PiBooksBold className="text-base text-[#8D263B]" />
                    <span>Starter Pack Books Included in Your Package</span>
                  </h4>
                  <span className="font-mono text-[10px] text-[#81766D] uppercase">
                    3 Curated Classics
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] text-left hover:border-[#8D263B]/30 transition-colors">
                    <span className="text-[9px] font-mono font-bold text-[#8D263B] uppercase block">
                      Gothic
                    </span>
                    <p className="font-serif font-bold text-xs text-[#302A27] mt-0.5 truncate">
                      Dorian Gray
                    </p>
                    <p className="text-[10px] text-[#81766D] italic">Oscar Wilde</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] text-left hover:border-[#8D263B]/30 transition-colors">
                    <span className="text-[9px] font-mono font-bold text-[#B26E2B] uppercase block">
                      Philosophy
                    </span>
                    <p className="font-serif font-bold text-xs text-[#302A27] mt-0.5 truncate">
                      The Alchemist
                    </p>
                    <p className="text-[10px] text-[#81766D] italic">Paulo Coelho</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] text-left hover:border-[#8D263B]/30 transition-colors">
                    <span className="text-[9px] font-mono font-bold text-[#4E6349] uppercase block">
                      Sci-Fi Epic
                    </span>
                    <p className="font-serif font-bold text-xs text-[#302A27] mt-0.5 truncate">
                      Dune
                    </p>
                    <p className="text-[10px] text-[#81766D] italic">Frank Herbert</p>
                  </div>
                </div>
              </div>

              {/* Passport Quick Actions */}
              <div className="pt-2 border-t border-[#E8DED1] space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(user.email)}
                    disabled={loadingType === 'welcome' || !user.email}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7B1826] via-[#8D263B] to-[#6E1421] text-white text-xs sm:text-[13px] font-semibold shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loadingType === 'welcome' ? (
                      <>
                        <PiSpinnerGapBold className="text-sm animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <PiEnvelopeSimpleBold className="text-base" />
                        <span>Send Welcome Package to My Inbox</span>
                      </>
                    )}
                  </button>

                  <a
                    href={welcomePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#F7F3EC] hover:bg-[#F2ECE1] text-[#302A27] text-xs font-semibold border border-[#E8DED1] transition-colors shadow-2xs"
                  >
                    <span>Live Preview</span>
                    <PiArrowSquareOutBold className="text-sm text-[#8D263B]" />
                  </a>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="text-[11px] font-mono text-[#81766D] hover:text-[#8D263B] hover:underline transition-colors cursor-pointer"
                  >
                    {showCustomInput
                      ? '▲ Hide custom email option'
                      : '▼ Send a copy to another email address'}
                  </button>
                </div>

                {showCustomInput && (
                  <div className="flex items-center gap-2 pt-1 animate-fade-in">
                    <input
                      type="email"
                      placeholder="Enter recipient email (e.g. friend@example.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#F7F3EC] border border-[#E8DED1] focus:outline-none focus:border-[#8D263B] text-[#302A27]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(customEmail)}
                      disabled={loadingType === 'welcome' || !customEmail.trim()}
                      className="px-4 py-2 rounded-xl bg-[#302A27] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <PiPaperPlaneTiltBold className="text-xs" />
                      <span>Send</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =================== TAB 2: LITERARY MAILBOX (PINTEREST PINBOARD) =================== */
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#302A27]">
                    The PageTurner Postal Archive
                  </h4>
                  <p className="text-xs text-[#786C62] font-serif italic mt-0.5">
                    Three handcrafted email templates styled with warm paper textures, serifs, and security seals.
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#8D263B] px-2.5 py-1 bg-[#8D263B]/10 rounded-full border border-[#8D263B]/20">
                  Gmail SMTP
                </span>
              </div>

              {/* Pinterest Pin Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* PIN 1: WELCOME PACKAGE */}
                <div className="group relative rounded-2xl bg-[#FFFDFA] border border-[#E8DED1] p-4.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                  {/* Washi Tape Accent */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#C99A48]/35 rounded-xs transform -rotate-1 border-x border-dashed border-white/60 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2.5 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#8D263B] tracking-wider bg-[#F9ECEB] px-2 py-0.5 rounded-full">
                        Letter No. 01
                      </span>
                      <span className="text-xs">📜</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#302A27] group-hover:text-[#8D263B] transition-colors">
                      Welcome &amp; Passport
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Librarian greeting, member ID badge, and 3 starter pack classics.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#F7F3EC] border border-[#EFE8DD] text-[10px] font-mono text-[#786C62]">
                      Trigger: <strong>New Account Sign-up</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE8DD] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendWelcomeEmail(user.email)}
                      disabled={loadingType === 'welcome'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {loadingType === 'welcome' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiPaperPlaneTiltBold className="text-xs" />
                      )}
                      <span>Dispatch Copy</span>
                    </button>

                    <a
                      href={welcomePreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-full bg-[#F7F3EC] hover:bg-[#EFE8DD] text-[#302A27] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DED1]"
                    >
                      <PiArrowSquareOutBold className="text-xs text-[#8D263B]" />
                      <span>Live Inspector</span>
                    </a>
                  </div>
                </div>

                {/* PIN 2: SESSION SECURITY LOGIN ALERT */}
                <div className="group relative rounded-2xl bg-[#FFFDFA] border border-[#E8DED1] p-4.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                  {/* Washi Tape Accent */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#4E6349]/35 rounded-xs transform rotate-1 border-x border-dashed border-white/60 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2.5 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#4E6349] tracking-wider bg-[#EDF3EC] px-2 py-0.5 rounded-full">
                        Letter No. 02
                      </span>
                      <span className="text-xs">🛡️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#302A27] group-hover:text-[#4E6349] transition-colors">
                      Session Login Alert
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Instant security receipt with device, origin IP, timestamp, and lock trigger.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#F7F3EC] border border-[#EFE8DD] text-[10px] font-mono text-[#786C62]">
                      Trigger: <strong>Every Session Login</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE8DD] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendLoginAlert(user.email)}
                      disabled={loadingType === 'login'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#354833] hover:bg-[#273625] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {loadingType === 'login' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiShieldCheckBold className="text-xs" />
                      )}
                      <span>Dispatch Alert</span>
                    </button>

                    <a
                      href={loginPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-full bg-[#F7F3EC] hover:bg-[#EFE8DD] text-[#302A27] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DED1]"
                    >
                      <PiArrowSquareOutBold className="text-xs text-[#4E6349]" />
                      <span>Live Inspector</span>
                    </a>
                  </div>
                </div>

                {/* PIN 3: CRYPTOGRAPHIC RESET PASSWORD */}
                <div className="group relative rounded-2xl bg-[#FFFDFA] border border-[#E8DED1] p-4.5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
                  {/* Washi Tape Accent */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#8D263B]/35 rounded-xs transform -rotate-2 border-x border-dashed border-white/60 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-2.5 mt-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-[#8D263B] tracking-wider bg-[#F9ECEB] px-2 py-0.5 rounded-full">
                        Letter No. 03
                      </span>
                      <span className="text-xs">🗝️</span>
                    </div>

                    <h5 className="font-serif font-bold text-sm text-[#302A27] group-hover:text-[#8D263B] transition-colors">
                      Password Reset Key
                    </h5>
                    <p className="text-[11px] text-[#695D53] font-serif italic mt-1 leading-relaxed">
                      Wax-sealed 60-minute cryptographic recovery token with instant access link.
                    </p>

                    <div className="mt-3 py-1.5 px-2 rounded-lg bg-[#F7F3EC] border border-[#EFE8DD] text-[10px] font-mono text-[#786C62]">
                      Trigger: <strong>Forgot Password Request</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EFE8DD] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSendPasswordReset(user.email)}
                      disabled={loadingType === 'reset'}
                      className="w-full py-1.5 px-3 rounded-full bg-[#7B1826] hover:bg-[#5C101B] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {loadingType === 'reset' ? (
                        <PiSpinnerGapBold className="text-xs animate-spin" />
                      ) : (
                        <PiKeyBold className="text-xs" />
                      )}
                      <span>Request Reset</span>
                    </button>

                    <a
                      href={resetPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-full bg-[#F7F3EC] hover:bg-[#EFE8DD] text-[#302A27] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E8DED1]"
                    >
                      <PiArrowSquareOutBold className="text-xs text-[#8D263B]" />
                      <span>Live Inspector</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Recipient Sandbox Quick-Dispatch Bar */}
              <div className="p-4 rounded-2xl bg-[#F7F3EC] border border-[#E8DED1] text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-[#786C62] block mb-2">
                  Dispatch Sandbox: Send Any Email to Arbitrary Recipient
                </span>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter any address (e.g. test@example.com)"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#E8DED1] focus:outline-none focus:border-[#8D263B] text-[#302A27]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendWelcomeEmail(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#302A27] border border-[#E8DED1] text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Welcome
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendLoginAlert(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#302A27] border border-[#E8DED1] text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendPasswordReset(customEmail)}
                    disabled={!customEmail.trim() || !!loadingType}
                    className="px-3.5 py-2 rounded-xl bg-[#8D263B] hover:bg-[#67202F] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Dispatched Banner */}
          {lastDispatched && (
            <p className="text-[11px] font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 text-center">
              <span className="flex items-center gap-1.5">
                <PiCheckBold className="text-xs text-emerald-600" />
                <span>
                  Dispatched <strong>{lastDispatched.type}</strong> to{' '}
                  <span className="underline">{lastDispatched.email}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setLastDispatched(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs cursor-pointer font-bold"
              >
                &times;
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReaderPassportModal;
