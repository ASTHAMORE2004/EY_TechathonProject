import React, { useRef, useEffect } from 'react';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { FileDown } from 'lucide-react';

export function ChatContainer() {
  const { messages, isLoading, sendMessage, resetChat, conversationContext, sanctionLetterUrl } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send initial greeting when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("Hello!");
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-dark">
      <ChatHeader 
        onReset={resetChat}
        context={conversationContext}
      />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            isLatest={index === messages.length - 1}
          />
        ))}
        {isLoading && <TypingIndicator />}
        
        {/* Sanction Letter Download Button */}
        {sanctionLetterUrl && (
          <div className="flex justify-center animate-scale-in">
            <a
              href={sanctionLetterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-6 py-3",
                "bg-gradient-to-r from-green-600 to-emerald-600",
                "text-white font-semibold rounded-xl",
                "shadow-lg hover:shadow-xl",
                "transform hover:scale-105 transition-all duration-200",
                "border border-green-400/30"
              )}
            >
              <FileDown className="w-5 h-5" />
              <span>Download Sanction Letter (PDF)</span>
            </a>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder="Ask about loans, EMI, eligibility..."
      />
    </div>
  );
}