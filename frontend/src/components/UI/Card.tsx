import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-stone-900/90 backdrop-blur-xl border border-stone-800 text-stone-100 rounded-2xl shadow-xl shadow-black/40 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
