import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileCheck,
  Eye,
  Fingerprint,
  Clock
} from 'lucide-react';

interface DocumentCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'checking';
  score: number;
  details: string;
}

interface DocumentAuthenticityScoreProps {
  documentType: 'pan' | 'aadhaar' | 'income' | 'address';
  documentUrl?: string;
  onVerificationComplete?: (score: number, isAuthentic: boolean) => void;
}

export const DocumentAuthenticityScore = ({ 
  documentType, 
  documentUrl,
  onVerificationComplete 
}: DocumentAuthenticityScoreProps) => {
  const [checks, setChecks] = useState<DocumentCheck[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const documentChecks: Record<string, DocumentCheck[]> = {
    pan: [
      { id: 'format', name: 'Format Validation', status: 'checking', score: 0, details: 'Checking PAN format (XXXXX0000X)' },
      { id: 'qr', name: 'QR Code Verification', status: 'checking', score: 0, details: 'Scanning QR code authenticity' },
      { id: 'hologram', name: 'Hologram Detection', status: 'checking', score: 0, details: 'Detecting security hologram' },
      { id: 'font', name: 'Font Consistency', status: 'checking', score: 0, details: 'Analyzing font patterns' },
      { id: 'photo', name: 'Photo Quality', status: 'checking', score: 0, details: 'Checking photo clarity and tampering' },
    ],
    aadhaar: [
      { id: 'format', name: 'UID Format Check', status: 'checking', score: 0, details: 'Validating 12-digit UID format' },
      { id: 'qr', name: 'QR Code Verification', status: 'checking', score: 0, details: 'Decoding secure QR code' },
      { id: 'watermark', name: 'Watermark Detection', status: 'checking', score: 0, details: 'Detecting UIDAI watermark' },
      { id: 'issue', name: 'Issue Date Validation', status: 'checking', score: 0, details: 'Checking issue date validity' },
      { id: 'biometric', name: 'Biometric Match', status: 'checking', score: 0, details: 'Cross-referencing biometric data' },
    ],
    income: [
      { id: 'employer', name: 'Employer Verification', status: 'checking', score: 0, details: 'Verifying employer details' },
      { id: 'format', name: 'Document Format', status: 'checking', score: 0, details: 'Checking standard salary slip format' },
      { id: 'calculations', name: 'Calculation Accuracy', status: 'checking', score: 0, details: 'Validating salary calculations' },
      { id: 'date', name: 'Date Consistency', status: 'checking', score: 0, details: 'Checking date patterns' },
      { id: 'tampering', name: 'Tampering Detection', status: 'checking', score: 0, details: 'Analyzing for digital manipulation' },
    ],
    address: [
      { id: 'format', name: 'Address Format', status: 'checking', score: 0, details: 'Validating address structure' },
      { id: 'pincode', name: 'Pincode Verification', status: 'checking', score: 0, details: 'Cross-checking pincode' },
      { id: 'issuer', name: 'Issuer Validation', status: 'checking', score: 0, details: 'Verifying issuing authority' },
      { id: 'date', name: 'Document Age', status: 'checking', score: 0, details: 'Checking document recency' },
      { id: 'authenticity', name: 'Visual Authenticity', status: 'checking', score: 0, details: 'Analyzing visual patterns' },
    ],
  };

  useEffect(() => {
    if (documentUrl) {
      simulateVerification();
    }
  }, [documentUrl]);

  const simulateVerification = async () => {
    setIsVerifying(true);
    setChecks(documentChecks[documentType]);
    
    // Simulate each check with delays
    const updatedChecks = [...documentChecks[documentType]];
    
    for (let i = 0; i < updatedChecks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
      
      // Simulate realistic scores (mostly passing for demo)
      const randomScore = Math.random();
      let status: 'passed' | 'warning' | 'failed';
      let score: number;
      
      if (randomScore > 0.15) {
        status = 'passed';
        score = 85 + Math.floor(Math.random() * 15);
      } else if (randomScore > 0.05) {
        status = 'warning';
        score = 60 + Math.floor(Math.random() * 25);
      } else {
        status = 'failed';
        score = 20 + Math.floor(Math.random() * 40);
      }
      
      updatedChecks[i] = {
        ...updatedChecks[i],
        status,
        score,
        details: getStatusDetails(updatedChecks[i].id, status)
      };
      
      setChecks([...updatedChecks]);
    }
    
    // Calculate overall score
    const totalScore = Math.round(
      updatedChecks.reduce((sum, check) => sum + check.score, 0) / updatedChecks.length
    );
    setOverallScore(totalScore);
    setIsVerifying(false);
    setVerificationComplete(true);
    
    // Callback with results
    onVerificationComplete?.(totalScore, totalScore >= 70);
  };

  const getStatusDetails = (checkId: string, status: 'passed' | 'warning' | 'failed'): string => {
    const details: Record<string, Record<string, string>> = {
      passed: {
        format: 'Document format matches expected pattern',
        qr: 'QR code verified successfully',
        hologram: 'Security hologram detected and validated',
        font: 'Font patterns consistent with original',
        photo: 'Photo quality acceptable, no tampering detected',
        watermark: 'UIDAI watermark verified',
        issue: 'Issue date within valid range',
        biometric: 'Biometric data matches records',
        employer: 'Employer verified in database',
        calculations: 'All calculations accurate',
        date: 'Date patterns consistent',
        tampering: 'No digital manipulation detected',
        pincode: 'Pincode matches region',
        issuer: 'Issuing authority verified',
        authenticity: 'Visual patterns match authentic documents',
      },
      warning: {
        format: 'Minor format discrepancy detected',
        qr: 'QR code partially readable',
        hologram: 'Hologram clarity below threshold',
        font: 'Slight font variation detected',
        photo: 'Photo quality could be better',
        watermark: 'Watermark partially visible',
        issue: 'Document approaching expiry',
        biometric: 'Partial biometric match',
        employer: 'Employer details need manual verification',
        calculations: 'Minor calculation discrepancy',
        date: 'Date format non-standard',
        tampering: 'Minor artifacts detected',
        pincode: 'Pincode verification pending',
        issuer: 'Issuer details need confirmation',
        authenticity: 'Some visual elements unclear',
      },
      failed: {
        format: 'Document format does not match',
        qr: 'QR code invalid or corrupted',
        hologram: 'Security hologram not detected',
        font: 'Font inconsistencies indicate tampering',
        photo: 'Photo appears to be manipulated',
        watermark: 'UIDAI watermark missing',
        issue: 'Issue date invalid or too old',
        biometric: 'Biometric data mismatch',
        employer: 'Employer not found in records',
        calculations: 'Significant calculation errors',
        date: 'Date inconsistencies detected',
        tampering: 'Digital manipulation detected',
        pincode: 'Pincode does not exist',
        issuer: 'Invalid issuing authority',
        authenticity: 'Document appears forged',
      },
    };
    return details[status]?.[checkId] || 'Check completed';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Authentic', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Needs Review', color: 'bg-yellow-500' };
    return { label: 'Suspicious', color: 'bg-red-500' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const docTypeLabels: Record<string, string> = {
    pan: 'PAN Card',
    aadhaar: 'Aadhaar Card',
    income: 'Income Document',
    address: 'Address Proof',
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Document Authenticity Check
          </span>
          <Badge variant="outline">{docTypeLabels[documentType]}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        {verificationComplete && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl text-center">
            <p className="text-sm text-muted-foreground mb-1">Authenticity Score</p>
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <Badge className={`mt-2 ${getScoreBadge(overallScore).color}`}>
              {getScoreBadge(overallScore).label}
            </Badge>
          </div>
        )}

        {/* Verification Progress */}
        {isVerifying && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verification Progress</span>
              <span>{checks.filter(c => c.status !== 'checking').length} / {checks.length}</span>
            </div>
            <Progress 
              value={(checks.filter(c => c.status !== 'checking').length / checks.length) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Individual Checks */}
        <div className="space-y-2">
          {checks.map((check) => (
            <div 
              key={check.id} 
              className={`p-3 rounded-lg border transition-all ${
                check.status === 'checking' ? 'bg-blue-50 border-blue-200' :
                check.status === 'passed' ? 'bg-green-50 border-green-200' :
                check.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <span className="font-medium text-sm">{check.name}</span>
                </div>
                {check.status !== 'checking' && (
                  <span className={`font-bold text-sm ${getScoreColor(check.score)}`}>
                    {check.score}%
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-6">
                {check.details}
              </p>
            </div>
          ))}
        </div>

        {/* Security Features Legend */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            Security Features Checked
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Visual Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Anti-Tampering
            </Badge>
            <Badge variant="outline" className="text-xs">
              <FileCheck className="h-3 w-3 mr-1" />
              Format Validation
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
