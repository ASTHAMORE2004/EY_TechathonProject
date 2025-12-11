import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ConversationContext } from '@/types/loan';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loan-chat`;
const SANCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sanction-letter`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const [sanctionLetterUrl, setSanctionLetterUrl] = useState<string | null>(null);

  const generateSanctionLetter = useCallback(async (context: ConversationContext) => {
    try {
      console.log("Generating sanction letter with context:", context);
      
      const applicationId = crypto.randomUUID();
      
      const response = await fetch(SANCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          customerName: context.customerName || 'Valued Customer',
          loanAmount: context.loanAmount || 500000,
          interestRate: context.interestRate || 12.5,
          tenureMonths: context.tenure || 36,
          emiAmount: context.emi || Math.round((context.loanAmount || 500000) * 0.035),
          purpose: context.purpose || 'Personal Loan',
          creditScore: context.creditScore || 750,
          applicationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate sanction letter');
      }

      const result = await response.json();
      console.log("Sanction letter generated:", result);
      
      setSanctionLetterUrl(result.url);
      toast.success("🎉 Sanction letter generated! Click to download.");
      
      return result.url;
    } catch (error) {
      console.error("Error generating sanction letter:", error);
      toast.error("Failed to generate sanction letter");
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = '';

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: assistantContent,
          timestamp: new Date(),
        }];
      });
    };

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          conversationContext,
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }

      // Extract context from assistant response
      const newContext = extractContext(assistantContent, conversationContext);
      setConversationContext(newContext);

      // Check if loan was sanctioned/approved - trigger PDF generation
      const sanctionKeywords = ['sanctioned', 'approved', 'congratulations', 'sanction letter', 'loan is approved'];
      const isSanctioned = sanctionKeywords.some(keyword => 
        assistantContent.toLowerCase().includes(keyword)
      );
      
      if (isSanctioned && newContext.loanAmount && !sanctionLetterUrl) {
        setTimeout(() => {
          generateSanctionLetter(newContext);
        }, 1500);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. 🙏",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, conversationContext, generateSanctionLetter, sanctionLetterUrl]);

  const extractContext = (content: string, prevContext: ConversationContext): ConversationContext => {
    const newContext = { ...prevContext };
    
    // Extract loan amount
    const amountMatch = content.match(/₹([\d,]+)/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1].replace(/,/g, ''));
      if (amount > 10000) {
        newContext.loanAmount = amount;
      }
    }

    // Extract credit score
    const creditMatch = content.match(/credit score.*?(\d{3})/i);
    if (creditMatch) {
      newContext.creditScore = parseInt(creditMatch[1]);
    }

    // Extract EMI
    const emiMatch = content.match(/EMI.*?₹([\d,]+)/i);
    if (emiMatch) {
      newContext.emi = parseInt(emiMatch[1].replace(/,/g, ''));
    }

    // Extract interest rate
    const rateMatch = content.match(/(\d+\.?\d*)\s*%\s*(p\.?a\.?|per annum|annual)/i);
    if (rateMatch) {
      newContext.interestRate = parseFloat(rateMatch[1]);
    }

    // Extract tenure
    const tenureMatch = content.match(/(\d+)\s*(month|months)/i);
    if (tenureMatch) {
      newContext.tenure = parseInt(tenureMatch[1]);
    }

    // Extract customer name
    const nameMatch = content.match(/Dear\s+(\w+)/i) || content.match(/Mr\.?\s+(\w+)/i) || content.match(/Ms\.?\s+(\w+)/i);
    if (nameMatch && !newContext.customerName) {
      newContext.customerName = nameMatch[1];
    }

    return newContext;
  };

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationContext({});
    setSanctionLetterUrl(null);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    conversationContext,
    setConversationContext,
    sanctionLetterUrl,
    generateSanctionLetter,
  };
}