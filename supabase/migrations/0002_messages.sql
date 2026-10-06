-- =====================================================================
-- Migration 0002_messages.sql: Visitor Contact Messages Table & Policies
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  ip_hash TEXT, -- Stored as SHA256 hash for abuse rate limiting; never raw IP
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast inbox queries
CREATE INDEX IF NOT EXISTS idx_messages_profile_id ON public.messages(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(profile_id, is_read);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles owner can read, update (mark read), and delete their messages
CREATE POLICY "Portfolio owners can view their received messages"
  ON public.messages FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can update their received messages"
  ON public.messages FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Portfolio owners can delete their received messages"
  ON public.messages FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- 2. Anyone (including anonymous visitors) can insert a message via server contact endpoint
CREATE POLICY "Allow public inserts for contact messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);
