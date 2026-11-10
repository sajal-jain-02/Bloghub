import logo from '../../assets/logo.png'

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Explore', href: '#explore' },
  { name: 'Top Writers', href: '#top-writers' },
  { name: 'About', href: '#about' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/90 backdrop-blur-md border-b border-chrome/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none group">
          <img
            src={logo}
            alt="BlogHub"
            className="w-8 h-8 object-contain rounded-lg shadow-sm border border-chrome/15 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif font-bold text-2xl tracking-tight text-chrome-bright">
            Blog<span className="text-crimson">Hub</span>
          </span>
        </div>

        {/* Center Navigation (hidden on mobile, visible on desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-chrome/80 hover:text-chrome-bright transition-colors duration-150"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-chrome hover:text-crimson px-3 py-2 transition-colors"
          >
            Login
          </button>
          <button
            type="button"
            className="text-sm font-medium bg-crimson hover:bg-crimson/90 text-white px-5 py-2 rounded-full transition-all duration-150 shadow-sm shadow-crimson/30"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
