import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import ExplorePage from './pages/ExplorePage'
import WritePage from './pages/WritePage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <WritePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
