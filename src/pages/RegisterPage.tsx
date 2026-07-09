import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name, adminCode || undefined)
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
        <h1>Registrieren</h1>
        <p className="page-subtitle">Erstell ein Konto, um die App zu nutzen.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}

          <label className="auth-label">
            Name
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Dein Name" />
          </label>

          <label className="auth-label">
            E-Mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="deine@email.de" />
          </label>

          <label className="auth-label">
            Passwort
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mind. 6 Zeichen" minLength={6} />
          </label>

          <label className="auth-label auth-label-opt">
            Admin-Code (optional)
            <input type="text" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Nur für Admins" />
          </label>

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? 'Wird registriert…' : 'Registrieren'}
          </button>
        </form>

        <p className="auth-footer">
          Bereits registriert? <Link to="/anmelden">Anmelden</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
