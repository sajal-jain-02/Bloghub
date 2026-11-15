import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Skeleton, SkeletonAvatar } from '../ui/Skeleton'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, isVerifying } = useAuth()

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Top nav skeleton bar */}
        <div className="border-b border-zinc-800/80 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-7 h-7 rounded-lg bg-zinc-900" />
            <Skeleton className="h-5 w-24 bg-zinc-900 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 bg-zinc-900 rounded-full" />
            <SkeletonAvatar size="sm" className="bg-zinc-900 border border-zinc-800" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
          <Skeleton className="h-10 w-2/3 bg-zinc-900 rounded-lg" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-full bg-zinc-900/80 rounded" />
            <Skeleton className="h-4 w-5/6 bg-zinc-900/80 rounded" />
            <Skeleton className="h-4 w-3/4 bg-zinc-900/80 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
