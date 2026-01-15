// components/HeroSlider.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

import Link from 'next/link'
import { tmdbImage } from '@/lib/tmdb'
import MovieImage from '@/components/MovieImage'
import Image from 'next/image'
interface Movie {
  id: number
  title: string
  overview: string
  backdrop_path: string | null
  poster_path: string | null
  slug: string
  release_year: number
  vote_average: number
}


interface HeroSliderProps {
  slides: Movie[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  
const handleNext = useCallback(() => {
  if (isAnimating) return
  setIsAnimating(true)
  setCurrentSlide((prev) => (prev + 1) % slides.length)
  setTimeout(() => setIsAnimating(false), 500)
}, [isAnimating, slides.length])


  useEffect(() => {
  const timer = setInterval(() => {
    handleNext()
  }, 4000)

  return () => clearInterval(timer)
}, [handleNext])


  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  if (!slides || slides.length === 0) return null

  const movie = slides[currentSlide]

  return (
    <div className="relative mb-12 overflow-hidden">
      <div className="relative h-[70vh] md:h-[85vh]">
        {/* Background Image with Fade Transition */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={tmdbImage(slide.backdrop_path, 'original') || ''}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full">
            {/* Movie Info */}
            <div 
              className={`flex-1 space-y-6 transition-all duration-500 ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
                {movie.title}
              </h1>
              
              <p className="text-lg text-gray-200 max-w-2xl line-clamp-3 font-medium tracking-wide">
                {movie.overview}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="font-semibold text-lg">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{movie.release_year}</span>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/movie/${movie.slug}`}
                  className="px-8 py-4 rounded-lg bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </Link>
                <Link
                  href={`/movie/${movie.slug}`}
                  className="px-8 py-4 rounded-lg border-2 border-white/70 backdrop-blur-sm bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Info
                </Link>
              </div>
            </div>

            {/* Poster Image */}
            <div 
              className={`hidden md:block flex-shrink-0 transition-all duration-500 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="relative w-80 h-[450px] rounded-xl overflow-hidden shadow-2xl">
                <MovieImage
                  src={tmdbImage(movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all backdrop-blur-sm"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}