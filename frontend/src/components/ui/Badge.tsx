import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        primary:   'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent:    'bg-amber-100 text-amber-700',
        success:   'bg-green-100 text-green-700',
        error:     'bg-red-100 text-red-700',
        warning:   'bg-yellow-100 text-yellow-700',
        muted:     'bg-slate-100 text-slate-600',
      },
    },
    defaultVariants: { variant: 'muted' },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
