import { GratitudeMessage } from '../types/gratitude';

export class FamilyCoach {
  private static readonly COACH_ID = 'family-coach';
  private static readonly COACH_NAME = 'Family Coach';
  private static readonly COACH_AVATAR = 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=150';

  private static readonly MESSAGES = [
    {
      text: "Family is about teamwork, not competition. I believe in this family - do you believe in yourself? Let's beat your personal best!",
      category: 'teamwork',
      emoji: '🤝'
    },
    {
      text: "Every small task completed is a step towards our family's success. You're doing great!",
      category: 'maturity',
      emoji: '🌟'
    },
    {
      text: "Your kindness and support make our family stronger. Keep spreading that positive energy!",
      category: 'kindness',
      emoji: '💝'
    },
    {
      text: "Remember: progress over perfection. Each day is a new opportunity to grow together.",
      category: 'maturity',
      emoji: '🌱'
    },
    {
      text: "Your efforts don't go unnoticed. You're an essential part of our family team!",
      category: 'teamwork',
      emoji: '✨'
    }
  ] as const;

  static generateDailyMessage(userId: string): GratitudeMessage {
    const message = this.MESSAGES[Math.floor(Math.random() * this.MESSAGES.length)];
    
    return {
      id: `coach-${Date.now()}`,
      text: message.text,
      fromUserId: this.COACH_ID,
      toUserId: userId,
      category: message.category as 'kindness' | 'maturity' | 'teamwork',
      emoji: message.emoji,
      createdAt: new Date().toISOString()
    };
  }

  static getCoachProfile() {
    return {
      id: this.COACH_ID,
      name: this.COACH_NAME,
      avatar: this.COACH_AVATAR,
      role: 'coach' as const
    };
  }
}