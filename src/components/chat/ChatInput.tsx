import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const QUICK_ACTIONS = [
  { label: '💰 Apply for Loan', prompt: "I'd like to apply for a personal loan" },
  { label: '📊 Check Eligibility', prompt: "Can you help me check my loan eligibility?" },
  { label: '💡 Investment Options', prompt: "Tell me about your micro-investment features" },
  { label: '🧮 EMI Calculator', prompt: "I want to calculate EMI for a loan" },
];

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (!disabled) {
      onSend(prompt);
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.prompt)}
            disabled={disabled}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full border border-border/50',
              'bg-secondary/30 hover:bg-secondary/50 transition-colors',
              'text-muted-foreground hover:text-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Type your message..."}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-xl px-4 py-3 pr-12',
              'bg-secondary/50 border border-border/50',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
              'placeholder:text-muted-foreground text-foreground',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Sparkles size={18} className="animate-pulse-slow" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            'h-12 w-12 rounded-xl p-0',
            'bg-gradient-primary hover:opacity-90 transition-opacity',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Send size={20} />
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Powered by Agentic AI • Your data is secure and encrypted
      </p>
    </div>
  );
}