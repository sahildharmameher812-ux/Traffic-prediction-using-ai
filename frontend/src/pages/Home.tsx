import { Link } from 'react-router-dom'
import './Home.css'

const features = [
  {
    icon: '🧠',
    title: 'Journey Planner',
    desc: 'AI predicts traffic, departure time, parking & best transport mode for your route.',
    path: '/dashboard',
    tag: 'LSTM + Random Forest',
  },
  {
    icon: '🗺️',
    title: 'Best Route',
    desc: 'Get the optimal driving route between any two cities with turn-by-turn directions.',
    path: '/route',
    tag: 'OpenRouteService',
  },
  {
    icon: '🌤️',
    title: 'City Weather',
    desc: 'Real-time weather data for any city — temperature, humidity, wind & more.',
    path: '/weather',
    tag: 'OpenWeatherMap',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Chat with Gemini AI for travel tips, route advice, and urban mobility queries.',
    path: '/chatbot',
    tag: 'Google Gemini',
  },
]

const stats = [
  { value: 'LSTM',   label: 'Traffic Model' },
  { value: '70.75%', label: 'Departure Accuracy' },
  { value: '100%',   label: 'Parking Accuracy' },
  { value: '86.82%', label: 'User Mode Accuracy' },
]

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🏆 Horizon 1.0 Hackathon</div>
          <h1 className="hero-title">
            Navigate Cities<br />
            <span>Smarter with AI</span>
          </h1>
          <p className="hero-desc">
            WINNER combines LSTM, Random Forest & XGBoost models to predict traffic,
            optimize departure times, and guide you through the city — intelligently.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">Plan My Journey →</Link>
            <Link to="/about"     className="btn-outline">Meet the Team</Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-ring ring-1"></div>
          <div className="visual-ring ring-2"></div>
          <div className="visual-ring ring-3"></div>
          <div className="visual-center">
            <span>🏆</span>
          </div>
          <div className="visual-dot dot-1">🚗</div>
          <div className="visual-dot dot-2">🚦</div>
          <div className="visual-dot dot-3">🅿️</div>
          <div className="visual-dot dot-4">🌤️</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-label">WHAT WE OFFER</div>
        <h2 className="section-title">Four Powerful <span>AI Modules</span></h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <Link to={f.path} className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-tag">{f.tag}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Beat the Traffic?</h2>
          <p>Let AI plan your perfect journey — right now.</p>
          <Link to="/dashboard" className="btn-primary">Get Started Free →</Link>
        </div>
      </section>
    </div>
  )
}