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

  const previewUrl = `${API_BASE_URL}/auth/email/reset-preview?email=${encodeURIComponent(email || 'reader@example.com')}`;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-10">
        <div className="w-full max-w-md editorial-sheet p-8 sm:p-10 bg-white border border-[#E8DED2] shadow-xl rounded-3xl relative overflow-hidden">
          {/* Subtle Decorative Washi Tape Bar */}
          <div className="w-24 h-3.5 bg-[#C99A48]/30 mx-auto -mt-6 mb-6 rounded-xs transform -rotate-1 border-x-2 border-dashed border-white/60 pointer-events-none" />

          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#861D2D] to-[#5C101B] text-amber-200 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <PiKeyBold className="text-2xl" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292522]">
                  Recover Your Key
                </h1>
                <p className="text-xs sm:text-sm text-[#827870] font-serif italic mt-1.5 leading-relaxed">
                  Enter your email address and we&apos;ll send an official dispatch to unlock your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#786C62] mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827870] text-sm pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="your.email@example.com"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] focus:outline-none focus:border-[#861D2D] focus:ring-1 focus:ring-[#861D2D] shadow-2xs transition-colors"
                    />
                  </div>
                  {error && <p className="text-[11px] text-[#861D2D] font-medium mt-1.5">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#7B1826] via-[#861D2D] to-[#6E1421] text-white text-xs sm:text-sm font-semibold shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <PiSpinnerGapBold className="text-base animate-spin" />
                      <span>Dispatching Link...</span>
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="text-sm" />
                      <span>Send Password Reset Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-5 border-t border-[#E8DED2] flex items-center justify-between text-xs">
                <Link
                  to="/login"
                  className="font-medium text-[#786C62] hover:text-[#861D2D] flex items-center gap-1.5 transition-colors"
                >
                  <PiArrowLeftBold className="text-xs" />
                  <span>Back to Sign In</span>
                </Link>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[#861D2D] hover:underline flex items-center gap-1"
                >
                  <span>Preview Email</span>
                  <PiArrowSquareOutBold className="text-[11px]" />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-2 animate-fade-in space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <PiCheckCircleFill className="text-3xl" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold text-[#292522]">
                  Dispatch Sent
                </h2>
                <p className="text-xs sm:text-sm text-[#786C62] font-serif italic mt-2 leading-relaxed max-w-xs mx-auto">
                  We&apos;ve sent a password reset link to <strong className="text-[#292522] not-italic">{email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DED2] text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#7B1826] font-mono text-[10px] uppercase font-bold tracking-wider">
                  <span>⏱️ Time-Sensitive Link</span>
                </div>
                <p className="text-[#5A4F45] font-serif text-xs leading-relaxed">
                  Your reset link remains active for <strong>60 minutes</strong>. Click the button inside the email to choose a fresh password.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#292522] text-xs font-semibold border border-[#E8DED2] transition-colors shadow-2xs"
                >
                  <PiArrowSquareOutBold className="text-sm text-[#861D2D]" />
                  <span>Open Live Email Preview (Test Mode)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#827870] hover:text-[#861D2D] hover:underline transition-colors block mx-auto"
                >
                  Didn&apos;t receive it? Send to another email
                </button>
              </div>

              <div className="pt-4 border-t border-[#E8DED2]">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-[#861D2D] hover:underline flex items-center justify-center gap-1.5"
                >
                  <PiArrowLeftBold className="text-xs" />
                  <span>Return to Sign In</span>
                </Link>
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

