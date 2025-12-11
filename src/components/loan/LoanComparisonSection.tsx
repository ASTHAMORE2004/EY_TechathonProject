import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calculator,
  ArrowUpDown,
  IndianRupee,
  Percent,
  Calendar,
  PiggyBank
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface LoanOption {
  id: string;
  name: string;
  interestRate: number;
  processingFee: number;
  maxTenure: number;
  color: string;
}

const LOAN_OPTIONS: LoanOption[] = [
  { id: 'tata', name: 'Tata Capital', interestRate: 10.5, processingFee: 1.5, maxTenure: 60, color: 'hsl(217, 91%, 60%)' },
  { id: 'hdfc', name: 'HDFC Bank', interestRate: 11.25, processingFee: 2.0, maxTenure: 60, color: 'hsl(45, 93%, 58%)' },
  { id: 'icici', name: 'ICICI Bank', interestRate: 11.0, processingFee: 1.75, maxTenure: 60, color: 'hsl(142, 76%, 36%)' },
  { id: 'sbi', name: 'SBI', interestRate: 10.75, processingFee: 1.0, maxTenure: 72, color: 'hsl(199, 89%, 48%)' },
];

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(45, 93%, 58%)', 'hsl(142, 76%, 36%)', 'hsl(199, 89%, 48%)'];

function calculateEMI(principal: number, rate: number, months: number): number {
  const monthlyRate = rate / 12 / 100;
  if (monthlyRate === 0) return principal / months;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
}

function calculateTotalInterest(principal: number, rate: number, months: number): number {
  const emi = calculateEMI(principal, rate, months);
  return (emi * months) - principal;
}

