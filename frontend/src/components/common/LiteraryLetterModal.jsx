import React, { useState, useEffect, useContext } from 'react';
import {
  PiEnvelopeBold,
  PiXBold,
  PiPaperPlaneTiltBold,
  PiUserBold,
  PiSealBold,
  PiCheckBold,
  PiBookOpenBold,
  PiSpinnerGapBold,
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { communityService, authService } from '../../services/api';
import {
  playPaperUnwrap,
  playWaxSealCrack,
  playRevealChime,
} from '../../utils/soundEffects';

const WAX_SEALS = [
  { id: 'burgundy', name: 'Archival Burgundy', color: '#7D2235', emblem: '❦' },
  { id: 'sepia', name: 'Victorian Sepia', color: '#4A3728', emblem: '✒' },
  { id: 'prussian', name: 'Prussian Blue', color: '#1B2E3D', emblem: '⚜' },
  { id: 'forest', name: 'Antique Forest', color: '#1E3A2B', emblem: '📜' },
];

const LiteraryLetterModal = ({
  isOpen,
  onClose,
  initialRecipient = null,
  initialSubject = '',
}) => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'compose'
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readingLetter, setReadingLetter] = useState(null);

  // Compose State
  const [readers, setReaders] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [subject, setSubject] = useState(initialSubject || '');
  const [body, setBody] = useState('');
  const [selectedSeal, setSelectedSeal] = useState(WAX_SEALS[0]);
  const [sending, setSending] = useState(false);

  const currentUserEmail = user?.email || 'nikhilsehgal1806@gmail.com';
  const currentUserName = user?.username || 'Curator Admin';
  const currentUserAvatar = user?.avatar || '/images/eleanor-avatar.jpg';

  // Load real letters and readers from MongoDB
  const fetchLetters = async () => {
    try {
      setLoading(true);
      const res = await communityService.getLetters(currentUserEmail);
      if (res.data) {
        setLetters(res.data);
      }
    } catch (err) {
      console.warn('Failed to load letters:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReaders = async () => {
    try {
      const res = await authService.getRealUsers();
      if (res.data) {
        const filtered = res.data.filter(
          (u) => u.email && u.email !== currentUserEmail
        );
        setReaders(filtered);
        if (initialRecipient) {
          setSelectedRecipient(initialRecipient);
        } else if (filtered.length > 0 && !selectedRecipient) {
          setSelectedRecipient(filtered[0].email);
        }
      }
    } catch (err) {
      console.warn('Failed to load readers for letter dispatch:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLetters();
      fetchReaders();
      if (initialRecipient) {
        setSelectedRecipient(initialRecipient);
        setActiveTab('compose');
      }
      if (initialSubject) {
        setSubject(initialSubject);
      }
    }
  }, [isOpen, initialRecipient, initialSubject]);

  if (!isOpen) return null;

  // Open & read letter (break seal)
  const handleOpenLetter = async (letter) => {
    playWaxSealCrack();
    setReadingLetter(letter);
    if (!letter.opened) {
      try {
        await communityService.openLetter(letter._id || letter.id);
        setLetters((prev) =>
          prev.map((l) =>
            l._id === letter._id ? { ...l, opened: true, openedAt: new Date() } : l
          )
        );
      } catch (err) {
        console.warn('Letter open sync note:', err);
      }
    }
  };

  // Dispatch real letter to MongoDB
  const handleSendLetter = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      enqueueSnackbar('Letter parchment cannot be blank.', { variant: 'warning' });
      return;
    }

    const recipientObj =
      readers.find((r) => r.email === selectedRecipient) || {
        username: 'Kindred Reader',
        email: selectedRecipient,
      };

    setSending(true);
    playPaperUnwrap();

    try {
      const payload = {
        senderName: currentUserName,
        senderHandle: currentUserName.toLowerCase().replace(/\s+/g, '_'),
        senderAvatar: currentUserAvatar,
        senderEmail: currentUserEmail,
        recipientName: recipientObj.username || 'Kindred Reader',
        recipientEmail: recipientObj.email || selectedRecipient,
        subject: subject.trim() || 'A Dispatched Inscription from Kindred Hands',
        body: body.trim(),
        waxSealColor: selectedSeal.color,
        waxSealEmblem: selectedSeal.emblem,
      };

      const res = await communityService.sendLetter(payload);
      playWaxSealCrack();
      playRevealChime();

      enqueueSnackbar(
        `✉️ Sealed with ${selectedSeal.name} and dispatched to ${recipientObj.username}!`,
        { variant: 'success' }
      );

      // Add to local letters list
      if (res.data) {
        setLetters((prev) => [res.data, ...prev]);
      }

      setBody('');
      setSubject('');
      setActiveTab('inbox');
    } catch (err) {
      console.error('Failed to dispatch letter:', err);
      enqueueSnackbar('Could not dispatch letter. Please verify connection.', {
        variant: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in text-[#2F2620]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF5EB] rounded-3xl border-2 border-[#D8C7B0] shadow-[0_30px_90px_rgba(20,15,10,0.7)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-[#F2E7D5] border-b border-[#DECDB8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#7D2235] text-[#F7D8A4] flex items-center justify-center text-sm shadow-xs font-serif">
              ❦
            </span>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2F2620] leading-snug">
                Poste Restante &bull; Literary Mailbox
              </h3>
              <p className="text-[11px] text-[#7A6A5E] font-serif italic">
                Exchange intimate wax-sealed letters with real registered readers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#7A6A5E] hover:text-[#2F2620] transition-colors cursor-pointer"
          >
            <PiXBold className="text-base" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-[#FAF5EB] border-b border-[#EADCC7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playPaperUnwrap();
                setActiveTab('inbox');
                setReadingLetter(null);
              }}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inbox' && !readingLetter
                  ? 'bg-[#7D2235] text-white shadow-xs'
                  : 'bg-[#EAE0CF] text-[#695D53] hover:text-[#2F2620]'
              }`}
            >
              <PiEnvelopeBold />
              <span>Received Letters ({letters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPaperUnwrap();
                setActiveTab('compose');
                setReadingLetter(null);
              }}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compose'
                  ? 'bg-[#7D2235] text-white shadow-xs'
                  : 'bg-[#EAE0CF] text-[#695D53] hover:text-[#2F2620]'
              }`}
            >
              <PiPaperPlaneTiltBold />
              <span>Inscribe New Letter</span>
            </button>
          </div>

          <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 hidden sm:inline">
            ● Database Synced
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-left">
          {/* VIEW: READING AN OPENED LETTER */}
          {readingLetter ? (
            <div className="animate-fade-in space-y-4">
              <button
                type="button"
                onClick={() => setReadingLetter(null)}
                className="text-xs font-mono text-[#7D2235] hover:underline flex items-center gap-1 cursor-pointer mb-2"
              >
                ← Back to Letters List
              </button>

              <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] shadow-sm relative overflow-hidden">
                <div
                  className="absolute -top-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-serif shadow-md border-2 border-white/60 pointer-events-none"
                  style={{ backgroundColor: readingLetter.waxSealColor || '#7D2235' }}
                >
                  {readingLetter.waxSealEmblem || '❦'}
                </div>

                <div className="flex items-center gap-3 pb-3 border-b border-[#EFE5D5]">
                  <img
                    src={readingLetter.senderAvatar || '/images/eleanor-avatar.jpg'}
                    alt={readingLetter.senderName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#D9C4A6]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2F2620]">
                      From: {readingLetter.senderName}
                    </h4>
                    <span className="text-[11px] text-[#7A6A5E] font-mono block">
                      @{readingLetter.senderHandle} &bull; To:{' '}
                      {readingLetter.recipientName}
                    </span>
                  </div>
                </div>

                <h5 className="font-serif font-bold text-base text-[#7D2235] mt-4 mb-2">
                  {readingLetter.subject}
                </h5>

                <div className="font-serif text-sm leading-relaxed text-[#3B2F27] whitespace-pre-line py-2 border-l-2 border-[#D9C4A6] pl-4 italic">
                  {readingLetter.body}
                </div>

                <div className="mt-6 pt-3 border-t border-[#EFE5D5] flex items-center justify-between text-[11px] text-[#7A6A5E] font-mono">
                  <span>
                    Dispatched:{' '}
                    {new Date(readingLetter.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRecipient(readingLetter.senderEmail);
                      setSubject(`Re: ${readingLetter.subject}`);
                      setActiveTab('compose');
                      setReadingLetter(null);
                    }}
                    className="px-3 py-1 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cursor-pointer"
                  >
                    Reply in Ink →
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'inbox' ? (
            /* VIEW: INBOX LETTERS LIST */
            <div className="space-y-3">
              {loading ? (
                <div className="py-12 text-center text-[#7A6A5E] flex flex-col items-center gap-2">
                  <PiSpinnerGapBold className="text-2xl animate-spin text-[#7D2235]" />
                  <span className="font-serif italic text-xs">
                    Retrieving dispatches from sanctuary vaults...
                  </span>
                </div>
              ) : letters.length === 0 ? (
                <div className="py-12 text-center text-[#7A6A5E] space-y-2">
                  <span className="text-3xl">📭</span>
                  <p className="font-serif italic text-sm">
                    No letters in your sanctuary box yet.
                  </p>
                  <p className="text-xs text-[#7A6A5E]/80">
                    Inscribe a letter to an affinity reader to begin an epistolary friendship!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('compose')}
                    className="mt-3 px-4 py-2 rounded-full bg-[#7D2235] text-white text-xs font-semibold cursor-pointer"
                  >
                    Inscribe First Letter
                  </button>
                </div>
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter._id || letter.id}
                    onClick={() => handleOpenLetter(letter)}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] hover:border-[#7D2235]/60 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Wax Seal Medallion */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-serif shadow-sm border border-white/50 group-hover:scale-105 transition-transform flex-shrink-0"
                        style={{ backgroundColor: letter.waxSealColor || '#7D2235' }}
                        title="Click to break wax seal"
                      >
                        {letter.waxSealEmblem || '❦'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif font-bold text-sm text-[#2F2620] group-hover:text-[#7D2235] transition-colors">
                            {letter.subject}
                          </h5>
                          {!letter.opened && (
                            <span className="px-2 py-0.5 rounded-full bg-[#7D2235] text-white font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
                              Sealed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A6A5E] font-serif italic truncate max-w-sm mt-0.5">
                          From: <strong>{letter.senderName}</strong> &bull;{' '}
                          {letter.body}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-[10px] text-[#8C7A6D] block">
                        {new Date(letter.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7D2235] group-hover:underline">
                        Break Seal & Read →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* VIEW: COMPOSE NEW LETTER */
            <form onSubmit={handleSendLetter} className="space-y-4 animate-fade-in">
              {/* Recipient Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#695D53] mb-1.5">
                  Address to Kindred Reader
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif text-[#2F2620] focus:outline-none focus:ring-1 focus:ring-[#7D2235]"
                >
                  {readers.map((r) => (
                    <option key={r.email} value={r.email}>
                      {r.username} ({r.email}) &bull;{' '}
                      {r.role === 'admin' ? 'Curator' : 'Reader'}
                    </option>
                  ))}
                  <option value="eleanor@pageturner.io">
                    Eleanor Vance (eleanor@pageturner.io) &bull; Archival Host
                  </option>
                  <option value="arthur@pageturner.io">
                    Arthur Pendelton (arthur@pageturner.io) &bull; Scribe
                  </option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#695D53] mb-1.5">
                  Subject / Inscription Title
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Thoughts on Dorian Gray's Studio Scene"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif text-[#2F2620] focus:outline-none focus:ring-1 focus:ring-[#7D2235]"
                />
              </div>

              {/* Letter Parchment Textarea */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#695D53] mb-1.5">
                  Letter Parchment Inscription
                </label>
                <textarea
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Inscribe your reflection, recommendation, or philosophical inquiry to a kindred soul..."
                  className="w-full p-4 rounded-2xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs sm:text-sm font-serif italic text-[#2F2620] focus:outline-none focus:ring-1 focus:ring-[#7D2235] leading-relaxed shadow-inner"
                />
              </div>

              {/* Wax Seal Selector */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#695D53] mb-2">
                  Select Wax Seal & Insignia
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {WAX_SEALS.map((seal) => (
                    <button
                      key={seal.id}
                      type="button"
                      onClick={() => {
                        playWaxSealCrack();
                        setSelectedSeal(seal);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-left ${
                        selectedSeal.id === seal.id
                          ? 'border-[#7D2235] bg-[#F2E7D5] shadow-xs'
                          : 'border-[#DECDB8] bg-[#FFFDF9] hover:bg-[#F8EFE4]'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-serif shadow-xs flex-shrink-0"
                        style={{ backgroundColor: seal.color }}
                      >
                        {seal.emblem}
                      </div>
                      <span className="text-[11px] font-semibold text-[#2F2620] truncate">
                        {seal.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dispatch Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-md cute-press cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <PiSpinnerGapBold className="text-sm animate-spin" />
                      <span>Applying Hot Wax & Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="text-sm" />
                      <span>Seal with {selectedSeal.name} & Dispatch Letter 🕯️</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiteraryLetterModal;
