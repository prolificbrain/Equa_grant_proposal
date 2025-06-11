import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../store/useSession'

export default function Success() {
  const navigate = useNavigate()
  const { reset, partners } = useSession()

  const handleRestart = () => {
    reset()
    navigate('/')
  }

  const partnerA = partners[0]
  const partnerB = partners[1]

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative flex items-center justify-center gap-8 mb-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <motion.img
              src="/assets/crystals/truth_crystals/Truth_crystal_option1.png"
              alt="Truth Crystal"
              className="w-20 h-20 object-contain drop-shadow-2xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.img
              src="/assets/crystals/Pact_Crystal/Pact_crystal_option2.png"
              alt="Pact Crystal"
              className="w-24 h-24 object-contain drop-shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src="/assets/crystals/truth_crystals/Truth_crystal_option3.png"
              alt="Truth Crystal"
              className="w-20 h-20 object-contain drop-shadow-2xl"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Journey Complete
          </h1>
          
          <p className="text-xl text-truth-600 dark:text-truth-300 mb-12 max-w-2xl mx-auto font-light">
            Congratulations {partnerA?.name} and {partnerB?.name}! You've successfully navigated through all six pillars of EQuA.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-lg mx-auto mb-12">
            {[
              { icon: '/assets/crystals/truth_crystals/Truth_crystal_option1.png', label: 'Truth', status: 'Complete', alt: 'Truth Crystal' },
              { icon: '/assets/Icons_request_10_june_2025/Mediation.png', label: 'Mediation', status: 'Complete', alt: 'Mediation Icon' },
              { icon: '/assets/Icons_request_10_june_2025/persuasion.png', label: 'Persuasion', status: 'Complete', alt: 'Persuasion Icon' },
              { icon: '/assets/Icons_request_10_june_2025/reframe.png', label: 'Reframing', status: 'Complete', alt: 'Reframing Icon' },
              { icon: '/assets/Icons_request_10_june_2025/qualia_icon.png', label: 'Qualia', status: 'Complete', alt: 'Qualia Icon' },
              { icon: '/assets/Icons_request_10_june_2025/forgiveness.png', label: 'Forgiveness', status: 'Complete', alt: 'Forgiveness Icon' }
            ].map((pillar, index) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4 bg-white dark:bg-truth-800 rounded-lg border border-truth-100 dark:border-truth-700 shadow-soft"
              >
                <div className="w-10 h-10 mx-auto mb-3">
                  <img
                    src={pillar.icon}
                    alt={pillar.alt}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
                <div className="text-sm font-medium text-truth-900 dark:text-truth-100">{pillar.label}</div>
                <div className="mt-1 text-xs text-black dark:text-white inline-flex items-center gap-1 font-medium bg-truth-100 dark:bg-truth-700/50 px-2 py-0.5 rounded-full">
                  <span>✓</span> {pillar.status}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card-alt max-w-md mx-auto mb-12"
          >
            <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">What's Next?</h2>
            <div className="text-left space-y-3 text-truth-600 dark:text-truth-300">
              <p className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Continue practicing these communication skills</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Schedule regular check-ins using EQuA</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Share your experience with other couples</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-black dark:text-white">•</span>
                <span>Remember: healthy relationships are a journey, not a destination</span>
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRestart}
              className="btn-primary text-lg px-10 py-4"
            >
              Start New Session
            </motion.button>
            
            <div className="text-sm text-truth-500 dark:text-truth-400 mt-8">
              <p className="font-medium mb-1">Thank you for using EQuA v2</p>
              <p>Building stronger relationships through truth, empathy, and understanding</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
