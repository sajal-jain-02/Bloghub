import { Link } from 'react-router-dom'
import AuroraText from '../ui/AuroraText'
import Sparkles from '../ui/Sparkles'

export default function Hero() {
  return (
    <section id="home" className="relative w-full bg-obsidian min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-8 overflow-hidden border-b border-chrome/10">
      {/* Background Sparkles */}
      <Sparkles />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Accent Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-chrome/20 text-chrome text-xs font-mono tracking-widest uppercase mb-8 animate-bounce">
          <span className="text-chrome/40">✦</span> Welcome to BlogHub <span className="text-chrome/40">✦</span>
        </div>

        {/* Subhead Intro */}
        <p className="text-sm sm:text-base text-chrome/70 uppercase tracking-widest font-mono mb-4">
          The ultimate space where deep thoughts meet readers
        </p>

        {/* Massive Headline */}
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-chrome-bright tracking-tight">
            Start your storytelling journey on
            <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none text-chrome-bright mt-2">
              <AuroraText>BLOGHUB</AuroraText>
            </div>
          </h1>
        </div>

        {/* Descriptive Text */}
        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-chrome max-w-3xl leading-relaxed">
          A minimal, distraction-free space to publish your ideas, discover deep technical insights, and build a dedicated readership. Read, write, and grow with a community that values words.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 mt-10">
          <Link
            to="/register"
            className="bg-crimson text-white px-8 py-3.5 rounded-full font-medium hover:bg-crimson/90 transition shadow-sm shadow-crimson/30 hover:shadow-md hover:shadow-crimson/50 inline-block text-center cursor-pointer"
          >
            Start Writing
          </Link>
          <a
            href="#trending"
            className="border border-chrome/20 text-chrome-bright px-8 py-3.5 rounded-full font-medium hover:bg-chrome/10 transition inline-block text-center cursor-pointer"
          >
            Explore Blogs
          </a>
        </div>

        {/* Editor Mockup Card */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto bg-gradient-to-br from-[#121316] to-[#0a0b0d] backdrop-blur-md border border-chrome/15 rounded-2xl p-6 md:p-10 text-left shadow-2xl min-h-[250px] flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-chrome/10 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]/80" />
            </div>
            <span className="text-xs font-mono text-chrome/60">draft.md</span>
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Body */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-chrome-bright font-mono">
              # Building Scalable Architecture
            </h2>
            <p className="text-chrome font-sans text-sm md:text-base leading-relaxed">
              Modern distributed systems demand high reliability, clean abstraction boundaries, and resilient workflows. When designing resilient event-driven architectures, isolating critical pipelines prevents cascade failures across downstream microservices.
              <span className="inline-block w-[2px] h-5 bg-crimson animate-pulse ml-1 align-middle" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
