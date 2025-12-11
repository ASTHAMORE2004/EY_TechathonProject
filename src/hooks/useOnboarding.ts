import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ONBOARDING_STORAGE_KEY = 'tata_capital_onboarding';

interface OnboardingState {
  hasAgreedToPrivacy: boolean;
  hasCompletedTour: boolean;
  agreedAt?: string;
  tourCompletedAt?: string;
}

export function useOnboarding(userId?: string) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    hasAgreedToPrivacy: false,
    hasCompletedTour: false,
  });

  // Load onboarding state
  useEffect(() => {
    const loadOnboardingState = () => {
      // Check localStorage first for quick access
      const storedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      
      if (storedState) {
        const parsed = JSON.parse(storedState) as OnboardingState;
        setOnboardingState(parsed);
        
        // If user hasn't agreed to privacy, show the modal
        if (!parsed.hasAgreedToPrivacy) {
          setShowPrivacyModal(true);
        } else if (!parsed.hasCompletedTour) {
          // If agreed but hasn't completed tour, show tour
          setShowTour(true);
        }
      } else {
        // First time user - show privacy modal
        setShowPrivacyModal(true);
      }
      
      setIsLoading(false);
    };

    // Small delay to ensure app is mounted
    const timer = setTimeout(loadOnboardingState, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  // Handle privacy agreement
  const handlePrivacyAgree = () => {
    const newState: OnboardingState = {
      ...onboardingState,
      hasAgreedToPrivacy: true,
      agreedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    setOnboardingState(newState);
    setShowPrivacyModal(false);
    
    // Show tour after privacy agreement
    if (!newState.hasCompletedTour) {
      setTimeout(() => setShowTour(true), 300);
    }
  };

  // Handle tour completion
  const handleTourComplete = () => {
    const newState: OnboardingState = {
      ...onboardingState,
      hasCompletedTour: true,
      tourCompletedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    setOnboardingState(newState);
    setShowTour(false);
  };

  // Handle tour skip
  const handleTourSkip = () => {
    handleTourComplete(); // Treat skip as completion
  };

  // Reset onboarding (for testing)
  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setOnboardingState({
      hasAgreedToPrivacy: false,
      hasCompletedTour: false,
    });
    setShowPrivacyModal(true);
  };

  return {
    showPrivacyModal,
    showTour,
    isLoading,
    onboardingState,
    handlePrivacyAgree,
    handleTourComplete,
    handleTourSkip,
    resetOnboarding,
  };
}
