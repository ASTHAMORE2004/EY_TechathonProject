import React, { useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { AgentsSection } from '@/components/landing/AgentsSection';
import { InvestmentSection } from '@/components/landing/InvestmentSection';
import { FinancialLiteracySection } from '@/components/investment/FinancialLiteracySection';
import { LoanComparisonSection } from '@/components/loan/LoanComparisonSection';
import { Footer } from '@/components/landing/Footer';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { KYCVerificationModal } from '@/components/kyc/KYCVerificationModal';
import { InvestmentModal } from '@/components/investment/InvestmentModal';
import { PrivacyAgreementModal } from '@/components/onboarding/PrivacyAgreementModal';
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useOnboarding } from '@/hooks/useOnboarding';
import { X, MessageCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DocumentAnalysis {
  panValid: boolean;
  panNumber?: string;
  aadhaarValid: boolean;
  aadhaarNumber?: string;
  incomeDetails?: {
    monthlyIncome: number;
    employmentType: string;
    employer?: string;
  };
  creditScore1000: number;
  creditFactors: {
    documentAuthenticity: number;
    incomeStability: number;
    identityVerification: number;
    financialHistory: number;
  };
  eligibleAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isInvestmentOpen, setIsInvestmentOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DocumentAnalysis | null>(null);
  const [showManualTour, setShowManualTour] = useState(false);

  // Onboarding state
  const {
    showPrivacyModal,
    showTour,
    isLoading,
    handlePrivacyAgree,
    handleTourComplete,
    handleTourSkip,
    resetOnboarding,
  } = useOnboarding();

  const handleKYCComplete = (analysis: DocumentAnalysis) => {
    setVerificationResult(analysis);
    toast.success(`Credit Score: ${analysis.creditScore1000}/1000 - ${analysis.riskLevel === 'low' ? 'Excellent!' : 'Approved!'}`);
    setIsChatOpen(true);
  };

  const handleFeatureClick = (feature: string) => {
    if (feature === 'KYC Verified') {
      setIsKYCOpen(true);
    } else if (feature === 'Smart Savings') {
      setIsInvestmentOpen(true);
    } else if (feature === '2 Min Process' || feature === 'Instant Sanction') {
      setIsChatOpen(true);
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Privacy Agreement Modal - Must agree before using */}
      <PrivacyAgreementModal 
        open={showPrivacyModal} 
        onAgree={handlePrivacyAgree} 
      />

      {/* Guided Tour - Shows after privacy agreement */}
      <GuidedTour
        open={showTour || showManualTour}
        onComplete={() => {
          handleTourComplete();
          setShowManualTour(false);
        }}
        onSkip={() => {
          handleTourSkip();
          setShowManualTour(false);
        }}
      />

      {/* Landing Page Content */}
      <HeroSection 
        onStartChat={() => setIsChatOpen(true)} 
        onFeatureClick={handleFeatureClick}
      />
      <AgentsSection 
        onAgentClick={(agent) => {
          if (agent === 'Verification Agent') {
            setIsKYCOpen(true);
          } else if (agent === 'Investment Agent') {
            setIsInvestmentOpen(true);
          } else {
            setIsChatOpen(true);
          }
        }}
      />
      <InvestmentSection 
        onLearnMore={() => setIsInvestmentOpen(true)}
      />
      <LoanComparisonSection />
      <FinancialLiteracySection />
      <Footer />

      {/* KYC Verification Modal */}
      <KYCVerificationModal
        open={isKYCOpen}
        onOpenChange={setIsKYCOpen}
        onVerificationComplete={handleKYCComplete}
        customerName=""
        requestedAmount={500000}
      />

      {/* Investment Modal */}
      <InvestmentModal
        open={isInvestmentOpen}
        onOpenChange={setIsInvestmentOpen}
        emiAmount={verificationResult?.incomeDetails?.monthlyIncome ? Math.round(verificationResult.incomeDetails.monthlyIncome * 0.2) : 15000}
        loanAmount={verificationResult?.eligibleAmount || 500000}
        tenureMonths={36}
      />

      {/* Help Button - Restart Tour */}
      <button
        onClick={() => setShowManualTour(true)}
        className={cn(
          'fixed bottom-6 left-6 w-12 h-12 rounded-full',
          'bg-secondary border border-border',
          'flex items-center justify-center',
          'text-muted-foreground hover:text-foreground hover:bg-secondary/80',
          'transition-all duration-200 z-40',
          'shadow-lg'
        )}
        title="View Tour Guide"
      >
        <HelpCircle size={22} />
      </button>

      {/* Chat Fab Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 w-16 h-16 rounded-2xl',
            'bg-gradient-primary text-primary-foreground',
            'flex items-center justify-center',
            'shadow-2xl glow-primary',
            'hover:scale-105 transition-transform duration-200',
            'animate-pulse-glow z-50'
          )}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-full max-w-md h-[calc(100vh-6rem)] max-h-[700px]',
            'rounded-2xl overflow-hidden shadow-2xl',
            'border border-border',
            'animate-scale-in'
          )}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsChatOpen(false)}
            className={cn(
              'absolute top-4 right-4 z-10',
              'w-8 h-8 rounded-full bg-secondary/80 backdrop-blur',
              'flex items-center justify-center',
              'text-muted-foreground hover:text-foreground',
              'transition-colors'
            )}
          >
            <X size={18} />
          </button>
          
          <ChatContainer 
            verificationResult={verificationResult}
            onOpenKYC={() => setIsKYCOpen(true)}
            onOpenInvestment={() => setIsInvestmentOpen(true)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;