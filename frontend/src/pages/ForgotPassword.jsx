import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PiEnvelopeBold,
  PiKeyBold,
  PiArrowLeftBold,
  PiPaperPlaneTiltBold,
  PiSpinnerGapBold,
  PiCheckCircleFill,
  PiArrowSquareOutBold,
  PiSparkleBold,
} from 'react-icons/pi';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import { authService, API_BASE_URL } from '../services/api';
import { useSnackbar } from 'notistack';
import { playPaperUnwrap, playRevealChime } from '../utils/soundEffects';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      playPaperUnwrap();
      const res = await authService.forgotPassword(email.trim());
      playRevealChime();
      setSubmitted(true);
      enqueueSnackbar(res.data?.message || 'Password reset link sent to your email!', {
        variant: 'success',
      });
    } catch (err) {
      setError(err.customMessage || err.response?.data?.message || 'Could not send reset email');
      enqueueSnackbar('Could not send reset email', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = `${API_BASE_URL}/auth/email/reset-preview?email=${encodeURIComponent(
    email || 'reader@example.com'
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27] selection:bg-[#8D263B]/15">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 my-6">
        <div className="w-full max-w-lg bg-[#FFFDFA] border border-[#E8DED1] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(48,42,39,0.07)] p-8 sm:p-10 relative overflow-hidden transition-all">
          
          {/* Top Delicate Sub-tag */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8DED1]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#81766D] hover:text-[#8D263B] transition-colors"
            >
              <PiArrowLeftBold className="text-xs" />
              <span>Back to Sign In</span>
            </Link>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#81766D]">
              <PiSparkleBold className="text-[#C6A16B] text-xs" />
              <span>Key Recovery</span>
            </span>
          </div>

          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/20 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <PiKeyBold className="text-xl" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#302A27] tracking-tight">
                  Recover Your Key
                </h1>
                <p className="font-serif italic text-xs sm:text-[13px] text-[#81766D] mt-1.5 leading-relaxed max-w-sm mx-auto">
                  Enter your email address and we&apos;ll send an archival dispatch to restore access to your shelf.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                    Archival Email Address
                  </label>
                  <div className="relative">
                    <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="reader@literarysanctuary.org"
                      autoFocus
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                    />
                  </div>
                  {error && <p className="text-[11px] text-[#8D263B] font-medium mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <PiSpinnerGapBold className="text-base animate-spin" />
                      <span>Dispatching Link...</span>
                    </span>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="text-xs text-[#C6A16B]" />
                      <span>Send Recovery Dispatch</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-5 border-t border-[#E8DED1] flex items-center justify-between text-xs text-[#81766D]">
                <span>Check your spam folder if delayed</span>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10.5px] text-[#8D263B] hover:underline flex items-center gap-1"
                >
                  <span>Preview Email</span>
                  <PiArrowSquareOutBold className="text-xs" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-2 space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#879783]/15 text-[#879783] border border-[#879783]/30 flex items-center justify-center mx-auto shadow-2xs">
                <PiCheckCircleFill className="text-2xl" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-medium text-[#302A27]">
                  Dispatch Dispatched
                </h2>
                <p className="font-serif italic text-xs sm:text-[13px] text-[#81766D] mt-2 leading-relaxed max-w-xs mx-auto">
                  We&apos;ve sent an official password recovery dispatch to{' '}
                  <strong className="text-[#302A27] not-italic">{email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8DED1] text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#8D263B] font-mono text-[10px] uppercase font-semibold tracking-wider">
                  <span>⏱️ Time-Sensitive Token</span>
                </div>
                <p className="text-[#675C54] font-serif text-xs leading-relaxed">
                  The link remains valid for 60 minutes. Click the link in the message to set your new passphrase.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-9 px-4 rounded-full border border-[#E8DED1] bg-[#FFFDFA] hover:bg-[#F7F3EC] text-xs font-medium text-[#302A27] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Email Simulator</span>
                  <PiArrowSquareOutBold className="text-xs text-[#81766D]" />
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-medium text-[#8D263B] hover:underline"
                >
                  Send to different address
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
