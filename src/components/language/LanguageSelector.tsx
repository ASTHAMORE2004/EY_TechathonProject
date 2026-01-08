import { useState, createContext, useContext, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

// Translation strings for key UI elements
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome to Tata Capital',
    applyLoan: 'Apply for Loan',
    checkEligibility: 'Check Eligibility',
    uploadDocuments: 'Upload Documents',
    loanAmount: 'Loan Amount',
    tenure: 'Tenure',
    interestRate: 'Interest Rate',
    emi: 'EMI',
    proceed: 'Proceed',
    cancel: 'Cancel',
    submit: 'Submit',
    verifyKYC: 'Verify KYC',
    creditScore: 'Credit Score',
    monthlyIncome: 'Monthly Income',
    personalLoan: 'Personal Loan',
    homeLoan: 'Home Loan',
    carLoan: 'Car Loan',
    businessLoan: 'Business Loan',
  },
  hi: {
    welcome: 'टाटा कैपिटल में आपका स्वागत है',
    applyLoan: 'ऋण के लिए आवेदन करें',
    checkEligibility: 'पात्रता जांचें',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',
    loanAmount: 'ऋण राशि',
    tenure: 'अवधि',
    interestRate: 'ब्याज दर',
    emi: 'ईएमआई',
    proceed: 'आगे बढ़ें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    verifyKYC: 'केवाईसी सत्यापित करें',
    creditScore: 'क्रेडिट स्कोर',
    monthlyIncome: 'मासिक आय',
    personalLoan: 'व्यक्तिगत ऋण',
    homeLoan: 'गृह ऋण',
    carLoan: 'कार ऋण',
    businessLoan: 'व्यापार ऋण',
  },
  ta: {
    welcome: 'டாடா கேபிட்டலுக்கு வரவேற்கிறோம்',
    applyLoan: 'கடனுக்கு விண்ணப்பிக்கவும்',
    checkEligibility: 'தகுதியை சரிபார்க்கவும்',
    uploadDocuments: 'ஆவணங்களை பதிவேற்றவும்',
    loanAmount: 'கடன் தொகை',
    tenure: 'காலம்',
    interestRate: 'வட்டி விகிதம்',
    emi: 'இஎம்ஐ',
    proceed: 'தொடரவும்',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பி',
    verifyKYC: 'கேஒய்சி சரிபார்க்கவும்',
    creditScore: 'கடன் மதிப்பெண்',
    monthlyIncome: 'மாத வருமானம்',
    personalLoan: 'தனிப்பட்ட கடன்',
    homeLoan: 'வீட்டு கடன்',
    carLoan: 'கார் கடன்',
    businessLoan: 'வணிக கடன்',
  },
  te: {
    welcome: 'టాటా క్యాపిటల్‌కు స్వాగతం',
    applyLoan: 'రుణానికి దరఖాస్తు చేయండి',
    checkEligibility: 'అర్హతను తనిఖీ చేయండి',
    uploadDocuments: 'పత్రాలను అప్‌లోడ్ చేయండి',
    loanAmount: 'రుణ మొత్తం',
    tenure: 'కాలపరిమితి',
    interestRate: 'వడ్డీ రేటు',
    emi: 'ఇఎమ్ఐ',
    proceed: 'కొనసాగించు',
    cancel: 'రద్దు చేయి',
    submit: 'సమర్పించు',
    verifyKYC: 'కేవైసీ ధృవీకరించండి',
    creditScore: 'క్రెడిట్ స్కోర్',
    monthlyIncome: 'నెలవారీ ఆదాయం',
    personalLoan: 'వ్యక్తిగత రుణం',
    homeLoan: 'గృహ రుణం',
    carLoan: 'కార్ రుణం',
    businessLoan: 'వ్యాపార రుణం',
  },
  mr: {
    welcome: 'टाटा कॅपिटलमध्ये आपले स्वागत आहे',
    applyLoan: 'कर्जासाठी अर्ज करा',
    checkEligibility: 'पात्रता तपासा',
    uploadDocuments: 'कागदपत्रे अपलोड करा',
    loanAmount: 'कर्ज रक्कम',
    tenure: 'कालावधी',
    interestRate: 'व्याज दर',
    emi: 'ईएमआय',
    proceed: 'पुढे जा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    verifyKYC: 'केवायसी सत्यापित करा',
    creditScore: 'क्रेडिट स्कोअर',
    monthlyIncome: 'मासिक उत्पन्न',
    personalLoan: 'वैयक्तिक कर्ज',
    homeLoan: 'गृह कर्ज',
    carLoan: 'कार कर्ज',
    businessLoan: 'व्यवसाय कर्ज',
  },
  bn: {
    welcome: 'টাটা ক্যাপিটালে স্বাগতম',
    applyLoan: 'ঋণের জন্য আবেদন করুন',
    checkEligibility: 'যোগ্যতা পরীক্ষা করুন',
    uploadDocuments: 'নথি আপলোড করুন',
    loanAmount: 'ঋণের পরিমাণ',
    tenure: 'মেয়াদ',
    interestRate: 'সুদের হার',
    emi: 'ইএমআই',
    proceed: 'এগিয়ে যান',
    cancel: 'বাতিল',
    submit: 'জমা দিন',
    verifyKYC: 'কেওয়াইসি যাচাই করুন',
    creditScore: 'ক্রেডিট স্কোর',
    monthlyIncome: 'মাসিক আয়',
    personalLoan: 'ব্যক্তিগত ঋণ',
    homeLoan: 'গৃহ ঋণ',
    carLoan: 'গাড়ি ঋণ',
    businessLoan: 'ব্যবসায়িক ঋণ',
  },
  gu: {
    welcome: 'ટાટા કેપિટલમાં આપનું સ્વાગત છે',
    applyLoan: 'લોન માટે અરજી કરો',
    checkEligibility: 'પાત્રતા તપાસો',
    uploadDocuments: 'દસ્તાવેજો અપલોડ કરો',
    loanAmount: 'લોનની રકમ',
    tenure: 'સમયગાળો',
    interestRate: 'વ્યાજ દર',
    emi: 'ઇએમઆઇ',
    proceed: 'આગળ વધો',
    cancel: 'રદ કરો',
    submit: 'સબમિટ કરો',
    verifyKYC: 'કેવાયસી ચકાસો',
    creditScore: 'ક્રેડિટ સ્કોર',
    monthlyIncome: 'માસિક આવક',
    personalLoan: 'વ્યક્તિગત લોન',
    homeLoan: 'હોમ લોન',
    carLoan: 'કાર લોન',
    businessLoan: 'બિઝનેસ લોન',
  },
  kn: {
    welcome: 'ಟಾಟಾ ಕ್ಯಾಪಿಟಲ್‌ಗೆ ಸ್ವಾಗತ',
    applyLoan: 'ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    checkEligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
    uploadDocuments: 'ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ',
    tenure: 'ಅವಧಿ',
    interestRate: 'ಬಡ್ಡಿ ದರ',
    emi: 'ಇಎಮ್ಐ',
    proceed: 'ಮುಂದುವರಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    verifyKYC: 'ಕೆವೈಸಿ ಪರಿಶೀಲಿಸಿ',
    creditScore: 'ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್',
    monthlyIncome: 'ಮಾಸಿಕ ಆದಾಯ',
    personalLoan: 'ವೈಯಕ್ತಿಕ ಸಾಲ',
    homeLoan: 'ಗೃಹ ಸಾಲ',
    carLoan: 'ಕಾರ್ ಸಾಲ',
    businessLoan: 'ವ್ಯಾಪಾರ ಸಾಲ',
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang)}
            className={currentLanguage.code === lang.code ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
