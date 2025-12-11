import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Banknote, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Plus,
  User,
  LogOut,
  Loader2,
  TrendingUp
} from 'lucide-react';

interface LoanApplication {
  id: string;
  loan_amount: number;
  tenure_months: number;
  interest_rate: number | null;
  emi_amount: number | null;
  purpose: string | null;
  status: string;
  sanction_letter_url: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLoans();
    }
  }, [user]);

  const fetchLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoans(data || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setIsLoadingLoans(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sanctioned':
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sanctioned':
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Banknote className="w-8 h-8 text-primary" />
            <span className="text-xl font-display font-bold text-foreground">Tata Capital</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Track your loan applications and manage your financial journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="glass rounded-2xl p-6 hover:border-primary/30 transition-all text-left group"
          >
            <Plus className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Apply for New Loan</h3>
            <p className="text-sm text-muted-foreground">Start a new loan application with AI assistance</p>
            <ArrowRight className="w-5 h-5 text-primary mt-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="glass rounded-2xl p-6">
            <FileText className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Active Applications</h3>
            <p className="text-3xl font-bold text-accent">{loans.filter(l => l.status !== 'rejected').length}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Total Sanctioned</h3>
            <p className="text-3xl font-bold text-green-500">
              ₹{loans
                .filter(l => l.status === 'sanctioned' || l.status === 'approved')
                .reduce((sum, l) => sum + l.loan_amount, 0)
                .toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Loan Applications */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Your Loan Applications
          </h2>

          {isLoadingLoans ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">Start your first loan application with our AI assistant</p>
              <Button onClick={() => navigate('/')} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(loan.status)}
                    <div>
                      <p className="font-semibold text-foreground">
                        ₹{loan.loan_amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loan.tenure_months} months • {loan.purpose || 'Personal Loan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      {loan.emi_amount && (
                        <p className="text-sm text-foreground">
                          EMI: ₹{loan.emi_amount.toLocaleString('en-IN')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(loan.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium border capitalize',
                      getStatusColor(loan.status)
                    )}>
                      {loan.status.replace('_', ' ')}
                    </span>

                    {loan.sanction_letter_url && (
                      <a
                        href={loan.sanction_letter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}