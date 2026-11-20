import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Image as ImageIcon } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'

export default function WritePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const textareaRef = useRef(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showCoverInput, setShowCoverInput] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [error, setError] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Calculate live word count and read time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleContentChange = (e) => {
    setContent(e.target.value)
    if (error) setError('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 400)}px`
    }
  }

  const handlePublish = useCallback(async (e) => {
    if (e) e.preventDefault()

    if (!title.trim()) {
      setError('Please provide a title for your article.')
      return
    }

    if (!content.trim()) {
      setError('Please write some content before publishing.')
      return
    }

    setIsPublishing(true)
    setError('')

    try {
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      const payload = {
        title: title.trim(),
        content: content.trim(),
      }

      if (coverImage.trim()) {
        payload.coverImage = coverImage.trim()
      }

      await axios.post(`${API_BASE_URL}/post`, payload, {
        withCredentials: true,
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      })

      navigate('/explore')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to publish post. Please try again.'
      )
    } finally {
      setIsPublishing(false)
    }
  }, [title, content, coverImage, navigate])

  // Ctrl+Enter or Cmd+Enter keyboard shortcut to publish
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (title.trim() && content.trim() && !isPublishing) {
          handlePublish()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePublish, title, content, isPublishing])

  const authorDisplayName = user?.name || user?.username || 'Author'

  return (
    <div className="bg-black text-white min-h-screen flex flex-col selection:bg-zinc-800">
      {/* ── Full-Width Top Studio Header ── */}
      <header className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-zinc-800 h-16 px-6 flex items-center justify-between">
        {/* Left group */}
        <div className="flex items-center gap-3">
          <Link
            to="/explore"
            className="text-sm font-mono text-zinc-400 hover:text-white transition flex items-center gap-1.5"
          >
            <span>←</span> Back
          </Link>

          <div className="h-4 w-[1px] bg-zinc-800" />

          <span className="font-serif font-bold text-sm tracking-tight text-white select-none">
            Blog<span className="text-[#FF003C]">Hub</span>
          </span>

          <span className="text-xs font-mono text-zinc-500 bg-zinc-900/80 border border-zinc-800 rounded-full px-2.5 py-0.5 hidden sm:inline-block">
            Drafting as {authorDisplayName}
          </span>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block">
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {readTime} min read
          </span>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || !title.trim() || !content.trim()}
            className="bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 font-medium text-sm px-5 py-2 rounded-full transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ── Centered Editorial Canvas ── */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 flex flex-col">
        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800/60 text-red-300 text-xs p-3.5 rounded-lg leading-relaxed">
            {error}
          </div>
        )}

        {/* Optional Cover Image Toggle */}
        <div className="mb-4 flex flex-col gap-3">
          {!coverImage && (
            <button
              type="button"
              onClick={() => setShowCoverInput(!showCoverInput)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1.5 cursor-pointer self-start select-none"
            >
              <ImageIcon size={14} />
              {showCoverInput ? 'Cancel cover image' : '+ Add cover image'}
            </button>
          )}

          {showCoverInput && !coverImage && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Paste image URL (https://...)..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCoverInput(false)
                  setCoverImage('')
                }}
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300 px-2 py-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          {/* Live Cover Preview */}
          {coverImage.trim() && (
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
              <img
                src={coverImage.trim()}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage('')
                  setShowCoverInput(false)
                }}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 hover:bg-black text-zinc-300 hover:text-white transition text-xs font-mono border border-zinc-700 cursor-pointer"
              >
                Remove cover
              </button>
            </div>
          )}
        </div>

        {/* Article Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
          placeholder="Article Title..."
          autoFocus
          className="w-full text-4xl md:text-5xl font-serif font-bold tracking-tight bg-transparent text-white placeholder:text-zinc-700 focus:outline-none leading-tight"
        />

        {/* Silver Hairline Divider */}
        <div className="border-b border-zinc-800/80 my-6" />

        {/* Auto-Expanding Story Body Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Write your story..."
          className="w-full min-h-[55vh] text-lg text-zinc-200 leading-8 bg-transparent placeholder:text-zinc-700 focus:outline-none resize-none overflow-hidden"
        />

        {/* Bottom Hint */}
        <div className="mt-8 pt-4 border-t border-zinc-900 text-xs font-mono text-zinc-600 select-none">
          Press Ctrl + Enter to publish
        </div>
      </main>
    </div>
  )
}
