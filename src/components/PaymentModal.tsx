"use client";
import React, { useState } from 'react';
import { CreditCard, Smartphone, Globe, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { checkoutService } from '@/services/checkoutService';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
    credits: number;
    priceId?: string; // Stripe Price ID
    mode?: 'payment' | 'subscription';
  };
  onPaymentSuccess: () => void;
}

const paymentMethods = [
  {
    id: 'stripe',
    name: 'Karta płatnicza',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    available: true
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: Smartphone,
    description: 'Szybka płatność przez iPhone',
    available: true
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: Smartphone,
    description: 'Płatność przez Google',
    available: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Globe,
    description: 'Bezpieczna płatność online',
    available: true
  }
];

export default function PaymentModal({ isOpen, onClose, plan, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!plan.priceId) {
      setPaymentError('Brak konfiguracji ceny dla tego planu');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      const { error } = await checkoutService.redirectToCheckout({
        priceId: plan.priceId,
        mode: plan.mode || 'payment',
        userId: user?.id,
        metadata: {
          plan_name: plan.name,
          credits: plan.credits.toString(),
        },
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (error) {
        setPaymentError(error);
      }
      // If no error, user will be redirected to Stripe Checkout
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Wystąpił błąd podczas inicjowania płatności');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Potwierdzenie płatności
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Plan Summary */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.credits} zdjęć</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{plan.price} zł</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Bezpieczna płatność przez Stripe</p>
                <p className="text-sm text-blue-700">
                  Wszystkie karty płatnicze, Apple Pay, Google Pay
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {paymentError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-red-600">⚠️</div>
                <p className="text-sm text-red-800">{paymentError}</p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800">
                Płatność jest bezpieczna i szyfrowana SSL. Przekierujemy Cię do Stripe Checkout.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Anuluj
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !plan.priceId}
              className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Przekierowywanie...
                </>
              ) : (
                `Zapłać ${plan.price} zł`
              )}
            </Button>
          </div>

          {!plan.priceId && (
            <p className="text-sm text-red-600 text-center">
              Ten plan nie ma skonfigurowanej ceny Stripe
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
