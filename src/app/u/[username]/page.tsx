import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PORTFOLIO_COMPONENTS, PortfolioDesignKey } from "@/components/portfolio-designs";
import { DEMO_PORTFOLIO_DATA } from "@/config/demo-profile";
import { TelemetryBeacon, OwnerToolbar } from "@/components/portfolio-designs/shared";
import { isRTL, getFontFamilyClass } from "@/lib/design-utils";
import { PortfolioData, Profile, FontKey } from "@/types/database";
import { Button, Logo, Badge } from "@/components/ui";
import { ArrowLeft, Sparkles, UserX, Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

/**
 * Fetch portfolio data on the server with RLS and privacy guarantees
 */
async function getPortfolioData(rawUsername: string): Promise<{
  data: PortfolioData | null;
  isOwner: boolean;
  isDraft: boolean;
}> {
  const username = rawUsername.toLowerCase().trim();

  // 1. Fallback for demo username
  if (username === "alex-vance" || username === "demo") {
    return {
      data: DEMO_PORTFOLIO_DATA,
      isOwner: false,
      isDraft: false,
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Query admin client so we can inspect is_published & owner state cleanly
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("*")
      .ilike("username", username)
      .maybeSingle();

    if (!profile) {
      return { data: null, isOwner: false, isDraft: false };
    }

    const isOwner = Boolean(user && user.id === profile.user_id);
    const isDraft = !profile.is_published;

    // If portfolio is unpublished and viewer is NOT the owner, treat as not found
    if (isDraft && !isOwner) {
      return { data: null, isOwner: false, isDraft: true };
    }

    // Fetch child entities in parallel
    const [
      { data: skills },
      { data: experiences },
      { data: education },
      { data: projects },
      { data: social_links },
      { data: certifications },
      { data: testimonials },
    ] = await Promise.all([
      admin.from("skills").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("experiences").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("education").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("projects").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("social_links").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("certifications").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
      admin.from("testimonials").select("*").eq("profile_id", profile.id).order("sort_order", { ascending: true }),
    ]);

    // Privacy field redaction: never leak email or phone unless user explicitly enabled
    const sanitizedProfile: Profile = {
      ...profile,
      email_public: profile.show_email ? profile.email_public : null,
      phone_public: profile.show_phone ? profile.phone_public : null,
    };

    const portfolioData: PortfolioData = {
      profile: sanitizedProfile,
      skills: skills || [],
      experiences: experiences || [],
      education: education || [],
      projects: projects || [],
      social_links: social_links || [],
      certifications: certifications || [],
      testimonials: testimonials || [],
    };

    return {
      data: portfolioData,
      isOwner,
      isDraft,
    };
  } catch (err) {
    console.error("[getPortfolioData] Error fetching profile:", err);
    return { data: null, isOwner: false, isDraft: false };
  }
}

/**
 * Dynamic SEO metadata generation
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const { data, isDraft } = await getPortfolioData(username);

  if (!data) {
    return {
      title: "Portfolio Not Found | FolioNova",
      robots: { index: false, follow: false },
    };
  }

  const { profile } = data;
  const title = profile.seo_title || `${profile.full_name} — ${profile.professional_title} | FolioNova`;
  const description = profile.seo_description || profile.short_bio || profile.headline || `Explore ${profile.full_name}'s professional portfolio and work.`;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://folionova.io";
  const canonicalUrl = `${siteUrl}/u/${username}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !isDraft,
      follow: !isDraft,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "FolioNova",
      type: "profile",
      firstName: profile.full_name?.split(" ")[0] || "",
      lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
      username,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const { data, isOwner, isDraft } = await getPortfolioData(username);

  // If profile doesn't exist or is unpublished to public, show beautiful on-brand 404
  if (!data) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
        <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>
          <Link href="/(auth)/signup">
            <Button size="sm" variant="primary">
              Claim Your Username
            </Button>
          </Link>
        </header>

        <main className="max-w-xl mx-auto text-center my-auto px-4 py-16 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-500/5">
            <Lock className="w-8 h-8" />
          </div>

          <Badge variant="secondary" size="md" className="mb-4">
            u/{username}
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            This portfolio isn&apos;t published yet
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            The username <span className="text-white font-mono font-medium">@{username}</span> either doesn&apos;t exist yet or is currently being crafted behind closed doors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full sm:w-auto gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/(auth)/signup" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto gap-2">
                <Sparkles className="w-4 h-4" />
                Create your own portfolio
              </Button>
            </Link>
          </div>
        </main>

        <footer className="text-center py-6 text-xs text-slate-500 font-mono">
          Powered by FolioNova • Crafted for High-Impact Careers
        </footer>
      </div>
    );
  }

  const { profile, skills, social_links } = data;
  const designId = (profile.design_id as PortfolioDesignKey) || "aurora";
  const DesignComponent = PORTFOLIO_COMPONENTS[designId] || PORTFOLIO_COMPONENTS.aurora;

  // RTL script check for Arabic / Urdu support
  const textToCheck = `${profile.full_name} ${profile.headline} ${profile.about_me || ""}`;
  const rtl = isRTL(textToCheck);
  const fontClass = getFontFamilyClass(profile.font_style as FontKey);

  // Schema.org Person JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.professional_title,
    description: profile.short_bio || profile.headline,
    image: profile.avatar_url || undefined,
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://folionova.io"}/u/${username}`,
    sameAs: (social_links || []).map((s: { url: string }) => s.url),
    knowsAbout: (skills || []).map((s: { name: string }) => s.name),
  };

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      lang={rtl ? "ar" : "en"}
      className={`min-h-screen ${fontClass} transition-colors duration-300 selection:bg-indigo-500 selection:text-white`}
    >
      {/* JSON-LD Structured Data with XSS-safe escaping */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Visitor View Telemetry Beacon */}
      <TelemetryBeacon username={username} />

      {/* Private draft owner notice */}
      {isDraft && isOwner && (
        <div className="sticky top-0 z-[60] bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md px-4 py-2.5 text-center text-xs font-medium text-amber-200 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Private Draft Preview — Only you can see this portfolio right now. Publish it in your settings to make it live.</span>
          <Link href="/settings" className="underline font-semibold ml-2 hover:text-white">
            Publish Now
          </Link>
        </div>
      )}

      {/* Floating Owner Toolbar */}
      {isOwner && <OwnerToolbar username={username} />}

      {/* Render Selected Design Component */}
      <DesignComponent
        data={data}
        accent={profile.accent_color || "#6366F1"}
        themeMode={(profile.theme_mode as "light" | "dark") || "dark"}
        font={(profile.font_style as FontKey) || "inter"}
        mode="live"
      />
    </div>
  );
}
