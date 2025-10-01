import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkoutService } from '@/services/checkoutService';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUserLimits } = useAuth();
  const [checkoutSession, setCheckoutSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Get checkout session details from Stripe
      checkoutService.getCheckoutSession(sessionId)
        .then((session) => {
          setCheckoutSession(session);
          // Refresh user limits after successful payment
          refreshUserLimits();
        })
        .catch((err) => {
          console.error('Error getting checkout session:', err);
          setError('Nie udało się pobrać szczegółów płatności');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams, refreshUserLimits]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Weryfikacja płatności...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full mt-4"
            >
              Wróć do cennika
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Płatność zakończona pomyślnie!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Twoja płatność została przetworzona pomyślnie. Otrzymasz potwierdzenie na email.
            </AlertDescription>
          </Alert>

          {checkoutSession && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Szczegóły płatności</span>
              </div>
              <p className="text-sm text-gray-600">
                ID sesji: {checkoutSession.id}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="text-green-600 font-medium">
                  {checkoutSession.payment_status === 'paid' ? 'Zakończona' : checkoutSession.payment_status}
                </span>
              </p>
              {checkoutSession.amount_total && (
                <p className="text-sm text-gray-600">
                  Kwota: {(checkoutSession.amount_total / 100).toFixed(2)} {checkoutSession.currency?.toUpperCase()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Co dalej?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Twoje kredyty zostały dodane do konta
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Możesz teraz generować profesjonalne zdjęcia
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Otrzymasz potwierdzenie na email
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Strona główna
            </Button>
            <Button
              onClick={() => navigate('/generator')}
              className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500"
            >
              Generuj zdjęcia
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

