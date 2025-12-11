-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kyc-documents', 'kyc-documents', false);

-- Allow authenticated users to upload their documents
CREATE POLICY "Users can upload kyc documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'kyc-documents');

-- Allow service role and users to read their documents
CREATE POLICY "Users can view kyc documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'kyc-documents');

-- Add document tracking columns to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pan_document_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS aadhaar_document_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS income_document_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_score_1000 INTEGER;