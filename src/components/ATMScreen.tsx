import React from 'react';
import { cn } from '@/lib/utils';

interface ATMScreenProps {
  children: React.ReactNode;
  className?: string;
}

export const ATMScreen: React.FC<ATMScreenProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-gradient-screen border-4 border-border rounded-lg p-8 shadow-atm",
      "min-h-[600px] w-full max-w-4xl mx-auto",
      "relative overflow-hidden",
      className
    )}>
      {/* Screen glare effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};