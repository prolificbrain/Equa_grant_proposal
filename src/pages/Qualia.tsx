import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'

interface QualiaEvent {
  id: string
  partnerId: string
  valence: number // -5 to +5
  arousal: number // 0-100
  bodyZone: string
  metaphor: string
  timestamp: Date
}

export default function Qualia() {
  const navigate = useNavigate()
  const { setStep, partners, addQualiaEvent } = useSession()
  const [currentSpeaker, setCurrentSpeaker] = useState<'A' | 'B'>('A')
  const [selectedBodyZone, setSelectedBodyZone] = useState('')
  const [valence, setValence] = useState(0) // -5 to +5
  const [arousal, setArousal] = useState(50) // 0-100
  const [metaphor, setMetaphor] = useState('')
  const [qualiaEvents, setQualiaEvents] = useState<QualiaEvent[]>([])

  const partnerA = partners[0]
  const partnerB = partners[1]
  const currentPartner = currentSpeaker === 'A' ? partnerA : partnerB

  const bodyZones = [
    { name: 'Head', description: 'Thoughts, pressure, clarity' },
    { name: 'Throat', description: 'Voice, expression, choking' },
    { name: 'Heart', description: 'Love, pain, warmth, racing' },
    { name: 'Stomach', description: 'Gut feelings, butterflies, nausea' },
    { name: 'Chest', description: 'Breathing, tightness, expansion' },
    { name: 'Shoulders', description: 'Tension, weight, burden' },
    { name: 'Arms', description: 'Reaching, holding, strength' },
    { name: 'Hands', description: 'Grasping, trembling, warmth' },
    { name: 'Back', description: 'Support, pain, stiffness' },
    { name: 'Legs', description: 'Grounding, weakness, restlessness' }
  ]

  const valenceLabels = {
    '-5': 'Very Negative',
    '-4': 'Negative',
    '-3': 'Somewhat Negative',
    '-2': 'Slightly Negative',
    '-1': 'Mildly Negative',
    '0': 'Neutral',
    '1': 'Mildly Positive',
    '2': 'Slightly Positive',
    '3': 'Somewhat Positive',
    '4': 'Positive',
    '5': 'Very Positive'
  }

  const getArousalLabel = (value: number) => {
    if (value <= 20) return 'Very Calm'
    if (value <= 40) return 'Relaxed'
    if (value <= 60) return 'Moderate'
    if (value <= 80) return 'Energized'
    return 'Very Intense'
  }

  const handleSubmitQualia = () => {
    if (!selectedBodyZone || !metaphor.trim() || !currentPartner) return

    const newEvent: QualiaEvent = {
      id: `qualia_${Date.now()}`,
      partnerId: currentPartner.id,
      valence,
      arousal,
      bodyZone: selectedBodyZone,
      metaphor: metaphor.trim(),
      timestamp: new Date()
    }

    setQualiaEvents(prev => [...prev, newEvent])
    addQualiaEvent(currentPartner.id, valence, arousal, selectedBodyZone, metaphor.trim())

    // Reset form
    setSelectedBodyZone('')
    setValence(0)
    setArousal(50)
    setMetaphor('')

    // Switch speaker
    setCurrentSpeaker(currentSpeaker === 'A' ? 'B' : 'A')
  }

  const handleNext = () => {
    setStep('forgiveness')
    navigate('/forgiveness')
  }

  const canProceed = qualiaEvents.length >= 2

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-black dark:bg-white opacity-10 blur-xl"></div>
            <div className="relative w-full h-full bg-white dark:bg-black border-2 border-black dark:border-white rounded-full flex items-center justify-center shadow-soft">
              <span className="text-3xl">💗</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Qualia Mapping
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300">
            Explore your felt-sense and emotional embodiment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Body Zone Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Body Awareness</h2>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Current Speaker</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSpeaker('A')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    currentSpeaker === 'A'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-white dark:bg-truth-800 text-truth-800 dark:text-white border border-truth-200 dark:border-truth-700 hover:bg-truth-50 dark:hover:bg-truth-700'
                  }`}
                >
                  {partnerA?.name}
                </button>
                <button
                  onClick={() => setCurrentSpeaker('B')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    currentSpeaker === 'B'
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-white dark:bg-truth-800 text-truth-800 dark:text-white border border-truth-200 dark:border-truth-700 hover:bg-truth-50 dark:hover:bg-truth-700'
                  }`}
                >
                  {partnerB?.name}
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-truth-50 dark:bg-truth-800 rounded-lg shadow-inner">
              <p className="text-sm text-truth-600 dark:text-truth-400">
                <strong>{currentPartner?.name}</strong>, where do you feel this emotion in your body?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {bodyZones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setSelectedBodyZone(zone.name)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    selectedBodyZone === zone.name
                      ? 'bg-truth-100 dark:bg-truth-700/50 border-black dark:border-white'
                      : 'bg-white dark:bg-truth-800 border-truth-100 dark:border-truth-700 hover:bg-truth-50 dark:hover:bg-truth-700/70'
                  }`}
                >
                  <div className="font-medium text-sm">{zone.name}</div>
                  <div className="text-xs text-truth-500 dark:text-truth-400">{zone.description}</div>
                </button>
              ))}
            </div>

            {selectedBodyZone && (
              <div className="p-3 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800">
                <p className="text-sm text-truth-800 dark:text-truth-200">
                  Selected: <strong>{selectedBodyZone}</strong>
                </p>
              </div>
            )}
          </motion.div>

          {/* Emotional Dimensions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Emotional Dimensions</h2>

            {/* Valence (Pleasant/Unpleasant) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Valence: {valenceLabels[valence.toString() as keyof typeof valenceLabels]}
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                value={valence}
                onChange={(e) => setValence(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-black to-white rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #666666 50%, #ffffff 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-truth-500 dark:text-truth-400 mt-1">
                <span>Very Negative</span>
                <span>Neutral</span>
                <span>Very Positive</span>
              </div>
            </div>

            {/* Arousal (Calm/Intense) */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Arousal: {getArousalLabel(arousal)}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={arousal}
                onChange={(e) => setArousal(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-black to-white rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Very Calm</span>
                <span>Very Intense</span>
              </div>
            </div>

            {/* Metaphor */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Describe the feeling (metaphor or sensation):
              </label>
              <textarea
                value={metaphor}
                onChange={(e) => setMetaphor(e.target.value)}
                placeholder="e.g., 'Like a knot in my stomach' or 'Warm honey spreading through my chest'"
                className="w-full h-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
              />
            </div>

            <button
              onClick={handleSubmitQualia}
              disabled={!selectedBodyZone || !metaphor.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Record Qualia Experience
            </button>
          </motion.div>

          {/* Qualia Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Qualia Timeline</h2>

            {qualiaEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>
                <p>Emotional experiences will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {qualiaEvents.map((event) => {
                    const isPartnerA = event.partnerId === partnerA?.id
                    const partnerName = isPartnerA ? partnerA?.name : partnerB?.name

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          isPartnerA
                            ? 'bg-truth-50 dark:bg-truth-900/20 border-black dark:border-white'
                            : 'bg-white dark:bg-truth-800 border-black dark:border-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isPartnerA
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-white dark:bg-black text-black dark:text-white'
                            }`}>
                              {partnerName?.[0]}
                            </div>
                            <span className="text-sm font-medium">{partnerName}</span>
                          </div>
                          <span className="text-xs text-truth-500 dark:text-truth-400">
                            {event.timestamp.toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Location:</strong> {event.bodyZone}
                          </p>
                          <p className="text-sm">
                            <strong>Feeling:</strong> {valenceLabels[event.valence.toString() as keyof typeof valenceLabels]}
                            ({getArousalLabel(event.arousal)})
                          </p>
                          <p className="text-sm italic text-slate-600 dark:text-slate-400">
                            "{event.metaphor}"
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress and Next Step */}
        {canProceed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="card max-w-md mx-auto mb-6">
              <h3 className="font-semibold mb-2">Emotional Awareness Developed ✓</h3>
              <p className="text-sm text-truth-600 dark:text-truth-400">
                You've explored your felt-sense and emotional embodiment. Ready for forgiveness and reconciliation.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="btn-primary text-lg px-8 py-4"
            >
              Continue to Forgiveness →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
