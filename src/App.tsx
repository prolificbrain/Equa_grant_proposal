import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Pages
import Onboarding from './pages/Onboarding'
import PactSign from './pages/PactSign'
import Conflict from './pages/Conflict'
import Truth from './pages/Truth'
import Mediation from './pages/Mediation'
import Persuasion from './pages/Persuasion'
import Reframing from './pages/Reframing'
import Qualia from './pages/Qualia'
import Forgiveness from './pages/Forgiveness'
import Memory from './pages/Memory'
import Success from './pages/Success'

// Components
import ProgressIndicator from './components/ProgressIndicator'
import TokenDisplay from './components/TokenDisplay'
import { useSession } from './store/useSession'

function App() {
  const { currentStep } = useSession()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
        {/* Beautiful background from your wife's designs */}
        <div className="fixed inset-0 z-0">
          <img
            src="/assets/website_background options/web_bg_2.png"
            alt="Background"
            className="w-full h-full object-cover opacity-5 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/20 dark:from-black/50 dark:via-transparent dark:to-white/10"></div>
        </div>
        
        <div className="relative z-10">
          <ProgressIndicator currentStep={currentStep} />
          <TokenDisplay />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/pact" element={<PactSign />} />
              <Route path="/conflict" element={<Conflict />} />
              <Route path="/truth" element={<Truth />} />
              <Route path="/mediation" element={<Mediation />} />
              <Route path="/persuasion" element={<Persuasion />} />
              <Route path="/reframing" element={<Reframing />} />
              <Route path="/qualia" element={<Qualia />} />
              <Route path="/forgiveness" element={<Forgiveness />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
