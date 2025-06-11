import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'

interface ReframeExample {
  original: string
  reframed: string
  technique: string
}

export default function Reframing() {
  const navigate = useNavigate()
  const { setStep, partners } = useSession()
  const [currentSpeaker, setCurrentSpeaker] = useState<'A' | 'B'>('A')
  const [originalStatement, setOriginalStatement] = useState('')
  const [reframeSuggestions, setReframeSuggestions] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedReframes, setCompletedReframes] = useState<ReframeExample[]>([])

  const partnerA = partners[0]
  const partnerB = partners[1]
  const currentPartner = currentSpeaker === 'A' ? partnerA : partnerB

  const reframingTechniques = [
    {
      name: 'I-Statements',
      description: 'Express feelings without blame',
      example: '"You never listen" → "I feel unheard when..."'
    },
    {
      name: 'Needs Focus',
      description: 'Identify underlying needs',
      example: '"You\'re selfish" → "I need more consideration"'
    },
    {
      name: 'Curiosity',
      description: 'Ask questions instead of accusations',
      example: '"You don\'t care" → "Help me understand your perspective"'
    },
    {
      name: 'Growth Mindset',
      description: 'Focus on learning and improvement',
      example: '"We always fight" → "We\'re learning to communicate better"'
    }
  ]

  const handleGetReframes = async () => {
    if (!originalStatement.trim() || !currentPartner) return

    setIsProcessing(true)

    try {
      const response = await truthKeeperAI.suggestReframe(
        originalStatement,
        currentPartner.name,
        'Relationship communication context'
      )

      setReframeSuggestions(response.suggestions || [
        'Try using "I feel..." instead of "You always..."',
        'Focus on specific behaviors rather than character',
        'Express your needs clearly and kindly'
      ])
    } catch (error) {
      console.error('Reframing failed:', error)
      setReframeSuggestions([
        'Try using "I feel..." instead of "You always..."',
        'Focus on specific behaviors rather than character',
        'Express your needs clearly and kindly'
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveReframe = (reframedText: string, technique: string) => {
    const newReframe: ReframeExample = {
      original: originalStatement,
      reframed: reframedText,
      technique
    }

    setCompletedReframes(prev => [...prev, newReframe])
    setOriginalStatement('')
    setReframeSuggestions([])

    // Switch speaker
    setCurrentSpeaker(currentSpeaker === 'A' ? 'B' : 'A')
  }

  const handleNext = () => {
    setStep('qualia')
    navigate('/qualia')
  }

  const canProceed = completedReframes.length >= 2

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-black dark:bg-white opacity-10 blur-xl"></div>
            <div className="relative w-full h-full bg-white dark:bg-black border-2 border-black dark:border-white rounded-full flex items-center justify-center shadow-soft">
              <span className="text-3xl">🔄</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Cognitive Reframing
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300">
            Transform reactive statements into constructive communication
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Reframing Exercise */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Reframing Exercise</h2>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Current Speaker</h3>
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
              <p className="text-sm text-truth-600 dark:text-truth-400 mb-2">
                <strong>{currentPartner?.name}</strong>, share a statement you'd like to reframe more constructively:
              </p>
            </div>

            <textarea
              value={originalStatement}
              onChange={(e) => setOriginalStatement(e.target.value)}
              placeholder="Enter a statement you'd like to reframe (e.g., 'You never listen to me')"
              className="input-field h-24 resize-none"
              disabled={isProcessing}
            />

            <button
              onClick={handleGetReframes}
              disabled={!originalStatement.trim() || isProcessing}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full"
                  />
                  Generating reframes...
                </div>
              ) : (
                'Get AI Reframe Suggestions'
              )}
            </button>

            {reframeSuggestions.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium text-truth-800 dark:text-truth-200">
                  Suggested Reframes:
                </h4>
                {reframeSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800"
                  >
                    <p className="text-sm text-truth-700 dark:text-truth-300 mb-2">
                      {suggestion}
                    </p>
                    <button
                      onClick={() => handleSaveReframe(suggestion, 'AI Suggested')}
                      className="text-xs bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded hover:bg-truth-800 dark:hover:bg-truth-200 transition-colors"
                    >
                      Use This Reframe
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Reframing Techniques */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Reframing Techniques</h2>

            <div className="space-y-4 mb-6">
              {reframingTechniques.map((technique, index) => (
                <div
                  key={index}
                  className="p-4 bg-white dark:bg-truth-800 rounded-lg border border-truth-100 dark:border-truth-700 shadow-soft"
                >
                  <h3 className="font-medium mb-1 text-black dark:text-white">{technique.name}</h3>
                  <p className="text-sm text-truth-600 dark:text-truth-400 mb-2">
                    {technique.description}
                  </p>
                  <p className="text-xs text-truth-500 dark:text-truth-500 italic">
                    {technique.example}
                  </p>
                </div>
              ))}
            </div>

            {/* Completed Reframes */}
            {completedReframes.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-black dark:text-white">Your Reframes:</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {completedReframes.map((reframe, index) => (
                    <div
                      key={index}
                      className="p-3 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800 shadow-soft"
                    >
                      <p className="text-sm text-truth-800 dark:text-truth-300 mb-1">
                        <strong>Before:</strong> "{reframe.original}"
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        <strong>After:</strong> "{reframe.reframed}"
                      </p>
                      <p className="text-xs text-truth-500 dark:text-truth-500 mt-1">
                        Technique: {reframe.technique}
                      </p>
                    </div>
                  ))}
                </div>
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
              <h3 className="font-semibold mb-2 text-black dark:text-white">Reframing Skills Developed ✓</h3>
              <p className="text-sm text-truth-600 dark:text-truth-400">
                You've practiced transforming reactive statements into constructive communication. Ready to explore feelings.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="btn-primary text-lg px-8 py-4"
            >
              Continue to Qualia →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
