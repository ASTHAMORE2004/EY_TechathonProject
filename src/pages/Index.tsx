import React, { useState } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { AgentsSection } from '@/components/landing/AgentsSection';
import { InvestmentSection } from '@/components/landing/InvestmentSection';
import { Footer } from '@/components/landing/Footer';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { X, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Landing Page Content */}
      <HeroSection onStartChat={() => setIsChatOpen(true)} />
      <AgentsSection />
      <InvestmentSection />
      <Footer />

      {/* Chat Fab Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 w-16 h-16 rounded-2xl',
            'bg-gradient-primary text-primary-foreground',
            'flex items-center justify-center',
            'shadow-2xl glow-primary',
            'hover:scale-105 transition-transform duration-200',
            'animate-pulse-glow z-50'
          )}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isChatOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'w-full max-w-md h-[calc(100vh-6rem)] max-h-[700px]',
            'rounded-2xl overflow-hidden shadow-2xl',
            'border border-border',
            'animate-scale-in'
          )}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsChatOpen(false)}
            className={cn(
              'absolute top-4 right-4 z-10',
              'w-8 h-8 rounded-full bg-secondary/80 backdrop-blur',
              'flex items-center justify-center',
              'text-muted-foreground hover:text-foreground',
              'transition-colors'
            )}
          >
            <X size={18} />
          </button>
          
          <ChatContainer />
        </div>
      )}
    </div>
  );
};

export default Index;