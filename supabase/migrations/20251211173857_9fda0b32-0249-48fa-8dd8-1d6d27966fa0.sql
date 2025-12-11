-- Create storage bucket for sanction letters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sanction-letters', 'sanction-letters', true);

-- Allow public read access to sanction letters
CREATE POLICY "Public can view sanction letters"
ON storage.objects FOR SELECT
USING (bucket_id = 'sanction-letters');

-- Allow service role to upload sanction letters
CREATE POLICY "Service role can upload sanction letters"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sanction-letters');