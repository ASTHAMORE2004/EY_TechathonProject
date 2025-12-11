import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Banknote, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Bot,
  Clock,
  FileCheck,
  User,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  onStartChat: () => void;
  onFeatureClick?: (feature: string) => void;
}

export function HeroSection({ onStartChat, onFeatureClick }: HeroSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Auth Navigation */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/dashboard')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl',
              'bg-primary/10 border border-primary/20',
              'text-primary font-medium text-sm',
              'hover:bg-primary/20 transition-colors'
            )}
          >
            <User size={16} />
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl',
              'bg-primary/10 border border-primary/20',
              'text-primary font-medium text-sm',
              'hover:bg-primary/20 transition-colors'
            )}
          >
            <LogIn size={16} />
            Sign In
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">
            Powered by Agentic AI Architecture
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">Your Personal Loan,</span>
          <br />
          <span className="text-gradient-primary">Reimagined with AI</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Meet <span className="text-accent font-semibold">Aria</span> — your intelligent financial companion 
          that negotiates loans, verifies eligibility, and helps you save while you borrow.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartChat}
          className={cn(
            'group inline-flex items-center gap-3 px-8 py-4 rounded-2xl',
            'bg-gradient-primary text-primary-foreground font-semibold text-lg',
            'hover:opacity-90 transition-all duration-300',
            'glow-primary animate-fade-up',
            'transform hover:scale-105'
          )}
          style={{ animationDelay: '0.3s' }}
        >
          <Bot size={24} />
          Start Your Loan Journey
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Clock, title: '2 Min Process', desc: 'Quick eligibility check' },
            { icon: ShieldCheck, title: 'KYC Verified', desc: 'Secure verification' },
            { icon: FileCheck, title: 'Instant Sanction', desc: 'Digital approval letter' },
            { icon: TrendingUp, title: 'Smart Savings', desc: 'Invest while you repay' },
          ].map((feature, i) => (
            <button 
              key={feature.title}
              onClick={() => onFeatureClick?.(feature.title)}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors text-left"
            >
              <feature.icon size={28} className="text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <span className="text-sm">Trusted by</span>
          <div className="flex items-center gap-2">
            <Banknote size={20} />
            <span className="font-semibold text-foreground">Tata Capital</span>
          </div>
          <span className="text-sm">|</span>
          <span className="text-sm">RBI Regulated NBFC</span>
          <span className="text-sm">|</span>
          <span className="text-sm">10L+ Customers</span>
        </div>
      </div>
    </div>
  );
}