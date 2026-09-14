import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Plus, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  const isCurrent = (path) => location.pathname === path;

  return (
    <header className="relative z-40 pt-6 px-4 sm:px-8">
      <nav className="max-w-6xl mx-auto bg-white/85 backdrop-blur-md rounded-full px-5 sm:px-7 py-3 border border-white/90 shadow-[0_8px_24px_rgba(20,45,75,0.06)] flex items-center justify-between">
        {/* Brand Logo & Studio Mark */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#0D1116] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="font-craft-serif font-bold text-xl sm:text-2xl text-[#0D1116] tracking-tight">
            Storyverse
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-7 text-[14.5px] font-medium text-stone-600">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`transition-colors hover:text-black ${
                  isCurrent('/dashboard') ? 'text-black font-semibold' : ''
                }`}
              >
                Bookshelf
              </Link>
              <Link
                to="/create"
                className={`transition-colors hover:text-black ${
                  isCurrent('/create') ? 'text-black font-semibold' : ''
                }`}
              >
                Write Story
              </Link>
              <Link
                to="/"
                className="transition-colors hover:text-black text-stone-500"
              >
                Home
              </Link>
            </>
          ) : (
            <>
              <a href="/#how-it-works" className="hover:text-black transition-colors">
                How it works
              </a>
              <a href="/#styles" className="hover:text-black transition-colors">
                Art styles
              </a>
              <Link to="/login" className="hover:text-black transition-colors">
                Bookshelf
              </Link>
            </>
          )}
        </div>

        {/* User Actions & Auth State */}
        <div className="hidden sm:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/create"
                className="bg-[#0D1116] hover:bg-[#252A34] text-white text-[13.5px] font-medium px-4 py-2 rounded-full craft-btn-shadow transition-all duration-150 inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New book</span>
              </Link>

              {/* User Avatar with initial */}
              <div className="flex items-center space-x-2 pl-1 border-l border-stone-200">
                <div
                  title={user?.email || 'Logged in user'}
                  className="w-8 h-8 rounded-full bg-[#FCE5D8] flex items-center justify-center text-xs text-[#A64A17] font-bold ring-1 ring-[#F4C9B3] cursor-default shadow-2xs"
                >
                  {initial}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 rounded-full text-stone-500 hover:text-rose-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                to="/login"
                className="text-[14px] font-medium text-[#232933] hover:text-black transition-colors px-3 py-1.5 cursor-pointer"
              >
                Log in
              </Link>
              <Link
                to="/create"
                className="bg-[#0D1116] hover:bg-[#252A34] text-white text-[13.5px] font-medium px-5 py-2 rounded-full transition-all duration-150 transform hover:scale-[1.02] active:scale-98 craft-btn-shadow inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Start your book</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
          {isAuthenticated && (
            <div className="w-7 h-7 rounded-full bg-[#FCE5D8] flex items-center justify-center text-xs text-[#A64A17] font-bold ring-1 ring-[#F4C9B3]">
              {initial}
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-1 text-xs text-stone-500 border-b border-stone-100 pb-2">
                Signed in as <span className="font-semibold text-stone-800">{user?.email || 'Storyteller'}</span>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Bookshelf
              </Link>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Create a new book
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Storyverse Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                How it works
              </a>
              <a
                href="/#styles"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Art styles
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Create account
              </Link>
              <Link
                to="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-[#0D1116] text-white py-2.5 rounded-full text-sm font-medium"
              >
                Start your book
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
