export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient cyan glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 select-none">
        <h1
          className="font-bold leading-none text-white"
          style={{
            fontSize: 'clamp(4.5rem, 18vw, 15rem)',
            letterSpacing: '0.12em',
          }}
        >
          FüGï
        </h1>

        <div className="flex items-center gap-4 mt-6">
          <div className="h-px w-12 bg-cyan-400/40" />
          <span className="text-cyan-400 text-[0.65rem] tracking-[0.45em] uppercase">
            Electronic Music
          </span>
          <div className="h-px w-12 bg-cyan-400/40" />
        </div>

        <p className="mt-4 text-[#444] text-[0.65rem] tracking-[0.35em] uppercase">
          DJ · Producer · Live
        </p>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#333]">
        <span className="text-[0.6rem] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#333] to-transparent" />
      </div>
    </section>
  )
}
