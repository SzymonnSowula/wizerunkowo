import { supabase } from '@/integrations/supabase/client';

// @ts-ignore - Force TypeScript to recognize updated Supabase types

export interface EmailCaptureData {
  email: string;
  source: 'upsell_banner' | 'newsletter' | 'contact_form' | 'pricing_page';
  campaign?: string;
  discount_code?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface EmailNotificationData {
  email: string;
  subject: string;
  template: 'welcome' | 'discount' | 'upgrade_reminder' | 'trial_ending';
  data?: Record<string, any>;
}

class EmailService {
  /**
   * Capture email address for marketing purposes
   */
  async captureEmail(data: EmailCaptureData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate email format
      if (!this.isValidEmail(data.email)) {
        return { success: false, error: 'Nieprawidłowy format adresu email' };
      }

      // Check if email already exists
      const { data: existingEmail, error: checkError } = await supabase
        .from('email_captures')
        .select('id')
        .eq('email', data.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing email:', checkError);
        return { success: false, error: 'Błąd podczas sprawdzania adresu email' };
      }

      if (existingEmail) {
        // Update existing record with new source
        // First get the current capture_count
        const { data: currentData, error: fetchError } = await supabase
          .from('email_captures')
          .select('capture_count')
          .eq('email', data.email)
          .single();

        if (fetchError) {
          console.error('Error fetching current capture count:', fetchError);
          return { success: false, error: 'Błąd podczas pobierania danych' };
        }

        if (!currentData) {
          console.error('No current data found for email:', data.email);
          return { success: false, error: 'Brak danych dla adresu email' };
        }

        const { error: updateError } = await (supabase
          .from('email_captures')
          .update({
            source: data.source,
            campaign: data.campaign,
            discount_code: data.discount_code,
            updated_at: new Date().toISOString(),
            capture_count: (currentData.capture_count ?? 0) + 1
          }) as any)
          .eq('email', data.email);

        if (updateError) {
          console.error('Error updating email:', updateError);
          return { success: false, error: 'Błąd podczas aktualizacji adresu email' };
        }

        return { success: true };
      }

      // Insert new email capture record
      const { error: insertError } = await (supabase
        .from('email_captures')
        .insert({
          email: data.email,
          source: data.source,
          campaign: data.campaign,
          discount_code: data.discount_code,
          user_agent: data.user_agent || navigator.userAgent,
          ip_address: data.ip_address,
          captured_at: new Date().toISOString(),
          capture_count: 1
        }) as any);

      if (insertError) {
        console.error('Error inserting email:', insertError);
        return { success: false, error: 'Błąd podczas zapisywania adresu email' };
      }

      // Send welcome email if this is the first capture
      if (data.source === 'upsell_banner' && data.discount_code) {
        await this.sendEmailNotification({
          email: data.email,
          subject: '🎁 Twoja zniżka 50% jest gotowa!',
          template: 'discount',
          data: {
            discount_code: data.discount_code,
            discount_percentage: 50
          }
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Email capture error:', error);
      return { success: false, error: 'Nieoczekiwany błąd podczas przetwarzania' };
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification(data: EmailNotificationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Log email notification to database
      const { error: logError } = await (supabase
        .from('email_notifications')
        .insert({
          email: data.email,
          subject: data.subject,
          template: data.template,
          data: data.data,
          sent_at: new Date().toISOString(),
          status: 'pending'
        }) as any);

      if (logError) {
        console.error('Error logging email notification:', logError);
        return { success: false, error: 'Błąd podczas logowania powiadomienia' };
      }

      // In a real implementation, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Resend
      // - Supabase Edge Functions with email service

      // For now, we'll simulate the email sending
      console.log('Email notification queued:', {
        to: data.email,
        subject: data.subject,
        template: data.template,
        data: data.data
      });

      // Update status to sent (in real implementation, this would be done by the email service webhook)
      setTimeout(async () => {
        await (supabase
          .from('email_notifications')
          .update({ status: 'sent' })
          .eq('email', data.email)
          .eq('template', data.template)
          .order('sent_at', { ascending: false })
          .limit(1) as any);
      }, 1000);

      return { success: true };
    } catch (error) {
      console.error('Email notification error:', error);
      return { success: false, error: 'Błąd podczas wysyłania powiadomienia' };
    }
  }

  /**
   * Generate discount code
   */
  generateDiscountCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'DISCOUNT';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get email capture statistics
   */
  async getEmailStats(): Promise<{
    total_captures: number;
    recent_captures: number;
    sources: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('email_captures')
        .select('source, captured_at');

      if (error) {
        console.error('Error fetching email stats:', error);
        return { total_captures: 0, recent_captures: 0, sources: {} };
      }

      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const total_captures = data.length;
      const recent_captures = data.filter(
        (item: any) => new Date(item.captured_at) > last24Hours
      ).length;

      const sources = data.reduce((acc: Record<string, number>, item: any) => {
        acc[item.source] = (acc[item.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total_captures, recent_captures, sources };
    } catch (error) {
      console.error('Email stats error:', error);
      return { total_captures: 0, recent_captures: 0, sources: {} };
    }
  }
}

export const emailService = new EmailService();
