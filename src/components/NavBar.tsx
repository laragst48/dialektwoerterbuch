import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './NavBar.css'

const navItems = [
  { path: '/uebersetzen', label: 'Übersetzen', icon: '⇄' },
  { path: '/woerterbuch', label: 'Wörterbuch', icon: '📖' },
  { path: '/aufnahmen', label: 'Aufnahmen', icon: '🎙' },
  { path: '/informationen', label: 'Info', icon: 'ℹ' },
]

function NavBar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/anmelden')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <img src="/wappen.png" alt="Wappen Wenigumstadt" className="brand-wappen" />
          <span className="brand-text">
            <span className="brand-title">Dialekta</span>
          </span>
        </NavLink>
        <nav className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">⚙</span>
              <span className="nav-label">Admin</span>
            </NavLink>
          )}
          {user && (
            <button className="nav-link nav-logout" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Abmelden</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
