const socials = [
  { label: 'SoundCloud', href: '#' },
  { label: 'Mixcloud',   href: '#' },
  { label: 'Bandcamp',   href: '#' },
  { label: 'Instagram',  href: '#' },
  { label: 'RA',         href: '#' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <span className="font-bold text-base tracking-[0.3em] text-white">FüGï</span>

        {/* Social links */}
        <ul className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] text-[#333] hover:text-white transition-colors tracking-[0.2em] uppercase"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-[#252525] text-[0.6rem] tracking-[0.2em]">
          © {new Date().getFullYear()} FüGï
        </p>
      </div>
    </footer>
  )
}
