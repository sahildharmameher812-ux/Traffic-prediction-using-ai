import { NavLink } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🏆 WINNER</span>
          <p>AI-Driven Predictive Urban Navigation<br />& Mobility Optimization</p>
        </div>

        <div className="footer-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Journey Planner</NavLink>
          <NavLink to="/route">Best Route</NavLink>
          <NavLink to="/weather">Weather</NavLink>
          <NavLink to="/chatbot">AI Assistant</NavLink>
          <NavLink to="/about">About Us</NavLink>
        </div>

        <div className="footer-right">
          <p className="footer-hackathon">Horizon 1.0 Hackathon</p>
          <p className="footer-college">Vidyavardhini College of Engineering</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 WINNER. Built with ❤️ for smarter cities.</p>
      </div>
    </footer>
  )
}