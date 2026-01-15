'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { extractDriveFileId, generateDriveLinks } from '@/lib/googleDrive'

export default function EditMoviePage() {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [contentCategory, setContentCategory] = useState('') // 🎬 New field
  
  // 🎬 Multiple Resolution Links
  const [resolutionLinks, setResolutionLinks] = useState([
    { resolution: '1080p', link: '' },
    { resolution: '720p', link: '' },
    { resolution: '480p', link: '' },
    { resolution: '360p', link: '' }
  ])
  
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovie = async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Failed to load movie')
        return
      }

      if (data) {
        setTitle(data.title)
        setYear(data.release_year.toString())
        setContentCategory(data.content_category || '')
        
        // Load resolution links if available
        if (data.resolution_links) {
          const loadedLinks = [...resolutionLinks]
          Object.keys(data.resolution_links).forEach((res) => {
            const index = loadedLinks.findIndex(l => l.resolution === res)
            if (index !== -1 && data.resolution_links[res].file_id) {
              loadedLinks[index].link = `https://drive.google.com/file/d/${data.resolution_links[res].file_id}/view`
            }
          })
          setResolutionLinks(loadedLinks)
        } else if (data.drive_file_id) {
          // Fallback for old format
          setDriveLink(`https://drive.google.com/file/d/${data.drive_file_id}/view`)
        }
      }
    }
    fetchMovie()
  }, [id])

  const handleUpdate = async () => {
    if (!title || !year || !contentCategory) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    // Process resolution links
    const processedResolutions: any = {}
    let hasAtLeastOneLink = false
    
    for (const res of resolutionLinks) {
      if (res.link.trim()) {
        const fileId = extractDriveFileId(res.link)
        if (fileId) {
          const { preview, download } = generateDriveLinks(fileId)
          processedResolutions[res.resolution] = {
            file_id: fileId,
            preview_url: preview,
            download_url: download
          }
          hasAtLeastOneLink = true
        }
      }
    }

    // Fallback to old driveLink if no resolution links
    if (!hasAtLeastOneLink && driveLink) {
      const fileId = extractDriveFileId(driveLink)
      if (fileId) {
        const { preview, download } = generateDriveLinks(fileId)
        processedResolutions['1080p'] = {
          file_id: fileId,
          preview_url: preview,
          download_url: download
        }
        hasAtLeastOneLink = true
      }
    }

    if (!hasAtLeastOneLink) {
      setError('Please provide at least one resolution link')
      setLoading(false)
      return
    }

    // Use the first available resolution as the default video_url
    const firstResolution = Object.values(processedResolutions)[0] as any

    const { error: updateError } = await supabase
      .from('movies')
      .update({
        title,
        release_year: Number(year),
        video_url: firstResolution.preview_url,
        download_link: firstResolution.download_url,
        resolution_links: processedResolutions,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        content_category: contentCategory,
      })
      .eq('id', id)

    setLoading(false)

    if (updateError) {
      setError('Failed to update movie')
      return
    }

    router.push('/admin/movies')
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return
    }

    setDeleting(true)

    const { error: deleteError } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError('Failed to delete movie')
      setDeleting(false)
      return
    }

    router.push('/admin/movies')
  }

  return (
    <div className="p-8 text-white">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Edit Movie</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* 🎬 Content Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Content Category * <span className="text-red-400">(Required)</span>
            </label>
            <select
              className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contentCategory}
              onChange={(e) => setContentCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="MOVIE">🎬 Movie</option>
              <option value="TV_SERIES">📺 TV Series</option>
              <option value="CARTOON">🎨 Cartoon</option>
              <option value="ANIME">⚡ Anime</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Movie Title
            </label>
            <input
              className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Release Year
            </label>
            <input
              type="number"
              className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </div>

          {/* Multiple Resolution Links */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
              <span className="text-green-400">📁</span>
              Google Drive Links (Multiple Resolutions)
            </h3>
            
            {resolutionLinks.map((item, index) => (
              <div key={item.resolution}>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <span className="font-semibold text-blue-400">{item.resolution}</span>
                  {index === 0 && <span className="text-xs text-green-400">(At least one required)</span>}
                </label>
                <input
                  placeholder={`https://drive.google.com/file/d/... (${item.resolution})`}
                  className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={item.link}
                  onChange={(e) => {
                    const newLinks = [...resolutionLinks]
                    newLinks[index].link = e.target.value
                    setResolutionLinks(newLinks)
                  }}
                />
              </div>
            ))}
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 <strong>Tip:</strong> Add multiple resolution options to give users flexibility.
              </p>
            </div>
          </div>

          {/* Old format fallback (hidden by default) */}
          {driveLink && !resolutionLinks.some(r => r.link) && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Google Drive Link (Legacy)
              </label>
              <input
                className="w-full p-3 bg-[#020617] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={loading || deleting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Movie'}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading || deleting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>

            <button
              onClick={() => router.push('/admin/movies')}
              disabled={loading || deleting}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}