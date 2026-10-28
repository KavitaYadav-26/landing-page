import { useState } from 'react'
import './Photo.css'

interface PhotoProps {
  src: string
  alt: string
  /** CSS aspect-ratio, e.g. "4 / 3". Omit to fill the parent. */
  ratio?: string
  priority?: boolean
  className?: string
  position?: string
}

/** Image with reserved space, lazy loading and a calm fallback if the file fails to load. */
export function Photo({ src, alt, ratio, priority = false, className = '', position = 'center' }: PhotoProps) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`photo ${className}`.trim()} style={ratio ? { aspectRatio: ratio } : undefined}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ objectPosition: position }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
