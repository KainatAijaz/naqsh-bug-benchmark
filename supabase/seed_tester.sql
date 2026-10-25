-- Run AFTER you have signed up in the app with a tester email.
-- 1) Replace YOUR_TESTER_EMAIL below (twice) with the email you signed up with.
--    Note: Supabase rejects reserved domains such as .test or .example; use a real-looking address (e.g. a Gmail plus-address).
-- 2) Email confirmation must be OFF in Supabase Auth settings.
-- This gives that user one completed booking (so the Review flow can be tested) and one pending booking.
insert into public.bookings (customer_id, artist_id, date, package, status, booking_total, commission_rate, commission_amount)
select u.id, 'a0000000-0000-4000-8000-000000000001', current_date - 7, 'Full Hand', 'completed', 136, 10, 14
from auth.users u where u.email = 'YOUR_TESTER_EMAIL';

insert into public.bookings (customer_id, artist_id, date, package, status, booking_total, commission_rate, commission_amount)
select u.id, 'a0000000-0000-4000-8000-000000000004', current_date + 14, 'Simple', 'pending', 60, 10, 6
from auth.users u where u.email = 'YOUR_TESTER_EMAIL';
