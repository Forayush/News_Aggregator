import './globals.css'

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
            <h1>News Analytics Platform</h1>
          </div>
          <div className="nav-links">
            <a href="/">Dashboard</a>
            <a href="/topics">Topics</a>
            <a href="/sources">Sources</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
