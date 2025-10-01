"use client";
import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Crown, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavBar from '@/layout/NavBar';
import { PricingPlan } from '@/types/pricing';
import PaymentModal from '@/components/PaymentModal';
import { useAuth } from '@/contexts/AuthContext';
import { pricingService } from '@/services/pricingService';

// Free trial plan (static)
const freeTrialPlan: PricingPlan = {
  id: 'free-trial',
  name: 'Bezpłatny Test',
  description: 'Wypróbuj za darmo',
  price: { oneTime: 0 },
  credits: 1,
  period: 'one-time',
  priceId: '',
  mode: 'payment',
  currency: 'PLN',
  features: [
    { text: '1 zdjęcie testowe', included: true },
    { text: 'Wszystkie style AI', included: true },
    { text: 'Jakość HD', included: true },
    { text: 'Bez zobowiązań', included: true },
    { text: 'Wsparcie email', included: true }
  ],
  cta: { text: 'Zacznij za darmo', variant: 'outline' }
};

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'one-time' | 'monthly' | 'yearly'>('one-time');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user, userLimits } = useAuth();

  // Load pricing plans from Stripe
  useEffect(() => {
    const loadPricingPlans = async () => {
      try {
        setLoading(true);
        const plans = await pricingService.getPricingPlans();
        // Add free trial plan at the beginning
        setPricingPlans([freeTrialPlan, ...plans]);
      } catch (err) {
        console.error('Error loading pricing plans:', err);
        setError('Nie udało się załadować cen. Spróbuj ponownie.');
        // Fallback to free trial only
        setPricingPlans([freeTrialPlan]);
      } finally {
        setLoading(false);
      }
    };

    loadPricingPlans();
  }, []);

  const filteredPlans = pricingPlans.filter(plan => {
    if (billingPeriod === 'one-time') {
      return plan.period === 'one-time';
    }
    return plan.period === billingPeriod;
  });

  const handlePlanSelect = (plan: PricingPlan) => {
    if (plan.id === 'free-trial') {
      // Handle free trial - redirect to generator or show message
      if (user) {
        // User is logged in, redirect to generator
        window.location.href = '/generator';
      } else {
        // User not logged in, redirect to signup
        window.location.href = '/signup';
      }
      return;
    }

    if (!user) {
      // User not logged in, redirect to signup
      window.location.href = '/signup';
      return;
    }

    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
    // Refresh user limits to show updated credits
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Ładowanie cen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8">
              <Crown className="w-4 h-4" />
              ⭐ Najlepsza oferta w branży
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Wybierz Swój
              <span className="bg-gradient-to-r from-pink-200 to-blue-200 bg-clip-text text-transparent block">
                Plan Cenowy
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Profesjonalne zdjęcia AI za ułamek ceny fotografa. Zacznij za darmo!
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-12">
          <div className="bg-muted/50 p-1 rounded-xl flex">
            {[
              { key: 'one-time', label: 'Pakiety jednorazowe', icon: Zap },
              { key: 'monthly', label: 'Miesięczna', icon: Sparkles },
              { key: 'yearly', label: 'Roczna (20% taniej)', icon: Star }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setBillingPeriod(key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  billingPeriod === key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary shadow-elegant' : ''
              } ${plan.bestValue ? 'ring-2 ring-yellow-400 shadow-elegant' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Najpopularniejszy
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Najlepsza oferta
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price.oneTime || plan.price.monthly || plan.price.yearly} {plan.currency || 'zł'}
                    </span>
                    {plan.period === 'monthly' && <span className="text-muted-foreground">/mies.</span>}
                    {plan.period === 'yearly' && <span className="text-muted-foreground">/rok</span>}
                  </div>
                  {plan.savings && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                  {plan.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice} {plan.currency || 'zł'}
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    {plan.credits} {plan.credits === 1 ? 'zdjęcie' : 'zdjęć'}
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        feature.included ? 'text-green-500' : 'text-muted-foreground'
                      }`} />
                      <span className={`text-sm ${
                        feature.included 
                          ? feature.highlight 
                            ? 'text-primary font-medium' 
                            : 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-6 ${
                    plan.cta?.variant === 'primary' 
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition' 
                      : ''
                  }`}
                  variant={plan.cta?.variant as any || 'outline'}
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.cta?.text || 'Wybierz plan'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Często zadawane pytania</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Czy mogę anulować subskrypcję w każdej chwili?",
                a: "Tak! Możesz anulować subskrypcję w każdej chwili bez żadnych opłat."
              },
              {
                q: "Co się stanie z niewykorzystanymi zdjęciami?",
                a: "Zdjęcia z pakietów jednorazowych nie wygasają. W subskrypcji miesięcznej resetują się co miesiąc."
              },
              {
                q: "Jakie style zdjęć są dostępne?",
                a: "LinkedIn, CV, Corporate, Startup, Casual i wiele więcej. Dodajemy nowe style co tydzień!"
              },
              {
                q: "Czy otrzymam licencję komercyjną?",
                a: "Tak! Wszystkie plany zawierają licencję komercyjną do użytku biznesowego."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price.oneTime || selectedPlan.price.monthly || selectedPlan.price.yearly || 0,
            credits: selectedPlan.credits,
            priceId: selectedPlan.priceId,
            mode: selectedPlan.mode,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
