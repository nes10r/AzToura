'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary shadow-sm hover:shadow-md active:scale-95',
        accent:    'bg-accent text-text hover:bg-accent-dark focus-visible:ring-accent shadow-sm hover:shadow-md active:scale-95',
        outline:   'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus-visible:ring-primary active:scale-95',
        ghost:     'text-text-secondary hover:bg-border hover:text-text focus-visible:ring-border active:scale-95',
        danger:    'bg-error text-white hover:bg-red-600 focus-visible:ring-error shadow-sm active:scale-95',
      },
      size: {
        sm:  'px-4 py-1.5 text-sm',
        md:  'px-6 py-2.5 text-sm',
        lg:  'px-8 py-3 text-base',
        xl:  'px-10 py-4 text-lg',
        icon:'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';

export { Button, buttonVariants };
