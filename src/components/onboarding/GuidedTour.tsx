import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  position: 'center' | 'bottom-right' | 'top-center';
  highlight?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Tata Capital AI Loan Assistant!',
    description: 'Get your personal loan approved in minutes with our AI-powered system. Let me guide you through the key features of our platform.',
    icon: Sparkles,
    position: 'center',
  },
  {
    id: 'chat',
    title: 'AI-Powered Chat Assistant',
    description: 'Click the chat button to start your loan journey. Our AI assistant Aria will guide you through the entire process - from application to approval.',
    icon: MessageCircle,
    position: 'bottom-right',
    highlight: 'chat-fab',
  },
  {
    id: 'kyc',
    title: 'Instant KYC Verification',
    description: 'Upload your PAN, Aadhaar, and income documents. Our AI verifies them instantly and calculates your credit score in real-time.',
    icon: Shield,
    position: 'center',
  },
  {
    id: 'investment',
    title: 'Smart Investment Agent',
    description: 'Our Investment Agent helps you save while you repay! Round up EMIs, get cashback SIP, and build wealth alongside your loan journey.',
    icon: TrendingUp,
    position: 'center',
  },
  {
    id: 'comparison',
    title: 'Loan Comparison Tool',
    description: 'Compare loans from multiple lenders in real-time. See interactive charts showing EMIs, interest rates, and total costs side by side.',
    icon: BarChart3,
    position: 'center',
  },
  {
    id: 'education',
    title: 'Financial Literacy Hub',
    description: 'Watch curated videos on personal finance, credit scores, and smart borrowing. Become financially empowered!',
    icon: BookOpen,
    position: 'center',
  },
  {
    id: 'complete',
    title: 'You are All Set!',
    description: 'Start your loan application now by clicking the chat button. Our AI will take care of the rest. Happy borrowing!',
    icon: CheckCircle,
    position: 'center',
  },
];

interface GuidedTourProps {
  open: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function GuidedTour({ open, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    if (isFirstStep) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentStep]);

  if (!open) return null;

  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onSkip}
      />

      {/* Tour Card */}
      <div 
        className={cn(
          'relative z-10 w-full max-w-md mx-4',
          'bg-card border border-border rounded-2xl shadow-2xl overflow-hidden',
          'transition-all duration-200',
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        )}
      >
        {/* Progress Bar */}
        <div className="h-1 bg-secondary">
          <div 
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto',
            isLastStep ? 'bg-success/20' : 'bg-primary/10'
          )}>
            <Icon size={32} className={isLastStep ? 'text-success' : 'text-primary'} />
          </div>

          <h3 className="font-display text-xl font-bold text-foreground text-center mb-3">
            {step.title}
          </h3>
          
          <p className="text-muted-foreground text-center leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 bg-secondary/30 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={cn(isFirstStep && 'invisible')}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>

          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  index === currentStep 
                    ? 'bg-primary w-6' 
                    : index < currentStep 
                      ? 'bg-primary/50' 
                      : 'bg-muted'
                )}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleNext}
            className={cn(
              isLastStep 
                ? 'bg-success hover:bg-success/90' 
                : 'bg-primary hover:bg-primary/90'
            )}
          >
            {isLastStep ? (
              <>
                Get Started
                <CheckCircle size={16} className="ml-1" />
              </>
            ) : (
              <>
                Next
                <ArrowRight size={16} className="ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Spotlight for highlighted elements */}
      {step.highlight === 'chat-fab' && (
        <div className="fixed bottom-6 right-6 w-20 h-20 rounded-full border-4 border-primary animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
