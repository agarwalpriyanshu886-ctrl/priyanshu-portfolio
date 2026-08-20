-- Migration 0005: Dual Identity Architecture (Developer + Creative + Hybrid + 3D Studio)

CREATE TYPE mode_enum AS ENUM ('DEVELOPER', 'CREATIVE', 'HYBRID', 'SHARED');

-- 1. ALTER EXISTING TABLES & BACKFILL EXISTING DATA
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mode mode_enum DEFAULT 'DEVELOPER';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS developer_highlights text[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS creative_highlights text[] DEFAULT '{}';

ALTER TABLE skills ADD COLUMN IF NOT EXISTS mode mode_enum DEFAULT 'DEVELOPER';
ALTER TABLE services ADD COLUMN IF NOT EXISTS mode mode_enum DEFAULT 'DEVELOPER';
ALTER TABLE homepage_sections ADD COLUMN IF NOT EXISTS mode mode_enum DEFAULT 'SHARED';

-- Backfill existing data safely
UPDATE projects SET mode = 'DEVELOPER' WHERE mode IS NULL;
UPDATE skills SET mode = 'DEVELOPER' WHERE mode IS NULL;
UPDATE services SET mode = 'DEVELOPER' WHERE mode IS NULL;
UPDATE homepage_sections SET mode = 'SHARED' WHERE mode IS NULL;

-- Set NOT NULL & Create Indexes
ALTER TABLE projects ALTER COLUMN mode SET NOT NULL;
ALTER TABLE skills ALTER COLUMN mode SET NOT NULL;
ALTER TABLE services ALTER COLUMN mode SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_mode ON projects(mode, is_published);
CREATE INDEX IF NOT EXISTS idx_skills_mode ON skills(mode, is_published);
CREATE INDEX IF NOT EXISTS idx_services_mode ON services(mode, is_published);

-- 2. ABOUT PROFILES TABLE (Separate DEVELOPER, CREATIVE, SHARED stories)
CREATE TABLE IF NOT EXISTS about_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode mode_enum UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  subheading TEXT,
  paragraphs TEXT[] DEFAULT '{}',
  passions TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial about_profiles
INSERT INTO about_profiles (mode, headline, subheading, paragraphs, passions)
VALUES 
  (
    'DEVELOPER',
    'AI/ML Engineer & Full-Stack Architect',
    'Building intelligent software systems, scalable web applications, and data-driven solutions.',
    ARRAY[
      'I am an engineering student pursuing an integrated B.Tech + M.Tech in Artificial Intelligence & Machine Learning at NIMS University, Jaipur (B.Tech: 2024–2028, M.Tech: 2028–2029).',
      'My work focuses on neural networks, computer vision, full-stack web applications, and robust backend engineering.'
    ],
    ARRAY['Artificial Intelligence', 'Machine Learning', 'Full-Stack Development', 'Software Engineering', 'Database Systems']
  ),
  (
    'CREATIVE',
    'Visual Designer, Video Editor & Motion Artist',
    'Turning raw concepts into cinematic visuals, motion graphics, and high-impact branding.',
    ARRAY[
      'Alongside software engineering, I am a passionate graphic designer, video editor, and motion graphics creator.',
      'I craft visual identity systems, poster graphics, video showreels, and UI/UX visual directions that captivate audiences.'
    ],
    ARRAY['Graphic Design', 'Video Editing', 'Motion Graphics', 'Visual Branding', 'Color Grading', '3D Composition']
  )
ON CONFLICT (mode) DO NOTHING;

-- 3. SHOWREELS TABLE (Video showreel clips)
CREATE TABLE IF NOT EXISTS showreels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General Showreel',
  description TEXT,
  video_source TEXT DEFAULT 'UPLOAD', -- UPLOAD, YOUTUBE, VIMEO, URL
  video_url TEXT NOT NULL,
  poster_image TEXT,
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATIVE TOOLS TABLE
CREATE TABLE IF NOT EXISTS creative_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Graphic Design',
  icon TEXT DEFAULT 'SiAdobephotoshop',
  proficiency_level INT DEFAULT 90,
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HIERARCHICAL 3D STUDIO TABLES
CREATE TABLE IF NOT EXISTS three_d_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Abstract', -- Character, Vehicle, Animal, Technology, Creative, Environment, Abstract, Typography
  file_url TEXT NOT NULL,
  file_size INT DEFAULT 0,
  preview_image TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS three_d_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mode mode_enum NOT NULL,
  section_key TEXT NOT NULL,
  environment_preset TEXT DEFAULT 'city',
  light_intensity NUMERIC DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS three_d_scene_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID REFERENCES three_d_scenes(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES three_d_assets(id) ON DELETE SET NULL,
  position_x NUMERIC DEFAULT 0,
  position_y NUMERIC DEFAULT 0,
  position_z NUMERIC DEFAULT 0,
  rotation_x NUMERIC DEFAULT 0,
  rotation_y NUMERIC DEFAULT 0,
  rotation_z NUMERIC DEFAULT 0,
  scale_x NUMERIC DEFAULT 1,
  scale_y NUMERIC DEFAULT 1,
  scale_z NUMERIC DEFAULT 1,
  animation_config JSONB DEFAULT '{"type": "float_rotate", "speed": 1.0, "amplitude": 0.2}'::jsonb,
  interaction_config JSONB DEFAULT '{"hoverEffect": true, "clickAction": "none"}'::jsonb,
  material_config JSONB DEFAULT '{"metalness": 0.5, "roughness": 0.2}'::jsonb,
  visibility BOOLEAN DEFAULT true,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MODE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS mode_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_mode mode_enum DEFAULT 'DEVELOPER',
  enable_mode_persistence BOOLEAN DEFAULT true,
  intro_mode TEXT DEFAULT 'FIRST_VISIT', -- ALWAYS, FIRST_VISIT, DISABLED
  transition_duration_ms INT DEFAULT 1000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial mode settings
INSERT INTO mode_settings (default_mode, enable_mode_persistence, intro_mode)
VALUES ('DEVELOPER', true, 'FIRST_VISIT')
ON CONFLICT DO NOTHING;

-- Enable RLS for all new tables
ALTER TABLE about_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE showreels ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE three_d_scene_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mode_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read About Profiles" ON about_profiles FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Showreels" ON showreels FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Creative Tools" ON creative_tools FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read 3D Assets" ON three_d_assets FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read 3D Scenes" ON three_d_scenes FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read 3D Scene Objects" ON three_d_scene_objects FOR SELECT USING (visibility = true);
CREATE POLICY "Public Read Mode Settings" ON mode_settings FOR SELECT USING (true);
