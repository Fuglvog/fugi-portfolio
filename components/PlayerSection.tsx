'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import { mixes, type Mix } from '@/data/mixes'

// ── Waveform visualiser ──────────────────────────────────────────────────────
const BAR_HEIGHTS = [30, 55, 80, 45, 90, 60, 75, 40, 85, 50, 70, 48, 92, 58, 66]

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-8" aria-hidden>
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[2px] bg-cyan-400 rounded-full"
          style={{
            height: playing ? `${h}%` : '15%',
            transition: playing ? 'none' : 'height 0.4s ease',
            animation: playing
              ? `bar-wave ${0.75 + (i % 5) * 0.12}s ease-in-out ${i * 0.055}s infinite alternate`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function PlayerSection() {
  const [current, setCurrent] = useState<Mix | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0–100

  const currentIdx = mixes.findIndex((m) => m.id === current?.id)

  const skipNext = useCallback(() => {
    setCurrent(mixes[(currentIdx + 1) % mixes.length])
    setPlaying(true)
    setProgress(0)
  }, [currentIdx])

  const skipPrev = useCallback(() => {
    setCurrent(mixes[(currentIdx - 1 + mixes.length) % mixes.length])
    setPlaying(true)
    setProgress(0)
  }, [currentIdx])

  const selectMix = (mix: Mix) => {
    if (current?.id === mix.id) {
      setPlaying((p) => !p)
    } else {
      setCurrent(mix)
      setPlaying(true)
      setProgress(0)
    }
  }

  // Simulated progress (0.1 % per 100 ms = full in ~100 s)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(
      () => setProgress((p) => (p >= 100 ? 100 : p + 0.1)),
      100,
    )
    return () => clearInterval(id)
  }, [playing])

  return (
    <>
      {/* ── Mixes grid ──────────────────────────────────────────────────── */}
      <section id="mixes" className="py-32 px-6 border-t border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto">
          <p className="text-cyan-400 text-[0.65rem] tracking-[0.4em] uppercase mb-4">
            02 — Mixes
          </p>
          <h2 className="text-3xl font-light text-white mb-14">Latest Sets</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mixes.map((mix) => {
              const isActive = current?.id === mix.id
              return (
                <button
                  key={mix.id}
                  onClick={() => selectMix(mix)}
                  className="group text-left border border-[#1e1e1e] hover:border-cyan-400/25 transition-colors duration-300 overflow-hidden"
                >
                  {/* Artwork */}
                  <div className="relative h-40 w-full" style={{ background: mix.art }}>
                    {/* Playing indicator */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Waveform playing={playing} />
                        </div>
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </>
                    )}

                    {/* Hover play icon (non-active) */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-black/50 flex items-center justify-center">
                          <Play size={15} className="text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="p-4 bg-[#101010]">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-white text-sm font-medium leading-tight">
                          {mix.title}
                        </p>
                        <p className="text-[#555] text-xs mt-1">{mix.genre}</p>
                      </div>
                      <span className="text-[#333] text-xs shrink-0">{mix.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#444] text-xs">
                      <span>{mix.duration}</span>
                      <span className="text-[#2a2a2a]">·</span>
                      <span>{mix.tracks} tracks</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Sticky player ───────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c] border-t border-[#1e1e1e] transition-transform duration-300 ${
          current ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Progress bar — clickable */}
        <div
          className="h-[2px] bg-[#1a1a1a] cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setProgress(((e.clientX - rect.left) / rect.width) * 100)
          }}
        >
          <div
            className="h-full bg-cyan-400 transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-9 h-9 shrink-0 hidden sm:block"
              style={{ background: current?.art }}
            />
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate leading-tight">
                {current?.title}
              </p>
              <p className="text-[#444] text-xs truncate mt-0.5">{current?.genre}</p>
            </div>
          </div>

          {/* Transport controls */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={skipPrev}
              className="text-[#555] hover:text-white transition-colors"
              aria-label="Previous"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-9 h-9 rounded-full bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center transition-colors"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <Pause size={14} className="text-black" />
              ) : (
                <Play size={14} className="text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={skipNext}
              className="text-[#555] hover:text-white transition-colors"
              aria-label="Next"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Volume + close */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 size={13} className="text-[#444] shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                className="w-20 h-px appearance-none bg-[#222] cursor-pointer accent-cyan-400"
                aria-label="Volume"
              />
            </div>
            <button
              onClick={() => {
                setCurrent(null)
                setPlaying(false)
                setProgress(0)
              }}
              className="text-[#333] hover:text-white transition-colors"
              aria-label="Close player"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
