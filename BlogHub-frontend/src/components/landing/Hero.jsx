import AuroraText from '../ui/AuroraText'
import Sparkles from '../ui/Sparkles'

export default function Hero() {
  return (
    <section className="relative w-full bg-cream min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-8 overflow-hidden border-b border-ink-faint">
      {/* Background Sparkles */}
      <Sparkles />

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Accent Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-4 animate-bounce">
          ✨ Welcome to BlogHub ✨
        </div>

        {/* Subhead Intro */}
        <p className="text-sm sm:text-base text-ink-muted uppercase tracking-widest font-mono mb-4">
          The ultimate space where deep thoughts meet readers
        </p>

        {/* Massive Headline */}
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
            Start your storytelling journey on
            <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none text-ink mt-2">
              <AuroraText>BLOGHUB</AuroraText>
            </div>
          </h1>
        </div>

        {/* Descriptive Text */}
        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-ink-muted max-w-3xl leading-relaxed">
          A minimal, distraction-free space to publish your ideas, discover deep technical insights, and build a dedicated readership. Read, write, and grow with a community that values words.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 mt-10">
          <button
            type="button"
            className="bg-accent text-white px-8 py-3.5 rounded-full font-medium hover:bg-accent/90 transition shadow-sm hover:shadow-md"
          >
            Start Writing
          </button>
          <button
            type="button"
            className="border border-ink/20 text-ink px-8 py-3.5 rounded-full font-medium hover:bg-ink/5 transition"
          >
            Explore Blogs
          </button>
        </div>

        {/* Editor Mockup Card */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-ink/10 rounded-2xl p-6 md:p-10 text-left shadow-sm min-h-[250px] flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-ink/5 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/70" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
              <span className="w-3 h-3 rounded-full bg-[#10b981]/70" />
            </div>
            <span className="text-xs font-mono text-ink-muted">draft.md</span>
            <div className="w-12" aria-hidden="true" />
          </div>

          {/* Body */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-ink font-mono">
              # Building Scalable Architecture
            </h2>
            <p className="text-ink-muted font-sans text-sm md:text-base leading-relaxed">
              Modern distributed systems demand high reliability, clean abstraction boundaries, and resilient workflows. When designing resilient event-driven architectures, isolating critical pipelines prevents cascade failures across downstream microservices.
              <span className="inline-block w-[2px] h-5 bg-accent animate-pulse ml-1 align-middle" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
