export interface TokenBalance {
  total: number
  earned: number
  spent: number
  pending: number
}

export interface TokenTransaction {
  id: string
  type: 'earn' | 'spend' | 'bonus'
  amount: number
  reason: string
  description: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: 'experience' | 'coaching' | 'premium' | 'gift'
  image?: string
  availability: 'available' | 'limited' | 'sold_out'
  partnerRequired: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  reward: number
  unlocked: boolean
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
  }
}

class TokenService {
  private balance: TokenBalance = {
    total: 0,
    earned: 0,
    spent: 0,
    pending: 0
  }

  private transactions: TokenTransaction[] = []
  private achievements: Achievement[] = []

  constructor() {
    this.loadFromStorage()
    this.initializeAchievements()
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    const balanceData = localStorage.getItem('truthkeeper_token_balance')
    if (balanceData) {
      this.balance = JSON.parse(balanceData)
    }

    const transactionsData = localStorage.getItem('truthkeeper_transactions')
    if (transactionsData) {
      this.transactions = JSON.parse(transactionsData).map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      }))
    }

    const achievementsData = localStorage.getItem('truthkeeper_achievements')
    if (achievementsData) {
      this.achievements = JSON.parse(achievementsData).map((a: any) => ({
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
      }))
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    localStorage.setItem('truthkeeper_token_balance', JSON.stringify(this.balance))
    localStorage.setItem('truthkeeper_transactions', JSON.stringify(this.transactions))
    localStorage.setItem('truthkeeper_achievements', JSON.stringify(this.achievements))
  }

  // Initialize achievement system
  private initializeAchievements(): void {
    if (this.achievements.length === 0) {
      this.achievements = [
        {
          id: 'first_steps',
          title: 'First Steps',
          description: 'Complete your first truth session',
          icon: '👶',
          reward: 50,
          unlocked: false,
          progress: { current: 0, target: 1 }
        },
        {
          id: 'breakthrough',
          title: 'Breakthrough',
          description: 'Resolve your first major conflict',
          icon: '💡',
          reward: 100,
          unlocked: false,
          progress: { current: 0, target: 1 }
        },
        {
          id: 'empathy_master',
          title: 'Empathy Master',
          description: 'Complete 5 qualia mapping sessions',
          icon: '💗',
          reward: 150,
          unlocked: false,
          progress: { current: 0, target: 5 }
        },
        {
          id: 'forgiveness_champion',
          title: 'Forgiveness Champion',
          description: 'Complete the REACH forgiveness process',
          icon: '🕊️',
          reward: 200,
          unlocked: false,
          progress: { current: 0, target: 1 }
        },
        {
          id: 'consistency_king',
          title: 'Consistency Champion',
          description: 'Use EQuA for 7 days in a row',
          icon: '🔥',
          reward: 300,
          unlocked: false,
          progress: { current: 0, target: 7 }
        },
        {
          id: 'growth_mindset',
          title: 'Growth Mindset',
          description: 'Show improvement in 3 different pillars',
          icon: '📈',
          reward: 250,
          unlocked: false,
          progress: { current: 0, target: 3 }
        },
        {
          id: 'community_helper',
          title: 'Community Helper',
          description: 'Help 5 other couples through mentoring',
          icon: '🤝',
          reward: 500,
          unlocked: false,
          progress: { current: 0, target: 5 }
        }
      ]
      this.saveToStorage()
    }
  }

  // Get current token balance
  getBalance(): TokenBalance {
    return { ...this.balance }
  }

  // Earn tokens for completing activities
  async earnTokens(amount: number, reason: string, description: string): Promise<void> {
    const transaction: TokenTransaction = {
      id: `earn_${Date.now()}`,
      type: 'earn',
      amount,
      reason,
      description,
      timestamp: new Date(),
      status: 'completed'
    }

    this.transactions.push(transaction)
    this.balance.earned += amount
    this.balance.total += amount

    this.saveToStorage()
    this.checkAchievements(reason)

    console.log(`💎 Earned ${amount} TKT: ${description}`)
  }

  // Spend tokens on rewards
  async spendTokens(amount: number, reason: string, description: string): Promise<boolean> {
    if (this.balance.total < amount) {
      return false // Insufficient balance
    }

    const transaction: TokenTransaction = {
      id: `spend_${Date.now()}`,
      type: 'spend',
      amount,
      reason,
      description,
      timestamp: new Date(),
      status: 'completed'
    }

    this.transactions.push(transaction)
    this.balance.spent += amount
    this.balance.total -= amount

    this.saveToStorage()

    console.log(`💸 Spent ${amount} TKT: ${description}`)
    return true
  }

  // Get transaction history
  getTransactions(): TokenTransaction[] {
    return [...this.transactions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get available rewards
  getRewards(): Reward[] {
    return [
      {
        id: 'premium_voices',
        title: 'Premium AI Voices',
        description: 'Unlock celebrity and custom AI voices for mediation',
        cost: 100,
        category: 'premium',
        availability: 'available',
        partnerRequired: false
      },
      {
        id: 'coach_session',
        title: '1-Hour Coach Session',
        description: 'Professional relationship coaching with certified expert',
        cost: 500,
        category: 'coaching',
        availability: 'available',
        partnerRequired: true
      },
      {
        id: 'romantic_dinner',
        title: 'Romantic Dinner for Two',
        description: 'Voucher for dinner at a top-rated local restaurant',
        cost: 800,
        category: 'experience',
        availability: 'available',
        partnerRequired: true
      },
      {
        id: 'weekend_getaway',
        title: 'Weekend Getaway',
        description: 'Two nights at a romantic bed & breakfast',
        cost: 2000,
        category: 'experience',
        availability: 'limited',
        partnerRequired: true
      },
      {
        id: 'couples_retreat',
        title: 'Couples Retreat Weekend',
        description: 'Intensive relationship workshop with other couples',
        cost: 3000,
        category: 'experience',
        availability: 'limited',
        partnerRequired: true
      },
      {
        id: 'surprise_gift',
        title: 'Surprise Gift for Partner',
        description: 'AI-curated surprise gift based on your partner\'s interests',
        cost: 300,
        category: 'gift',
        availability: 'available',
        partnerRequired: false
      }
    ]
  }

  // Purchase a reward
  async purchaseReward(rewardId: string): Promise<{ success: boolean; message: string }> {
    const reward = this.getRewards().find(r => r.id === rewardId)
    if (!reward) {
      return { success: false, message: 'Reward not found' }
    }

    if (reward.availability === 'sold_out') {
      return { success: false, message: 'This reward is currently sold out' }
    }

    if (this.balance.total < reward.cost) {
      return { success: false, message: 'Insufficient token balance' }
    }

    const success = await this.spendTokens(
      reward.cost,
      'reward_purchase',
      `Purchased: ${reward.title}`
    )

    if (success) {
      return { 
        success: true, 
        message: `Successfully purchased ${reward.title}! Check your email for details.` 
      }
    } else {
      return { success: false, message: 'Purchase failed. Please try again.' }
    }
  }

  // Get achievements
  getAchievements(): Achievement[] {
    return [...this.achievements]
  }

  // Check and unlock achievements
  private checkAchievements(reason: string): void {
    let newAchievements = false

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return

      let shouldUnlock = false

      switch (achievement.id) {
        case 'first_steps':
          if (reason === 'truth_session_complete') {
            achievement.progress!.current = 1
            shouldUnlock = true
          }
          break
        case 'breakthrough':
          if (reason === 'conflict_resolved') {
            achievement.progress!.current = 1
            shouldUnlock = true
          }
          break
        case 'empathy_master':
          if (reason === 'qualia_session_complete') {
            achievement.progress!.current = Math.min(
              achievement.progress!.current + 1,
              achievement.progress!.target
            )
            shouldUnlock = achievement.progress!.current >= achievement.progress!.target
          }
          break
        case 'forgiveness_champion':
          if (reason === 'forgiveness_complete') {
            achievement.progress!.current = 1
            shouldUnlock = true
          }
          break
        case 'consistency_king':
          if (reason === 'daily_usage') {
            achievement.progress!.current = Math.min(
              achievement.progress!.current + 1,
              achievement.progress!.target
            )
            shouldUnlock = achievement.progress!.current >= achievement.progress!.target
          }
          break
      }

      if (shouldUnlock && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = new Date()
        newAchievements = true

        // Award achievement tokens
        this.earnTokens(
          achievement.reward,
          'achievement_unlock',
          `Achievement unlocked: ${achievement.title}`
        )

        console.log(`🏆 Achievement unlocked: ${achievement.title}`)
      }
    })

    if (newAchievements) {
      this.saveToStorage()
    }
  }

  // Update achievement progress manually
  updateAchievementProgress(achievementId: string, progress: number): void {
    const achievement = this.achievements.find(a => a.id === achievementId)
    if (achievement && achievement.progress) {
      achievement.progress.current = Math.min(progress, achievement.progress.target)
      this.saveToStorage()
    }
  }

  // Get user's tier based on total earned tokens
  getUserTier(): { name: string; icon: string; minTokens: number; benefits: string[] } {
    const totalEarned = this.balance.earned

    if (totalEarned >= 5000) {
      return {
        name: 'Diamond',
        icon: '💎',
        minTokens: 5000,
        benefits: [
          'International trip rewards',
          'Celebrity coach sessions',
          'VIP relationship retreats',
          'Priority customer support'
        ]
      }
    } else if (totalEarned >= 2000) {
      return {
        name: 'Gold',
        icon: '🥇',
        minTokens: 2000,
        benefits: [
          'Weekend getaway vouchers',
          'Professional coaching packages',
          'Exclusive retreat access',
          'Premium AI features'
        ]
      }
    } else if (totalEarned >= 500) {
      return {
        name: 'Silver',
        icon: '🥈',
        minTokens: 500,
        benefits: [
          'Premium AI voices',
          'Coach consultations',
          'Local experience discounts',
          'Advanced analytics'
        ]
      }
    } else {
      return {
        name: 'Bronze',
        icon: '🥉',
        minTokens: 0,
        benefits: [
          'Basic AI features',
          'Community access',
          'Monthly challenges',
          'Progress tracking'
        ]
      }
    }
  }

  // Reset all data (for testing)
  reset(): void {
    this.balance = { total: 0, earned: 0, spent: 0, pending: 0 }
    this.transactions = []
    this.achievements = []
    this.initializeAchievements()
    this.saveToStorage()
  }
}

// Singleton instance
export const tokenService = new TokenService()
