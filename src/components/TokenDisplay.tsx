import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TokenDisplay() {
  const [tokens, setTokens] = useState(0)
  const [showEarned, setShowEarned] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState(0)

  // Simulate token earning for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomEarn = Math.floor(Math.random() * 20) + 5
      setTokens(prev => prev + randomEarn)
      setEarnedAmount(randomEarn)
      setShowEarned(true)
      
      setTimeout(() => setShowEarned(false), 2000)
    }, 10000) // Earn tokens every 10 seconds for demo

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-20 right-4 z-40">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-truth-800 rounded-lg shadow-soft border border-truth-100 dark:border-truth-700 p-4 min-w-[140px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-soft">
            <span className="text-lg text-white dark:text-black">💎</span>
          </div>
          <div>
            <div className="text-lg font-bold text-black dark:text-white">
              {tokens.toLocaleString()}
            </div>
            <div className="text-xs text-truth-500 dark:text-truth-400">EQUA Tokens</div>
          </div>
        </div>

        {/* Token earned animation */}
        <AnimatePresence>
          {showEarned && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute -top-4 right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-sm font-semibold shadow-soft"
            >
              +{earnedAmount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Achievement notification (demo) */}
      <AnimatePresence>
        {tokens > 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ delay: 0.2 }}
            className="mt-3 bg-black dark:bg-white text-white dark:text-black rounded-lg p-4 text-sm shadow-soft"
          >
            <div className="flex items-center gap-3">
              <div className="text-lg">🏆</div>
              <div>
                <div className="font-medium">Achievement Unlocked</div>
                <div className="text-xs opacity-80 mt-0.5">First Steps Complete</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
