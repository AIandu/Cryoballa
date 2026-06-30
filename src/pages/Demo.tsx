import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Radio, Battery, Eye, RotateCcw,
  AlertTriangle, CheckCircle, Clock
} from 'lucide-react'

type Environment = 'desert' | 'arctic' | 'ocean' | 'combat' | 'earthquake' | 'fire'
type DeploymentPhase = 'idle' | 'deploying' | 'active' | 'rescued'

interface SimulationState {
  environment: Environment
  phase: DeploymentPhase
  battery: number
  oxygen: number
  internalTemp: number
  externalTemp: number
  signalStrength: number
  timeElapsed: number
  threatsNeutralized: number
}

const environmentConfig: Record<Environment, {
  name: string
  icon: string
  externalTemp: number
  threats: string[]
  color: string
}> = {
  desert: {
    name: 'Desert',
    icon: '☀️',
    externalTemp: 55,
    threats: ['Extreme Heat', 'Dehydration', 'Sandstorm'],
    color: 'from-amber-500/30 to-orange-600/30'
  },
  arctic: {
    name: 'Arctic',
    icon: '❄️',
    externalTemp: -45,
    threats: ['Hypothermia', 'Ice', 'Whiteout'],
    color: 'from-cyan-400/30 to-blue-500/30'
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    externalTemp: 15,
    threats: ['Drowning', 'Hypothermia', 'Waves'],
    color: 'from-blue-500/30 to-indigo-600/30'
  },
  combat: {
    name: 'Combat Zone',
    icon: '⚔️',
    externalTemp: 25,
    threats: ['Ballistic', 'Explosive', 'Chemical'],
    color: 'from-red-500/30 to-orange-600/30'
  },
  earthquake: {
    name: 'Earthquake',
    icon: '🏔️',
    externalTemp: 20,
    threats: ['Collapse', 'Debris', 'Fire'],
    color: 'from-stone-500/30 to-stone-700/30'
  },
  fire: {
    name: 'Firestorm',
    icon: '🔥',
    externalTemp: 350,
    threats: ['Flames', 'Smoke', 'Heat'],
    color: 'from-orange-500/30 to-red-600/30'
  }
}

