import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/logo.png'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Trending', href: '#trending' },
  { name: "Editor's Picks", href: '#featured' },
  { name: 'Platform', href: '#features' },
  { name: 'Manifesto', href: '#manifesto' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <span className="font-serif font-bold text-2xl tracking-tight text-chrome-bright">
            Blog<span className="text-crimson">Hub</span>
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
          </div>
        </div>
      )}
    </header>
  )
}
