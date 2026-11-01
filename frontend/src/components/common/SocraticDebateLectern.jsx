import React, { useState, useEffect, useContext } from 'react';
import {
  PiQuotesBold,
  PiScalesBold,
  PiFeatherBold,
  PiCheckBold,
  PiSpinnerGapBold,
  PiCaretUpBold,
} from 'react-icons/pi';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../../context/AuthContext';
import { communityService } from '../../services/api';
import {
  playWaxSealCrack,
  playPaperUnwrap,
  playRevealChime,
} from '../../utils/soundEffects';

const SocraticDebateLectern = () => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSide, setSelectedSide] = useState(null);
  const [argumentText, setArgumentText] = useState('');
  const [argumentStance, setArgumentStance] = useState('thesis');
  const [showInscribeForm, setShowInscribeForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserIdentifier =
    user?.email || user?.username || 'nikhilsehgal1806@gmail.com';
  const currentUserName = user?.username || 'Curator Admin';
  const currentUserAvatar = user?.avatar || '/images/eleanor-avatar.jpg';

  const fetchDebate = async () => {
    try {
      setLoading(true);
      const res = await communityService.getDebate();
      if (res.data) {
        setDebate(res.data);
        if (res.data.thesisVotes?.includes(currentUserIdentifier)) {
          setSelectedSide('thesis');
        } else if (res.data.antithesisVotes?.includes(currentUserIdentifier)) {
          setSelectedSide('antithesis');
        }
      }
    } catch (err) {
      console.warn('Failed to load Socratic debate:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebate();
  }, []);

  // Handle vote casting with wax seal
  const handleVote = async (side) => {
    playWaxSealCrack();
    setSelectedSide(side);
    try {
      const res = await communityService.voteDebate(side, currentUserIdentifier);
      if (res.data?.success) {
        setDebate((prev) => ({
          ...prev,
          thesisVotes: res.data.thesisVotes,
          antithesisVotes: res.data.antithesisVotes,
        }));
        playRevealChime();
        enqueueSnackbar(
          `Wax seal stamped for ${side === 'thesis' ? 'Thesis' : 'Antithesis'}!`,
          { variant: 'success' }
        );
      }
    } catch (err) {
      console.error('Vote failed:', err);
      enqueueSnackbar('Could not cast vote. Please verify connection.', {
        variant: 'error',
      });
    }
  };

  // Submit scholarly argument to MongoDB
  const handleSubmitArgument = async (e) => {
    e.preventDefault();
    if (!argumentText.trim()) return;

    setSubmitting(true);
    playPaperUnwrap();

    try {
      const payload = {
        author: currentUserName,
        authorHandle: currentUserName.toLowerCase().replace(/\s+/g, '_'),
        authorAvatar: currentUserAvatar,
        stance: argumentStance,
        text: argumentText.trim(),
      };

      const res = await communityService.addDebateArgument(payload);
      if (res.data?.success) {
        playWaxSealCrack();
        playRevealChime();
        setDebate(res.data.debate);
        setArgumentText('');
        setShowInscribeForm(false);
        enqueueSnackbar('Your argument has been inscribed into the Socratic Lectern! 📜', {
          variant: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to submit debate argument:', err);
      enqueueSnackbar('Could not post argument.', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-[#FAF5EB] border-2 border-[#D8C7B0] text-center text-[#7A6A5E] flex flex-col items-center gap-2">
        <PiSpinnerGapBold className="text-2xl animate-spin text-[#7D2235]" />
        <span className="font-serif italic text-xs">
          Convening the Weekly Socratic Lectern...
        </span>
      </div>
    );
  }

  if (!debate) return null;

  const totalVotes =
    (debate.thesisVotes?.length || 0) + (debate.antithesisVotes?.length || 0);
  const thesisPercent =
    totalVotes > 0
      ? Math.round(((debate.thesisVotes?.length || 0) / totalVotes) * 100)
      : 50;
  const antithesisPercent = 100 - thesisPercent;

  const thesisArgs = (debate.arguments || []).filter((a) => a.stance === 'thesis');
  const antithesisArgs = (debate.arguments || []).filter(
    (a) => a.stance === 'antithesis'
  );

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#FAF5EB] border-2 border-[#D8C7B0] shadow-sm text-left animate-fade-in relative overflow-hidden">
      {/* Decorative Stamp Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5D7C2] gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-[#7D2235] text-[#F7D8A4] flex items-center justify-center text-sm shadow-xs font-serif">
            ⚖
          </span>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#7D2235] font-bold block">
              Active Weekly Socratic Debate &bull; Lectern Inquiry
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2F2620]">
              {debate.topic}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playPaperUnwrap();
            setShowInscribeForm((prev) => !prev);
          }}
          className="px-4 py-2 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cute-press cursor-pointer self-start sm:self-auto"
        >
          <PiFeatherBold className="text-sm" />
          <span>Inscribe Argument</span>
        </button>
      </div>

      {/* Motion & Classical Context */}
      <div className="my-5 p-4.5 rounded-2xl bg-[#F0E6D5] border border-[#DECDB8]">
        <span className="text-[10.5px] uppercase font-mono tracking-wider text-[#7A6A5E] font-semibold block mb-1">
          {debate.book} &bull; Motion for Discourse
        </span>
        <blockquote className="font-serif italic text-sm sm:text-base text-[#2F2620] leading-relaxed">
          “{debate.motion}”
        </blockquote>
        {debate.context && (
          <p className="text-xs text-[#695D53] font-serif mt-2 border-t border-[#DECDB8] pt-2">
            <em>Archival Context:</em> {debate.context}
          </p>
        )}
      </div>

      {/* Live Seal Voting Tally Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-serif font-bold">
          <span className="text-[#7D2235]">
            {debate.thesisLabel} ({debate.thesisVotes?.length || 0} Seals &bull;{' '}
            {thesisPercent}%)
          </span>
          <span className="text-[#4A3728]">
            {debate.antithesisLabel} ({debate.antithesisVotes?.length || 0} Seals &bull;{' '}
            {antithesisPercent}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#DECDB8] overflow-hidden flex">
          <div
            className="h-full bg-[#7D2235] transition-all duration-700"
            style={{ width: `${thesisPercent}%` }}
          />
          <div
            className="h-full bg-[#4A3728] transition-all duration-700"
            style={{ width: `${antithesisPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleVote('thesis')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSide === 'thesis'
                ? 'bg-[#7D2235] text-white shadow-xs'
                : 'border border-[#7D2235] text-[#7D2235] hover:bg-[#7D2235]/10'
            }`}
          >
            <span>❦</span>
            <span>Vote Thesis (Burgundy Seal)</span>
          </button>

          <button
            type="button"
            onClick={() => handleVote('antithesis')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              selectedSide === 'antithesis'
                ? 'bg-[#4A3728] text-white shadow-xs'
                : 'border border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728]/10'
            }`}
          >
            <span>✒</span>
            <span>Vote Antithesis (Sepia Seal)</span>
          </button>
        </div>
      </div>

      {/* Inscribe Argument Drawer Form */}
      {showInscribeForm && (
        <form
          onSubmit={handleSubmitArgument}
          className="mb-6 p-5 rounded-2xl bg-[#FFFDF9] border-2 border-[#7D2235]/30 shadow-md space-y-3 animate-drawer-spring"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-[#2F2620] flex items-center gap-2">
              <PiFeatherBold className="text-[#7D2235]" />
              <span>Inscribe Scholarly Counterpoint</span>
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1 cursor-pointer font-serif">
                <input
                  type="radio"
                  name="stance"
                  value="thesis"
                  checked={argumentStance === 'thesis'}
                  onChange={() => setArgumentStance('thesis')}
                />
                <span className="text-[#7D2235] font-semibold">Support Thesis</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer font-serif ml-3">
                <input
                  type="radio"
                  name="stance"
                  value="antithesis"
                  checked={argumentStance === 'antithesis'}
                  onChange={() => setArgumentStance('antithesis')}
                />
                <span className="text-[#4A3728] font-semibold">Support Antithesis</span>
              </label>
            </div>
          </div>

          <textarea
            rows={3}
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value)}
            placeholder="Articulate your textual evidence and philosophical grounding..."
            className="w-full p-3.5 rounded-xl border border-[#D8C7B0] bg-[#FAF5EB] text-xs font-serif text-[#2F2620] focus:outline-none focus:ring-1 focus:ring-[#7D2235]"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowInscribeForm(false)}
              className="px-3 py-1.5 rounded-full border border-[#D8C7B0] text-xs text-[#7A6A5E] hover:bg-black/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Inscribing...' : 'Publish to Lectern 📜'}
            </button>
          </div>
        </form>
      )}

      {/* Dual Column Discourse Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Left Column: Thesis Arguments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5D7C2]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7D2235]" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#7D2235]">
              Thesis Inscriptions ({thesisArgs.length})
            </h4>
          </div>

          {thesisArgs.map((arg, idx) => (
            <div
              key={arg._id || idx}
              className="p-4 rounded-xl bg-[#FFFDF9] border border-[#DECDB8] shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={arg.authorAvatar || '/images/eleanor-avatar.jpg'}
                    alt={arg.author}
                    className="w-5 h-5 rounded-full object-cover border border-[#D5C2AC]"
                  />
                  <span className="font-serif font-bold text-[#2F2620]">
                    {arg.author}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#8C7A6D]">
                  @{arg.authorHandle}
                </span>
              </div>
              <p className="font-serif italic text-xs leading-relaxed text-[#40342C]">
                “{arg.text}”
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Antithesis Arguments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5D7C2]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A3728]" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#4A3728]">
              Antithesis Inscriptions ({antithesisArgs.length})
            </h4>
          </div>

          {antithesisArgs.map((arg, idx) => (
            <div
              key={arg._id || idx}
              className="p-4 rounded-xl bg-[#FFFDF9] border border-[#DECDB8] shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={arg.authorAvatar || '/images/arthur-avatar.jpg'}
                    alt={arg.author}
                    className="w-5 h-5 rounded-full object-cover border border-[#D5C2AC]"
                  />
                  <span className="font-serif font-bold text-[#2F2620]">
                    {arg.author}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#8C7A6D]">
                  @{arg.authorHandle}
                </span>
              </div>
              <p className="font-serif italic text-xs leading-relaxed text-[#40342C]">
                “{arg.text}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocraticDebateLectern;
