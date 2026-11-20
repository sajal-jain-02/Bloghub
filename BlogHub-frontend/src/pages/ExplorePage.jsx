import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import axios from 'axios'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { Skeleton, SkeletonAvatar } from '../components/ui/Skeleton'
import { API_BASE_URL } from '../config/api'

function timeAgo(dateString) {
  const now = Date.now()
  const diff = now - new Date(dateString).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function AuthorAvatar({ author }) {
  const avatarUrl = author?.profilePhoto || author?.avatar
  const username = (typeof author === 'object' && author?.username) || 'Author'
  const initials = username.slice(0, 2).toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
      />
    )
  }

  return (
    <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center border border-zinc-700 shrink-0 select-none">
      {initials}
    </div>
  )
}

function PostCardSkeleton() {
  return (
    <div className="border-b border-zinc-800 p-5 md:p-6">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="sm" className="bg-zinc-900 border border-zinc-800/80 shrink-0" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-24 bg-zinc-900 rounded" />
          <span className="text-xs text-zinc-700">·</span>
          <Skeleton className="h-3 w-14 bg-zinc-900/70 rounded" />
        </div>
      </div>

      {/* Title */}
      <div className="mt-3.5">
        <Skeleton className="h-6 md:h-7 w-4/5 bg-zinc-900 rounded" />
      </div>

      {/* Excerpt */}
      <div className="mt-3 space-y-1.5">
        <Skeleton className="h-3.5 w-full bg-zinc-900/80 rounded" />
        <Skeleton className="h-3.5 w-2/3 bg-zinc-900/80 rounded" />
      </div>

      {/* Bottom action row */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-3.5 h-3.5 rounded bg-zinc-900" />
            <Skeleton className="w-4 h-3 rounded bg-zinc-900/70" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-3.5 h-3.5 rounded bg-zinc-900" />
            <Skeleton className="w-4 h-3 rounded bg-zinc-900/70" />
          </div>
        </div>
        <Skeleton className="w-3.5 h-3.5 rounded bg-zinc-900" />
      </div>
    </div>
  )
}

function PostItem({ post, onLikeToggle, onBookmarkToggle }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const authorName =
    typeof post.author === 'object' && post.author?.username
      ? post.author.username
      : 'Anonymous'

  const excerpt =
    post.content && post.content.length > 180
      ? post.content.slice(0, 180) + '...'
      : post.content || ''

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onLikeToggle?.(post._id, post.isLiked)
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onBookmarkToggle?.(post._id, post.isBookmarked)
  }

  return (
    <article className="border-b border-zinc-800 p-5 md:p-6 hover:bg-zinc-950/60 transition group">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <Link to={`/profile/${authorName}`} className="shrink-0">
          <AuthorAvatar author={post.author} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${authorName}`}
            className="text-sm font-medium text-zinc-200 hover:underline decoration-zinc-600 underline-offset-2"
          >
            {authorName}
          </Link>
          <span className="text-xs text-zinc-500">·</span>
          <span className="text-xs text-zinc-400">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Title */}
      <Link to={`/post/${post._id}`}>
        <h2 className="font-serif text-xl md:text-2xl font-bold text-white mt-3 cursor-pointer hover:underline decoration-zinc-600 underline-offset-4 leading-tight">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-zinc-400 line-clamp-2 mt-2 leading-relaxed">{excerpt}</p>

      {/* Bottom actions */}
      <div className="flex items-center justify-between mt-4 text-zinc-500 text-xs">
        <div className="flex items-center gap-5">
          {/* Comments */}
          <Link
            to={`/post/${post._id}#comments`}
            className="flex items-center gap-1.5 hover:text-zinc-300 transition"
          >
            <MessageCircle size={15} />
            <span>{post.commentsCount || 0}</span>
          </Link>

          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 cursor-pointer group/like transition"
            aria-label="Like post"
          >
            <Heart
              size={15}
              className={
                post.isLiked
                  ? 'fill-white text-white'
                  : 'text-zinc-500 group-hover/like:text-zinc-300'
              }
            />
            <span className={post.isLiked ? 'text-white' : ''}>{post.likesCount || 0}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className="cursor-pointer hover:text-white transition p-1 group/bm"
          aria-label={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
          title={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          <Bookmark
            size={15}
            className={
              post.isBookmarked
                ? 'fill-white text-white'
                : 'text-zinc-500 group-hover/bm:text-zinc-300 transition-colors'
            }
          />
        </button>
      </div>
    </article>
  )
}

export default function ExplorePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { limit: 50, sort: 'newest' }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      const response = await axios.get(`${API_BASE_URL}/post`, {
        params,
        withCredentials: true,
      })
      setPosts(response.data?.posts || [])
    } catch (err) {
      if (err.response?.status === 400 && searchQuery.trim()) {
        setPosts([])
      } else {
        setError(err.response?.data?.message || 'Failed to load posts.')
      }
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const debounce = setTimeout(fetchPosts, searchQuery ? 400 : 0)
    return () => clearTimeout(debounce)
  }, [fetchPosts, searchQuery])

  const handleLikeToggle = async (postId, currentlyLiked) => {
    try {
      if (currentlyLiked) {
        await axios.delete(`${API_BASE_URL}/post/${postId}/like`, {
          withCredentials: true,
        })
      } else {
        await axios.post(`${API_BASE_URL}/post/${postId}/like`, {}, {
          withCredentials: true,
        })
      }
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                isLiked: !currentlyLiked,
                likesCount: currentlyLiked
                  ? Math.max(0, (p.likesCount || 1) - 1)
                  : (p.likesCount || 0) + 1,
              }
            : p
        )
      )
    } catch (err) {
      console.error('Like toggle failed:', err)
    }
  }

  const handleBookmarkToggle = async (postId, currentlyBookmarked) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, isBookmarked: !currentlyBookmarked }
          : p
      )
    )

    try {
      if (currentlyBookmarked) {
        await axios.delete(`${API_BASE_URL}/bookmarks/${postId}`, {
          withCredentials: true,
        })
      } else {
        await axios.post(`${API_BASE_URL}/bookmarks/${postId}`, {}, {
          withCredentials: true,
        })
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err)
      // Revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, isBookmarked: currentlyBookmarked }
            : p
        )
      )
    }
  }

  return (
    <AppLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {loading && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-24 text-zinc-500 text-sm">
          <p>{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 text-white underline cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg font-serif text-zinc-400">
            {searchQuery ? 'No posts match your search.' : 'No posts yet.'}
          </p>
          <p className="text-xs mt-2 text-zinc-600">
            {searchQuery ? 'Try a different query.' : 'Be the first to write something.'}
          </p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}

