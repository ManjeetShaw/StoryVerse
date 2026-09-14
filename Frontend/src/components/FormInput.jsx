import React from 'react';

/**
 * Reusable FormInput with inline validation and clear error messaging.
 */
export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
  className = '',
  disabled = false,
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full bg-white/95 border rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 transition-all duration-150 outline-none ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/20'
              : 'border-[#E2DDD3] focus:border-stone-800 focus:ring-2 focus:ring-stone-400/20'
          }`}
        />
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-rose-600 animate-in fade-in duration-150 pt-0.5">
          <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
