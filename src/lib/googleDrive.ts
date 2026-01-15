export function extractDriveFileId(url: string) {
  const match = url.match(/\/d\/(.*?)\//)
  return match ? match[1] : null
}

export function generateDriveLinks(fileId: string) {
  return {
    preview: `https://drive.google.com/file/d/${fileId}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  }
}
