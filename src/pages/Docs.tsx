import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, ChevronRight, Shield, ThermometerSnowflake, Flame,
  Waves, Radio, Battery, Anchor, MapPin, Cpu, Ruler, AlertTriangle
} from 'lucide-react'

type DocSection = 'overview' | 'materials' | 'systems' | 'specs' | 'deployment' | 'safety'

const sections: { id: DocSection; title: string; icon: typeof Shield }[] = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'materials', title: 'Materials', icon: Shield },
  { id: 'systems', title: 'Systems', icon: Cpu },
  { id: 'specs', title: 'Specifications', icon: Ruler },
  { id: 'deployment', title: 'Deployment', icon: Anchor },
  { id: 'safety', title: 'Safety', icon: AlertTriangle },
]

const materialDetails = [
  {
    name: 'Dyneema® UHMWPE (Ultra-High Molecular Weight Polyethylene)',
    composition: '45% of shell structure',
    tensileStrength: '3,400 MPa',
    density: '0.97 g/cm³ (floats on water)',
    properties: [
      '15x stronger than steel per unit weight',
      'Absorbs up to 40% more energy than aramid fibers',
      'Maintains strength at cryogenic temperatures',
      'Highly resistant to chemicals and UV',
      'Low moisture absorption (< 0.1%)'
    ],
    applications: [
      'Primary ballistic protection layer',
      'Buoyancy structure',
      'Impact absorption zones'
    ],
    certifications: ['NIJ Level IV', 'STANAG 4569 Level 2', 'VPAM 12']
  },
  {
    name: 'Kevlar® EXO (Para-Aramid)',
    composition: '30% of shell structure',
    tensileStrength: '3,620 MPa',
    density: '1.44 g/cm³',
    properties: [
      'Exceptional thermal stability',
      'Performs at temperatures from -196°C to +350°C',
      'High cut and abrasion resistance',
      'Self-extinguishing',
      'Does not melt or drip'
    ],
    applications: [
      'Thermal barrier layer',
      'Structural reinforcement',
      'Cryogenic protection zones'
    ],
    certifications: ['NFPA 2112', 'ASTM F1506', 'ISO 11613']
  },
  {
    name: 'Nomex® (Meta-Aramid)',
    composition: '15% of shell structure',
    thermalProtection: '370°C continuous',
    properties: [
      'Inherently flame resistant',
      'Does not melt, drip, or support combustion',
      'Forms protective char barrier',
      'Maintains flexibility at extreme temperatures',
      'Excellent chemical resistance'
    ],
    applications: [
      'Fire and flame protection',
      'Heat barrier',
      'Flash fire protection'
    ],
    certifications: ['NFPA 1975', 'ISO 11612', 'ASTM F2302']
  },
  {
    name: 'Carbon Fiber Composite Frame',
    composition: '10% of shell structure',
    tensileStrength: '5,000 MPa',
    modulus: '230 GPa',
    properties: [
      'Ultra-lightweight structural integrity',
      'Crush protection and impact distribution',
      'Shape memory for consistent deployment',
      'High fatigue resistance',
      'Thermal insulation'
    ],
    applications: [
      'Structural skeleton',
      'Anchor mounting points',
      'Equipment attachment points'
    ]
  }
]

