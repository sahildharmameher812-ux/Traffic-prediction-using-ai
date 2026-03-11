import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/',          label: 'Home' },
  { path: '/dashboard', label: 'Journey Planner' },
  { path: '/route',     label: 'Best Route' },
  { path: '/weather',   label: 'Weather' },
  { path: '/chatbot',   label: 'AI Assistant' },
  { path: '/about',     label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#FF6B2B" strokeWidth="1.5"/>
              <path d="M10 5 L10 10 L14 13" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="1.5" fill="#FF6B2B"/>
            </svg>
          </div>
          <div className="logo-text-wrap">
            <span className="logo-text">Urban Nav</span>
            <span className="logo-sub">AI Urban Navigation</span>
          </div>
        </NavLink>

        <ul className={`navbar-links ${open ? 'open' : ''}`}>
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setOpen(false)}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/dashboard" className="nav-cta" onClick={() => setOpen(false)}>
              Plan Journey
            </NavLink>
          </li>
        </ul>

        <button
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}