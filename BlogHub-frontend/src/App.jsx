import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/landing/Navbar'
import Hero from './components/landing/Hero'
import TrendingMarquee from './components/landing/TrendingMarquee'
import FeaturedPosts from './components/landing/FeaturedPosts'
import Features from './components/landing/Features'
import CallToAction from './components/landing/CallToAction'
import Footer from './components/landing/Footer'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './context/AuthContext'

function LandingPage() {
  return (
    <div className="min-h-screen bg-obsidian text-chrome flex flex-col">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col"
      >
        <Hero />
        <TrendingMarquee />
        <FeaturedPosts />
        <Features />
        <CallToAction />
        <Footer />
      </motion.div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
