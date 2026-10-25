-- Naqsh benchmark: full database schema (all migrations in order).
-- Paste this whole file into the Supabase SQL Editor of your NEW benchmark project and run it once.

-- ===== 20260308135115_02a3a5a9-3045-4685-83e8-a45d856d334d.sql =====

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Artists table
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  specialty TEXT NOT NULL,
  bio TEXT,
  price_from INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_available_today BOOLEAN NOT NULL DEFAULT false,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artists are viewable by everyone" ON public.artists FOR SELECT USING (true);

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  occasion TEXT,
  package TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = customer_id);

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Portfolio images table
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  style_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio images are viewable by everyone" ON public.portfolio_images FOR SELECT USING (true);

-- ===== 20260308135703_5dfc7ccf-5d93-4b6a-8ff8-116b8778ae57.sql =====

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

-- ===== 20260308142327_aff4973a-02b8-44cb-9efd-f19e334b6d31.sql =====

-- 1. Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email), 'customer');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Add user_id to artists table
ALTER TABLE public.artists ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Allow artists to view bookings for their services
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = customer_id
    OR auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );

-- 4. Allow artists to update booking status
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
CREATE POLICY "Artists can update their bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = customer_id
    OR auth.uid() IN (SELECT user_id FROM public.artists WHERE id = artist_id)
  );

-- 5. Artist can update their own profile
CREATE POLICY "Artists can update their own profile"
  ON public.artists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Update trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== 20260308143323_b7160d68-e058-4472-8b30-c0bd35b236b8.sql =====

-- Add booking_id to reviews so we can track which booking was reviewed
ALTER TABLE public.reviews ADD COLUMN booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL;

-- Function to auto-update artist average rating
CREATE OR REPLACE FUNCTION public.update_artist_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.artists
  SET rating = (
    SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
    FROM public.reviews
    WHERE artist_id = NEW.artist_id
  )
  WHERE id = NEW.artist_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_artist_rating_on_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_artist_rating();

-- ===== 20260308144150_89feebc5-5d9d-4241-a0de-365a858c3061.sql =====
ALTER TABLE public.artists ADD COLUMN whatsapp_api_key text;
-- ===== 20260308144530_b581607c-284f-4e7c-afc3-bc82332d4891.sql =====

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, artist_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ===== 20260308154920_3c7d02fd-5ab1-4257-9056-410afeb8a7ae.sql =====

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  items_summary text NOT NULL,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  tracking_number text,
  stripe_session_id text,
  shipping_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

-- ===== 20260308160646_215ba24a-ef46-475a-af43-45328a1bb585.sql =====

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  price numeric NOT NULL DEFAULT 0,
  stripe_price_id text,
  short_description text,
  long_description text,
  category text NOT NULL DEFAULT 'Cones',
  is_bestseller boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  stock integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products insertable" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products updatable" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products deletable" ON public.products FOR DELETE USING (true);

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Settings insertable" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Settings updatable" ON public.site_settings FOR UPDATE USING (true);

-- ===== 20260308205711_267f100c-a961-4a1f-815f-72880c18d0e8.sql =====

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

