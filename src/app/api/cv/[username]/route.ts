import * as React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { DEMO_PORTFOLIO_DATA } from "@/config/demo-profile";
import { CvDocument } from "@/lib/cv/CvDocument";
import { DEFAULT_CV_SETTINGS } from "@/lib/validations/cv-settings";
import { rateLimit } from "@/lib/security/rate-limit";
import { PortfolioPayload, Profile, CvSettings } from "@/types/database";
import crypto from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    // 1. Rate Limiting: 12 CV downloads per 5 minutes per IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

    const limitResult = rateLimit(`cv-download:${ipHash}`, { limit: 12, windowMs: 5 * 60 * 1000 });
    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Too many CV download requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Resolve profile data
    let payload: PortfolioPayload = DEMO_PORTFOLIO_DATA;
    let isOwner = false;

    if (username !== "alex-vance" && username !== "demo") {
      const admin = createAdminClient();
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: profile } = await admin
        .from("profiles")
        .select("*")
        .ilike("username", username)
        .maybeSingle();

      if (!profile) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      isOwner = Boolean(user && user.id === profile.user_id);

      // Only published profiles can be downloaded publicly by visitors
      if (!profile.is_published && !isOwner) {
        return NextResponse.json(
          { error: "This portfolio has not been published live yet." },
          { status: 403 }
        );
      }

      // Fetch all sections
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

      // Respect user's privacy flags (redact email or phone if turned off)
      const sanitizedProfile: Profile = {
        ...profile,
        email_public: profile.show_email ? profile.email_public : null,
        phone_public: profile.show_phone ? profile.phone_public : null,
      };

      payload = {
        profile: sanitizedProfile,
        skills: skills || [],
        experiences: experiences || [],
        education: education || [],
        projects: projects || [],
        social_links: social_links || [],
        certifications: certifications || [],
        testimonials: testimonials || [],
      };
    }

    // 3. Resolve CV Settings
    const userCvSettings = (payload.profile.cv_settings as CvSettings) || DEFAULT_CV_SETTINGS;
    const finalSettings: CvSettings = {
      ...DEFAULT_CV_SETTINGS,
      ...userCvSettings,
      template_id: userCvSettings.template_id || payload.profile.cv_template_id || "executive",
      accent_color: userCvSettings.accent_color || payload.profile.accent_color || "#6366F1",
    };

    // 4. Generate real PDF Buffer using @react-pdf/renderer
    const docElement = React.createElement(CvDocument, { data: payload, settings: finalSettings });
    const pdfBuffer = await renderToBuffer(
      docElement as Parameters<typeof renderToBuffer>[0]
    );

    const safeName = (payload.profile.full_name || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${safeName}-CV.pdf`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (err) {
    console.error("[api/cv/[username]] Error generating PDF:", err);
    return NextResponse.json({ error: "Failed to compile PDF document" }, { status: 500 });
  }
}
