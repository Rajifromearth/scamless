import { useState } from 'react'

const API_URL = 'https://scamless-backend.onrender.com'

function ImageChecker() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setResult(null)
    setError(null)
  }

  async function handleCheck() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_URL}/api/image-check`, {
        method: 'POST',
        body: formData,
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
    if (verdict === 'Likely AI-generated') return 'high'
    if (verdict === 'Uncertain') return 'medium'
    return 'low'
  }

  return (
    <div className="scan-demo">
      <div className="scan-demo-top">
        <span className="scan-demo-label">Image scan · live</span>
        <span className="scan-demo-label">scamless.app</span>
      </div>

      <label className="image-upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="image-preview" />
        ) : (
          <span className="scan-demo-label">Click to upload an image</span>
        )}
      </label>

      <button
        className="btn-primary scan-demo-btn"
        onClick={handleCheck}
        disabled={loading || !file}
      >
        {loading ? 'Analyzing...' : 'Check Image →'}
      </button>

      {error && <p className="scan-demo-error">{error}</p>}

      {result && (
        <div className="scan-demo-result">
          <span className={`verdict-pill ${verdictClass(result.verdict)}`}>
            <span className="dot"></span> {result.verdict}
          </span>
          <span className="risk-score">
            AI probability <strong>{Math.round(result.ai_generated_probability * 100)}</strong>%
          </span>
        </div>
      )}
    </div>
  )
}

export default ImageChecker