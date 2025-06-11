import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Step = 
  | 'onboarding' 
  | 'pact' 
  | 'conflict' 
  | 'truth' 
  | 'mediation' 
  | 'persuasion' 
  | 'reframing' 
  | 'qualia' 
  | 'forgiveness' 
  | 'success'

export interface Partner {
  id: string
  name: string
  worldId?: string
  attachmentStyle?: 'secure' | 'anxious' | 'avoidant' | 'fearful'
}

export interface ConflictSession {
  id: string
  startTime: Date
  partners: [Partner, Partner]
  currentPhase: 'truth' | 'mediation' | 'persuasion' | 'reframing' | 'qualia' | 'forgiveness'
  truthStatements: Array<{
    id: string
    partnerId: string
    text: string
    timestamp: Date
    verified: boolean
  }>
  qualiaEvents: Array<{
    id: string
    partnerId: string
    valence: number // -5 to +5
    arousal: number // 0-100
    bodyZone: string
    metaphor: string
    timestamp: Date
  }>
  agreements: Array<{
    id: string
    text: string
    signedBy: string[]
    timestamp: Date
  }>
}

interface SessionState {
  // Current session state
  currentStep: Step
  partners: [Partner?, Partner?]
  sessionId?: string
  currentSession?: ConflictSession

  // UI state
  isLoading: boolean
  darkMode: boolean

  // Actions
  setStep: (step: Step) => void
  setPartners: (partnerA: Partner, partnerB: Partner) => void
  startSession: () => void
  addTruthStatement: (partnerId: string, text: string) => void
  addQualiaEvent: (partnerId: string, valence: number, arousal: number, bodyZone: string, metaphor: string) => void
  addAgreement: (text: string, signedBy: string[]) => void
  setLoading: (loading: boolean) => void
  toggleDarkMode: () => void
  reset: () => void
}

const stepOrder: Step[] = [
  'onboarding',
  'pact', 
  'conflict',
  'truth',
  'mediation',
  'persuasion', 
  'reframing',
  'qualia',
  'forgiveness',
  'success'
]

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 'onboarding',
      partners: [undefined, undefined],
      isLoading: false,
      darkMode: false,
      
      // Actions
      setStep: (step: Step) => set({ currentStep: step }),
      
      setPartners: (partnerA: Partner, partnerB: Partner) => 
        set({ partners: [partnerA, partnerB] }),
      
      startSession: () => {
        const sessionId = `session_${Date.now()}`
        const partners = get().partners as [Partner, Partner]

        const newSession: ConflictSession = {
          id: sessionId,
          startTime: new Date(),
          partners,
          currentPhase: 'truth',
          truthStatements: [],
          qualiaEvents: [],
          agreements: []
        }

        set({
          sessionId,
          currentSession: newSession,
          currentStep: 'conflict'
        })
      },


      
      addTruthStatement: (partnerId: string, text: string) => {
        const session = get().currentSession
        if (!session) return

        const newStatement = {
          id: `truth_${Date.now()}`,
          partnerId,
          text,
          timestamp: new Date(),
          verified: false
        }

        set({
          currentSession: {
            ...session,
            truthStatements: [...session.truthStatements, newStatement]
          }
        })

        // For prototype: simulate token earning
        console.log('💎 Earned 10 TKT for truth statement')
      },
      
      addQualiaEvent: (partnerId: string, valence: number, arousal: number, bodyZone: string, metaphor: string) => {
        const session = get().currentSession
        if (!session) return

        const newEvent = {
          id: `qualia_${Date.now()}`,
          partnerId,
          valence,
          arousal,
          bodyZone,
          metaphor,
          timestamp: new Date()
        }

        set({
          currentSession: {
            ...session,
            qualiaEvents: [...session.qualiaEvents, newEvent]
          }
        })

        // For prototype: simulate token earning
        console.log('💎 Earned 15 TKT for qualia mapping')
      },
      
      addAgreement: (text: string, signedBy: string[]) => {
        const session = get().currentSession
        if (!session) return
        
        const newAgreement = {
          id: `agreement_${Date.now()}`,
          text,
          signedBy,
          timestamp: new Date()
        }
        
        set({
          currentSession: {
            ...session,
            agreements: [...session.agreements, newAgreement]
          }
        })
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      reset: () => set({
        currentStep: 'onboarding',
        partners: [undefined, undefined],
        sessionId: undefined,
        currentSession: undefined,
        isLoading: false
      })
    }),
    {
      name: 'truthkeeper-session',
      partialize: (state) => ({
        currentStep: state.currentStep,
        partners: state.partners,
        darkMode: state.darkMode
      })
    }
  )
)
