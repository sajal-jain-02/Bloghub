import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, Bookmark, User, Plus, Search, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-800 text-white text-xs font-bold flex items-center justify-center border border-zinc-700 group-hover:border-zinc-500 transition">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-1 z-50">
          <Link
            to="/profile/me"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

const sideNavItems = [
  { name: 'Home', path: '/explore', icon: Home },
  { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  { name: 'Profile', path: '/profile/me', icon: User },
]

export default function AppLayout({ children, searchQuery, onSearchChange }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/write')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto min-h-screen flex flex-col border-x border-zinc-800/60">
        {/* ── Top Sticky Header ── */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo + Wordmark */}
          <Link
            to={isAuthenticated ? '/explore' : '/'}
            className="flex items-center gap-2.5 shrink-0 select-none group"
          >
            <img
              src={logo}
              alt="BlogHub"
              className="w-7 h-7 object-contain rounded-lg border border-zinc-800"
            />
            <span className="font-serif font-bold text-lg tracking-tight text-white">
              Blog<span className="text-[#FF003C]">Hub</span>
            </span>
          </Link>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center max-w-md">
            <div className="relative w-full">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search posts..."
                className="bg-zinc-900/90 border border-zinc-800 focus:border-zinc-600 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 w-full outline-none transition"
              />
            </div>
          </div>

          {/* Right: Desktop actions (Only User Avatar / Login link) */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Log in
              </Link>
            )}
          </div>
        </header>

        {/* ── Body: Sidebar + Content ── */}
        <div className="flex flex-1">
          {/* Left Sticky Navigation Rail (Desktop) */}
          <nav className="hidden md:flex flex-col w-56 shrink-0 border-r border-zinc-800 py-6 px-4 gap-1 sticky top-16 h-[calc(100vh-4rem)]">
            {sideNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}

            {/* Desktop Full-width + Write button */}
            <button
              onClick={handleWriteClick}
              className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-medium text-sm py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus size={16} />
              Write
            </button>
          </nav>

          {/* Main Content */}
          <main className="flex-1 w-full pb-20 md:pb-12">{children}</main>
        </div>
      </div>

      {/* ── Mobile Fixed Bottom Nav with Circular Active Indicators ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-black/95 backdrop-blur-md border-t border-zinc-800 h-16 flex items-center justify-around px-4">
        {/* 1. Home */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `w-10 h-10 rounded-full flex items-center justify-center transition ${
              isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-white'
            }`
          }
          aria-label="Home"
        >
          <Home size={20} />
        </NavLink>

        {/* 2. Create Post */}
        <button
          onClick={handleWriteClick}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg cursor-pointer hover:bg-zinc-200 transition"
          aria-label="Create post"
        >
          <Plus size={20} />
        </button>

        {/* 3. Bookmarks */}
        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            `w-10 h-10 rounded-full flex items-center justify-center transition ${
              isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-white'
            }`
          }
          aria-label="Bookmarks"
        >
          <Bookmark size={20} />
        </NavLink>

        {/* 4. Profile */}
        <NavLink
          to={isAuthenticated ? '/profile/me' : '/login'}
          className={({ isActive }) =>
            `w-10 h-10 rounded-full flex items-center justify-center transition ${
              isActive
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-white'
            }`
          }
          aria-label="Profile"
        >
          <User size={20} />
        </NavLink>
      </nav>
    </div>
  )
}
