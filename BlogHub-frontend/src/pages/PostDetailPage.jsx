import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Trash2, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { Skeleton, SkeletonAvatar } from '../components/ui/Skeleton'
import { API_BASE_URL } from '../config/api'

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

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function AuthorAvatar({ user, size = 'md' }) {
  const avatarUrl = user?.profilePhoto || user?.avatar
  const username = user?.username || 'Author'
  const initials = username.slice(0, 2).toUpperCase()
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-sm'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`${sizeClasses} rounded-full object-cover border border-zinc-700 shrink-0`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center border border-zinc-700 shrink-0 select-none`}
    >
      {initials}
    </div>
  )
}

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const commentsSectionRef = useRef(null)

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Engagement states
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Comment input state
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState('')

  // Post delete state
  const [deletingPost, setDeletingPost] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadData = async () => {
      try {
        const postRes = await axios.get(`${API_BASE_URL}/post/${id}`, {
          withCredentials: true,
        })
        if (!ignore) {
          const postData = postRes.data?.post
          setPost(postData)
          setIsLiked(!!postData?.isLiked)
          setLikesCount(postData?.likesCount || 0)
          setIsBookmarked(!!postData?.isBookmarked)
          setLoading(false)
        }

        try {
          const commentsRes = await axios.get(`${API_BASE_URL}/comment/${id}/comments`, {
            withCredentials: true,
          })
          if (!ignore) {
            setComments(commentsRes.data?.comments || [])
          }
        } catch {
          if (!ignore) setComments([])
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || 'Post not found or failed to load.')
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      ignore = true
    }
  }, [id])

  // Like Toggle
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!previousLiked)
    setLikesCount(previousLiked ? Math.max(0, previousCount - 1) : previousCount + 1)

    try {
      if (previousLiked) {
        await axios.delete(`${API_BASE_URL}/post/${id}/like`, { withCredentials: true })
      } else {
        await axios.post(`${API_BASE_URL}/post/${id}/like`, {}, { withCredentials: true })
      }
    } catch {
      // Revert on failure
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
    }
  }

  // Bookmark Toggle
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const previousBookmarked = isBookmarked
    setIsBookmarked(!previousBookmarked)

    try {
      if (previousBookmarked) {
        await axios.delete(`${API_BASE_URL}/bookmarks/${id}`, { withCredentials: true })
      } else {
        await axios.post(`${API_BASE_URL}/bookmarks/${id}`, {}, { withCredentials: true })
      }
    } catch {
      setIsBookmarked(previousBookmarked)
    }
  }

  // Delete Post Handler
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    setDeletingPost(true)
    try {
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      await axios.delete(`${API_BASE_URL}/post/${id}`, {
        withCredentials: true,
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      })

      navigate('/explore')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post.')
      setDeletingPost(false)
    }
  }

  // Submit Comment Handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    setCommentError('')

    try {
      const res = await axios.post(
        `${API_BASE_URL}/comment/${id}/comments`,
        { text: newComment.trim() },
        { withCredentials: true }
      )

      if (res.data?.comment) {
        // Prepend or append new comment
        const createdComment = {
          ...res.data.comment,
          author: res.data.comment.author || {
            _id: user?.id,
            username: user?.username || 'You',
            profilePhoto: user?.profilePhoto,
          },
        }
        setComments((prev) => [...prev, createdComment])
        setNewComment('')
      }
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment. Try again.')
    } finally {
      setSubmittingComment(false)
    }
  }

  // Delete Comment Handler
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/comment/${commentId}`, { withCredentials: true })
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.')
    }
  }

  // Check if current user is post author
  const postAuthorId = post?.author?._id || post?.author
  const isPostAuthor = isAuthenticated && user && (user.id === postAuthorId || user._id === postAuthorId)

  // Estimated read time
  const wordCount = post?.content ? post.content.trim().split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Minimal Back Button / Skeleton Placeholder */}
        {loading ? (
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-28 bg-zinc-900 rounded" />
          </div>
        ) : (
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition mb-8 group select-none"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Explore</span>
          </Link>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="flex flex-col gap-6">
            {/* 1. Author Info Row Skeleton (Top) */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3.5">
                <SkeletonAvatar size="md" className="border border-zinc-800 shrink-0" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-36 bg-zinc-900/70 rounded" />
                </div>
              </div>
            </div>

            {/* 2. Smaller Balanced Title Skeleton */}
            <div className="space-y-2.5 mt-2">
              <Skeleton className="h-7 sm:h-8 w-11/12 rounded-lg" />
              <Skeleton className="h-7 sm:h-8 w-3/5 rounded-lg" />
            </div>

            {/* 3. Article Body Content Skeleton */}
            <div className="space-y-4 mt-2">
              <Skeleton className="h-4 w-full bg-zinc-900/90 rounded" />
              <Skeleton className="h-4 w-full bg-zinc-900/90 rounded" />
              <Skeleton className="h-4 w-11/12 bg-zinc-900/90 rounded" />
              <Skeleton className="h-4 w-4/5 bg-zinc-900/90 rounded" />
            </div>

            <div className="space-y-4 pt-1">
              <Skeleton className="h-4 w-full bg-zinc-900/85 rounded" />
              <Skeleton className="h-4 w-full bg-zinc-900/85 rounded" />
              <Skeleton className="h-4 w-5/6 bg-zinc-900/85 rounded" />
              <Skeleton className="h-4 w-3/4 bg-zinc-900/85 rounded" />
            </div>

            {/* 4. Engagement Bar Skeleton (Between hairline dividers) */}
            <div className="border-y border-zinc-800/80 py-3.5 my-2 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-6 h-3 rounded bg-zinc-900/70" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-6 h-3 rounded bg-zinc-900/70" />
                </div>
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </div>

            {/* 5. Discussion / Comments Skeleton */}
            <div className="pt-2 space-y-6">
              <Skeleton className="h-6 w-36 rounded" />
              <Skeleton className="h-24 w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl" />
              <div className="space-y-4 pt-2">
                {[1, 2].map((idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/40 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <SkeletonAvatar size="sm" className="border border-zinc-800 shrink-0" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3.5 w-24 rounded" />
                        <Skeleton className="h-3 w-16 bg-zinc-900/60 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-3.5 w-11/12 bg-zinc-900/80 rounded" />
                    <Skeleton className="h-3.5 w-2/3 bg-zinc-900/70 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Error Fallback ── */}
        {!loading && error && (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-serif font-bold text-white">Post Not Found</h2>
            <p className="text-sm text-zinc-400 max-w-md">{error}</p>
            <Link
              to="/explore"
              className="mt-2 text-xs font-mono bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full transition"
            >
              Return to Feed
            </Link>
          </div>
        )}

        {/* ── Post Content ── */}
        {!loading && !error && post && (
          <article className="flex flex-col">
            {/* 1. Author Info Row (Top) */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-3.5">
                <Link to={`/profile/${post.author?.username || 'Author'}`} className="shrink-0">
                  <AuthorAvatar user={post.author} size="md" />
                </Link>
                <div className="flex flex-col">
                  <Link
                    to={`/profile/${post.author?.username || 'Author'}`}
                    className="text-sm font-medium text-zinc-200 hover:underline decoration-zinc-600 underline-offset-2"
                  >
                    {post.author?.username || 'Author'}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mt-0.5">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>·</span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Subtle Delete Post action on the right if owned by logged-in user */}
              {isPostAuthor && (
                <button
                  type="button"
                  onClick={handleDeletePost}
                  disabled={deletingPost}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition cursor-pointer select-none py-1.5 px-3 rounded-md hover:bg-red-500/10"
                  title="Delete this post"
                >
                  <Trash2 size={14} />
                  <span>{deletingPost ? 'Deleting...' : 'Delete Post'}</span>
                </button>
              )}
            </div>

            {/* 2. Smaller Balanced Serif Title directly below author row */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug mt-7">
              {post.title}
            </h1>

            {/* Optional Cover Image */}
            {post.coverImage && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[420px] object-cover"
                />
              </div>
            )}

            {/* 3. Article Body Content directly below title */}
            <div className="text-base sm:text-lg text-zinc-300 leading-relaxed sm:leading-8 font-sans space-y-6 whitespace-pre-line selection:bg-zinc-800 mt-6">
              {post.content}
            </div>

            {/* 4. Engagement Bar placed below body content between thin silver hairline dividers */}
            <div className="border-y border-zinc-800/80 py-3.5 my-8 flex items-center justify-between text-xs text-zinc-400 font-mono select-none">
              <div className="flex items-center gap-6">
                {/* Like */}
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className="flex items-center gap-1.5 hover:text-white transition cursor-pointer group"
                  aria-label="Like post"
                >
                  <Heart
                    size={16}
                    className={
                      isLiked
                        ? 'fill-white text-white'
                        : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'
                    }
                  />
                  <span className={isLiked ? 'text-white' : ''}>{likesCount}</span>
                </button>

                {/* Comment count anchor */}
                <button
                  type="button"
                  onClick={() =>
                    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                  aria-label="View comments"
                >
                  <MessageCircle size={16} className="text-zinc-500" />
                  <span>{comments.length}</span>
                </button>

                {/* Bookmark */}
                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  className="flex items-center hover:text-white transition cursor-pointer group"
                  aria-label="Bookmark post"
                >
                  <Bookmark
                    size={16}
                    className={
                      isBookmarked
                        ? 'fill-white text-white'
                        : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'
                    }
                  />
                </button>
              </div>
            </div>

            {/* ── Comments Section ── */}
            <section
              id="comments"
              ref={commentsSectionRef}
              className="pt-2"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                  Discussion ({comments.length})
                </h2>
              </div>

              {/* Comment Input */}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="mb-10 flex flex-col gap-3">
                  {commentError && (
                    <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg">
                      {commentError}
                    </div>
                  )}
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a thoughtful response..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none outline-none transition"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-white text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs px-5 py-2 rounded-full transition cursor-pointer"
                    >
                      {submittingComment ? 'Posting...' : 'Respond'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-10 p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-sm text-zinc-400">
                  <span>Want to join the discussion? </span>
                  <Link to="/login" className="text-white underline hover:text-zinc-200 font-medium">
                    Log in
                  </Link>
                  <span> to leave a comment.</span>
                </div>
              )}

              {/* Comments Stream */}
              {comments.length === 0 ? (
                <div className="py-12 text-center text-zinc-600 text-sm font-mono">
                  No comments yet. Be the first to share your thoughts.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-zinc-800/60">
                  {comments.map((comment) => {
                    const commentAuthorId = comment.author?._id || comment.author
                    const isCommentOwner =
                      isAuthenticated && user && (user.id === commentAuthorId || user._id === commentAuthorId)

                    return (
                      <div key={comment._id} className="py-5 flex flex-col gap-2">
                        {/* Author info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <AuthorAvatar user={comment.author} size="sm" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-zinc-300">
                                {comment.author?.username || 'Member'}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Delete comment action */}
                          {isCommentOwner && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-zinc-600 hover:text-red-400 transition cursor-pointer p-1"
                              title="Delete comment"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        {/* Comment Text */}
                        <p className="text-sm text-zinc-300 leading-relaxed pl-9 whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </article>
        )}
      </div>
    </AppLayout>
  )
}
