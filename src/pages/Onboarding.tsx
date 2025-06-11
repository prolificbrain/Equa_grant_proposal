import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSession, Partner } from '../store/useSession'
import { simulateWorldIdVerification, wait } from '../utils/delay'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setPartners, setStep, setLoading, isLoading } = useSession()
  
  const [partnerAName, setPartnerAName] = useState('')
  const [partnerBName, setPartnerBName] = useState('')
  const [verificationStep, setVerificationStep] = useState<'input' | 'verifying' | 'verified'>('input')

  const handleWorldIdVerification = async () => {
    if (!partnerAName.trim() || !partnerBName.trim()) {
      alert('Please enter both names first')
      return
    }

    setVerificationStep('verifying')
    setLoading(true)

    try {
      // Simulate World ID verification for both partners
      const [verificationA, verificationB] = await Promise.all([
        simulateWorldIdVerification(),
        simulateWorldIdVerification()
      ])

      if (verificationA.success && verificationB.success) {
        const partnerA: Partner = {
          id: 'partner_a',
          name: partnerAName.trim(),
          worldId: verificationA.nullifierHash
        }

        const partnerB: Partner = {
          id: 'partner_b', 
          name: partnerBName.trim(),
          worldId: verificationB.nullifierHash
        }

        setPartners(partnerA, partnerB)
        setVerificationStep('verified')
        
        await wait(1000)
        setStep('pact')
        navigate('/pact')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setVerificationStep('input')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Your wife's beautiful logo */}
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src="/assets/logo/LIGHTMODE/Lightmode_logo.png"
              alt="EQuA Logo"
              className="w-full h-full object-contain dark:hidden"
            />
            <img
              src="/assets/logo/DARKMODE/darkmode_logo_logo.png"
              alt="EQuA Logo"
              className="w-full h-full object-contain hidden dark:block"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Welcome to EQuA
          </h1>
          
          <p className="text-lg text-truth-600 dark:text-truth-300 max-w-lg mx-auto">
            AI-powered relationship mediation that helps you move from contested stories to co-created reality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card max-w-md mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Let's Begin Your Journey
          </h2>

          {verificationStep === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  First Partner's Name
                </label>
                <input
                  type="text"
                  value={partnerAName}
                  onChange={(e) => setPartnerAName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Second Partner's Name
                </label>
                <input
                  type="text"
                  value={partnerBName}
                  onChange={(e) => setPartnerBName(e.target.value)}
                  className="input-field"
                  placeholder="Enter partner's name"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleWorldIdVerification}
                disabled={isLoading || !partnerAName.trim() || !partnerBName.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <img
                  src="/assets/world-white-logo.png"
                  alt="World ID"
                  className="w-5 h-5 object-contain dark:hidden"
                />
                <img
                  src="/assets/world-black_logo.png"
                  alt="World ID"
                  className="w-5 h-5 object-contain hidden dark:block"
                />
                <img
                  src="/assets/New_assets_09_06_2025/Sign_a_pact_crystal_to_accompany_by_the_CTA.png"
                  alt="Pact Crystal"
                  className="w-6 h-6 object-contain"
                />
                Verify with World ID ✓
              </button>

              <div className="flex items-center justify-center gap-2 mt-3">
                <img
                  src="/assets/world-black_logo.png"
                  alt="World ID"
                  className="w-4 h-4 object-contain dark:hidden"
                />
                <img
                  src="/assets/world-white-logo.png"
                  alt="World ID"
                  className="w-4 h-4 object-contain hidden dark:block"
                />
                <p className="text-xs text-truth-500 dark:text-truth-400 text-center">
                  World ID verification ensures both participants are real humans and creates a secure, private session.
                </p>
              </div>
            </div>
          )}

          {verificationStep === 'verifying' && (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4 border-4 border-truth-600 border-t-transparent rounded-full"
              />
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/assets/world-black_logo.png"
                  alt="World ID"
                  className="w-5 h-5 object-contain dark:hidden"
                />
                <img
                  src="/assets/world-white-logo.png"
                  alt="World ID"
                  className="w-5 h-5 object-contain hidden dark:block"
                />
                <h3 className="text-lg font-medium">Verifying Identity</h3>
              </div>
              <p className="text-truth-600 dark:text-truth-400">
                Confirming both partners with World ID...
              </p>
            </div>
          )}

          {verificationStep === 'verified' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl text-white">✓</span>
              </motion.div>
              <h3 className="text-lg font-medium mb-2 text-green-600">Verification Complete!</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Proceeding to pact signing...
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <h3 className="text-lg font-semibold mb-4">The Six Pillars of EQuA</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: '/assets/crystals/truth_crystals/Truth_crystal_option1.png', label: 'Truth', alt: 'Truth Crystal' },
              { icon: '/assets/Icons_request_10_june_2025/Mediation.png', label: 'Mediation', alt: 'Mediation Icon' },
              { icon: '/assets/Icons_request_10_june_2025/persuasion.png', label: 'Persuasion', alt: 'Persuasion Icon' },
              { icon: '/assets/Icons_request_10_june_2025/reframe.png', label: 'Reframing', alt: 'Reframing Icon' },
              { icon: '/assets/Icons_request_10_june_2025/qualia_icon.png', label: 'Qualia', alt: 'Qualia Icon' },
              { icon: '/assets/Icons_request_10_june_2025/forgiveness.png', label: 'Forgiveness', alt: 'Forgiveness Icon' }
            ].map((pillar, index) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="text-center p-3 rounded-lg bg-truth-50 dark:bg-truth-800 shadow-soft"
              >
                <div className="w-8 h-8 mx-auto mb-2">
                  <img
                    src={pillar.icon}
                    alt={pillar.alt}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="text-sm font-medium text-truth-900 dark:text-truth-100">{pillar.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
