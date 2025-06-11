import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'
import { wait } from '../utils/delay'

export default function PactSign() {
  const navigate = useNavigate()
  const { partners, setStep, startSession } = useSession()
  const [holdingA, setHoldingA] = useState(false)
  const [holdingB, setHoldingB] = useState(false)
  const [pactSigned, setPactSigned] = useState(false)
  const [showMerge, setShowMerge] = useState(false)

  const partnerA = partners[0]
  const partnerB = partners[1]

  // Keyboard shortcuts for testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        setHoldingA(true)
      }
      if (e.key === 's' || e.key === 'S') {
        setHoldingB(true)
      }
    }

    const handleKeyRelease = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        setHoldingA(false)
      }
      if (e.key === 's' || e.key === 'S') {
        setHoldingB(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keyup', handleKeyRelease)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keyup', handleKeyRelease)
    }
  }, [])

  const [demoMode, setDemoMode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [sequentialMode, setSequentialMode] = useState(false)
  const [partnerASigned, setPartnerASigned] = useState(false)
  const [partnerBSigned, setPartnerBSigned] = useState(false)

  const handleHoldStart = (partner: 'A' | 'B') => {
    if (partner === 'A') setHoldingA(true)
    if (partner === 'B') setHoldingB(true)
  }

  const handleHoldEnd = (partner: 'A' | 'B') => {
    if (partner === 'A') setHoldingA(false)
    if (partner === 'B') setHoldingB(false)
  }

  const handlePactComplete = async () => {
    if (holdingA && holdingB) {
      setShowMerge(true)
      await wait(2000)
      setPactSigned(true)
      await wait(1500)
      startSession()
      setStep('conflict')
      navigate('/conflict')
    }
  }

  const handleDemoSign = () => {
    setDemoMode(true)
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setHoldingA(true)
          setHoldingB(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSequentialSign = (partner: 'A' | 'B') => {
    if (partner === 'A' && !partnerASigned) {
      setPartnerASigned(true)
    }
    if (partner === 'B' && !partnerBSigned) {
      setPartnerBSigned(true)
    }

    // If both have signed sequentially, trigger the merge
    if ((partner === 'A' && partnerBSigned) || (partner === 'B' && partnerASigned)) {
      setHoldingA(true)
      setHoldingB(true)
    }
  }

  // Trigger pact completion when both are holding
  if (holdingA && holdingB && !showMerge && !pactSigned) {
    handlePactComplete()
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-truth-100 mb-4">
            Digital Pact of Truth & Understanding
          </h1>
          <p className="text-lg text-truth-400 dark:text-truth-300 mb-12 max-w-2xl mx-auto">
            By signing this pact, you both commit to honest dialogue, mutual respect, and working together toward understanding.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showMerge && !pactSigned && (
            <motion.div
              key="signing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-truth-50 dark:bg-truth-900 shadow-soft rounded-2xl p-8 border border-truth-200 dark:border-truth-700 max-w-2xl mx-auto">
                {/* Beautiful pact symbol */}
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src="/assets/New_assets_09_06_2025/Pact_sign_relationship_symbol.png"
                    alt="Pact Symbol"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-xl font-semibold text-truth-900 dark:text-truth-100 mb-6">Our Commitment</h2>
                <div className="text-left space-y-4 text-truth-400 dark:text-truth-300">
                  <p>✓ We will speak our truth with kindness and clarity</p>
                  <p>✓ We will listen to understand, not to win</p>
                  <p>✓ We will respect each other's feelings and perspectives</p>
                  <p>✓ We will work together to find solutions that honor both of us</p>
                  <p>✓ We will use this space as a sanctuary for honest communication</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                {/* Partner A Circle */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-truth-900 dark:text-truth-100">{partnerA?.name}</h3>
                  <motion.div
                    className={`
                      w-32 h-32 rounded-full border-4 cursor-pointer select-none
                      flex items-center justify-center font-bold text-lg
                      transition-all duration-200
                      ${holdingA || partnerASigned
                        ? 'bg-truth-700 border-truth-700 text-truth-50 shadow-xl scale-110'
                        : 'bg-truth-200 border-truth-300 text-truth-700 hover:bg-truth-300 hover:border-truth-400 dark:bg-truth-700 dark:border-truth-600 dark:text-truth-200 dark:hover:bg-truth-600 dark:hover:border-truth-500'
                      }
                    `}
                    onMouseDown={() => sequentialMode ? handleSequentialSign('A') : handleHoldStart('A')}
                    onMouseUp={() => !sequentialMode && handleHoldEnd('A')}
                    onMouseLeave={() => !sequentialMode && handleHoldEnd('A')}
                    onTouchStart={() => sequentialMode ? handleSequentialSign('A') : handleHoldStart('A')}
                    onTouchEnd={() => !sequentialMode && handleHoldEnd('A')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {holdingA || partnerASigned ? '✓' : (sequentialMode ? 'SIGN' : 'HOLD')}
                  </motion.div>
                  <p className="text-sm text-truth-500 dark:text-truth-400 mt-2">
                    {sequentialMode ? 'Click to sign' : 'Hold to sign'}
                    {(holdingA || partnerASigned) && <span className="text-truth-700 dark:text-truth-300"> ✓ Signed!</span>}
                  </p>
                  {!sequentialMode && <p className="text-xs text-truth-600 dark:text-truth-400 mt-1">Press & hold 'A' key</p>}
                </div>

                {/* Connection indicator */}
                <div className="flex items-center">
                  <motion.div
                    className={`
                      w-16 h-1 rounded-full transition-all duration-500
                      ${holdingA && holdingB 
                        ? 'bg-truth-700' 
                        : 'bg-truth-300 dark:bg-truth-700'
                      }
                    `}
                    animate={holdingA && holdingB ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                {/* Partner B Circle */}
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4 text-truth-900 dark:text-truth-100">{partnerB?.name}</h3>
                  <motion.div
                    className={`
                      w-32 h-32 rounded-full border-4 cursor-pointer select-none
                      flex items-center justify-center font-bold text-lg
                      transition-all duration-200
                      ${holdingB || partnerBSigned
                        ? 'bg-truth-700 border-truth-700 text-truth-50 shadow-xl scale-110'
                        : 'bg-truth-200 border-truth-300 text-truth-700 hover:bg-truth-300 hover:border-truth-400 dark:bg-truth-700 dark:border-truth-600 dark:text-truth-200 dark:hover:bg-truth-600 dark:hover:border-truth-500'
                      }
                    `}
                    onMouseDown={() => sequentialMode ? handleSequentialSign('B') : handleHoldStart('B')}
                    onMouseUp={() => !sequentialMode && handleHoldEnd('B')}
                    onMouseLeave={() => !sequentialMode && handleHoldEnd('B')}
                    onTouchStart={() => sequentialMode ? handleSequentialSign('B') : handleHoldStart('B')}
                    onTouchEnd={() => !sequentialMode && handleHoldEnd('B')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {holdingB || partnerBSigned ? '✓' : (sequentialMode ? 'SIGN' : 'HOLD')}
                  </motion.div>
                  <p className="text-sm text-truth-500 dark:text-truth-400 mt-2">
                    {sequentialMode ? 'Click to sign' : 'Hold to sign'}
                    {(holdingB || partnerBSigned) && <span className="text-truth-700 dark:text-truth-300"> ✓ Signed!</span>}
                  </p>
                  {!sequentialMode && <p className="text-xs text-truth-600 dark:text-truth-400 mt-1">Press & hold 'S' key</p>}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-truth-600 dark:text-truth-400">
                  {sequentialMode
                    ? 'Each partner clicks their circle to sign (one at a time is fine)'
                    : 'Both partners must hold their circles simultaneously to sign the pact'
                  }
                </p>

                {/* Demo Mode Instructions */}
                <div className="bg-truth-100 dark:bg-truth-800 shadow-soft rounded-lg p-4 border border-truth-200 dark:border-truth-700">
                  <h3 className="font-medium text-truth-800 dark:text-truth-200 mb-2">Testing Options:</h3>
                  <div className="text-sm text-truth-700 dark:text-truth-300 space-y-1">
                    <p>• <strong>Keyboard:</strong> Hold 'A' key for {partnerA?.name}, 'S' key for {partnerB?.name}</p>
                    <p>• <strong>Auto Demo:</strong> Click button below for automatic signing</p>
                    <p>• <strong>Two Devices:</strong> Open on two phones/tablets for real experience</p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setSequentialMode(!sequentialMode)}
                    className={`text-sm transition-all ${sequentialMode ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Sequential Mode
                  </button>

                  <button
                    onClick={handleDemoSign}
                    disabled={demoMode || showMerge || pactSigned}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    {countdown > 0 ? `Auto-signing in ${countdown}...` : 'Auto-Sign Demo'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {showMerge && !pactSigned && (
            <motion.div
              key="merging"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-truth-700"
                  animate={{
                    x: [0, 50, 0],
                    scale: [1, 1.2, 1.5]
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-0 w-32 h-32 rounded-full bg-truth-700"
                  animate={{
                    x: [100, 50, 0],
                    scale: [1, 1.2, 1.5]
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-0 w-32 h-32 rounded-full bg-gradient-to-r from-truth-700 to-truth-900"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {pactSigned && (
            <motion.div
              key="signed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-40 h-40 mx-auto mb-6 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <img
                  src="/assets/crystals/Pact_Crystal/Pact_crystal_option2.png"
                  alt="Pact Crystal"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>
              <h2 className="text-2xl font-bold text-truth-900 dark:text-truth-100 mb-4">Pact Signed Successfully!</h2>
              <p className="text-lg text-truth-400 dark:text-truth-300">
                Your journey of truth and understanding begins now...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
