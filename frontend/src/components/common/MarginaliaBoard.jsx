import React, { useState, useEffect, useContext } from 'react';
import {
  PiNotePencilBold,
  PiFeatherBold,
  PiQuotesBold,
  PiHeartBold,
  PiSparkleBold,
  PiPaperPlaneTiltBold,
  PiSpinnerGapBold,
  PiXBold,
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { communityService } from '../../services/api';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playRevealChime,
} from '../../utils/soundEffects';

const MarginaliaBoard = ({ onOpenLetterModal = null }) => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [marginaliaList, setMarginaliaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInscribeModal, setShowInscribeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [bookTitle, setBookTitle] = useState('The Picture of Dorian Gray');
  const [bookAuthor, setBookAuthor] = useState('Oscar Wilde');
  const [chapter, setChapter] = useState('Chapter IV');
  const [quote, setQuote] = useState('');
  const [annotation, setAnnotation] = useState('');

  const currentUserIdentifier =
    user?.email || user?.username || 'nikhilsehgal1806@gmail.com';
  const currentUserName = user?.username || 'Curator Admin';
  const currentUserAvatar = user?.avatar || '/images/eleanor-avatar.jpg';

  const fetchMarginalia = async () => {
    try {
      setLoading(true);
      const res = await communityService.getMarginalia();
      if (res.data) {
        setMarginaliaList(res.data);
      }
    } catch (err) {
      console.warn('Could not load marginalia:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarginalia();
  }, []);

  // Handle wax reaction toggle
  const handleReact = async (id, reactionType) => {
    playWaxSealCrack();
    try {
      const res = await communityService.reactMarginalia(
        id,
        reactionType,
        currentUserIdentifier
      );
      if (res.data?.success) {
        setMarginaliaList((prev) =>
          prev.map((item) =>
            (item._id || item.id) === id
              ? { ...item, waxReactions: res.data.waxReactions }
              : item
          )
        );
        playRevealChime();
        enqueueSnackbar(
          `Stamped ${reactionType.toUpperCase()} seal on this annotation! 🕯️`,
          { variant: 'info', autoHideDuration: 2000 }
        );
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  // Submit new marginalia annotation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim() || !annotation.trim()) {
      enqueueSnackbar('Please provide both quote and margin reflection.', {
        variant: 'warning',
      });
      return;
    }

    setSubmitting(true);
    playPaperUnwrap();

    try {
      const payload = {
        bookTitle: bookTitle.trim(),
        bookAuthor: bookAuthor.trim(),
        chapter: chapter.trim(),
        quote: quote.trim(),
        annotation: annotation.trim(),
        author: currentUserName,
        authorHandle: currentUserName.toLowerCase().replace(/\s+/g, '_'),
        authorAvatar: currentUserAvatar,
        authorEmail: currentUserIdentifier,
        parlourSlug: 'gothic',
      };

      const res = await communityService.createMarginalia(payload);
      if (res.data) {
        playWaxSealCrack();
        playRevealChime();
        setMarginaliaList((prev) => [res.data, ...prev]);
        setQuote('');
        setAnnotation('');
        setShowInscribeModal(false);
        enqueueSnackbar(
          '✨ Margin note inscribed into canonical archives (+15 XP)! 📜',
          { variant: 'success' }
        );
      }
    } catch (err) {
      console.error('Failed to create marginalia:', err);
      enqueueSnackbar('Could not save marginalia inscription.', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="p-6 rounded-3xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold block">
            The Living Scriptorium &bull; Real Textual Notes
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2F2620]">
            Marginalia & Inscription Exchange
          </h3>
          <p className="text-xs text-[#7A6A5E] font-serif italic mt-0.5">
            Real margin notes, underlines, and reflections left in classical volumes by kindred minds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playPaperUnwrap();
            setShowInscribeModal(true);
          }}
          className="px-5 py-2.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-xs cute-press cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <PiNotePencilBold className="text-sm" />
          <span>Inscribe Margin Note</span>
        </button>
      </div>

      {/* Grid of Marginalia Cards */}
      {loading ? (
        <div className="py-12 text-center text-[#7A6A5E] flex flex-col items-center gap-2">
          <PiSpinnerGapBold className="text-2xl animate-spin text-[#7D2235]" />
          <span className="font-serif italic text-xs">
            Retrieving marginalia folios from sanctuary shelves...
          </span>
        </div>
      ) : marginaliaList.length === 0 ? (
        <div className="p-12 text-center text-[#7A6A5E] bg-[#FAF5EB] rounded-2xl border border-[#D8C7B0]">
          <span className="text-3xl">📜</span>
          <p className="font-serif italic text-sm mt-2">
            No margin notes inscribed yet.
          </p>
          <button
            type="button"
            onClick={() => setShowInscribeModal(true)}
            className="mt-3 px-4 py-2 rounded-full bg-[#7D2235] text-white text-xs font-semibold cursor-pointer"
          >
            Be the First Scribe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {marginaliaList.map((item) => {
            const hasProfound = item.waxReactions?.profound?.includes(
              currentUserIdentifier
            );
            const hasPoetic = item.waxReactions?.poetic?.includes(
              currentUserIdentifier
            );
            const hasProvocative = item.waxReactions?.provocative?.includes(
              currentUserIdentifier
            );

            return (
              <div
                key={item._id || item.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] shadow-xs hover:border-[#7D2235]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
              >
                <div>
                  {/* Volume Reference */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#EFE5D5]">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold">
                      {item.bookTitle} &bull; {item.chapter}
                    </span>
                    <span className="text-[10px] text-[#8C7A6D] font-mono">
                      {item.bookAuthor}
                    </span>
                  </div>

                  {/* Underlined Excerpt */}
                  <blockquote className="font-serif italic text-sm sm:text-base text-[#2F2620] leading-relaxed my-3 pl-3 border-l-2 border-[#7D2235]">
                    {item.quote}
                  </blockquote>

                  {/* Handwritten Margin Note Box */}
                  <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#D8C7B0] text-xs font-serif text-[#40342C] leading-relaxed shadow-inner">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={item.authorAvatar || '/images/eleanor-avatar.jpg'}
                        alt={item.author}
                        className="w-5 h-5 rounded-full object-cover border border-[#D5C2AC]"
                      />
                      <span className="font-bold text-[#2F2620]">
                        {item.author}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C7A6D]">
                        @{item.authorHandle}
                      </span>
                    </div>
                    <p className="italic">{item.annotation}</p>
                  </div>
                </div>

                {/* Wax Reactions & Actions */}
                <div className="pt-2 border-t border-[#EFE5D5] flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Profound Seal */}
                    <button
                      type="button"
                      onClick={() =>
                        handleReact(item._id || item.id, 'profound')
                      }
                      title="Stamp Profound Seal"
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        hasProfound
                          ? 'bg-[#7D2235] text-white shadow-xs'
                          : 'bg-[#F2E7D5] text-[#695D53] hover:bg-[#EAE0CF]'
                      }`}
                    >
                      <span>🍷</span>
                      <span>Profound</span>
                      <span>({item.waxReactions?.profound?.length || 0})</span>
                    </button>

                    {/* Poetic Seal */}
                    <button
                      type="button"
                      onClick={() =>
                        handleReact(item._id || item.id, 'poetic')
                      }
                      title="Stamp Poetic Seal"
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        hasPoetic
                          ? 'bg-[#4A3728] text-white shadow-xs'
                          : 'bg-[#F2E7D5] text-[#695D53] hover:bg-[#EAE0CF]'
                      }`}
                    >
                      <span>✒️</span>
                      <span>Poetic</span>
                      <span>({item.waxReactions?.poetic?.length || 0})</span>
                    </button>

                    {/* Provocative Seal */}
                    <button
                      type="button"
                      onClick={() =>
                        handleReact(item._id || item.id, 'provocative')
                      }
                      title="Stamp Provocative Seal"
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        hasProvocative
                          ? 'bg-[#8C6D37] text-white shadow-xs'
                          : 'bg-[#F2E7D5] text-[#695D53] hover:bg-[#EAE0CF]'
                      }`}
                    >
                      <span>🕯️</span>
                      <span>Provocative</span>
                      <span>({item.waxReactions?.provocative?.length || 0})</span>
                    </button>
                  </div>

                  {onOpenLetterModal && item.authorEmail && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenLetterModal(
                          item.authorEmail,
                          `Regarding your note on ${item.bookTitle}`
                        )
                      }
                      className="text-[11px] font-mono text-[#7D2235] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <PiPaperPlaneTiltBold />
                      <span>Dispatch Letter</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inscribe Margin Note Modal */}
      {showInscribeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in text-[#2F2620]"
          onClick={() => setShowInscribeModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF5EB] rounded-3xl border-2 border-[#D8C7B0] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DECDB8]">
              <h4 className="font-serif font-bold text-base text-[#2F2620] flex items-center gap-2">
                <PiNotePencilBold className="text-[#7D2235]" />
                <span>Inscribe Canonical Marginalia</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowInscribeModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#7A6A5E] cursor-pointer"
              >
                <PiXBold className="text-base" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#7A6A5E] mb-1">
                    Book Title
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-[#7A6A5E] mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#7A6A5E] mb-1">
                  Chapter / Canticle Reference
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Chapter IV: The Studio of Basil Hallward"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#7A6A5E] mb-1">
                  Underlined Passage / Quote Excerpt
                </label>
                <textarea
                  rows={2}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="“Paste the excerpt that struck your soul...”"
                  required
                  className="w-full p-3 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif italic"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-[#7A6A5E] mb-1">
                  Your Margin Annotation & Textual Reflection
                </label>
                <textarea
                  rows={3}
                  value={annotation}
                  onChange={(e) => setAnnotation(e.target.value)}
                  placeholder="Inscribe your critique, philosophical dissection, or poignant observation..."
                  required
                  className="w-full p-3 rounded-xl border border-[#D8C7B0] bg-[#FFFDF9] text-xs font-serif"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInscribeModal(false)}
                  className="px-4 py-2 rounded-full border border-[#D8C7B0] text-xs text-[#7A6A5E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Inscribing in Ink...' : 'Publish Margin Note 📜'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarginaliaBoard;

