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
  PiSparkleBold,
  PiBookOpenBold,
  PiCrownBold,
  PiShieldCheckBold,
  PiUserBold,
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
    if (!email) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
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
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      playWaxSealCrack();
      const { data } = await authService.login({ email, password });
      playRevealChime();
      login(data);
      enqueueSnackbar(`Welcome back to the library, ${data.username}! ✉️`, {
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

  const fillAndLogin = async (demoEmail, demoPassword) => {
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
      enqueueSnackbar(`Signed in as ${data.username}! Session security email dispatched. ✉️`, {
        variant: 'success',
        autoHideDuration: 4000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(
        error.customMessage || error.response?.data?.message || 'Login failed',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27] selection:bg-[#8D263B]/15">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 my-2 sm:my-6">
        <div className="w-full max-w-4xl lg:max-w-5xl bg-[#FFFDFA] border border-[#E8DED1] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(48,42,39,0.07)] overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all">
          
          {/* LEFT: Curated Literary Atmosphere (5 cols) */}
          <div className="relative hidden md:flex md:col-span-5 flex-col justify-between p-8 lg:p-10 bg-[#F0E9DE] border-r border-[#E8DED1] overflow-hidden">
            {/* Atmospheric Background Artwork */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <img
                src="/images/editorial/moodboard_reading_nook.jpg"
                alt="Cozy library reading nook in natural light"
                className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#67202F]/92 via-[#67202F]/50 to-[#67202F]/20" />
            </div>

            {/* Top Brand & Edition Tag */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFFDFA] text-[#8D263B] flex items-center justify-center shadow-xs">
                  <PiBookOpenBold className="text-base" />
                </div>
                <span className="font-serif text-lg font-medium text-[#FFFDFA] tracking-tight">
                  PageTurner
                </span>
              </div>

              <div className="px-2.5 py-0.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-xs text-[9px] font-mono uppercase tracking-[0.15em] text-[#E8DED1]">
                Sanctuary Pass
              </div>
            </div>

            {/* Center: Curated Reading Quote */}
            <div className="relative z-10 my-auto py-8 text-[#FFFDFA] space-y-4">
              <span className="text-[9.5px] font-sans font-medium uppercase tracking-[0.16em] text-[#C6A16B] block">
                The Literary Sanctuary
              </span>
              <blockquote className="font-serif text-xl lg:text-2xl italic leading-snug text-[#FAF5ED]">
                &ldquo;A room without books is like a body without a soul.&rdquo;
              </blockquote>
              <p className="text-[11px] text-[#E8DED1] font-mono tracking-wide">
                &mdash; Marcus Tullius Cicero
              </p>
            </div>

            {/* Bottom: Archival Perks */}
            <div className="relative z-10 text-[#FFFDFA] pt-4 border-t border-white/15">
              <ul className="space-y-2 text-xs text-[#FAF5ED]/85">
                <li className="flex items-center gap-2">
                  <span className="text-[#C6A16B]">✦</span>
                  <span>Sync across all reading shelves seamlessly</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#C6A16B]">✦</span>
                  <span>Curator ambient audioscapes &amp; notes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Sign In Stationery Desk (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FFFDFA]">
            
            {/* Top Switcher Tabs (Sign In / Register) */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8DED1]">
              <div className="flex items-center gap-6 text-xs font-medium">
                <span className="text-[#8D263B] font-semibold py-1 relative after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#8D263B] after:rounded-full">
                  Sign In
                </span>
                <Link
                  to="/register"
                  className="text-[#81766D] hover:text-[#8D263B] transition-colors py-1 relative"
                >
                  Create Passport
                </Link>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#81766D]">
                <PiSparkleBold className="text-[#C6A16B] text-xs" />
                <span>Bibliophile Vault</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#8D263B] block mb-1">
                Reader Authentication
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#302A27] tracking-tight leading-tight">
                Welcome back to the library.
              </h1>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#81766D] mt-1 leading-relaxed">
                Enter your credentials to reopen your shelf, private margin notes, and favorites.
              </p>
            </div>

            {/* One-Click Instant Access Passes (Cute Library Vouchers) */}
            <div className="mb-6 p-3.5 rounded-2xl bg-[#F7F3EC]/80 border border-[#E8DED1]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9.5px] font-sans font-medium uppercase tracking-[0.14em] text-[#81766D]">
                  Quick Demo Access
                </span>
                <span className="text-[9.5px] font-mono text-[#81766D]">1-click fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillAndLogin('student@pageturner.io', 'student123')}
                  className="px-3 py-2 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] hover:border-[#8D263B]/40 hover:bg-[#FAF5ED] text-left transition-all duration-150 group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#302A27] group-hover:text-[#8D263B] transition-colors">
                      Demo Reader
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-[#8D263B]/10 text-[#8D263B] font-semibold">
                      Student
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#81766D] block mt-0.5 truncate">
                    student@pageturner.io
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillAndLogin('admin@pageturner.io', 'admin123')}
                  className="px-3 py-2 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] hover:border-[#C6A16B] hover:bg-[#FAF5ED] text-left transition-all duration-150 group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#302A27] group-hover:text-[#67202F] transition-colors flex items-center gap-1">
                      <PiCrownBold className="text-[#C6A16B] text-xs" />
                      <span>Curator Admin</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded-full bg-[#C6A16B]/20 text-[#67202F] font-semibold">
                      Admin
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#81766D] block mt-0.5 truncate">
                    admin@pageturner.io
                  </span>
                </button>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleLogin} className="space-y-4.5">
              
              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                  Archival Email Address
                </label>
                <div className="relative">
                  <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reader@literarysanctuary.org"
                    autoComplete="email"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-[#8D263B] mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#302A27]">
                    Secret Key / Passphrase
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-serif italic text-[#81766D] hover:text-[#8D263B] transition-colors"
                  >
                    Forgot your key?
                  </Link>
                </div>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81766D] hover:text-[#302A27] p-1 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <PiEyeSlashBold className="text-sm" /> : <PiEyeBold className="text-sm" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-[#8D263B] mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-[#8D263B] hover:bg-[#67202F] text-[#FFFDFA] text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Opening Sanctuary Vault...</span>
                  </span>
                ) : (
                  <>
                    <span>Enter the Sanctuary</span>
                    <PiArrowRightBold className="text-xs text-[#C6A16B]" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer Guidance */}
            <div className="mt-6 pt-5 border-t border-[#E8DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 text-[11px] text-[#81766D]">
                <PiShieldCheckBold className="text-sm text-[#879783] flex-shrink-0" />
                <span>Protected by archival session hashing &amp; TLS encryption.</span>
              </div>

              <Link
                to="/register"
                className="text-xs font-medium text-[#8D263B] hover:underline flex-shrink-0"
              >
                Need a membership? Join here &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
