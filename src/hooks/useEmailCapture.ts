import { useState } from 'react';
import { emailService } from '@/services/emailService';
import type { EmailCaptureData, EmailStats } from '@/types/email';

export interface UseEmailCaptureReturn {
  isSubmitting: boolean;
  error: string | null;
  stats: EmailStats | null;
  captureEmail: (data: Omit<EmailCaptureData, 'user_agent'>) => Promise<boolean>;
  getStats: () => Promise<void>;
  clearError: () => void;
}

export function useEmailCapture(): UseEmailCaptureReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EmailStats | null>(null);

  const captureEmail = async (data: Omit<EmailCaptureData, 'user_agent'>): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const emailData: EmailCaptureData = {
        ...data,
        user_agent: navigator.userAgent
      };

      const result = await emailService.captureEmail(emailData);
      
      if (result.success) {
        // Refresh stats after successful capture
        await getStats();
        return true;
      } else {
        setError(result.error || 'Nieznany błąd');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieoczekiwany błąd';
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStats = async (): Promise<void> => {
    try {
      const emailStats = await emailService.getEmailStats();
      setStats(emailStats);
    } catch (err) {
      console.error('Error fetching email stats:', err);
      setError('Błąd podczas pobierania statystyk');
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    isSubmitting,
    error,
    stats,
    captureEmail,
    getStats,
    clearError
  };
}
