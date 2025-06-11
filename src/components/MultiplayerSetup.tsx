import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from '../store/useSession'

interface MultiplayerSetupProps {
  onComplete: () => void
}

export default function MultiplayerSetup({ onComplete }: MultiplayerSetupProps) {
  const { partners, startMultiplayerSession, joinMultiplayerSession } = useSession()
  const [mode, setMode] = useState<'choose' | 'host' | 'join'>('choose')
  const [joinCode, setJoinCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const partnerA = partners[0]
  const partnerB = partners[1]

  const handleHostSession = async () => {
    if (!partnerA || !partnerB) {
      setError('Please enter both partner names first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const code = await startMultiplayerSession()
      setGeneratedCode(code)
    } catch (error) {
      setError('Failed to create session. Please try again.')
      console.error('Host session error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinSession = async () => {
    if (!joinCode.trim()) {
      setError('Please enter a join code')
      return
    }

    if (!partnerB) {
      setError('Please enter your name first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await joinMultiplayerSession(joinCode.toUpperCase())
      if (success) {
        onComplete()
      } else {
        setError('Invalid join code. Please check and try again.')
      }
    } catch (error) {
      setError('Failed to join session. Please try again.')
      console.error('Join session error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(generatedCode)
    // Could add a toast notification here
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🎮</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Multiplayer Mode</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Play together on separate devices for the best experience
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setMode('host')}
                className="w-full p-4 text-left rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Host Session</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Create a session and invite your partner
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('join')}
                className="w-full p-4 text-left rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-pink-300 dark:hover:border-pink-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center group-hover:bg-pink-200 dark:group-hover:bg-pink-800/30 transition-colors">
                    <span className="text-lg">🔗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Join Session</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enter a code to join your partner's session
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Why Multiplayer?
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Each partner has their own private space</li>
                <li>• Real-time synchronization of progress</li>
                <li>• Turn-based interactions feel more natural</li>
                <li>• Earn tokens together for shared rewards</li>
              </ul>
            </div>
          </motion.div>
        )}

        {mode === 'host' && (
          <motion.div
            key="host"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <button
              onClick={() => setMode('choose')}
              className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Host Session</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Create a session for you and {partnerB?.name || 'your partner'}
              </p>
            </div>

            {!generatedCode ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-medium mb-2">Session Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Host:</span>
                      <span className="font-medium">{partnerA?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partner:</span>
                      <span className="font-medium">{partnerB?.name}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleHostSession}
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating Session...
                    </div>
                  ) : (
                    'Create Session'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Session Created!
                  </h3>
                  <div className="text-3xl font-mono font-bold text-green-600 dark:text-green-400 mb-3">
                    {generatedCode}
                  </div>
                  <button
                    onClick={copyJoinCode}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Next Steps:
                  </h4>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>1. Share this code with {partnerB?.name}</li>
                    <li>2. Have them open EQuA on their device</li>
                    <li>3. They should choose "Join Session" and enter this code</li>
                    <li>4. Once connected, you'll both start the journey together!</li>
                  </ol>
                </div>

                <button
                  onClick={onComplete}
                  className="w-full btn-primary"
                >
                  Continue to Pact Signing
                </button>
              </div>
            )}
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <button
              onClick={() => setMode('choose')}
              className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Join Session</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Enter the code your partner shared with you
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  className="input-field text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleJoinSession}
                disabled={isLoading || joinCode.length !== 6}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    />
                    Joining Session...
                  </div>
                ) : (
                  'Join Session'
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h4 className="font-medium mb-2">Tips:</h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Make sure you're both connected to the internet</li>
                <li>• The code is case-insensitive</li>
                <li>• Ask your partner to double-check the code if it doesn't work</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
