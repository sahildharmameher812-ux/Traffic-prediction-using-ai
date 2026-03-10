import { useState } from 'react'
import axios from 'axios'
import './Weather.css'

const API = 'http://localhost:5000'

const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad']

interface WeatherData {
  city: string
  country: string
  temp: number
  feels_like: number
  humidity: number
  description: string
  icon: string
  wind_speed: number
  visibility: number
}

export default function Weather() {
  const [city,    setCity]    = useState('')
  const [loading, setLoading] = useState(false)
  const [data,    setData]    = useState<WeatherData | null>(null)
  const [error,   setError]   = useState('')

  async function fetchWeather(cityName?: string) {
    const target = (cityName || city).trim()
    if (!target) { setError('City ka naam daalo!'); return }
    setLoading(true)
    setData(null)
    setError('')
    try {
      const res = await axios.get(`${API}/api/weather`, { params: { city: target } })
      setData(res.data)
    } catch (e: any) {
      setError(e.response?.data?.error || 'Weather fetch nahi hua. API key check karo!')
    } finally {
      setLoading(false)
    }
  }

  function getTempColor(temp: number) {
    if (temp >= 35) return '#ff4444'
    if (temp >= 28) return '#ff8c00'
    if (temp >= 20) return '#ff6b2b'
    if (temp >= 10) return '#44aaff'
    return '#88ccff'
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="tag">WEATHER</div>
        <h1>City <span>Weather</span></h1>
        <p>Kisi bhi city ka real-time weather — temperature, humidity, wind speed aur zyada</p>
      </div>

      <div className="weather-form card">
        <div className="weather-input-row">
          <div className="weather-input-wrap">
            <label className="input-label">🌍 City Name</label>
            <input
              className="input-field"
              placeholder="e.g. Mumbai, Delhi, Pune..."
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather()}
            />
          </div>
          <button className="btn-primary weather-btn" onClick={() => fetchWeather()} disabled={loading}>
            {loading ? '...' : '🌤️ Get Weather'}
          </button>
        </div>

        <div className="city-chips">
          {popularCities.map(c => (
            <button key={c} className="city-chip" onClick={() => { setCity(c); fetchWeather(c) }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Weather data fetch ho raha hai...</p>
        </div>
      )}

      {data && (
        <div className="weather-results animate-fadeUp">
          <div className="weather-main-card card">
            <div className="wmc-top">
              <div>
                <div className="wmc-city">{data.city}, {data.country}</div>
                <div className="wmc-desc">{data.description}</div>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                alt={data.description}
                className="weather-icon-img"
              />
            </div>
            <div className="wmc-temp" style={{ color: getTempColor(data.temp) }}>
              {Math.round(data.temp)}°C
            </div>
            <div className="wmc-feels">Feels like {Math.round(data.feels_like)}°C</div>
          </div>

          <div className="weather-details-grid">
            <div className="card wdc">
              <div className="wdc-icon">💧</div>
              <div className="wdc-label">Humidity</div>
              <div className="wdc-value">{data.humidity}%</div>
            </div>
            <div className="card wdc">
              <div className="wdc-icon">💨</div>
              <div className="wdc-label">Wind Speed</div>
              <div className="wdc-value">{data.wind_speed} m/s</div>
            </div>
            <div className="card wdc">
              <div className="wdc-icon">👁️</div>
              <div className="wdc-label">Visibility</div>
              <div className="wdc-value">{data.visibility} km</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}