import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, createCraftStorySVG } from '../services/api';
import { Trash2, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

export default function BookCard({ book, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const styleLabels = {
    comic: 'Color Comic',
    ink: 'Black & White Ink',
    watercolor: 'Storybook Watercolor',
  };

  const styleBadgeStyles = {
    comic: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    ink: 'bg-stone-900 text-stone-100 border-stone-800',
    watercolor: 'bg-amber-50 text-amber-800 border-amber-200/80',
  };

  const [imgHasError, setImgHasError] = useState(false);

  const dynamicCraftCover = createCraftStorySVG({
    title: book.title,
    pageNumber: 1,
    style: book.style,
    promptText: book.prompt || book.title,
  });

  const rawCover = book.coverImage || (Array.isArray(book.pages) && book.pages[0]?.image);
  const coverSrc = imgHasError ? dynamicCraftCover : (getImageUrl(rawCover) || dynamicCraftCover);
  const label = styleLabels[book.style] || book.style || 'Storybook';
  const badgeClass = styleBadgeStyles[book.style] || 'bg-stone-100 text-stone-700 border-stone-200';

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(book.id || book._id);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border-2 border-white/95 shadow-[0_14px_34px_rgba(20,45,75,0.08)] hover:shadow-[0_22px_48px_rgba(20,45,75,0.14)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Clickable Card wrapper leading to /books/:id */}
      <Link to={`/books/${book.id || book._id}`} className="block flex-1">
        {/* Cover Image Container */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-100">
          <img
            src={coverSrc}
            alt={book.title}
            onError={() => setImgHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

          {/* Style Badge */}
          <div className="absolute top-3.5 left-3.5">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${badgeClass}`}
            >
              {label}
            </span>
          </div>

          {/* Page count pill */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
            <BookOpen className="w-3 h-3" />
            <span>{book.pageCount || book.pages?.length || 8} pages</span>
          </div>
        </div>

        {/* Book Details */}
        <div className="p-5">
          <h3 className="font-craft-serif text-xl sm:text-2xl font-normal text-stone-900 group-hover:text-black line-clamp-1 transition-colors">
            {book.title}
          </h3>
          {book.prompt && (
            <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
              &ldquo;{book.prompt}&rdquo;
            </p>
          )}
        </div>
      </Link>

      {/* Card Footer: Read action & Delete Option */}
      <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-stone-100/80">
        <Link
          to={`/books/${book.id || book._id}`}
          className="text-xs font-semibold text-stone-800 hover:text-black group-hover:underline inline-flex items-center space-x-1"
        >
          <span>Read book</span>
          <span className="text-stone-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        {/* Delete Trigger Button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          title="Delete book"
          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Step Overlay */}
      {isConfirmingDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-white/95 backdrop-blur-xs p-5 flex flex-col justify-center items-center text-center z-20 animate-in fade-in duration-150"
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h4 className="font-craft-serif text-lg font-normal text-stone-900 mb-1">
            Delete &ldquo;{book.title}&rdquo;?
          </h4>
          <p className="text-xs text-stone-500 max-w-xs mb-4">
            This will permanently remove this illustrated storybook from your shelf.
          </p>
          <div className="flex items-center space-x-2 w-full max-w-xs">
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="flex-1 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors shadow-2xs cursor-pointer flex items-center justify-center space-x-1"
            >
              {isDeleting ? <span>Deleting...</span> : <span>Delete</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
