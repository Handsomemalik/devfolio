"use client";

import * as React from "react";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Plus,
  Trash2,
  Check,
  Share2,
  Download,
  Sliders,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  AtSign,
  Palette,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  FileDown,
  Lock,
  Globe,
  Layers,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  MoveUp,
  MoveDown,
  QrCode,
  Globe2,
} from "lucide-react";
import {
  Button,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Input,
  Textarea,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  ColorPicker,
  AvatarUploader,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Logo,
} from "@/components/ui";
import { useEditorStore } from "@/store/editor-store";
import { toast } from "sonner";
import { PORTFOLIO_DESIGN_LIST } from "@/config/designs";
import { PORTFOLIO_COMPONENTS, PortfolioDesignKey } from "@/components/portfolio-designs";
import { CV_TEMPLATE_LIST } from "@/config/cv-templates";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import { SocialPlatform, FontStyle } from "@/types/database";

const POPULAR_SKILL_SUGGESTIONS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Supabase",
  "Framer Motion",
  "GSAP",
  "GraphQL",
  "Docker",
  "AWS",
  "Figma",
  "UI/UX Design",
  "Three.js",
  "Rust",
  "Go",
  "System Architecture",
];

export default function EditPage() {
  const {
    profile,
    skills,
    experiences,
    education,
    projects,
    social_links,
    certifications,
    testimonials,
    isDirty,
    isSaving,
    lastSavedAt,
    previewDevice,
    previewTheme,
    updateProfile,
    addSkill,
    removeSkill,
    reorderSkills,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addProject,
    removeProject,
    addSocialLink,
    removeSocialLink,
    setPreviewDevice,
    setPreviewTheme,
    undo,
    redo,
    canUndo,
    canRedo,
    markSaved,
    setSaving,
    resetToDefault,
  } = useEditorStore();

  // Mobile split view mode ("edit" or "preview")
  const [mobileTab, setMobileTab] = React.useState<"edit" | "preview">("edit");

  // Zoom control in preview
  const [zoomLevel, setZoomLevel] = React.useState<number>(100);

  // Skill input & suggestion dropdown
  const [newSkillText, setNewSkillText] = React.useState("");
  const [showSkillDropdown, setShowSkillDropdown] = React.useState(false);

  // Experience inline form
  const [isAddingExp, setIsAddingExp] = React.useState(false);
  const [expCompany, setExpCompany] = React.useState("");
  const [expRole, setExpRole] = React.useState("");
  const [expLocation, setExpLocation] = React.useState("");
  const [expStart, setExpStart] = React.useState("");
  const [expEnd, setExpEnd] = React.useState("");
  const [expCurrent, setExpCurrent] = React.useState(false);
  const [expDesc, setExpDesc] = React.useState("");

  // Education inline form
  const [isAddingEdu, setIsAddingEdu] = React.useState(false);
  const [eduInst, setEduInst] = React.useState("");
  const [eduDegree, setEduDegree] = React.useState("");
  const [eduField, setEduField] = React.useState("");
  const [eduYear, setEduYear] = React.useState("");

  // Project inline form
  const [isAddingProj, setIsAddingProj] = React.useState(false);
  const [projTitle, setProjTitle] = React.useState("");
  const [projDesc, setProjDesc] = React.useState("");
  const [projStack, setProjStack] = React.useState("");
  const [projLive, setProjLive] = React.useState("");
  const [projRepo, setProjRepo] = React.useState("");

  // Social link inline form
  const [socialPlatform, setSocialPlatform] = React.useState<SocialPlatform>("github");
  const [socialUrl, setSocialUrl] = React.useState("");

  // Publish Dialog & QR
  const [isPublishDialogOpen, setIsPublishDialogOpen] = React.useState(false);
  const [publishQrCode, setPublishQrCode] = React.useState<string | null>(null);

  // Keyboard Shortcuts Dialog
  const [isShortcutsOpen, setIsShortcutsOpen] = React.useState(false);

  // CV Export Picker Dialog
  const [isCvPickerOpen, setIsCvPickerOpen] = React.useState(false);

  // Flash highlight state for changed section
  const [highlightedSection, setHighlightedSection] = React.useState<string | null>(null);

  const triggerHighlight = (section: string) => {
    setHighlightedSection(section);
    setTimeout(() => setHighlightedSection(null), 1200);
  };

  // Autosave simulation with 800ms debounce
  React.useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        markSaved();
      }, 400);
    }, 800);

    return () => clearTimeout(timer);
  }, [isDirty, profile, skills, experiences, projects, setSaving, markSaved]);

  // Window unload warning if dirty
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved portfolio changes.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Keyboard shortcuts handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
          toast.info("Undo change");
        }
      }
      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        if (canRedo()) {
          redo();
          toast.info("Redo change");
        }
      }
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        markSaved();
        toast.success("Portfolio saved.");
      }
      // Question mark (?): open shortcuts modal
      if (e.key === "?" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo, markSaved]);

  // Handle Skill Addition
  const handleAddSkill = (skillName?: string) => {
    const name = (skillName || newSkillText).trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      toast.error(`Skill "${name}" is already in your stack.`);
      return;
    }

    if (skills.length >= 40) {
      toast.error("Maximum 40 skills allowed.");
      return;
    }

    addSkill({ name, level: 5 });
    toast.success(`Skill added.`);
    setNewSkillText("");
    setShowSkillDropdown(false);
    triggerHighlight("skills");
  };

  // Handle Experience Addition
  const handleSaveExp = () => {
    if (!expCompany.trim() || !expRole.trim()) {
      toast.error("Company and role are required.");
      return;
    }
    addExperience({
      company: expCompany.trim(),
      role: expRole.trim(),
      location: expLocation.trim(),
      start_date: expStart.trim() || "2024",
      end_date: expCurrent ? "Present" : expEnd.trim() || "2025",
      is_current: expCurrent,
      description: expDesc.trim(),
    });
    toast.success("Experience milestone added.");
    setIsAddingExp(false);
    setExpCompany("");
    setExpRole("");
    setExpLocation("");
    setExpStart("");
    setExpEnd("");
    setExpCurrent(false);
    setExpDesc("");
    triggerHighlight("experience");
  };

  // Handle Education Addition
  const handleSaveEdu = () => {
    if (!eduInst.trim()) {
      toast.error("Institution name is required.");
      return;
    }
    addEducation({
      institution: eduInst.trim(),
      degree: eduDegree.trim() || null,
      field: eduField.trim() || null,
      start_year: eduYear.trim() || null,
    });
    toast.success("Education entry added.");
    setIsAddingEdu(false);
    setEduInst("");
    setEduDegree("");
    setEduField("");
    setEduYear("");
    triggerHighlight("education");
  };

  // Handle Project Addition
  const handleSaveProj = () => {
    if (!projTitle.trim()) {
      toast.error("Project title is required.");
      return;
    }
    const stackArr = projStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addProject({
      title: projTitle.trim(),
      description: projDesc.trim() || null,
      tech_stack: stackArr,
      live_url: projLive.trim() || null,
      repo_url: projRepo.trim() || null,
      featured: true,
    });
    toast.success("Featured project added.");
    setIsAddingProj(false);
    setProjTitle("");
    setProjDesc("");
    setProjStack("");
    setProjLive("");
    setProjRepo("");
    triggerHighlight("projects");
  };

  // Handle Social Link Addition
  const handleSaveSocial = () => {
    if (!socialUrl.trim()) {
      toast.error("URL is required.");
      return;
    }
    addSocialLink({
      platform: socialPlatform,
      url: socialUrl.trim(),
    });
    toast.success("Social link added.");
    setSocialUrl("");
  };

  // Publish Flow with Confetti
  const handlePublish = () => {
    updateProfile({ is_published: true });

    const shareUrl = `${window.location.origin}/u/${profile.username || "alex-vance"}`;
    QRCode.toDataURL(shareUrl, { width: 220, margin: 2 }, (err, url) => {
      if (!err && url) setPublishQrCode(url);
    });

    setIsPublishDialogOpen(true);

    // Trigger celebratory canvas confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    toast.success("Congratulations! Your portfolio is now LIVE worldwide.");
  };

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/u/${profile.username || "alex-vance"}`
    : `https://folionova.io/u/${profile.username || "alex-vance"}`;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      {/* TOP BAR ACTION HEADER */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[var(--border-subtle)] px-4 sm:px-6 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="text-xs font-mono text-slate-400 hidden md:inline-block">
            / Live Split Studio
          </span>

          {/* Autosave Status Pill */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Autosaving...</span>
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Unsaved changes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 hidden sm:flex">
                <Check className="w-3.5 h-3.5" />
                <span>Saved {lastSavedAt ? `at ${lastSavedAt}` : "just now"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Edit/Preview View Switcher */}
          <div className="lg:hidden flex items-center p-1 bg-white/[0.06] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileTab === "edit" ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileTab === "preview" ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Undo / Redo */}
          <Button
            size="sm"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="hidden sm:inline-flex"
          >
            <Undo2 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            className="hidden sm:inline-flex"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          {/* Keyboard Shortcuts Trigger */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsShortcutsOpen(true)}
            title="Keyboard Shortcuts (?)"
            className="hidden md:inline-flex"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>

          {/* Fullscreen Preview in new tab */}
          <Link href={`/u/${profile.username || "alex-vance"}`} target="_blank">
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="hidden md:inline-flex"
            >
              Preview Tab
            </Button>
          </Link>

          {/* Publish Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={handlePublish}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Publish
          </Button>
        </div>
      </header>

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ========================================================================= */}
        {/* LEFT PANEL: RESIZABLE INDEPENDENT SCROLL EDITOR                           */}
        {/* ========================================================================= */}
        <div
          className={`w-full lg:w-[48%] xl:w-[45%] h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 border-r border-[var(--border-subtle)] space-y-6 text-left ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-heading font-extrabold">Portfolio Content</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Fill each section once. Instant updates stream to the preview.
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {profile.design_id.toUpperCase()}
            </span>
          </div>

          <Accordion
            type="multiple"
            defaultValue={["personal", "skills", "experience", "projects", "customization"]}
          >
            {/* 1. PERSONAL INFORMATION */}
            <AccordionItem value="personal">
              <AccordionTrigger
                icon={<User className="w-4 h-4" />}
                badge={
                  profile.full_name && profile.professional_title ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto mr-2" />
                  ) : null
                }
              >
                Personal Information
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <AvatarUploader
                  value={profile.avatar_url}
                  onChange={(url) => {
                    updateProfile({ avatar_url: url });
                    triggerHighlight("personal");
                  }}
                  accentColor={profile.accent_color}
                />

                <Input
                  label="Full Name *"
                  value={profile.full_name || ""}
                  onChange={(e) => {
                    updateProfile({ full_name: e.target.value });
                    triggerHighlight("personal");
                  }}
                  placeholder="e.g. Alex Vance"
                  required
                />

                <Input
                  label="Professional Title *"
                  value={profile.professional_title || ""}
                  onChange={(e) => {
                    updateProfile({ professional_title: e.target.value });
                    triggerHighlight("personal");
                  }}
                  placeholder="e.g. Principal Creative Technologist"
                  required
                />

                <Input
                  label="Headline / Tagline"
                  value={profile.headline || ""}
                  onChange={(e) => {
                    updateProfile({ headline: e.target.value });
                    triggerHighlight("personal");
                  }}
                  placeholder="e.g. Crafting fluid digital experiences..."
                />

                <Textarea
                  label="Short Bio (160 chars)"
                  value={profile.short_bio || ""}
                  onChange={(e) => {
                    updateProfile({ short_bio: e.target.value });
                    triggerHighlight("personal");
                  }}
                  showCount
                  maxLength={160}
                  placeholder="Brief statement that appears on portfolio hero..."
                />

                <Textarea
                  label="About Me (Detailed Narrative)"
                  value={profile.about_me || ""}
                  onChange={(e) => {
                    updateProfile({ about_me: e.target.value });
                    triggerHighlight("about");
                  }}
                  showCount
                  maxLength={1200}
                  rows={4}
                  placeholder="Your journey, philosophy, and approach to your craft..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    value={profile.location || ""}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                  />

                  <Input
                    label="Years of Experience"
                    type="number"
                    value={profile.years_of_experience || 0}
                    onChange={(e) => updateProfile({ years_of_experience: Number(e.target.value) })}
                  />
                </div>

                <Switch
                  label="Open to Work Badge"
                  description="Displays an illuminated 'Open to Opportunities' badge on your hero."
                  checked={profile.open_to_work}
                  onCheckedChange={(v) => {
                    updateProfile({ open_to_work: v });
                    triggerHighlight("personal");
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 2. SOCIAL LINKS */}
            <AccordionItem value="social">
              <AccordionTrigger
                icon={<Globe className="w-4 h-4" />}
                badge={<Badge size="sm">{social_links.length}</Badge>}
              >
                Social Links & Profiles
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {/* Add Social Link Form */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    value={socialPlatform}
                    onValueChange={(v) => setSocialPlatform(v as SocialPlatform)}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">GitHub</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="x">X / Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="behance">Behance</SelectItem>
                      <SelectItem value="dribbble">Dribbble</SelectItem>
                      <SelectItem value="website">Personal Site</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="https://..."
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                  />

                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={handleSaveSocial}
                    className="shrink-0"
                  >
                    Add Link
                  </Button>
                </div>

                {/* List of Social Links */}
                <div className="space-y-2">
                  {social_links.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-xl border border-[var(--border-subtle)] bg-slate-100/40 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 font-mono text-indigo-400 truncate">
                        <span className="capitalize font-semibold text-white">{link.platform}:</span>
                        <span className="truncate text-slate-400">{link.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(link.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. SKILLS WITH SUGGESTIONS */}
            <AccordionItem value="skills">
              <AccordionTrigger
                icon={<Sparkles className="w-4 h-4" />}
                badge={<Badge size="sm">{skills.length} / 40</Badge>}
              >
                Skills & Technologies
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {/* Input & Add Button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSkill();
                  }}
                  className="flex gap-2 relative"
                >
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type skill & press Enter (e.g. Next.js, Rust)..."
                      value={newSkillText}
                      onChange={(e) => {
                        setNewSkillText(e.target.value);
                        setShowSkillDropdown(true);
                      }}
                      onFocus={() => setShowSkillDropdown(true)}
                    />

                    {/* Suggestions Dropdown */}
                    {showSkillDropdown && newSkillText && (
                      <div className="absolute left-0 right-0 top-12 z-20 max-h-48 overflow-y-auto glass-panel p-2 rounded-xl border border-[var(--border-strong)] shadow-xl space-y-1">
                        {POPULAR_SKILL_SUGGESTIONS.filter((s) =>
                          s.toLowerCase().includes(newSkillText.toLowerCase())
                        ).map((s) => (
                          <div
                            key={s}
                            onClick={() => handleAddSkill(s)}
                            className="px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-600/20 cursor-pointer font-medium flex items-center justify-between"
                          >
                            <span>{s}</span>
                            <span className="text-[10px] text-indigo-400">+ Add</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" size="sm" variant="primary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </form>

                {/* Popular Skill Quick Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Quick Add Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILL_SUGGESTIONS.slice(0, 8).map((s) => {
                      const alreadyAdded = skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase());
                      if (alreadyAdded) return null;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleAddSkill(s)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.03] text-slate-300 hover:border-indigo-400 cursor-pointer"
                        >
                          + {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Skills Chips */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="primary"
                      onRemove={() => {
                        removeSkill(skill.id);
                        toast.info(`Removed "${skill.name}".`);
                        triggerHighlight("skills");
                      }}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. WORK EXPERIENCE */}
            <AccordionItem value="experience">
              <AccordionTrigger
                icon={<Briefcase className="w-4 h-4" />}
                badge={<Badge size="sm">{experiences.length}</Badge>}
              >
                Work Experience
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {!isAddingExp && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setIsAddingExp(true)}
                  >
                    Add Experience Milestone
                  </Button>
                )}

                {/* Inline Add Form */}
                {isAddingExp && (
                  <div className="p-4 rounded-2xl border border-indigo-500/30 bg-slate-900/40 space-y-3">
                    <h4 className="text-xs font-bold font-heading text-indigo-400">
                      New Experience
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Company *"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        placeholder="Company name"
                        required
                      />
                      <Input
                        label="Role Title *"
                        value={expRole}
                        onChange={(e) => setExpRole(e.target.value)}
                        placeholder="Senior Engineer"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="Start Date"
                        value={expStart}
                        onChange={(e) => setExpStart(e.target.value)}
                        placeholder="2023"
                      />
                      <Input
                        label="End Date"
                        value={expEnd}
                        disabled={expCurrent}
                        onChange={(e) => setExpEnd(e.target.value)}
                        placeholder="Present"
                      />
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expCurrent}
                            onChange={(e) => setExpCurrent(e.target.checked)}
                          />
                          <span>Current Role</span>
                        </label>
                      </div>
                    </div>

                    <Textarea
                      label="Key Achievements & Bullets"
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      placeholder="• Led engineering team of 8...&#10;• Reduced latency by 45%..."
                    />

                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="ghost" onClick={() => setIsAddingExp(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleSaveExp}>
                        Save Experience
                      </Button>
                    </div>
                  </div>
                )}

                {/* List of Experiences */}
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-slate-100/40 dark:bg-white/[0.02] space-y-1.5 relative group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-bold font-heading">{exp.company}</div>
                          <div className="text-xs font-semibold text-indigo-400">{exp.role}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            removeExperience(exp.id);
                            triggerHighlight("experience");
                          }}
                          className="text-red-500 hover:bg-red-500/10 p-1.5 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {exp.description && (
                        <p className="text-xs text-[var(--text-secondary)] whitespace-pre-line pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. EDUCATION */}
            <AccordionItem value="education">
              <AccordionTrigger
                icon={<GraduationCap className="w-4 h-4" />}
                badge={<Badge size="sm">{education.length}</Badge>}
              >
                Education & Degrees
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {!isAddingEdu && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setIsAddingEdu(true)}
                  >
                    Add Education Entry
                  </Button>
                )}

                {isAddingEdu && (
                  <div className="p-4 rounded-2xl border border-indigo-500/30 bg-slate-900/40 space-y-3">
                    <Input
                      label="Institution *"
                      value={eduInst}
                      onChange={(e) => setEduInst(e.target.value)}
                      placeholder="University / Institute"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Degree"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        placeholder="B.S. / M.S."
                      />
                      <Input
                        label="Graduation Year"
                        value={eduYear}
                        onChange={(e) => setEduYear(e.target.value)}
                        placeholder="2022"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="ghost" onClick={() => setIsAddingEdu(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleSaveEdu}>
                        Save Education
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-3 rounded-xl border border-[var(--border-subtle)] bg-slate-100/40 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold">{edu.institution}</div>
                        <div className="text-slate-400">{edu.degree}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6. FEATURED PROJECTS */}
            <AccordionItem value="projects">
              <AccordionTrigger
                icon={<FolderGit2 className="w-4 h-4" />}
                badge={<Badge size="sm">{projects.length}</Badge>}
              >
                Featured Projects
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {!isAddingProj && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => setIsAddingProj(true)}
                  >
                    Add Project Spotlight
                  </Button>
                )}

                {isAddingProj && (
                  <div className="p-4 rounded-2xl border border-indigo-500/30 bg-slate-900/40 space-y-3">
                    <Input
                      label="Project Title *"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="Project name"
                    />
                    <Textarea
                      label="Description"
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Brief overview of impact..."
                    />
                    <Input
                      label="Tech Stack (comma separated)"
                      value={projStack}
                      onChange={(e) => setProjStack(e.target.value)}
                      placeholder="Next.js, TypeScript, Supabase"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Live URL"
                        value={projLive}
                        onChange={(e) => setProjLive(e.target.value)}
                        placeholder="https://..."
                      />
                      <Input
                        label="Repo URL"
                        value={projRepo}
                        onChange={(e) => setProjRepo(e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button size="sm" variant="ghost" onClick={() => setIsAddingProj(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" onClick={handleSaveProj}>
                        Save Project
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-slate-100/40 dark:bg-white/[0.02] space-y-2 relative"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold font-heading">{proj.title}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            removeProject(proj.id);
                            triggerHighlight("projects");
                          }}
                          className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{proj.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {proj.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7. CUSTOMIZATION (DESIGN, ACCENT, FONT) */}
            <AccordionItem value="customization">
              <AccordionTrigger icon={<Palette className="w-4 h-4" />}>
                Customization &amp; Theme
              </AccordionTrigger>
              <AccordionContent className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300">
                      Portfolio Layout Archetype
                    </label>
                    <Link
                      href={`/u/${profile.username || "alex-vance"}`}
                      target="_blank"
                      className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 hover:underline"
                    >
                      <span>Preview Full Screen</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PORTFOLIO_DESIGN_LIST.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          updateProfile({ design_id: d.id });
                          triggerHighlight("hero");
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          profile.design_id === d.id
                            ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30"
                            : "border-[var(--border-subtle)] hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{d.name}</span>
                          {profile.design_id === d.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                          {d.vibe}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 block mb-1.5">
                    Font Typography Style
                  </label>
                  <Select
                    value={profile.font_style}
                    onValueChange={(val) => updateProfile({ font_style: val as FontStyle })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter (Modern Clean UI)</SelectItem>
                      <SelectItem value="sora">Sora (Geometric Tech Display)</SelectItem>
                      <SelectItem value="poppins">Poppins (Friendly Rounded)</SelectItem>
                      <SelectItem value="roboto">Roboto (Classic Professional)</SelectItem>
                      <SelectItem value="mono">JetBrains Mono (Developer First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ColorPicker
                  value={profile.accent_color}
                  onChange={(c) => {
                    updateProfile({ accent_color: c });
                    triggerHighlight("personal");
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 8. CONTACT INFORMATION */}
            <AccordionItem value="contact">
              <AccordionTrigger icon={<AtSign className="w-4 h-4" />}>
                Contact Coordinates &amp; Privacy
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Input
                  label="Direct Email"
                  value={profile.email_public || ""}
                  onChange={(e) => updateProfile({ email_public: e.target.value })}
                  placeholder="you@domain.com"
                />
                <Input
                  label="Phone Number"
                  value={profile.phone_public || ""}
                  onChange={(e) => updateProfile({ phone_public: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
                <Switch
                  label="Show Email on Portfolio"
                  description="Displays an active contact card on your public link."
                  checked={profile.show_email}
                  onCheckedChange={(v) => updateProfile({ show_email: v })}
                />
                <Switch
                  label="Show Phone on Portfolio"
                  description="Enable only if you want direct recruiter phone calls."
                  checked={profile.show_phone}
                  onCheckedChange={(v) => updateProfile({ show_phone: v })}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 9. SEO & SHARING */}
            <AccordionItem value="seo">
              <AccordionTrigger icon={<Search className="w-4 h-4" />}>
                SEO &amp; Social Card Preview
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Input
                  label="SEO Page Title"
                  value={profile.seo_title || ""}
                  onChange={(e) => updateProfile({ seo_title: e.target.value })}
                  placeholder={`${profile.full_name || "Alex Vance"} — Portfolio`}
                />
                <Textarea
                  label="Meta Description"
                  value={profile.seo_description || ""}
                  onChange={(e) => updateProfile({ seo_description: e.target.value })}
                  placeholder="Portfolio and selected works of..."
                />

                {/* Social Card Preview Frame */}
                <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-slate-100/50 dark:bg-white/[0.02] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Social Share Card Preview:
                  </span>
                  <div className="rounded-lg border border-[var(--border-strong)] bg-slate-900 p-3 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400">folionova.io</span>
                    <h5 className="text-xs font-bold text-white">
                      {profile.seo_title || `${profile.full_name} — Portfolio`}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {profile.seo_description || profile.short_bio}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 bg-[var(--bg-page)]/95 backdrop-blur-md pt-3 pb-1 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  markSaved();
                  toast.success("Portfolio saved successfully!");
                }}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save Portfolio
              </Button>

              <Link href="/cv">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<FileDown className="w-3.5 h-3.5 text-cyan-400" />}
                >
                  CV Studio
                </Button>
              </Link>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={resetToDefault}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: LIVE INTERACTIVE PREVIEW WITH ZOOM & FRAMES                  */}
        {/* ========================================================================= */}
        <div
          className={`w-full lg:w-[52%] xl:w-[55%] h-[calc(100vh-4rem)] flex flex-col bg-slate-900/60 overflow-hidden ${
            mobileTab === "edit" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Preview Toolbar */}
          <div className="h-12 border-b border-[var(--border-subtle)] px-4 flex items-center justify-between text-xs bg-slate-950/40">
            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm" dot>
                LIVE
              </Badge>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                Auto-Preview Active
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === "desktop" ? "bg-white/15 text-white" : "text-slate-400"
                }`}
                title="Desktop (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === "tablet" ? "bg-white/15 text-white" : "text-slate-400"
                }`}
                title="Tablet (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === "mobile" ? "bg-white/15 text-white" : "text-slate-400"
                }`}
                title="Mobile (360px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span>{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(100, z + 10))}
                className="hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Frame Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              className={`transition-all duration-300 rounded-3xl border border-[var(--border-strong)] bg-slate-950 p-6 sm:p-10 text-left shadow-2xl relative overflow-hidden ${
                previewDevice === "mobile"
                  ? "w-[360px] min-h-[640px]"
                  : previewDevice === "tablet"
                  ? "w-[720px] min-h-[700px]"
                  : "w-full min-h-[600px]"
              }`}
            >
              {/* Draft Banner if Unpublished */}
              {!profile.is_published && (
                <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your portfolio is in private draft mode.</span>
                  </span>
                  <button
                    type="button"
                    onClick={handlePublish}
                    className="underline font-bold"
                  >
                    Publish Now
                  </button>
                </div>
              )}

              {/* Live Registered Archetype Preview */}
              {(() => {
                const activeDesignKey = (profile.design_id as PortfolioDesignKey) || "aurora";
                const DesignComponent = PORTFOLIO_COMPONENTS[activeDesignKey] || PORTFOLIO_COMPONENTS.aurora;

                return (
                  <div className="w-full">
                    <DesignComponent
                      data={{
                        profile,
                        skills,
                        experiences,
                        education,
                        projects,
                        social_links,
                        certifications,
                        testimonials,
                      }}
                      accent={profile.accent_color || "#6366F1"}
                      themeMode={previewTheme}
                      font={profile.font_style}
                      mode="editor"
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PUBLISH CONFETTI MODAL DIALOG                                             */}
      {/* ========================================================================= */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="text-center sm:text-left max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto sm:mx-0 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl">Your Portfolio is LIVE! 🚀</DialogTitle>
            <DialogDescription>
              Your living portfolio has been published. Send your link to recruiters, clients, and teammates.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {publishQrCode && (
              <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200 mx-auto w-fit">
                <img src={publishQrCode} alt="Portfolio QR Code" className="w-40 h-40 rounded-lg" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={publicUrl}
                className="flex-1 h-10 px-3 text-xs font-mono rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-[var(--border-subtle)] truncate text-indigo-400"
              />
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  navigator.clipboard?.writeText(publicUrl);
                  toast.success("Link copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Link href={publicUrl} target="_blank">
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                View Live Page
              </Button>
            </Link>
            <Button size="sm" variant="primary" onClick={() => setIsPublishDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* KEYBOARD SHORTCUTS DIALOG                                                 */}
      {/* ========================================================================= */}
      <Dialog open={isShortcutsOpen} onOpenChange={setIsShortcutsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Speed up your studio workflow with native keyboard combinations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
              <span>Save Portfolio</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-white">Ctrl + S</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
              <span>Undo Last Action</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-white">Ctrl + Z</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
              <span>Redo Action</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-white">Ctrl + Y</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
              <span>Toggle Shortcuts Guide</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-white">?</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* CV TEMPLATE DOWNLOAD PICKER DIALOG                                        */}
      {/* ========================================================================= */}
      <Dialog open={isCvPickerOpen} onOpenChange={setIsCvPickerOpen}>
        <DialogContent className="max-w-lg text-left">
          <DialogHeader>
            <DialogTitle>Export ATS-Optimized Resume</DialogTitle>
            <DialogDescription>
              Select one of the 6 executive formats to compile into a crisp PDF with real selectable text.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-3">
            {CV_TEMPLATE_LIST.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  updateProfile({ cv_template_id: tmpl.id });
                  toast.success(`Selected ${tmpl.name} template.`);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  profile.cv_template_id === tmpl.id
                    ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30"
                    : "border-[var(--border-subtle)] hover:border-slate-400"
                }`}
              >
                <h4 className="text-xs font-bold font-heading">{tmpl.name}</h4>
                <p className="text-[11px] text-[var(--text-secondary)]">{tmpl.columns} Col • {tmpl.recommendedPages}</p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success("Compiling PDF with selectable text layers...");
                setIsCvPickerOpen(false);
              }}
            >
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
