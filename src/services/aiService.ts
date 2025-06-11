import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
})

// EQuA System Prompt based on our documentation
const EQUA_SYSTEM_PROMPT = `
You are EQuA v2, an AI mediator specializing in relationship conflict resolution. You guide couples and friends through six evidence-based pillars to move from contested stories to co-created reality.

# Your Core Mission
Help two people convert conflict into sustainable growth through:
1. Truth - Epistemic transparency & verifiable facts
2. Mediation - Principled negotiation workflow  
3. Persuasion - Autonomy-supportive influence
4. Reframing - Cognitive reappraisal & context shifts
5. Qualia - First-person felt-sense & interoception
6. Forgiveness - REACH & restorative justice models

# Key Principles
- Separate people from the problem
- Focus on interests, not positions
- Validate both perspectives without taking sides
- Use "I" statements and avoid blame language
- Encourage empathy and perspective-taking
- Guide toward mutual understanding and agreements

# Communication Style
- Calm, empathetic, and non-judgmental
- Use clear, accessible language
- Ask clarifying questions
- Reflect back what you hear
- Suggest reframes when helpful
- Encourage emotional honesty

# Response Guidelines
- Keep responses concise but thoughtful (2-4 sentences)
- Always acknowledge both partners' feelings
- Suggest specific next steps or questions
- Use evidence-based conflict resolution techniques
- Maintain hope and focus on growth potential

You are currently helping a couple work through their conflict. Respond as their AI mediator.
`

export interface AIResponse {
  content: string
  suggestions?: string[]
  nextStep?: string
  pillarFocus?: 'truth' | 'mediation' | 'persuasion' | 'reframing' | 'qualia' | 'forgiveness'
}

export class EquaAI {
  private conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[] = []

  constructor() {
    this.conversationHistory.push({
      role: 'system',
      content: EQUA_SYSTEM_PROMPT
    })
  }

  async analyzeConflict(description: string, partnerNames: [string, string]): Promise<AIResponse> {
    const prompt = `
    Partners ${partnerNames[0]} and ${partnerNames[1]} have described their conflict:
    
    "${description}"
    
    Please provide:
    1. A brief analysis of the underlying issues
    2. What pillar should we focus on first
    3. A suggestion for the next step
    
    Keep your response empathetic and solution-focused.
    `

    return this.getAIResponse(prompt, 'truth')
  }

  async processTruthStatement(
    statement: string, 
    speakerName: string, 
    partnerName: string,
    previousStatements: string[]
  ): Promise<AIResponse> {
    const context = previousStatements.length > 0 
      ? `Previous statements: ${previousStatements.join('; ')}`
      : 'This is the first truth statement.'

    const prompt = `
    ${speakerName} has shared: "${statement}"
    ${context}
    
    Please:
    1. Acknowledge what ${speakerName} has shared
    2. Identify any emotional undertones
    3. Suggest how ${partnerName} might respond constructively
    4. Note if this reveals underlying needs or interests
    
    Focus on building understanding between the partners.
    `

    return this.getAIResponse(prompt, 'truth')
  }

  async facilitateMediation(
    truthStatements: Array<{speaker: string, text: string}>,
    partnerNames: [string, string]
  ): Promise<AIResponse> {
    const statementsText = truthStatements
      .map(s => `${s.speaker}: "${s.text}"`)
      .join('\n')

    const prompt = `
    Based on these truth statements:
    ${statementsText}
    
    Please facilitate the mediation by:
    1. Identifying common ground between ${partnerNames[0]} and ${partnerNames[1]}
    2. Highlighting underlying needs and interests
    3. Suggesting areas for compromise or collaboration
    4. Proposing specific discussion questions
    
    Guide them toward mutual understanding and potential solutions.
    `

    return this.getAIResponse(prompt, 'mediation')
  }

  async suggestReframe(
    statement: string,
    speakerName: string,
    context: string
  ): Promise<AIResponse> {
    const prompt = `
    ${speakerName} said: "${statement}"
    Context: ${context}
    
    Please suggest 2-3 alternative ways to express this that:
    1. Focus on feelings and needs rather than blame
    2. Use "I" statements
    3. Open dialogue rather than shut it down
    4. Show vulnerability and authenticity
    
    Help them communicate more effectively.
    `

    return this.getAIResponse(prompt, 'reframing')
  }

  async guideForgiveness(
    offense: string,
    offenderName: string,
    victimName: string
  ): Promise<AIResponse> {
    const prompt = `
    ${victimName} feels hurt by: "${offense}"
    
    Using the REACH model (Recall, Empathize, Altruistic gift, Commit, Hold), please:
    1. Help ${victimName} process their feelings
    2. Guide ${offenderName} toward genuine accountability
    3. Suggest steps for rebuilding trust
    4. Focus on healing and moving forward together
    
    Be gentle but honest about the work required for reconciliation.
    `

    return this.getAIResponse(prompt, 'forgiveness')
  }

  private async getAIResponse(prompt: string, pillar: AIResponse['pillarFocus']): Promise<AIResponse> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: prompt
      })

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview', // Using GPT-4 Turbo as fallback if 4.1 not available
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 500
      })

      const content = completion.choices[0]?.message?.content || 'I apologize, but I need a moment to process that. Could you please rephrase your concern?'

      this.conversationHistory.push({
        role: 'assistant',
        content
      })

      // Extract suggestions and next steps from the response
      const suggestions = this.extractSuggestions(content)
      const nextStep = this.extractNextStep(content)

      return {
        content,
        suggestions,
        nextStep,
        pillarFocus: pillar
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      
      // Fallback response
      return {
        content: "I'm experiencing some technical difficulties, but I'm here to help. Let's continue working through this together. What would you like to focus on next?",
        pillarFocus: pillar
      }
    }
  }

  private extractSuggestions(content: string): string[] {
    // Simple extraction - look for numbered lists or bullet points
    const suggestions: string[] = []
    const lines = content.split('\n')
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^[-•*]/)) {
        suggestions.push(line.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim())
      }
    }
    
    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  private extractNextStep(content: string): string | undefined {
    // Look for phrases that indicate next steps
    const nextStepPhrases = [
      'next step',
      'moving forward',
      'I suggest',
      'try this',
      'consider'
    ]
    
    const lines = content.split('.')
    for (const line of lines) {
      for (const phrase of nextStepPhrases) {
        if (line.toLowerCase().includes(phrase)) {
          return line.trim()
        }
      }
    }
    
    return undefined
  }

  // Reset conversation for new session
  reset(): void {
    this.conversationHistory = [{
      role: 'system',
      content: EQUA_SYSTEM_PROMPT
    }]
  }
}

// Singleton instance
export const equaAI = new EquaAI()

// Alias export for backward compatibility
export const truthKeeperAI = equaAI;
