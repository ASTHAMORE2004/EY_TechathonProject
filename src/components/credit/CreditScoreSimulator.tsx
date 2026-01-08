import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CreditFactor {
  name: string;
  value: number;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  suggestion: string;
}

export const CreditScoreSimulator = () => {
  const [paymentHistory, setPaymentHistory] = useState(85);
  const [creditUtilization, setCreditUtilization] = useState(30);
  const [creditAge, setCreditAge] = useState(5);
  const [creditMix, setCreditMix] = useState(3);
  const [newCredit, setNewCredit] = useState(2);

  const calculateScore = useMemo(() => {
    // Weighted CIBIL-like score calculation (300-900 range)
    const paymentScore = (paymentHistory / 100) * 35;
    const utilizationScore = ((100 - creditUtilization) / 100) * 30;
    const ageScore = Math.min(creditAge / 10, 1) * 15;
    const mixScore = Math.min(creditMix / 5, 1) * 10;
    const newCreditScore = Math.max((5 - newCredit) / 5, 0) * 10;

    const totalPercentage = paymentScore + utilizationScore + ageScore + mixScore + newCreditScore;
    const score = Math.round(300 + (totalPercentage * 6)); // Scale to 300-900

    return Math.min(900, Math.max(300, score));
  }, [paymentHistory, creditUtilization, creditAge, creditMix, newCredit]);

  const getScoreCategory = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600' };
    if (score >= 700) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' };
    if (score >= 650) return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (score >= 550) return { label: 'Poor', color: 'bg-orange-500', textColor: 'text-orange-600' };
    return { label: 'Very Poor', color: 'bg-red-500', textColor: 'text-red-600' };
  };

  const getInterestRate = (score: number) => {
    if (score >= 800) return 10.5;
    if (score >= 750) return 11.5;
    if (score >= 700) return 12.5;
    if (score >= 650) return 14.5;
    if (score >= 600) return 16.5;
    return 18.5;
  };

  const factors: CreditFactor[] = [
    {
      name: 'Payment History',
      value: paymentHistory,
      weight: 35,
      impact: paymentHistory >= 90 ? 'positive' : paymentHistory >= 70 ? 'neutral' : 'negative',
      suggestion: paymentHistory < 90 ? 'Pay all EMIs on time to improve this factor' : 'Excellent! Keep up the timely payments'
    },
    {
      name: 'Credit Utilization',
      value: creditUtilization,
      weight: 30,
      impact: creditUtilization <= 30 ? 'positive' : creditUtilization <= 50 ? 'neutral' : 'negative',
      suggestion: creditUtilization > 30 ? 'Keep credit card usage below 30% of limit' : 'Great credit utilization ratio!'
    },
    {
      name: 'Credit Age',
      value: creditAge,
      weight: 15,
      impact: creditAge >= 5 ? 'positive' : creditAge >= 2 ? 'neutral' : 'negative',
      suggestion: creditAge < 5 ? 'Maintain older accounts to build credit history' : 'Good credit history length'
    },
    {
      name: 'Credit Mix',
      value: creditMix,
      weight: 10,
      impact: creditMix >= 3 ? 'positive' : creditMix >= 2 ? 'neutral' : 'negative',
      suggestion: creditMix < 3 ? 'Having diverse credit types helps your score' : 'Healthy credit mix'
    },
    {
      name: 'New Credit Inquiries',
      value: newCredit,
      weight: 10,
      impact: newCredit <= 2 ? 'positive' : newCredit <= 4 ? 'neutral' : 'negative',
      suggestion: newCredit > 2 ? 'Limit new credit applications in short periods' : 'Minimal recent inquiries'
    }
  ];

  const scoreCategory = getScoreCategory(calculateScore);
  const estimatedRate = getInterestRate(calculateScore);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Credit Score Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
          <div className="text-6xl font-bold mb-2" style={{ color: `hsl(var(--primary))` }}>
            {calculateScore}
          </div>
          <Badge className={`${scoreCategory.color} text-white`}>
            {scoreCategory.label}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Estimated Interest Rate: <span className="font-semibold">{estimatedRate}%</span> p.a.
          </p>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment History (On-time payments)</span>
              <span className="font-medium">{paymentHistory}%</span>
            </div>
            <Slider
              value={[paymentHistory]}
              onValueChange={(v) => setPaymentHistory(v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credit Utilization (% of limit used)</span>
              <span className="font-medium">{creditUtilization}%</span>
            </div>
            <Slider
              value={[creditUtilization]}
              onValueChange={(v) => setCreditUtilization(v[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credit Age (Years)</span>
              <span className="font-medium">{creditAge} years</span>
            </div>
            <Slider
              value={[creditAge]}
              onValueChange={(v) => setCreditAge(v[0])}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credit Mix (Types of credit)</span>
              <span className="font-medium">{creditMix} types</span>
            </div>
            <Slider
              value={[creditMix]}
              onValueChange={(v) => setCreditMix(v[0])}
              min={0}
              max={5}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recent Credit Inquiries (Last 6 months)</span>
              <span className="font-medium">{newCredit}</span>
            </div>
            <Slider
              value={[newCredit]}
              onValueChange={(v) => setNewCredit(v[0])}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Factor Analysis */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Info className="h-4 w-4" />
            Factor Analysis
          </h4>
          {factors.map((factor) => (
            <div key={factor.name} className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{factor.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{factor.weight}% weight</span>
                  {factor.impact === 'positive' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {factor.impact === 'negative' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {factor.impact === 'neutral' && <TrendingDown className="h-4 w-4 text-yellow-500" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{factor.suggestion}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
