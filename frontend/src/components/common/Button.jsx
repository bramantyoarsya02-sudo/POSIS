import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  icon: Icon,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 border-2 active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px]";

  const variants = {
    // CTA Utama Kuning Emas Logo
    primary: "bg-posis-gold text-posis-ink border-posis-ink hover:bg-posis-gold-hover hover:border-posis-ink editorial-shadow-dark",
    // Tombol Garis Biru Logo
    outline: "bg-posis-bone text-posis-blue border-posis-blue hover:bg-posis-blue hover:text-white editorial-shadow",
    // Biru Solid
    blue: "bg-posis-blue text-white border-posis-blue hover:bg-posis-blue-dark editorial-shadow-dark",
    // Muted / Netral
    neutral: "bg-white text-posis-ink border-stone-400 hover:border-posis-ink hover:bg-stone-50",
    // Ghost
    ghost: "bg-transparent text-posis-blue border-transparent hover:bg-posis-blue/10 active:bg-posis-blue/20",
    // Danger
    danger: "bg-posis-lost text-white border-posis-ink hover:bg-red-700 editorial-shadow-dark",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wider uppercase font-mono rounded-[2px]",
    md: "px-5 py-2.5 text-sm tracking-wide rounded-[3px]",
    lg: "px-6 py-3.5 text-base tracking-wide rounded-[3px]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 stroke-[2.5]" />}
      {children}
    </button>
  );
}
