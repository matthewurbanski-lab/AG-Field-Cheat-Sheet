-- AquaGuard Foundation Solutions — Demo Seed Data
-- Run after migration.sql to populate with sample data for testing

-- ============================================
-- SAMPLE LEADS
-- ============================================
INSERT INTO leads (first_name, last_name, email, phone, address, city, zip, issues, answers, score, status, notes, appointment_at, source)
VALUES
  (
    'Sarah', 'Johnson',
    'sarah.johnson@example.com', '(770) 555-0101',
    '123 Peachtree St', 'Atlanta', '30301',
    ARRAY['basement_water', 'foundation'],
    '{"waterEntry": "both", "waterFrequency": "every_rain", "visibleMold": "yes", "crackType": "horizontal", "stickingDoorsWindows": "yes", "wallBowing": "yes", "timeline": "asap", "source": "google"}'::jsonb,
    85, 'New', '',
    NOW() + INTERVAL '2 days',
    'google'
  ),
  (
    'Michael', 'Davis',
    'michael.davis@example.com', '(678) 555-0202',
    '456 Magnolia Ave', 'Marietta', '30060',
    ARRAY['crawl_space'],
    '{"mustySmell": "yes", "saggingFloors": "yes", "crawlMoisture": "yes", "existingVaporBarrier": "no", "timeline": "within_1_month", "source": "referral"}'::jsonb,
    55, 'Contacted', 'Called back, scheduled for next week',
    NOW() + INTERVAL '5 days',
    'referral'
  ),
  (
    'Jennifer', 'Williams',
    'jennifer.w@example.com', '(404) 555-0303',
    '789 Oak Ridge Dr', 'Roswell', '30075',
    ARRAY['concrete'],
    '{"concreteLocation": "driveway", "affectedArea": "50_100", "tripHazard": "yes", "timeline": "1_3_months", "source": "social_media"}'::jsonb,
    25, 'Appointment Set', '',
    NOW() + INTERVAL '3 days',
    'social_media'
  ),
  (
    'Robert', 'Martinez',
    'rob.martinez@example.com', '(770) 555-0404',
    '321 Elm Street', 'Kennesaw', '30144',
    ARRAY['basement_water', 'crawl_space', 'structural'],
    '{"waterEntry": "floor", "waterFrequency": "standing_water_always", "visibleMold": "yes", "mustySmell": "yes", "saggingFloors": "yes", "crawlMoisture": "yes", "timeline": "asap", "source": "referral"}'::jsonb,
    95, 'New', 'Urgent — multiple issues',
    NOW() + INTERVAL '1 day',
    'referral'
  ),
  (
    'Lisa', 'Thompson',
    'lisa.t@example.com', '(678) 555-0505',
    '555 Pine Valley Rd', 'Alpharetta', '30005',
    ARRAY['general'],
    '{"timeline": "just_exploring", "source": "door_hanger"}'::jsonb,
    0, 'New', '',
    NOW() + INTERVAL '7 days',
    'door_hanger'
  );

-- ============================================
-- SAMPLE TIME SLOTS (next 2 weeks, Mon-Fri, 9am-5pm, 2hr blocks)
-- ============================================
DO $$
DECLARE
  slot_date DATE;
  slot_time TIME;
BEGIN
  FOR i IN 0..13 LOOP
    slot_date := CURRENT_DATE + i;
    -- Skip weekends
    IF EXTRACT(DOW FROM slot_date) NOT IN (0, 6) THEN
      FOR h IN 0..3 LOOP
        slot_time := TIME '09:00' + (h * INTERVAL '2 hours');
        INSERT INTO time_slots (date, start_time, end_time, is_available, is_booked)
        VALUES (slot_date, slot_time, slot_time + INTERVAL '2 hours', true, false);
      END LOOP;
    END IF;
  END LOOP;
END $$;
