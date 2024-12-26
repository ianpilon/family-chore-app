import { useEffect } from 'react';
import { useApp } from './useApp';
import { FamilyCoach } from '../services/FamilyCoach';

export function useFamilyCoach() {
  const { users, sendGratitude } = useApp();

  useEffect(() => {
    // Send daily messages at the start of each day
    const checkAndSendDailyMessages = () => {
      const lastSentDate = localStorage.getItem('lastCoachMessageDate');
      const today = new Date().toDateString();

      if (lastSentDate !== today) {
        // Send message to each family member
        users.forEach(user => {
          if (user.id !== FamilyCoach.getCoachProfile().id) {
            const message = FamilyCoach.generateDailyMessage(user.id);
            sendGratitude(message);
          }
        });

        localStorage.setItem('lastCoachMessageDate', today);
      }
    };

    // Check immediately when component mounts
    checkAndSendDailyMessages();

    // Set up interval to check periodically
    const interval = setInterval(checkAndSendDailyMessages, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, [users, sendGratitude]);
}