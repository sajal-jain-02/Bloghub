import { motion } from 'framer-motion'
import Navbar from './components/landing/Navbar'
import Hero from './components/landing/Hero'
import TrendingMarquee from './components/landing/TrendingMarquee'
import FeaturedPosts from './components/landing/FeaturedPosts'
import Features from './components/landing/Features'

function App() {
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
      </motion.div>
    </div>
  )
}

export default App
