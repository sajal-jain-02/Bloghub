import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, Heart, MessageCircle } from 'lucide-react'
import axios from 'axios'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { SkeletonCard } from '../components/ui/Skeleton'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function timeAgo(dateString) {
  if (!dateString) return ''
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
  const username = author?.username || 'Author'
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

function BookmarkedItem({ post, onUnbookmark, onLikeToggle }) {
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

  return (
    <article className="border-b border-zinc-800 p-5 md:p-6 hover:bg-zinc-950/60 transition group">
      {/* Author Row */}
      <div className="flex items-center gap-3">
        <AuthorAvatar author={post.author} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-200">{authorName}</span>
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
      <p className="text-sm text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
        {excerpt}
      </p>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-4 text-zinc-500 text-xs">
        <div className="flex items-center gap-5">
          {/* Comments count */}
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
            <span className={post.isLiked ? 'text-white' : ''}>
              {post.likesCount || 0}
            </span>
          </button>
        </div>

        {/* Unbookmark toggle */}
        <button
          type="button"
          onClick={() => onUnbookmark?.(post._id)}
          className="cursor-pointer hover:text-white transition p-1"
          title="Remove from bookmarks"
          aria-label="Remove bookmark"
        >
          <Bookmark size={16} className="fill-white text-white hover:text-zinc-300" />
        </button>
      </div>
    </article>
  )
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let ignore = false

    const loadBookmarks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
          withCredentials: true,
        })
        if (!ignore) {
          setBookmarks(res.data?.bookmarks || [])
          setLoading(false)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load bookmarks.')
          setLoading(false)
        }
      }
    }

    loadBookmarks()

    return () => {
      ignore = true
    }
  }, [])

  const retryFetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_BASE_URL}/bookmarks`, {
        withCredentials: true,
      })
      setBookmarks(res.data?.bookmarks || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookmarks.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnbookmark = async (postId) => {
    const previousBookmarks = [...bookmarks]
    // Optimistic removal
    setBookmarks((prev) => prev.filter((b) => (b.post?._id || b.post) !== postId))

    try {
      await axios.delete(`${API_BASE_URL}/bookmarks/${postId}`, {
        withCredentials: true,
      })
    } catch (err) {
      console.error('Failed to remove bookmark:', err)
      // Rollback on error
      setBookmarks(previousBookmarks)
    }
  }

  const handleLikeToggle = async (postId, currentlyLiked) => {
    setBookmarks((prev) =>
      prev.map((b) => {
        const p = b.post
        if (!p || (p._id || p) !== postId) return b
        return {
          ...b,
          post: {
            ...p,
            isLiked: !currentlyLiked,
            likesCount: currentlyLiked
              ? Math.max(0, (p.likesCount || 1) - 1)
              : (p.likesCount || 0) + 1,
          },
        }
      })
    )

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
    } catch (err) {
      console.error('Like toggle failed:', err)
    }
  }

  // Filter bookmarked posts by search query if user types in search bar
  const filteredBookmarks = bookmarks.filter((b) => {
    if (!b.post) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const titleMatch = b.post.title?.toLowerCase().includes(q)
    const contentMatch = b.post.content?.toLowerCase().includes(q)
    const authorMatch =
      typeof b.post.author === 'object' &&
      b.post.author?.username?.toLowerCase().includes(q)
    return titleMatch || contentMatch || authorMatch
  })

  return (
    <AppLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Editorial Header */}
      <div className="border-b border-zinc-800 px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Reading List
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            {loading
              ? 'Loading saved articles...'
              : `${bookmarks.length} ${
                  bookmarks.length === 1 ? 'saved story' : 'saved stories'
                }`}
          </p>
        </div>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <div className="text-center py-24 text-zinc-500 text-sm">
          <p>{error}</p>
          <button
            onClick={retryFetch}
            className="mt-4 text-white underline cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && bookmarks.length === 0 && (
        <div className="py-24 text-center px-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
            <Bookmark size={20} />
          </div>
          <h2 className="text-lg font-serif font-bold text-zinc-300">
            No saved articles yet
          </h2>
          <p className="text-xs text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
            Save articles from your feed to curate your reading list and revisit them anytime.
          </p>
          <Link
            to="/explore"
            className="mt-6 text-xs font-medium bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-full transition"
          >
            Explore Articles
          </Link>
        </div>
      )}

      {/* ── Filtered Out State ── */}
      {!loading && !error && bookmarks.length > 0 && filteredBookmarks.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-base font-serif text-zinc-400">
            No bookmarks match "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs text-white underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Saved Posts Stream ── */}
      {!loading && !error && filteredBookmarks.length > 0 && (
        <div>
          {filteredBookmarks.map((bookmark) => (
            <BookmarkedItem
              key={bookmark._id}
              post={bookmark.post}
              onUnbookmark={handleUnbookmark}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      )}
    </AppLayout>
  )
}
