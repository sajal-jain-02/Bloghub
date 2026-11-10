export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-8 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-chrome/80">
        <span>© {new Date().getFullYear()} BlogHub. Crafted for creators.</span>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
