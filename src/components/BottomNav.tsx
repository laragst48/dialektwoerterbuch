import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './BottomNav.css'

function BottomNav() {
  const { user, isAdmin, logout } = useAuth()

  return (
    <nav className="bottom-nav">
      <NavLink to="/uebersetzen" className={({ isActive }) => `bnav-link ${isActive ? 'active' : ''}`}>
        <span className="bnav-icon">⇄</span>
        <span className="bnav-label">Übersetzen</span>
      </NavLink>
      <NavLink to="/woerterbuch" className={({ isActive }) => `bnav-link ${isActive ? 'active' : ''}`}>
        <span className="bnav-icon">📖</span>
        <span className="bnav-label">Wörterbuch</span>
      </NavLink>
      <NavLink to="/aufnahmen" className={({ isActive }) => `bnav-link ${isActive ? 'active' : ''}`}>
        <span className="bnav-icon">🎙</span>
        <span className="bnav-label">Aufnahmen</span>
      </NavLink>
      <NavLink to="/informationen" className={({ isActive }) => `bnav-link ${isActive ? 'active' : ''}`}>
        <span className="bnav-icon">ℹ</span>
        <span className="bnav-label">Info</span>
      </NavLink>
      <details className="bnav-more">
        <summary className="bnav-link">
          <span className="bnav-icon">⚬⚬⚬</span>
          <span className="bnav-label">Mehr</span>
        </summary>
        <div className="bnav-more-menu">
          {isAdmin && (
            <NavLink to="/admin" className="bnav-more-item">
              <span className="bnav-icon">⚙</span>
              <span className="bnav-label">Admin</span>
            </NavLink>
          )}
          {user && (
            <button className="bnav-more-item bnav-logout" onClick={logout}>
              <span className="bnav-icon">🚪</span>
              <span className="bnav-label">Abmelden</span>
            </button>
          )}
        </div>
      </details>
    </nav>
  )
}

export default BottomNav
