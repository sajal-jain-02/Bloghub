import { Link } from 'react-router-dom'
import AuroraText from '../ui/AuroraText'
import Sparkles from '../ui/Sparkles'
import { useAuth } from '../../context/AuthContext'

export default function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section id="home" className="relative w-full bg-obsidian flex flex-col items-center justify-center px-6 py-8 sm:py-12 overflow-hidden border-b border-chrome/10">
      {/* Background Sparkles */}
      <Sparkles />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Accent Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/[0.03] border border-chrome/20 text-chrome text-xs font-mono tracking-widest uppercase mb-5 animate-bounce">
          <span className="text-chrome/40">✦</span> Welcome to BlogHub <span className="text-chrome/40">✦</span>
        </div>

        {/* Subhead Intro */}
        <p className="text-xs sm:text-sm text-chrome/70 uppercase tracking-widest font-mono mb-3">
          The ultimate space where deep thoughts meet readers
        </p>

        {/* Scaled Headline (Fits cleanly above the fold at 100% zoom) */}
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-chrome-bright tracking-tight">
            Start your storytelling journey on
            <div className="text-4xl sm:text-5xl lg:text-8xl font-black tracking-tight leading-none text-chrome-bright mt-1">
              <AuroraText>BLOGHUB</AuroraText>
            </div>
          </h1>
        </div>

        {/* Descriptive Text */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-chrome max-w-2xl leading-relaxed">
          A minimal, distraction-free space to publish your ideas, discover deep technical insights, and build a dedicated readership. Read, write, and grow with a community that values words.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row gap-3.5 mt-6">
          <Link
            to={isAuthenticated ? '/write' : '/login'}
            className="bg-crimson text-white px-7 py-2.5 rounded-full font-medium text-sm hover:bg-crimson/90 transition shadow-sm shadow-crimson/30 hover:shadow-md hover:shadow-crimson/50 inline-block text-center cursor-pointer"
          >
            Start Writing
          </Link>
          <Link
            to="/explore"
            className="border border-chrome/20 text-chrome-bright px-7 py-2.5 rounded-full font-medium text-sm hover:bg-chrome/10 transition inline-block text-center cursor-pointer"
          >
            Explore Blogs
          </Link>
        </div>

        {/* Editor Mockup Card */}
        <div className="relative z-10 mt-8 w-full max-w-4xl mx-auto bg-gradient-to-br from-[#121316] to-[#0a0b0d] backdrop-blur-md border border-chrome/15 rounded-xl p-5 md:p-6 text-left shadow-2xl flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-chrome/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
            </div>
            <span className="text-xs font-mono text-chrome/60">draft.md</span>
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Body */}
          <div className="space-y-2.5">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-chrome-bright font-mono">
              # Building Scalable Architecture
            </h2>
            <p className="text-chrome font-sans text-xs sm:text-sm leading-relaxed">
              Modern distributed systems demand high reliability, clean abstraction boundaries, and resilient workflows. When designing resilient event-driven architectures, isolating critical pipelines prevents cascade failures across downstream microservices.
              <span className="inline-block w-[2px] h-4 bg-crimson animate-pulse ml-1 align-middle" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
