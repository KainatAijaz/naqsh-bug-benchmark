
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
