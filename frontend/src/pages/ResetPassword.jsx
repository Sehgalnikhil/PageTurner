import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  PiLockKeyBold,
  PiLockKeyOpenBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiCheckCircleFill,
  PiWarningCircleBold,
  PiSpinnerGapBold,
  PiArrowRightBold,
  PiSparkleBold,
} from 'react-icons/pi';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import { authService } from '../services/api';
import { useSnackbar } from 'notistack';
import { playRevealChime, playWaxSealCrack } from '../utils/soundEffects';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Evaluate password strength
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-stone-200' };
    if (pwd.length < 5) return { score: 1, text: 'Too short (min 5 chars)', color: 'bg-rose-400' };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-[#C6A16B]' };
    return { score: 4, text: 'Strong & secure', color: 'bg-[#879783]' };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Password reset token is missing from URL.');
      return;
    }
    if (newPassword.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      playWaxSealCrack();
      const res = await authService.resetPassword({ token, newPassword });
      playRevealChime();
      setSuccess(true);
      enqueueSnackbar(res.data?.message || 'Password successfully updated!', {
        variant: 'success',
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.customMessage ||
          err.response?.data?.message ||
          'Reset link is invalid or expired. Please request a new link.'
      );
      enqueueSnackbar('Could not update password', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27] selection:bg-[#8D263B]/15">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 my-6">
        <div className="w-full max-w-lg bg-[#FFFDFA] border border-[#E8DED1] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(48,42,39,0.07)] p-8 sm:p-10 relative overflow-hidden transition-all">
          
          {/* Top Decorative Indicator */}
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#E8DED1]">
            <Link
              to="/login"
              className="text-xs font-medium text-[#81766D] hover:text-[#8D263B] transition-colors"
            >
              &larr; Back to Sign In
            </Link>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#81766D]">
              <PiSparkleBold className="text-[#C6A16B] text-xs" />
              <span>Passphrase Inscription</span>
            </span>
          </div>

          {!token ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
                <PiWarningCircleBold className="text-2xl" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#302A27]">
                Missing Reset Token
              </h2>
              <p className="text-xs sm:text-[13px] text-[#81766D] font-serif italic leading-relaxed">
                The password reset link appears incomplete or missing the required cryptographic token.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block px-5 py-2.5 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium shadow-xs transition-colors"
              >
                Request New Recovery Dispatch
              </Link>
            </div>
          ) : !success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-[#8D263B]/10 text-[#8D263B] border border-[#8D263B]/20 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <PiLockKeyBold className="text-xl" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#302A27] tracking-tight">
                  Choose New Key
                </h1>
                <p className="font-serif italic text-xs sm:text-[13px] text-[#81766D] mt-1.5 leading-relaxed">
                  Inscribe your new passphrase below to restore access to your private reading shelf.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4.5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                    New Passphrase
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 5 characters"
                      autoFocus
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81766D] hover:text-[#302A27] p-1 cursor-pointer"
                    >
                      {showPassword ? <PiEyeSlashBold className="text-sm" /> : <PiEyeBold className="text-sm" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1">
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 1 ? strength.color : 'bg-[#E8DED1]'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 2 ? strength.color : 'bg-[#E8DED1]'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 3 ? strength.color : 'bg-[#E8DED1]'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 4 ? strength.color : 'bg-[#E8DED1]'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#81766D] block">
                        Strength: {strength.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                    Confirm Passphrase
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat passphrase"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                  />
                </div>

                {error && <p className="text-[11px] text-[#8D263B] font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <PiSpinnerGapBold className="text-base animate-spin" />
                      <span>Updating Key...</span>
                    </span>
                  ) : (
                    <>
                      <span>Inscribe New Password</span>
                      <PiArrowRightBold className="text-xs text-[#C6A16B]" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#879783]/15 text-[#879783] border border-[#879783]/30 flex items-center justify-center mx-auto shadow-2xs">
                <PiCheckCircleFill className="text-2xl" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#302A27]">
                Key Updated Successfully
              </h2>
              <p className="text-xs sm:text-[13px] text-[#81766D] font-serif italic leading-relaxed">
                Your passphrase has been updated in the sanctuary ledger. Redirecting you to sign in...
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2 rounded-full bg-[#8D263B] text-white text-xs font-medium shadow-xs"
              >
                Sign In Immediately &rarr;
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
