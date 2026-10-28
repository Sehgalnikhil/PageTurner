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
      enqueueSnackbar(`Welcome to the community, ${data.username}!`, {
        variant: 'success',
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
    <div className="min-h-screen flex flex-col bg-transparent text-[#1C1917]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md editorial-sheet p-8 sm:p-10 bg-white border border-stone-200">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-burgundy text-white flex items-center justify-center mx-auto mb-3">
              <PiBooksBold className="text-2xl" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Join PageTurner
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Curate your reading shelf, collect timeless stories, and record reflections.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <PiUserBold className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ReaderName"
                  className="editorial-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs"
                />
              </div>
              {errors.username && <p className="text-[11px] text-red-600 mt-1">{errors.username}</p>}
            </div>

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
                  placeholder="At least 5 characters"
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
              <PiUserPlusBold className="text-sm" />
              <span>{loading ? 'Creating Member Account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-6 pt-4 border-t border-stone-100">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-burgundy hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
