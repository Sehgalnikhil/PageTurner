import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import { PiUserBold, PiEnvelopeBold, PiLockKeyBold, PiUserPlusBold, PiBooksBold } from 'react-icons/pi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Valid email is required';
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
      const { data } = await authService.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      login(data);
      enqueueSnackbar(`Welcome to the sanctuary, ${data.username}! Your Reader Passport & Starter Pack email has been dispatched to ${email.trim()} ✉️`, {
        variant: 'success',
        autoHideDuration: 6000,
      });
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
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#302A27]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-4xl bg-[#FFFDFA] border border-[#E8DED1] rounded-2xl shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Editorial Literary Visual Panel */}
          <div className="relative hidden md:flex flex-col justify-between p-8 lg:p-10 bg-[#F0E9DE] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none select-none">
              <img
                src="/images/editorial/moodboard_open_book.jpg"
                alt="Open book pages in soft natural light"
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
                The Reader Passport
              </span>
              <blockquote className="font-serif text-xl lg:text-2xl italic leading-snug mb-3">
                &ldquo;A reader lives a thousand lives before he dies.&rdquo;
              </blockquote>
              <p className="text-xs text-[#E8DED1] font-mono">
                &mdash; George R.R. Martin
              </p>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[#8D263B] block mb-1">
                New Reader Passport
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#302A27]">
                Join the Sanctuary
              </h1>
              <p className="text-xs text-[#81766D] mt-1">
                Curate your reading shelf, collect timeless stories, and record reflections.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                  Reader Handle / Username
                </label>
                <div className="relative">
                  <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. virginia_woolf"
                    className="editorial-input w-full pl-9 pr-3 py-2 rounded-lg text-xs"
                  />
                </div>
                {errors.username && <p className="text-[11px] text-[#8D263B] mt-1">{errors.username}</p>}
              </div>

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
                <label className="block text-xs font-medium text-[#302A27] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <PiLockKeyBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81766D] text-sm" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 5 characters"
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
                <PiUserPlusBold className="text-sm" />
                <span>{loading ? 'Creating Passport...' : 'Create Reader Passport'}</span>
              </button>

              <div className="mt-3 p-2 rounded-lg bg-[#F7F3EC] border border-[#E8DED1] text-center">
                <p className="text-[10px] font-mono text-[#81766D]">
                  Welcome email package with ex libris badge sent upon account creation.
                </p>
              </div>
            </form>

            <p className="text-center text-xs text-[#81766D] mt-5 pt-4 border-t border-[#E8DED1]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#8D263B] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
