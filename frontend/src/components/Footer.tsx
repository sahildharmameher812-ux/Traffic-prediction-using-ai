import { NavLink } from 'react-router-dom'
import './Footer.css'

const navLinks = [
  { path: '/',          label: 'Home' },
  { path: '/dashboard', label: 'Journey Planner' },
  { path: '/route',     label: 'Best Route' },
  { path: '/weather',   label: 'Weather' },
  { path: '/chatbot',   label: 'AI Assistant' },
  { path: '/about',     label: 'About Us' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#FF6B2B" strokeWidth="1.5"/>
              <path d="M10 5 L10 10 L14 13" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="1.5" fill="#FF6B2B"/>
            </svg>
            <span className="footer-logo">Urban Nav</span>
          </div>
          <p className="footer-brand-desc">
            AI-Driven Predictive Urban Navigation<br />& Mobility Optimization
          </p>
        </div>

        <div className="footer-links">
          {navLinks.map(l => (
            <NavLink key={l.path} to={l.path} end={l.path === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="footer-right">
          <div className="footer-badge">Horizon 1.0 Hackathon</div>
          <p className="footer-college">Vidyavardhini College of Engineering</p>
        </div>

      </div>
      <div className="footer-bottom">
        <p>© 2025 Urban Nav · Built for smarter cities</p>
      </div>
    </footer>
  )
}