import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import BottomNav from './components/BottomNav'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TranslatePage from './pages/TranslatePage'
import DictionaryPage from './pages/DictionaryPage'
import RecordingPage from './pages/RecordingPage'
import InfoPage from './pages/InfoPage'
import AdminPage from './pages/AdminPage'

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src="/wappen.png" alt="Wappen Wenigumstadt" className="splash-logo" />
        <h1 className="splash-title">Dialekta</h1>
        <div className="splash-spinner" />
      </div>
    </div>
  )
}

function AuthPages() {
  return (
    <div className="app app-auth">
      <Routes>
        <Route path="*" element={<Navigate to="/anmelden" replace />} />
        <Route path="/anmelden" element={<LoginPage />} />
        <Route path="/registrieren" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

function AppPages() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/uebersetzen" replace />} />
          <Route path="/uebersetzen" element={<TranslatePage />} />
          <Route path="/woerterbuch" element={<DictionaryPage />} />
          <Route path="/aufnahmen" element={<RecordingPage />} />
          <Route path="/informationen" element={<InfoPage />} />
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/uebersetzen" replace />} />
          <Route path="/anmelden" element={<Navigate to="/uebersetzen" replace />} />
          <Route path="/registrieren" element={<Navigate to="/uebersetzen" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <SplashScreen />
  if (!user) return <AuthPages />
  return <AppPages />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
