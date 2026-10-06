/**
 * Development Seed Script for FolioNova
 * Populates a demonstration profile in local/staging Supabase instances.
 * 
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 */

import { DEMO_PORTFOLIO_DATA } from "../src/config/demo-profile";
import { createAdminClient } from "../src/lib/supabase/admin";

async function seedDemoAccount() {
  console.log("🌱 Starting FolioNova demo profile seeding...");

  const supabase = createAdminClient();
  const { profile, skills, experiences, education, projects, certifications, testimonials, social_links } =
    DEMO_PORTFOLIO_DATA;

  // 1. Upsert Profile
  console.log(`👤 Upserting profile for username: ${profile.username}`);
  const { data: upsertedProfile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        ...profile,
        user_id: profile.user_id || "demo-user-1",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "username" }
    )
    .select()
    .single();

  if (profileError) {
    console.error("❌ Profile seeding failed:", profileError.message);
    return;
  }

  const profileId = upsertedProfile.id;
  console.log(`✅ Profile established with ID: ${profileId}`);

  // 2. Clear previous child data for clean idempotent state
  await Promise.all([
    supabase.from("skills").delete().eq("profile_id", profileId),
    supabase.from("experiences").delete().eq("profile_id", profileId),
    supabase.from("education").delete().eq("profile_id", profileId),
    supabase.from("projects").delete().eq("profile_id", profileId),
    supabase.from("certifications").delete().eq("profile_id", profileId),
    supabase.from("testimonials").delete().eq("profile_id", profileId),
    supabase.from("social_links").delete().eq("profile_id", profileId),
  ]);

  // 3. Insert Child Entities
  if (skills?.length) {
    await supabase.from("skills").insert(
      skills.map((s) => ({ ...s, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${skills.length} skills`);
  }

  if (experiences?.length) {
    await supabase.from("experiences").insert(
      experiences.map((e) => ({ ...e, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${experiences.length} experience entries`);
  }

  if (education?.length) {
    await supabase.from("education").insert(
      education.map((ed) => ({ ...ed, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${education.length} education degrees`);
  }

  if (projects?.length) {
    await supabase.from("projects").insert(
      projects.map((p) => ({ ...p, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${projects.length} showcase projects`);
  }

  if (certifications?.length) {
    await supabase.from("certifications").insert(
      certifications.map((c) => ({ ...c, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${certifications.length} certifications`);
  }

  if (testimonials?.length) {
    await supabase.from("testimonials").insert(
      testimonials.map((t) => ({ ...t, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${testimonials.length} testimonials`);
  }

  if (social_links?.length) {
    await supabase.from("social_links").insert(
      social_links.map((sl) => ({ ...sl, profile_id: profileId }))
    );
    console.log(`✨ Inserted ${social_links.length} social links`);
  }

  console.log("🎉 Seeding complete! Demo profile live at /u/alex-vance");
}

seedDemoAccount().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
