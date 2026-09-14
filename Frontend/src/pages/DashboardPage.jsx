import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBooks, deleteBook } from '../services/api';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import FloatingClouds from '../components/FloatingClouds';
import Button from '../components/Button';
import { Plus, BookOpen, Sparkles, Library } from 'lucide-react';

export default function DashboardPage() {
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Protect route
  useEffect(() => {
    if (!token && !localStorage.getItem('storyverse_token')) {
      navigate('/login');
    }
  }, [token, navigate]);

  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError('Could not load books from shelf.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token || localStorage.getItem('storyverse_token')) {
      loadBooks();
    }
  }, [token]);

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      // Remove from state on success
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      alert('Could not delete book. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#D4E8FA] flex flex-col justify-between overflow-x-hidden">
      {/* Floating clouds touch */}
      <FloatingClouds variant="default" />

      {/* Reusable Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-8 pb-16">
        {/* Headline Area with prominent "Create a new book" CTA button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/60">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/70 border border-white/80 text-xs font-semibold text-stone-700 tracking-wide mb-2 shadow-2xs">
              <Library className="w-3.5 h-3.5 text-stone-600" />
              <span>Personal Library</span>
            </div>
            <h1 className="font-craft-serif text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight">
              Your storybooks
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Every idea you envisioned, illustrated page by page
            </p>
          </div>

          {/* Prominent dark pill CTA leading to /create */}
          <Link to="/create" className="self-start sm:self-auto">
            <Button variant="primary" size="lg" className="craft-btn-shadow">
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create a new book</span>
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 bg-white/60 rounded-3xl border border-white animate-pulse shadow-sm"
              ></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6 bg-white/90 rounded-3xl border border-rose-200 text-center max-w-md mx-auto my-12">
            <p className="text-rose-700 text-sm mb-3">{error}</p>
            <Button variant="secondary" size="sm" onClick={loadBooks}>
              Try again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && books.length === 0 && (
          <div className="max-w-md mx-auto my-12 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-white/95 p-8 sm:p-10 text-center shadow-[0_16px_36px_rgba(20,45,75,0.08)] animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-800 flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <BookOpen className="w-7 h-7 stroke-[1.5]" />
            </div>

            <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-2">
              Your bookshelf is empty
            </h3>

            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              Write your first story. Enter a dream or scene prompt, choose an art style, and watch your illustrated book take shape.
            </p>

            <Link to="/create">
              <Button variant="primary" size="md" className="w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span>Create a new book</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Bookshelf Grid of Cards */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDeleteBook} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 border-t border-white/40 text-center text-xs text-stone-500">
        Storyverse &bull; Illustrated storybooks
      </footer>
    </div>
  );
}
