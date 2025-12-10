import React from 'react';
import { Bot, RotateCcw, Shield, TrendingUp, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ConversationContext } from '@/types/loan';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onReset: () => void;
  context?: ConversationContext;
}

export function ChatHeader({ onReset, context }: ChatHeaderProps) {
  const hasContext = context && (context.loanAmount || context.creditScore);

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm">
      {/* Main Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Bot size={24} className="text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              Aria
              <BadgeCheck size={16} className="text-primary" />
            </h2>
            <p className="text-sm text-muted-foreground">
              AI Loan Assistant • Tata Capital
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      {/* Context Bar (shows when we have loan context) */}
      {hasContext && (
        <div className="px-4 py-2 bg-secondary/30 border-t border-border/50 flex items-center gap-4 overflow-x-auto">
          {context.loanAmount && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-muted-foreground">Loan:</span>
              <span className="font-medium text-foreground">
                ₹{context.loanAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          {context.creditScore && (
            <div className="flex items-center gap-2 text-sm">
              <Shield size={14} className="text-success" />
              <span className="text-muted-foreground">Score:</span>
              <span className={cn(
                'font-medium',
                context.creditScore >= 750 ? 'text-success' :
                context.creditScore >= 650 ? 'text-warning' :
                'text-destructive'
              )}>
                {context.creditScore}
              </span>
            </div>
          )}
          {context.emi && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">EMI:</span>
              <span className="font-medium text-foreground">
                ₹{context.emi.toLocaleString('en-IN')}/mo
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}