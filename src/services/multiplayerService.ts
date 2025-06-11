import { io, Socket } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

export interface MultiplayerSession {
  id: string
  partnerA: {
    id: string
    name: string
    deviceId: string
    isConnected: boolean
  }
  partnerB: {
    id: string
    name: string
    deviceId: string
    isConnected: boolean
  }
  currentStep: string
  currentSpeaker: 'A' | 'B' | null
  sharedData: Record<string, any>
  createdAt: Date
  lastActivity: Date
}

export interface MultiplayerEvent {
  type: 'step_change' | 'speaker_change' | 'data_update' | 'partner_action' | 'notification'
  payload: any
  timestamp: Date
  senderId: string
}

class MultiplayerService {
  private socket: Socket | null = null
  private currentSession: MultiplayerSession | null = null
  private deviceId: string
  private callbacks: Map<string, Function[]> = new Map()

  constructor() {
    this.deviceId = this.getOrCreateDeviceId()
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('truthkeeper_device_id')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('truthkeeper_device_id', deviceId)
    }
    return deviceId
  }

  // Initialize connection (for demo, we'll simulate with localStorage)
  async connect(): Promise<void> {
    // In production, this would connect to a real WebSocket server
    // For now, we'll simulate multiplayer with localStorage and polling
    console.log('🎮 Multiplayer service connected with device:', this.deviceId)
  }

  // Create a new multiplayer session
  async createSession(partnerAName: string, partnerBName: string): Promise<string> {
    const sessionId = uuidv4()
    
    const session: MultiplayerSession = {
      id: sessionId,
      partnerA: {
        id: 'partner_a',
        name: partnerAName,
        deviceId: this.deviceId,
        isConnected: true
      },
      partnerB: {
        id: 'partner_b',
        name: partnerBName,
        deviceId: '', // Will be set when partner B joins
        isConnected: false
      },
      currentStep: 'onboarding',
      currentSpeaker: null,
      sharedData: {},
      createdAt: new Date(),
      lastActivity: new Date()
    }

    // Store session (in production, this would be on server)
    localStorage.setItem(`truthkeeper_session_${sessionId}`, JSON.stringify(session))
    this.currentSession = session

    // Generate join code for partner
    const joinCode = this.generateJoinCode(sessionId)
    localStorage.setItem(`truthkeeper_join_${joinCode}`, sessionId)

    return joinCode
  }

  // Join an existing session
  async joinSession(joinCode: string, partnerName: string): Promise<MultiplayerSession | null> {
    const sessionId = localStorage.getItem(`truthkeeper_join_${joinCode}`)
    if (!sessionId) return null

    const sessionData = localStorage.getItem(`truthkeeper_session_${sessionId}`)
    if (!sessionData) return null

    const session: MultiplayerSession = JSON.parse(sessionData)
    
    // Update partner B info
    session.partnerB.deviceId = this.deviceId
    session.partnerB.name = partnerName
    session.partnerB.isConnected = true
    session.lastActivity = new Date()

    // Save updated session
    localStorage.setItem(`truthkeeper_session_${sessionId}`, JSON.stringify(session))
    this.currentSession = session

    // Notify partner A
    this.emitEvent({
      type: 'partner_action',
      payload: { action: 'partner_joined', partnerName },
      timestamp: new Date(),
      senderId: this.deviceId
    })

    return session
  }

  // Get current session
  getCurrentSession(): MultiplayerSession | null {
    return this.currentSession
  }

  // Check if current device is partner A or B
  getMyRole(): 'A' | 'B' | null {
    if (!this.currentSession) return null
    
    if (this.currentSession.partnerA.deviceId === this.deviceId) return 'A'
    if (this.currentSession.partnerB.deviceId === this.deviceId) return 'B'
    return null
  }

  // Get partner info
  getPartnerInfo(): { id: string; name: string; isConnected: boolean } | null {
    if (!this.currentSession) return null
    
    const myRole = this.getMyRole()
    if (myRole === 'A') {
      return {
        id: this.currentSession.partnerB.id,
        name: this.currentSession.partnerB.name,
        isConnected: this.currentSession.partnerB.isConnected
      }
    } else if (myRole === 'B') {
      return {
        id: this.currentSession.partnerA.id,
        name: this.currentSession.partnerA.name,
        isConnected: this.currentSession.partnerA.isConnected
      }
    }
    return null
  }

  // Update session step
  async updateStep(newStep: string): Promise<void> {
    if (!this.currentSession) return

    this.currentSession.currentStep = newStep
    this.currentSession.lastActivity = new Date()
    
    this.saveSession()
    
    this.emitEvent({
      type: 'step_change',
      payload: { step: newStep },
      timestamp: new Date(),
      senderId: this.deviceId
    })
  }

  // Update current speaker
  async updateSpeaker(speaker: 'A' | 'B' | null): Promise<void> {
    if (!this.currentSession) return

    this.currentSession.currentSpeaker = speaker
    this.currentSession.lastActivity = new Date()
    
    this.saveSession()
    
    this.emitEvent({
      type: 'speaker_change',
      payload: { speaker },
      timestamp: new Date(),
      senderId: this.deviceId
    })
  }

  // Update shared data
  async updateSharedData(key: string, value: any): Promise<void> {
    if (!this.currentSession) return

    this.currentSession.sharedData[key] = value
    this.currentSession.lastActivity = new Date()
    
    this.saveSession()
    
    this.emitEvent({
      type: 'data_update',
      payload: { key, value },
      timestamp: new Date(),
      senderId: this.deviceId
    })
  }

  // Send notification to partner
  async sendNotification(message: string, type: 'info' | 'success' | 'warning' = 'info'): Promise<void> {
    this.emitEvent({
      type: 'notification',
      payload: { message, notificationType: type },
      timestamp: new Date(),
      senderId: this.deviceId
    })
  }

  // Subscribe to events
  on(eventType: string, callback: Function): void {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, [])
    }
    this.callbacks.get(eventType)!.push(callback)
  }

  // Unsubscribe from events
  off(eventType: string, callback: Function): void {
    const callbacks = this.callbacks.get(eventType)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Generate a simple join code
  private generateJoinCode(sessionId: string): string {
    // Generate a 6-digit code
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Save session to storage
  private saveSession(): void {
    if (this.currentSession) {
      localStorage.setItem(
        `truthkeeper_session_${this.currentSession.id}`, 
        JSON.stringify(this.currentSession)
      )
    }
  }

  // Emit event to partner
  private emitEvent(event: MultiplayerEvent): void {
    // In production, this would send via WebSocket
    // For demo, we'll store events and let the other device poll
    const events = this.getStoredEvents()
    events.push(event)
    localStorage.setItem('truthkeeper_events', JSON.stringify(events))
    
    // Trigger callbacks for local events
    const callbacks = this.callbacks.get(event.type)
    if (callbacks) {
      callbacks.forEach(callback => callback(event))
    }
  }

  // Get stored events (for polling simulation)
  private getStoredEvents(): MultiplayerEvent[] {
    const eventsData = localStorage.getItem('truthkeeper_events')
    return eventsData ? JSON.parse(eventsData) : []
  }

  // Poll for new events (simulation of real-time updates)
  startPolling(): void {
    setInterval(() => {
      const events = this.getStoredEvents()
      const newEvents = events.filter(event => 
        event.senderId !== this.deviceId && 
        new Date(event.timestamp).getTime() > Date.now() - 5000 // Last 5 seconds
      )

      newEvents.forEach(event => {
        const callbacks = this.callbacks.get(event.type)
        if (callbacks) {
          callbacks.forEach(callback => callback(event))
        }
      })
    }, 1000) // Poll every second
  }

  // Disconnect and cleanup
  disconnect(): void {
    if (this.currentSession) {
      const myRole = this.getMyRole()
      if (myRole === 'A') {
        this.currentSession.partnerA.isConnected = false
      } else if (myRole === 'B') {
        this.currentSession.partnerB.isConnected = false
      }
      this.saveSession()
    }
    
    this.callbacks.clear()
    console.log('🎮 Multiplayer service disconnected')
  }
}

// Singleton instance
export const multiplayerService = new MultiplayerService()
