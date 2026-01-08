import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  FileCheck, 
  Search, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface StatusStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  timestamp?: string;
  notes?: string;
}

interface ApplicationStatusTrackerProps {
  applicationId?: string;
  currentStatus?: string;
}

export const ApplicationStatusTracker = ({ 
  applicationId = 'LOAN-2024-001234',
  currentStatus = 'verification'
}: ApplicationStatusTrackerProps) => {
  const [steps, setSteps] = useState<StatusStep[]>([
    {
      id: 'application',
      name: 'Application Submitted',
      description: 'Loan application received',
      icon: <ClipboardList className="h-5 w-5" />,
      status: 'completed',
      timestamp: '2024-01-10 10:30 AM',
      notes: 'Application submitted with all documents'
    },
    {
      id: 'documents',
      name: 'Document Verification',
      description: 'KYC and income documents',
      icon: <FileCheck className="h-5 w-5" />,
      status: 'completed',
      timestamp: '2024-01-10 11:45 AM',
      notes: 'All documents verified successfully'
    },
    {
      id: 'verification',
      name: 'Background Verification',
      description: 'Employment & address check',
      icon: <Search className="h-5 w-5" />,
      status: 'current',
      timestamp: '2024-01-10 02:00 PM',
      notes: 'Verification in progress'
    },
    {
      id: 'credit',
      name: 'Credit Assessment',
      description: 'Credit score & risk analysis',
      icon: <CreditCard className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'sanction',
      name: 'Loan Sanction',
      description: 'Offer generation & approval',
      icon: <FileText className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'disbursement',
      name: 'Disbursement',
      description: 'Fund transfer to account',
      icon: <CheckCircle className="h-5 w-5" />,
      status: 'pending'
    }
  ]);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500 animate-pulse';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'current':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Action Required</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const estimatedCompletion = () => {
    const currentIndex = steps.findIndex(s => s.status === 'current');
    const remainingSteps = steps.length - currentIndex - 1;
    const hoursPerStep = 4; // Average hours per step
    return `${remainingSteps * hoursPerStep} hours`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Application Status
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            {applicationId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedSteps} of {steps.length} steps completed</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Est. completion: {estimatedCompletion()}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative pl-8 pb-6 last:pb-0">
              {/* Vertical Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-3 top-6 w-0.5 h-full ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Status Dot */}
              <div 
                className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}
              >
                {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                {step.status === 'current' && <Clock className="h-4 w-4 text-white" />}
                {step.status === 'rejected' && <AlertCircle className="h-4 w-4 text-white" />}
              </div>

              {/* Step Content */}
              <div className={`p-3 rounded-lg ${step.status === 'current' ? 'bg-blue-50 border border-blue-200' : 'bg-muted/50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <h4 className="font-semibold text-sm">{step.name}</h4>
                  </div>
                  {getStatusBadge(step.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{step.description}</p>
                {step.timestamp && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {step.timestamp}
                  </p>
                )}
                {step.notes && (
                  <p className="text-xs mt-1 p-2 bg-background rounded">
                    📝 {step.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              📞 Call Support
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              💬 Chat with Aria
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              📧 Email Us
            </Badge>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="p-4 border rounded-xl space-y-2">
          <h4 className="font-semibold">Loan Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requested Amount:</span>
              <span className="font-medium">₹5,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tenure:</span>
              <span className="font-medium">36 months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest Rate:</span>
              <span className="font-medium">11.5% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. EMI:</span>
              <span className="font-medium">₹16,497</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
