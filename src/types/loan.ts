export type LoanStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'sanctioned';

export type ConversationStage = 
  | 'greeting' 
  | 'needs_assessment' 
  | 'verification' 
  | 'credit_check' 
  | 'offer' 
  | 'investment_nudge' 
  | 'sanction' 
  | 'completed';

export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  pan_number?: string;
  aadhaar_number?: string;
  employment_type?: string;
  monthly_income?: number;
  credit_score?: number;
  kyc_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoanApplication {
  id: string;
  customer_id: string;
  loan_amount: number;
  tenure_months: number;
  interest_rate?: number;
  emi_amount?: number;
  purpose?: string;
  status: LoanStatus;
  sanction_letter_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  customer_id?: string;
  loan_application_id?: string;
  stage: ConversationStage;
  context: ConversationContext;
  created_at: string;
  updated_at: string;
}

export interface ConversationContext {
  customerName?: string;
  loanAmount?: number;
  tenure?: number;
  interestRate?: number;
  emi?: number;
  creditScore?: number;
  kycVerified?: boolean;
  purpose?: string;
  employmentType?: string;
  monthlyIncome?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent_type?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface InvestmentRecommendation {
  id: string;
  customer_id: string;
  loan_application_id: string;
  round_up_amount?: number;
  cashback_amount?: number;
  recommended_fund?: string;
  monthly_savings_goal?: number;
  accepted: boolean;
  created_at: string;
}

export interface LoanOffer {
  tenure: number;
  interestRate: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
}