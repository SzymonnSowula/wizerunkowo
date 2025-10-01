"use client";
import React, { useState } from 'react';
import { Crown, ArrowRight, Star, Zap, Mail, Clock, Users, CheckCircle, X, Gift, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/services/emailService';
import type { EmailCaptureData } from '@/types/email';

interface UpsellBannerProps {
  currentPlan: string;
  suggestedPlan: {
    name: string;
    price: number;
    originalPrice?: number;
    savings: string;
    benefits: string[];
    period: string;
    popular?: boolean;
    limitedTime?: boolean;
  };
  onUpgrade: () => void;
  onEmailCapture?: (email: string) => void;
  type: 'upgrade' | 'trial-to-paid' | 'monthly-to-yearly' | 'email-capture';
  showEmailCapture?: boolean;
  urgencyText?: string;
  socialProof?: {
    userCount: string;
    rating: number;
    testimonials: number;
  };
}

export default function UpsellBanner({ 
  currentPlan, 
  suggestedPlan, 
  onUpgrade,
  onEmailCapture,
  type,
  showEmailCapture = false,
  urgencyText,
  socialProof = {
    userCount: "10,000+",
    rating: 4.9,
    testimonials: 500
  }
}: UpsellBannerProps) {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(showEmailCapture);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setIsSubmitting(true);
    try {
      // Generate discount code for this campaign
      const discountCode = emailService.generateDiscountCode();
      
      // Prepare email capture data
      const emailData: EmailCaptureData = {
        email: email,
        source: 'upsell_banner',
        campaign: `upsell_${type}`,
        discount_code: discountCode,
        user_agent: navigator.userAgent
      };

      // Capture email using the email service
      const result = await emailService.captureEmail(emailData);
      
      if (result.success) {
        // Call the optional callback
        if (onEmailCapture) {
          onEmailCapture(email);
        }
        
        toast({
          title: "Dziękujemy! 🎉",
          description: `Wysyłamy Ci specjalną ofertę z kodem: ${discountCode}`,
        });
        
        setEmail('');
        setIsEmailValid(false);
        setShowEmailForm(false);
      } else {
        throw new Error(result.error || 'Nieznany błąd');
      }
    } catch (error) {
      console.error('Email capture error:', error);
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się zapisać adresu email. Spróbuj ponownie.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getBannerContent = () => {
    switch (type) {
      case 'trial-to-paid':
        return {
          title: "🎉 Podoba Ci się efekt?",
          subtitle: "Odkryj pełny potencjał AI z profesjonalnym pakietem",
          icon: Star,
          bgColor: "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
          borderColor: "border-green-300/50",
          textColor: "text-white",
          subtextColor: "text-green-100"
        };
      case 'monthly-to-yearly':
        return {
          title: "💰 Oszczędź 20% rocznie!",
          subtitle: "Przejdź na subskrypcję roczną i zapłać mniej",
          icon: Crown,
          bgColor: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
          borderColor: "border-yellow-300/50",
          textColor: "text-white",
          subtextColor: "text-yellow-100"
        };
      case 'email-capture':
        return {
          title: "🎁 Otrzymaj 50% zniżki!",
          subtitle: "Dołącz do tysięcy zadowolonych klientów",
          icon: Gift,
          bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
          borderColor: "border-purple-300/50",
          textColor: "text-white",
          subtextColor: "text-purple-100"
        };
      default:
        return {
          title: "🚀 Uaktualnij swój plan",
          subtitle: "Zdobądź więcej zdjęć i funkcji premium",
          icon: Zap,
          bgColor: "bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500",
          borderColor: "border-purple-300/50",
          textColor: "text-white",
          subtextColor: "text-purple-100"
        };
    }
  };

  const content = getBannerContent();
  const Icon = content.icon;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Urgency Banner */}
      {urgencyText && (
        <div className="bg-red-500 text-white text-center py-2 px-4 rounded-t-lg font-medium animate-pulse">
          <Clock className="w-4 h-4 inline mr-2" />
          {urgencyText}
        </div>
      )}
      
      <Card className={`relative overflow-hidden border-2 ${content.borderColor} shadow-2xl`}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 ${content.bgColor} opacity-90`} />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full animate-bounce" />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full animate-ping" />
        </div>

        <CardContent className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Icon, Text and Social Proof */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${content.textColor} mb-2`}>
                    {content.title}
                  </h3>
                  <p className={`${content.subtextColor} text-lg`}>
                    {content.subtitle}
                  </p>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{socialProof.userCount} użytkowników</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">{socialProof.rating}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{socialProof.testimonials}+ opinii</span>
                </div>
              </div>
            </div>

            {/* Center: Plan Details */}
            <div className="flex-1 text-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-900 text-lg">{suggestedPlan.name}</span>
                  {suggestedPlan.popular && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                      Popularne
                    </Badge>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-center gap-2">
                    {suggestedPlan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {suggestedPlan.originalPrice} zł
                      </span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      {suggestedPlan.price} zł
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">/{suggestedPlan.period}</span>
                </div>
                
                <div className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full inline-block">
                  {suggestedPlan.savings}
                </div>
                
                {suggestedPlan.limitedTime && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-red-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Oferta ograniczona czasowo!
                  </div>
                )}
              </div>
            </div>

            {/* Right: Benefits and CTA */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <h4 className={`font-semibold ${content.textColor} text-lg`}>Co otrzymujesz:</h4>
                {suggestedPlan.benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className={`text-sm ${content.subtextColor}`}>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Email Capture or Direct CTA */}
              {showEmailForm ? (
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Twój adres email"
                      value={email}
                      onChange={handleEmailChange}
                      className="pl-10 bg-white/90 border-white/30"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!isEmailValid || isSubmitting}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-lg hover:scale-105 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-900 border-t-transparent rounded-full" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        Otrzymaj 50% zniżki
                        <Gift className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={onUpgrade}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 shadow-lg hover:scale-105 transition text-lg"
                  >
                    Uaktualnij teraz
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <div className="text-center">
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className={`text-sm ${content.subtextColor} hover:text-white underline transition-colors`}
                    >
                      Lub otrzymaj 50% zniżki przez email
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="text-center">
                <div className={`flex items-center justify-center gap-2 text-xs ${content.subtextColor}`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>Bezpieczna płatność</span>
                  <span>•</span>
                  <span>30-dniowa gwarancja zwrotu</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
