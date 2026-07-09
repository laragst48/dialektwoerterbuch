import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, setToken, clearToken } from '../services/api'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (name: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, adminCode?: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('dialekta_token')
    if (token) {
      api.auth.me()
        .then((data) => setUser(data.user))
        .catch(() => {
          clearToken()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (name: string, password: string) => {
    const data = await api.auth.login(name, password)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (email: string, password: string, name: string, adminCode?: string) => {
    const data = await api.auth.register(email, password, name, adminCode)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
