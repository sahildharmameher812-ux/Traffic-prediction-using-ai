import { useState } from 'react'
import axios from 'axios'
import './Dashboard.css'

const API = 'http://localhost:5000'

const originNames:   Record<number, string> = {0:'Andheri',1:'Borivali',2:'Thane',3:'Dadar',4:'Malad',5:'Navi Mumbai',6:'Kandivali',7:'Bandra',8:'Powai',9:'Vasai'}
const destNames:     Record<number, string> = {0:'BKC',1:'Churchgate',2:'Kurla',3:'Nariman Point',4:'Lower Parel',5:'CST',6:'Goregaon',7:'Worli',8:'Ghatkopar',9:'Andheri'}
const parkingMap: Record<number, {lot:number, capacity:number, price:number}> = {
  0:{lot:1,capacity:500,price:50}, 1:{lot:9,capacity:250,price:20},
  2:{lot:7,capacity:550,price:30}, 3:{lot:9,capacity:300,price:40},
  4:{lot:2,capacity:800,price:60}, 5:{lot:9,capacity:250,price:20},
  6:{lot:3,capacity:600,price:40}, 7:{lot:9,capacity:400,price:50},
  8:{lot:7,capacity:550,price:30}, 9:{lot:0,capacity:200,price:30},
}

const congestionEmoji: Record<string, string> = {
  'Low': '🟢 Low', 'Medium': '🟡 Medium', 'High': '🟠 High', 'Very High': '🔴 Very High'
}
const transportEmoji: Record<string, string> = {
  'Auto': '🛺 Auto', 'Bike': '🏍️ Bike', 'Car': '🚗 Car', 'Train+Auto': '🚂 Train+Auto'
}
const parkingEmoji: Record<string, string> = {
  'Available': '🟢 Available', 'Full': '🔴 Full'
}

interface Results { traffic: any; departure: any; parking: any; user: any }

function getCongClass(level: string) {
  if (level === 'Very High') return 'badge-vhigh'
  if (level === 'High')      return 'badge-high'
  if (level === 'Medium')    return 'badge-medium'
  return 'badge-low'
}

