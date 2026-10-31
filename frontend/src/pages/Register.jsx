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

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#302722] selection:bg-[#92283F]/15 relative overflow-x-hidden">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Signup Composition with Enhanced Proportions */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center relative animate-fade-in">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 xl:gap-12">
          
          {/* ============================================================
              1. LEFT: Ultra-High-Resolution Window Desk Still-Life
              ============================================================ */}
          <div className="hidden lg:block w-[320px] xl:w-[360px] 2xl:w-[390px] flex-shrink-0 self-stretch rounded-[24px] overflow-hidden shadow-[0_15px_35px_rgba(48,39,34,0.08)] border border-[#E9DED0] bg-[#F0E9DE] relative group select-none gpu-accelerated">
            <img
              src="/images/signup-desk-scene-hd.jpg"
              alt="Cozy reading nook with candle, tea, stacked books, and open journal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              loading="eager"
              decoding="async"
            />
            {/* Subtle atmospheric vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* ============================================================
              2. MIDDLE: Editorial Value Propositions & Pinned Quote Note
              ============================================================ */}
          <div className="flex-1 max-w-xl lg:max-w-lg xl:max-w-xl flex flex-col justify-center">
            
            {/* Top Tag */}
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#92283F] mb-2.5">
              <span className="text-[10px]">✦</span>
              <span>Join PageTurner</span>
            </div>

            {/* Editorial Heading with Prominent Serif Hierarchy */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-normal text-[#302722] leading-[1.14] tracking-tight">
              A quieter corner for your{' '}
              <span className="italic text-[#92283F] font-normal">reading</span>{' '}
              life.
            </h1>

            {/* Subtitle Description */}
            <p className="text-[13.5px] sm:text-sm text-[#84766B] leading-relaxed max-w-lg mt-3.5 font-normal">
              Curate your shelf, collect timeless{' '}
              <strong className="font-semibold text-[#302722]">stories</strong>, and record your
              reflections in a{' '}
              <strong className="font-semibold text-[#302722]">community</strong> that truly loves
              books.
            </p>

            {/* Three Feature Badges with Generous Circular Peach Icon Treatments */}
            <div className="mt-7 sm:mt-8 space-y-4.5 sm:space-y-5">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4 group">
                <div className="w-10.5 h-10.5 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiBookOpenBold className="text-lg" />
                </div>
                <div>
                  <h4 className="text-[13.5px] sm:text-sm font-semibold text-[#302722] leading-snug">
                    Build your personal shelf
                  </h4>
                  <p className="text-xs text-[#84766B] mt-0.5 leading-normal">
                    Track, organise and cherish your reads.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 group">
                <div className="w-10.5 h-10.5 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiUsersBold className="text-lg" />
                </div>
                <div>
                  <h4 className="text-[13.5px] sm:text-sm font-semibold text-[#302722] leading-snug">
                    Join a community
                  </h4>
                  <p className="text-xs text-[#84766B] mt-0.5 leading-normal">
                    Discover readers with similar tastes.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 group">
                <div className="w-10.5 h-10.5 rounded-full bg-[#F7ECE9] text-[#92283F] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  <PiFeatherBold className="text-lg" />
                </div>
                <div>
                  <h4 className="text-[13.5px] sm:text-sm font-semibold text-[#302722] leading-snug">
                    Capture your thoughts
                  </h4>
                  <p className="text-xs text-[#84766B] mt-0.5 leading-normal">
                    Save highlights, notes and reflections.
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned Parchment Quote Note from Reference */}
            <div className="mt-7 sm:mt-8 pt-2 select-none">
              <img
                src="/images/signup-pinned-note.png"
                alt="A reader lives a thousand lives before he dies - George R.R. Martin"
                className="w-48 sm:w-52 drop-shadow-sm rotate-[-1deg] transition-transform hover:rotate-0"
              />
            </div>
          </div>

          {/* ============================================================
              3. RIGHT: Layered Paper "Reader Passport" Card
              ============================================================ */}
          <div className="w-full sm:w-[430px] lg:w-[430px] xl:w-[460px] flex-shrink-0 relative animate-card-entrance gpu-accelerated">
            
            {/* Pinned Transparent Kraft Luggage Tag (Hangs cleanly over corner with gentle ambient float) */}
            <div className="absolute -top-5 -right-3 sm:-right-4 z-20 pointer-events-none drop-shadow-md select-none animate-tag-sway">
              <img
                src="/images/signup-kraft-tag-transparent.png"
                alt="New Reader Passport awaits"
                className="w-20 sm:w-[88px] h-auto transform rotate-[3deg]"
              />
            </div>

            {/* Layered stationery paper borders underneath for tactile depth */}
            <div className="absolute -inset-1.5 bg-[#F3ECE0] rounded-[24px] -rotate-[0.6deg] border border-[#E9DED0]/70 pointer-events-none z-0 shadow-xs" />
            <div className="absolute -inset-1 bg-[#FAF5EC] rounded-[22px] rotate-[0.4deg] border border-[#E9DED0]/90 pointer-events-none z-0" />

            {/* Main Interactive Form Card */}
            <div className="relative z-10 bg-[#FFFCF7] rounded-[24px] border border-[#E9DED0] p-7 sm:p-8 shadow-[0_20px_50px_rgba(48,39,34,0.07)]">
              
              {/* Card Header with Delicate Star Emblem */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1.5 text-[#92283F] mb-2">
                  <span className="text-xs text-[#C6A16B]">✦</span>
                  <PiBookOpenBold className="text-2xl" />
                  <span className="text-xs text-[#C6A16B]">✦</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-[27px] font-normal text-[#302722] tracking-tight leading-tight">
                  Create Your Reader Passport
                </h2>
                <p className="text-xs sm:text-[12.5px] text-[#84766B] mt-1.5 leading-normal">
                  Step into a world of stories, ideas and kindred readers.
                </p>
              </div>

              {/* Form with Enhanced Spacing & Input Heights */}
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* 1. Reader Handle / Username */}
                <div>
                  <label className="block text-xs sm:text-[12.5px] font-semibold text-[#302722] mb-1.5">
                    Reader Handle / Username
                  </label>
                  <div className="relative">
                    <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-base pointer-events-none" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. bookish_soul"
                      autoComplete="username"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                  </div>
                  <p className="text-[11px] text-[#84766B] mt-1.5 leading-none">
                    This will be your unique identity in this community.
                  </p>
                  {errors.username && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.username}</p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div>
                  <label className="block text-xs sm:text-[12.5px] font-semibold text-[#302722] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-base pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.email}</p>
                  )}
                </div>

                {/* 3. Password */}
                <div>
                  <label className="block text-xs sm:text-[12.5px] font-semibold text-[#302722] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#84766B] text-base pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E9DED0] bg-[#FFFDF9] text-xs sm:text-[13px] text-[#302722] placeholder:text-[#84766B]/50 focus:outline-none focus:border-[#92283F] focus:ring-1 focus:ring-[#92283F] transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#84766B] hover:text-[#302722] p-1 transition-colors cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <PiEyeSlashBold className="text-base" />
                      ) : (
                        <PiEyeBold className="text-base" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-[#92283F] font-medium mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button with Enhanced Dimensions & Lift */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-12.5 rounded-full bg-[#92283F] hover:bg-[#702338] text-white text-[13.5px] sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(146,40,63,0.22)] hover:shadow-[0_6px_22px_rgba(146,40,63,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-5 group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Passport...</span>
                    </span>
                  ) : (
                    <>
                      <PiSparkleBold className="text-sm text-[#C6A16B]" />
                      <span>Create Reader Passport</span>
                      <PiArrowRightBold className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account? Sign in */}
              <div className="mt-5 text-center text-xs sm:text-[12.5px] text-[#84766B]">
                <span>Already have an account? </span>
                <Link to="/login" className="font-semibold text-[#92283F] hover:text-[#702338] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};

export default Register;
