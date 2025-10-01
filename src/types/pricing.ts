export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly?: number;
    yearly?: number;
    oneTime?: number;
  };
  credits: number;
  period: 'one-time' | 'monthly' | 'yearly';
  priceId?: string; // Stripe Price ID
  mode?: 'payment' | 'subscription';
  currency?: string;
  popular?: boolean;
  bestValue?: boolean;
  features?: PricingFeature[];
  cta?: {
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  savings?: string;
  originalPrice?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}
