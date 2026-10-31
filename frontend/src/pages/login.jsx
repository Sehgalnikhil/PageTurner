import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiEnvelopeBold,
  PiLockKeyBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiArrowRightBold,
  PiShieldCheckBold,
  PiUserBold,
  PiCrownBold,
  PiBooksBold,
  PiUsersBold,
  PiFeatherBold,
} from 'react-icons/pi';
import { playWaxSealCrack, playRevealChime, playPageFlipSound } from '../utils/soundEffects';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useContext(AuthContext);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errs.email = 'Please provide a valid email';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 5) {
      errs.password = 'Password must be at least 5 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      playWaxSealCrack();
      const { data } = await authService.login({ email: email.trim(), password });
      playRevealChime();
      login(data);
      enqueueSnackbar(`Welcome back to your sanctuary, ${data.username}! ✉️`, {
        variant: 'success',
        autoHideDuration: 4000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Invalid reader credentials',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = async (demoEmail, demoPassword, roleName) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setLoading(true);
    playPageFlipSound();
    try {
      playWaxSealCrack();
      const { data } = await authService.login({ email: demoEmail, password: demoPassword });
      playRevealChime();
      login(data);
      enqueueSnackbar(`Signed in as ${roleName} (${data.username})! Welcome back ✦`, {
        variant: 'success',
        autoHideDuration: 4000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Demo access failed',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#302722] selection:bg-[#92283F]/15 relative overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Login Arena matching Reference Image 1 with ZERO overlapping elements */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center relative animate-fade-in">
        
        {/* 3. The Central Split Floating Sanctuary Card (804 x 504 proportion) */}
        <div className="w-full max-w-[940px] bg-[#FFFCF7] rounded-[26px] sm:rounded-[30px] border border-[#E9DED0] shadow-[0_20px_50px_rgba(48,39,34,0.08)] overflow-hidden flex flex-col md:flex-row relative z-10 animate-card-entrance gpu-accelerated transition-all duration-300">
          
          {/* ============================================================
              LEFT PANEL: Ultra-High-Resolution Literary Reading Nook
              With True Native Vector Typography (Retina Crisp)
              ============================================================ */}
          <div className="w-full md:w-[48%] lg:w-[49%] relative min-h-[380px] sm:min-h-[460px] md:min-h-[530px] bg-[#2A231E] overflow-hidden flex flex-col justify-between p-6 sm:p-7 select-none">
            {/* Ultra-High-Resolution Photography Asset (896x1200) */}
            <img
              src="/images/login-reading-nook-hd.jpg"
              alt="Cozy library reading chair, sunlit window, hardcovers, and Marcus Tullius Cicero quote"
              className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-[1.015]"
            />

            {/* Subtle atmospheric gradient overlay for magazine-grade contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 pointer-events-none" />

            {/* Top Emblem & Brand Signature */}
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/95 text-[#92283F] flex items-center justify-center shadow-md">
                <PiBooksBold className="text-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-semibold tracking-tight text-white/95 leading-none">
                  PageTurner
                </span>
                <span className="font-serif italic text-[10.5px] text-[#DDB7B0] leading-none mt-0.5">
                  A quieter sanctuary...
                </span>
              </div>
            </div>

            {/* Middle Feature Quote in Cormorant Garamond */}
            <div className="relative z-10 my-auto py-6 sm:py-8 max-w-[320px]">
              <blockquote className="font-serif text-2xl sm:text-[27px] font-normal text-[#FFFDF9] leading-[1.28] tracking-tight drop-shadow-sm">
                “A room without books is like a body without a soul.”
              </blockquote>
              <cite className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#DDB7B0] mt-3 not-italic">
                — Marcus Tullius Cicero
              </cite>
            </div>

            {/* Bottom 3 Benefits Bar + Pagination Indicators */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-end justify-between gap-3">
              <div className="grid grid-cols-3 gap-2 flex-1 text-[10.5px] leading-tight text-white/90">
                <div className="flex flex-col gap-1">
                  <PiBooksBold className="text-sm text-[#C6A16B]" />
                  <span className="font-light text-white/85">Sync across all your shelves</span>
                </div>
                <div className="flex flex-col gap-1">
                  <PiUsersBold className="text-sm text-[#C6A16B]" />
                  <span className="font-light text-white/85">Curated communities</span>
                </div>
                <div className="flex flex-col gap-1">
                  <PiFeatherBold className="text-sm text-[#C6A16B]" />
                  <span className="font-light text-white/85">Save your marginalia</span>
                </div>
              </div>

              {/* Slider Pagination Dots */}
              <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT PANEL: Paper White Literary Authentication Panel
              ============================================================ */}
          <div className="w-full md:w-[52%] lg:w-[51%] bg-[#FFFCF7] p-6 sm:p-7 lg:p-8 flex flex-col justify-between relative">
            
            <div>
              {/* Top Row: Navigation Tabs + Transparent Postmark Stamp */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E9DED0]/60">
                
                {/* Tabs */}
                <div className="flex items-center gap-6 text-xs sm:text-[13px] font-medium">
                  <span className="text-[#92283F] font-semibold pb-1 border-b-2 border-[#92283F] cursor-default">
                    Sign In
                  </span>
                  <Link
                    to="/register"
                    className="text-[#84766B] hover:text-[#302722] pb-1 transition-colors"
                  >
                    Create Passport
                  </Link>
                </div>

                {/* Circular Reader Passport Postmark Stamp from Reference */}
                <div className="flex-shrink-0 select-none opacity-85 hover:opacity-100 transition-opacity animate-cute-bounce">
                  <img
                    src="/images/login-passport-stamp-clean.png"
                    alt="Reader Passport Stamp"
                    className="h-8 sm:h-9 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Subheading / Tag */}
              <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.22em] text-[#92283F] mb-1">
                Welcome Back
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-2xl sm:text-[28px] font-normal text-[#302722] leading-tight tracking-tight">
                Step into your sanctuary.
              </h1>

              {/* Description */}
              <p className="text-xs text-[#84766B] mt-1 leading-relaxed font-normal">
                Enter your credentials to reopen your shelf, private notes, and favorite literary worlds.
              </p>

              {/* Quick 1-Click Demo Login Station */}
              <div className="mt-3.5 p-2 rounded-xl bg-[#FAF5ED] border border-[#E9DED0]/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-[10.5px] font-medium text-[#84766B] flex items-center gap-1">
                  <span>✦ 1-Click Demo:</span>
                </span>
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fillAndLogin('student@pageturner.io', 'student123', 'Demo Reader')}
                    disabled={loading}
                    className="flex-1 sm:flex-none h-7 px-2.5 rounded-lg border border-[#E9DED0] bg-[#FFFCF7] hover:bg-white text-[11px] font-medium text-[#302722] hover:text-[#92283F] hover:border-[#92283F]/40 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs cute-press group/demobtn"
                    title="Sign in with Reader demo account"
                  >
                    <PiUserBold className="text-xs text-[#8B9B84] group-hover/demobtn:scale-125 transition-transform" />
                    <span>Demo Reader</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillAndLogin('admin@pageturner.io', 'admin123', 'Curator Admin')}
                    disabled={loading}
                    className="flex-1 sm:flex-none h-7 px-2.5 rounded-lg border border-[#E9DED0] bg-[#FFFCF7] hover:bg-white text-[11px] font-medium text-[#302722] hover:text-[#92283F] hover:border-[#92283F]/40 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs cute-press group/adminbtn"
                    title="Sign in with Curator Admin account"
                  >
                    <PiCrownBold className="text-xs text-[#C6A16B] group-hover/adminbtn:rotate-12 group-hover/adminbtn:scale-125 transition-transform" />
                    <span>Curator Admin</span>
                  </button>
                </div>
              </div>

              {/* The Sign In Form */}
              <form onSubmit={handleLogin} className="mt-3.5 space-y-3">
                
                {/* 1. Email Address Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#302722] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-sm pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.email}</p>
                  )}
                </div>

                {/* 2. Password Field with Forgot Password Link */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#302722]">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-medium text-[#92283F] hover:text-[#702338] italic hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-sm pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#84766B] hover:text-[#302722] p-1 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <PiEyeSlashBold className="text-sm" />
                      ) : (
                        <PiEyeBold className="text-sm" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.password}</p>
                  )}
                </div>

                {/* 3. Primary Sign In CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-12.5 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-[13.5px] sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(146,40,63,0.22)] hover:shadow-[0_6px_22px_rgba(146,40,63,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-5 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Reopening Sanctuary Vault...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to PageTurner</span>
                      <PiArrowRightBold className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom New User Link */}
              <div className="mt-5 text-center text-xs text-[#84766B]">
                <span>New to PageTurner? </span>
                <Link
                  to="/register"
                  className="font-semibold text-[#92283F] hover:text-[#702338] hover:underline"
                >
                  Create your Reader Passport →
                </Link>
              </div>
            </div>

            {/* Subtle Security Reassurance at bottom */}
            <div className="mt-4 pt-2.5 border-t border-[#E9DED0]/60 flex items-center justify-center gap-1.5 text-[10px] text-[#84766B]/80 text-center">
              <PiShieldCheckBold className="text-xs text-[#8B9B84] flex-shrink-0" />
              <span>Protected by archival session hashing &amp; TLS encryption.</span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
};

export default Login;
