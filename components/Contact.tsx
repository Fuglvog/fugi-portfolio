'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

const inputClass =
  'w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-cyan-400/40 text-white text-sm px-4 py-3 outline-none transition-colors placeholder-[#2a2a2a]'

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', type: 'booking', message: '' })
  const [sent, setSent]   = useState(false)
  const [busy, setBusy]   = useState(false)

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    // Wire up your preferred form backend here (Resend, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 600)) // simulated delay
    setSent(true)
    setBusy(false)
  }

  return (
    <section id="contact" className="py-32 px-6 border-t border-[#1e1e1e]">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 text-[0.65rem] tracking-[0.4em] uppercase mb-4">
          04 — Contact
        </p>
        <h2 className="text-3xl font-light text-white mb-14">Booking &amp; Enquiries</h2>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left — direct contacts */}
          <div>
            <p className="text-[#666] text-sm leading-7 mb-10">
              For bookings, press, and general enquiries use the form or reach
              out directly. Responses within 48 hours.
            </p>

            <div className="space-y-7">
              {[
                { role: 'Booking',    email: 'booking@fugi.io'  },
                { role: 'Press',      email: 'press@fugi.io'    },
                { role: 'Management', email: 'mgmt@fugi.io'     },
              ].map((c) => (
                <div key={c.role}>
                  <p className="text-[0.6rem] text-[#333] tracking-[0.25em] uppercase mb-1">
                    {c.role}
                  </p>
                  <a
                    href={`mailto:${c.email}`}
                    className="text-sm text-white hover:text-cyan-400 transition-colors"
                  >
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {sent ? (
              <div className="border border-cyan-400/15 bg-cyan-400/[0.03] p-10 text-center">
                <div className="text-cyan-400 text-3xl mb-3">✓</div>
                <p className="text-white text-sm">Message sent.</p>
                <p className="text-[#444] text-xs mt-1">We&apos;ll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[0.6rem] text-[#333] tracking-[0.25em] uppercase block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-[0.6rem] text-[#333] tracking-[0.25em] uppercase block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[0.6rem] text-[#333] tracking-[0.25em] uppercase block mb-2">
                    Type
                  </label>
                  <select value={form.type} onChange={set('type')} className={inputClass}>
                    <option value="booking">Booking</option>
                    <option value="press">Press</option>
                    <option value="collab">Collaboration</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-[0.6rem] text-[#333] tracking-[0.25em] uppercase block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Event date, venue, city…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black text-xs font-semibold px-6 py-3 transition-colors tracking-[0.2em] uppercase"
                >
                  {busy ? 'Sending…' : 'Send Message'} <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
