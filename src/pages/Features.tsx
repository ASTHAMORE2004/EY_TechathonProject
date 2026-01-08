import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Calculator, Globe, Calendar, Users, FileCheck, Wallet, PiggyBank, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VoiceAssistant } from '@/components/voice/VoiceAssistant';
import { CreditScoreSimulator } from '@/components/credit/CreditScoreSimulator';
import { ExpenseAnalyzer } from '@/components/expense/ExpenseAnalyzer';
import { EMICalendar } from '@/components/calendar/EMICalendar';
import { CoApplicantForm } from '@/components/coapplicant/CoApplicantForm';
import { ApplicationStatusTracker } from '@/components/status/ApplicationStatusTracker';
import { SmartPortfolio } from '@/components/portfolio/SmartPortfolio';
import { DocumentAuthenticityScore } from '@/components/document/DocumentAuthenticityScore';
import { LanguageProvider, LanguageSelector } from '@/components/language/LanguageSelector';

const Features = () => {
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const features = [
    { id: 'voice', name: 'Voice Assistant', icon: <Mic className="h-4 w-4" /> },
    { id: 'credit', name: 'Credit Simulator', icon: <Calculator className="h-4 w-4" /> },
    { id: 'expense', name: 'Expense Analyzer', icon: <Wallet className="h-4 w-4" /> },
    { id: 'calendar', name: 'EMI Calendar', icon: <Calendar className="h-4 w-4" /> },
    { id: 'coapplicant', name: 'Co-Applicant', icon: <Users className="h-4 w-4" /> },
    { id: 'status', name: 'Status Tracker', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'portfolio', name: 'Smart Portfolio', icon: <PiggyBank className="h-4 w-4" /> },
    { id: 'document', name: 'Doc Verification', icon: <FileCheck className="h-4 w-4" /> },
  ];

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-primary">Advanced Features</h1>
            </div>
            <LanguageSelector />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="voice" className="w-full">
            <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1 mb-6 h-auto bg-muted/50 p-1">
              {features.map((feature) => (
                <TabsTrigger 
                  key={feature.id} 
                  value={feature.id}
                  className="flex flex-col items-center gap-1 py-2 px-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {feature.icon}
                  <span className="hidden sm:inline">{feature.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="voice" className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">🎤 Voice-Based Loan Assistant</h2>
                  <p className="text-muted-foreground">
                    Speak naturally to apply for loans, check eligibility, and get instant assistance
                  </p>
                </div>
                
                <div className="p-6 border rounded-xl bg-card">
                  <div className="flex justify-center mb-6">
                    <VoiceAssistant 
                      onTranscript={setVoiceTranscript}
                      responseText="Hello! I'm Aria, your personal loan assistant. How can I help you today?"
                    />
                  </div>
                  
                  {voiceTranscript && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">You said:</p>
                      <p className="font-medium">{voiceTranscript}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium">Try saying:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setVoiceTranscript("I want to apply for a personal loan")}>
                        "Apply for personal loan"
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setVoiceTranscript("What's my loan eligibility?")}>
                        "Check eligibility"
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setVoiceTranscript("Calculate EMI for 5 lakhs")}>
                        "Calculate EMI"
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="credit">
              <div className="max-w-2xl mx-auto">
                <CreditScoreSimulator />
              </div>
            </TabsContent>

            <TabsContent value="expense">
              <div className="max-w-3xl mx-auto">
                <ExpenseAnalyzer />
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="max-w-2xl mx-auto">
                <EMICalendar />
              </div>
            </TabsContent>

            <TabsContent value="coapplicant">
              <div className="max-w-2xl mx-auto">
                <CoApplicantForm />
              </div>
            </TabsContent>

            <TabsContent value="status">
              <div className="max-w-2xl mx-auto">
                <ApplicationStatusTracker />
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="max-w-3xl mx-auto">
                <SmartPortfolio />
              </div>
            </TabsContent>

            <TabsContent value="document">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">🔍 Document Authenticity Verification</h2>
                  <p className="text-muted-foreground">
                    AI-powered document verification with advanced fraud detection
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <DocumentAuthenticityScore 
                    documentType="pan" 
                    documentUrl="sample"
                    onVerificationComplete={(score, isAuth) => console.log('PAN:', score, isAuth)}
                  />
                  <DocumentAuthenticityScore 
                    documentType="aadhaar" 
                    documentUrl="sample"
                    onVerificationComplete={(score, isAuth) => console.log('Aadhaar:', score, isAuth)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Features;
