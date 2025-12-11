import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  User,
  Loader2,
  Shield,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (type: 'pan' | 'aadhaar' | 'income', file: File | null) => {
    if (type === 'pan') setPanFile(file);
    else if (type === 'aadhaar') setAadhaarFile(file);
    else setIncomeFile(file);
  };

  const analyzeDocuments = async () => {
    if (!panFile && !aadhaarFile && !incomeFile) {
      toast.error("Please upload at least one document");
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
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result: DocumentAnalysis = await response.json();
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
      // Reset state
      setStep('upload');
      setPanFile(null);
      setAadhaarFile(null);
      setIncomeFile(null);
      setAnalysis(null);
    }
  };

  const FileUploadBox = ({ 
    label, 
    icon: Icon, 
    file, 
    onChange,
    accept = "image/*,.pdf"
  }: { 
    label: string; 
    icon: React.ElementType; 
    file: File | null; 
    onChange: (file: File | null) => void;
    accept?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all",
          file 
            ? "border-green-500 bg-green-500/10" 
            : "border-border hover:border-primary hover:bg-primary/5"
        )}
      >
        <div className="flex flex-col items-center justify-center py-4">
          {file ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm text-green-600 font-medium truncate max-w-[200px]">{file.name}</p>
            </>
          ) : (
            <>
              <Icon className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );

  const CreditScoreGauge = ({ score }: { score: number }) => {
    const percentage = (score / 1000) * 100;
    const getColor = () => {
      if (score >= 800) return 'text-green-500';
      if (score >= 650) return 'text-yellow-500';
      return 'text-red-500';
    };
    const getLabel = () => {
      if (score >= 800) return 'Excellent';
      if (score >= 700) return 'Good';
      if (score >= 600) return 'Fair';
      return 'Poor';
    };

    return (
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
              strokeDasharray={`${percentage * 3.52} 352`}
              strokeLinecap="round"
              className={getColor()}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold", getColor())}>{score}</span>
            <span className="text-xs text-muted-foreground">/1000</span>
          </div>
        </div>
        <p className={cn("mt-2 font-semibold", getColor())}>{getLabel()}</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-primary" />
            KYC Verification & Credit Assessment
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6 py-4">
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
                <Label>Requested Loan Amount (₹)</Label>
                <Input 
                  type="number"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FileUploadBox
                label="PAN Card"
                icon={CreditCard}
                file={panFile}
                onChange={(f) => handleFileChange('pan', f)}
              />
              <FileUploadBox
                label="Aadhaar Card"
                icon={User}
                file={aadhaarFile}
                onChange={(f) => handleFileChange('aadhaar', f)}
              />
              <FileUploadBox
                label="Income Proof"
                icon={FileText}
                file={incomeFile}
                onChange={(f) => handleFileChange('income', f)}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-xl">
              <h4 className="font-medium text-sm mb-2">Accepted Documents:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• PAN Card: Clear photo or scanned copy</li>
                <li>• Aadhaar: Front side with masked number</li>
                <li>• Income Proof: Salary slip, Form 16, ITR, Bank Statement</li>
              </ul>
            </div>

            <Button 
              onClick={analyzeDocuments} 
              className="w-full bg-gradient-primary"
              disabled={!panFile && !aadhaarFile && !incomeFile}
            >
              <Upload className="w-4 h-4 mr-2" />
              Analyze Documents & Calculate Credit Score
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
              <h3 className="font-semibold text-lg">Analyzing Your Documents</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI is verifying your KYC documents and calculating credit score...
              </p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <Progress value={45} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">Processing...</p>
            </div>
          </div>
        )}

        {step === 'results' && analysis && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CreditScoreGauge score={analysis.creditScore1000} />
              
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

            <div className="grid grid-cols-2 gap-4">
              <div className={cn(
                "p-4 rounded-xl",
                analysis.panValid ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
              )}>
                <div className="flex items-center gap-2">
                  {analysis.panValid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">PAN Verification</span>
                </div>
                {analysis.panNumber && (
                  <p className="text-sm text-muted-foreground mt-1">PAN: {analysis.panNumber}</p>
                )}
              </div>

              <div className={cn(
                "p-4 rounded-xl",
                analysis.aadhaarValid ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
              )}>
                <div className="flex items-center gap-2">
                  {analysis.aadhaarValid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium">Aadhaar Verification</span>
                </div>
                {analysis.aadhaarNumber && (
                  <p className="text-sm text-muted-foreground mt-1">Last 4 digits: {analysis.aadhaarNumber}</p>
                )}
              </div>
            </div>

            {analysis.incomeDetails && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <h4 className="font-medium mb-2">Income Assessment</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Monthly Income</p>
                    <p className="font-semibold">₹{analysis.incomeDetails.monthlyIncome.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employment</p>
                    <p className="font-semibold capitalize">{analysis.incomeDetails.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Eligible Amount</p>
                    <p className="font-semibold text-green-600">₹{analysis.eligibleAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

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