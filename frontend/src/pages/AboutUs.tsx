import './AboutUs.css'

const team = [
  { name: 'Sahil Dharmameher', role: 'ML Engineer',    emoji: '🧠', desc: 'LSTM traffic model & data pipeline' },
  { name: 'Esha Malekar',      role: 'Backend Dev',    emoji: '⚙️', desc: 'Flask API & model integration' },
  { name: 'Arya Gaikwad',      role: 'Frontend Dev',   emoji: '🎨', desc: 'React UI & user experience' },
  { name: 'Dhruv Patel',       role: 'Data Scientist', emoji: '📊', desc: 'XGBoost & Random Forest models' },
]

const techStack = [
  { icon: '🐍', name: 'Python / Flask',    desc: 'Backend API' },
  { icon: '⚛️', name: 'React + TypeScript', desc: 'Frontend' },
  { icon: '🧠', name: 'TensorFlow LSTM',   desc: 'Traffic Prediction' },
  { icon: '🌲', name: 'Random Forest',     desc: 'Departure Planning' },
  { icon: '🚀', name: 'XGBoost',           desc: 'Parking Prediction' },
  { icon: '🤖', name: 'Google Gemini',     desc: 'AI Chatbot' },
  { icon: '🌤️', name: 'OpenWeatherMap',    desc: 'Weather Data' },
  { icon: '🗺️', name: 'OpenRouteService',  desc: 'Route Planning' },
]

export default function AboutUs() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="tag">ABOUT US</div>
        <h1>Meet the <span>Team</span></h1>
        <p>Vidyavardhini College of Engineering ke students ne banaya — Horizon 1.0 Hackathon ke liye</p>
      </div>

      {/* ── Mission ── */}
      <div className="about-mission card">
        <div className="mission-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div>
          <h2>Our Mission</h2>
          <p>
            Urban Nav ka goal hai Mumbai jaise crowded cities mein logon ko smarter travel decisions
            lene mein help karna. AI aur Machine Learning ki power se hum traffic predict karte hain,
            best departure time suggest karte hain, aur parking dhundhne mein help karte hain —
            taaki aapka time bachaye aur travel stress-free bane.
          </p>
        </div>
      </div>

      {/* ── Team ── */}
      <div className="about-section">
        <h2 className="about-section-title">The Team</h2>
        <div className="team-grid">
          {team.map((m, i) => (
            <div className="team-card card" key={i}>
              <div className="team-emoji">{m.emoji}</div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <div className="team-desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="about-section">
        <h2 className="about-section-title">Tech Stack</h2>
        <div className="tech-grid">
          {techStack.map((t, i) => (
            <div className="tech-card card" key={i}>
              <span className="tech-icon">{t.icon}</span>
              <div>
                <div className="tech-name">{t.name}</div>
                <div className="tech-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hackathon Banner ── */}
      <div className="hackathon-banner card">
        <div className="hb-left">
          <div className="hb-tag">EVENT</div>
          <h3>Horizon 1.0 Hackathon</h3>
          <p>Vidyavardhini College of Engineering, Mumbai</p>
        </div>
        <div className="hb-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M8 14l-4 7h16l-4-7"/>
            <path d="M9 11l3 3 3-3"/>
          </svg>
        </div>
      </div>
    </div>
  )
}