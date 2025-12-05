import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-95";

  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-primary/40",
    secondary: "bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 hover:border-zinc-300 shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-900 hover:text-primary",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};