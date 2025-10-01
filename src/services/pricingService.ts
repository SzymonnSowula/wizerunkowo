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

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('Supabase URL is not defined');
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/get-pricing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch pricing: ${error}`);
      }

      const data = await response.json();
      const plans = data.plans as PricingPlan[];

      // Add marketing features and CTAs
      const enhancedPlans = plans.map(plan => this.enhancePlanWithMarketing(plan));

      // Cache the results
      this.cachedPlans = enhancedPlans;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return enhancedPlans;
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // Return fallback plans if API fails
      return this.getFallbackPlans();
    }
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
        price: { oneTime: 29 },
        credits: 5,
        period: 'one-time',
        priceId: 'price_5_photos',
        mode: 'payment',
        currency: 'PLN',
        originalPrice: 35,
        savings: 'Oszczędzasz 6 zł (17%)',
      },
      {
        id: 'fallback-10',
        name: 'Pakiet 10 Zdjęć',
        description: 'Najpopularniejszy',
        price: { oneTime: 49 },
        credits: 10,
        period: 'one-time',
        priceId: 'price_10_photos',
        mode: 'payment',
        currency: 'PLN',
        originalPrice: 70,
        savings: 'Oszczędzasz 21 zł (30%)',
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
