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

export interface EmailStats {
  total_captures: number;
  recent_captures: number;
  sources: Record<string, number>;
}

export type EmailSource = 'upsell_banner' | 'newsletter' | 'contact_form' | 'pricing_page';
export type EmailTemplate = 'welcome' | 'discount' | 'upgrade_reminder' | 'trial_ending';

export interface EmailCaptureResponse {
  success: boolean;
  error?: string;
  discount_code?: string;
}

export interface EmailNotificationResponse {
  success: boolean;
  error?: string;
  message_id?: string;
}
