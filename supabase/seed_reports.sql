-- ============================================================================
-- SafeCircle AI — Community Reports Seed Script
-- Populates 20 realistic safety reports around Sector 62, Noida, India.
-- 
-- How to run:
-- Copy the contents of this file and paste them into your Supabase SQL Editor,
-- then click "Run". Make sure you have signed up at least one user first.
-- ============================================================================

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the first registered user to link the reports to
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users. Please register/sign up an account in the SafeCircle AI app first!';
  END IF;

  -- Clear any existing seed reports if needed (optional)
  -- DELETE FROM public.community_reports WHERE title LIKE '%(Seed)%';

  -- Insert 20 realistic safety reports spread out over the last 7 days
  INSERT INTO public.community_reports 
    (user_id, category, title, description, location_text, lat, lng, severity, status, verified_count, created_at)
  VALUES
    (
      v_user_id, 
      'poor-lighting', 
      'Dimly lit walk from Sector 62 Metro (Seed)', 
      'The pathway leading from Exit 2 of the Sector 62 metro station toward the commercial hub has three consecutive broken streetlights. Very dark after 8 PM.', 
      'Sector 62 Metro Station Exit 2', 
      28.6291, 
      77.3751, 
      'medium', 
      'approved', 
      6, 
      now() - interval '3 hours'
    ),
    (
      v_user_id, 
      'harassment', 
      'Eve-teasing reported near Sector 62 market (Seed)', 
      'Two men on a motorcycle have been passing remarks at women walking alone near the Block B market entrance during evening hours.', 
      'Sector 62 Block B Market', 
      28.6253, 
      77.3689, 
      'high', 
      'approved', 
      12, 
      now() - interval '9 hours'
    ),
    (
      v_user_id, 
      'suspicious-activity', 
      'Unmarked vehicle idling behind college (Seed)', 
      'A dark sedan with tinted windows has been parked in the isolated lane behind the college campus for the last three nights between 9 PM and midnight.', 
      'Lane behind JIIT Sector 62', 
      28.6315, 
      77.3702, 
      'medium', 
      'approved', 
      3, 
      now() - interval '14 hours'
    ),
    (
      v_user_id, 
      'unsafe-area', 
      'Isolated construction stretch near complex (Seed)', 
      'The road near the new under-construction commercial complex is completely deserted after 7 PM. No police patrolling observed here.', 
      'Sector 62 Commercial Zone', 
      28.6221, 
      77.3768, 
      'medium', 
      'approved', 
      5, 
      now() - interval '1 day 2 hours'
    ),
    (
      v_user_id, 
      'broken-streetlight', 
      'Flickering streetlight near park corner (Seed)', 
      'The streetlight directly opposite the main gate of the public park flickers constantly and goes dark frequently, leaving the corner in pitch black.', 
      'Block C Public Park, Sector 62', 
      28.6288, 
      77.3644, 
      'low', 
      'approved', 
      8, 
      now() - interval '1 day 8 hours'
    ),
    (
      v_user_id, 
      'suspicious-activity', 
      'Group loitering near ATM entrance (Seed)', 
      'A group of young men consistently gather around the un-guarded ATM booth in the late hours. They are frequently seen drinking and rowdy.', 
      'Block D Commercial Complex, Sector 62', 
      28.6332, 
      77.3791, 
      'medium', 
      'approved', 
      4, 
      now() - interval '2 days 1 hour'
    ),
    (
      v_user_id, 
      'poor-lighting', 
      'No light on footbridge over canal (Seed)', 
      'The pedestrian bridge crossing the canal has absolutely no light fixtures. Users have to use their phone flashlights to cross safely.', 
      'Canal Pedestrian Bridge, Sector 62', 
      28.6241, 
      77.3812, 
      'high', 
      'approved', 
      15, 
      now() - interval '2 days 5 hours'
    ),
    (
      v_user_id, 
      'unsafe-area', 
      'Littered and abandoned corridor (Seed)', 
      'An empty lot filled with overgrown bushes and abandoned building materials has become an unsafe dark shortcut for pedestrians walking to the main road.', 
      'Sector 62 Industrial Area Road', 
      28.6198, 
      77.3711, 
      'low', 
      'approved', 
      2, 
      now() - interval '3 days 4 hours'
    ),
    (
      v_user_id, 
      'harassment', 
      'Catcalling at transit shelter (Seed)', 
      'Group of teenagers loitering near the transit shelter and making loud, inappropriate comments at female commuters waiting for buses.', 
      'Fortis Hospital Bus Stop, Sector 62', 
      28.6275, 
      77.3690, 
      'medium', 
      'approved', 
      9, 
      now() - interval '3 days 12 hours'
    ),
    (
      v_user_id, 
      'broken-streetlight', 
      'Broken streetlights along residential lane (Seed)', 
      'Four streetlights are completely out from Block B Gate 1 to Gate 3, making it extremely unsafe for late-night walks.', 
      'Block B Residential Lane, Sector 62', 
      28.6300, 
      77.3735, 
      'medium', 
      'approved', 
      11, 
      now() - interval '4 days'
    ),
    (
      v_user_id, 
      'suspicious-activity', 
      'Stalking report on Sector 62 walk (Seed)', 
      'A resident reported being followed closely by a person on foot from the metro station to their residential society gate around 10:30 PM.', 
      'Sector 62 Metro Walkway to Block A', 
      28.6264, 
      77.3780, 
      'high', 
      'approved', 
      7, 
      now() - interval '4 days 6 hours'
    ),
    (
      v_user_id, 
      'poor-lighting', 
      'Dark alley behind grocery market (Seed)', 
      'The back alley where vendors unload stock has zero working lights. Highly active area but unsafe due to total darkness.', 
      'Sector 62 local market backyard', 
      28.6212, 
      77.3655, 
      'low', 
      'approved', 
      3, 
      now() - interval '5 days 2 hours'
    ),
    (
      v_user_id, 
      'unsafe-area', 
      'Aggressive stray dog pack near park (Seed)', 
      'A pack of 8-10 aggressive stray dogs has taken over the lane near the park. They chase two-wheelers and pedestrians after 9 PM.', 
      'Lane 3, Block A, Sector 62', 
      28.6295, 
      77.3672, 
      'medium', 
      'approved', 
      6, 
      now() - interval '5 days 9 hours'
    ),
    (
      v_user_id, 
      'harassment', 
      'Staring and following at crossing (Seed)', 
      'Women reporting a middle-aged man standing near the zebra crossing who continuously stares and tries to walk uncomfortably close to female pedestrians.', 
      'Sector 62 Metro Crossing', 
      28.6322, 
      77.3759, 
      'high', 
      'approved', 
      14, 
      now() - interval '5 days 18 hours'
    ),
    (
      v_user_id, 
      'broken-streetlight', 
      'Light pole knocked down by vehicle (Seed)', 
      'A streetlight pole was hit by a truck and is lying on the side. The electrical wires are exposed and the entire corner is unlit.', 
      'Intersection of Block B and C, Sector 62', 
      28.6250, 
      77.3718, 
      'medium', 
      'approved', 
      5, 
      now() - interval '6 days 1 hour'
    ),
    (
      v_user_id, 
      'unsafe-area', 
      'Isolated underpass walkway (Seed)', 
      'The pedestrian walkway inside the underpass is isolated and smells of urine. Very low footfall and no security cameras present.', 
      'Sector 62 underpass walk', 
      28.6280, 
      77.3705, 
      'high', 
      'approved', 
      10, 
      now() - interval '6 days 6 hours'
    ),
    (
      v_user_id, 
      'poor-lighting', 
      'Dim parking lot pathway (Seed)', 
      'The pathway connecting the public parking to the shopping complex has very dim lighting. Shadows make it difficult to see ahead.', 
      'Sector 62 Central Parking', 
      28.6235, 
      77.3742, 
      'low', 
      'approved', 
      4, 
      now() - interval '6 days 12 hours'
    ),
    (
      v_user_id, 
      'suspicious-activity', 
      'Abandoned bike blocking narrow lane (Seed)', 
      'An abandoned motorcycle with no license plate has been chained to a post in the narrow walkway, blocking egress and creating a blind spot.', 
      'Block B Alleyway, Sector 62', 
      28.6189, 
      77.3755, 
      'low', 
      'approved', 
      1, 
      now() - interval '7 days'
    ),
    (
      v_user_id, 
      'harassment', 
      'Following and verbal harassment near gym (Seed)', 
      'A gym-goer reported a group of boys standing outside the commercial gym who pass vulgar remarks when female members leave the facility.', 
      'Commercial Hub Gym, Sector 62', 
      28.6271, 
      77.3795, 
      'high', 
      'approved', 
      16, 
      now() - interval '7 days 2 hours'
    ),
    (
      v_user_id, 
      'poor-lighting', 
      'Unlit bus stop corridor under trees (Seed)', 
      'The streetlights behind the bus shelter are completely blocked by dense tree branches, leaving the waiting area in pitch darkness.', 
      'Block C Bus Stand, Sector 62', 
      28.6310, 
      77.3630, 
      'medium', 
      'approved', 
      7, 
      now() - interval '7 days 8 hours'
    );

  RAISE NOTICE 'Successfully seeded 20 community reports linked to user %', v_user_id;
END $$;
