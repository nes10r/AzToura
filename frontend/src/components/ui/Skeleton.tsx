import { cn } from '@/lib/utils';

interface SkeletonProps { className?: string }

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-lg bg-border/60', className)} />
);

export const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-surface border border-border">
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);
