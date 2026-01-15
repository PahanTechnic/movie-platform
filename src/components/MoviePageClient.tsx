/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import MovieImage from '@/components/MovieImage';
import VideoPlayer from '@/components/VideoPlayer';

interface MoviePageClientProps {
  movie: any;
  backdropUrl: string | null;
  posterUrl: string | null;
}

export default function MoviePageClient({ movie, backdropUrl, posterUrl }: MoviePageClientProps) {
  const [activeVideo, setActiveVideo] = useState<'full' | 'trailer' | null>(null);

  const hasFullMovie = !!movie.video_url;
  const hasTrailer = !!movie.preview_link;
  
  // Get available resolutions
  const resolutions = movie.resolution_links ? Object.keys(movie.resolution_links) : [];

  return (
    <>
      {/* Video Section - Shows when button is clicked */}
      {activeVideo && (hasFullMovie || hasTrailer) && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className={`w-2 h-8 ${activeVideo === 'full' ? 'bg-red-600' : 'bg-yellow-500'} rounded-full`}></span>
              {activeVideo === 'full' ? 'Watch Full Movie' : 'Watch Trailer'}
            </h2>
            <button
              onClick={() => setActiveVideo(null)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          
          <VideoPlayer
            src={activeVideo === 'full' ? movie.video_url : movie.preview_link}
            poster={backdropUrl || ''}
            title={activeVideo === 'full' ? movie.title : `${movie.title} - Trailer`}
          />

          {/* Video Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
            {movie.webdl && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Quality: {movie.webdl}
              </span>
            )}
            {movie.runtime && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Duration: {movie.runtime} min
              </span>
            )}
          </div>
        </section>
      )}

      {/* Action Buttons - Show when no video is playing */}
      {!activeVideo && (hasFullMovie || hasTrailer) && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Movie Button */}
            {hasFullMovie && (
              <button
                onClick={() => setActiveVideo('full')}
                className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Watch Full Movie</h3>
                    <p className="text-red-100 text-sm">Stream {movie.title} in high quality</p>
                  </div>
                  {movie.webdl && (
                    <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      {movie.webdl}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </button>
            )}

            {/* Trailer Button */}
            {hasTrailer && (
              <button
                onClick={() => setActiveVideo('trailer')}
                className="group relative overflow-hidden bg-gradient-to-br from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Watch Trailer</h3>
                    <p className="text-yellow-100 text-sm">Preview before watching</p>
                  </div>
                  <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                    PREVIEW
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </button>
            )}
          </div>

          {/* Quick Info */}
          <div className="mt-8 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{movie.runtime} minutes</span>
                </div>
              )}
              {movie.webdl && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{movie.webdl} Quality</span>
                </div>
              )}
              {movie.language_category && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium uppercase">{movie.language_category}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Cast</h2>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {movie.cast.map((actor: any, index: number) => (
                <div key={index} className="flex-shrink-0 snap-start">
                  <div className="w-32">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-3 bg-gray-800 border-2 border-gray-700">
                      <MovieImage
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                    <h4 className="font-semibold text-sm text-center line-clamp-2 mb-1">
                      {actor.name}
                    </h4>
                    <p className="text-xs text-gray-400 text-center line-clamp-2">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
              <div className="h-full bg-red-600 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      {movie.overview && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {movie.overview}
          </p>
        </section>
      )}

      {/* Download Section - Separate Buttons for Each Resolution */}
      {(movie.download_link || resolutions.length > 0) && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-800">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Download?</h2>
              <p className="text-lg text-red-100">
                Choose your preferred quality and download {movie.title}
              </p>
            </div>

            {/* Multiple Download Buttons */}
            {resolutions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {resolutions.map((resolution) => {
                  const resData = movie.resolution_links[resolution];
                  const downloadUrl = resData?.download_url || movie.download_link;
                  
                  // Different colors for different resolutions
                  const getResolutionColor = (res: string) => {
                    if (res.includes('1080')) return 'from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800';
                    if (res.includes('720')) return 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800';
                    if (res.includes('480')) return 'from-green-500 to-green-700 hover:from-green-600 hover:to-green-800';
                    if (res.includes('360')) return 'from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800';
                    return 'from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800';
                  };

                  return (
                    <a
                      key={resolution}
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative overflow-hidden bg-gradient-to-br ${getResolutionColor(resolution)} rounded-xl p-6 transition-all duration-300 transform hover:scale-105 shadow-xl`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                      
                      <div className="relative z-10 text-center space-y-3">
                        {/* Icon */}
                        <div className="mx-auto w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>

                        {/* Resolution */}
                        <div>
                          <div className="text-2xl font-bold text-white mb-1">
                            {resolution}
                          </div>
                          <div className="text-xs text-white/80">
                            Download
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                          HD Quality
                        </div>
                      </div>

                      {/* Progress bar animation */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full bg-white w-0 group-hover:w-full transition-all duration-500" />
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              // Fallback to single download button if no resolutions
              movie.download_link && (
                <div className="text-center">
                  <a
                    href={movie.download_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Movie
                  </a>
                </div>
              )
            )}

            {/* Info Note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-red-100/80">
                💡 Select the quality that best suits your device and internet speed
              </p>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}