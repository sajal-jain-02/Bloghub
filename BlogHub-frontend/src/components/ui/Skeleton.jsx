import React from 'react'
import { cn } from '../../lib/utils'

export const Skeleton = React.forwardRef(
  ({ className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton"
        className={cn(
          'bg-zinc-900 rounded',
          animate && 'skeleton-shimmer',
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}

export const SkeletonAvatar = React.forwardRef(
  ({ className, size = 'md', animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-avatar"
        className={cn(
          'rounded-full bg-zinc-900 shrink-0',
          avatarSizes[size] || avatarSizes.md,
          animate && 'skeleton-shimmer',
          className
        )}
        {...props}
      />
    )
  }
)
SkeletonAvatar.displayName = 'SkeletonAvatar'

export const SkeletonText = React.forwardRef(
  (
    {
      className,
      rows = 3,
      widths = ['100%', '92%', '68%'],
      animate = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-text"
        className={cn('space-y-2.5', className)}
        {...props}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-3.5 rounded bg-zinc-900',
              animate && 'skeleton-shimmer'
            )}
            style={{ width: widths[index % widths.length] }}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = 'SkeletonText'

export const SkeletonCard = React.forwardRef(
  ({ className, animate = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        data-slot="skeleton-card"
        className={cn(
          'rounded-xl border border-zinc-800/80 p-4 bg-zinc-950/60',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-32 rounded-lg bg-zinc-900',
            animate && 'skeleton-shimmer'
          )}
        />
        <div className="mt-4 flex items-start gap-3">
          <SkeletonAvatar size="sm" animate={animate} />
          <div className="min-w-0 flex-1 pt-0.5">
            <SkeletonText rows={3} widths={['82%', '96%', '54%']} animate={animate} />
          </div>
        </div>
      </div>
    )
  }
)
SkeletonCard.displayName = 'SkeletonCard'

export default Skeleton