export function LoanComparisonSection() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [selectedLoans, setSelectedLoans] = useState<string[]>(['tata', 'hdfc']);

  const toggleLoan = (id: string) => {
    setSelectedLoans(prev => 
      prev.includes(id) 
        ? prev.filter(l => l !== id) 
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const comparisonData = useMemo(() => {
    return LOAN_OPTIONS.filter(loan => selectedLoans.includes(loan.id)).map(loan => ({
      ...loan,
      emi: calculateEMI(loanAmount, loan.interestRate, tenure),
      totalInterest: calculateTotalInterest(loanAmount, loan.interestRate, tenure),
      processingAmount: Math.round(loanAmount * loan.processingFee / 100),
      totalPayable: loanAmount + calculateTotalInterest(loanAmount, loan.interestRate, tenure) + Math.round(loanAmount * loan.processingFee / 100),
    }));
  }, [loanAmount, tenure, selectedLoans]);

  // Generate amortization schedule for chart
  const amortizationData = useMemo(() => {
    const data = [];
    for (let month = 1; month <= tenure; month++) {
      const entry: any = { month: `M${month}` };
      comparisonData.forEach(loan => {
        const monthlyRate = loan.interestRate / 12 / 100;
        let balance = loanAmount;
        for (let m = 1; m < month; m++) {
          const interest = balance * monthlyRate;
          const principal = loan.emi - interest;
          balance -= principal;
        }
        entry[loan.name] = Math.max(0, Math.round(balance));
      });
      data.push(entry);
    }
    // Sample every few months for readability
    return data.filter((_, i) => i === 0 || (i + 1) % Math.ceil(tenure / 12) === 0 || i === tenure - 1);
  }, [comparisonData, tenure, loanAmount]);

  // Interest vs Principal breakdown
  const breakdownData = comparisonData.map(loan => ({
    name: loan.name,
    Principal: loanAmount,
    Interest: loan.totalInterest,
    'Processing Fee': loan.processingAmount,
  }));

  // Pie chart data for best option
  const bestOption = comparisonData.reduce((min, loan) => 
    loan.totalPayable < min.totalPayable ? loan : min, comparisonData[0]);

  const savingsData = comparisonData.map(loan => ({
    name: loan.name,
    value: loan.totalPayable,
    savings: bestOption ? loan.totalPayable - bestOption.totalPayable : 0,
  }));

  return (
    <section className="py-20 px-4 bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BarChart3 size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">Smart Comparison</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Compare & <span className="text-gradient-accent">Save</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time loan comparison to find the best deal. Adjust amount and tenure to see how different lenders stack up.
          </p>
        </div>

        {/* Controls */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-foreground font-medium">
                  <IndianRupee size={18} className="text-primary" />
                  Loan Amount
                </label>
                <span className="text-2xl font-display font-bold text-primary">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(v) => setLoanAmount(v[0])}
                min={100000}
                max={5000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>₹1L</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-foreground font-medium">
                  <Calendar size={18} className="text-accent" />
                  Tenure
                </label>
                <span className="text-2xl font-display font-bold text-accent">
                  {tenure} months
                </span>
              </div>
              <Slider
                value={[tenure]}
                onValueChange={(v) => setTenure(v[0])}
                min={12}
                max={72}
                step={6}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>12 months</span>
                <span>72 months</span>
              </div>
            </div>
          </div>

          {/* Lender Selection */}
          <div>
            <label className="block text-foreground font-medium mb-4">Select Lenders to Compare (max 4)</label>
            <div className="flex flex-wrap gap-3">
              {LOAN_OPTIONS.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => toggleLoan(loan.id)}
                  className={cn(
                    'px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2',
                    selectedLoans.includes(loan.id)
                      ? 'text-foreground border-2'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                  style={{
                    borderColor: selectedLoans.includes(loan.id) ? loan.color : 'transparent',
                    backgroundColor: selectedLoans.includes(loan.id) ? `${loan.color}20` : undefined,
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: loan.color }}
                  />
                  {loan.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {comparisonData.map((loan, index) => (
            <div
              key={loan.id}
              className={cn(
                'glass rounded-2xl p-6 relative overflow-hidden animate-fade-up',
                bestOption?.id === loan.id && 'ring-2 ring-success'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {bestOption?.id === loan.id && (
                <div className="absolute top-0 right-0 bg-success text-success-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                  Best Deal
                </div>
              )}
              <div 
                className="w-3 h-3 rounded-full mb-3" 
                style={{ backgroundColor: loan.color }}
              />
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">{loan.name}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Interest Rate</span>
                  <span className="text-foreground font-medium">{loan.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Monthly EMI</span>
                  <span className="text-primary font-bold">₹{loan.emi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Total Interest</span>
                  <span className="text-warning font-medium">₹{loan.totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Processing Fee</span>
                  <span className="text-muted-foreground">₹{loan.processingAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-foreground font-medium">Total Payable</span>
                    <span className="text-xl font-display font-bold text-foreground">
                      ₹{loan.totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        {comparisonData.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Outstanding Balance Chart */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Outstanding Balance Over Time
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={amortizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(215, 20%, 55%)" 
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(215, 20%, 55%)" 
                      fontSize={12}
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(222, 47%, 7%)', 
                        border: '1px solid hsl(217, 33%, 17%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    />
                    <Legend />
                    {comparisonData.map((loan) => (
                      <Area
                        key={loan.id}
                        type="monotone"
                        dataKey={loan.name}
                        stroke={loan.color}
                        fill={`${loan.color}40`}
                        strokeWidth={2}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown Chart */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Calculator size={20} className="text-accent" />
                Total Cost Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(215, 20%, 55%)" 
                      fontSize={12}
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(215, 20%, 55%)" 
                      fontSize={12}
                      width={90}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(222, 47%, 7%)', 
                        border: '1px solid hsl(217, 33%, 17%)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    />
                    <Legend />
                    <Bar dataKey="Principal" stackId="a" fill="hsl(217, 91%, 60%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Interest" stackId="a" fill="hsl(45, 93%, 58%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Processing Fee" stackId="a" fill="hsl(215, 20%, 55%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Savings Summary */}
        {bestOption && comparisonData.length >= 2 && (
          <div className="mt-8 glass rounded-2xl p-6 bg-success/5 border-success/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <PiggyBank size={24} className="text-success" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  Best Choice: {bestOption.name}
                </h3>
                <p className="text-muted-foreground">
                  Save up to ₹{Math.max(...savingsData.map(s => s.savings)).toLocaleString('en-IN')} compared to other lenders with the same loan amount and tenure.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
