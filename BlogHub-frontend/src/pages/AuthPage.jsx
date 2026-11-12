import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import peacefulImage from '../assets/peaceful-image.jpg'

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const { login, register, isLoading, error: authError, setError: setAuthError } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (localError) setLocalError('')
    if (authError) setAuthError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (mode === 'login') {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setLocalError(result.error || 'Login failed. Please check your credentials.')
      }
    } else {
      const result = await register(
        formData.username,
        formData.email,
        formData.password
      )
      if (result.success) {
        navigate('/')
      } else {
        setLocalError(result.error || 'Registration failed. Please check your details.')
      }
    }
  }

  const displayedError = localError || authError

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0B0C10] text-white">
      {/* ── Left Column (Visual Showcase - pure foliage & sky container) ── */}
      <div className="hidden lg:block relative w-full h-full overflow-hidden">
        <img
          src={peacefulImage}
          alt="Peaceful nature perspective"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ── Right Column (Interactive Credentials Form) ── */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:px-16 relative">
        {/* Top navigation */}
        <div className="w-full max-w-sm flex items-center justify-between mb-8 text-xs font-mono">
          <Link
            to="/"
            className="text-chrome/50 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>←</span> Back to home
          </Link>
          <Link
            to={mode === 'login' ? '/register' : '/login'}
            className="text-chrome/70 hover:text-crimson transition-colors"
          >
            {mode === 'login' ? 'No account? Sign up' : 'Already have an account? Log in'}
          </Link>
        </div>

        {/* Form Card wrapper */}
        <div className="w-full max-w-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-white">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-chrome/60 font-sans">
              {mode === 'login'
                ? 'Sign in to access your sanctuary.'
                : 'Start publishing without algorithms.'}
            </p>
          </div>

          {/* Form */}
          <form key={mode} onSubmit={handleSubmit} className="flex flex-col gap-4">
            {displayedError && (
              <div className="bg-crimson/10 border border-crimson/30 text-crimson text-xs p-3 rounded-lg leading-relaxed">
                {displayedError}
              </div>
            )}

            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-chrome/70 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your username"
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white placeholder:text-white/30 text-sm transition-all"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-chrome/70 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white placeholder:text-white/30 text-sm transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-chrome/70 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white placeholder:text-white/30 text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-crimson text-white font-medium text-sm rounded-lg hover:bg-[#d40032] transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_25px_rgba(255,0,60,0.5)] cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Get Started'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
