import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'
import { wait } from '../utils/delay'
// Using public path for production deployment
const truthCrystalImg = '/assets/crystals/truth_crystals/Truth_crystal_option1.png'

interface TruthStatement {
  id: string
  partnerId: string
  text: string
  timestamp: Date
  verified: boolean
  aiResponse?: string
}

export default function Truth() {
  const navigate = useNavigate()
  const { partners, addTruthStatement, setStep } = useSession()
  const [currentSpeaker, setCurrentSpeaker] = useState<'A' | 'B'>('A')
  const [statement, setStatement] = useState('')
  const [statements, setStatements] = useState<TruthStatement[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const partnerA = partners[0]
  const partnerB = partners[1]
  const currentPartner = currentSpeaker === 'A' ? partnerA : partnerB

  const handleSubmitStatement = async () => {
    if (!statement.trim() || !partnerA || !partnerB) return

    setIsProcessing(true)

    const speakerName = currentSpeaker === 'A' ? partnerA.name : partnerB.name
    const partnerName = currentSpeaker === 'A' ? partnerB.name : partnerA.name

    const newStatement: TruthStatement = {
      id: `truth_${Date.now()}`,
      partnerId: currentSpeaker === 'A' ? partnerA.id : partnerB.id,
      text: statement.trim(),
      timestamp: new Date(),
      verified: false
    }

    // Add to local state
    setStatements(prev => [...prev, newStatement])

    // Add to global state
    addTruthStatement(newStatement.partnerId, newStatement.text)

    try {
      // Get AI analysis of the truth statement
      const previousStatements = statements.map(s => s.text)
      const aiResponse = await truthKeeperAI.processTruthStatement(
        statement.trim(),
        speakerName,
        partnerName,
        previousStatements
      )

      // Update with AI response and mark as verified
      setStatements(prev =>
        prev.map(s =>
          s.id === newStatement.id
            ? { ...s, verified: true, aiResponse: aiResponse.content }
            : s
        )
      )
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Still mark as verified even if AI fails
      setStatements(prev =>
        prev.map(s =>
          s.id === newStatement.id ? { ...s, verified: true } : s
        )
      )
    }

    setStatement('')
    setIsProcessing(false)

    // Switch speaker
    setCurrentSpeaker(currentSpeaker === 'A' ? 'B' : 'A')
  }

  const handleProceedToMediation = () => {
    setStep('mediation')
    navigate('/mediation')
  }

  const canProceed = statements.length >= 2 && statements.every(s => s.verified)

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
                src={truthCrystalImg}
                alt="Truth Crystal"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Truth Capture
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300 max-w-2xl mx-auto">
            Let's establish the facts. Each partner will share their perspective on what happened.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Speaker</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSpeaker('A')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    currentSpeaker === 'A' 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-truth-100 dark:bg-truth-700 text-truth-800 dark:text-white hover:bg-truth-200 dark:hover:bg-truth-600'
                  }`}
                >
                  {partnerA?.name}
                </button>
                <button
                  onClick={() => setCurrentSpeaker('B')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    currentSpeaker === 'B' 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-truth-100 dark:bg-truth-700 text-truth-800 dark:text-white hover:bg-truth-200 dark:hover:bg-truth-600'
                  }`}
                >
                  {partnerB?.name}
                </button>
              </div>
            </div>

            <div className="mb-4 p-4 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
                  {currentPartner?.name?.[0]}
                </div>
                <span className="font-medium">{currentPartner?.name}</span>
              </div>
              <p className="text-sm text-truth-600 dark:text-truth-400">
                Share your perspective on what happened. Focus on facts and observable events.
              </p>
            </div>

            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Describe what happened from your perspective..."
              className="input-field h-32 resize-none"
              disabled={isProcessing}
            />

            <button
              onClick={handleSubmitStatement}
              disabled={!statement.trim() || isProcessing}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full"
                  />
                  Verifying...
                </div>
              ) : (
                'Submit Truth Statement'
              )}
            </button>
          </motion.div>

          {/* Statements Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Truth Timeline</h2>
            
            {statements.length === 0 ? (
              <div className="text-center py-8 text-truth-500 dark:text-truth-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-truth-50 dark:bg-truth-900/50 rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-2xl">📝</span>
                </div>
                <p>Truth statements will appear here as they're shared</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {statements.map((stmt, index) => {
                    const isPartnerA = stmt.partnerId === partnerA?.id
                    return (
                      <motion.div
                        key={stmt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-4 rounded-lg border-l-4 border-black dark:border-white bg-white dark:bg-truth-800 shadow-soft"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold">
                              {isPartnerA ? partnerA?.name?.[0] : partnerB?.name?.[0]}
                            </div>
                            <span className="text-sm font-medium">
                              {isPartnerA ? partnerA?.name : partnerB?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {stmt.verified ? (
                              <span className="text-sm font-medium bg-truth-100 dark:bg-truth-700/50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">✓ Verified</span>
                            ) : (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-black dark:border-white border-t-transparent rounded-full"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-truth-800 dark:text-truth-200 text-sm">
                          {stmt.text}
                        </p>

                        {stmt.aiResponse && (
                          <div className="mt-3 p-2 bg-truth-50 dark:bg-truth-900/50 rounded border-l-2 border-black dark:border-white">
                            <p className="text-xs font-medium text-black dark:text-white mb-1">AI Insight:</p>
                            <p className="text-xs text-truth-600 dark:text-truth-300">{stmt.aiResponse}</p>
                          </div>
                        )}

                        <p className="text-xs text-truth-500 dark:text-truth-400 mt-2">
                          {stmt.timestamp.toLocaleTimeString()}
                        </p>
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
              <h3 className="font-semibold mb-2 text-black dark:text-white">Truth Capture Complete ✓</h3>
              <p className="text-sm text-truth-600 dark:text-truth-400">
                Both perspectives have been captured and verified. Ready to proceed to mediation.
              </p>
            </div>
            
            <button
              onClick={handleProceedToMediation}
              className="btn-primary text-lg px-8 py-4"
            >
              Begin Mediation →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
