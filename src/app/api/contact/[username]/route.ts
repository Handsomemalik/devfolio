import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeText, isValidSafeUrl } from "@/lib/security/sanitize";
import { rateLimit } from "@/lib/security/rate-limit";
import crypto from "crypto";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  message: z.string().trim().min(3, "Message must be at least 3 characters").max(2000, "Message must be under 2,000 characters"),
  honeypot: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    // IP Extraction for rate limiting (never stored raw)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

    // Rate Limiting: 5 contact messages per 10 minutes per IP
    const rateLimitResult = rateLimit(`contact:${ipHash}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid contact form input" },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = result.data;

    // Silent honeypot drop (spambots fill hidden honeypot fields)
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, message: "Message dispatched." });
    }

    const cleanName = sanitizeText(name);
    const cleanMessage = sanitizeText(message);

    // Find recipient profile in Supabase
    const supabase = createAdminClient();
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, full_name, user_id")
      .eq("username", username.toLowerCase())
      .single();

    // If profile not in database (or demo profile), succeed gracefully
    if (profileErr || !profile) {
      return NextResponse.json({
        success: true,
        message: "Message dispatched to portfolio owner.",
      });
    }

    // Insert message into database
    const { error: insertErr } = await supabase.from("messages").insert({
      profile_id: profile.id,
      name: cleanName,
      email: email.toLowerCase(),
      message: cleanMessage,
      ip_hash: ipHash,
    });

    if (insertErr) {
      console.error("[Contact API] Insert error:", insertErr);
      return NextResponse.json(
        { error: "Unable to record message at this time." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message successfully delivered.",
    });
  } catch (error: unknown) {
    console.error("[Contact API] Exception:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
