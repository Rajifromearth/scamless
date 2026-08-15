
import { useState } from 'react'

const API_URL = 'https://scamless-backend.onrender.com'
function ScamTextChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleScan() {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/scam-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Could not reach the scan server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function verdictClass(verdict) {
    if (verdict === 'High risk') return 'high'
    if (verdict === 'Medium risk') return 'medium'
    return 'low'
  }

  return (
    <div className="scan-demo">
      <div className="scan-demo-top">
        <span className="scan-demo-label">Text scan · live</span>
        <span className="scan-demo-label">scamless.app</span>
      </div>

      <textarea
        className="scan-demo-textarea"
        placeholder="Paste a message, email, or job offer here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />

      <button
        className="btn-primary scan-demo-btn"
        onClick={handleScan}
        disabled={loading || !text.trim()}
      >
        {loading ? 'Scanning...' : 'Scan Now →'}
      </button>

      {error && <p className="scan-demo-error">{error}</p>}

      {result && (
        <div className="scan-demo-result">
          <span className={`verdict-pill ${verdictClass(result.verdict)}`}>
            <span className="dot"></span> {result.verdict}
          </span>
          <span className="risk-score">
            Risk score <strong>{result.risk_score}</strong>/100
          </span>
        </div>
      )}

      {result && result.flagged_phrases.length > 0 && (
        <div className="flagged-phrases">
          <span className="scan-demo-label">Flagged because:</span>
          <div className="phrase-tags">
            {result.flagged_phrases.map((phrase) => (
              <span key={phrase} className="phrase-tag">{phrase}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScamTextChecker