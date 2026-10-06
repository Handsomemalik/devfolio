import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Logo, Button } from "@/components/ui";
import { BRAND_NAME } from "@/config/brand";

export const metadata = {
  title: `Terms of Service | ${BRAND_NAME}`,
  description: `Terms of service and platform agreements for ${BRAND_NAME}.`,
};

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold">Terms of Service</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Effective Date: October 2026 • Last Updated: October 2026
          </p>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">1. Acceptance of Terms</h2>
            <p>
              By signing up for or using {BRAND_NAME}, you agree to abide by these Terms of Service. If you do not agree, please discontinue using the service immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">2. User Account & Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your credentials. You agree not to select reserved, fraudulent, or impersonating usernames. We reserve the right to reclaim usernames that infringe on trademarks or simulate system routes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">3. Content Ownership & Rights</h2>
            <p>
              You retain 100% intellectual property ownership of the text, portfolio project assets, and media you upload to {BRAND_NAME}. By hosting a public portfolio on our platform, you grant {BRAND_NAME} the limited license to render and display your chosen content at your designated URL.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">4. Acceptable Use Policy</h2>
            <p>
              You agree not to upload malicious code, phishing content, illegal materials, or automated scraper bots. Any violation may result in immediate suspension or termination of your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">5. Disclaimer of Warranties</h2>
            <p>
              {BRAND_NAME} is provided &ldquo;as is&rdquo; without warranties of any kind. While we maintain 99.9% uptime targets and redundant cryptographic backups, we do not warrant uninterrupted operation under unforeseen third-party outages.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-primary)] font-heading">6. Contact</h2>
            <p>
              Questions regarding these terms can be directed to <span className="font-mono text-cyan-400">legal@folionova.io</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
