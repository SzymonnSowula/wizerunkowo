import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type User = Tables<'users'>;
export type Subscription = Tables<'subscriptions'>;
export type UsageLog = Tables<'usage_logs'>;

export interface UserLimits {
  canGenerate: boolean;
  creditsRemaining: number;
  dailyGenerationsUsed: number;
  dailyGenerationsLimit: number;
  subscriptionTier: 'free' | 'premium' | 'pro';
  nextResetDate?: string;
}

export class UserService {
  /**
   * Get or create user profile
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      // First try to get existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingUser && !fetchError) {
        return existingUser;
      }

      // If no user exists, create one
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error('User not authenticated');
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: authUser.user.email!,
          subscription_tier: 'free',
          credits_remaining: 1, // Free trial: 1 generation
          daily_generations_used: 0,
        } as any)
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }

      return newUser;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Get user limits and subscription status
   */
  async getUserLimits(userId: string): Promise<UserLimits> {
    const profile = await this.getUserProfile(userId);
    
    if (!profile) {
      return {
        canGenerate: false,
        creditsRemaining: 0,
        dailyGenerationsUsed: 0,
        dailyGenerationsLimit: 0,
        subscriptionTier: 'free',
      };
    }

    // Check if daily limit needs to be reset
    const today = new Date().toDateString();
    const lastGenerationDate = profile.last_generation_date 
      ? new Date(profile.last_generation_date).toDateString()
      : null;

    let dailyGenerationsUsed = profile.daily_generations_used;
    if (lastGenerationDate !== today) {
      // Reset daily counter if it's a new day
      dailyGenerationsUsed = 0;
      await this.resetDailyUsage(userId);
    }

    // Define limits based on subscription tier
    const limits = this.getSubscriptionLimits(profile.subscription_tier);
    
    const canGenerate = profile.credits_remaining > 0 && 
                       dailyGenerationsUsed < limits.dailyLimit;

    return {
      canGenerate,
      creditsRemaining: profile.credits_remaining,
      dailyGenerationsUsed,
      dailyGenerationsLimit: limits.dailyLimit,
      subscriptionTier: profile.subscription_tier,
      nextResetDate: this.getNextResetDate(),
    };
  }

  /**
   * Get subscription limits based on tier
   */
  private getSubscriptionLimits(tier: 'free' | 'premium' | 'pro') {
    switch (tier) {
      case 'free':
        return { dailyLimit: 1, monthlyCredits: 1 };
      case 'premium':
        return { dailyLimit: 10, monthlyCredits: 50 };
      case 'pro':
        return { dailyLimit: 50, monthlyCredits: 300 };
      default:
        return { dailyLimit: 1, monthlyCredits: 1 };
    }
  }

  /**
   * Reset daily usage counter
   */
  private async resetDailyUsage(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({
          daily_generations_used: 0,
          last_generation_date: new Date().toISOString(),
        } as any)
        .eq('id', userId);
    } catch (error) {
      console.error('Error resetting daily usage:', error);
    }
  }

  /**
   * Use credits for generation
   */
  async useCredits(userId: string, creditsUsed: number = 1, metadata?: any): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        return false;
      }

      // Check if user can generate
      const limits = await this.getUserLimits(userId);
      if (!limits.canGenerate) {
        return false;
      }

      // Update credits and daily usage
      const { error: updateError } = await supabase
        .from('users')
        .update({
          credits_remaining: profile.credits_remaining - creditsUsed,
          daily_generations_used: profile.daily_generations_used + 1,
          last_generation_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return false;
      }

      // Log usage
      await this.logUsage(userId, 'generation', creditsUsed, metadata);

      return true;
    } catch (error) {
      console.error('Error using credits:', error);
      return false;
    }
  }

  /**
   * Add credits to user account
   */
  async addCredits(userId: string, credits: number, source: string = 'purchase'): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        return false;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          credits_remaining: profile.credits_remaining + credits,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId);

      if (updateError) {
        console.error('Error adding credits:', updateError);
        return false;
      }

      // Log usage
      await this.logUsage(userId, 'generation', 0, { 
        action: 'credits_added', 
        credits, 
        source 
      });

      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      return false;
    }
  }

  /**
   * Update subscription tier
   */
  async updateSubscriptionTier(userId: string, tier: 'free' | 'premium' | 'pro'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          subscription_tier: tier,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId);

      if (error) {
        console.error('Error updating subscription tier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating subscription tier:', error);
      return false;
    }
  }

  /**
   * Log usage activity
   */
  private async logUsage(
    userId: string, 
    action: 'generation' | 'download' | 'preview', 
    creditsUsed: number, 
    metadata?: any
  ): Promise<void> {
    try {
      await supabase
        .from('usage_logs')
        .insert({
          user_id: userId,
          action,
          credits_used: creditsUsed,
          metadata: metadata || null,
        } as any);
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }

  /**
   * Get next reset date for daily limits
   */
  private getNextResetDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }

  /**
   * Get user usage statistics
   */
  async getUserStats(userId: string): Promise<{
    totalGenerations: number;
    creditsUsed: number;
    creditsRemaining: number;
    subscriptionTier: string;
  }> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        return {
          totalGenerations: 0,
          creditsUsed: 0,
          creditsRemaining: 0,
          subscriptionTier: 'free',
        };
      }

      const { data: usageLogs } = await supabase
        .from('usage_logs')
        .select('credits_used')
        .eq('user_id', userId)
        .eq('action', 'generation');

      const totalCreditsUsed = usageLogs?.reduce((sum, log) => sum + log.credits_used, 0) || 0;

      return {
        totalGenerations: usageLogs?.length || 0,
        creditsUsed: totalCreditsUsed,
        creditsRemaining: profile.credits_remaining,
        subscriptionTier: profile.subscription_tier,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalGenerations: 0,
        creditsUsed: 0,
        creditsRemaining: 0,
        subscriptionTier: 'free',
      };
    }
  }
}

export const userService = new UserService();
