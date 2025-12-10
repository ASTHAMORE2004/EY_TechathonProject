import React, { useRef, useEffect } from 'react';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export function ChatContainer() {
  const { messages, isLoading, sendMessage, resetChat, conversationContext } = useChat();
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