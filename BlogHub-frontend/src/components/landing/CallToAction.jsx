export default function CallToAction() {
  return (
    <section className="w-full relative z-10 py-16 md:py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-crimson/5 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      {/* Clean, minimalist typography */}
      <div className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto font-serif select-none px-6">
        {/* Section Title Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-chrome text-xs font-mono tracking-widest uppercase mb-8">
          <span className="text-crimson">✦</span> THE MANIFESTO
        </div>

        <h2 className="text-3xl md:text-5xl font-normal tracking-wide text-white/30 mb-4 transition-colors hover:text-white/60">0% Ads.</h2>
        <h2 className="text-3xl md:text-5xl font-normal tracking-wide text-white/30 mb-4 transition-colors hover:text-white/60">0% Paywalls.</h2>
        <h2 className="text-3xl md:text-5xl font-normal tracking-wide text-white/30 mb-8 transition-colors hover:text-white/60">0% Algorithms.</h2>
        
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-crimson/40 to-transparent mb-8"></div>
        
        <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-crimson drop-shadow-[0_0_20px_rgba(255,0,60,0.25)]">100% Your Words.</h2>
      </div>
    </section>
  )
}
