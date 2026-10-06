-- ==============================================================================
-- FolioNova Core Database Migration: 0001_init.sql
-- Complete production schema, RLS policies, triggers, and storage setup.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HELPER FUNCTION: AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT UNIQUE,
  full_name TEXT,
  professional_title TEXT,
  headline TEXT,
  short_bio TEXT,
  about_me TEXT,
  avatar_url TEXT,
  email_public TEXT,
  phone_public TEXT,
  location TEXT,
  website TEXT,
  open_to_work BOOLEAN DEFAULT false,
  years_of_experience INTEGER DEFAULT 0,
  languages JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  design_id TEXT DEFAULT 'aurora' CHECK (design_id IN ('aurora', 'noir', 'kinetic', 'bento', 'editorial')),
  cv_template_id TEXT DEFAULT 'executive' CHECK (cv_template_id IN ('executive', 'modern', 'creative', 'minimal', 'technical', 'elegant')),
  theme_mode TEXT DEFAULT 'dark' CHECK (theme_mode IN ('light', 'dark', 'system')),
  accent_color TEXT DEFAULT '#6366F1',
  font_style TEXT DEFAULT 'inter' CHECK (font_style IN ('inter', 'sora', 'poppins', 'roboto', 'mono')),
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT username_format_check CHECK (
    username IS NULL OR (
      length(username) >= 3 AND
      length(username) <= 30 AND
      username ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_published ON public.profiles(is_published);

CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('github', 'linkedin', 'x', 'instagram', 'behance', 'dribbble', 'youtube', 'facebook', 'website', 'other')),
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON public.social_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_links_sort_order ON public.social_links(profile_id, sort_order);

CREATE TRIGGER trigger_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER CHECK (level IS NULL OR (level >= 1 AND level <= 5)),
  category TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_skills_profile_id ON public.skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON public.skills(profile_id, sort_order);

CREATE TRIGGER trigger_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_experiences_profile_id ON public.experiences(profile_id);
CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON public.experiences(profile_id, sort_order);

CREATE TRIGGER trigger_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field TEXT,
  start_year TEXT,
  end_year TEXT,
  grade TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_education_profile_id ON public.education(profile_id);
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON public.education(profile_id, sort_order);

CREATE TRIGGER trigger_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  live_url TEXT,
  repo_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(profile_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(profile_id, featured);

CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_certifications_profile_id ON public.certifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_certifications_sort_order ON public.certifications(profile_id, sort_order);

CREATE TRIGGER trigger_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_testimonials_profile_id ON public.testimonials(profile_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON public.testimonials(profile_id, sort_order);

CREATE TRIGGER trigger_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. PORTFOLIO VIEWS (INSERT-ONLY ANALYTICS)
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  referrer TEXT,
  country TEXT,
  device TEXT
);

CREATE INDEX IF NOT EXISTS idx_portfolio_views_profile_id ON public.portfolio_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_viewed_at ON public.portfolio_views(profile_id, viewed_at);

-- 12. RPC FUNCTION: ATOMIC INCREMENT VIEW COUNT
CREATE OR REPLACE FUNCTION public.increment_view(
  p_profile_id UUID,
  p_referrer TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_device TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert view record
  INSERT INTO public.portfolio_views (profile_id, viewed_at, referrer, country, device)
  VALUES (p_profile_id, NOW(), p_referrer, p_country, p_device);

  -- Atomic increment view counter
  UPDATE public.profiles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. AUTH TRIGGER: AUTO-CREATE PROFILE ON USER REGISTRATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_meta JSONB;
  init_full_name TEXT;
BEGIN
  raw_meta := NEW.raw_user_meta_data;
  init_full_name := COALESCE(raw_meta->>'full_name', raw_meta->>'name', '');

  INSERT INTO public.profiles (
    user_id,
    full_name,
    email_public,
    is_published,
    design_id,
    cv_template_id,
    theme_mode,
    accent_color,
    font_style
  ) VALUES (
    NEW.id,
    init_full_name,
    NEW.email,
    false,
    'aurora',
    'executive',
    'dark',
    '#6366F1',
    'inter'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone when published"
ON public.profiles FOR SELECT
USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

-- HELPER MACRO FOR CHILD TABLES
-- SOCIAL LINKS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public social links are viewable when profile is published"
ON public.social_links FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own social links"
ON public.social_links FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own social links"
ON public.social_links FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own social links"
ON public.social_links FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- SKILLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public skills are viewable when profile is published"
ON public.skills FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own skills"
ON public.skills FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own skills"
ON public.skills FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own skills"
ON public.skills FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- EXPERIENCES
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public experiences are viewable when profile is published"
ON public.experiences FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own experiences"
ON public.experiences FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own experiences"
ON public.experiences FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own experiences"
ON public.experiences FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- EDUCATION
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public education is viewable when profile is published"
ON public.education FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own education"
ON public.education FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own education"
ON public.education FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own education"
ON public.education FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects are viewable when profile is published"
ON public.projects FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own projects"
ON public.projects FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- CERTIFICATIONS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public certifications are viewable when profile is published"
ON public.certifications FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own certifications"
ON public.certifications FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own certifications"
ON public.certifications FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own certifications"
ON public.certifications FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- TESTIMONIALS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public testimonials are viewable when profile is published"
ON public.testimonials FOR SELECT
USING (
  profile_id IN (SELECT id FROM public.profiles WHERE is_published = true)
  OR profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert their own testimonials"
ON public.testimonials FOR INSERT
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own testimonials"
ON public.testimonials FOR UPDATE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own testimonials"
ON public.testimonials FOR DELETE
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- PORTFOLIO VIEWS (Owners can see their analytics, anon cannot select raw rows)
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view analytics for their profile"
ON public.portfolio_views FOR SELECT
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can record portfolio views"
ON public.portfolio_views FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 15. STORAGE BUCKETS AND STORAGE POLICIES
-- ==============================================================================

-- Create buckets for avatars and project images if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('project-images', 'project-images', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 3145728,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage Policies for Avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar in user folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their avatar in user folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their avatar in user folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage Policies for Project Images
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images in user folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their project images in user folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'project-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their project images in user folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
