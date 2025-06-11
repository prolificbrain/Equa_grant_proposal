import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
})

export interface VoiceConfig {
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  speed: number // 0.25 to 4.0
  model: 'tts-1' | 'tts-1-hd'
}

export interface TranscriptionResult {
  text: string
  confidence: number
  language?: string
}

export interface VoiceAnalysis {
  emotion: 'calm' | 'excited' | 'frustrated' | 'sad' | 'happy' | 'angry' | 'neutral'
  arousal: number // 0-100
  valence: number // -5 to +5
  suggestions: string[]
}

class VoiceService {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private isRecording = false
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null

  // Default voice configurations for different contexts
  private voiceConfigs = {
    mediator: { voice: 'nova' as const, speed: 0.9, model: 'tts-1-hd' as const },
    supportive: { voice: 'alloy' as const, speed: 0.8, model: 'tts-1-hd' as const },
    celebration: { voice: 'shimmer' as const, speed: 1.1, model: 'tts-1-hd' as const },
    guidance: { voice: 'echo' as const, speed: 0.85, model: 'tts-1-hd' as const }
  }

  // Initialize audio context for voice analysis
  async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext()
      console.log('🎤 Voice service initialized')
    } catch (error) {
      console.error('Failed to initialize voice service:', error)
    }
  }

  // Text-to-Speech: Convert AI responses to voice
  async speak(text: string, context: keyof typeof this.voiceConfigs = 'mediator'): Promise<void> {
    try {
      const config = this.voiceConfigs[context]
      
      const response = await openai.audio.speech.create({
        model: config.model,
        voice: config.voice,
        input: text,
        speed: config.speed
      })

      const audioBuffer = await response.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = reject
        audio.play()
      })
    } catch (error) {
      console.error('Text-to-speech failed:', error)
      throw error
    }
  }

  // Speech-to-Text: Convert user voice to text
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []
      this.isRecording = true

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.start()
      console.log('🎤 Recording started')
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  }

  async stopRecording(): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not currently recording'))
        return
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
          const transcription = await this.transcribeAudio(audioBlob)
          this.isRecording = false
          resolve(transcription)
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
      
      // Stop all tracks to release microphone
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop())
    })
  }

  // Transcribe audio using OpenAI Whisper
  private async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')
      formData.append('model', 'whisper-1')
      formData.append('language', 'en')

      const response = await openai.audio.transcriptions.create({
        file: audioBlob as any,
        model: 'whisper-1',
        language: 'en'
      })

      return {
        text: response.text,
        confidence: 0.9, // Whisper doesn't provide confidence, so we estimate
        language: 'en'
      }
    } catch (error) {
      console.error('Transcription failed:', error)
      throw error
    }
  }

  // Analyze voice for emotional content
  async analyzeVoice(audioBlob: Blob): Promise<VoiceAnalysis> {
    try {
      // For demo purposes, we'll simulate voice analysis
      // In production, this would use advanced audio analysis
      
      const transcription = await this.transcribeAudio(audioBlob)
      
      // Simple emotion detection based on text content
      const text = transcription.text.toLowerCase()
      let emotion: VoiceAnalysis['emotion'] = 'neutral'
      let arousal = 50
      let valence = 0

      // Basic emotion detection
      if (text.includes('angry') || text.includes('mad') || text.includes('furious')) {
        emotion = 'angry'
        arousal = 80
        valence = -3
      } else if (text.includes('sad') || text.includes('hurt') || text.includes('upset')) {
        emotion = 'sad'
        arousal = 30
        valence = -2
      } else if (text.includes('happy') || text.includes('joy') || text.includes('excited')) {
        emotion = 'happy'
        arousal = 70
        valence = 3
      } else if (text.includes('frustrated') || text.includes('annoyed')) {
        emotion = 'frustrated'
        arousal = 60
        valence = -2
      } else if (text.includes('calm') || text.includes('peaceful')) {
        emotion = 'calm'
        arousal = 20
        valence = 1
      }

      // Generate suggestions based on detected emotion
      const suggestions = this.generateEmotionSuggestions(emotion, arousal, valence)

      return {
        emotion,
        arousal,
        valence,
        suggestions
      }
    } catch (error) {
      console.error('Voice analysis failed:', error)
      
      // Return neutral analysis on error
      return {
        emotion: 'neutral',
        arousal: 50,
        valence: 0,
        suggestions: ['Take a deep breath and speak from your heart']
      }
    }
  }

  // Generate suggestions based on emotional analysis
  private generateEmotionSuggestions(emotion: string, arousal: number, valence: number): string[] {
    const suggestions: string[] = []

    if (arousal > 70) {
      suggestions.push('Take a moment to breathe and center yourself')
      suggestions.push('Try speaking more slowly to help your partner understand')
    }

    if (valence < -2) {
      suggestions.push('Consider using "I feel" statements instead of "you" statements')
      suggestions.push('Focus on your needs rather than what your partner did wrong')
    }

    switch (emotion) {
      case 'angry':
        suggestions.push('Take a 5-minute break to cool down before continuing')
        suggestions.push('Try to identify the hurt underneath the anger')
        break
      case 'sad':
        suggestions.push('It\'s okay to be vulnerable - share what you\'re really feeling')
        suggestions.push('Ask for the support you need from your partner')
        break
      case 'frustrated':
        suggestions.push('Break down the issue into smaller, manageable parts')
        suggestions.push('Ask clarifying questions to better understand each other')
        break
      case 'happy':
        suggestions.push('This positive energy is great - use it to build connection')
        break
      default:
        suggestions.push('Stay present and speak authentically')
    }

    return suggestions.slice(0, 3) // Limit to 3 suggestions
  }

  // Real-time voice coaching during conversation
  async startVoiceCoaching(onSuggestion: (suggestion: string) => void): Promise<void> {
    // This would implement real-time voice analysis and coaching
    // For demo, we'll simulate periodic suggestions
    
    const coachingTips = [
      'Remember to breathe deeply while speaking',
      'Try to match your partner\'s speaking pace',
      'Use a warm, gentle tone to build connection',
      'Pause between thoughts to let your partner process',
      'Lower your voice slightly to create intimacy'
    ]

    let tipIndex = 0
    const interval = setInterval(() => {
      if (tipIndex < coachingTips.length) {
        onSuggestion(coachingTips[tipIndex])
        tipIndex++
      } else {
        clearInterval(interval)
      }
    }, 30000) // Every 30 seconds
  }

  // Check if recording is currently active
  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  // Get available voices for customization
  getAvailableVoices(): Array<{ id: string; name: string; description: string }> {
    return [
      { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
      { id: 'echo', name: 'Echo', description: 'Calm, soothing voice' },
      { id: 'fable', name: 'Fable', description: 'Warm, storytelling voice' },
      { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
      { id: 'nova', name: 'Nova', description: 'Bright, energetic voice' },
      { id: 'shimmer', name: 'Shimmer', description: 'Light, celebratory voice' }
    ]
  }

  // Cleanup resources
  cleanup(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
    }
    
    if (this.audioContext) {
      this.audioContext.close()
    }
    
    console.log('🎤 Voice service cleaned up')
  }
}

// Singleton instance
export const voiceService = new VoiceService()
