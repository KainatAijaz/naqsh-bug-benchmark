-- Naqsh benchmark seed data (fictional artists, no real people). Run AFTER schema.sql.
-- A database trigger recomputes each artist's rating from the reviews below, so ratings are
-- deliberately varied decimals (rounding bugs observable) and prices/availability are mixed (sort and filter bugs observable).
-- Expected ratings: Zara 5.0, Layla 4.9, Fatima 4.8, Amira 4.7, Priya 4.4, Huda 4.3, Sana 4.2, Noor 3.5.

insert into public.artists (id, name, city, country, specialty, bio, price_from, rating, is_verified, is_available_today, profile_image_url, registration_paid)
values
 ('a0000000-0000-4000-8000-000000000001','Amira Noor','Dubai','UAE','Bridal Henna','Bridal specialist with ten years of experience.',80,4.7,true,true,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000002','Priya Sharma','London','United Kingdom','Indo-Pak Traditional','Traditional patterns for weddings and festivals.',45,4.4,true,false,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000003','Huda Rahman','Toronto','Canada','Arabic Henna','Bold Arabic floral designs.',35,4.3,true,true,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000004','Fatima Zain','Karachi','Pakistan','Bridal Henna','Full bridal sets, hands to elbows and feet.',60,4.8,true,false,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000005','Sana Iqbal','Budapest','Hungary','Minimalist','Clean, modern and delicate designs.',25,4.2,false,true,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000006','Layla Haddad','Riyadh','Saudi Arabia','Arabic Henna','Quick, elegant Arabic designs.',30,4.9,true,false,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000007','Noor Ansari','Houston','United States','Fusion','Mixes Indian, Arabic and contemporary styles.',55,3.5,false,true,'/placeholder.svg',true),
 ('a0000000-0000-4000-8000-000000000008','Zara Mehta','Delhi','India','Indo-Pak Traditional','Festival and Karwa Chauth specialist.',40,5.0,true,false,'/placeholder.svg',true)
on conflict (id) do nothing;

insert into public.portfolio_images (artist_id, image_url, style_tag)
select id, '/placeholder.svg', specialty || ' sample 1' from public.artists where id::text like 'a0000000-%'
union all
select id, '/placeholder.svg', specialty || ' sample 2' from public.artists where id::text like 'a0000000-%';

insert into public.reviews (artist_id, customer_name, rating, comment)
values
 ('a0000000-0000-4000-8000-000000000001','Sample Customer A',5,'Exactly what I asked for.'),
 ('a0000000-0000-4000-8000-000000000001','Sample Customer B',5,'Lovely design, the stain lasted a week.'),
 ('a0000000-0000-4000-8000-000000000001','Sample Customer C',4,'Happy overall.'),
 ('a0000000-0000-4000-8000-000000000001','Sample Customer D',5,'Would book again.'),
 ('a0000000-0000-4000-8000-000000000001','Sample Customer E',4,'Good value.'),
 ('a0000000-0000-4000-8000-000000000001','Sample Customer F',5,'Neat and fast.'),
 ('a0000000-0000-4000-8000-000000000002','Sample Customer G',5,'Lovely design, the stain lasted a week.'),
 ('a0000000-0000-4000-8000-000000000002','Sample Customer H',4,'Happy overall.'),
 ('a0000000-0000-4000-8000-000000000002','Sample Customer I',4,'Great design, small delay at the start.'),
 ('a0000000-0000-4000-8000-000000000002','Sample Customer J',5,'Loved it.'),
 ('a0000000-0000-4000-8000-000000000002','Sample Customer K',4,'Nice work, a bit rushed.'),
 ('a0000000-0000-4000-8000-000000000003','Sample Customer L',4,'Happy overall.'),
 ('a0000000-0000-4000-8000-000000000003','Sample Customer M',5,'Would book again.'),
 ('a0000000-0000-4000-8000-000000000003','Sample Customer N',4,'Good value.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer O',5,'Would book again.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer P',5,'Loved it.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer Q',5,'Neat and fast.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer R',4,'Happy overall.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer S',5,'Exactly what I asked for.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer T',5,'Lovely design, the stain lasted a week.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer U',4,'Nice work, a bit rushed.'),
 ('a0000000-0000-4000-8000-000000000004','Sample Customer V',5,'Would book again.'),
 ('a0000000-0000-4000-8000-000000000005','Sample Customer W',5,'Loved it.'),
 ('a0000000-0000-4000-8000-000000000005','Sample Customer X',4,'Nice work, a bit rushed.'),
 ('a0000000-0000-4000-8000-000000000005','Sample Customer Y',4,'Happy overall.'),
 ('a0000000-0000-4000-8000-000000000005','Sample Customer Z',5,'Exactly what I asked for.'),
 ('a0000000-0000-4000-8000-000000000005','Sample Customer A1',3,'Nice but pricey.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer B1',5,'Neat and fast.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer C1',5,'Beautiful work, careful and on time.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer D1',5,'Exactly what I asked for.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer E1',5,'Lovely design, the stain lasted a week.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer F1',4,'Nice work, a bit rushed.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer G1',5,'Would book again.'),
 ('a0000000-0000-4000-8000-000000000006','Sample Customer H1',5,'Loved it.'),
 ('a0000000-0000-4000-8000-000000000007','Sample Customer I1',3,'Nice but pricey.'),
 ('a0000000-0000-4000-8000-000000000007','Sample Customer J1',4,'Great design, small delay at the start.'),
 ('a0000000-0000-4000-8000-000000000007','Sample Customer K1',3,'Nice but pricey.'),
 ('a0000000-0000-4000-8000-000000000007','Sample Customer L1',4,'Nice work, a bit rushed.'),
 ('a0000000-0000-4000-8000-000000000008','Sample Customer M1',5,'Exactly what I asked for.'),
 ('a0000000-0000-4000-8000-000000000008','Sample Customer N1',5,'Lovely design, the stain lasted a week.'),
 ('a0000000-0000-4000-8000-000000000008','Sample Customer O1',5,'Very professional.'),
 ('a0000000-0000-4000-8000-000000000008','Sample Customer P1',5,'Would book again.');