const systemSpecs = [
  {
    category: 'Physical Dimensions',
    specs: [
      { name: 'Deployed Diameter', value: '1.8m (6 ft)' },
      { name: 'Deployed Height', value: '2.1m (7 ft)' },
      { name: 'Packed Size', value: '45cm tall x 15cm diameter' },
      { name: 'Packed Form', value: 'Cylindrical (thermos-sized)' },
      { name: 'Weight (Empty)', value: '12 kg (26 lbs)' },
      { name: 'Weight (Full Systems)', value: '18 kg (40 lbs)' },
      { name: 'Internal Volume', value: '1.2 m³' },
      { name: 'Inflation Time', value: '1.8 seconds' },
      { name: 'Gas Source', value: 'CO₂/N₂ cartridge (replaceable)' }
    ]
  },
  {
    category: 'Environmental Limits',
    specs: [
      { name: 'Operating Temperature', value: '-196°C to +370°C' },
      { name: 'Storage Temperature', value: '-40°C to +70°C' },
      { name: 'Maximum Depth (Submarine Mode)', value: '30m (100 ft)' },
      { name: 'Surface Float Time', value: '15+ hours' },
      { name: 'Wind Resistance', value: '200 km/h sustained' },
      { name: 'Crush Depth (Ice)', value: '2m ice overburden' }
    ]
  },
  {
    category: 'Ballistic Protection',
    specs: [
      { name: 'NIJ Rating', value: 'Level IV (Rifle)' },
      { name: 'Stops', value: '.30-06 AP, 7.62x51, 5.56, AK-47' },
      { name: 'V50 Ballistic Limit', value: '> 900 m/s' },
      { name: 'Multi-Hit Capability', value: '5 rounds minimum' },
      { name: 'Fragmentation Protection', value: 'V50 > 1,200 m/s FSP' },
      { name: 'Blast Protection', value: '15 kg TNT @ 3m' }
    ]
  },
  {
    category: 'Electrical Systems',
    specs: [
      { name: 'Battery Capacity', value: '200 Wh LiFePO₄' },
      { name: 'Solar Panel Output', value: '25W flexible' },
      { name: 'Runtime (No Solar)', value: '72 hours' },
      { name: 'Runtime (Solar Assist)', value: '120+ hours' },
      { name: 'Charging Time (Solar)', value: '8 hours (full)' },
      { name: 'Emergency Beacon Range', value: 'Global (Iridium)' }
    ]
  },
  {
    category: 'Life Support',
    specs: [
      { name: 'Oxygen Supply', value: '6 hours (sealed)' },
      { name: 'CO₂ Scrubber Capacity', value: '8 hours' },
      { name: 'Thermal Regulation', value: '±2°C target 20°C' },
      { name: 'Water Capacity', value: '4L emergency supply' },
      { name: 'Food Supply', value: '2,400 kcal bars (72h)' },
      { name: 'Medical Kit', value: 'Trauma + basic supplies' }
    ]
  },
  {
    category: 'AI & Communications',
    specs: [
      { name: 'Processor', value: 'ARM Cortex-M7 @ 400MHz' },
      { name: 'Satellite', value: 'Iridium 9603 SBD' },
      { name: 'GPS Accuracy', value: '< 3m CEP' },
      { name: 'Update Rate', value: '15 min (auto) / on-demand' },
      { name: 'Encryption', value: 'AES-256' },
      { name: 'Rescue Coordination', value: 'AI-powered SAR routing' }
    ]
  }
]

