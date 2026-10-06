import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_PORTFOLIO_DATA } from "@/config/demo-profile";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let profile = {
    full_name: DEMO_PORTFOLIO_DATA.profile.full_name,
    professional_title: DEMO_PORTFOLIO_DATA.profile.professional_title,
    headline: DEMO_PORTFOLIO_DATA.profile.headline,
    accent_color: DEMO_PORTFOLIO_DATA.profile.accent_color,
    design_id: DEMO_PORTFOLIO_DATA.profile.design_id,
    avatar_url: DEMO_PORTFOLIO_DATA.profile.avatar_url,
  };

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("full_name, professional_title, headline, accent_color, design_id, avatar_url")
      .ilike("username", username)
      .maybeSingle();

    if (data && data.full_name) {
      profile = {
        full_name: data.full_name,
        professional_title: data.professional_title || "Creative Professional",
        headline: data.headline || "",
        accent_color: data.accent_color || "#6366F1",
        design_id: data.design_id || "aurora",
        avatar_url: data.avatar_url,
      };
    }
  } catch (err) {
    console.error("Error generating OG image data:", err);
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "FN";

  const accent = profile.accent_color || "#6366F1";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0F19",
          backgroundImage: `radial-gradient(circle at 85% 15%, ${accent}25 0%, transparent 50%), radial-gradient(circle at 15% 85%, #1E1B4B 0%, transparent 50%)`,
          padding: "80px",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern border */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 24,
            pointerEvents: "none",
          }}
        />

        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "8px 20px",
              borderRadius: "999px",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: accent,
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#E2E8F0",
              }}
            >
              folionova.io/u/{username}
            </span>
          </div>

          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#94A3B8",
              fontWeight: 500,
            }}
          >
            DESIGN ARCHETYPE: {profile.design_id.toUpperCase()}
          </div>
        </div>

        {/* Main Content Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          {/* Avatar Monogram */}
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: `3px solid ${accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              fontWeight: 700,
              backgroundColor: "#111827",
              color: "#FFFFFF",
              boxShadow: `0 0 50px ${accent}40`,
            }}
          >
            {initials}
          </div>

          {/* Name & Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: 800 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#F8FAFC",
              }}
            >
              {profile.full_name}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: accent,
                letterSpacing: "-0.01em",
              }}
            >
              {profile.professional_title}
            </div>
            {profile.headline && (
              <div
                style={{
                  fontSize: 20,
                  color: "#94A3B8",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {profile.headline}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: 16, color: "#64748B" }}>
            Engineered for High-Impact Engineers, Designers & Leaders
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#E2E8F0",
            }}
          >
            FolioNova
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
