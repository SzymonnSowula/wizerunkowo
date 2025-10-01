import React from 'react';
import { Crown, Zap, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserLimits } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

interface UserLimitsDisplayProps {
  className?: string;
  showUpgradeButton?: boolean;
}

export default function UserLimitsDisplay({ 
  className = '', 
  showUpgradeButton = true 
}: UserLimitsDisplayProps) {
  const { user, userLimits } = useAuth();

  if (!user || !userLimits) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'free':
        return <Zap className="w-4 h-4" />;
      case 'premium':
        return <Crown className="w-4 h-4" />;
      case 'pro':
        return <Crown className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'Bezpłatny';
      case 'premium':
        return 'Premium';
      case 'pro':
        return 'Pro';
      default:
        return 'Bezpłatny';
    }
  };

  const canGenerate = userLimits.canGenerate;
  const isNearLimit = userLimits.creditsRemaining <= 2;
  const isAtDailyLimit = userLimits.dailyGenerationsUsed >= userLimits.dailyGenerationsLimit;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getTierIcon(userLimits.subscriptionTier)}
            {getTierName(userLimits.subscriptionTier)}
          </CardTitle>
          <Badge className={getTierColor(userLimits.subscriptionTier)}>
            {getTierName(userLimits.subscriptionTier)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Credits Remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Pozostałe kredyty</span>
          </div>
          <span className={`font-bold ${isNearLimit ? 'text-orange-600' : 'text-primary'}`}>
            {userLimits.creditsRemaining}
          </span>
        </div>

        {/* Daily Usage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Dzisiejsze generowania</span>
          </div>
          <span className={`font-bold ${isAtDailyLimit ? 'text-red-600' : 'text-foreground'}`}>
            {userLimits.dailyGenerationsUsed}/{userLimits.dailyGenerationsLimit}
          </span>
        </div>

        {/* Status Message */}
        {!canGenerate && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <div className="text-sm">
                {userLimits.creditsRemaining === 0 ? (
                  <p className="text-orange-800">
                    Brak kredytów. Kup pakiet aby kontynuować.
                  </p>
                ) : isAtDailyLimit ? (
                  <p className="text-orange-800">
                    Osiągnięto dzienny limit. Spróbuj ponownie jutro.
                  </p>
                ) : (
                  <p className="text-orange-800">
                    Nie możesz generować zdjęć w tej chwili.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        {showUpgradeButton && userLimits.subscriptionTier === 'free' && (
          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold"
            onClick={() => window.location.href = '/pricing'}
          >
            <Crown className="w-4 h-4 mr-2" />
            Przejdź na Premium
          </Button>
        )}

        {/* Next Reset Info */}
        {userLimits.nextResetDate && (
          <div className="text-xs text-muted-foreground text-center">
            Limity resetują się: {new Date(userLimits.nextResetDate).toLocaleDateString('pl-PL')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
