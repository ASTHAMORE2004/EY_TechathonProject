import React from 'react';
import { 
  Bot, 
  UserCheck, 
  BarChart3, 
  PiggyBank, 
  FileSignature,
  Workflow 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AGENTS = [
  {
    icon: Bot,
    name: 'Master Orchestrator',
    role: 'Conversation Controller',
    description: 'Coordinates all agents and manages the customer journey from inquiry to sanction.',
    color: 'primary',
  },
  {
    icon: Bot,
    name: 'Sales Agent',
    role: 'Needs Assessment',
    description: 'Understands customer requirements, recommends loan amounts, and negotiates terms.',
    color: 'info',
  },
  {
    icon: UserCheck,
    name: 'Verification Agent',
    role: 'KYC & Identity',
    description: 'Validates PAN, Aadhaar, and employment details through secure verification.',
    color: 'success',
  },
  {
    icon: BarChart3,
    name: 'Underwriting Agent',
    role: 'Credit Assessment',
    description: 'Fetches credit scores, analyzes income, and determines loan eligibility.',
    color: 'warning',
  },
  {
    icon: PiggyBank,
    name: 'Investment Agent',
    role: 'Financial Wellness',
    description: 'Recommends round-up savings, cashback SIPs, and smart investment options.',
    color: 'accent',
  },
  {
    icon: FileSignature,
    name: 'Sanction Agent',
    role: 'Approval & Documentation',
    description: 'Generates sanction letters with loan terms and embedded savings plans.',
    color: 'primary',
  },
];

const colorClasses = {
  primary: 'bg-primary/10 border-primary/30 text-primary',
  info: 'bg-info/10 border-info/30 text-info',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  accent: 'bg-accent/10 border-accent/30 text-accent',
};

export function AgentsSection() {
  return (
    <section className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6">
            <Workflow size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Agentic AI Architecture</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet the AI Agents
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A coordinated team of specialized AI agents working together to deliver 
            a seamless loan experience.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent, index) => (
            <div
              key={agent.name}
              className={cn(
                'glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300',
                'hover:transform hover:-translate-y-1',
                'animate-fade-up'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                'w-14 h-14 rounded-xl flex items-center justify-center mb-4 border',
                colorClasses[agent.color as keyof typeof colorClasses]
              )}>
                <agent.icon size={28} />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                {agent.name}
              </h3>
              <span className="text-sm text-primary font-medium">
                {agent.role}
              </span>
              <p className="text-sm text-muted-foreground mt-3">
                {agent.description}
              </p>
            </div>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="mt-16 glass rounded-2xl p-8">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
            Orchestration Flow
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Customer Query', 'Master Agent', 'Worker Agents', 'Decision', 'Response'].map((step, i) => (
              <React.Fragment key={step}>
                <div className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium',
                  i === 0 ? 'bg-accent text-accent-foreground' :
                  i === 4 ? 'bg-success text-success-foreground' :
                  'bg-secondary text-secondary-foreground'
                )}>
                  {step}
                </div>
                {i < 4 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}