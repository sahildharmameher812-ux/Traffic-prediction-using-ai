import { useState } from 'react'
import axios from 'axios'
import './BestRoute.css'

const API = 'http://localhost:5000'

interface RouteResult {
  origin: string
  destination: string
  distance_km: number
  duration_min: number
  steps: { instruction: string; distance: number }[]
}

export default function BestRoute() {
  const [origin,      setOrigin]      = useState('')
  const [destination, setDestination] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<RouteResult | null>(null)
  const [error,       setError]       = useState('')

  async function getRoute() {
    if (!origin.trim() || !destination.trim()) {
      setError('Dono cities ka naam daalo!')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await axios.get(`${API}/api/route`, { params: { origin, destination } })
      setResult(res.data)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Route fetch nahi hua. API key check karo!')
    } finally {
      setLoading(false)
    }
  }

  function formatDuration(min: number) {
    const h = Math.floor(min / 60)
    const m = Math.round(min % 60)
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="tag">ROUTE FINDER</div>
        <h1>Find the <span>Best Route</span></h1>
        <p>Do cities ke beech optimal driving route — turn-by-turn directions ke saath</p>
      </div>

      <div className="route-form card">
        <div className="route-form-grid">
          <div>
            <label className="input-label">📍 Origin City</label>
            <input
              className="input-field"
              placeholder="e.g. Mumbai"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && getRoute()}
            />
          </div>
          <div className="route-swap">
            <div className="swap-line"></div>
            <button className="swap-btn" onClick={() => { setOrigin(destination); setDestination(origin) }}>⇄</button>
            <div className="swap-line"></div>
          </div>
          <div>
            <label className="input-label">🎯 Destination City</label>
            <input
              className="input-field"
              placeholder="e.g. Pune"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && getRoute()}
            />
          </div>
        </div>
        <button className="btn-primary route-btn" onClick={getRoute} disabled={loading}>
          {loading ? 'Route Dhundh Raha Hai...' : '🗺️ Best Route Batao'}
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Optimal route calculate ho raha hai...</p>
        </div>
      )}

      {result && (
        <div className="route-results animate-fadeUp">
          <div className="route-summary-cards">
            <div className="rscard card">
              <div className="rscard-icon">📍→🎯</div>
              <div className="rscard-label">Route</div>
              <div className="rscard-value">{result.origin} → {result.destination}</div>
            </div>
            <div className="rscard card">
              <div className="rscard-icon">📏</div>
              <div className="rscard-label">Total Distance</div>
              <div className="rscard-value">{result.distance_km} km</div>
            </div>
            <div className="rscard card">
              <div className="rscard-icon">⏱️</div>
              <div className="rscard-label">Est. Duration</div>
              <div className="rscard-value">{formatDuration(result.duration_min)}</div>
            </div>
          </div>

          <div className="card route-steps-card">
            <h3 className="steps-title">🧭 Turn-by-Turn Directions</h3>
            <div className="steps-list">
              {result.steps.map((step, i) => (
                <div className="step-item" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-body">
                    <div className="step-instruction">{step.instruction}</div>
                    <div className="step-distance">{step.distance} km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}