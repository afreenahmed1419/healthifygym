-- Healthify FAQ Seed Data
-- Run this in your Supabase SQL editor to populate the faqs table.
-- Safe to re-run: deletes existing rows first.

DELETE FROM faqs;

INSERT INTO faqs (question, answer, category, keywords, is_active, sort_order) VALUES

-- ── MEMBERSHIP ────────────────────────────────────────────────────────────────
('What membership plans do you offer?',
 'We offer three main plans: Essential (gym only), Yoga (yoga only), and Combo (gym + yoga). Essential starts at ₹3,000/month for members. We also have a Lifetime membership for a one-time ₹3,000 payment and a Daily Pass at ₹250/hour.',
 'membership',
 ARRAY['membership', 'plan', 'plans', 'options', 'types', 'essential', 'yoga', 'combo'],
 true, 1),

('How much does a monthly membership cost?',
 'Monthly fees: Essential – ₹3,000 (members) / ₹3,500 (non-members). Yoga – ₹3,000 (members) / ₹3,500 (non-members). Combo (Gym + Yoga) – ₹5,000 (saves ₹1,000). All plans include locker access.',
 'membership',
 ARRAY['monthly', 'price', 'cost', 'fees', 'how much', 'rate', 'charge'],
 true, 2),

('What are the quarterly and half-yearly fees?',
 'Essential quarterly: ₹6,000 (members) / ₹9,000 (non-members). Half yearly: ₹10,000 (members) / ₹15,000 (non-members). Combo quarterly: ₹10,000 (saves ₹2,000). Combo half yearly: ₹17,500 (saves ₹2,500 + 1 week PT free).',
 'membership',
 ARRAY['quarterly', 'half yearly', 'six months', '3 months', '6 months', 'quarterly price'],
 true, 3),

('Do you offer a yearly membership?',
 'Yes! Essential yearly: ₹18,000 (members) / ₹25,000 (non-members). Yoga yearly: same as Essential. Combo yearly: ₹30,000 — that''s ₹6,000 off AND 15 days of free Personal Training!',
 'membership',
 ARRAY['yearly', 'annual', 'year', 'long term', 'one year', '12 months'],
 true, 4),

('What is the Lifetime membership?',
 'Pay ₹3,000 once — train forever! The Lifetime membership gives you full gym access for life with no recurring fees. It''s our best long-term value.',
 'membership',
 ARRAY['lifetime', 'permanent', 'one time', 'forever', 'life', 'one-time payment'],
 true, 5),

('Do you offer a daily pass or trial?',
 'Yes! A Daily Pass is ₹250 per hour — drop in anytime, no commitment needed. It''s perfect for trying the gym before joining or for occasional visits.',
 'membership',
 ARRAY['daily', 'day pass', 'drop in', 'trial', 'one day', 'single session', 'try'],
 true, 6),

('Is personal training included?',
 'PT is available as an add-on: ₹5,500/month (members) / ₹6,500/month (non-members). Combo Half Yearly includes 1 week PT free; Combo Yearly includes 15 days PT free!',
 'membership',
 ARRAY['personal training', 'PT', 'trainer', 'one on one', 'private training', 'personal trainer'],
 true, 7),

-- ── TIMINGS ───────────────────────────────────────────────────────────────────
('What are your gym timings / opening hours?',
 'We are open Monday to Saturday: 6:00 AM – 9:00 PM. Sunday: 8:00 AM – 1:00 PM. We''re open 7 days a week!',
 'timings',
 ARRAY['timings', 'hours', 'open', 'close', 'schedule', 'time', 'when', 'days', 'opening hours'],
 true, 10),

('Are you open on Sundays?',
 'Yes! We are open on Sundays from 8:00 AM to 1:00 PM. Monday to Saturday we''re open 6:00 AM to 9:00 PM.',
 'timings',
 ARRAY['sunday', 'weekend', 'open sunday', 'sunday hours'],
 true, 11),

('What time do you open in the morning?',
 'We open at 6:00 AM Monday through Saturday, and 8:00 AM on Sundays. Early morning sessions are a great way to start the day!',
 'timings',
 ARRAY['morning', 'open', 'early', '6am', 'early morning', 'start time'],
 true, 12),

-- ── CLASSES & SERVICES ────────────────────────────────────────────────────────
('What classes and programs do you offer?',
 'We offer: Strength Training (60 min), Weight Loss Programs (45 min), HIIT Burn (30 min), Yoga & Stretch (60 min), Zumba Fitness (45 min), Functional Training (60 min), Personal Coaching, and Women Wellness programs.',
 'classes',
 ARRAY['classes', 'programs', 'services', 'training', 'yoga', 'zumba', 'hiit', 'strength', 'functional', 'sessions', 'schedule'],
 true, 20),

