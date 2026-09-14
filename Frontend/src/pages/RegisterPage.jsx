import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import FloatingClouds from '../components/FloatingClouds';

import {
  BookOpen,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Call real backend through AuthContext
    try {
      setLoading(true);

      console.log('REGISTER PAGE: sending registration request');

      const data = await register(
        username.trim(),
        email.trim(),
        password
      );

      console.log(
        'REGISTER PAGE: backend registration successful',
        data
      );

      // Only navigate if registration succeeded
      navigate('/dashboard');
    } catch (err) {
      console.error(
        'REGISTER PAGE: registration failed',
        err
      );

      setError(
        err?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#94c5ec] via-[#89bfeb] to-[#7db4e4] flex flex-col justify-between overflow-x-hidden selection:bg-[#F8E7A2]">

      {/* Background Floating Sky Elements */}
      <FloatingClouds variant="default" />

      {/* Top Header */}
      <header className="relative z-30 pt-6 px-4 sm:px-8 max-w-6xl mx-auto w-full flex items-center justify-between">

        <Link
          to="/"
          className="inline-flex items-center space-x-2 group cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-full bg-[#0D1116] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-4 h-4 text-white" />
          </div>

          <span className="font-craft-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight">
            Storyverse
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/90 transition-all shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to home</span>
        </Link>

      </header>

      {/* Main Form */}
      <main className="relative z-30 flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[32px] border-2 border-white/95 shadow-[0_24px_60px_rgba(20,45,75,0.12)] p-7 sm:p-10">

          {/* Card Header */}
          <div className="text-center mb-8">

            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>

            <h1 className="font-craft-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Create account
            </h1>

            <p className="text-stone-600 text-sm mt-2 font-normal">
              Join StoryVerse and start creating illustrated stories
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

              <span className="leading-relaxed">
                {error}
              </span>
            </div>
          )}

          {/* Loading Message */}
          {loading && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start space-x-3 animate-pulse">

              <Loader2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />

              <span className="leading-relaxed">
                Creating your account... Connecting to Render backend server.
              </span>

            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-5"
          >

            {/* Username */}
            <div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Username
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a storyteller name"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD3] rounded-2xl outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-400/20 text-stone-900 text-sm placeholder:text-stone-400 transition"
                  required
                />

              </div>
            </div>

            {/* Email */}
            <div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Email address
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD3] rounded-2xl outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-400/20 text-stone-900 text-sm placeholder:text-stone-400 transition"
                  required
                />

              </div>
            </div>

            {/* Password */}
            <div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-[#E2DDD3] rounded-2xl outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-400/20 text-stone-900 text-sm placeholder:text-stone-400 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
                  title={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>
            </div>

            {/* Confirm Password */}
            <div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2DDD3] rounded-2xl outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-400/20 text-stone-900 text-sm placeholder:text-stone-400 transition"
                  required
                />

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D1116] hover:bg-[#252A34] active:scale-98 text-white py-3.5 rounded-full font-semibold text-sm transition-all duration-150 craft-btn-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer mt-3"
            >

              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create StoryVerse Account</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}

            </button>

          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-5 border-t border-stone-100 text-sm text-stone-600 font-normal">

            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-stone-900 hover:underline transition-all"
            >
              Log in &rarr;
            </Link>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-30 py-4 text-center text-xs text-stone-600">
        Storyverse &bull; Illustrated storybooks
      </footer>

    </div>
  );
};

export default RegisterPage;