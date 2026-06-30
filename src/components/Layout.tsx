import { Outlet, Link, useLocation } from 'react-router-dom'
import { Shield, PlayCircle, BookOpen, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Shield },
    { path: '/demo', label: 'Demo', icon: PlayCircle },
    { path: '/docs', label: 'Documentation', icon: BookOpen },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      <header className="control-panel sticky top-0 z-50 border-b border-primary-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-500/30 border border-primary-400/50 flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(0, 180, 255, 0.3)' }}
                >
                  <Shield className="w-5 h-5 text-primary-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-neutral-900" />
              </div>
              <span className="font-mono text-lg font-bold text-primary-300">CRYO BALL</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-mono">{label}</span>
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary-400/20"
            >
              <nav className="px-4 py-4 space-y-2">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(path)
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-mono">{label}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="control-panel border-t border-primary-400/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-sm text-neutral-400">
                CRYO BALL SYSTEMS — OPERATIONAL
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
              <span>v2.4.1</span>
              <span>•</span>
              <span>NODE: ALPHA-7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
