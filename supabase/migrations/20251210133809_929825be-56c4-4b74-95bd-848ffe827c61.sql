-- Create enum for loan status
CREATE TYPE loan_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'sanctioned');

-- Create enum for conversation stage
CREATE TYPE conversation_stage AS ENUM ('greeting', 'needs_assessment', 'verification', 'credit_check', 'offer', 'investment_nudge', 'sanction', 'completed');

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  pan_number TEXT,
  aadhaar_number TEXT,
  employment_type TEXT,
  monthly_income DECIMAL(12,2),
  credit_score INTEGER,
  kyc_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Loan applications table
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  loan_amount DECIMAL(12,2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  interest_rate DECIMAL(5,2),
  emi_amount DECIMAL(12,2),
  purpose TEXT,
  status loan_status DEFAULT 'pending',
  sanction_letter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE SET NULL,
  stage conversation_stage DEFAULT 'greeting',
  context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Investment recommendations table (for micro-investment nudges)
CREATE TABLE public.investment_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  round_up_amount DECIMAL(10,2),
  cashback_amount DECIMAL(10,2),
  recommended_fund TEXT,
  monthly_savings_goal DECIMAL(10,2),
  accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for demo/hackathon)
CREATE POLICY "Allow public read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update customers" ON public.customers FOR UPDATE USING (true);

CREATE POLICY "Allow public read loan_applications" ON public.loan_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert loan_applications" ON public.loan_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update loan_applications" ON public.loan_applications FOR UPDATE USING (true);

CREATE POLICY "Allow public read conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update conversations" ON public.conversations FOR UPDATE USING (true);

CREATE POLICY "Allow public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read investment_recommendations" ON public.investment_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert investment_recommendations" ON public.investment_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update investment_recommendations" ON public.investment_recommendations FOR UPDATE USING (true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loan_applications_updated_at BEFORE UPDATE ON public.loan_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();