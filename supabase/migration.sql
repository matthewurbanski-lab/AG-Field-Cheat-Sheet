-- AquaGuard Foundation Solutions — Database Migration
-- Run this SQL in your Supabase SQL Editor to set up all tables

-- ============================================
-- 1. LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  zip TEXT,
  issues TEXT[] DEFAULT '{}',
  answers JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'New',
  notes TEXT DEFAULT '',
  appointment_at TIMESTAMPTZ,
  source TEXT DEFAULT ''
);

-- Index for common queries
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_city ON leads(city);

-- ============================================
-- 2. PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  storage_url TEXT NOT NULL,
  filename TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_photos_lead_id ON photos(lead_id);

-- ============================================
-- 3. TIME SLOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_booked BOOLEAN DEFAULT false,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available, is_booked);

-- ============================================
-- 4. SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('contact_name', 'Matthew Urbanski'),
  ('contact_phone', '(470) 568-1681'),
  ('contact_email', 'matthew.urbanski@AquaGuard.net'),
  ('contact_website', 'mattataquaguard.com'),
  ('google_review_link', ''),
  ('service_area_zips', ''),
  ('warn_outside_area', 'false'),
  ('enabled_issues', 'basement_water,foundation,crawl_space,concrete,structural,general'),
  ('customer_email_template', 'Your free inspection with Matthew Urbanski has been confirmed. He will review your information and reach out within 24 hours to confirm.'),
  ('lead_alert_template', 'New lead submitted through mattataquaguard.com. Review details below.')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 5. SUPABASE STORAGE BUCKET
-- ============================================
-- Run this separately or create via Supabase Dashboard:
-- Create a storage bucket named "lead-photos" with public access

-- ============================================
-- 6. ROW LEVEL SECURITY (optional but recommended)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow service role (used by API) full access
CREATE POLICY "Service role has full access to leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to photos"
  ON photos FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to time_slots"
  ON time_slots FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to settings"
  ON settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert leads (for booking form)
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Allow anonymous users to read available time slots
CREATE POLICY "Anyone can read available time slots"
  ON time_slots FOR SELECT
  USING (is_available = true AND is_booked = false);

-- Allow anonymous users to insert photos
CREATE POLICY "Anyone can upload photos"
  ON photos FOR INSERT
  WITH CHECK (true);
