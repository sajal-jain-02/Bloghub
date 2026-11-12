import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Trending', href: '#trending' },
  { name: "Editor's Picks", href: '#featured' },
  { name: 'Platform', href: '#features' },
  { name: 'Manifesto', href: '#manifesto' },
]

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

  const avatarUrl = user?.profilePhoto || user?.avatar
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.username || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-chrome/20 group-hover:border-chrome/50 transition"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white text-xs font-bold flex items-center justify-center border border-chrome/20 group-hover:border-chrome/50 transition">
            {initials}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-chrome/60 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#121316] border border-chrome/15 rounded-lg shadow-2xl py-1 z-50">
          <Link
            to="/profile/me"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-chrome hover:bg-white/[0.06] hover:text-white transition"
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-crimson hover:bg-white/[0.06] transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    if (location.pathname !== '/') {
      navigate(`/${href}`)
      return
    }

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/90 backdrop-blur-md border-b border-chrome/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Brand Identity */}
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <img
            src={logo}
            alt="BlogHub"
            className="w-8 h-8 object-contain rounded-lg shadow-sm border border-chrome/15 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif font-bold text-2xl tracking-tight text-white">
            Blog<span className="text-[#FF003C]">Hub</span>
          </span>
        </Link>

        {/* Center Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-chrome/80 hover:text-crimson transition-colors duration-150 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/explore"
                className="text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 px-4 py-2 rounded-full transition-all duration-150 flex items-center gap-2 cursor-pointer"
              >
                Open Feed
              </Link>
              <UserDropdown user={user} onLogout={logout} />
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-chrome hover:text-crimson px-3 py-2 transition-colors cursor-pointer"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-crimson hover:bg-crimson/90 text-white px-5 py-2 rounded-full transition-all duration-150 shadow-sm shadow-crimson/30 cursor-pointer"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-chrome hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-obsidian/95 border-b border-chrome/15 px-6 py-6 flex flex-col gap-4 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-base font-medium text-chrome hover:text-crimson transition-colors py-1 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-4 border-t border-chrome/10">
            {isAuthenticated ? (
              <>
                <Link
                  to="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium bg-white/10 text-white border border-white/15 px-4 py-2 rounded-full text-center transition-all flex-1"
                >
                  Open Feed
                </Link>
                <Link
                  to="/profile/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-chrome hover:text-white px-4 py-2 rounded-full text-center border border-chrome/15 flex-1"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="text-sm font-medium text-crimson px-3 py-2 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-chrome hover:text-crimson px-3 py-2 transition-colors flex-1 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium bg-crimson hover:bg-crimson/90 text-white px-5 py-2 rounded-full text-center transition-all duration-150 flex-1"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