export default function Dashboard() {
  const [origin,      setOrigin]      = useState(0)
  const [destination, setDestination] = useState(0)
  const [arrivalTime, setArrivalTime] = useState('09:00')
  const [loading,     setLoading]     = useState(false)
  const [results,     setResults]     = useState<Results | null>(null)
  const [error,       setError]       = useState('')

  async function planJourney() {
    setLoading(true)
    setResults(null)
    setError('')

    const [arrH, arrM] = arrivalTime.split(':').map(Number)
    const travelMins = 40
    const rawDepart  = new Date(2024, 0, 1, arrH, arrM - travelMins)
    const deptH      = rawDepart.getHours()
    const today      = new Date()
    const weekday    = today.getDay()
    const month      = today.getMonth() + 1
    const pm         = parkingMap[destination]

    try {
      const [tR, dR, pR, uR] = await Promise.all([
        axios.post(`${API}/predict/traffic`,   { hour: arrH, day: weekday, month, temp: 303, rain: 0, clouds: 50 }),
        axios.post(`${API}/predict/departure`, { hour: deptH, weekday, month, origin, destination, travel_time: travelMins, delay: 15, is_raining: 0, recommended_hour: deptH }),
        axios.post(`${API}/predict/parking`,   { parking_lot: pm.lot, area: destination, total_capacity: pm.capacity, occupied: Math.floor(pm.capacity * 0.6), price_per_hour: pm.price, hour: arrH, day: weekday, lat: 19.07, lng: 72.87, minute: 0, month }),
        axios.post(`${API}/predict/user`,      { origin, destination, actual_travel: travelMins, used_parking: 1, parking_pref: 0, satisfaction: 4, avg_rating: 4.0, hour: deptH, day: weekday, month }),
      ])
      setResults({ traffic: tR.data, departure: dR.data, parking: pR.data, user: uR.data })
    } catch (e: any) {
      const msg = e.response?.data?.error || ''
      const trace = e.response?.data?.trace || ''
      setError(`Backend error: ${msg}${trace ? '\n' + trace.split('\n').slice(-3).join('\n') : ''}`)
    } finally {
      setLoading(false)
    }
  }

  const oN = originNames[origin]
  const dN = destNames[destination]

  return (
    <div className="page">
      <div className="page-header">
        <div className="tag">AI JOURNEY PLANNER</div>
        <h1>Plan Your <span>Journey</span></h1>
        <p>Sirf 3 cheezein batao — LSTM, Random Forest & XGBoost baaki sab sambhal lega</p>
      </div>

      {/* ── Form ── */}
      <div className="dash-form card">
        <div className="dash-form-grid">
          <div>
            <label className="input-label">📍 Kahan Se?</label>
            <select className="input-field" value={origin} onChange={e => setOrigin(+e.target.value)}>
              {Object.entries(originNames).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">🎯 Kahan Jaana Hai?</label>
            <select className="input-field" value={destination} onChange={e => setDestination(+e.target.value)}>
              {Object.entries(destNames).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">⏰ Pohchne Ka Time?</label>
            <input type="time" className="input-field" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary dash-btn" onClick={planJourney} disabled={loading}>
          {loading ? 'AI Analyze Kar Raha Hai...' : '🧠 AI Se Plan Karo'}
        </button>
      </div>

      {error && <div className="error-alert" style={{whiteSpace:'pre-wrap'}}>{error}</div>}

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>AI aapki journey analyze kar raha hai... 🤖</p>
        </div>
      )}

      {results && (
        <div className="dash-results animate-fadeUp">
          <div className="dash-route-label">
            <span>{oN}</span>
            <span className="arrow">→</span>
            <span>{dN}</span>
            <span className="time-tag">Pohchna: {arrivalTime}</span>
          </div>

          <div className="dash-summary card">
            <div className="summary-icon">💡</div>
            <div>
              <h4>AI Ka Smart Suggestion</h4>
              <p>
                <strong>{results.departure.recommended_time}</strong> pe niklo {oN} se,{' '}
                <strong>{transportEmoji[results.user.recommended_transport] || results.user.recommended_transport}</strong> lo.{' '}
                {arrivalTime.split(':')[0]}:00 baje traffic <strong>{congestionEmoji[results.traffic.congestion_level] || results.traffic.congestion_level}</strong>.{' '}
                {dN} parking: <strong>{parkingEmoji[results.parking.parking_status] || results.parking.parking_status}</strong> ({results.parking.available_spots} spots available).
              </p>
            </div>
          </div>

          <div className="dash-grid">
            <div className="card result-card">
              <div className="rc-icon">🚦</div>
              <div className="rc-label">Traffic Forecast</div>
              <div className={`rc-value badge ${getCongClass(results.traffic.congestion_level)}`}>
                {congestionEmoji[results.traffic.congestion_level] || results.traffic.congestion_level}
              </div>
              <div className="rc-desc">{arrivalTime.split(':')[0]}:00 baje ~{results.traffic.predicted_volume} vehicles/hr honge</div>
            </div>

            <div className="card result-card">
              <div className="rc-icon">🕐</div>
              <div className="rc-label">Ghar Se Niklo</div>
              <div className="rc-value">{results.departure.recommended_time}</div>
              <div className="rc-desc">{oN} se {results.departure.recommended_time} pe niklo. {results.departure.advice}</div>
            </div>

            <div className="card result-card">
              <div className="rc-icon">🅿️</div>
              <div className="rc-label">Parking Status</div>
              <div className={`rc-value badge ${results.parking.parking_status === 'Available' ? 'badge-low' : 'badge-vhigh'}`}>
                {parkingEmoji[results.parking.parking_status] || results.parking.parking_status}
              </div>
              <div className="rc-desc">{dN} me {results.parking.available_spots} spots | ₹{results.parking.price_per_hour}/hr</div>
            </div>

            <div className="card result-card">
              <div className="rc-icon">🚗</div>
              <div className="rc-label">Best Transport</div>
              <div className="rc-value">{transportEmoji[results.user.recommended_transport] || results.user.recommended_transport}</div>
              <div className="rc-desc">{oN} se {dN} ke liye best option</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}