-- =====================================================================
-- Migration 0003_cv_settings.sql: CV Settings JSONB & Validation
-- =====================================================================

-- Add cv_settings JSONB column to profiles with sensible defaults
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cv_settings JSONB DEFAULT '{
  "template_id": "executive",
  "accent_color": "#6366F1",
  "include_photo": false,
  "paper_size": "A4",
  "font_pairing": "classic",
  "sections": {
    "summary": true,
    "skills": true,
    "experience": true,
    "projects": true,
    "education": true,
    "certifications": true,
    "languages": true
  },
  "section_order": [
    "summary",
    "experience",
    "skills",
    "projects",
    "education",
    "certifications",
    "languages"
  ]
}'::jsonb;

-- Index on cv_settings template_id for fast analytics
CREATE INDEX IF NOT EXISTS idx_profiles_cv_settings_template 
ON public.profiles ((cv_settings->>'template_id'));
