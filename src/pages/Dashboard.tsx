import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, MapPin, Battery, Clock, AlertTriangle, CheckCircle,
  Plus, X, Filter, RefreshCw, Activity, Users, ThermometerSnowflake
} from 'lucide-react'

interface Unit {
  id: string
  serial_number: string
  model: string
  status: string
  location: string | null
  assigned_to: string | null
  last_inspection: string | null
  next_inspection: string | null
  battery_health: number
  deployment_count: number
  created_at: string
  updated_at: string
}

interface Deployment {
  id: string
  unit_id: string
  operator: string
  environment: string
  status: string
  latitude: number | null
  longitude: number | null
  started_at: string
  ended_at: string | null
  duration_hours: number | null
  threats_encountered: string | null
  rescue_method: string | null
  notes: string | null
  created_at: string
  units?: Unit
}

const statusColors: Record<string, string> = {
  Active: 'text-danger-400 bg-danger-500/20 border-danger-400/30',
  Standby: 'text-success-400 bg-success-500/20 border-success-400/30',
  Maintenance: 'text-accent-400 bg-accent-500/20 border-accent-400/30',
  Decommissioned: 'text-neutral-400 bg-neutral-500/20 border-neutral-400/30',
}

const deploymentStatusColors: Record<string, string> = {
  Active: 'text-danger-400 bg-danger-500/20',
  Rescued: 'text-success-400 bg-success-500/20',
  Recovered: 'text-primary-400 bg-primary-500/20',
  Failed: 'text-neutral-400 bg-neutral-500/20',
}

const environmentIcons: Record<string, string> = {
  Desert: '☀️',
  Arctic: '❄️',
  Ocean: '🌊',
  Combat: '⚔️',
  Earthquake: '🏔️',
  Fire: '🔥',
}

