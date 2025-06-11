import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'
import { wait } from '../utils/delay'

export default function Conflict() {
  const navigate = useNavigate()
  const { partners, setStep } = useSession()
  const [conflictDescription, setConflictDescription] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [nextStep, setNextStep] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const partnerA = partners[0]
  const partnerB = partners[1]

  const handleAnalyzeConflict = async () => {
    if (!conflictDescription.trim() || !partnerA || !partnerB) return

    setIsAnalyzing(true)

    try {
      const response = await truthKeeperAI.analyzeConflict(
        conflictDescription,
        [partnerA.name, partnerB.name]
      )

      setAiResponse(response.content)
      setAiSuggestions(response.suggestions || [])
      setNextStep(response.nextStep || '')
      await wait(500)
      setShowNext(true)
    } catch (error) {
      console.error('Analysis failed:', error)
      setAiResponse('I apologize, but I need your OpenAI API key to provide real AI analysis. For now, I can see this is an important conflict that needs attention. Let\'s proceed to capture the facts first.')
      setShowNext(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleProceedToTruth = () => {
    setStep('truth')
    navigate('/truth')
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
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Understanding Your Conflict
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300 max-w-2xl mx-auto">
            Let's start by understanding what brought you here. Describe the situation that needs resolution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Conflict Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Describe the Conflict</h2>
            <p className="text-sm text-truth-600 dark:text-truth-400 mb-4">
              Share what happened from your perspective. Be honest and specific.
            </p>
            
            <textarea
              value={conflictDescription}
              onChange={(e) => setConflictDescription(e.target.value)}
              placeholder="Tell us about the situation that needs resolution..."
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-truth-500 focus:border-transparent transition-all duration-200 resize-none"
              disabled={isAnalyzing}
            />

            <button
              onClick={handleAnalyzeConflict}
              disabled={!conflictDescription.trim() || isAnalyzing}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  Analyzing...
                </div>
              ) : (
                'Analyze Conflict'
              )}
            </button>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">AI Mediator Analysis</h2>
            
            {!aiResponse && !isAnalyzing && (
              <div className="text-center py-8 text-slate-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <p>I'll analyze your conflict once you describe it</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 mx-auto mb-4 bg-truth-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-2xl text-white">🧠</span>
                </motion.div>
                <p className="text-slate-600 dark:text-slate-400">
                  Analyzing patterns, emotions, and underlying needs...
                </p>
              </div>
            )}

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-truth-50 dark:bg-truth-800 rounded-lg p-4 shadow-inner">
                  <p className="text-truth-700 dark:text-truth-300 whitespace-pre-line">{aiResponse}</p>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="border-t border-truth-200 dark:border-truth-700 pt-4">
                    <h3 className="font-medium mb-2 text-truth-900 dark:text-truth-100">AI Insights:</h3>
                    <ul className="text-sm text-truth-600 dark:text-truth-400 space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {nextStep && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Next Step:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{nextStep}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Partner Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 card"
        >
          <h2 className="text-xl font-semibold mb-4">Session Participants</h2>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-truth-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{partnerA?.name?.[0]}</span>
              </div>
              <p className="font-medium">{partnerA?.name}</p>
              <p className="text-sm text-green-600">✓ Verified</p>
            </div>
            
            <div className="text-2xl text-slate-400">⚡</div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-harmony-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{partnerB?.name?.[0]}</span>
              </div>
              <p className="font-medium">{partnerB?.name}</p>
              <p className="text-sm text-green-600">✓ Verified</p>
            </div>
          </div>
        </motion.div>

        {/* Next Step */}
        {showNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 text-center"
          >
            <button
              onClick={handleProceedToTruth}
              className="btn-primary text-lg px-8 py-4"
            >
              Begin Truth Capture →
            </button>
            <p className="text-sm text-truth-500 dark:text-truth-400 mt-2">
              Let's establish the facts before exploring emotions
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
