// components/DownloadButton.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface DownloadButtonProps {
  movieId: string
  resolution: string
  downloadUrl: string
  fileSize?: string | number
}


export default function DownloadButton({ movieId, resolution, downloadUrl }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Increment download count in database
      const { error } = await supabase.rpc('increment_download_count', {
        movie_id: movieId
      })

      if (error) {
        console.error('Error updating download count:', error)
      }

      // Open download link in new tab
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setTimeout(() => setIsDownloading(false), 1000)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-between">
        <span>
          {isDownloading ? 'Starting Download...' : `Download ${resolution}`}
        </span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </div>
    </button>
  )
}