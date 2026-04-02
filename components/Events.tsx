import { ArrowUpRight } from 'lucide-react'
import { events } from '@/data/events'

export default function Events() {
  return (
    <section id="events" className="py-32 px-6 border-t border-[#1e1e1e]">
      <div className="max-w-6xl mx-auto">
        <p className="text-cyan-400 text-[0.65rem] tracking-[0.4em] uppercase mb-4">
          03 — Events
        </p>
        <h2 className="text-3xl font-light text-white mb-14">Upcoming Shows</h2>

        <div className="divide-y divide-[#1a1a1a]">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="group flex items-center gap-6 py-5 -mx-4 px-4 hover:bg-[#0d0d0d] transition-colors"
            >
              {/* Date badge */}
              <div className="w-12 shrink-0 text-center">
                <div className="text-xl font-bold text-white leading-none">{ev.day}</div>
                <div className="text-[0.6rem] text-cyan-400 tracking-[0.2em] mt-1 uppercase">
                  {ev.month}
                </div>
              </div>

              {/* Venue */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{ev.venue}</p>
                <p className="text-[#555] text-xs mt-0.5">
                  {ev.city}, {ev.country}
                </p>
              </div>

              {/* Year (desktop) */}
              <span className="hidden md:block text-[#2a2a2a] text-xs">{ev.year}</span>

              {/* Ticket / status */}
              <div className="shrink-0 w-20 text-right">
                {ev.soldOut ? (
                  <span className="text-[0.6rem] text-[#333] tracking-[0.15em] uppercase">
                    Sold Out
                  </span>
                ) : ev.ticketUrl ? (
                  <a
                    href={ev.ticketUrl}
                    className="inline-flex items-center gap-1 text-[0.6rem] text-[#555] hover:text-cyan-400 group-hover:text-cyan-400 tracking-[0.15em] uppercase transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tickets <ArrowUpRight size={11} />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
