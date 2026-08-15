import { useState } from 'react'

const API_URL = 'http://127.0.0.1:8000'

function LinkChecker() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheck() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/link-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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
        <span className="scan-demo-label">Link scan · live</span>
        <span className="scan-demo-label">scamless.app</span>
      </div>

      <input
        type="text"
        className="scan-demo-textarea"
        placeholder="Paste a URL here, e.g. http://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
      />

      <button
        className="btn-primary scan-demo-btn"
        onClick={handleCheck}
        disabled={loading || !url.trim()}
      >
        {loading ? 'Checking...' : 'Check Link →'}
      </button>

      {error && <p className="scan-demo-error">{error}</p>}

      {result && (
        <>
          <div className="scan-demo-result">
            <span className={`verdict-pill ${verdictClass(result.verdict)}`}>
              <span className="dot"></span> {result.verdict}
            </span>
            <span className="risk-score">
              Risk score <strong>{result.risk_score}</strong>/100
            </span>
          </div>

          {result.flags.length > 0 && (
            <div className="flagged-phrases">
              <span className="scan-demo-label">Flagged because:</span>
              <div className="phrase-tags">
                {result.flags.map((flag) => (
                  <span key={flag} className="phrase-tag">{flag}</span>
                ))}
              </div>
            </div>
          )}

          {result.details?.domain_age_days != null && (
            <div className="flagged-phrases">
              <span className="scan-demo-label">
                Domain age: {result.details.domain_age_days} days
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LinkChecker