import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  ArrowUpRight,
  Coins,
  LineChart,
  Wallet,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface InvestmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emiAmount?: number;
  loanAmount?: number;
  tenureMonths?: number;
}

interface InvestmentPlan {
  roundUpEnabled: boolean;
  roundUpAmount: number;
  cashbackSIPEnabled: boolean;
  monthlySavingsGoal: number;
  selectedFund: string;
}

const MUTUAL_FUNDS = [
  { id: 'equity-large', name: 'Tata Large Cap Fund', returns: '12.5%', risk: 'Moderate' },
  { id: 'equity-flexi', name: 'Tata Flexi Cap Fund', returns: '15.2%', risk: 'Moderate-High' },
  { id: 'debt-short', name: 'Tata Short Term Bond', returns: '7.8%', risk: 'Low' },
  { id: 'hybrid-balanced', name: 'Tata Balanced Advantage', returns: '10.5%', risk: 'Moderate' },
];

export function InvestmentModal({
  open,
  onOpenChange,
  emiAmount = 15000,
  loanAmount = 500000,
  tenureMonths = 36
}: InvestmentModalProps) {
  const [plan, setPlan] = useState<InvestmentPlan>({
    roundUpEnabled: true,
    roundUpAmount: 100,
    cashbackSIPEnabled: true,
    monthlySavingsGoal: 2000,
    selectedFund: 'equity-large',
  });

  const roundedEMI = Math.ceil(emiAmount / plan.roundUpAmount) * plan.roundUpAmount;
  const roundUpInvestment = roundedEMI - emiAmount;
  const cashbackAmount = Math.round(emiAmount * 0.005); // 0.5% cashback
  
  const totalMonthlyInvestment = 
    (plan.roundUpEnabled ? roundUpInvestment : 0) + 
    (plan.cashbackSIPEnabled ? cashbackAmount : 0) +
    plan.monthlySavingsGoal;

  // Calculate projected wealth (simple compound interest approximation)
  const annualReturn = 0.12; // 12% average
  const monthlyReturn = annualReturn / 12;
  const projectedWealth = totalMonthlyInvestment * 
    ((Math.pow(1 + monthlyReturn, tenureMonths) - 1) / monthlyReturn);

  const handleActivate = () => {
    toast.success("🎉 Investment plan activated! Your wealth journey begins now.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Smart Investment & Savings Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Intro Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <h3 className="font-semibold text-lg mb-1">Build Wealth While Repaying</h3>
            <p className="text-sm text-muted-foreground">
              Turn your loan EMIs into an opportunity to save and invest. Small amounts today can grow into significant wealth!
            </p>
          </div>

          {/* Round-Up Feature */}
          <div className={cn(
            "p-5 rounded-xl border transition-all",
            plan.roundUpEnabled ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-border"
          )}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">EMI Round-Up</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Round up your EMI to ₹{roundedEMI.toLocaleString('en-IN')} and invest ₹{roundUpInvestment} monthly
                  </p>
                </div>
              </div>
              <Switch
                checked={plan.roundUpEnabled}
                onCheckedChange={(checked) => setPlan(prev => ({ ...prev, roundUpEnabled: checked }))}
              />
            </div>
            
            {plan.roundUpEnabled && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <Label className="text-sm">Round to nearest:</Label>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      size="sm"
                      variant={plan.roundUpAmount === amount ? "default" : "outline"}
                      onClick={() => setPlan(prev => ({ ...prev, roundUpAmount: amount }))}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cashback SIP Feature */}
          <div className={cn(
            "p-5 rounded-xl border transition-all",
            plan.cashbackSIPEnabled ? "bg-green-500/10 border-green-500/30" : "bg-muted/30 border-border"
          )}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Cashback SIP</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get 0.5% cashback on every EMI (₹{cashbackAmount}/month) auto-invested in mutual funds
                  </p>
                </div>
              </div>
              <Switch
                checked={plan.cashbackSIPEnabled}
                onCheckedChange={(checked) => setPlan(prev => ({ ...prev, cashbackSIPEnabled: checked }))}
              />
            </div>
          </div>

          {/* Monthly Savings Goal */}
          <div className="p-5 rounded-xl border bg-muted/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Additional Monthly SIP</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Set an additional monthly savings goal
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  ₹{plan.monthlySavingsGoal.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <Slider
                value={[plan.monthlySavingsGoal]}
                onValueChange={([value]) => setPlan(prev => ({ ...prev, monthlySavingsGoal: value }))}
                max={10000}
                min={0}
                step={500}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>

          {/* Fund Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              Select Investment Fund
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {MUTUAL_FUNDS.map((fund) => (
                <button
                  key={fund.id}
                  onClick={() => setPlan(prev => ({ ...prev, selectedFund: fund.id }))}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    plan.selectedFund === fund.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/30 border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{fund.name}</p>
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-green-500">{fund.returns} returns</span>
                        <span className="text-muted-foreground">{fund.risk}</span>
                      </div>
                    </div>
                    {plan.selectedFund === fund.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Investment Summary
            </h4>
            
            <div className="space-y-3">
              {plan.roundUpEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Round-Up Investment</span>
                  <span className="font-medium">₹{roundUpInvestment}/month</span>
                </div>
              )}
              {plan.cashbackSIPEnabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cashback SIP</span>
                  <span className="font-medium">₹{cashbackAmount}/month</span>
                </div>
              )}
              {plan.monthlySavingsGoal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Additional SIP</span>
                  <span className="font-medium">₹{plan.monthlySavingsGoal.toLocaleString('en-IN')}/month</span>
                </div>
              )}
              
              <div className="pt-3 border-t border-primary/30">
                <div className="flex justify-between">
                  <span className="font-medium">Total Monthly Investment</span>
                  <span className="font-bold text-primary">
                    ₹{totalMonthlyInvestment.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/50 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Projected Wealth (by loan end)</span>
                </div>
                <p className="text-3xl font-bold text-green-500">
                  ₹{Math.round(projectedWealth).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  *Assuming 12% average annual returns. Actual returns may vary.
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleActivate} className="w-full bg-gradient-primary" size="lg">
            <PiggyBank className="w-5 h-5 mr-2" />
            Activate Investment Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}