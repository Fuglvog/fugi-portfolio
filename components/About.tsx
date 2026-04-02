const stats = [
  { value: '8+',   label: 'Years Active' },
  { value: '200+', label: 'Sets Played'  },
  { value: '30+',  label: 'Countries'    },
  { value: '50+',  label: 'Releases'     },
]

export default function About() {
  return (
    <section id="about" className="py-32 px-6 border-t border-[#1e1e1e]">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <p className="text-cyan-400 text-[0.65rem] tracking-[0.4em] uppercase mb-16">
          01 — About
        </p>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Ghost logo */}
          <div className="relative overflow-hidden hidden md:block">
            <div
              className="text-[11rem] font-bold leading-none select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px #1c1c1c',
                letterSpacing: '0.08em',
              }}
            >
              FüGï
            </div>
            {/* Fade bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080808] to-transparent" />
          </div>

          {/* Bio */}
          <div className="pt-2">
            <h2 className="text-3xl font-light leading-snug text-white mb-8">
              Crafting sound at the intersection of{' '}
              <span className="text-cyan-400">darkness</span> and{' '}
              <span className="text-cyan-400">light</span>.
            </h2>

            <div className="space-y-4 text-[#666] text-sm leading-7">
              <p>
                FüGï is an electronic music artist and DJ based between Berlin
                and London, known for deep, hypnotic sets that blur the line
                between techno, industrial, and experimental sound design.
              </p>
              <p>
                Drawing from a decade of underground club experience and
                major festival bookings, FüGï&apos;s sound navigates the space
                between raw machine rhythms and meditative atmosphere —
                physically moving and introspective in equal measure.
              </p>
              <p>
                Residencies at Fabric and Tresor. Releases on Ostgut Ton,
                Mote-Evolver, and self-released via Bandcamp.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-[#1e1e1e]">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-[0.65rem] text-[#444] tracking-[0.2em] uppercase mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
