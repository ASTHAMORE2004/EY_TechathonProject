import React from 'react';
import { 
  Shield, 
  Upload, 
  CreditCard, 
  User, 
  FileText, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KYCSectionProps {
  onStartKYC: () => void;
}

const STEPS = [
  {
    step: 1,
    icon: Upload,
    title: 'Upload Documents',
    description: 'PAN Card, Aadhaar, and Income Proof',
  },
  {
    step: 2,
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Instant verification & credit assessment',
  },
  {
    step: 3,
    icon: CheckCircle2,
    title: 'Get Eligibility',
    description: 'Know your loan amount & interest rate',
  },
];

const DOCUMENTS = [
  {
    icon: CreditCard,
    name: 'PAN Card',
    description: 'For identity verification',
    required: true,
  },
  {
    icon: User,
    name: 'Aadhaar Card',
    description: 'Address & identity proof',
    required: true,
  },
  {
    icon: FileText,
    name: 'Income Proof',
    description: 'Salary slip, Form 16, or ITR',
    required: true,
  },
];

export function KYCSection({ onStartKYC }: KYCSectionProps) {
  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden" id="kyc-section">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(142,76%,36%,0.1),transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <Shield size={16} className="text-success" />
            <span className="text-sm text-success font-medium">Verification Agent</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upload Documents & <span className="text-gradient-primary">Check Eligibility</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered verification system analyzes your documents instantly and 
            calculates your credit score on a 1000-point scale.
          </p>
        </div>

        {/* Process Steps */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className={cn(
                'flex items-center gap-4 p-4 rounded-xl bg-card border border-border',
                'animate-fade-up'
              )} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.icon size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Step {step.step}</div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <ArrowRight className="hidden md:block text-muted-foreground" size={20} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {DOCUMENTS.map((doc, index) => (
            <div
              key={doc.name}
              className={cn(
                'glass rounded-2xl p-6 text-center',
                'hover:border-success/30 transition-all duration-300',
                'animate-fade-up'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <doc.icon size={32} className="text-success" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {doc.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
              {doc.required && (
                <span className="inline-block px-2 py-1 rounded text-xs bg-warning/10 text-warning border border-warning/20">
                  Required
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Bank-Grade Security', value: 'AES-256' },
            { label: 'Processing Time', value: '<30 seconds' },
            { label: 'Credit Score Range', value: '0-1000' },
            { label: 'Accuracy Rate', value: '99.5%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-secondary/30">
              <div className="text-2xl font-display font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onStartKYC}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 glow-primary text-lg px-8 py-6"
          >
            <Upload className="mr-2" size={22} />
            Start Document Verification
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Your documents are encrypted and securely processed • RBI compliant
          </p>
        </div>
      </div>
    </section>
  );
}
