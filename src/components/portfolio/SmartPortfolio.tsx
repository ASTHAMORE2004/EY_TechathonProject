import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, PiggyBank, Shield, Zap, Target, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Fund {
  id: string;
  name: string;
  type: 'equity' | 'debt' | 'hybrid' | 'gold';
  riskLevel: 'low' | 'medium' | 'high';
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  minInvestment: number;
  allocation: number;
}

interface PortfolioGoal {
  name: string;
  target: number;
  current: number;
  deadline: string;
  monthlyRequired: number;
}

export const SmartPortfolio = () => {
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);

  const funds: Fund[] = [
    { id: '1', name: 'Tata Index Nifty 50', type: 'equity', riskLevel: 'high', returns1Y: 18.5, returns3Y: 15.2, returns5Y: 14.8, minInvestment: 500, allocation: 30 },
    { id: '2', name: 'Tata Large Cap Fund', type: 'equity', riskLevel: 'medium', returns1Y: 22.3, returns3Y: 16.8, returns5Y: 15.2, minInvestment: 500, allocation: 25 },
    { id: '3', name: 'Tata Hybrid Equity Fund', type: 'hybrid', riskLevel: 'medium', returns1Y: 14.2, returns3Y: 12.5, returns5Y: 11.8, minInvestment: 500, allocation: 20 },
    { id: '4', name: 'Tata Short Term Bond', type: 'debt', riskLevel: 'low', returns1Y: 7.5, returns3Y: 7.2, returns5Y: 7.8, minInvestment: 1000, allocation: 15 },
    { id: '5', name: 'Tata Gold Fund', type: 'gold', riskLevel: 'medium', returns1Y: 12.8, returns3Y: 10.5, returns5Y: 9.2, minInvestment: 500, allocation: 10 },
  ];

  const portfolioGoals: PortfolioGoal[] = [
    { name: 'Emergency Fund', target: 300000, current: 125000, deadline: '2024-12', monthlyRequired: 15000 },
    { name: 'Loan Prepayment', target: 200000, current: 50000, deadline: '2025-06', monthlyRequired: 8500 },
    { name: 'Vacation Fund', target: 100000, current: 35000, deadline: '2024-09', monthlyRequired: 7000 },
  ];

  const growthData = [
    { month: 'Jan', value: 50000 },
    { month: 'Feb', value: 55000 },
    { month: 'Mar', value: 52000 },
    { month: 'Apr', value: 58000 },
    { month: 'May', value: 62000 },
    { month: 'Jun', value: 68000 },
    { month: 'Jul', value: 72000 },
    { month: 'Aug', value: 75000 },
    { month: 'Sep', value: 82000 },
    { month: 'Oct', value: 88000 },
    { month: 'Nov', value: 92000 },
    { month: 'Dec', value: 100000 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  const portfolioValue = 175000;
  const monthlyReturns = 2850;
  const totalReturns = 25000;
  const returnPercentage = 16.7;

  const allocationData = [
    { name: 'Equity', value: 55, color: '#8884d8' },
    { name: 'Debt', value: 15, color: '#82ca9d' },
    { name: 'Hybrid', value: 20, color: '#ffc658' },
    { name: 'Gold', value: 10, color: '#ff7300' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100';
    }
  };

  const projectedValue = useMemo(() => {
    const rate = 0.12 / 12; // 12% annual, monthly
    const months = 60; // 5 years
    const fv = monthlyInvestment * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
    return Math.round(fv);
  }, [monthlyInvestment]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            Smart Investment Portfolio
          </span>
          <Badge className="bg-green-500">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            +{returnPercentage}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funds">Funds</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
                <p className="text-lg font-bold text-primary">₹{portfolioValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Total Returns</p>
                <p className="text-lg font-bold text-green-600">₹{totalReturns.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Monthly SIP</p>
                <p className="text-lg font-bold text-blue-600">₹{monthlyInvestment.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">5Y Projection</p>
                <p className="text-lg font-bold text-purple-600">₹{projectedValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Allocation Pie */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold mb-2">Asset Allocation</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Growth Chart */}
              <div className="p-4 border rounded-xl">
                <h4 className="font-semibold mb-2">Portfolio Growth</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funds" className="space-y-3">
            {funds.map((fund) => (
              <div key={fund.id} className="p-4 border rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{fund.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{fund.type}</Badge>
                      <Badge className={`text-xs ${getRiskColor(fund.riskLevel)}`}>{fund.riskLevel} risk</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Allocation</p>
                    <p className="font-bold">{fund.allocation}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground">1Y Returns</p>
                    <p className={`font-bold ${fund.returns1Y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fund.returns1Y > 0 ? '+' : ''}{fund.returns1Y}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground">3Y Returns</p>
                    <p className={`font-bold ${fund.returns3Y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fund.returns3Y > 0 ? '+' : ''}{fund.returns3Y}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="text-muted-foreground">5Y Returns</p>
                    <p className={`font-bold ${fund.returns5Y > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fund.returns5Y > 0 ? '+' : ''}{fund.returns5Y}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            {portfolioGoals.map((goal, index) => (
              <div key={index} className="p-4 border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold">{goal.name}</h4>
                  </div>
                  <Badge variant="outline">{goal.deadline}</Badge>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2 mb-2" />
                <div className="flex justify-between text-sm">
                  <span>₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}</span>
                  <span className="text-muted-foreground">
                    Need ₹{goal.monthlyRequired.toLocaleString()}/month
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="advisor" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                AI Investment Recommendations
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm">
                    📈 Based on your loan EMI of ₹16,500, we recommend a <strong>Round-Up SIP</strong> 
                    of ₹3,500/month (rounding EMI to ₹20,000). This can grow to ₹2.8L in 5 years!
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm">
                    💡 Your risk profile is <strong>{riskProfile}</strong>. We've optimized your 
                    portfolio with 55% equity, 20% hybrid, 15% debt, and 10% gold.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-sm">
                    🎯 Start a <strong>Loan Prepayment SIP</strong> of ₹5,000/month to build a 
                    corpus for prepaying your loan after 2 years, saving ₹35,000+ in interest!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={riskProfile === 'conservative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('conservative')}
              >
                <Shield className="h-4 w-4 mr-1" />
                Conservative
              </Button>
              <Button 
                variant={riskProfile === 'moderate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('moderate')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Moderate
              </Button>
              <Button 
                variant={riskProfile === 'aggressive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('aggressive')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Aggressive
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
