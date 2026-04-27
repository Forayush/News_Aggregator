import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Real-Time News Aggregator',
  description: 'News Aggregator & Sentiment Analysis Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-brand">
            <Link href="/" className="brand-mark">PulseWire</Link>
            <span>News intelligence</span>
          </div>
          <div className="nav-links">
            <Link href="/">Dashboard</Link>
            <Link href="/topics">Topics</Link>
            <Link href="/sources">Sources</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
