import { Link } from 'react-router-dom'
import './Home.css'

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Journey Planner',
    desc: 'AI predicts traffic, departure time, parking & best transport mode for your route.',
    path: '/dashboard',
    tag: 'LSTM · Random Forest',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Best Route',
    desc: 'Optimal driving route between any two cities with turn-by-turn directions.',
    path: '/route',
    tag: 'OpenRouteService',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 4-4 8-4 8s-4-4-4-8a4 4 0 0 1 4-4z"/>
        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'City Weather',
    desc: 'Real-time weather for any city — temperature, humidity, wind & more.',
    path: '/weather',
    tag: 'OpenWeatherMap',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'AI Assistant',
    desc: 'Chat with Gemini AI for travel tips, route advice, and urban mobility queries.',
    path: '/chatbot',
    tag: 'Google Gemini',
  },
]

const stats = [
  { value: 'LSTM',    label: 'Traffic Model' },
  { value: '70.75%', label: 'Departure Accuracy' },
  { value: '100%',   label: 'Parking Accuracy' },
  { value: '86.82%', label: 'Transport Mode' },
]

export default function Home() {
  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            Horizon 1.0 Hackathon
          </div>

          <h1 className="hero-title">
            Navigate Cities<br />
            <span className="hero-accent">Smarter with AI</span>
          </h1>

          <p className="hero-desc">
            Urban Nav combines LSTM, Random Forest & XGBoost to predict traffic,
            optimize departure times, and guide you intelligently through the city.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Plan My Journey
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/about" className="btn-outline">Meet the Team</Link>
          </div>
        </div>

        <div className="hero-visual">
          {/* Outer decorative rings */}
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>

          {/* Central hub */}
          <div className="ring-core">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FF6B2B" strokeWidth="1.2" strokeDasharray="3 2"/>
              <circle cx="12" cy="12" r="4" fill="rgba(255,107,43,0.15)" stroke="#FF6B2B" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="1.5" fill="#FF6B2B"/>
            </svg>
          </div>

          {/* Connecting lines SVG layer */}
          <svg className="visual-lines" viewBox="0 0 340 340" fill="none">
            <line x1="170" y1="170" x2="170" y2="65"  stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35"/>
            <line x1="170" y1="170" x2="275" y2="170" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35"/>
            <line x1="170" y1="170" x2="170" y2="275" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35"/>
            <line x1="170" y1="170" x2="65"  y2="170" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35"/>
            <line x1="170" y1="170" x2="240" y2="100" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.20"/>
            <line x1="170" y1="170" x2="100" y2="240" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.20"/>
          </svg>

          {/* Top — Route */}
          <div className="orbit-dot orbit-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
            <span className="orbit-label">Route</span>
          </div>

          {/* Right — Traffic */}
          <div className="orbit-dot orbit-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="6"  r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/>
              <line x1="4" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="20" y2="12"/>
            </svg>
            <span className="orbit-label">Traffic</span>
          </div>

          {/* Bottom — Parking */}
          <div className="orbit-dot orbit-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
            </svg>
            <span className="orbit-label">Parking</span>
          </div>

          {/* Left — Weather */}
          <div className="orbit-dot orbit-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <span className="orbit-label">Weather</span>
          </div>

          {/* Diagonal — AI */}
          <div className="orbit-dot orbit-5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
            </svg>
            <span className="orbit-label">AI</span>
          </div>

          {/* Diagonal — Mode */}
          <div className="orbit-dot orbit-6">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 3v5h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span className="orbit-label">Mode</span>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────── */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-title">Four Powerful <span>AI Modules</span></h2>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <Link
              to={f.path}
              className="feature-card"
              key={i}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="feature-top">
                <div className="feature-icon">{f.icon}</div>
                <span className="feature-tag-badge">{f.tag}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-footer">
                <span className="feature-cta">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="cta-eyebrow">Ready to start?</p>
          <h2 className="cta-title">Beat Traffic.<br />Travel Smarter.</h2>
          <p className="cta-desc">Let AI plan your perfect journey — right now.</p>
          <Link to="/dashboard" className="btn-primary">
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

    </div>
  )
}