const deploymentPhases = [
  {
    step: 1,
    title: 'Carry & Activate',
    time: '0-2 seconds',
    description: 'Carried like a thermos. Pull the lanyard and the compressed gas cartridge inflates the full 1.8m sphere in 1.8 seconds — similar to an airbag but larger.',
    critical: ['Keep hands clear of deployment area', 'Ensure overhead clearance of 3m']
  },
  {
    step: 2,
    title: 'Entry & Sealing',
    time: '2-10 seconds',
    description: 'Enter through self-sealing port. Port closes automatically around occupant.',
    critical: ['Position head toward communication panel', 'Secure medical restraints']
  },
  {
    step: 3,
    title: 'System Initialization',
    time: '10-30 seconds',
    description: 'AI system boots, GPS acquires position, distress beacon activates.',
    critical: ['Confirm green status indicator', 'Do not override auto-transmit']
  },
  {
    step: 4,
    title: 'Protection Active',
    time: '30+ seconds',
    description: 'Full protection mode. Threat neutralization and rescue coordination begin.',
    critical: ['Minimize movement to conserve oxygen', 'Monitor battery status']
  }
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState<DocSection>('overview')

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">DOCUMENTATION</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Complete technical documentation for the Cryo Ball AI-powered survival system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4 sticky top-24">
              <nav className="space-y-1">
                {sections.map(({ id, title, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      activeSection === id
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-400/30'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{title}</span>
                    {activeSection === id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">System Overview</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      The Cryo Ball is a revolutionary AI-powered survival pod designed to protect
                      military personnel and civilians from extreme threats. Combining advanced materials—
                      Dyneema UHMWPE, Kevlar EXO, and Nomex—with autonomous AI systems, it provides
                      impermeable protection in any environment.
                    </p>
                  </div>

                  {/* Deployment Mechanism Highlight */}
                  <div className="glass-dark rounded-xl p-6 border border-accent-400/30">
                    <h3 className="font-mono text-xl font-bold mb-4 text-accent-400">Thermos-Sized. 2-Second Deploy.</h3>
                    <p className="text-neutral-300 mb-4">
                      The Cryo Ball packs into a cylindrical package roughly the size of a large thermos or
                      water bottle (45cm x 15cm). Pull the lanyard and a compressed CO₂/nitrogen gas cartridge
                      inflates the full 1.8m protective sphere in under 2 seconds — faster than an airbag.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary-300">45x15</p>
                        <p className="text-xs text-neutral-500">cm packed size</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary-300">1.8s</p>
                        <p className="text-xs text-neutral-500">full inflation</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary-300">18kg</p>
                        <p className="text-xs text-neutral-500">total weight</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary-300">100+</p>
                        <p className="text-xs text-neutral-500">deploy cycles tested</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-dark rounded-xl p-4">
                      <Shield className="w-8 h-8 text-primary-400 mb-2" />
                      <h3 className="font-semibold mb-1">Ballistic Protection</h3>
                      <p className="text-sm text-neutral-400">NIJ Level IV rated. Stops rifle rounds, shrapnel, and blast debris.</p>
                    </div>
                    <div className="glass-dark rounded-xl p-4">
                      <ThermometerSnowflake className="w-8 h-8 text-cyan-400 mb-2" />
                      <h3 className="font-semibold mb-1">Thermal Range</h3>
                      <p className="text-sm text-neutral-400">Operational from -196°C to +370°C. Internal climate controlled.</p>
                    </div>
                    <div className="glass-dark rounded-xl p-4">
                      <Waves className="w-8 h-8 text-blue-400 mb-2" />
                      <h3 className="font-semibold mb-1">Amphibious</h3>
                      <p className="text-sm text-neutral-400">Floats indefinitely. Submarine mode for underwater concealment.</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-8">
                    <h3 className="font-mono text-xl font-bold mb-4">Deployment History</h3>
                    <div className="space-y-4 text-neutral-300">
                      <p>
                        <strong>Concept Origin:</strong> Designed for downed pilot recovery in combat zones,
                        evolved into multi-environment civilian and military protection system.
                      </p>
                      <p>
                        <strong>Testing:</strong> Extensively tested in Arctic (Alaska), Desert (Mojave),
                        Ocean (Pacific), and combat simulation facilities.
                      </p>
                      <p>
                        <strong>Current Status:</strong> Production-ready design. Seeking manufacturing partners
                        for first responder and military deployment.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Materials Section */}
              {activeSection === 'materials' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">Material Composition</h2>
                    <p className="text-neutral-300 leading-relaxed mb-6">
                      The Cryo Ball shell utilizes a proprietary layered composite of the world's
                      strongest fibers, each selected for specific threat categories.
                    </p>
                  </div>

                  {materialDetails.map((material) => (
                    <div key={material.name} className="glass-dark rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-mono text-lg font-bold text-primary-300">{material.name}</h3>
                          <p className="text-sm text-neutral-400">{material.composition}</p>
                        </div>
                        <div className="text-right">
                          {material.tensileStrength && (
                            <p className="text-sm text-neutral-400">
                              <span className="text-white font-medium">{material.tensileStrength}</span> tensile
                            </p>
                          )}
                          {material.thermalProtection && (
                            <p className="text-sm text-neutral-400">
                              <span className="text-accent-400 font-medium">{material.thermalProtection}</span> max
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-neutral-300">Properties</h4>
                          <ul className="space-y-1">
                            {material.properties.map(prop => (
                              <li key={prop} className="flex items-start gap-2 text-sm text-neutral-400">
                                <span className="text-success-400 mt-1">•</span>
                                {prop}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 text-neutral-300">Applications in Cryo Ball</h4>
                          <ul className="space-y-1">
                            {material.applications.map(app => (
                              <li key={app} className="flex items-start gap-2 text-sm text-neutral-400">
                                <span className="text-primary-400 mt-1">→</span>
                                {app}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {material.certifications && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h4 className="text-sm font-medium mb-2 text-neutral-300">Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {material.certifications.map(cert => (
                              <span
                                key={cert}
                                className="px-3 py-1 rounded-full bg-success-500/20 text-success-400 text-xs font-mono"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Systems Section */}
              {activeSection === 'systems' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">Integrated Systems</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      The Cryo Ball houses multiple autonomous systems working together to ensure occupant
                      survival and rapid rescue coordination.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Radio className="w-8 h-8 text-primary-400" />
                        <h3 className="font-semibold text-lg">AI Lifeline System</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• Autonomous distress beacon activation</li>
                        <li>• Iridium satellite uplink (global coverage)</li>
                        <li>• GPS positioning with &lt;3m accuracy</li>
                        <li>• AI-powered rescue coordination</li>
                        <li>• AES-256 encrypted communications</li>
                        <li>• Real-time health telemetry</li>
                      </ul>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Battery className="w-8 h-8 text-accent-400" />
                        <h3 className="font-semibold text-lg">Power Management</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• 200Wh LiFePO₄ battery bank</li>
                        <li>• 25W flexible solar panel</li>
                        <li>• Intelligent load management</li>
                        <li>• 72+ hour battery-only operation</li>
                        <li>• Solar-assisted: 120+ hours</li>
                        <li>• Emergency mode: 168 hours</li>
                      </ul>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <ThermometerSnowflake className="w-8 h-8 text-cyan-400" />
                        <h3 className="font-semibold text-lg">Climate Control</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• Active thermal regulation (±2°C)</li>
                        <li>• Target internal: 20°C</li>
                        <li>• Heat pump for hot environments</li>
                        <li>• Insulation for cold environments</li>
                        <li>• Condensation management</li>
                        <li>• Emergency heating blanket</li>
                      </ul>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Anchor className="w-8 h-8 text-success-400" />
                        <h3 className="font-semibold text-lg">Grappling Anchor</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• 50m carbon-fiber line</li>
                        <li>• 500kg load capacity</li>
                        <li>• Deployable from inside</li>
                        <li>• Auto-retract function</li>
                        <li>• Multiple anchor modes</li>
                        <li>• River/debris stabilization</li>
                      </ul>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-8 h-8 text-primary-400" />
                        <h3 className="font-semibold text-lg">Navigation & Tracking</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• GPS + GLONASS + Galileo</li>
                        <li>• Barometric altitude</li>
                        <li>• 3-axis accelerometer</li>
                        <li>• Magnetic compass</li>
                        <li>• Automatic position updates</li>
                        <li>• Rescue team integration</li>
                      </ul>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Flame className="w-8 h-8 text-orange-400" />
                        <h3 className="font-semibold text-lg">Life Support</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-neutral-400">
                        <li>• 6-hour sealed oxygen supply</li>
                        <li>• CO₂ scrubber (8 hours)</li>
                        <li>• 4L water supply</li>
                        <li>• 72-hour food ration (2,400 kcal)</li>
                        <li>• First aid kit (trauma + basic)</li>
                        <li>• Medical monitoring sensors</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Specifications Section */}
              {activeSection === 'specs' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">Technical Specifications</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Complete specifications for all Cryo Ball systems and components.
                    </p>
                  </div>

                  {systemSpecs.map(category => (
                    <div key={category.category} className="glass-dark rounded-xl p-6">
                      <h3 className="font-mono text-lg font-bold text-primary-300 mb-4">
                        {category.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.specs.map(spec => (
                          <div
                            key={spec.name}
                            className="flex justify-between items-center py-2 border-b border-white/5"
                          >
                            <span className="text-neutral-400">{spec.name}</span>
                            <span className="font-mono text-white">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Deployment Section */}
              {activeSection === 'deployment' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">Deployment Procedure</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Standard deployment sequence from activation to full protection mode.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {deploymentPhases.map(phase => (
                      <div key={phase.step} className="glass-dark rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-mono text-xl font-bold text-primary-300">{phase.step}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{phase.title}</h3>
                              <span className="text-sm text-neutral-500 font-mono">{phase.time}</span>
                            </div>
                            <p className="text-neutral-300 mb-4">{phase.description}</p>
                            <div className="space-y-1">
                              {phase.critical.map(critical => (
                                <p key={critical} className="flex items-start gap-2 text-sm text-accent-400">
                                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  {critical}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Safety Section */}
              {activeSection === 'safety' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="font-mono text-2xl font-bold mb-4">Safety Information</h2>
                    <p className="text-neutral-300 leading-relaxed">
                      Critical safety guidelines and emergency procedures for Cryo Ball operation.
                    </p>
                  </div>

                  <div className="glass-dark rounded-xl p-6 border-l-4 border-danger-500">
                    <h3 className="font-semibold text-lg text-danger-400 mb-4">Critical Warnings</h3>
                    <ul className="space-y-3 text-neutral-300">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-danger-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-danger-400 text-xs font-bold">!</span>
                        </div>
                        <span>Never deploy in confined spaces with less than 3m overhead clearance.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-danger-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-danger-400 text-xs font-bold">!</span>
                        </div>
                        <span>Keep hands and loose clothing clear of deployment area during activation.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-danger-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-danger-400 text-xs font-bold">!</span>
                        </div>
                        <span>Submarine mode limited to 30m depth. Exceeding may cause structural failure.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-danger-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-danger-400 text-xs font-bold">!</span>
                        </div>
                        <span>Do not override auto-transmit distress signal. Rescue depends on it.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="glass-dark rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Emergency Procedures</h3>
                    <div className="space-y-4">
                      <div className="border-b border-white/10 pb-4">
                        <h4 className="font-medium text-primary-300 mb-2">Oxygen Supply Depleted</h4>
                        <p className="text-sm text-neutral-400">
                          System automatically switches to passive air intake mode. Maintain shallow breathing.
                          Seal port indicator illuminates when safe to open.
                        </p>
                      </div>
                      <div className="border-b border-white/10 pb-4">
                        <h4 className="font-medium text-primary-300 mb-2">Battery Critical (&lt;10%)</h4>
                        <p className="text-sm text-neutral-400">
                          Emergency beacon enters low-power burst mode. All non-essential systems shutdown.
                          Preserve power by remaining still and minimizing communications.
                        </p>
                      </div>
                      <div className="border-b border-white/10 pb-4">
                        <h4 className="font-medium text-primary-300 mb-2">Anchor Line Failure</h4>
                        <p className="text-sm text-neutral-400">
                          Deploy backup line from compartment 3. Manual anchor points available on all
                          external panels. Attempt stabilization with debris or terrain.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-300 mb-2">Communication Lost</h4>
                        <p className="text-sm text-neutral-400">
                          System continues GPS logging. Last known position transmitted when signal
                          restored. Visual beacons activate automatically (strobe + thermal).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-dark rounded-xl p-6 border border-success-500/30">
                    <h3 className="font-semibold text-lg text-success-400 mb-4">Maintenance Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Monthly (User Level)</h4>
                        <ul className="space-y-1 text-sm text-neutral-400">
                          <li>• Battery capacity check</li>
                          <li>• Visual inspection of shell</li>
                          <li>• Confirm beacon test signal</li>
                          <li>• Check expiration dates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Annual (Service Level)</h4>
                        <ul className="space-y-1 text-sm text-neutral-400">
                          <li>• Full ballistic inspection</li>
                          <li>• Gas generator replacement</li>
                          <li>• Oxygen system servicing</li>
                          <li>• Firmware update</li>
                          <li>• Pressure test certification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
