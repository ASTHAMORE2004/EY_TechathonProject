import React from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Wallet, 
  Gift,
  ArrowUpRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: PiggyBank,
    title: 'Round-Up Savings',
    description: 'Round up your EMI to the nearest ₹100 and invest the difference automatically in mutual funds.',
    example: 'EMI: ₹8,750 → Pay ₹8,800 → Save ₹50/month',
    color: 'accent',
  },
  {
    icon: Gift,
    title: 'Cashback SIP',
    description: 'Get 0.5% cashback on every EMI payment, automatically invested in recommended SIP funds.',
    example: 'On ₹50,000 loan → ₹250 cashback invested monthly',
    color: 'success',
  },
  {
    icon: TrendingUp,
    title: 'Goal-Based Savings',
    description: 'Set a savings goal aligned with your loan tenure. Build an emergency fund while you repay.',
    example: 'Build ₹1,00,000 emergency fund by loan end',
    color: 'primary',
  },
  {
    icon: Wallet,
    title: 'Smart Portfolio',
    description: 'AI-recommended investment allocation based on your risk profile and loan timeline.',
    example: 'Balanced portfolio: 60% Equity, 40% Debt',
    color: 'info',
  },
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

export function InvestmentSection() {
  return (
    <section className="py-24 px-4 bg-card relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <TrendingUp size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">Fintech Innovation</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Save While You <span className="text-gradient-accent">Borrow</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn your loan journey into a wealth-building opportunity with our 
            integrated micro-investment features.
          </p>
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
                  'animate-fade-up'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center mb-4', colors.icon)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
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
          <div className="inline-flex items-center gap-2 text-accent hover:underline cursor-pointer">
            <span className="font-medium">Learn more about our investment options</span>
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </section>
  );
}