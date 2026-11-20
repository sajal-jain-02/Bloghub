import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Bookmark, Heart, MessageCircle, X } from 'lucide-react'
import axios from 'axios'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import { SkeletonCard, SkeletonAvatar } from '../components/ui/Skeleton'
import { API_BASE_URL } from '../config/api'

function timeAgo(dateString) {
  if (!dateString) return ''
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins || 1}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function ProfilePostItem({ post, onLikeToggle, onBookmarkToggle }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const excerpt =
    post.content && post.content.length > 180
      ? post.content.slice(0, 180) + '...'
      : post.content || ''

  const handleLike = () => {
    if (!isAuthenticated) return navigate('/login')
    onLikeToggle?.(post._id, post.isLiked)
  }

  const handleBookmark = () => {
    if (!isAuthenticated) return navigate('/login')
    onBookmarkToggle?.(post._id, post.isBookmarked)
  }

  return (
    <article className="py-5 border-b border-zinc-800 hover:bg-zinc-950/60 transition group">
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
        <span>{timeAgo(post.createdAt)}</span>
      </div>

      <Link to={`/post/${post._id}`}>
        <h3 className="font-serif text-lg md:text-xl font-bold text-white mt-2 hover:underline decoration-zinc-600 underline-offset-4 leading-snug">
          {post.title}
        </h3>
      </Link>

      <p className="text-sm text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
        {excerpt}
      </p>

      <div className="flex items-center justify-between mt-4 text-xs text-zinc-500">
        <div className="flex items-center gap-5">
          <Link
            to={`/post/${post._id}#comments`}
            className="flex items-center gap-1.5 hover:text-zinc-300 transition"
          >
            <MessageCircle size={15} />
            <span>{post.commentsCount || 0}</span>
          </Link>

          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-300 transition"
            aria-label="Like post"
          >
            <Heart
              size={15}
              className={post.isLiked ? 'fill-white text-white' : ''}
            />
            <span className={post.isLiked ? 'text-white' : ''}>
              {post.likesCount || 0}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className="cursor-pointer hover:text-white transition p-1"
          aria-label={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          <Bookmark
            size={15}
            className={post.isBookmarked ? 'fill-white text-white' : ''}
          />
        </button>
      </div>
    </article>
  )
}

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const isMeRoute = !username || username === 'me'
  const [profile, setProfile] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Edit Bio modal state
  const [isEditing, setIsEditing] = useState(false)
  const [bioInput, setBioInput] = useState('')
  const [savingBio, setSavingBio] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadProfileData = async () => {
      try {
        const endpoint = isMeRoute
          ? `${API_BASE_URL}/profile/me`
          : `${API_BASE_URL}/profile/${username}`

        const res = await axios.get(endpoint, { withCredentials: true })
        if (ignore) return

        const data = res.data?.user || res.data
        const ownerStatus =
          res.data?.isOwner ??
          (currentUser &&
            (String(currentUser.id || currentUser._id) ===
              String(data.id || data._id) ||
              currentUser.username === data.username))

        setProfile(data)
        setIsOwner(!!ownerStatus)
        setIsFollowing(!!data.isFollowing)
        setFollowersCount(data.followersCount || 0)
        setFollowingCount(data.followingCount || 0)
        setBioInput(data.bio || '')
        setLoading(false)

        // Fetch User Posts
        const userId = data.id || data._id
        if (userId) {
          try {
            const postsRes = await axios.get(
              `${API_BASE_URL}/post/user/${userId}`,
              { withCredentials: true }
            )
            if (!ignore) {
              setPosts(postsRes.data?.posts || [])
            }
          } catch {
            if (!ignore) setPosts([])
          } finally {
            if (!ignore) setPostsLoading(false)
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || 'Profile not found.')
          setLoading(false)
          setPostsLoading(false)
        }
      }
    }

    loadProfileData()

    return () => {
      ignore = true
    }
  }, [username, isMeRoute, currentUser])

  // Follow / Unfollow Toggle
  const handleFollowToggle = async () => {
    if (!isAuthenticated) return navigate('/login')
    if (!profile?.id && !profile?._id) return

    const targetId = profile.id || profile._id
    const prevFollowing = isFollowing
    const prevFollowersCount = followersCount

    setIsFollowing(!prevFollowing)
    setFollowersCount(
      prevFollowing ? Math.max(0, prevFollowersCount - 1) : prevFollowersCount + 1
    )
    setFollowLoading(true)

    try {
      if (prevFollowing) {
        await axios.delete(`${API_BASE_URL}/profile/${targetId}/follow`, {
          withCredentials: true,
        })
      } else {
        await axios.post(
          `${API_BASE_URL}/profile/${targetId}/follow`,
          {},
          { withCredentials: true }
        )
      }
    } catch (err) {
      console.error('Follow toggle error:', err)
      setIsFollowing(prevFollowing)
      setFollowersCount(prevFollowersCount)
    } finally {
      setFollowLoading(false)
    }
  }

  // Save Bio
  const handleSaveBio = async (e) => {
    e.preventDefault()
    setSavingBio(true)
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/profile/me`,
        { bio: bioInput.trim() },
        { withCredentials: true }
      )
      setProfile((prev) => ({ ...prev, bio: res.data?.user?.bio || bioInput.trim() }))
      setIsEditing(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update bio.')
    } finally {
      setSavingBio(false)
    }
  }

  // Post engagement handlers
  const handlePostLikeToggle = async (postId, currentlyLiked) => {
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

    try {
      if (currentlyLiked) {
        await axios.delete(`${API_BASE_URL}/post/${postId}/like`, { withCredentials: true })
      } else {
        await axios.post(`${API_BASE_URL}/post/${postId}/like`, {}, { withCredentials: true })
      }
    } catch (err) {
      console.error('Post like failed:', err)
    }
  }

  const handlePostBookmarkToggle = async (postId, currentlyBookmarked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, isBookmarked: !currentlyBookmarked } : p
      )
    )

    try {
      if (currentlyBookmarked) {
        await axios.delete(`${API_BASE_URL}/bookmarks/${postId}`, { withCredentials: true })
      } else {
        await axios.post(`${API_BASE_URL}/bookmarks/${postId}`, {}, { withCredentials: true })
      }
    } catch (err) {
      console.error('Post bookmark failed:', err)
    }
  }

  const initials = profile?.username ? profile.username.slice(0, 2).toUpperCase() : '??'

  return (
    <AppLayout>
      {/* ── 1. Cover Banner ── */}
      <div className="relative w-full h-40 md:h-48 bg-zinc-950 border-b border-zinc-800 overflow-hidden">
        {profile?.coverPhoto ? (
          <img
            src={profile.coverPhoto}
            alt="Cover banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950" />
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {/* ── 2. Overlapping Center Avatar ── */}
        <div className="relative flex justify-center">
          <div className="w-36 h-36 md:w-40 md:h-40 rounded-full -mt-12 md:-mt-14 mx-auto border-4 border-white bg-zinc-900 overflow-hidden shrink-0 flex items-center justify-center select-none shadow-2xl">
            {loading ? (
              <SkeletonAvatar size="lg" className="w-full h-full rounded-full" />
            ) : profile?.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl md:text-2xl font-bold font-serif text-white">
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="py-20 text-center flex flex-col items-center">
            <h2 className="text-xl font-serif font-bold text-white">User Not Found</h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-sm">{error}</p>
            <Link
              to="/explore"
              className="mt-5 text-xs font-medium bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-full transition"
            >
              Return to Feed
            </Link>
          </div>
        )}

        {/* ── 3. Left-Aligned Identity Block with Right Action ── */}
        {!loading && !error && profile && (
          <>
            <div className="flex items-start justify-between gap-4 mt-4">
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                  {profile.username}
                </h1>
                {profile.bio ? (
                  <p className="text-sm text-zinc-300 mt-2 max-w-lg leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-xs text-zinc-600 italic mt-1 font-mono">
                    {isOwner
                      ? 'No bio yet. Click Edit Profile to add one.'
                      : 'No bio provided.'}
                  </p>
                )}
              </div>

              <div>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-medium px-4 py-2 rounded-full border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 text-zinc-200 transition cursor-pointer select-none"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`text-xs font-medium px-5 py-2 rounded-full transition cursor-pointer select-none ${
                      isFollowing
                        ? 'border border-zinc-700 bg-transparent text-zinc-300 hover:border-red-500/50 hover:text-red-400'
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* ── 4. Followers & Following Strip ── */}
            <div className="flex items-center gap-6 mt-6 pb-6 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <div>
                <span className="font-bold text-white text-sm mr-1.5">{followersCount}</span>
                <span>Followers</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm mr-1.5">{followingCount}</span>
                <span>Following</span>
              </div>
              <div>
                <span className="font-bold text-white text-sm mr-1.5">{posts.length}</span>
                <span>{posts.length === 1 ? 'Post' : 'Posts'}</span>
              </div>
            </div>

            {/* ── 5. Published Posts Feed ── */}
            <div className="mt-8 pb-12">
              <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Published Articles
              </h2>

              {postsLoading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
                  <p className="font-serif text-base text-zinc-400">
                    No published articles yet
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {isOwner
                      ? 'Draft your first story and share it with the community.'
                      : 'This author has not published any stories yet.'}
                  </p>
                  {isOwner && (
                    <Link
                      to="/write"
                      className="mt-5 text-xs font-medium bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-full transition"
                    >
                      Start Writing
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {posts.map((post) => (
                    <ProfilePostItem
                      key={post._id}
                      post={post}
                      onLikeToggle={handlePostLikeToggle}
                      onBookmarkToggle={handlePostBookmarkToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Clean Edit Bio Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="font-serif text-lg font-bold text-white">Edit Bio</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white transition p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="mt-4 flex flex-col gap-4">
              <div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell the community about yourself..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 text-sm text-white placeholder:text-zinc-600 resize-none outline-none transition"
                />
                <span className="text-[11px] font-mono text-zinc-500 mt-1 block text-right">
                  {bioInput.length}/500
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-mono text-zinc-400 hover:text-white px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBio}
                  className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs font-medium px-5 py-2 rounded-full transition cursor-pointer"
                >
                  {savingBio ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