export default function Dashboard() {
  const [units, setUnits] = useState<Unit[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'units' | 'deployments' | 'map'>('units')
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [showAddDeployment, setShowAddDeployment] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [_selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  // Form state for new unit
  const [newUnit, setNewUnit] = useState({
    serial_number: '',
    model: 'Military',
    location: '',
    assigned_to: '',
  })

  // Form state for new deployment
  const [newDeployment, setNewDeployment] = useState({
    unit_id: '',
    operator: '',
    environment: 'Desert',
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [unitsRes, deploymentsRes] = await Promise.all([
        supabase.from('units').select('*').order('created_at', { ascending: false }),
        supabase.from('deployments').select('*, units!deployments_unit_id_fkey(*)').order('started_at', { ascending: false }),
      ])
      if (unitsRes.data) setUnits(unitsRes.data)
      if (deploymentsRes.data) setDeployments(deploymentsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addUnit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('units').insert([{
        ...newUnit,
        status: 'Standby',
        battery_health: 100,
        deployment_count: 0,
        last_inspection: new Date().toISOString().split('T')[0],
        next_inspection: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }])
      if (error) throw error
      setShowAddUnit(false)
      setNewUnit({ serial_number: '', model: 'Military', location: '', assigned_to: '' })
      fetchData()
    } catch (error) {
      console.error('Error adding unit:', error)
    }
  }

  async function addDeployment(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('deployments').insert([{
        ...newDeployment,
        status: 'Active',
        threats_encountered: '[]',
      }])
      if (error) throw error

      // Update unit status and deployment count
      await supabase.from('units')
        .update({ status: 'Active', deployment_count: units.find(u => u.id === newDeployment.unit_id)?.deployment_count || 0 + 1 })
        .eq('id', newDeployment.unit_id)

      setShowAddDeployment(false)
      setNewDeployment({ unit_id: '', operator: '', environment: 'Desert' })
      fetchData()
    } catch (error) {
      console.error('Error adding deployment:', error)
    }
  }

  async function endDeployment(deployment: Deployment, rescueMethod: string) {
    try {
      const endedAt = new Date()
      const startedAt = new Date(deployment.started_at)
      const durationHours = Math.ceil((endedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60))

      await supabase.from('deployments')
        .update({
          status: 'Rescued',
          ended_at: endedAt.toISOString(),
          duration_hours: durationHours,
          rescue_method: rescueMethod
        })
        .eq('id', deployment.id)

      await supabase.from('units')
        .update({ status: 'Standby' })
        .eq('id', deployment.unit_id)

      fetchData()
    } catch (error) {
      console.error('Error ending deployment:', error)
    }
  }

  const stats = {
    totalUnits: units.length,
    activeUnits: units.filter(u => u.status === 'Active').length,
    standbyUnits: units.filter(u => u.status === 'Standby').length,
    maintenanceUnits: units.filter(u => u.status === 'Maintenance').length,
    activeDeployments: deployments.filter(d => d.status === 'Active').length,
    totalRescues: deployments.filter(d => d.status === 'Rescued').length,
    avgBatteryHealth: units.length > 0 ? Math.round(units.reduce((sum, u) => sum + u.battery_health, 0) / units.length) : 0,
  }

  const filteredUnits = filterStatus === 'all'
    ? units
    : units.filter(u => u.status === filterStatus)

  const activeDeploymentsList = deployments.filter(d => d.status === 'Active')

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">OPERATIONS DASHBOARD</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Real-time tracking of units, deployments, and rescue operations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
          >
            <Shield className="w-6 h-6 text-primary-400 mb-2" />
            <p className="text-2xl font-bold">{stats.totalUnits}</p>
            <p className="text-xs text-neutral-400">Total Units</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-xl p-4"
          >
            <Activity className="w-6 h-6 text-danger-400 mb-2" />
            <p className="text-2xl font-bold">{stats.activeUnits}</p>
            <p className="text-xs text-neutral-400">Active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-4"
          >
            <CheckCircle className="w-6 h-6 text-success-400 mb-2" />
            <p className="text-2xl font-bold">{stats.standbyUnits}</p>
            <p className="text-xs text-neutral-400">Standby</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-xl p-4"
          >
            <ThermometerSnowflake className="w-6 h-6 text-accent-400 mb-2" />
            <p className="text-2xl font-bold">{stats.maintenanceUnits}</p>
            <p className="text-xs text-neutral-400">Maintenance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4"
          >
            <AlertTriangle className="w-6 h-6 text-danger-400 mb-2" />
            <p className="text-2xl font-bold">{stats.activeDeployments}</p>
            <p className="text-xs text-neutral-400">Active Deployments</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-xl p-4"
          >
            <Users className="w-6 h-6 text-success-400 mb-2" />
            <p className="text-2xl font-bold">{stats.totalRescues}</p>
            <p className="text-xs text-neutral-400">Rescues</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4"
          >
            <Battery className="w-6 h-6 text-primary-400 mb-2" />
            <p className="text-2xl font-bold">{stats.avgBatteryHealth}%</p>
            <p className="text-xs text-neutral-400">Avg Battery</p>
          </motion.div>
        </div>

        {/* Active Rescue Panel */}
        {activeDeploymentsList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark rounded-xl p-6 mb-6 border border-danger-400/30"
          >
            <h2 className="font-mono text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger-400 animate-pulse" />
              AI Rescue Coordination — Active Missions
            </h2>
            <div className="space-y-4">
              {activeDeploymentsList.map((d) => {
                const hoursElapsed = Math.floor((Date.now() - new Date(d.started_at).getTime()) / 3600000)
                const priority = d.environment === 'Combat' ? 'CRITICAL' : d.environment === 'Ocean' ? 'HIGH' : 'MEDIUM'
                const priorityColor = priority === 'CRITICAL' ? 'text-danger-400 bg-danger-400/20' : priority === 'HIGH' ? 'text-accent-400 bg-accent-400/20' : 'text-primary-400 bg-primary-400/20'
                const estimate = d.environment === 'Arctic' ? '4-8 hours' : d.environment === 'Ocean' ? '2-6 hours' : '1-3 hours'
                const method = d.environment === 'Ocean' ? 'Coast Guard Vessel' : d.environment === 'Combat' ? 'Helicopter Extraction' : 'Ground Vehicle Recovery'

                return (
                  <div key={d.id} className="glass rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{environmentIcons[d.environment] || '🌍'}</span>
                      <div>
                        <p className="font-mono text-primary-300">{d.units?.serial_number}</p>
                        <p className="text-sm text-neutral-400">{d.operator} · {d.environment}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-mono ${priorityColor}`}>{priority}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-neutral-500">Elapsed</p>
                        <p className="font-mono text-white">{hoursElapsed}h</p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-500">ETA</p>
                        <p className="font-mono text-accent-400">{estimate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-500">Method</p>
                        <p className="text-success-400">{method}</p>
                      </div>
                      <button
                        onClick={() => endDeployment(d, method)}
                        className="px-4 py-2 rounded-lg bg-success-500/20 border border-success-400/30 text-success-400 hover:bg-success-500/30 transition-all text-sm"
                      >
                        Mark Rescued
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="glass rounded-xl p-2 mb-6 flex gap-2">
          {(['units', 'deployments', 'map'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'units' && (
            <motion.div
              key="units"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-neutral-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Standby">Standby</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 hover:bg-white/10 transition-all text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowAddUnit(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/20 border border-primary-400/30 text-primary-300 hover:bg-primary-500/30 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </button>
                </div>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUnits.map((unit) => (
                  <motion.div
                    key={unit.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-mono font-bold text-primary-300">{unit.serial_number}</h3>
                        <p className="text-sm text-neutral-400">{unit.model} Model</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[unit.status]}`}>
                        {unit.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {unit.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-300">{unit.location}</span>
                        </div>
                      )}

                      {unit.assigned_to && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-neutral-500" />
                          <span className="text-neutral-300">{unit.assigned_to}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-500">Battery Health</span>
                          <span className={unit.battery_health < 50 ? 'text-danger-400' : 'text-success-400'}>
                            {unit.battery_health}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              unit.battery_health < 50 ? 'bg-danger-500' : 'bg-success-500'
                            }`}
                            style={{ width: `${unit.battery_health}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-neutral-500 pt-2 border-t border-white/5">
                        <span>{unit.deployment_count} deployments</span>
                        <span>Next: {unit.next_inspection ? new Date(unit.next_inspection).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredUnits.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  No units found matching the current filter.
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'deployments' && (
            <motion.div
              key="deployments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-lg font-semibold">Deployment History</h2>
                <button
                  onClick={() => setShowAddDeployment(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-danger-500/20 border border-danger-400/30 text-danger-300 hover:bg-danger-500/30 transition-all text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  New Deployment
                </button>
              </div>

              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Unit</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Operator</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Environment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Started</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Rescue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {deployments.map((deployment) => (
                        <tr key={deployment.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-mono text-sm text-primary-300">
                              {deployment.units?.serial_number || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">{deployment.operator}</td>
                          <td className="px-4 py-4">
                            <span className="flex items-center gap-2 text-sm">
                              <span>{environmentIcons[deployment.environment] || '🌍'}</span>
                              {deployment.environment}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${deploymentStatusColors[deployment.status]}`}>
                              {deployment.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-400">
                            {new Date(deployment.started_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {deployment.duration_hours ? `${deployment.duration_hours}h` : '-'}
                          </td>
                          <td className="px-4 py-4 text-sm text-neutral-400">
                            {deployment.rescue_method || (deployment.status === 'Active' && (
                              <button
                                onClick={() => endDeployment(deployment, 'Manual Recovery')}
                                className="px-2 py-1 rounded bg-success-500/20 text-success-400 hover:bg-success-500/30 transition-all"
                              >
                                End
                              </button>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass rounded-xl p-6">
                <h2 className="font-mono text-lg font-semibold mb-6">Active Deployment Locations</h2>

                {activeDeploymentsList.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    No active deployments at this time.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeDeploymentsList.map((deployment) => (
                      <div key={deployment.id} className="glass-dark rounded-xl p-4 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{environmentIcons[deployment.environment] || '🌍'}</span>
                            <div>
                              <p className="font-mono text-primary-300">{deployment.units?.serial_number}</p>
                              <p className="text-sm text-neutral-400">{deployment.operator} in {deployment.environment}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {deployment.latitude?.toFixed(4)}, {deployment.longitude?.toFixed(4)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Since {new Date(deployment.started_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => endDeployment(deployment, 'Remote Command')}
                          className="px-4 py-2 rounded-lg bg-success-500/20 border border-success-400/30 text-success-400 hover:bg-success-500/30 transition-all text-sm"
                        >
                          Mark Rescued
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Unit Modal */}
        <AnimatePresence>
          {showAddUnit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddUnit(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="glass rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-mono text-xl font-bold">Add New Unit</h2>
                  <button onClick={() => setShowAddUnit(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={addUnit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Serial Number</label>
                    <input
                      type="text"
                      value={newUnit.serial_number}
                      onChange={(e) => setNewUnit({ ...newUnit, serial_number: e.target.value })}
                      placeholder="CB-2024-XXX"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Model</label>
                    <select
                      value={newUnit.model}
                      onChange={(e) => setNewUnit({ ...newUnit, model: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    >
                      <option value="Military">Military</option>
                      <option value="Civilian">Civilian</option>
                      <option value="Expedition">Expedition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={newUnit.location}
                      onChange={(e) => setNewUnit({ ...newUnit, location: e.target.value })}
                      placeholder="Storage location"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Assigned To</label>
                    <input
                      type="text"
                      value={newUnit.assigned_to}
                      onChange={(e) => setNewUnit({ ...newUnit, assigned_to: e.target.value })}
                      placeholder="Operator or team name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-400 transition-all"
                  >
                    Add Unit
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Deployment Modal */}
        <AnimatePresence>
          {showAddDeployment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddDeployment(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="glass rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-mono text-xl font-bold">New Deployment</h2>
                  <button onClick={() => setShowAddDeployment(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={addDeployment} className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Unit</label>
                    <select
                      value={newDeployment.unit_id}
                      onChange={(e) => setNewDeployment({ ...newDeployment, unit_id: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    >
                      <option value="">Select a unit</option>
                      {units.filter(u => u.status === 'Standby').map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.serial_number} - {unit.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Operator</label>
                    <input
                      type="text"
                      value={newDeployment.operator}
                      onChange={(e) => setNewDeployment({ ...newDeployment, operator: e.target.value })}
                      placeholder="Person deploying"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Environment</label>
                    <select
                      value={newDeployment.environment}
                      onChange={(e) => setNewDeployment({ ...newDeployment, environment: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                    >
                      <option value="Desert">Desert</option>
                      <option value="Arctic">Arctic</option>
                      <option value="Ocean">Ocean</option>
                      <option value="Combat">Combat</option>
                      <option value="Earthquake">Earthquake</option>
                      <option value="Fire">Fire</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-danger-500 text-white font-semibold hover:bg-danger-400 transition-all"
                  >
                    Start Deployment
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
