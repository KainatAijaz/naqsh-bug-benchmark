
-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Allow anyone to view portfolio images
CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Allow anyone to upload portfolio images (no auth required for registration)
CREATE POLICY "Anyone can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

-- Add phone column to artists table
ALTER TABLE public.artists ADD COLUMN phone TEXT;

-- Add specialty options and make INSERT available for registration
CREATE POLICY "Anyone can register as artist"
ON public.artists FOR INSERT
WITH CHECK (true);
