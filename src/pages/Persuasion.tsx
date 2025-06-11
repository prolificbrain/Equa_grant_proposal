import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'

export default function Persuasion() {
  const navigate = useNavigate()
  const { setStep, partners } = useSession()
  const [currentSpeaker, setCurrentSpeaker] = useState<'A' | 'B'>('A')
  const [persuasionGoal, setPersuasionGoal] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])

  const partnerA = partners[0]
  const partnerB = partners[1]
  const currentPartner = currentSpeaker === 'A' ? partnerA : partnerB
  const otherPartner = currentSpeaker === 'A' ? partnerB : partnerA

  const persuasionPrinciples = [
    {
      title: 'Autonomy Support',
      description: 'Respect their right to choose',
      technique: 'Present options rather than demands'
    },
    {
      title: 'Perspective Taking',
      description: 'Understand their viewpoint first',
      technique: 'Ask "Help me understand..." questions'
    },
    {
      title: 'Shared Values',
      description: 'Connect to what matters to both of you',
      technique: 'Find common ground and mutual benefits'
    },
    {
      title: 'Emotional Validation',
      description: 'Acknowledge their feelings',
      technique: 'Use "I can see why you feel..." statements'
    }
  ]

  const handleGetSuggestions = async () => {
    if (!persuasionGoal.trim() || !currentPartner || !otherPartner) return

    setIsProcessing(true)

    try {
      // Create a custom prompt for persuasion suggestions
      const prompt = `
      ${currentPartner.name} wants to persuade ${otherPartner.name} about: "${persuasionGoal}"

      Using autonomy-supportive influence principles, suggest 3 ways ${currentPartner.name} could approach this that:
      1. Respects ${otherPartner.name}'s autonomy and right to choose
      2. Shows understanding of ${otherPartner.name}'s perspective
      3. Connects to shared values and mutual benefits
      4. Validates emotions and builds trust

      Focus on collaborative persuasion, not manipulation.
      `

      const response = await truthKeeperAI.suggestReframe(
        persuasionGoal,
        currentPartner.name,
        `Persuasion context with ${otherPartner.name}`
      )

      setAiSuggestions(response.suggestions || [
        `Ask ${otherPartner.name} to share their perspective first`,
        `Find shared values that connect to your goal`,
        `Present options rather than making demands`
      ])
    } catch (error) {
      console.error('Persuasion suggestions failed:', error)
      setAiSuggestions([
        'Focus on understanding their perspective first',
        'Present your request as options, not demands',
        'Connect to shared values and mutual benefits'
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteExercise = (exercise: string) => {
    setCompletedExercises(prev => [...prev, exercise])
  }

  const handleNext = () => {
    setStep('reframing')
    navigate('/reframing')
  }

  const canProceed = completedExercises.length >= 2

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
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Autonomy-Supportive Persuasion
          </h1>
          <p className="text-lg text-truth-600 dark:text-truth-300">
            Learn to influence through understanding, not manipulation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Persuasion Exercise */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Persuasion Exercise</h2>

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
                <strong>{currentPartner?.name}</strong>, what would you like {otherPartner?.name} to understand or consider?
              </p>
            </div>

            <textarea
              value={persuasionGoal}
              onChange={(e) => setPersuasionGoal(e.target.value)}
              placeholder="Describe what you'd like your partner to understand or consider..."
              className="input-field h-24 resize-none"
              disabled={isProcessing}
            />

            <button
              onClick={handleGetSuggestions}
              disabled={!persuasionGoal.trim() || isProcessing}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full"
                  />
                  Generating suggestions...
                </div>
              ) : (
                'Get AI Persuasion Suggestions'
              )}
            </button>

            {aiSuggestions.length > 0 && (
              <div className="mt-4 p-4 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800">
                <h4 className="font-medium text-truth-800 dark:text-truth-200 mb-2">
                  AI Suggestions for {currentPartner?.name}:
                </h4>
                <ul className="text-sm text-truth-700 dark:text-truth-300 space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Persuasion Principles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold mb-4">Persuasion Principles</h2>

            <div className="space-y-4">
              {persuasionPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    completedExercises.includes(principle.title)
                      ? 'bg-truth-50 dark:bg-truth-900/50 border-black dark:border-white'
                      : 'bg-white dark:bg-truth-800 border-truth-100 dark:border-truth-700 hover:bg-truth-50 dark:hover:bg-truth-700/70'
                  }`}
                  onClick={() => handleCompleteExercise(principle.title)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{principle.title}</h3>
                      <p className="text-sm text-truth-600 dark:text-truth-400 mb-2">
                        {principle.description}
                      </p>
                      <p className="text-xs text-truth-500 dark:text-truth-500">
                        <strong>Technique:</strong> {principle.technique}
                      </p>
                    </div>
                    {completedExercises.includes(principle.title) && (
                      <span className="text-black dark:text-white ml-2 bg-truth-100 dark:bg-truth-700/50 w-6 h-6 flex items-center justify-center rounded-full">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-truth-50 dark:bg-truth-900/50 rounded-lg border border-truth-100 dark:border-truth-800">
              <h4 className="font-medium text-black dark:text-white mb-2">
                Remember:
              </h4>
              <p className="text-sm text-truth-700 dark:text-truth-300">
                True persuasion respects autonomy and builds trust. The goal is mutual understanding, not winning.
              </p>
            </div>
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
              <h3 className="font-semibold mb-2 text-black dark:text-white">Persuasion Skills Practiced ✓</h3>
              <p className="text-sm text-truth-600 dark:text-truth-400">
                You've learned autonomy-supportive influence techniques. Ready for reframing exercises.
              </p>
            </div>

            <button
              onClick={handleNext}
              className="btn-primary text-lg px-8 py-4"
            >
              Continue to Reframing →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
