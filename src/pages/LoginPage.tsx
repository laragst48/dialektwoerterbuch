import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(name, password)
      navigate('/uebersetzen')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo-wrap">
          <img src="/wappen.png" alt="Dialekta" className="auth-logo" />
        </div>
        <h1>Anmelden</h1>
        <p className="page-subtitle">Melde dich an, um die App zu nutzen.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}

          <label className="auth-label">
            Benutzername
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Dein Benutzername" />
          </label>

          <label className="auth-label">
            Passwort
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Passwort" />
          </label>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Wird angemeldet…' : 'Anmelden'}
          </button>
        </form>

        <p className="auth-footer">
          Noch kein Konto? <Link to="/registrieren">Registrieren</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
