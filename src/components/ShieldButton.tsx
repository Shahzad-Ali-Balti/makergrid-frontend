import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const shieldButtonVariants = cva(
  "shield-btn inline-flex items-center justify-center font-cinzel transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-[--gold-default] text-[--navy-default] font-bold hover:bg-[--gold-light]",
        secondary: "bg-[--royal-default] border border-[--gold-default]/30 text-white hover:bg-[--royal-light]",
        outline: "bg-transparent border border-[--gold-default]/30 text-[--gold-default] hover:bg-[--royal-dark]/50",
        ghost: "bg-transparent text-[--gold-default] hover:bg-[--royal-dark]/30",
      },
      size: {
        default: "py-2 px-6 text-sm",
        sm: "py-1 px-3 text-xs",
        lg: "py-3 px-8 text-base",
        xl: "py-4 px-8 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ShieldButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof shieldButtonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ShieldButton = React.forwardRef<HTMLButtonElement, ShieldButtonProps>(
  ({ className, variant, size, fullWidth, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(shieldButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

ShieldButton.displayName = "ShieldButton";

export default ShieldButton;
