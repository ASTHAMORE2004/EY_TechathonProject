import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { DocumentUploader } from './DocumentUploader';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  User,
  Loader2,
  Shield,
  TrendingUp,
  Sparkles,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  extractedData: Record<string, string>;
  errors: string[];
  warnings: string[];
}

interface DocumentAnalysis {
  panValid: boolean;
  panNumber?: string;
  aadhaarValid: boolean;
  aadhaarNumber?: string;
  incomeDetails?: {
    monthlyIncome: number;
    employmentType: string;
    employer?: string;
  };
  creditScore1000: number;
  creditFactors: {
    documentAuthenticity: number;
    incomeStability: number;
    identityVerification: number;
    financialHistory: number;
  };
  eligibleAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface KYCVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationComplete: (analysis: DocumentAnalysis) => void;
  customerName?: string;
  requestedAmount?: number;
}

export function KYCVerificationModal({
  open,
  onOpenChange,
  onVerificationComplete,
  customerName = '',
  requestedAmount = 500000
}: KYCVerificationModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [name, setName] = useState(customerName);
  const [amount, setAmount] = useState(requestedAmount.toString());
  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [panValidation, setPanValidation] = useState<ValidationResult | null>(null);
  const [aadhaarValidation, setAadhaarValidation] = useState<ValidationResult | null>(null);
  const [incomeValidation, setIncomeValidation] = useState<ValidationResult | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const allDocumentsValid = panValidation?.isValid && aadhaarValidation?.isValid && incomeValidation?.isValid;
  const hasAllDocuments = panFile && aadhaarFile && incomeFile;
  const canProceed = hasAllDocuments && allDocumentsValid;

  const analyzeDocuments = async () => {
    if (!hasAllDocuments) {
      toast.error("Please upload all three documents");
      return;
    }

    if (!allDocumentsValid) {
      toast.error("Please ensure all documents are validated successfully");
      return;
    }

    setIsAnalyzing(true);
    setStep('analyzing');

    try {
      const formData = new FormData();
      if (panFile) formData.append('panDocument', panFile);
      if (aadhaarFile) formData.append('aadhaarDocument', aadhaarFile);
      if (incomeFile) formData.append('incomeDocument', incomeFile);
      formData.append('customerName', name);
      formData.append('requestedAmount', amount);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-documents`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result: DocumentAnalysis = await response.json();
      
      // Merge extracted data from individual validations
      if (panValidation?.extractedData) {
        result.panNumber = panValidation.extractedData["PAN Number"] || result.panNumber;
      }
      if (aadhaarValidation?.extractedData) {
        result.aadhaarNumber = aadhaarValidation.extractedData["Last 4 Digits"] || result.aadhaarNumber;
      }
      
      setAnalysis(result);
      setStep('results');
      toast.success("Document analysis complete!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze documents. Please try again.");
      setStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComplete = () => {
    if (analysis) {
      onVerificationComplete(analysis);
      onOpenChange(false);
      setStep('upload');
      setPanFile(null);
      setAadhaarFile(null);
      setIncomeFile(null);
      setPanValidation(null);
      setAadhaarValidation(null);
      setIncomeValidation(null);
      setAnalysis(null);
    }
  };

  const getValidationSummary = () => {
    const validCount = [panValidation, aadhaarValidation, incomeValidation].filter(v => v?.isValid).length;
    const totalCount = [panFile, aadhaarFile, incomeFile].filter(Boolean).length;
    return { validCount, totalCount };
  };

  const { validCount, totalCount } = getValidationSummary();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-primary" />
            KYC Verification & Credit Assessment
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6 py-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Requested Loan Amount (Rs.)</Label>
                <Input 
                  type="number"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500000"
                />
              </div>
            </div>

            {/* Validation Progress */}
            {totalCount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Sparkles size={18} className="text-primary" />
                <span className="text-sm text-foreground">
                  Documents Verified: <span className="font-semibold text-primary">{validCount}</span> / {totalCount}
                </span>
                {canProceed && (
                  <span className="ml-auto flex items-center gap-1 text-sm text-success">
                    <CheckCircle2 size={16} />
                    Ready to proceed
                  </span>
                )}
              </div>
            )}

            {/* Document Uploaders with Real-time Validation */}
            <div className="space-y-4">
              <DocumentUploader
                label="PAN Card"
                icon={CreditCard}
                documentType="pan"
                onFileChange={setPanFile}
                onValidationComplete={setPanValidation}
              />
              
              <DocumentUploader
                label="Aadhaar Card"
                icon={User}
                documentType="aadhaar"
                onFileChange={setAadhaarFile}
                onValidationComplete={setAadhaarValidation}
              />
              
              <DocumentUploader
                label="Income Proof (Salary Slip / Form 16 / ITR)"
                icon={FileText}
                documentType="income"
                onFileChange={setIncomeFile}
                onValidationComplete={setIncomeValidation}
              />
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Real-time OCR Verification
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Each document is analyzed instantly using AI-powered OCR</li>
                <li>• Extracted data is displayed for your verification</li>
                <li>• All documents must be validated before proceeding</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={analyzeDocuments} 
              className="w-full bg-gradient-primary"
              disabled={!canProceed}
            >
              <Upload className="w-4 h-4 mr-2" />
              {canProceed 
                ? 'Calculate Credit Score & Check Eligibility' 
                : `Upload & Verify All Documents (${validCount}/3)`
              }
            </Button>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse" />
              <Loader2 className="w-12 h-12 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Calculating Your Credit Score</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Analyzing your verified documents and generating eligibility report...
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <Progress value={65} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">Processing...</p>
            </div>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="space-y-6 py-4">
            {/* Credit Score Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(analysis.creditScore1000 / 1000) * 352} 352`}
                      strokeLinecap="round"
                      className={cn(
                        analysis.creditScore1000 >= 800 ? 'text-success' :
                        analysis.creditScore1000 >= 650 ? 'text-warning' : 'text-destructive'
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn(
                      "text-3xl font-bold",
                      analysis.creditScore1000 >= 800 ? 'text-success' :
                      analysis.creditScore1000 >= 650 ? 'text-warning' : 'text-destructive'
                    )}>
                      {analysis.creditScore1000}
                    </span>
                    <span className="text-xs text-muted-foreground">/1000</span>
                  </div>
                </div>
                <p className={cn(
                  "mt-2 font-semibold",
                  analysis.creditScore1000 >= 800 ? 'text-success' :
                  analysis.creditScore1000 >= 650 ? 'text-warning' : 'text-destructive'
                )}>
                  {analysis.creditScore1000 >= 800 ? 'Excellent' :
                   analysis.creditScore1000 >= 700 ? 'Good' :
                   analysis.creditScore1000 >= 600 ? 'Fair' : 'Poor'}
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Credit Score Breakdown
                </h4>
                {Object.entries(analysis.creditFactors).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{value}/250</span>
                    </div>
                    <Progress value={(value / 250) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Document Verification Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-xl",
                analysis.panValid ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
              )}>
                <div className="flex items-center gap-2">
                  {analysis.panValid ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium">PAN Verification</span>
                </div>
                {analysis.panNumber && (
                  <p className="text-sm text-muted-foreground mt-1">PAN: {analysis.panNumber}</p>
                )}
              </div>

              <div className={cn(
                "p-4 rounded-xl",
                analysis.aadhaarValid ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
              )}>
                <div className="flex items-center gap-2">
                  {analysis.aadhaarValid ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-medium">Aadhaar Verification</span>
                </div>
                {analysis.aadhaarNumber && (
                  <p className="text-sm text-muted-foreground mt-1">Last 4 digits: {analysis.aadhaarNumber}</p>
                )}
              </div>
            </div>

            {/* Income Details */}
            {analysis.incomeDetails && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <h4 className="font-medium mb-2">Income Assessment</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Monthly Income</p>
                    <p className="font-semibold">Rs. {analysis.incomeDetails.monthlyIncome.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employment</p>
                    <p className="font-semibold capitalize">{analysis.incomeDetails.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Eligible Amount</p>
                    <p className="font-semibold text-success">Rs. {analysis.eligibleAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={handleComplete} className="w-full bg-gradient-primary">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Continue with Loan Application
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
