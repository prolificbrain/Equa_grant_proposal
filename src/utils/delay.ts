/**
 * Utility function to simulate async operations and AI processing delays
 */
export const wait = (ms: number = 900): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Simulate AI thinking with random delay
 */
export const aiThinking = (): Promise<void> => 
  wait(Math.random() * 1000 + 500)

/**
 * Simulate World ID verification
 */
export const simulateWorldIdVerification = async (): Promise<{ success: boolean; nullifierHash: string }> => {
  await wait(2000)
  return {
    success: true,
    nullifierHash: `0x${Math.random().toString(16).substr(2, 64)}`
  }
}

/**
 * Simulate AI response generation
 */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  await aiThinking()
  
  // Simple response templates for demo
  const responses = [
    "I understand this is a challenging situation. Let's work through this together.",
    "It sounds like both of you have valid concerns. Can we explore what's underneath these feelings?",
    "I notice some strong emotions here. Would it help to take a moment to breathe and center yourselves?",
    "This seems to touch on something important for both of you. Let's unpack this carefully.",
    "I can see how this would be frustrating. What would feeling heard look like for each of you?"
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}
