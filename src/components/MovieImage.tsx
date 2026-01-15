'use client'

import Image from 'next/image'
import { useState } from 'react'

type MovieImageProps = {
  src: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
}

export default function MovieImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality = 85,
}: MovieImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!src || error) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
        <svg
          className="w-16 h-16 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={`absolute inset-0 bg-gray-800 animate-pulse ${className}`} />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        // Add loading="lazy" for better performance
        loading={priority ? 'eager' : 'lazy'}
      />
    </>
  )
}