-- Create expense_entries table for expense analyzer
CREATE TABLE public.expense_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create co_applicants table
CREATE TABLE public.co_applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  pan_number TEXT,
  aadhaar_number TEXT,
  relationship TEXT,
  monthly_income DECIMAL(12,2),
  employment_type TEXT,
  credit_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create application_status_history table
CREATE TABLE public.application_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investment_portfolio table
CREATE TABLE public.investment_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  fund_name TEXT NOT NULL,
  fund_type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  units DECIMAL(12,4),
  nav DECIMAL(10,4),
  risk_level TEXT,
  expected_returns DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_portfolio ENABLE ROW LEVEL SECURITY;

-- RLS policies for expense_entries
CREATE POLICY "Users can view their own expenses" ON public.expense_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON public.expense_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expense_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expense_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for co_applicants (linked via loan application)
CREATE POLICY "Users can view co-applicants for their loans" ON public.co_applicants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.loan_applications la WHERE la.id = loan_application_id AND la.user_id = auth.uid())
);
CREATE POLICY "Users can insert co-applicants for their loans" ON public.co_applicants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.loan_applications la WHERE la.id = loan_application_id AND la.user_id = auth.uid())
);

-- RLS policies for application_status_history
CREATE POLICY "Users can view status history for their loans" ON public.application_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.loan_applications la WHERE la.id = loan_application_id AND la.user_id = auth.uid())
);

-- RLS policies for investment_portfolio
CREATE POLICY "Users can view their portfolio" ON public.investment_portfolio FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users can manage their portfolio" ON public.investment_portfolio FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
);