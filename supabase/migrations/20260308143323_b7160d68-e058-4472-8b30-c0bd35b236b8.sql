
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
