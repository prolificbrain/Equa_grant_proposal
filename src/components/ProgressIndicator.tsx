import { motion } from 'framer-motion'
import { Step } from '../store/useSession'

interface ProgressIndicatorProps {
  currentStep: Step
}

const steps: { key: Step; label: string; icon: string; isImage?: boolean }[] = [
  { key: 'onboarding', label: 'Welcome', icon: '👋' },
  { key: 'pact', label: 'Pact', icon: '/assets/New_assets_09_06_2025/Pact_sign_relationship_symbol.png', isImage: true },
  { key: 'conflict', label: 'Conflict', icon: '⚡' },
  { key: 'truth', label: 'Truth', icon: '/assets/crystals/truth_crystals/Truth_crystal_option1.png', isImage: true },
  { key: 'mediation', label: 'Mediation', icon: '/assets/Icons_request_10_june_2025/Mediation.png', isImage: true },
  { key: 'persuasion', label: 'Persuasion', icon: '/assets/Icons_request_10_june_2025/persuasion.png', isImage: true },
  { key: 'reframing', label: 'Reframing', icon: '/assets/Icons_request_10_june_2025/reframe.png', isImage: true },
  { key: 'qualia', label: 'Feelings', icon: '/assets/Icons_request_10_june_2025/qualia_icon.png', isImage: true },
  { key: 'forgiveness', label: 'Forgiveness', icon: '/assets/Icons_request_10_june_2025/forgiveness.png', isImage: true },
  { key: 'success', label: 'Success', icon: '✨' }
]

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.key === currentStep)
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-truth-100 dark:border-truth-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar pb-1">
          {steps.map((step, index) => {
            const isActive = index === currentIndex
            const isCompleted = index < currentIndex
            const isUpcoming = index > currentIndex
            
            return (
              <div key={step.key} className="flex items-center flex-shrink-0">
                <motion.div
                  className={`
                    relative progress-step
                    ${isActive ? 'progress-step-active' : ''}
                    ${isCompleted ? 'progress-step-completed' : ''}
                    ${isUpcoming ? 'progress-step-upcoming' : ''}
                  `}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {isCompleted ? '✓' : (
                    step.isImage ? (
                      <img
                        src={step.icon}
                        alt={step.label}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      step.icon
                    )
                  )}

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black dark:bg-white"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.div>
                
                <span className={`
                  ml-2 text-xs font-medium hidden sm:inline-block whitespace-nowrap
                  ${isActive ? 'text-black dark:text-white' : ''}
                  ${isCompleted ? 'text-black dark:text-white' : ''}
                  ${isUpcoming ? 'text-truth-400 dark:text-truth-500' : ''}
                `}>
                  {step.label}
                </span>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-6 h-0.5 mx-1 sm:w-8 sm:mx-3
                    ${isCompleted ? 'bg-black dark:bg-white' : 'bg-truth-200 dark:bg-truth-700'}
                    transition-colors duration-300
                  `} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full bg-truth-100 dark:bg-truth-800 rounded-full h-1 overflow-hidden">
          <motion.div
            className="bg-black dark:bg-white h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  )
}
