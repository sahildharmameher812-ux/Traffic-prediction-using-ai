import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/',          label: 'Home' },
  { path: '/dashboard', label: 'Journey Planner' },
  { path: '/route',     label: 'Best Route' },
  { path: '/weather',   label: 'Weather' },
  { path: '/chatbot',   label: 'AI Assistant' },
  { path: '/about',     label: 'About Us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">🏆</span>
          <div>
            <span className="logo-text">WINNER</span>
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
        </ul>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}