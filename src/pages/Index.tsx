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
import { X, MessageCircle } from 'lucide-react';
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

  const handleKYCComplete = (analysis: DocumentAnalysis) => {
    setVerificationResult(analysis);
    toast.success(`Credit Score: ${analysis.creditScore1000}/1000 - ${analysis.riskLevel === 'low' ? 'Excellent!' : 'Approved!'}`);
    // Open chat to continue the journey
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

  return (
    <div className="min-h-screen bg-background">
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