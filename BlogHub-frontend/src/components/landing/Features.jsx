export default function Features() {
  return (
    <section className="w-full bg-obsidian py-24 px-6 border-b border-chrome/10 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-crimson/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Column: Text & Headline */}
        <div className="flex flex-col items-start text-left">
          {/* Small uppercase tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-chrome/20 text-chrome text-xs font-mono tracking-widest uppercase mb-6">
            <span className="text-crimson">✦</span> THE PLATFORM
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-chrome-bright tracking-tight leading-tight">
            Built for those who{' '}
            <span className="text-crimson drop-shadow-[0_0_25px_rgba(255,0,60,0.6)]">
              create.
            </span>
          </h2>

          {/* Secondary Text */}
          <p className="mt-6 text-lg sm:text-xl text-chrome/80 leading-relaxed max-w-lg">
            A quiet, high-contrast canvas for your thoughts, stories, and insights.
            No paywalls, no popups, no bloat.
          </p>
        </div>

        {/* Right Column: Staggered Levitating Cards */}
        <div className="flex flex-col gap-6 w-full">
          {/* Card 01: Align Left, Standard Float */}
          <article className="w-full max-w-[380px] self-start animate-float bg-[#121316]/80 backdrop-blur-md p-6 rounded-2xl border border-chrome/15 shadow-xl hover:border-chrome/30 transition-all duration-300 flex flex-col gap-3">
            <span className="text-xs font-mono text-chrome/60 uppercase tracking-wider">
              01 // EXPERIENCE
            </span>
            <h3 className="text-lg font-serif font-bold text-chrome-bright">
              Write Naturally
            </h3>
            {/* Dark UI Block Placeholder */}
            <div className="space-y-2 p-3 bg-obsidian/80 rounded-xl border border-chrome/10 font-mono text-xs">
              <div className="flex items-center gap-2 text-chrome/50 pb-1.5 border-b border-chrome/10">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                <span className="text-[11px]">markdown_draft.md</span>
              </div>
              <p className="text-chrome-bright font-sans text-xs pt-1">
                # Designing clean, resilient systems.
              </p>
              <div className="h-1.5 w-4/5 bg-chrome/20 rounded-full" />
              <div className="h-1.5 w-3/5 bg-chrome/10 rounded-full" />
            </div>
          </article>

          {/* Card 02: Align Right, Softened Crimson Border, 1s Delay */}
          <article className="w-full max-w-[380px] self-end ml-auto animate-float animation-delay-1000 bg-[#14151a]/90 backdrop-blur-md p-6 rounded-2xl border border-crimson/20 shadow-[0_0_20px_rgba(255,0,60,0.08)] hover:border-crimson/30 hover:shadow-[0_0_30px_rgba(255,0,60,0.15)] transition-all duration-300 flex flex-col gap-3">
            <span className="text-xs font-mono text-crimson uppercase tracking-wider">
              02 // EXPRESSION
            </span>
            <h3 className="text-lg font-serif font-bold text-chrome-bright">
              Bring Stories to Life
            </h3>
            {/* Multimedia Skeleton UI Blocks */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Block 1: Image Mockup */}
              <div className="h-16 w-full rounded-md bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white/[0.15]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>

              {/* Block 2: Article/Text Mockup */}
              <div className="h-16 w-full rounded-md bg-white/[0.02] border border-white/5 p-3 flex flex-col gap-2 justify-center">
                <div className="h-1 rounded-full bg-white/10 w-full" />
                <div className="h-1 rounded-full bg-white/10 w-4/5" />
                <div className="h-1 rounded-full bg-white/10 w-2/3" />
              </div>

              {/* Block 3: Quote/Code Mockup */}
              <div className="h-16 w-full rounded-md bg-black/40 border border-white/5 border-l-2 border-l-crimson/30 p-2 flex flex-col gap-1.5 justify-center">
                <div className="h-1.5 rounded-full bg-chrome/20 w-3/4" />
                <div className="h-1.5 rounded-full bg-crimson/20 w-1/2" />
              </div>
            </div>
          </article>

          {/* Card 03: Align Left with Offset Margin, 2s Delay */}
          <article className="w-full max-w-[380px] self-start ml-4 sm:ml-8 animate-float animation-delay-2000 bg-[#121316]/80 backdrop-blur-md p-6 rounded-2xl border border-chrome/15 shadow-xl hover:border-chrome/30 transition-all duration-300 flex flex-col gap-3">
            <span className="text-xs font-mono text-chrome/60 uppercase tracking-wider">
              03 // FOCUS
            </span>
            <h3 className="text-lg font-serif font-bold text-chrome-bright">
              Just Your Words
            </h3>
            {/* Waveform Graphic Placeholder with quiet, muted bars */}
            <div className="p-3 bg-obsidian/80 rounded-xl border border-chrome/10 flex items-end justify-between gap-1 h-14 px-4">
              {[40, 75, 35, 90, 60, 100, 50, 85, 45, 95, 30, 80, 65, 90, 40, 70, 50, 85, 60, 35].map(
                (height, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-white/10 rounded-full"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
