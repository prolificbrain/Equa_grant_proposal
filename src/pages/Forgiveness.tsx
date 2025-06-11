import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { truthKeeperAI } from '../services/aiService'

export default function Forgiveness() {
  const navigate = useNavigate()
  const { setStep, partners, addAgreement } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<string[]>(['', '', '', '', ''])
  const [aiGuidance, setAiGuidance] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [forgivenessType, setForgivenessType] = useState<'decisional' | 'emotional' | 'both'>('both')

  const partnerA = partners[0]
  const partnerB = partners[1]

  const reachSteps = [
    {
      letter: 'R',
      title: 'Recall',
      description: 'Acknowledge the hurt without minimizing it',
      prompt: 'Describe what happened and how it affected you. Be honest about the pain.',
      placeholder: 'When this happened, I felt...'
    },
    {
      letter: 'E',
      title: 'Empathize',
      description: 'Try to understand the other person\'s perspective',
      prompt: 'Consider why your partner might have acted this way. What were they feeling or needing?',
      placeholder: 'I think you might have been feeling...'
    },
    {
      letter: 'A',
      title: 'Altruistic Gift',
      description: 'Choose to forgive as a gift, not because it\'s deserved',
      prompt: 'Reflect on times you\'ve been forgiven. Choose to offer forgiveness as a gift.',
      placeholder: 'I choose to forgive because...'
    },
    {
      letter: 'C',
      title: 'Commit',
      description: 'Make a commitment to forgive and let go of resentment',
      prompt: 'Make a clear commitment to forgiveness. What will you do differently?',
      placeholder: 'I commit to...'
    },
    {
      letter: 'H',
      title: 'Hold',
      description: 'Hold onto your forgiveness when doubts arise',
      prompt: 'How will you remember this forgiveness when old hurts resurface?',
      placeholder: 'When I feel hurt again, I will remember...'
    }
  ]

  const handleStepComplete = async () => {
    if (currentStep < reachSteps.length - 1) {
      // Get AI guidance for the next step
      if (responses[currentStep].trim()) {
        setIsProcessing(true)
        try {
          const response = await truthKeeperAI.guideForgiveness(
            responses[currentStep],
            partnerA?.name || 'Partner A',
            partnerB?.name || 'Partner B'
          )
          setAiGuidance(response.content)
        } catch (error) {
          console.error('AI guidance failed:', error)
          setAiGuidance('Continue with the next step of the REACH process. You\'re doing important work.')
        } finally {
          setIsProcessing(false)
        }
      }

      setCurrentStep(currentStep + 1)
    } else {
      // Complete the forgiveness process
      const forgivenessAgreement = `We have completed the REACH forgiveness process and commit to moving forward with understanding and compassion.`
      addAgreement(forgivenessAgreement, [partnerA?.id || '', partnerB?.id || ''])

      setStep('success')
      navigate('/success')
    }
  }

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses]
    newResponses[currentStep] = value
    setResponses(newResponses)
  }

  const currentStepData = reachSteps[currentStep]

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
                src="/assets/rocks/truth_rock_v1.png"
                alt="Truth Rock"
                className="w-full h-full object-contain drop-shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🕊️</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-truth-100 mb-4">
            Forgiveness & Reconciliation
          </h1>
          <p className="text-lg text-truth-400 dark:text-truth-300">
            The REACH Model for Forgiveness
          </p>
        </motion.div>

        {/* REACH Progress */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
            {reachSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                  ${currentStep >= index
                    ? 'bg-truth-700 text-truth-50'
                    : 'bg-truth-300 text-truth-600 dark:bg-truth-700 dark:text-truth-400'
                  }
                `}>
                  {step.letter}
                </div>
                {index < reachSteps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 ${
                    currentStep > index ? 'bg-truth-700' : 'bg-truth-300 dark:bg-truth-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {currentStepData.letter} - {currentStepData.title}
            </h2>
            <p className="text-truth-600 dark:text-truth-400">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Forgiveness Type Selection */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4 text-truth-900 dark:text-truth-100">Type of Forgiveness</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setForgivenessType('decisional')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  forgivenessType === 'decisional'
                    ? 'bg-truth-300 dark:bg-truth-700 border-truth-500 dark:border-truth-400'
                    : 'bg-truth-100 dark:bg-truth-800 border-truth-300 dark:border-truth-700 hover:bg-truth-200 dark:hover:bg-truth-600'
                }`}
              >
                <h4 className="font-medium mb-2 text-truth-800 dark:text-truth-200">Decisional</h4>
                <p className="text-sm text-truth-600 dark:text-truth-400">
                  Choose to act with goodwill despite hurt feelings
                </p>
              </button>

              <button
                onClick={() => setForgivenessType('emotional')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  forgivenessType === 'emotional'
                    ? 'bg-truth-300 dark:bg-truth-700 border-truth-500 dark:border-truth-400'
                    : 'bg-truth-100 dark:bg-truth-800 border-truth-300 dark:border-truth-700 hover:bg-truth-200 dark:hover:bg-truth-600'
                }`}
              >
                <h4 className="font-medium mb-2 text-truth-800 dark:text-truth-200">Emotional</h4>
                <p className="text-sm text-truth-600 dark:text-truth-400">
                  Replace negative emotions with positive ones
                </p>
              </button>

              <button
                onClick={() => setForgivenessType('both')}
                className={`p-4 rounded-lg border text-left transition-all ${
                  forgivenessType === 'both'
                    ? 'bg-truth-300 dark:bg-truth-700 border-truth-500 dark:border-truth-400'
                    : 'bg-truth-100 dark:bg-truth-800 border-truth-300 dark:border-truth-700 hover:bg-truth-200 dark:hover:bg-truth-600'
                }`}
              >
                <h4 className="font-medium mb-2 text-truth-800 dark:text-truth-200">Both</h4>
                <p className="text-sm text-truth-600 dark:text-truth-400">
                  Work toward both decisional and emotional forgiveness
                </p>
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4 text-truth-900 dark:text-truth-100">
              Step {currentStep + 1}: {currentStepData.title}
            </h3>

            <div className="mb-4 p-4 bg-truth-100 dark:bg-truth-800 rounded-lg">
              <p className="text-sm text-truth-600 dark:text-truth-400">
                {currentStepData.prompt}
              </p>
            </div>

            <textarea
              value={responses[currentStep]}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder={currentStepData.placeholder}
              className="w-full h-32 px-4 py-3 rounded-xl border border-truth-300 dark:border-truth-700 bg-truth-50 dark:bg-truth-800 text-truth-900 dark:text-truth-100 placeholder-truth-500 focus:ring-2 focus:ring-truth-500 focus:border-transparent transition-all duration-200 resize-none"
            />

            <button
              onClick={handleStepComplete}
              disabled={!responses[currentStep].trim() || isProcessing}
              className="w-full mt-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing...
                </div>
              ) : currentStep === reachSteps.length - 1 ? (
                'Complete Forgiveness Journey →'
              ) : (
                `Continue to ${reachSteps[currentStep + 1]?.title} →`
              )}
            </button>
          </motion.div>

          {/* AI Guidance & Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4 text-truth-900 dark:text-truth-100">Guidance & Support</h3>

            {aiGuidance ? (
              <div className="mb-6 p-4 bg-truth-100 dark:bg-truth-800/30 rounded-lg border border-truth-300 dark:border-truth-700">
                <h4 className="font-medium text-truth-700 dark:text-truth-200 mb-2">AI Guidance:</h4>
                <p className="text-sm text-truth-600 dark:text-truth-300 whitespace-pre-line">
                  {aiGuidance}
                </p>
              </div>
            ) : (
              <div className="mb-6 text-center py-8 text-truth-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-truth-200 dark:bg-truth-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <p>AI guidance will appear as you progress</p>
              </div>
            )}

            {/* Completed Steps */}
            {currentStep > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-truth-800 dark:text-truth-200">Your REACH Journey:</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {reachSteps.slice(0, currentStep).map((step, index) => (
                    <div
                      key={index}
                      className="p-3 bg-truth-100 dark:bg-truth-800/30 rounded-lg border border-truth-300 dark:border-truth-600"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-truth-600 text-truth-50 rounded-full flex items-center justify-center text-xs font-bold">
                          {step.letter}
                        </div>
                        <span className="font-medium text-sm text-truth-700 dark:text-truth-300">{step.title}</span>
                      </div>
                      <p className="text-xs text-truth-600 dark:text-truth-400 ml-8">
                        {responses[index].substring(0, 100)}
                        {responses[index].length > 100 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="mt-6 pt-4 border-t border-truth-300 dark:border-truth-700">
              <h4 className="font-medium mb-3 text-truth-800 dark:text-truth-200">Forgiveness Journey</h4>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 bg-truth-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{partnerA?.name?.[0]}</span>
                  </div>
                  <p className="text-xs text-truth-700 dark:text-truth-300">{partnerA?.name}</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl">🤝</span>
                  <p className="text-xs mt-1 text-truth-700 dark:text-truth-300">Healing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-1 bg-truth-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{partnerB?.name?.[0]}</span>
                  </div>
                  <p className="text-xs text-truth-700 dark:text-truth-300">{partnerB?.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
