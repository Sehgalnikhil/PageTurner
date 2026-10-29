import React, { useState, useEffect } from 'react';
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
    if (pwd.length < 5) return { score: 1, text: 'Too short (min 5 chars)', color: 'bg-rose-500' };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
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
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-10">
        <div className="w-full max-w-md editorial-sheet p-8 sm:p-10 bg-white border border-[#E8DED2] shadow-xl rounded-3xl relative overflow-hidden">
          {/* Decorative Washi Tape Bar */}
          <div className="w-24 h-3.5 bg-[#861D2D]/20 mx-auto -mt-6 mb-6 rounded-xs transform rotate-1 border-x-2 border-dashed border-white/60 pointer-events-none" />

          {!token ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <PiWarningCircleBold className="text-2xl" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#292522]">
                Missing Reset Token
              </h2>
              <p className="text-xs sm:text-sm text-[#827870] font-serif italic leading-relaxed">
                The password reset link appears incomplete or missing the required token.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block px-5 py-2.5 rounded-full bg-[#861D2D] text-white text-xs font-semibold shadow-xs hover:bg-[#701826] transition-colors"
              >
                Request a New Reset Link
              </Link>
            </div>
          ) : !success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B1826] to-[#5C101B] text-amber-200 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <PiLockKeyBold className="text-2xl" />
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292522]">
                  Choose New Key
                </h1>
                <p className="text-xs sm:text-sm text-[#827870] font-serif italic mt-1.5 leading-relaxed">
                  Enter your new password below to restore access to your private reading shelf.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#786C62] mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 5 characters"
                      autoFocus
                      className="w-full pl-4 pr-11 py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] focus:outline-none focus:border-[#861D2D] focus:ring-1 focus:ring-[#861D2D] shadow-2xs transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#827870] hover:text-[#292522] p-1"
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
                            strength.score >= 1 ? strength.color : 'bg-stone-200'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 2 ? strength.color : 'bg-stone-200'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 3 ? strength.color : 'bg-stone-200'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strength.score >= 4 ? strength.color : 'bg-stone-200'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#827870]">
                        Strength: <strong>{strength.text}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#786C62] mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DED2] text-[#292522] focus:outline-none focus:border-[#861D2D] focus:ring-1 focus:ring-[#861D2D] shadow-2xs transition-colors"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#7B1826] via-[#861D2D] to-[#6E1421] text-white text-xs sm:text-sm font-semibold shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <PiSpinnerGapBold className="text-base animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <PiLockKeyOpenBold className="text-sm" />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <PiCheckCircleFill className="text-3xl" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#292522]">
                Key Updated
              </h2>
              <p className="text-xs sm:text-sm text-[#786C62] font-serif italic leading-relaxed max-w-xs mx-auto">
                Your password has been changed successfully. Redirecting you to sign in...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#861D2D] text-white text-xs font-semibold shadow-xs hover:bg-[#701826] transition-colors"
                >
                  <span>Sign In Now</span>
                  <PiArrowRightBold className="text-xs" />
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

export default ResetPassword;

