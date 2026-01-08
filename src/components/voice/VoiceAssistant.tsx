import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
  responseText?: string;
  isListening?: boolean;
}

export const VoiceAssistant = ({ onTranscript, responseText, isListening: externalListening }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition && 'speechSynthesis' in window);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice Error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
      }
    };

    recognition.start();
  }, [onTranscript, toast]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [toast]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Auto-speak response when it changes
  useEffect(() => {
    if (responseText && !isSpeaking) {
      speakText(responseText);
    }
  }, [responseText]);

  if (!speechSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={isListening ? stopListening : startListening}
        className={`transition-all ${isListening ? 'animate-pulse ring-2 ring-red-400' : ''}`}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        variant={isSpeaking ? "destructive" : "outline"}
        size="icon"
        onClick={isSpeaking ? stopSpeaking : () => responseText && speakText(responseText)}
        disabled={!responseText}
        className={`transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
        title={isSpeaking ? "Stop speaking" : "Read response aloud"}
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
