-- ============================================================================
-- SafeCircle AI — Delhi & Gurgaon Community Reports Seed Script
-- Populates 60 additional realistic safety reports in Delhi and Gurgaon/Gurugram.
--
-- How to run:
-- Copy the contents of this query and paste it into your Supabase SQL Editor,
-- then click "Run".
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

  -- Insert 60 realistic safety reports spread out over the last 30-60 days
  INSERT INTO public.community_reports 
    (user_id, category, title, description, location_text, lat, lng, severity, status, verified_count, created_at)
  VALUES
    -- ================= DELHI REPORTS (30) =================
    (
      v_user_id, 'poor-lighting', 'Dim corridor in CP E-Block (Seed)',
      'The inner corridor of CP Block E has four consecutive storefront lights broken. Extremely dark and isolated after 9:30 PM.',
      'Connaught Place Block E, New Delhi', 28.6304, 77.2177, 'medium', 'approved', 8, now() - interval '12 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Unmarked vehicle idling in Outer Circle (Seed)',
      'An unmarked dark SUV with tinted windows has been parking near the corner of Outer Circle. Occupants observed staring at walking commuters.',
      'CP Outer Circle, New Delhi', 28.6322, 77.2201, 'medium', 'pending', 3, now() - interval '8 days'
    ),
    (
      v_user_id, 'harassment', 'Eve-teasing near Select Citywalk Back Lane (Seed)',
      'A group of men frequently gather near the back exit of the mall near the auto stand, passing vulgar comments at women walking to the metro.',
      'Saket Mall District Back Exit, New Delhi', 28.5244, 77.2066, 'high', 'approved', 14, now() - interval '4 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Broken streetlights at Saket Block M (Seed)',
      'Two streetlights near the community park corner have been non-functional for over two weeks, leaving the walkway in complete darkness.',
      'Block M, Saket, New Delhi', 28.5212, 77.2091, 'low', 'approved', 5, now() - interval '19 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated alley near Hauz Khas Village (Seed)',
      'The narrow pedestrian entry corridor leading from the main park to the village is completely unmonitored and dark after hours.',
      'Hauz Khas Village Pedestrian Lane, New Delhi', 28.5494, 77.2001, 'medium', 'approved', 7, now() - interval '15 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Dimly lit pathway Hauz Khas Sector 5 (Seed)',
      'The walkway between block gates is unlit due to overgrown tree branches blocking the light poles. High risk of tripping or confrontation.',
      'Sector 5 Walkway, Hauz Khas, New Delhi', 28.5451, 77.1972, 'medium', 'approved', 4, now() - interval '25 days'
    ),
    (
      v_user_id, 'harassment', 'Catcalling at Lajpat Nagar Central Market (Seed)',
      'Group of shop helpers loitering near the shoe market alleyway and making inappropriate remarks at female shoppers passing by in the evening.',
      'Central Market Shoe Alley, New Delhi', 28.5679, 77.2435, 'high', 'approved', 19, now() - interval '2 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Unlit lane in Lajpat Nagar Block K (Seed)',
      'Entire stretch of road opposite Block K gurudwara has no working streetlights. Residents forced to walk in dark.',
      'Block K Lane, Lajpat Nagar, New Delhi', 28.5699, 77.2411, 'low', 'approved', 3, now() - interval '32 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Groups loitering near Rajouri Garden Metro exit (Seed)',
      'Three to four men frequently loiter near the exit gates of the metro station past 10 PM. Staring and following commuters.',
      'Rajouri Garden Metro Exit 1, New Delhi', 28.6415, 77.1248, 'medium', 'approved', 9, now() - interval '7 days'
    ),
    (
      v_user_id, 'harassment', 'Stalking incident Rajouri Main Market (Seed)',
      'A female shopper reported being followed closely for 10 minutes through the narrow lanes of the market by a suspicious individual.',
      'Rajouri Main Market, New Delhi', 28.6432, 77.1271, 'high', 'approved', 11, now() - interval '6 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Unlit park lane in Rohini Sector 8 (Seed)',
      'The pedestrian walkway surrounding Sector 8 park has zero lights. Completely dark after 7:30 PM, making it unsafe for walks.',
      'Sector 8 Park Road, Rohini, New Delhi', 28.7158, 77.1137, 'high', 'approved', 6, now() - interval '11 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated pocket in Rohini Sector 15 (Seed)',
      'The underpass lane connecting Sector 15 and 16 is abandoned, has no working cameras, and has reports of rowdy groups.',
      'Sector 15 Underpass Road, New Delhi', 28.7201, 77.1112, 'medium', 'approved', 8, now() - interval '20 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Broken light near Dwarka Sector 10 Metro (Seed)',
      'The streetlights along the footpath from Sector 10 Metro towards the apartments are broken. Commuters have to use phone lights.',
      'Sector 10 Metro Footpath, New Delhi', 28.5823, 77.0500, 'low', 'approved', 4, now() - interval '42 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Suspicious bike riders Dwarka Sec 22 (Seed)',
      'Two men on a motorcycle without a license plate were seen riding slowly and circling the residential block multiple times around 9 PM.',
      'Sector 22 Residential Pocket, New Delhi', 28.5801, 77.0471, 'medium', 'pending', 2, now() - interval '28 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Janakpuri District Center Back alley (Seed)',
      'The parking block corridor behind the office tower has no working lights. Isolated and unsafe stretch after office hours.',
      'District Center Block A parking, New Delhi', 28.6219, 77.0878, 'medium', 'approved', 8, now() - interval '14 days'
    ),
    (
      v_user_id, 'harassment', 'Persistent catcalling Janakpuri Block C (Seed)',
      'A resident reported multiple instances of verbal harassment from groups loitering around the local juice shop in Block C.',
      'Block C Crossing, Janakpuri, New Delhi', 28.6241, 77.0851, 'high', 'approved', 13, now() - interval '5 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Gaffar Market back alleys (Seed)',
      'The narrow internal lanes of Gaffar Market become highly isolated and completely dark after shops close. No patrols observed.',
      'Gaffar Market alleys, Karol Bagh, New Delhi', 28.6514, 77.1903, 'high', 'approved', 10, now() - interval '22 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Broken streetlight at Karol Bagh Block 23 (Seed)',
      'Three consecutive streetlights on Main Road 23 are down. Footpath is highly dark near the bus shelter.',
      'Karol Bagh Block 23, New Delhi', 28.6535, 77.1872, 'low', 'approved', 5, now() - interval '35 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Dark alley in South Ex I (Seed)',
      'The service road behind the retail showrooms is completely pitch black. Very risky for female employees leaving late.',
      'South Ext I Back Road, New Delhi', 28.5726, 77.2215, 'medium', 'approved', 7, now() - interval '17 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Unattended bags / loiterers South Ex II (Seed)',
      'Groups of suspicious men seen gathering near the dark park corner near South Ex II crossing regularly. Staring at pedestrians.',
      'South Ext II Crossing Park, New Delhi', 28.5701, 77.2235, 'medium', 'approved', 6, now() - interval '30 days'
    ),
    (
      v_user_id, 'harassment', 'Verbal abuse GK-I M-Block Market (Seed)',
      'A female resident reported being followed and verbally harassed by a group outside the coffee shop in M-Block market.',
      'M-Block Market, Greater Kailash I, New Delhi', 28.5482, 77.2343, 'high', 'approved', 12, now() - interval '9 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'GK-II Main road lights down (Seed)',
      'The streetlights along the block fence near the GK-II local market are out, creating a dark safety gap on the footpath.',
      'Greater Kailash II Local Market, New Delhi', 28.5451, 77.2372, 'low', 'approved', 4, now() - interval '48 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated road stretch Vasant Kunj Sec B (Seed)',
      'The road connecting Sector B to the main mall area has zero foot traffic and no active police check post past 9 PM.',
      'Sector B Connect Road, Vasant Kunj, New Delhi', 28.5424, 77.1561, 'medium', 'approved', 8, now() - interval '16 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Pocket 3 walkway dim corridor (Seed)',
      'Walkway lighting inside pocket 3 is non-existent. Residents have to walk through dark, heavily wooded areas inside the block.',
      'Vasant Kunj Pocket 3 Walk, New Delhi', 28.5401, 77.1531, 'medium', 'approved', 6, now() - interval '24 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Rowdy crowd near NSP back lane (Seed)',
      'Group of men seen drinking openly inside cars parked in the isolated lane behind the metro station after dark.',
      'Netaji Subhash Place back parking, New Delhi', 28.6990, 77.1204, 'high', 'approved', 9, now() - interval '13 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Unlit block lane Pitampura Block JD (Seed)',
      'Two streetlights have been completely broken for a month inside Block JD lane. Very dark around the community gates.',
      'Pitampura Block JD, New Delhi', 28.6961, 77.1182, 'low', 'approved', 5, now() - interval '50 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Civil Lines Underpass dark stretch (Seed)',
      'The pedestrian corridor inside the Civil Lines underpass is completely unlit. Extremely isolated and high risk.',
      'Civil Lines Underpass walk, New Delhi', 28.6814, 77.2224, 'high', 'approved', 11, now() - interval '10 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated lane in Chandni Chowk (Seed)',
      'The narrow alley of Katra Neel has no security cameras, very poor lighting, and becomes completely deserted after 8 PM.',
      'Katra Neel Alley, Chandni Chowk, New Delhi', 28.6562, 77.2300, 'medium', 'approved', 6, now() - interval '23 days'
    ),
    (
      v_user_id, 'harassment', 'Eve-teasing Defence Colony Flyover (Seed)',
      'Two men riding an electric scooter have been repeatedly catcalling women crossing the pedestrian stairs of the flyover in the evenings.',
      'Defence Colony Flyover Pedestrian Steps, New Delhi', 28.5727, 77.2331, 'high', 'approved', 15, now() - interval '3 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Mayur Vihar Ph I Pocket 1 walkway (Seed)',
      'Dim lights under heavy tree canopy on the main block walkway. Very difficult to see ahead after sunset.',
      'Mayur Vihar Pocket 1 Walk, New Delhi', 28.6040, 77.2934, 'medium', 'approved', 8, now() - interval '18 days'
    ),

    -- ================= GURGAON REPORTS (30) =================
    (
      v_user_id, 'poor-lighting', 'Cyber City Building 10 back road (Seed)',
      'The service road behind Building 10 is very poorly lit. The corporate shuttle stops far away, forcing employees to walk in the dark.',
      'Cyber City Building 10 Back Road, Gurgaon', 28.4950, 77.0896, 'low', 'approved', 4, now() - interval '20 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Suspicious groups near Cyber Hub periphery (Seed)',
      'Groups of men seen loitering around the dark parking exits of Cyber Hub near the highway. Staring at solo female travelers waiting for cabs.',
      'Cyber Hub Highway Exit, Gurgaon', 28.4971, 77.0872, 'medium', 'approved', 7, now() - interval '12 days'
    ),
    (
      v_user_id, 'harassment', 'Persistent catcalling near Sector 53-54 Metro (Seed)',
      'Commuters reporting a group of boys standing near the stairs of the Sector 53-54 Rapid Metro station who pass comments when women exit.',
      'Sector 53-54 Rapid Metro Exit, Gurgaon', 28.4419, 77.0984, 'high', 'approved', 12, now() - interval '6 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Broken streetlights Golf Course Block B (Seed)',
      'Multiple streetlights are completely out from Block B crossing to the metro corridor, creating a dark walkway patch.',
      'Golf Course Road Block B, Gurgaon', 28.4452, 77.0951, 'low', 'approved', 6, now() - interval '38 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated road stretch on GC Extension Rd (Seed)',
      'The road connecting Sector 61 to Sector 62 is heavily isolated, has no active police patrols, and has very sparse vehicle movement after 10 PM.',
      'Sector 61 Connector Road, Gurgaon', 28.4062, 77.0924, 'high', 'approved', 9, now() - interval '15 days'
    ),
    (
      v_user_id, 'poor-lighting', 'DLF Phase 1 Ridge Road dark walk (Seed)',
      'The Ridge Road stretch bordering DLF Phase 1 has zero working lights. Highly isolated and heavily forested on one side.',
      'DLF Phase 1 Ridge Road, Gurgaon', 28.4719, 77.0974, 'high', 'approved', 11, now() - interval '11 days'
    ),
    (
      v_user_id, 'harassment', 'Eve-teasing DLF Phase 2 Block L (Seed)',
      'A female resident reported being followed for several meters by a man on foot down the Block L lane around 9 PM.',
      'Block L lane, DLF Phase 2, Gurgaon', 28.4745, 77.0942, 'high', 'approved', 16, now() - interval '8 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'U-Block loiterers and rowdy crowds (Seed)',
      'Multiple residents have reported groups of rowdy men drinking openly on the street corner near the local grocery shop after 10 PM.',
      'U-Block Sector 24, DLF Phase 3, Gurgaon', 28.4799, 77.0912, 'high', 'approved', 22, now() - interval '5 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Galleria back lane lights broken (Seed)',
      'Two light poles behind the Galleria market complex are non-functional, leaving the path to the parking lot in complete darkness.',
      'Galleria Market Back parking, Gurgaon', 28.4604, 77.0782, 'low', 'approved', 5, now() - interval '29 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Dim walkway DLF Phase 5 Horizon Center (Seed)',
      'Path connecting the office complex to the metro walkway is very dim under the trees. Needs additional lighting fixtures.',
      'Horizon Center Walkway, Gurgaon', 28.4551, 77.0812, 'low', 'approved', 4, now() - interval '45 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Leisure Valley park isolated corridor (Seed)',
      'The walking track along the back wall of Leisure Valley park is completely dark and has no security guards visible past sunset.',
      'Leisure Valley Park Walk, Sector 29, Gurgaon', 28.4682, 77.0637, 'high', 'approved', 13, now() - interval '16 days'
    ),
    (
      v_user_id, 'harassment', 'Catcalling at Sector 29 Market (Seed)',
      'Commuters reported a group of intoxicated men passing vulgar remarks at women waiting near the taxi pickup stand outside the food court.',
      'Sector 29 Market Cab Stand, Gurgaon', 28.4651, 77.0611, 'high', 'approved', 18, now() - interval '4 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Sector 45 Block C streetlights down (Seed)',
      'Three consecutive streetlights inside the Block C residential lane are broken. High risk for late-night walking.',
      'Sector 45 Block C, Gurgaon', 28.4485, 77.0682, 'low', 'approved', 6, now() - interval '31 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Suspicious bike riders Sector 56 (Seed)',
      'Two boys riding a motorcycle without helmets were observed circling the Huda Market parking lot slowly and staring at female shoppers.',
      'Huda Market parking lot, Sector 56, Gurgaon', 28.4239, 77.1002, 'medium', 'approved', 8, now() - interval '9 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Dim street crossing Sector 57 (Seed)',
      'The T-point crossing near the sector entrance is unlit. The single streetlight on the pole has been fused for over a month.',
      'Sector 57 T-Point, Gurgaon', 28.4243, 77.0792, 'medium', 'approved', 7, now() - interval '24 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated construction zone Sector 65 (Seed)',
      'The road running parallel to the new commercial complex is heavily isolated and unlit, with construction debris blocking the footpath.',
      'Sector 65 Main Road, Gurgaon', 28.3976, 77.0714, 'high', 'approved', 10, now() - interval '22 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Sector 67 Block A lights broken (Seed)',
      'Lights are down along the entire perimeter path of Block A society. Footpath is highly dark near the park entrance.',
      'Sector 67 Block A, Gurgaon', 28.3912, 77.0722, 'low', 'approved', 4, now() - interval '55 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Dark corridor Sector 70 (Seed)',
      'Service lane near the high-rise societies is completely unlit. Extremely dark stretch that is unsafe for walking from the bus stop.',
      'Sector 70 Service Road, Gurgaon', 28.3919, 77.0337, 'high', 'approved', 12, now() - interval '14 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Unmarked bike circling Sector 83 (Seed)',
      'Residents observed a motorcycle without a license plate parked near the society gate. Riders left when security guards approached.',
      'Sector 83 society gate, Gurgaon', 28.3957, 76.9691, 'medium', 'approved', 5, now() - interval '17 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Sector 90 construction boundary road (Seed)',
      'The boundary road along the large vacant land area has zero lighting and no foot traffic, making it highly isolated in the evenings.',
      'Sector 90 Boundary road, Gurgaon', 28.4022, 76.9463, 'high', 'approved', 8, now() - interval '26 days'
    ),
    (
      v_user_id, 'harassment', 'Catcalling near Subhash Chowk (Seed)',
      'A female pedestrian reported a group of boys standing near the local tea stall who pass comments when women cross the road.',
      'Subhash Chowk Crossing, Gurgaon', 28.4021, 77.0396, 'high', 'approved', 11, now() - interval '7 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Unlit bus shelter near Omaxe Mall (Seed)',
      'The streetlight pole next to the bus shelter is down. Commuters have to wait for buses in pitch darkness.',
      'Sohna Road bus stand, Gurgaon', 28.4042, 77.0361, 'low', 'approved', 5, now() - interval '40 days'
    ),
    (
      v_user_id, 'harassment', 'Eve-teasing MG Road Metro pillars (Seed)',
      'Group of boys gather near metro pillar 122 under the bridge, staring and catcalling at women walking to the malls.',
      'MG Road Metro Pillar 122, Gurgaon', 28.4798, 77.0803, 'high', 'approved', 15, now() - interval '3 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Rowdy crowds MG Road Mall corridor (Seed)',
      'Open alcohol drinking inside cars parked on the service road near the malls, leading to rowdy and unsafe behavior in the evening.',
      'MG Road Mall Mile, Gurgaon', 28.4772, 77.0781, 'medium', 'approved', 9, now() - interval '10 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Udyog Vihar Ph IV unlit corridor (Seed)',
      'The corporate lane behind the main IT park has no working streetlights, making it dark and dangerous for employees leaving late shifts.',
      'Udyog Vihar Phase IV, Gurgaon', 28.5029, 77.0772, 'high', 'approved', 14, now() - interval '13 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated road Udyog Vihar Ph V (Seed)',
      'The road connecting the main road to the expressway becomes completely empty and unpatrolled after office shuttle hours.',
      'Udyog Vihar Phase V Connect, Gurgaon', 28.5001, 77.0751, 'medium', 'approved', 7, now() - interval '21 days'
    ),
    (
      v_user_id, 'broken-streetlight', 'Broken lights Sushant Lok I Block C (Seed)',
      'Two streetlights inside Block C crossing have been down for a month, leaving the residential lane in complete darkness.',
      'Block C Crossing, Sushant Lok I, Gurgaon', 28.4604, 77.0782, 'low', 'approved', 4, now() - interval '49 days'
    ),
    (
      v_user_id, 'poor-lighting', 'Nirvana Country main walkway dim corridor (Seed)',
      'walkway lighting along the main road is blocked by thick tree branches, leaving the pedestrian path unlit.',
      'Nirvana Country Main Walk, Gurgaon', 28.4116, 77.0626, 'low', 'approved', 5, now() - interval '30 days'
    ),
    (
      v_user_id, 'suspicious-activity', 'Suspicious car idling Palam Vihar (Seed)',
      'An unmarked car was seen parking in the same spot in Block G for three nights in a row, with occupants loitering on the sidewalk.',
      'Block G, Palam Vihar, Gurgaon', 28.5034, 77.0454, 'medium', 'approved', 8, now() - interval '18 days'
    ),
    (
      v_user_id, 'unsafe-area', 'Isolated road New Gurgaon Sec 102 (Seed)',
      'The main road heading towards the sector apartments has zero pedestrian traffic and no streetlights, making it highly isolated.',
      'Sector 102 main road, Gurgaon', 28.4087, 76.9531, 'high', 'approved', 9, now() - interval '27 days'
    );

  RAISE NOTICE 'Successfully seeded 60 additional Delhi and Gurgaon community safety reports!';
END $$;
