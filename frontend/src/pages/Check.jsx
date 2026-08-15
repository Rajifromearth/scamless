import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScamTextChecker from '../components/ScamTextChecker'
import LinkChecker from '../components/LinkChecker'
import ImageChecker from '../components/ImageChecker'

function Check() {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L23 6.5V12C23 18.5 18.7 23.6 13 25C7.3 23.6 3 18.5 3 12V6.5L13 2Z" stroke="#E8A23D" strokeWidth="1.6" fill="rgba(232,162,61,0.08)"/>
              <path d="M8.5 13L11.5 16L18 9" stroke="#E8A23D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Scamless
          </Link>
          <nav className="nav-links">
            <Link to="/#features">Features</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/#about">About</Link>
          </nav>
          <Link to="/" className="nav-cta">← Back Home</Link>
        </div>
      </header>

      <section style={{ padding: '80px 0 100px' }}>
        <div className="wrap">
          <div className="section-head" style={{ margin: '0 auto 40px', textAlign: 'center' }}>
            <span className="section-tag">Scan Something</span>
            <h2 className="section-title">What do you want to check?</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{
                background: activeTab === 'text' ? 'var(--amber)' : 'transparent',
                color: activeTab === 'text' ? 'var(--ink)' : 'var(--paper)',
                border: '1px solid rgba(236,233,226,0.15)',
              }}
              onClick={() => setActiveTab('text')}
            >
              Check a Message
            </button>
            <button
              className="btn-primary"
              style={{
                background: activeTab === 'link' ? 'var(--amber)' : 'transparent',
                color: activeTab === 'link' ? 'var(--ink)' : 'var(--paper)',
                border: '1px solid rgba(236,233,226,0.15)',
              }}
              onClick={() => setActiveTab('link')}
            >
              Check a Link
            </button>
            <button
              className="btn-primary"
              style={{
                background: activeTab === 'image' ? 'var(--amber)' : 'transparent',
                color: activeTab === 'image' ? 'var(--ink)' : 'var(--paper)',
                border: '1px solid rgba(236,233,226,0.15)',
              }}
              onClick={() => setActiveTab('image')}
            >
              Check an Image
            </button>
          </div>

          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {activeTab === 'text' && <ScamTextChecker />}
            {activeTab === 'link' && <LinkChecker />}
            {activeTab === 'image' && <ImageChecker />}
          </div>
        </div>
      </section>
    </>
  )
}

export default Check