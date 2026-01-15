import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-white">
        <nav className="border-b border-gray-800 p-4 flex gap-6">
          <Link href="/" className="font-bold">
            MovieSite
          </Link>
          <Link href="/search">Search 1</Link>
        </nav>

        {children}
      </body>
    </html>
  )
}
