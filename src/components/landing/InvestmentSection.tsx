import React from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Wallet, 
  Gift,
  ArrowUpRight,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: PiggyBank,
    title: 'Round-Up Savings',
    description: 'Round up your EMI to the nearest ₹100 and invest the difference automatically in mutual funds.',
    example: 'EMI: ₹8,750 → Pay ₹8,800 → Save ₹50/month',
    color: 'accent',
    stats: { value: '₹18,000', label: 'Avg. yearly savings' },
  },
  {
    icon: Gift,
    title: 'Cashback SIP',
    description: 'Get 0.5% cashback on every EMI payment, automatically invested in recommended SIP funds.',
    example: 'On ₹50,000 loan → ₹250 cashback invested monthly',
    color: 'success',
    stats: { value: '12%', label: 'Expected returns' },
  },
  {
    icon: TrendingUp,
    title: 'Goal-Based Savings',
    description: 'Set a savings goal aligned with your loan tenure. Build an emergency fund while you repay.',
    example: 'Build ₹1,00,000 emergency fund by loan end',
    color: 'primary',
    stats: { value: '₹1L+', label: 'Goal achievement' },
  },
  {
    icon: Wallet,
    title: 'Smart Portfolio',
    description: 'AI-recommended investment allocation based on your risk profile and loan timeline.',
    example: 'Balanced portfolio: 60% Equity, 40% Debt',
    color: 'info',
    stats: { value: 'AI', label: 'Powered allocation' },
  },
];

const INVESTMENT_BENEFITS = [
  { icon: Sparkles, label: 'Zero Extra Effort', description: 'Automated investments' },
  { icon: Target, label: 'Goal Tracking', description: 'Visual progress updates' },
  { icon: BarChart3, label: 'Portfolio Analytics', description: 'Real-time insights' },
];

const colorVariants = {
  accent: {
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    text: 'text-accent',
    icon: 'bg-accent/20 text-accent',
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    icon: 'bg-success/20 text-success',
  },
  primary: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    icon: 'bg-primary/20 text-primary',
  },
  info: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    text: 'text-info',
    icon: 'bg-info/20 text-info',
  },
};

interface InvestmentSectionProps {
  onLearnMore?: () => void;
}

export function InvestmentSection({ onLearnMore }: InvestmentSectionProps) {
  return (
    <section className="py-24 px-4 bg-card relative overflow-hidden" id="investment-section">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">Investment Agent</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Save While You <span className="text-gradient-accent">Borrow</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Turn your loan journey into a wealth-building opportunity with our 
            integrated micro-investment features powered by AI.
          </p>

          {/* Quick Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {INVESTMENT_BENEFITS.map((benefit) => (
              <div
                key={benefit.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
              >
                <benefit.icon size={16} className="text-primary" />
                <span className="text-sm text-foreground font-medium">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => {
            const colors = colorVariants[feature.color as keyof typeof colorVariants];
            return (
              <div
                key={feature.title}
                className={cn(
                  'glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300',
                  'hover:transform hover:-translate-y-1',
                  'animate-fade-up group'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', colors.icon)}>
                    <feature.icon size={28} />
                  </div>
                  <div className="text-right">
                    <div className={cn('text-2xl font-display font-bold', colors.text)}>
                      {feature.stats.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{feature.stats.label}</div>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className={cn('px-4 py-3 rounded-lg text-sm font-mono', colors.bg, 'border', colors.border)}>
                  <span className={colors.text}>{feature.example}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            onClick={onLearnMore}
            size="lg"
            className="bg-gradient-accent text-accent-foreground hover:opacity-90 glow-accent"
          >
            <Wallet className="mr-2" size={20} />
            Activate Smart Savings
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Start with as little as ₹50/month • No lock-in • Withdraw anytime
          </p>
        </div>
      </div>
    </section>
  );
}