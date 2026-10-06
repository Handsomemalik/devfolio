"use client";

import * as React from "react";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { useEditorStore } from "@/store/editor-store";
import { createClient } from "@/lib/supabase/client";
import { CV_TEMPLATE_LIST, CVTemplateId } from "@/config/cv-templates";
import { CvDocument } from "@/lib/cv/CvDocument";
import { DEFAULT_CV_SETTINGS } from "@/lib/validations/cv-settings";
import { CvSettings, CvPaperSize } from "@/types/database";
import {
  FileDown,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button, Badge, Switch, Logo, ColorPicker } from "@/components/ui";
import { toast } from "sonner";

export default function CvStudioPage() {
  const {
    profile,
    skills,
    experiences,
    education,
    projects,
    social_links,
    certifications,
    testimonials,
    updateProfile,
  } = useEditorStore();

  const [settings, setSettings] = React.useState<CvSettings>(() => {
    return (profile.cv_settings as CvSettings) || {
      ...DEFAULT_CV_SETTINGS,
      template_id: (profile.cv_template_id as CVTemplateId) || "executive",
      accent_color: profile.accent_color || "#6366F1",
    };
  });

  const [pdfBlobUrl, setPdfBlobUrl] = React.useState<string | null>(null);
  const [isCompiling, setIsCompiling] = React.useState(true);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const payload = React.useMemo(() => ({
    profile,
    skills,
    experiences,
    education,
    projects,
    social_links,
    certifications,
    testimonials,
  }), [profile, skills, experiences, education, projects, social_links, certifications, testimonials]);

  // CV Readiness Checklist
  const readinessChecklist = [
    { label: "Executive Summary / Bio", done: Boolean(profile.about_me || profile.short_bio), anchor: "personal" },
    { label: "Work Experience Milestones", done: experiences.length > 0, anchor: "experience" },
    { label: "At least 5 Skills", done: skills.length >= 5, anchor: "skills" },
    { label: "Email Contact Displayed", done: Boolean(profile.show_email && profile.email_public), anchor: "contact" },
    { label: "Location Coordinates", done: Boolean(profile.location), anchor: "personal" },
    { label: "Key Projects Spotlighted", done: projects.length > 0, anchor: "projects" },
    { label: "Academic Education", done: education.length > 0, anchor: "education" },
  ];

  const readyScore = Math.round(
    (readinessChecklist.filter((i) => i.done).length / readinessChecklist.length) * 100
  );

  // Compile PDF document blob with 350ms debounce
  React.useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(async () => {
      try {
        setIsCompiling(true);
        const doc = <CvDocument data={payload} settings={settings} />;
        const blob = await pdf(doc).toBlob();

        if (!isCancelled) {
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setIsCompiling(false);
        }
      } catch (err) {
        console.error("PDF Compilation error:", err);
        if (!isCancelled) setIsCompiling(false);
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [payload, settings]);

  // Sync settings back to store and database
  const updateSettings = React.useCallback(
    async (updater: Partial<CvSettings>) => {
      const updated: CvSettings = { ...settings, ...updater };
      setSettings(updated);
      updateProfile({
        cv_settings: updated,
        cv_template_id: updated.template_id,
        accent_color: updated.accent_color,
      });

      // Persist to Supabase if authenticated
      try {
        const supabase = createClient();
        if (profile?.id && profile.id !== "demo-profile-id") {
          await supabase
            .from("profiles")
            .update({
              cv_settings: updated,
              cv_template_id: updated.template_id,
              accent_color: updated.accent_color,
            })
            .eq("id", profile.id);
        }
      } catch {
        // Handled silently
      }
    },
    [settings, profile, updateProfile]
  );

  // Client-side instant download
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const safeName = (profile.full_name || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `${safeName}-CV.pdf`;

      const doc = <CvDocument data={payload} settings={settings} />;
      const blob = await pdf(doc).toBlob();

      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy public server download link
  const publicCvUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/cv/${profile.username || "alex-vance"}`
    : `https://folionova.io/api/cv/${profile.username || "alex-vance"}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicCvUrl);
    setCopiedLink(true);
    toast.success("Public CV download link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Trigger print via iframe
  const handlePrint = () => {
    if (!pdfBlobUrl) return;
    const printWindow = window.open(pdfBlobUrl);
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[var(--border-subtle)] px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <span className="w-px h-4 bg-white/10 hidden sm:inline" />

          <div className="flex items-center gap-2">
            <Logo size="sm" showText={false} asLink={false} />
            <span className="font-heading font-bold text-sm">CV &amp; Resume Studio</span>
            <Badge variant="glow" size="sm" className="hidden md:inline-flex">
              ATS-Calibrated
            </Badge>
          </div>
        </div>

        {/* Header Actions: Copy Link, Print, Download */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="text-xs h-8 gap-1.5"
            title="Copy Public Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Share Link</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs h-8 gap-1.5"
            title="Print PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleDownloadPdf}
            disabled={isDownloading || isCompiling}
            className="text-xs h-8 gap-1.5 px-3.5"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Studio Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Template Picker, Options, Readiness Checker */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] border-r border-[var(--border-subtle)] bg-slate-900/40 p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* CV Readiness Score Card */}
          <div className="p-4 rounded-2xl border border-[var(--border-strong)] bg-white/[0.02] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400">CV Readiness Audit</span>
                <h4 className="font-heading font-bold text-sm text-white">
                  {readyScore >= 85 ? "ATS-Ready (Excellent)" : "Needs Attention"}
                </h4>
              </div>
              <Badge variant={readyScore >= 85 ? "success" : "warning"} size="sm">
                {readyScore}%
              </Badge>
            </div>

            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${readyScore}%` }}
              />
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {readinessChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span className={item.done ? "text-slate-300" : "text-amber-300 font-medium"}>
                      {item.label}
                    </span>
                  </div>
                  {!item.done && (
                    <Link href={`/edit`} className="text-[11px] text-indigo-400 hover:underline">
                      Fix in Studio →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 1. Template Archetype Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                1. Select CV Template (6 Archetypes)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CV_TEMPLATE_LIST.map((tmpl) => {
                const isSelected = settings.template_id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => updateSettings({ template_id: tmpl.id })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 text-left ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30 shadow-lg"
                        : "border-[var(--border-subtle)] bg-slate-900/20 hover:border-slate-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading text-white">{tmpl.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {tmpl.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                        {tmpl.columns} Col
                      </span>
                      {tmpl.hasPhoto && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">
                          Photo
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Format & Layout Options */}
          <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              2. Document Settings
            </label>

            {/* Paper Size */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Paper Standard</span>
              <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/10 rounded-xl">
                {(["A4", "LETTER"] as CvPaperSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateSettings({ paper_size: size })}
                    className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                      settings.paper_size === size
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {size === "A4" ? "A4 (Standard)" : "US Letter"}
                  </button>
                ))}
              </div>
            </div>

            {/* Include Photo Toggle (Only visible for photo-compatible templates) */}
            {["modern", "creative", "elegant"].includes(settings.template_id) && (
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-slate-300 block">Include Profile Photo</span>
                  <span className="text-[11px] text-slate-500">
                    {profile.avatar_url ? "Render in header / sidebar" : "No photo uploaded in profile"}
                  </span>
                </div>
                <Switch
                  checked={settings.include_photo && Boolean(profile.avatar_url)}
                  disabled={!profile.avatar_url}
                  onCheckedChange={(checked) => updateSettings({ include_photo: checked })}
                />
              </div>
            )}

            {/* Accent Color */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-slate-300 block">Print Accent Color</span>
              <ColorPicker
                value={settings.accent_color}
                onChange={(c) => updateSettings({ accent_color: c })}
              />
            </div>
          </div>

          {/* 3. Section Visibility Toggles */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
              3. Section Inclusions
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.keys(settings.sections).map((key) => {
                const sectionKey = key as keyof typeof settings.sections;
                const isEnabled = settings.sections[sectionKey];
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => {
                        updateSettings({
                          sections: {
                            ...settings.sections,
                            [sectionKey]: e.target.checked,
                          },
                        });
                      }}
                      className="rounded accent-indigo-600"
                    />
                    <span className="capitalize text-slate-300 text-xs">{key}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Live Zoomable PDF Viewer */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-8 flex flex-col items-center justify-between relative overflow-hidden">
          {/* Viewer Floating Controls Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              {isCompiling ? (
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling PDF vector stream...</span>
                </div>
              ) : (
                <Badge variant="success" size="sm" dot>
                  Live Vector Render
                </Badge>
              )}
            </div>

            {/* Zoom Slider / Controls */}
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 px-2 py-1 rounded-xl text-xs font-mono text-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                className="hover:text-white p-1"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="hover:text-white p-1"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render PDF Canvas / Iframe */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center overflow-auto rounded-3xl border border-[var(--border-strong)] bg-slate-900/60 shadow-2xl relative min-h-[500px]">
            {pdfBlobUrl ? (
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title="Live CV PDF Preview"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "center top",
                }}
                className="w-full h-full min-h-[680px] rounded-2xl border-0 transition-transform duration-200"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-xs font-mono">Synthesizing vector layers...</p>
              </div>
            )}
          </div>

          {/* Footer Quality Note */}
          <footer className="w-full max-w-4xl pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Standard: Selectable text • Embedded Fonts • 300 DPI</span>
            <span>FolioNova Executive Engine</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
