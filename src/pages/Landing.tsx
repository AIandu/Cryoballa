import { Link } from 'react-router-dom'
import { Shield, Zap, ArrowRight, Radio, Crosshair, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const systemStatus = [
  { label: 'BALLISTIC', value: 'READY', status: 'active' },
  { label: 'THERMAL', value: 'READY', status: 'active' },
  { label: 'ENVIRONMENT', value: 'READY', status: 'active' },
]

const deploymentStats = [
  { label: 'Units Online', value: '247', trend: '+12' },
  { label: 'Active Missions', value: '3', trend: 'LIVE' },
  { label: 'Rescue Rate', value: '100%', trend: 'VERIFIED' },
  { label: 'Response Time', value: '1.8s', trend: 'OPTIMAL' },
]

export default function Landing() {
  return (
    <div className="min-h-screen hex-pattern">
      {/* Main Control Interface */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-12">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0, 180, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Top Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-neutral-400 font-mono">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center gap-6">
              {systemStatus.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-mono">{item.label}</span>
                  <span className={`text-xs font-mono ${item.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Control Panel */}
          <div className="control-panel rounded-2xl p-8 hud-border hud-scanline">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: System Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-6">
                  <div className="text-xs font-mono text-primary-400 mb-2 tracking-widest">
                    AUTONOMOUS SURVIVAL SYSTEM
                  </div>
                  <h1 className="font-mono text-5xl md:text-6xl font-bold mb-4">
                    <span className="stat-glow text-primary-300">CRYO BALL</span>
                  </h1>
                  <div className="w-32 h-1 bg-gradient-to-r from-primary-400 to-transparent mb-6" />
                </div>

                <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
                  Thermos-sized deployment unit. Inflates to full protection sphere
                  in 1.8 seconds. AI-coordinated rescue operations.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/demo"
                    className="group flex items-center gap-3 px-6 py-4 bg-primary-500/20 border border-primary-400/50 rounded-lg hover:bg-primary-500/30 transition-all"
                  >
                    <Zap className="w-5 h-5 text-primary-400" />
                    <span className="font-mono text-primary-200">DEPLOY SIMULATION</span>
                    <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-6 py-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <Radio className="w-5 h-5 text-neutral-400" />
                    <span className="font-mono text-neutral-300">COMMAND CENTER</span>
                  </Link>
                </div>
              </motion.div>

              {/* Right: 3D Sphere Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="sphere-3d flex items-center justify-center"
              >
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  {/* Outer rings */}
                  <div className="sphere-ring absolute inset-0" style={{ animationDelay: '0s' }} />
                  <div className="sphere-ring absolute inset-4" style={{ animationDelay: '0.5s' }} />
                  <div className="sphere-ring absolute inset-8" style={{ animationDelay: '1s' }} />

                  {/* Sphere core */}
                  <div className="sphere-layer absolute inset-12">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500/30 via-primary-600/20 to-transparent border border-primary-400/30 flex items-center justify-center"
                      style={{
                        boxShadow: '0 0 60px rgba(0, 180, 255, 0.3), inset 0 0 40px rgba(0, 180, 255, 0.1)'
                      }}
                    >
                      <Shield className="w-16 h-16 text-primary-300/80" />
                    </div>
                  </div>

                  {/* Corner indicators */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-primary-400/50" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-primary-400/50" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-primary-400/50" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-primary-400/50" />

                  {/* Status indicators */}
                  <div className="absolute top-1/2 -left-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-mono text-green-400">DEPLOY</span>
                  </div>
                  <div className="absolute top-1/2 -right-8 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-mono text-green-400">ARMED</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            {deploymentStats.map((stat) => (
              <div key={stat.label} className="stat-module rounded-lg p-4">
                <div className="text-xs font-mono text-neutral-500 mb-1">{stat.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono stat-glow text-primary-300">{stat.value}</span>
                  <span className="text-xs font-mono text-green-400">{stat.trend}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Lower Section - Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 mt-8 text-sm"
          >
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-primary-400" />
              <span className="font-mono text-neutral-400">BALLISTIC: LEVEL IV</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-400" />
              <span className="font-mono text-neutral-400">THERMAL: -196° to +370°</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-green-400" />
              <span className="font-mono text-neutral-400">AI RESCUE: ACTIVE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="control-panel rounded-xl p-8 hud-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="control-panel-inset rounded-lg p-6 text-center">
                <div className="text-4xl font-mono stat-glow text-primary-300 mb-2">1.8s</div>
                <div className="text-sm font-mono text-neutral-400">DEPLOY TIME</div>
                <div className="text-xs text-neutral-600 mt-2">Airbag-speed inflation</div>
              </div>
              <div className="control-panel-inset rounded-lg p-6 text-center">
                <div className="text-4xl font-mono stat-glow text-accent-400 mb-2">45cm</div>
                <div className="text-sm font-mono text-neutral-400">PACKED SIZE</div>
                <div className="text-xs text-neutral-600 mt-2">Thermos-form factor</div>
              </div>
              <div className="control-panel-inset rounded-lg p-6 text-center">
                <div className="text-4xl font-mono stat-glow text-green-400 mb-2">100%</div>
                <div className="text-sm font-mono text-neutral-400">RESCUE RATE</div>
                <div className="text-xs text-neutral-600 mt-2">All threat profiles</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-neutral-400">
                <span className="font-mono text-primary-300">CRYO BALL</span> — Autonomous AI-powered survival system
              </div>
              <div className="flex gap-4">
                <Link to="/demo" className="text-sm font-mono text-primary-400 hover:text-primary-300 transition-colors">
                  SIMULATION →
                </Link>
                <Link to="/docs" className="text-sm font-mono text-neutral-400 hover:text-neutral-300 transition-colors">
                  DOCUMENTATION →
                </Link>
                <Link to="/dashboard" className="text-sm font-mono text-neutral-400 hover:text-neutral-300 transition-colors">
                  COMMAND →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
