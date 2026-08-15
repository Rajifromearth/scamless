import { Link } from 'react-router-dom'

function Landing() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L23 6.5V12C23 18.5 18.7 23.6 13 25C7.3 23.6 3 18.5 3 12V6.5L13 2Z" stroke="#E8A23D" strokeWidth="1.6" fill="rgba(232,162,61,0.08)"/>
              <path d="M8.5 13L11.5 16L18 9" stroke="#E8A23D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Scamless
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <Link to="/check" className="nav-cta">Try It Free</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="scanlines"></div>
        <div className="hero-content">
          <div className="ghost-word" aria-hidden="true">SCAMLESS</div>
          <div className="hero-text">
            <span className="eyebrow"><span className="dot"></span> Built from real freelancer scam encounters</span>
            <h1 className="headline">Know what's real <span className="accent">before</span> it costs you</h1>
            <p className="subtext">Paste a message, a link, or an image — Scamless checks it against patterns trained from real scams and tells you exactly why, in seconds.</p>
            <div className="hero-ctas">
              <Link to="/check" className="btn-primary">Scan Now →</Link>
              <a href="#how-it-works" className="link-secondary">See how it works ↓</a>
            </div>
          </div>
        </div>

        <div className="stats-bar">
          <div className="stats-inner">
            <div className="stat">
              <span className="stat-num">3</span>
              <span className="stat-label">Detection<br/>types</span>
            </div>
            <div className="stat">
              <span className="stat-num">0</span>
              <span className="stat-label">Third-party<br/>detection APIs</span>
            </div>
            <div className="stat">
              <span className="stat-num">&lt;2s</span>
              <span className="stat-label">Average<br/>scan time</span>
            </div>
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Explainable<br/>results</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="section-tag">Features</span>
            <h2 className="section-title">One tool, every angle scammers use</h2>
            <p className="section-desc">Messages, links, and images are the three most common ways scams and misinformation reach you. Scamless checks all three.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14v9a1 1 0 01-1 1H8l-4 3v-3H4a1 1 0 01-1-1V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <h3>Text Scam Checker</h3>
              <p>Paste any message, email, or job offer. Our model flags manipulation patterns — urgency, upfront fees, guaranteed pay — and shows exactly which words triggered the score.</p>
              <span className="feature-tag">Trained on real scam text</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 12l4-4M7 6l1.5-1.5a3 3 0 014.24 4.24L11.5 10M13 8l-1.5 1.5a3 3 0 01-4.24-4.24L8.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <h3>Link Checker</h3>
              <p>Drop in any URL. We check domain age, SSL validity, redirect chains, and suspicious patterns — no blocklist API, just the same signals a security researcher would check by hand.</p>
              <span className="feature-tag">Protocol-level, not guesswork</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="7.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M17 12l-3.5-3.5-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <h3>Image Authenticity Checker</h3>
              <p>Upload an image and get a probability score for whether it's AI-generated. Built on our own trained model — spotting the artifacts synthetic images leave behind.</p>
              <span className="feature-tag">In training — coming soon</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-tag">How it works</span>
            <h2 className="section-title">From paste to verdict in three steps</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Paste or upload</h3>
              <p>Drop in a message, link, or image — whatever's making you second-guess.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Scamless analyzes it</h3>
              <p>Our own trained models check it against real scam and fake-content patterns, live.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Get your verdict</h3>
              <p>A clear risk score, plus the exact reasons behind it — no black box.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap">
          <div className="about-grid">
            <p className="about-quote">Built by someone who's <span className="accent">actually been sent</span> a scam job offer — not a lab experiment.</p>
            <div className="about-body">
              <p>Scamless started as a hackathon project, but the problem behind it is personal. Freelance work often means fielding messages from strangers — some real opportunities, some scams dressed up to look real.</p>
              <p>Every detection model in Scamless is trained from scratch, not borrowed from a third-party API. That means the reasoning stays transparent: when something's flagged, you can see exactly why.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" id="try">
        <div className="wrap">
          <h2>Not sure if it's real? <br/>Find out before you respond.</h2>
          <Link to="/check" className="btn-primary">Try Scamless Free →</Link>
        </div>
      </section>

      <footer id="contact">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L23 6.5V12C23 18.5 18.7 23.6 13 25C7.3 23.6 3 18.5 3 12V6.5L13 2Z" stroke="#E8A23D" strokeWidth="1.6" fill="rgba(232,162,61,0.08)"/>
                  <path d="M8.5 13L11.5 16L18 9" stroke="#E8A23D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Scamless
              </div>
              <p>An AI-powered scam and fake-content detector, built to spot what shouldn't be trusted online.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <a href="#">GitHub</a>
                <a href="#">Devpost</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Scamless. Built for NeuralSprint.</span>
            <span>Know what's real.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Landing