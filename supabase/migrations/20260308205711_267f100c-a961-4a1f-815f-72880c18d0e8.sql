
-- Add pricing fields to artists
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS registration_paid boolean NOT NULL DEFAULT false;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone;

-- Add commission fields to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_total numeric NOT NULL DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS commission_rate numeric NOT NULL DEFAULT 10;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS commission_amount numeric NOT NULL DEFAULT 0;

-- Add platform_payments table for tracking registration fees and featured listing payments
CREATE TABLE public.platform_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  payment_type text NOT NULL, -- 'registration' or 'featured'
  amount numeric NOT NULL DEFAULT 0,
  stripe_session_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform payments viewable by everyone" ON public.platform_payments FOR SELECT USING (true);
CREATE POLICY "Platform payments insertable" ON public.platform_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Platform payments updatable" ON public.platform_payments FOR UPDATE USING (true);

-- Seed site_settings for pricing config
INSERT INTO public.site_settings (key, value) VALUES ('commission_rate', '10') ON CONFLICT DO NOTHING;
INSERT INTO public.site_settings (key, value) VALUES ('registration_fee', '50') ON CONFLICT DO NOTHING;
INSERT INTO public.site_settings (key, value) VALUES ('featured_fee_weekly', '50') ON CONFLICT DO NOTHING;
