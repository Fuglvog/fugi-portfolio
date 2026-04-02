'use client'

import { useState, useEffect } from 'react'

const links = [
  { href: '#about',   label: 'About'   },
  { href: '#mixes',   label: 'Mixes'   },
  { href: '#events',  label: 'Events'  },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080808]/90 backdrop-blur-sm border-b border-[#1e1e1e]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#top"
          className="text-white font-bold text-lg tracking-[0.25em] hover:text-cyan-400 transition-colors"
        >
          FüGï
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-xs text-[#888] hover:text-white transition-colors tracking-[0.15em] uppercase"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 transition-colors tracking-[0.15em] uppercase"
            >
              Book
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-white transition-all duration-200 origin-center ${
              open ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-white transition-all duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-px w-5 bg-white transition-all duration-200 origin-center ${
              open ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ${
          open ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="bg-[#080808] border-b border-[#1e1e1e] px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-[#888] hover:text-white transition-colors tracking-[0.15em] uppercase"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-block w-fit text-xs font-semibold bg-cyan-400 text-black px-4 py-2 tracking-[0.15em] uppercase"
            onClick={() => setOpen(false)}
          >
            Book
          </a>
        </div>
      </div>
    </nav>
  )
}
