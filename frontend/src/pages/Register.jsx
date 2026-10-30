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
  PiArrowRightBold,
  PiSparkleBold,
  PiBookOpenBold,
  PiCheckBold,
  PiShieldCheckBold,
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
        `Welcome to the sanctuary, ${data.username}! Your Reader Passport & Starter Pack email has been dispatched. ✉️`,
        {
          variant: 'success',
          autoHideDuration: 6000,
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

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-transparent', pct: 0 };
    if (pwd.length < 5) return { label: 'Too short', color: 'bg-rose-400', pct: 25 };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { label: 'Strong & secure', color: 'bg-[#879783]', pct: 100 };
    }
    if (pwd.length >= 6) {
      return { label: 'Moderate', color: 'bg-[#C6A16B]', pct: 60 };
    }
    return { label: 'Fair', color: 'bg-amber-400', pct: 40 };
  };

  const strength = getPasswordStrength(password);

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
                src="/images/editorial/moodboard_open_book.jpg"
                alt="Open book pages in soft natural light"
                className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#67202F]/92 via-[#67202F]/50 to-[#67202F]/20" />
            </div>

            {/* Top Brand & Ex Libris Stamp */}
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
                Issue No. 24
              </div>
            </div>

            {/* Center: Curated Sanctuary Privileges */}
            <div className="relative z-10 my-auto py-8 text-[#FFFDFA] space-y-4">
              <span className="text-[9.5px] font-sans font-medium uppercase tracking-[0.16em] text-[#C6A16B] block">
                Reader Privileges
              </span>
              <ul className="space-y-3 text-xs text-[#FAF5ED]/90">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6A16B] text-xs mt-0.5">✦</span>
                  <span><strong>Ex Libris Bookplates:</strong> Craft personalized vintage digital bookplates for every volume.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6A16B] text-xs mt-0.5">✦</span>
                  <span><strong>Sanctuary Soundscapes:</strong> Immersive rain, crackling fireplace & library clocks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C6A16B] text-xs mt-0.5">✦</span>
                  <span><strong>Atmospheric Shelves:</strong> Organize reading stages with intimate private margin notes.</span>
                </li>
              </ul>
            </div>

            {/* Bottom: Literary Quote */}
            <div className="relative z-10 text-[#FFFDFA] pt-4 border-t border-white/15">
              <blockquote className="font-serif text-lg lg:text-xl italic leading-snug mb-2 text-[#FAF5ED]">
                &ldquo;A reader lives a thousand lives before he dies.&rdquo;
              </blockquote>
              <p className="text-[11px] text-[#E8DED1] font-mono tracking-wide">
                &mdash; George R.R. Martin
              </p>
            </div>
          </div>

          {/* RIGHT: Registration Stationery Desk (7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FFFDFA]">
            
            {/* Top Switcher Tabs (Sign In / Register) */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8DED1]">
              <div className="flex items-center gap-6 text-xs font-medium">
                <Link
                  to="/login"
                  className="text-[#81766D] hover:text-[#8D263B] transition-colors py-1 relative"
                >
                  Sign In
                </Link>
                <span className="text-[#8D263B] font-semibold py-1 relative after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#8D263B] after:rounded-full">
                  Create Passport
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#81766D]">
                <PiSparkleBold className="text-[#C6A16B] text-xs" />
                <span>Sanctuary Pass</span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#8D263B] block mb-1">
                New Reader Enrolment
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#302A27] tracking-tight leading-tight">
                Claim your reader&apos;s passport.
              </h1>
              <p className="font-serif italic text-xs sm:text-[13px] text-[#81766D] mt-1 leading-relaxed">
                Join our quiet circle of bibliophiles, thoughtful curators, and collectors.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4.5">
              
              {/* Reader Handle / Username */}
              <div>
                <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                  Reader Handle / Pseudonym
                </label>
                <div className="relative">
                  <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. virginia_woolf"
                    autoComplete="username"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E8DED1] bg-[#FFFDFA] text-xs text-[#302A27] placeholder:text-[#81766D]/50 focus:outline-none focus:border-[#8D263B] focus:ring-2 focus:ring-[#8D263B]/10 transition-all shadow-2xs"
                  />
                </div>
                {errors.username && (
                  <p className="text-[11px] text-[#8D263B] mt-1 font-medium">{errors.username}</p>
                )}
              </div>

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
                  {password && (
                    <span className="text-[10px] font-mono text-[#81766D]">
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 5 characters"
                    autoComplete="new-password"
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

                {/* Password strength progress bar */}
                {password && (
                  <div className="w-full bg-[#E8DED1]/50 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
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
                    <span>Inscribing Reader Passport...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Reader Passport</span>
                    <PiArrowRightBold className="text-xs text-[#C6A16B]" />
                  </>
                )}
              </button>
            </form>

            {/* Dispatch Guarantee Notice */}
            <div className="mt-6 pt-5 border-t border-[#E8DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2 text-[11px] text-[#81766D]">
                <PiShieldCheckBold className="text-sm text-[#879783] flex-shrink-0" />
                <span>Complimentary starter package &amp; welcome letter sent upon creation.</span>
              </div>

              <Link
                to="/login"
                className="text-xs font-medium text-[#8D263B] hover:underline flex-shrink-0"
              >
                Already registered? Sign in &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
