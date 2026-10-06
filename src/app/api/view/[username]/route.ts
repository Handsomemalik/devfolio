import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// In-memory LRU-style cache to deduplicate visitor views within 30 minutes
// Key: SHA256(ip + userAgent + username), Value: timestamp
const recentViews = new Map<string, number>();
const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// Periodic cleanup of expired visitor cache entries
function pruneCache() {
  const now = Date.now();
  for (const [key, timestamp] of recentViews.entries()) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentViews.delete(key);
    }
  }
}

const BOT_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /googlebot/i,
  /bingbot/i,
  /yahoo/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandex/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /telegrambot/i,
  /discordbot/i,
  /semrush/i,
  /ahrefs/i,
  /uptime/i,
  /pingdom/i,
  /lighthouse/i,
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return true;
  return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

function detectDevice(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";

    // 1. Filter out search engine crawlers and bots
    if (isBot(userAgent)) {
      return NextResponse.json({ status: "ignored_bot" }, { status: 200 });
    }

    // 2. Extract client IP securely for hashing (never saved raw to DB)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 3. Check if current visitor is the authenticated owner of the profile
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id, user_id, is_published")
      .ilike("username", username)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // If viewer is the owner inspecting their own page, ignore telemetry
    if (user && user.id === profile.user_id) {
      return NextResponse.json({ status: "ignored_owner" }, { status: 200 });
    }

    // 4. Rate-limit / Deduplicate repeat views from same visitor within 30 minutes
    const visitorKey = createHash("sha256")
      .update(`${clientIp}:${userAgent}:${username}`)
      .digest("hex");

    pruneCache();
    const now = Date.now();
    const lastVisit = recentViews.get(visitorKey);

    if (lastVisit && now - lastVisit < DEDUP_WINDOW_MS) {
      return NextResponse.json({ status: "deduped" }, { status: 200 });
    }

    // Mark current timestamp
    recentViews.set(visitorKey, now);

    // 5. Detect device type & referrer
    const device = detectDevice(userAgent);
    const body = await request.json().catch(() => ({}));
    const rawReferrer = body.referrer || request.headers.get("referer") || null;
    let cleanReferrer: string | null = null;

    if (rawReferrer) {
      try {
        const parsed = new URL(rawReferrer);
        cleanReferrer = parsed.hostname;
      } catch {
        cleanReferrer = null;
      }
    }

    // 6. Record view atomically using the RPC function or direct increment
    const { error: rpcError } = await admin.rpc("increment_view", {
      p_profile_id: profile.id,
      p_referrer: cleanReferrer,
      p_device: device,
    });

    if (rpcError) {
      // Fallback if RPC is not deployed yet in development
      await admin
        .from("portfolio_views")
        .insert({
          profile_id: profile.id,
          referrer: cleanReferrer,
          device,
        });

      await admin
        .from("profiles")
        .update({
          view_count: profile.id ? undefined : 1, // trigger bump
        })
        .eq("id", profile.id);
    }

    return NextResponse.json({ ok: true, status: "recorded" });
  } catch (err) {
    console.error("[api/view/[username]] Telemetry error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
