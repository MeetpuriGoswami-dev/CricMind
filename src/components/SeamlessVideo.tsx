import { useState, useRef, useEffect } from 'react'

interface Props {
  src: string
}

export default function SeamlessVideo({ src }: Props) {
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1)
  const activeVideoRef = useRef<1 | 2>(1)

  // Keep ref in sync with state for access in event listeners without re-binding
  useEffect(() => {
    activeVideoRef.current = activeVideo
  }, [activeVideo])

  useEffect(() => {
    const v1 = videoRef1.current
    const v2 = videoRef2.current
    if (!v1 || !v2) return

    // Prep both videos for silent background playback
    v1.muted = true
    v1.playsInline = true
    v2.muted = true
    v2.playsInline = true

    v1.load()
    v2.load()

    let transitioning = false

    const handleTimeUpdate1 = () => {
      const active = activeVideoRef.current
      if (active === 1 && v1.duration && !transitioning) {
        // When video 1 is close to the end, start playing video 2 and crossfade
        if (v1.duration - v1.currentTime <= 1.5) {
          transitioning = true
          v2.currentTime = 0
          v2.play()
            .then(() => {
              setActiveVideo(2)
              // Reset transitioning flag after a delay to prevent double triggers
              setTimeout(() => { transitioning = false }, 1800)
            })
            .catch(err => {
              console.warn('Error playing video 2:', err)
              transitioning = false
            })
        }
      }
    }

    const handleTimeUpdate2 = () => {
      const active = activeVideoRef.current
      if (active === 2 && v2.duration && !transitioning) {
        // When video 2 is close to the end, start playing video 1 and crossfade
        if (v2.duration - v2.currentTime <= 1.5) {
          transitioning = true
          v1.currentTime = 0
          v1.play()
            .then(() => {
              setActiveVideo(1)
              // Reset transitioning flag after a delay to prevent double triggers
              setTimeout(() => { transitioning = false }, 1800)
            })
            .catch(err => {
              console.warn('Error playing video 1:', err)
              transitioning = false
            })
        }
      }
    }

    v1.addEventListener('timeupdate', handleTimeUpdate1)
    v2.addEventListener('timeupdate', handleTimeUpdate2)

    // Initial play for the first video
    v1.play().catch(err => console.warn('Error initial play:', err))

    return () => {
      v1.removeEventListener('timeupdate', handleTimeUpdate1)
      v2.removeEventListener('timeupdate', handleTimeUpdate2)
    }
  }, [src]) // Only re-run if the src changes, never on activeVideo toggle!

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef1}
        src={src}
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          border: 'none',
          opacity: activeVideo === 1 ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
          zIndex: activeVideo === 1 ? 2 : 1,
        }}
      />
      <video
        ref={videoRef2}
        src={src}
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          border: 'none',
          opacity: activeVideo === 2 ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
          zIndex: activeVideo === 2 ? 2 : 1,
        }}
      />
    </div>
  )
}