export default function Demo() {
  const [simulation, setSimulation] = useState<SimulationState>({
    environment: 'desert',
    phase: 'idle',
    battery: 100,
    oxygen: 100,
    internalTemp: 20,
    externalTemp: 55,
    signalStrength: 100,
    timeElapsed: 0,
    threatsNeutralized: 0
  })

  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 10))
  }

  const startSimulation = () => {
    const config = environmentConfig[simulation.environment]
    setSimulation(prev => ({
      ...prev,
      phase: 'deploying',
      externalTemp: config.externalTemp,
      battery: 100,
      oxygen: 100,
      internalTemp: 20,
      timeElapsed: 0,
      threatsNeutralized: 0
    }))
    addLog('DEPLOYMENT INITIATED')
    addLog(`Environment: ${config.name}`)
    addLog('Inflating protective shell...')

    setTimeout(() => {
      setSimulation(prev => ({ ...prev, phase: 'active' }))
      addLog('SHELL DEPLOYED - Full protection active')
      addLog('AI Lifeline system online')
      addLog('Transmitting distress signal...')
    }, 2000)
  }

  const resetSimulation = () => {
    setSimulation({
      environment: 'desert',
      phase: 'idle',
      battery: 100,
      oxygen: 100,
      internalTemp: 20,
      externalTemp: 55,
      signalStrength: 100,
      timeElapsed: 0,
      threatsNeutralized: 0
    })
    setLogs([])
  }

  const simulateTimePass = () => {
    if (simulation.phase !== 'active') return

    setSimulation(prev => {
      const newTime = prev.timeElapsed + 1
      const newBattery = Math.max(0, prev.battery - 0.5)
      const newOxygen = simulation.environment === 'ocean' ? Math.max(60, prev.oxygen - 0.2) : 100

      // Temperature regulation based on environment
      let newInternalTemp = prev.internalTemp
      if (prev.externalTemp > 30) {
        newInternalTemp = Math.min(24, prev.internalTemp + 0.1)
      } else if (prev.externalTemp < 0) {
        newInternalTemp = Math.max(18, prev.internalTemp - 0.1)
      }

      const newThreats = prev.threatsNeutralized + Math.floor(Math.random() * 2)

      return {
        ...prev,
        timeElapsed: newTime,
        battery: newBattery,
        oxygen: newOxygen,
        internalTemp: newInternalTemp,
        threatsNeutralized: newThreats
      }
    })

    if (Math.random() > 0.7) {
      const threats = ['Ballistic impact absorbed', 'Thermal event neutralized', 'Debris deflected', 'Pressure wave mitigated']
      addLog(threats[Math.floor(Math.random() * threats.length)])
    }
  }

  const rescueSimulation = () => {
    setSimulation(prev => ({ ...prev, phase: 'rescued' }))
    addLog('RESCUE SIGNAL RECEIVED')
    addLog('Coordinates transmitted to rescue team')
    addLog('OPERATION SUCCESSFUL')
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">INTERACTIVE DEMO</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Experience how Cryo Ball deploys and protects across different environments.
            Select an environment, deploy, and watch the system in action.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Environment Selector */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-mono text-lg font-semibold mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-400" />
              Environment Selection
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(environmentConfig) as [Environment, typeof environmentConfig[Environment]][]).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSimulation(prev => ({
                    ...prev,
                    environment: key,
                    externalTemp: config.externalTemp
                  }))}
                  disabled={simulation.phase !== 'idle'}
                  className={`p-4 rounded-xl border transition-all ${
                    simulation.environment === key
                      ? 'bg-primary-500/20 border-primary-400/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } ${simulation.phase !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-2xl mb-1">{config.icon}</div>
                  <div className="text-sm font-medium">{config.name}</div>
                  <div className="text-xs text-neutral-500">{config.externalTemp}°C</div>
                </button>
              ))}
            </div>

            {/* Threats Display */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-400 mb-3">Active Threats:</h3>
              <div className="space-y-2">
                {environmentConfig[simulation.environment].threats.map(threat => (
                  <div
                    key={threat}
                    className="flex items-center gap-2 text-sm"
                  >
                    {simulation.phase === 'active' ? (
                      <CheckCircle className="w-4 h-4 text-success-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-danger-400" />
                    )}
                    <span className={simulation.phase === 'active' ? 'text-neutral-400' : 'text-neutral-300'}>
                      {threat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-6 space-y-3">
              {simulation.phase === 'idle' && (
                <button
                  onClick={startSimulation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-400 hover:to-primary-500 transition-all glow flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Deploy Cryo Ball
                </button>
              )}

              {simulation.phase === 'active' && (
                <>
                  <button
                    onClick={simulateTimePass}
                    className="w-full py-3 rounded-xl glass border border-white/20 text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Simulate 1 Hour
                  </button>
                  <button
                    onClick={rescueSimulation}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-success-500 to-success-600 text-white font-semibold hover:from-success-400 hover:to-success-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-5 h-5" />
                    Trigger Rescue
                  </button>
                </>
              )}

              {simulation.phase !== 'idle' && (
                <button
                  onClick={resetSimulation}
                  className="w-full py-3 rounded-xl glass border border-danger-400/30 text-danger-400 font-semibold hover:bg-danger-400/10 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Demo
                </button>
              )}
            </div>
          </div>

          {/* Visualization */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-sm mx-auto">
              {/* Environment Background */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${environmentConfig[simulation.environment].color} transition-all duration-500`} />

              {/* Ball Visualization */}
              <AnimatePresence mode="wait">
                {simulation.phase === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-8 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Shield className="w-24 h-24 text-neutral-500 mx-auto mb-4" />
                      <p className="text-neutral-400">Ready for Deployment</p>
                    </div>
                  </motion.div>
                )}

                {simulation.phase === 'deploying' && (
                  <motion.div
                    key="deploying"
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-4"
                  >
                    <div className="w-full h-full rounded-full border-4 border-dashed border-primary-400 animate-spin-slow" />
                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary-500/50 to-accent-500/50 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="font-mono text-primary-300">DEPLOYING...</p>
                    </div>
                  </motion.div>
                )}

                {simulation.phase === 'active' && (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-4"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500/40 to-accent-500/40 animate-pulse-glow border border-white/30 flex items-center justify-center">
                      <div className="text-center">
                        <Shield className="w-20 h-20 text-white mx-auto mb-2" />
                        <p className="font-mono text-white text-sm">PROTECTION ACTIVE</p>
                      </div>
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <Radio className="w-6 h-6 text-success-400 animate-pulse" />
                    </div>
                  </motion.div>
                )}

                {simulation.phase === 'rescued' && (
                  <motion.div
                    key="rescued"
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-4"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-success-500/40 to-success-700/40 border border-success-400/50 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle className="w-20 h-20 text-success-400 mx-auto mb-2" />
                        <p className="font-mono text-success-300 text-sm">RESCUED</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Environment Label */}
            <div className="mt-6 text-center">
              <div className="text-4xl mb-2">{environmentConfig[simulation.environment].icon}</div>
              <h3 className="font-mono text-xl">{environmentConfig[simulation.environment].name}</h3>
              <p className="text-neutral-500">External: {simulation.externalTemp}°C</p>
            </div>
          </div>

          {/* Status Panel */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-mono text-lg font-semibold mb-6 flex items-center gap-2">
              <Battery className="w-5 h-5 text-accent-400" />
              System Status
            </h2>

            <div className="space-y-4">
              {/* Battery */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400">Battery</span>
                  <span className={simulation.battery < 30 ? 'text-danger-400' : 'text-success-400'}>
                    {simulation.battery.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      simulation.battery < 30 ? 'bg-danger-500' : 'bg-success-500'
                    }`}
                    style={{ width: `${simulation.battery}%` }}
                  />
                </div>
              </div>

              {/* Oxygen */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400">Oxygen Supply</span>
                  <span className="text-primary-400">{simulation.oxygen.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${simulation.oxygen}%` }}
                  />
                </div>
              </div>

              {/* Internal Temperature */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400">Internal Temp</span>
                  <span className={
                    simulation.internalTemp >= 18 && simulation.internalTemp <= 24
                      ? 'text-success-400'
                      : 'text-warning-400'
                  }>
                    {simulation.internalTemp.toFixed(1)}°C
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-500 transition-all"
                    style={{ width: `${((simulation.internalTemp - 15) / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Signal Strength */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-400">Signal Strength</span>
                  <span className="text-success-400">{simulation.signalStrength}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success-500 transition-all"
                    style={{ width: `${simulation.signalStrength}%` }}
                  />
                </div>
              </div>

              {/* Time Elapsed */}
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-neutral-400">Time Elapsed</span>
                <span className="font-mono text-lg">{simulation.timeElapsed}h</span>
              </div>

              {/* Threats Neutralized */}
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-neutral-400">Threats Neutralized</span>
                <span className="font-mono text-lg text-success-400">{simulation.threatsNeutralized}</span>
              </div>
            </div>

            {/* System Log */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                System Log
              </h3>
              <div className="bg-black/30 rounded-lg p-3 h-48 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <p className="text-neutral-600">Awaiting deployment...</p>
                ) : (
                  logs.map((log, index) => (
                    <p
                      key={index}
                      className={
                        log.includes('SUCCESS') ? 'text-success-400' :
                        log.includes('DEPLOY') ? 'text-primary-400' :
                        log.includes('absorbed') || log.includes('neutralized') ? 'text-success-400' :
                        'text-neutral-400'
                      }
                    >
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
