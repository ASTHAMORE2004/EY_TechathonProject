import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoApplicant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  relationship: string;
  monthlyIncome: number;
  employmentType: string;
  creditScore?: number;
  verified: boolean;
}

const RELATIONSHIPS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Child',
  'Business Partner',
  'Friend',
  'Other'
];

const EMPLOYMENT_TYPES = [
  'Salaried',
  'Self-Employed',
  'Business Owner',
  'Professional',
  'Retired',
  'Other'
];

export const CoApplicantForm = () => {
  const [coApplicants, setCoApplicants] = useState<CoApplicant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CoApplicant>>({});
  const { toast } = useToast();

  const addCoApplicant = () => {
    if (!formData.fullName || !formData.panNumber || !formData.monthlyIncome) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCoApplicant: CoApplicant = {
      id: Date.now().toString(),
      fullName: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      panNumber: formData.panNumber || '',
      relationship: formData.relationship || 'Other',
      monthlyIncome: formData.monthlyIncome || 0,
      employmentType: formData.employmentType || 'Salaried',
      creditScore: Math.floor(Math.random() * (800 - 650) + 650), // Simulated score
      verified: false
    };

    setCoApplicants([...coApplicants, newCoApplicant]);
    setFormData({});
    setShowForm(false);
    
    toast({
      title: "Co-Applicant Added",
      description: `${newCoApplicant.fullName} has been added as a co-applicant.`
    });

    // Simulate verification
    setTimeout(() => {
      setCoApplicants(prev => 
        prev.map(ca => 
          ca.id === newCoApplicant.id ? { ...ca, verified: true } : ca
        )
      );
      toast({
        title: "Verification Complete",
        description: `${newCoApplicant.fullName}'s details have been verified.`
      });
    }, 2000);
  };

  const removeCoApplicant = (id: string) => {
    setCoApplicants(coApplicants.filter(ca => ca.id !== id));
    toast({
      title: "Co-Applicant Removed",
      description: "The co-applicant has been removed from the application."
    });
  };

  const totalCombinedIncome = coApplicants.reduce((sum, ca) => sum + ca.monthlyIncome, 0);
  const avgCreditScore = coApplicants.length > 0 
    ? Math.round(coApplicants.reduce((sum, ca) => sum + (ca.creditScore || 0), 0) / coApplicants.length)
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Co-Applicant Management
          </span>
          <Badge variant="outline">
            {coApplicants.length} Co-Applicant{coApplicants.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefits Info */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <h4 className="font-semibold mb-2">💡 Why Add a Co-Applicant?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Higher loan eligibility with combined income</li>
            <li>• Better interest rates with good combined credit score</li>
            <li>• Shared responsibility for loan repayment</li>
            <li>• Tax benefits can be shared (for home loans)</li>
          </ul>
        </div>

        {/* Summary Cards */}
        {coApplicants.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Combined Monthly Income</p>
              <p className="text-lg font-bold text-primary">₹{totalCombinedIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Average Credit Score</p>
              <p className="text-lg font-bold text-blue-600">{avgCreditScore}</p>
            </div>
          </div>
        )}

        {/* Co-Applicant List */}
        <div className="space-y-3">
          {coApplicants.map((ca) => (
            <div key={ca.id} className="p-4 border rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{ca.fullName}</h4>
                    {ca.verified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Verifying...
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{ca.relationship}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeCoApplicant(ca.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">PAN:</span>
                  <span className="ml-2 font-medium">{ca.panNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Employment:</span>
                  <span className="ml-2 font-medium">{ca.employmentType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly Income:</span>
                  <span className="ml-2 font-medium">₹{ca.monthlyIncome.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Credit Score:</span>
                  <span className="ml-2 font-medium">{ca.creditScore || 'Pending'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Co-Applicant Form */}
        {showForm ? (
          <div className="p-4 border rounded-xl space-y-4">
            <h4 className="font-semibold">Add Co-Applicant</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  placeholder="Enter full name"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Relationship *</Label>
                <Select 
                  value={formData.relationship} 
                  onValueChange={(v) => setFormData({ ...formData, relationship: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((rel) => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>PAN Number *</Label>
                <Input
                  placeholder="ABCDE1234F"
                  value={formData.panNumber || ''}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label>Monthly Income (₹) *</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={formData.monthlyIncome || ''}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select 
                  value={formData.employmentType} 
                  onValueChange={(v) => setFormData({ ...formData, employmentType: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addCoApplicant}>Add Co-Applicant</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setFormData({}); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowForm(true)}
            disabled={coApplicants.length >= 3}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Co-Applicant {coApplicants.length >= 3 && '(Max 3 reached)'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
