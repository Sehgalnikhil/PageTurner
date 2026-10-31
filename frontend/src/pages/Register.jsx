import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import {
  PiUserBold,
  PiEnvelopeBold,
  PiLockKeyBold,
  PiEyeBold,
  PiEyeSlashBold,
  PiBookOpenBold,
  PiUsersBold,
  PiFeatherBold,
  PiArrowRightBold,
  PiSparkleBold,
} from 'react-icons/pi';
import { playWaxSealCrack, playRevealChime } from '../utils/soundEffects';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Reader handle is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Handle must be at least 3 characters';
    }

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      playWaxSealCrack();
      const { data } = await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      playRevealChime();
      login(data);
      enqueueSnackbar(
        `Welcome to PageTurner, ${data.username}! Your Reader Passport has been activated ✉️`,
        {
          variant: 'success',
          autoHideDuration: 5000,
        }
      );
      navigate('/');
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Registration failed',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    enqueueSnackbar(`${provider} authentication dispatched for preview.`, { variant: 'info' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#302722] selection:bg-[#92283F]/15 relative overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Signup Composition matching Reference Image 2 */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center justify-center relative">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          
          {/* ============================================================
              1. LEFT: Ultra-High-Resolution Window Desk Still-Life
              ============================================================ */}
          <div className="hidden lg:block w-[300px] xl:w-[340px] 2xl:w-[350px] flex-shrink-0 self-stretch rounded-2xl overflow-hidden shadow-sm border border-[#E9DED0] bg-[#F0E9DE] relative group select-none">
            <img
              src="/images/signup-desk-scene-hd.jpg"
              alt="Cozy reading nook with candle, tea, stacked books, and open journal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* ============================================================
              2. MIDDLE: Editorial Value Propositions & Pinned Quote Note
              ============================================================ */}
          <div className="flex-1 max-w-xl lg:max-w-lg xl:max-w-xl flex flex-col justify-center">
            
            {/* Top Tag */}
            <div className="flex items-center gap-1.5 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#92283F] mb-2">
              <span className="text-[9px]">✦</span>
              <span>Join PageTurner</span>
            </div>

            {/* Editorial Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-normal text-[#302722] leading-[1.16] tracking-tight">
              A quieter corner for your{' '}
              <span className="italic text-[#92283F] font-normal">reading</span>{' '}
              life.
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-[13px] text-[#84766B] leading-relaxed max-w-md mt-3 font-normal">
              Curate your shelf, collect timeless{' '}
              <strong className="font-semibold text-[#302722]">stories</strong>, and record your
              reflections in a{' '}
              <strong className="font-semibold text-[#302722]">community</strong> that truly loves
              books.
            </p>

            {/* Three Feature Badges with Delicate Circular Peach Icon Treatment */}
            <div className="mt-6 sm:mt-7 space-y-4">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiBookOpenBold className="text-base" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#302722] leading-none">
                    Build your personal shelf
                  </h4>
                  <p className="text-[11.5px] text-[#84766B] mt-1 leading-normal">
                    Track, organise and cherish your reads.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiUsersBold className="text-base" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#302722] leading-none">
                    Join a community
                  </h4>
                  <p className="text-[11.5px] text-[#84766B] mt-1 leading-normal">
                    Discover readers with similar tastes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiFeatherBold className="text-base" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#302722] leading-none">
                    Capture your thoughts
                  </h4>
                  <p className="text-[11.5px] text-[#84766B] mt-1 leading-normal">
                    Save highlights, notes and reflections.
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned Parchment Quote Note from Reference */}
            <div className="mt-6 pt-2 select-none">
              <img
                src="/images/signup-pinned-note.png"
                alt="A reader lives a thousand lives before he dies - George R.R. Martin"
                className="w-44 sm:w-48 drop-shadow-sm rotate-[-1deg] transition-transform hover:rotate-0"
              />
            </div>
          </div>

          {/* ============================================================
              3. RIGHT: Layered Paper "Reader Passport" Card
              ============================================================ */}
          <div className="w-full sm:w-[420px] lg:w-[420px] xl:w-[440px] flex-shrink-0 relative">
            
            {/* Pinned Kraft Luggage Tag on top right corner */}
            <div className="absolute -top-3.5 -right-3 sm:-right-4 z-30 pointer-events-none drop-shadow-md select-none">
              <img
                src="/images/signup-kraft-tag.png"
                alt="New Reader Passport awaits"
                className="w-20 sm:w-[86px] h-auto transform rotate-[2deg]"
              />
            </div>

            {/* Layered stationery paper borders underneath for tactile depth */}
            <div className="absolute -inset-1.5 bg-[#F3ECE0] rounded-[22px] -rotate-[0.6deg] border border-[#E9DED0]/70 pointer-events-none z-0 shadow-xs" />
            <div className="absolute -inset-1 bg-[#FAF5EC] rounded-[20px] rotate-[0.4deg] border border-[#E9DED0]/90 pointer-events-none z-0" />

            {/* Main Interactive Form Card */}
            <div className="relative z-10 bg-[#FFFCF7] rounded-2xl border border-[#E9DED0] p-6 sm:p-7 shadow-[0_15px_40px_rgba(48,39,34,0.06)]">
              
              {/* Card Header with Delicate Star Emblem */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-1.5 text-[#92283F] mb-2">
                  <span className="text-[10px] text-[#C6A16B]">✦</span>
                  <PiBookOpenBold className="text-xl" />
                  <span className="text-[10px] text-[#C6A16B]">✦</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-[25px] font-normal text-[#302722] tracking-tight leading-tight">
                  Create Your Reader Passport
                </h2>
                <p className="text-xs text-[#84766B] mt-1 leading-normal">
                  Step into a world of stories, ideas and kindred readers.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-3.5">
                
                {/* 1. Reader Handle / Username */}
                <div>
                  <label className="block text-xs font-semibold text-[#302722] mb-1">
                    Reader Handle / Username
                  </label>
                  <div className="relative">
                    <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-sm pointer-events-none" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. bookish_soul"
                      autoComplete="username"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                  </div>
                  <p className="text-[10.5px] text-[#84766B] mt-1 leading-none">
                    This will be your unique identity in this community.
                  </p>
                  {errors.username && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.username}</p>
                  )}
                </div>

                {/* 2. Email Address */}
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
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.email}</p>
                  )}
                </div>

                {/* 3. Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#302722] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-sm pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10.5 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Passport...</span>
                    </span>
                  ) : (
                    <>
                      <PiSparkleBold className="text-xs text-[#C6A16B]" />
                      <span>Create Reader Passport</span>
                      <PiArrowRightBold className="text-xs ml-0.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Or continue with divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E9DED0]" />
                </div>
                <span className="relative px-3 bg-[#FFFCF7] text-[11px] text-[#84766B] font-normal">
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons (Google & Apple) */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialClick('Google')}
                  className="h-9.5 px-3 rounded-full border border-[#E9DED0] bg-[#FFFDF9] hover:bg-[#FAF5ED] text-xs font-medium text-[#302722] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-[11px] truncate">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick('Apple')}
                  className="h-9.5 px-3 rounded-full border border-[#E9DED0] bg-[#FFFDF9] hover:bg-[#FAF5ED] text-xs font-medium text-[#302722] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.78 1.06-1.85.95-2.93-.93.04-2.09.62-2.75 1.4-.58.67-1.09 1.76-.95 2.81 1.04.08 2.12-.51 2.75-1.28z" />
                  </svg>
                  <span className="text-[11px] truncate">Continue with Apple</span>
                </button>
              </div>

              {/* Already have an account? Sign in */}
              <div className="mt-4 text-center text-xs text-[#84766B]">
                <span>Already have an account? </span>
                <Link to="/login" className="font-semibold text-[#92283F] hover:text-[#702338] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. FAR RIGHT: Vertical Book Spines Shelf Edge (Desktop Only)
              ============================================================ */}
          <div className="hidden 2xl:block w-14 xl:w-16 self-stretch rounded-r-2xl overflow-hidden shadow-sm border-y border-r border-[#E9DED0] bg-[#F0E9DE] flex-shrink-0 select-none">
            <img
              src="/images/signup-right-spines.jpg"
              alt="Vertical bookshelf collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};

export default Register;
