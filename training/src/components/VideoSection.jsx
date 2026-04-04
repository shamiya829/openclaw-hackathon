import { useState } from 'react'

export default function VideoSection({ topic, onWatched, watched }) {
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    setPlaying(true)
    // Mark as watched after simulated view (real app: listen to YT player API events)
    if (!watched) {
      setTimeout(() => onWatched(), 3000)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up">
      {/* Video embed */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${topic.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={topic.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* Thumbnail / play gate */
          <button
            onClick={handlePlay}
            className="group w-full h-full flex flex-col items-center justify-center bg-surface2 relative overflow-hidden"
            aria-label="Play video"
          >
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'linear-gradient(#2a2a3d 1px, transparent 1px), linear-gradient(90deg, #2a2a3d 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-accent/20 border-2 border-accent group-hover:bg-accent/30 group-hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-text text-sm font-semibold">{topic.title}</p>
                <p className="text-muted text-xs mt-0.5">{topic.duration} · Mock YouTube embed</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
        <p className="text-xs text-muted">{topic.description}</p>
        {watched && (
          <span className="ml-3 shrink-0 text-xs font-semibold text-ms-green flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Watched
          </span>
        )}
      </div>
    </div>
  )
}
