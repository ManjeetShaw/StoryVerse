import React from 'react';

/**
 * Reusable Button component matching the Storyverse design system.
 * Default is dark rounded pill matching homepage CTA style.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  onClick,
  ...props
}) {
  const baseStyles =
    'rounded-full font-medium transition-all duration-200 inline-flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2',
    md: 'text-[14.5px] px-6 py-3',
    lg: 'text-[15px] px-8 py-3.5',
  };

  const variantStyles = {
    primary:
      'bg-[#0D1116] hover:bg-[#222832] text-white craft-btn-shadow transform hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-white/80 hover:bg-white text-stone-800 border border-stone-200/90 shadow-2xs hover:shadow-xs',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
    ghost:
      'bg-transparent hover:bg-black/5 text-stone-700 hover:text-black',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{typeof children === 'string' ? children : 'Loading...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
