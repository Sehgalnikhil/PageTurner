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
      enqueueSnackbar(`Welcome back to the Reading Journal, ${data.username}!`, { variant: 'success' });
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
      enqueueSnackbar(`Signed in as ${data.username} (${data.role.toUpperCase()})`, { variant: 'success' });
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
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md editorial-sheet p-8 sm:p-10 bg-white border border-stone-200">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-burgundy text-white flex items-center justify-center mx-auto mb-3">
              <PiBooksBold className="text-2xl" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Welcome to PageTurner
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Sign in to manage your reading shelf, save reflections, and discover stories.
            </p>
          </div>

          {/* Quick 1-Click Demo Login Bar */}
          <div className="mb-6 p-4 rounded-xl bg-[#FAF7F2] border border-stone-200">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-stone-500 block mb-2 text-center">
              One-Click Instant Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillAndLogin('admin@pageturner.io', 'admin123')}
                disabled={loading}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <PiShieldCheckBold className="text-burgundy text-sm" />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => fillAndLogin('student@pageturner.io', 'student123')}
                disabled={loading}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <PiUserBold className="text-sage text-sm" />
                <span>Reader Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <PiEnvelopeBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="editorial-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="editorial-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs"
                />
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full btn-burgundy text-xs shadow-xs disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <PiSignInBold className="text-sm" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-6 pt-4 border-t border-stone-100">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-semibold text-burgundy hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