('Do you offer yoga classes?',
 'Yes! We offer Yoga & Stretch (60-minute sessions). You can join yoga as a standalone Yoga membership or as part of our Combo plan (Gym + Yoga at ₹5,000/month).',
 'classes',
 ARRAY['yoga', 'stretch', 'flexibility', 'meditation', 'yoga class', 'yoga membership'],
 true, 21),

('Do you have Zumba classes?',
 'Absolutely! Zumba Fitness classes run for 45 minutes — fun, energetic dance cardio sessions that burn calories while you enjoy every minute.',
 'classes',
 ARRAY['zumba', 'dance', 'aerobics', 'cardio', 'dance fitness', 'fun class'],
 true, 22),

('What is HIIT? Do you offer HIIT classes?',
 'HIIT (High-Intensity Interval Training) is one of our most effective fat-burning programs. Our HIIT Burn class is 30 minutes of intense intervals that torch calories even after you''re done.',
 'classes',
 ARRAY['hiit', 'high intensity', 'interval training', 'fat burn', 'intense', 'cardio'],
 true, 23),

('Do you provide nutrition or diet guidance?',
 'Yes! We offer personalised Nutrition Guidance with custom diet plans and coaching. This is included in our Premium-tier memberships or available as an add-on with Personal Training.',
 'classes',
 ARRAY['nutrition', 'diet', 'food', 'meal plan', 'eating', 'diet plan', 'nutrition guidance'],
 true, 24),

('What is functional training?',
 'Functional Training improves everyday movement — balance, mobility, and strength for real-life activities. Our 60-minute Functional Training sessions are ideal for all fitness levels.',
 'classes',
 ARRAY['functional', 'functional training', 'mobility', 'balance', 'movement', 'everyday fitness'],
 true, 25),

-- ── GENERAL ───────────────────────────────────────────────────────────────────
('Is Healthify for women only?',
 'Yes! Healthify is 100% ladies-only. Our entire space — equipment, changing rooms, trainers — is designed exclusively for women. Train freely and confidently in a safe environment.',
 'general',
 ARRAY['women', 'ladies', 'female', 'women only', 'girls', 'exclusive', 'safe environment', 'ladies only'],
 true, 30),

('What is the age limit to join?',
 'We welcome women aged 14 to 65. Members under 18 may require parental consent. We have programs tailored for teens, adults, and seniors — everyone is welcome!',
 'general',
 ARRAY['age', 'minimum age', 'teen', 'senior', 'old', 'young', 'age limit', 'age requirement', '14', '65'],
 true, 31),

('How many trainers do you have?',
 'We have 20+ expert trainers, all experienced in women''s fitness. They specialise in strength, weight loss, yoga, functional training, and holistic wellness.',
 'general',
 ARRAY['trainers', 'staff', 'coaches', 'instructors', 'experts', 'how many trainers'],
 true, 32),

-- ── FACILITIES ────────────────────────────────────────────────────────────────
('What facilities are available?',
 'Healthify features modern cardio machines, free weights, a functional training zone, yoga studio, locker rooms, and clean changing facilities — all in a safe, women-only environment.',
 'facilities',
 ARRAY['facilities', 'equipment', 'amenities', 'what is available', 'machines', 'weights', 'studio'],
 true, 40),

('Do you have locker facilities?',
 'Yes! Secure lockers are included with all our membership plans. Keep your belongings safe while you train.',
 'facilities',
 ARRAY['locker', 'storage', 'locker room', 'safe', 'belongings', 'bag'],
 true, 41),

('Do you have two branches?',
 'Yes! Healthify has two branches, both open 6 AM – 9 PM (Mon–Sat) and 8 AM – 1 PM (Sundays). Contact us on WhatsApp for exact addresses and directions.',
 'facilities',
 ARRAY['branches', 'location', 'locations', 'two branches', 'address', 'where', 'which branch'],
 true, 42),

-- ── CONTACT & JOINING ─────────────────────────────────────────────────────────
('How do I join Healthify?',
 'You can book a session directly on our website or reach us on WhatsApp at +91 98765 43210. Our team will guide you through membership options and get you started right away!',
 'contact',
 ARRAY['join', 'enrol', 'register', 'sign up', 'start', 'how to join', 'new member'],
 true, 50),

('How do I contact Healthify?',
 'Reach us on WhatsApp at +91 98765 43210, fill the contact form on our Contact page, or visit either of our two branches. We typically respond within a few hours.',
 'contact',
 ARRAY['contact', 'reach', 'call', 'phone', 'whatsapp', 'message', 'enquiry', 'help'],
 true, 51),

('Do you offer any discounts or referral offers?',
 'We have special rates for longer-duration plans (quarterly, half-yearly, yearly) which offer significant savings. Contact us on WhatsApp for any current promotional offers!',
 'contact',
 ARRAY['discount', 'offer', 'referral', 'promo', 'deal', 'savings', 'coupon', 'special'],
 true, 52);
