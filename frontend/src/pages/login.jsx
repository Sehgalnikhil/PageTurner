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
  PiSignInBold,
  PiShieldCheckBold,
  PiUserBold,
  PiBooksBold,
  PiArrowRightBold,
} from 'react-icons/pi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      errs.email = 'Please provide a valid email address';
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
      const { data } = await authService.login({ email, password });
      login(data);
      enqueueSnackbar(`Welcome back, ${data.username}! Session security email sent to ${data.email} ✉️`, {
        variant: 'success',
        autoHideDuration: 4000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(error.customMessage || error.response?.data?.message || 'Invalid credentials', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
    setLoading(true);
    try {
      const { data } = await authService.login({ email: demoEmail, password: demoPassword });
      login(data);
      enqueueSnackbar(`Signed in as ${data.username}! Session security email dispatched to ${data.email} ✉️`, {
        variant: 'success',
        autoHideDuration: 4000,
      });
      navigate(from, { replace: true });
    } catch (error) {
      enqueueSnackbar(error.customMessage || error.response?.data?.message || 'Login failed', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-4xl bg-[#FFFDFA] border border-[#E8DED1] rounded-2xl shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Editorial Literary Visual Panel */}
          <div className="relative hidden md:flex flex-col justify-between p-8 lg:p-10 bg-[#F0E9DE] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none select-none">
              <img
                src="/images/editorial/moodboard_reading_nook.jpg"
                alt="Literary sanctuary reading nook"
                className="w-full h-full object-cover opacity-85 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#67202F]/90 via-[#67202F]/40 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FFFDFA] text-[#8D263B] flex items-center justify-center shadow-subtle">
                <PiBooksBold className="text-lg" />
              </div>
              <span className="font-serif text-lg font-medium text-[#FFFDFA] tracking-tight">
                PageTurner
              </span>
            </div>

            <div className="relative z-10 text-[#FFFDFA] mt-auto pt-24">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A16B] block mb-2 font-medium">
                The Reading Sanctuary
              </span>
              <blockquote className="font-serif text-xl lg:text-2xl italic leading-snug mb-3">
                &ldquo;A room without books is like a body without a soul.&rdquo;
              </blockquote>
              <p className="text-xs text-[#E8DED1] font-mono">
                &mdash; Marcus Tullius Cicero
              </p>
            </div>
          </div>

          {/* Right: Authentication Form */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#8D263B] block mb-1">
                Reader Sign In
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#302A27]">
                Welcome Back
              </h1>
              <p className="text-xs text-[#81766D] mt-1">
                Sign in to manage your reading shelf, save reflections, and discover stories.
              </p>
            </div>

            {/* Quick 1-Click Demo Login Bar */}
            <div className="mb-6 p-3.5 rounded-xl bg-[#F7F3EC] border border-[#E8DED1]">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#81766D] block mb-2 text-center">
                One-Click Instant Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillAndLogin('admin@pageturner.io', 'admin123')}
                  disabled={loading}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium bg-[#FFFDFA] hover:bg-[#F0E9DE] text-[#302A27] border border-[#E8DED1] flex items-center justify-center gap-1.5 transition-colors shadow-subtle cursor-pointer"
                >
                  <PiShieldCheckBold className="text-[#8D263B] text-sm" />
                  <span>Admin Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillAndLogin('student@pageturner.io', 'student123')}
                  disabled={loading}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium bg-[#FFFDFA] hover:bg-[#F0E9DE] text-[#302A27] border border-[#E8DED1] flex items-center justify-center gap-1.5 transition-colors shadow-subtle cursor-pointer"
                >
                  <PiUserBold className="text-[#879783] text-sm" />
                  <span>Reader Demo</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="editorial-input w-full pl-9 pr-3 py-2 rounded-lg text-xs"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-[#8D263B] mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#302A27]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-medium text-[#8D263B] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="editorial-input w-full pl-9 pr-3 py-2 rounded-lg text-xs"
                  />
                </div>
                {errors.password && <p className="text-[11px] text-[#8D263B] mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full btn-burgundy text-xs shadow-subtle disabled:opacity-50 mt-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PiSignInBold className="text-sm" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>

              <div className="mt-3 p-2 rounded-lg bg-[#F7F3EC] border border-[#E8DED1] text-center">
                <p className="text-[10px] font-mono text-[#81766D]">
                  Security notification dispatched to your inbox upon entry.
                </p>
              </div>
            </form>

            <p className="text-center text-xs text-[#81766D] mt-5 pt-4 border-t border-[#E8DED1]">
              Don&apos;t have a reader passport yet?{' '}
              <Link to="/register" className="font-medium text-[#8D263B] hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
