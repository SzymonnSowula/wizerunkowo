import React from 'react';
import { AlertCircle, Crown, Zap, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserLimits } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

interface GenerationLimitsProps {
  onUpgrade?: () => void;
  className?: string;
}

export default function GenerationLimits({ onUpgrade, className = '' }: GenerationLimitsProps) {
  const { user, userLimits } = useAuth();

  if (!user || !userLimits) {
    return null;
  }

  const canGenerate = userLimits.canGenerate;
  const isAtDailyLimit = userLimits.dailyGenerationsUsed >= userLimits.dailyGenerationsLimit;
  const isOutOfCredits = userLimits.creditsRemaining === 0;

  if (canGenerate) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <Zap className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Możesz wygenerować {userLimits.creditsRemaining} {userLimits.creditsRemaining === 1 ? 'zdjęcie' : 'zdjęć'}.
          {userLimits.dailyGenerationsUsed > 0 && (
            <span className="block mt-1 text-sm">
              Dzisiaj użyto: {userLimits.dailyGenerationsUsed}/{userLimits.dailyGenerationsLimit}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isOutOfCredits) {
    return (
      <Card className={`border-orange-200 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            Brak kredytów
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-700">
            Wykorzystałeś wszystkie dostępne kredyty. Kup pakiet aby kontynuować generowanie zdjęć.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Kup kredyty
            </Button>
            {onUpgrade && (
              <Button variant="outline" onClick={onUpgrade}>
                Zobacz plany
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAtDailyLimit) {
    return (
      <Card className={`border-blue-200 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Clock className="w-5 h-5" />
            Osiągnięto dzienny limit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Osiągnąłeś dzienny limit generowań ({userLimits.dailyGenerationsLimit}). 
            Spróbuj ponownie jutro lub przejdź na wyższy plan.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Przejdź na Premium
            </Button>
            {onUpgrade && (
              <Button variant="outline" onClick={onUpgrade}>
                Zobacz plany
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Alert className={`border-gray-200 bg-gray-50 ${className}`}>
      <AlertCircle className="h-4 w-4 text-gray-600" />
      <AlertDescription className="text-gray-800">
        Nie możesz generować zdjęć w tej chwili.
      </AlertDescription>
    </Alert>
  );
}
