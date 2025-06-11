import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'
import { wait } from '../utils/delay'

export default function Mediation() {
  const navigate = useNavigate()
  const { setStep, currentSession, partners } = useSession()
  const [currentPhase, setCurrentPhase] = useState(1)
  const [aiGuidance, setAiGuidance] = useState('')
  const [commonGround, setCommonGround] = useState<string[]>([])
  const [proposedSolutions, setProposedSolutions] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreements, setAgreements] = useState<string[]>([])

  const phases = [
    { id: 1, name: 'Opening', description: 'Set ground rules and create safe space' },
    { id: 2, name: 'Storytelling', description: 'Each person shares their perspective' },
    { id: 3, name: 'Problem Solving', description: 'Identify interests and generate options' },
    { id: 4, name: 'Agreement', description: 'Negotiate and draft agreements' },
    { id: 5, name: 'Closure', description: 'Confirm understanding and next steps' }
  ]

  const partnerA = partners[0]
  const partnerB = partners[1]

  useEffect(() => {
    if (currentSession && partnerA && partnerB) {
      startMediation()
    }
  }, [currentSession, partnerA, partnerB])

  const startMediation = async () => {
    if (!currentSession || !partnerA || !partnerB) return

    setIsProcessing(true)

    try {
      const truthStatements = currentSession.truthStatements.map(stmt => ({
        speaker: stmt.partnerId === partnerA.id ? partnerA.name : partnerB.name,
        text: stmt.text
      }))

      const response = await truthKeeperAI.facilitateMediation(
        truthStatements,
        [partnerA.name, partnerB.name]
      )

      setAiGuidance(response.content)
      setCommonGround(response.suggestions?.slice(0, 3) || [])

      await wait(1000)
      setCurrentPhase(2)
    } catch (error) {
      console.error('Mediation failed:', error)
      setAiGuidance('Let\'s work together to find common ground and build understanding between you both.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePhaseComplete = async () => {
    if (currentPhase < 5) {
      setCurrentPhase(currentPhase + 1)

      if (currentPhase === 3) {
        // Generate solution proposals
        setProposedSolutions([
          'Schedule regular check-ins to discuss feelings',
          'Create shared agreements about communication',
          'Practice active listening techniques together'
        ])
      }

      if (currentPhase === 4) {
        // Finalize agreements
        setAgreements([
          'We commit to speaking with kindness and respect',
          'We will listen to understand, not to win',
          'We will address issues promptly rather than letting them build up'
        ])
      }
    } else {
      setStep('persuasion')
      navigate('/persuasion')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-black dark:bg-white opacity-10 blur-xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="/assets/ui/scale_icon.png"
                alt="Justice Scale"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Mediation
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300">
            Harvard 5-Phase Mediation Process
          </p>
        </motion.div>

        {/* Phase Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {phases.map((phase) => (
              <div key={phase.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${currentPhase >= phase.id
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-truth-100 dark:bg-truth-700 text-truth-500 dark:text-truth-400'
                  }
                `}>
                  {currentPhase > phase.id ? '✓' : phase.id}
                </div>
                <span className="text-xs mt-1 text-center max-w-20">{phase.name}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-truth-100 dark:bg-truth-700 rounded-full h-2">
            <motion.div
              className="bg-black dark:bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentPhase / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Phase */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">
              Phase {currentPhase}: {phases[currentPhase - 1].name}
            </h2>
            <p className="text-truth-600 dark:text-truth-400 mb-4">
              {phases[currentPhase - 1].description}
            </p>

            {isProcessing ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 border-black dark:border-white border-t-transparent rounded-full"
                />
                <p>AI Mediator is analyzing...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentPhase === 1 && (
                  <div>
                    <h3 className="font-medium mb-2">Ground Rules Established:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Speak respectfully and honestly</li>
                      <li>• Listen without interrupting</li>
                      <li>• Focus on solutions, not blame</li>
                      <li>• Take breaks if emotions run high</li>
                    </ul>
                  </div>
                )}

                {currentPhase === 2 && commonGround.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Common Ground Identified:</h3>
                    <ul className="text-sm space-y-1">
                      {commonGround.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPhase === 3 && proposedSolutions.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Proposed Solutions:</h3>
                    <ul className="text-sm space-y-1">
                      {proposedSolutions.map((solution, index) => (
                        <li key={index}>• {solution}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPhase === 4 && agreements.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Draft Agreements:</h3>
                    <ul className="text-sm space-y-1">
                      {agreements.map((agreement, index) => (
                        <li key={index}>• {agreement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPhase === 5 && (
                  <div>
                    <h3 className="font-medium mb-2">Next Steps:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Review agreements in one week</li>
                      <li>• Practice new communication patterns</li>
                      <li>• Schedule follow-up session if needed</li>
                    </ul>
                  </div>
                )}

                <button
                  onClick={handlePhaseComplete}
                  className="w-full btn-primary"
                >
                  {currentPhase === 5 ? 'Complete Mediation →' : `Continue to ${phases[currentPhase]?.name} →`}
                </button>
              </div>
            )}
          </motion.div>

          {/* AI Guidance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">AI Mediator Guidance</h2>

            {aiGuidance ? (
              <div className="bg-truth-50 dark:bg-truth-900/50 rounded-lg p-4 border border-truth-100 dark:border-truth-800">
                <p className="text-truth-800 dark:text-truth-200 whitespace-pre-line">
                  {aiGuidance}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-truth-500 dark:text-truth-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-truth-50 dark:bg-truth-900/50 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-2xl">🤖</span>
                </div>
                <p>AI guidance will appear here</p>
              </div>
            )}

            {/* Participants */}
            <div className="mt-6 pt-4 border-t border-truth-200 dark:border-truth-700">
              <h3 className="font-medium mb-3">Session Participants</h3>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-sm">{partnerA?.name?.[0]}</span>
                  </div>
                  <p className="text-xs">{partnerA?.name}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-sm">{partnerB?.name?.[0]}</span>
                  </div>
                  <p className="text-xs">{partnerB?.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
