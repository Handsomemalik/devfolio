import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Logo, Button } from "@/components/ui";
import { BRAND_NAME } from "@/config/brand";

export const metadata = {
  title: `Privacy Policy | ${BRAND_NAME}`,
  description: `Privacy policy and data governance practices of ${BRAND_NAME}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 glass-panel border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-left space-y-8">
        <div className="space-y-3 border-b border-[var(--border-subtle)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold">Privacy Policy</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Effective Date: October 2026 • Last Updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">1. Introduction</h2>
            <p>
              {BRAND_NAME} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;platform&rdquo;) is committed to protecting your privacy. This Privacy Policy details how we collect, store, and manage your information when you build, host, and publish portfolios or export CV documents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">2. Information You Provide</h2>
            <p>
              When you create an account, you provide an email address and authentication credentials. When designing your portfolio, you optionally supply career information, work experiences, skills, education, avatar images, and contact links.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">3. Row Level Security & Access Isolation</h2>
            <p>
              Our database implements PostgreSQL Row Level Security (RLS) on all tables. Only your authenticated cryptographic user token can modify or delete your career data. Draft portfolios remain strictly private. When you toggle &ldquo;Published&rdquo;, your chosen public portfolio archetype becomes visible at your chosen username URL.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">4. Contact Coordinates Privacy</h2>
            <p>
              Your phone number and direct email are shielded by default. They are only rendered on public portfolio links if you explicitly toggle &ldquo;Show email on portfolio&rdquo; or &ldquo;Show phone on portfolio&rdquo; in the editor settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">5. Account Deletion & Right to Erasure</h2>
            <p>
              You have the right to permanently purge your account at any time. Under Account Settings &gt; Danger Zone, typing &ldquo;DELETE&rdquo; triggers a complete cascade wipe of all database records, view logs, and stored media files.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">6. Contact</h2>
            <p>
              For privacy inquiries or data requests, contact us at <span className="font-mono text-indigo-400">privacy@folionova.io</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
