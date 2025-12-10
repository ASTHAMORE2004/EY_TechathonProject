import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isLatest?: boolean;
}

export function ChatMessage({ role, content, timestamp, isLatest }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-2xl message-enter',
        isAssistant 
          ? 'bg-secondary/50 mr-8' 
          : 'bg-primary/10 ml-8 flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isAssistant 
            ? 'bg-gradient-primary text-primary-foreground' 
            : 'bg-accent text-accent-foreground'
        )}
      >
        {isAssistant ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className={cn('flex-1 min-w-0', !isAssistant && 'text-right')}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {isAssistant ? 'Aria' : 'You'}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <div 
          className={cn(
            'prose prose-sm prose-invert max-w-none',
            'text-foreground/90 leading-relaxed',
            '[&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2',
            '[&_strong]:text-primary [&_strong]:font-semibold',
            '[&_a]:text-primary [&_a]:underline'
          )}
          dangerouslySetInnerHTML={{ 
            __html: formatMessage(content) 
          }}
        />
      </div>
    </div>
  );
}

function formatMessage(content: string): string {
  // Convert markdown-like syntax to HTML
  let formatted = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Bullet points
    .replace(/^[\-\•]\s+(.*)$/gm, '<li>$1</li>')
    // Wrap consecutive list items
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="list-disc pl-4 space-y-1">$&</ul>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  
  // Wrap in paragraph if not already structured
  if (!formatted.startsWith('<')) {
    formatted = `<p>${formatted}</p>`;
  }
  
  return formatted;
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 bg-secondary/50 rounded-2xl mr-8 message-enter">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-primary text-primary-foreground">
        <Bot size={20} />
      </div>
      <div className="flex items-center">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="text-sm text-muted-foreground ml-2">Aria is thinking...</span>
      </div>
    </div>
  );
}