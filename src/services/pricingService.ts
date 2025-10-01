export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    oneTime?: number;
    monthly?: number;
    yearly?: number;
  };
  credits: number;
  period: 'one-time' | 'monthly' | 'yearly';
  priceId: string;
  mode: 'payment' | 'subscription';
  currency: string;
  originalPrice?: number;
  savings?: string;
  popular?: boolean;
  bestValue?: boolean;
  features?: Array<{
    text: string;
    included: boolean;
    highlight?: boolean;
  }>;
  cta?: {
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
}

export class PricingService {
  private cachedPlans: PricingPlan[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getPricingPlans(): Promise<PricingPlan[]> {
    // Return cached data if still valid
    if (this.cachedPlans && Date.now() < this.cacheExpiry) {
      return this.cachedPlans;
    }

    try {
      // Try to fetch from Stripe API directly
      const plans = await this.fetchPlansFromStripe();
      
      if (plans && plans.length > 0) {
        // Add marketing features and CTAs
        const enhancedPlans = plans.map(plan => this.enhancePlanWithMarketing(plan));

        // Cache the results
        this.cachedPlans = enhancedPlans;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;

        return enhancedPlans;
      } else {
        throw new Error('No plans found from Stripe');
      }
    } catch (error) {
      console.error('Error fetching pricing plans from Stripe:', error);
      // Return fallback plans if API fails
      return this.getFallbackPlans();
    }
  }

  private async fetchPlansFromStripe(): Promise<PricingPlan[]> {
    const stripeSecretKey = import.meta.env.VITE_STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('VITE_STRIPE_SECRET_KEY is required');
    }

    const response = await fetch('https://api.stripe.com/v1/prices?active=true&expand[]=data.product', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const data = await response.json();
    const prices = data.data;

    // Map prices to our plan structure
    const pricingPlans = prices.map((price: any) => {
      const product = price.product;
      const amount = price.unit_amount / 100; // Convert from cents
      const currency = price.currency.toUpperCase();
      
      // Determine plan type based on product name or metadata
      let planType = 'one-time';
      let credits = 1;
      
      if (product.name.includes('5') || product.metadata?.credits === '5') {
        credits = 5;
      } else if (product.name.includes('15') || product.metadata?.credits === '15') {
        credits = 15;
      } else if (product.name.includes('25') || product.metadata?.credits === '25') {
        credits = 25;
      } else if (product.name.includes('50') || product.metadata?.credits === '50') {
        credits = 50;
      } else if (product.name.includes('600') || product.metadata?.credits === '600') {
        credits = 600;
      }

      if (price.recurring) {
        planType = price.recurring.interval === 'year' ? 'yearly' : 'monthly';
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: {
          oneTime: planType === 'one-time' ? amount : undefined,
          monthly: planType === 'monthly' ? amount : undefined,
          yearly: planType === 'yearly' ? amount : undefined,
        },
        credits: credits,
        period: planType,
        priceId: price.id,
        mode: price.recurring ? 'subscription' : 'payment',
        currency: currency,
        // Marketing prices (hardcoded for visual effect)
        originalPrice: planType === 'one-time' ? Math.round(amount * 1.2) : undefined,
        savings: planType === 'one-time' ? `Oszczędzasz ${Math.round(amount * 0.2)} zł` : undefined,
      };
    });

    return pricingPlans;
  }

  private enhancePlanWithMarketing(plan: PricingPlan): PricingPlan {
    const features = this.getFeaturesForPlan(plan);
    const cta = this.getCtaForPlan(plan);
    
    return {
      ...plan,
      features,
      cta,
      popular: plan.credits === 10 && plan.period === 'one-time',
      bestValue: plan.credits === 600 && plan.period === 'yearly',
    };
  }

  private getFeaturesForPlan(plan: PricingPlan): Array<{ text: string; included: boolean; highlight?: boolean }> {
    const baseFeatures: Array<{ text: string; included: boolean; highlight?: boolean }> = [
      { text: `${plan.credits} profesjonalnych zdjęć`, included: true },
      { text: 'Wszystkie style AI', included: true },
      { text: 'Jakość 4K', included: true },
      { text: 'Licencja komercyjna', included: true },
    ];

    if (plan.credits >= 10) {
      baseFeatures.push({ text: 'Priorytetowe przetwarzanie', included: true });
    }

    if (plan.credits >= 25) {
      baseFeatures.push({ text: 'Retusz + kolorowanie', included: true });
    }

    if (plan.period === 'yearly') {
      baseFeatures.push({ text: '20% oszczędności', included: true, highlight: true });
    }

    return baseFeatures;
  }

  private getCtaForPlan(plan: PricingPlan) {
    if (plan.period === 'one-time') {
      return {
        text: `Kup za ${plan.price.oneTime} ${plan.currency}`,
        variant: 'primary' as const,
      };
    } else if (plan.period === 'monthly') {
      return {
        text: `Rozpocznij subskrypcję`,
        variant: 'secondary' as const,
      };
    } else {
      return {
        text: `Zapisz 20% rocznie`,
        variant: 'primary' as const,
      };
    }
  }

  private getFallbackPlans(): PricingPlan[] {
    return [
      {
        id: 'fallback-5',
        name: 'Pakiet 5 Zdjęć',
        description: 'Idealny na start',
        price: { oneTime: 7.99 },
        credits: 5,
        period: 'one-time',
        priceId: 'price_1SDQglExyPEvRmdlbsERommG',
        mode: 'payment',
        currency: 'PLN',
        originalPrice: 10,
        savings: 'Oszczędzasz 2.01 zł (20%)',
      },
      {
        id: 'fallback-15',
        name: 'Pakiet 15 Zdjęć',
        description: 'Najpopularniejszy',
        price: { oneTime: 12.99 },
        credits: 15,
        period: 'one-time',
        priceId: 'price_1SDWWwExyPEvRmdle0kw4gdq',
        mode: 'payment',
        currency: 'PLN',
        originalPrice: 18,
        savings: 'Oszczędzasz 5.01 zł (28%)',
        popular: true,
      },
    ];
  }

  clearCache() {
    this.cachedPlans = null;
    this.cacheExpiry = 0;
  }
}

export const pricingService = new PricingService();
