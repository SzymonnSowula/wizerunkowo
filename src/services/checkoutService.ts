// Stripe integration for direct API calls

export interface CheckoutSessionData {
  priceId: string;
  mode?: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
  userId?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export class CheckoutService {
  /**
   * Create a checkout session directly with Stripe
   */
  async createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResponse> {
    const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('VITE_STRIPE_SECRET_KEY is required');
    }

    // Create checkout session directly with Stripe API
    const params = new URLSearchParams();
    params.append('mode', data.mode || 'payment');
    params.append('line_items[0][price]', data.priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('success_url', data.successUrl || `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', data.cancelUrl || `${window.location.origin}/pricing`);
    
    // Add metadata as individual key-value pairs
    if (data.userId) {
      params.append('metadata[user_id]', data.userId);
    }
    if (data.metadata?.plan_name) {
      params.append('metadata[plan_name]', data.metadata.plan_name);
    }
    if (data.metadata?.credits) {
      params.append('metadata[credits]', data.metadata.credits);
    }
    params.append('allow_promotion_codes', 'true');
    params.append('billing_address_collection', 'auto');
    params.append('customer_creation', 'if_required');

    if (data.mode === 'payment') {
      params.append('payment_intent_data[metadata][user_id]', data.userId || '');
      if (data.metadata?.plan_name) {
        params.append('payment_intent_data[metadata][plan_name]', data.metadata.plan_name);
      }
      if (data.metadata?.credits) {
        params.append('payment_intent_data[metadata][credits]', data.metadata.credits);
      }
    } else if (data.mode === 'subscription') {
      params.append('subscription_data[metadata][user_id]', data.userId || '');
      if (data.metadata?.plan_name) {
        params.append('subscription_data[metadata][plan_name]', data.metadata.plan_name);
      }
      if (data.metadata?.credits) {
        params.append('subscription_data[metadata][credits]', data.metadata.credits);
      }
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const session = await response.json();
    return {
      sessionId: session.id,
      url: session.url
    };
  }

  /**
   * Redirect to Stripe Checkout
   */
  async redirectToCheckout(data: CheckoutSessionData): Promise<{ error?: string }> {
    try {
      const { sessionId, url } = await this.createCheckoutSession(data);
      
      if (url) {
        // Direct redirect to Stripe Checkout URL
        window.location.href = url;
        return {};
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get checkout session details directly from Stripe
   */
  async getCheckoutSession(sessionId: string): Promise<any> {
    const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('VITE_STRIPE_SECRET_KEY is required');
    }

    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    return response.json();
  }
}

export const checkoutService = new CheckoutService();
