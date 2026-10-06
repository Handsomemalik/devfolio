"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  FileText,
  Lock,
  Zap,
  Globe,
  Sliders,
  Sun,
  Moon,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Eye,
  Check,
  QrCode,
  Search,
  ExternalLink,
  Award,
} from "lucide-react";
import { Button, Badge, Logo } from "@/components/ui";
import { GlassTiltCard } from "@/components/ui/glass-tilt-card";
import { HeroGlassSlices } from "@/components/marketing/hero-glass-slices";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_DESCRIPTION,
  DEVELOPER_CREDIT,
} from "@/config/brand";
import { PORTFOLIO_DESIGN_LIST } from "@/config/designs";
import { PORTFOLIO_COMPONENTS, PortfolioDesignKey } from "@/components/portfolio-designs";
import { DEMO_PORTFOLIO_DATA } from "@/config/demo-profile";
import { CV_TEMPLATE_LIST, CVTemplateId } from "@/config/cv-templates";
import { CV_COMPONENTS } from "@/components/cv-templates";
import { useLenis } from "@/hooks/useLenis";
import { useMounted } from "@/hooks/useMounted";
import { HeroProductDemo } from "@/components/marketing/hero-demo";

export default function MarketingLandingPage() {
  // Lenis smooth scroll on landing page
  useLenis({ enabled: true });

  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Dynamic navbar scroll state (minimal at top, floating pill on scroll)
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [navVisible, setNavVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Active design in showcase
  const [selectedDesignId, setSelectedDesignId] = React.useState("aurora");

  // FAQ open item
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on downward scroll, show on upward scroll
      if (currentScrollY > lastScrollY.current && currentScrollY > 180) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeDesign =
    PORTFOLIO_DESIGN_LIST.find((d) => d.id === selectedDesignId) ||
    PORTFOLIO_DESIGN_LIST[0];

  const faqItems = [
    {
      q: "Can I switch designs later without losing my data?",
      a: "Yes, completely! Your career information, skills, and projects are stored in your central profile. You can switch between all 5 designs (Aurora, Noir, Kinetic, Bento, Editorial) in one click at any time without retyping anything.",
    },
    {
      q: "How does my personal portfolio link work?",
      a: "Once you claim your username, your portfolio is hosted instantly at https://folionova.io/u/your-username. You can send this link to recruiters, paste it on LinkedIn, or share it via the built-in QR code.",
    },
    {
      q: "Are my phone number and email protected from scrapers?",
      a: "Yes. By default, your contact numbers and direct email are shielded. They only appear on your public link if you explicitly enable the 'Show on public portfolio' toggle in the editor.",
    },
    {
      q: "How does the ATS-optimized CV generator work?",
      a: "FolioNova automatically compiles your profile into 6 downloadable PDF templates. These use clean semantic text layers (not raster images or screenshots) with calibrated margins, ensuring applicant tracking systems (ATS) can parse your accomplishments accurately.",
    },
    {
      q: "Can I edit and update my portfolio on my phone?",
      a: "Yes! The entire FolioNova studio is 100% responsive down to 360px phones. You can add skills, adjust project details, and toggle design styles on the go.",
    },
    {
      q: "Who owns the content I upload to FolioNova?",
      a: "You retain 100% ownership of your text, images, and project work. FolioNova merely provides the cinematic rendering engine and hosting infrastructure.",
    },
    {
      q: "What security measures protect my account?",
      a: "Every database table is guarded by PostgreSQL Row Level Security (RLS). Passwords are never stored in plain text, API endpoints are protected by sliding rate limiters, and we enforce strict Content Security Policies.",
    },
    {
      q: "What happens if I decide to delete my account?",
      a: "You have full right-to-erasure. In Account Settings > Danger Zone, typing 'DELETE' triggers an immediate, permanent cascade purge of your profile records, database rows, and uploaded photos.",
    },
  ];

  return (
    <div className="min-h-screen text-[var(--text-primary)] selection:bg-[#e4572e]/25 selection:text-[#1a1a1c] dark:selection:text-white overflow-x-hidden relative">
      {/* Background radial light glow behind hero imagery */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute top-10 right-0 sm:right-[10%] w-[680px] h-[680px] bg-white/[0.14] dark:bg-white/[0.04] blur-[150px] rounded-full" />
        <div className="absolute top-[40%] -left-36 w-[550px] h-[550px] bg-[#e4572e]/[0.05] dark:bg-[#e4572e]/[0.03] blur-[160px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-100px] w-[500px] h-[500px] bg-[#1b2a6b]/[0.06] dark:bg-[#1b2a6b]/[0.04] blur-[150px] rounded-full" />
      </div>

      {/* 1. NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "pt-3.5 px-4 sm:px-6" : "pt-6 px-6 sm:px-12"}`}
      >
        <div
          className={`mx-auto transition-all duration-300 flex items-center justify-between ${
            isScrolled
              ? "max-w-6xl px-6 py-3 rounded-full backdrop-blur-[16px] bg-white/20 dark:bg-white/[0.08] border border-white/40 dark:border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.12)]"
              : "max-w-7xl px-0 py-0 bg-transparent border-transparent"
          }`}
        >
          {/* Logo */}
          <div className="shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links: 40px gap, Inter 15px, animated 1px underline */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="nav-link-cosmic">
              How It Works
            </a>
            <a href="#designs" className="nav-link-cosmic">
              5 Designs
            </a>
            <a href="#cv-templates" className="nav-link-cosmic">
              CV Templates
            </a>
            <a href="#features" className="nav-link-cosmic">
              Features
            </a>
            <a href="#security" className="nav-link-cosmic">
              Security
            </a>
            <a href="#faq" className="nav-link-cosmic">
              FAQ
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle color theme"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-white/35 bg-white/20 dark:bg-white/[0.06] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer backdrop-blur-md"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-[#1a1a1c]" />
                )}
              </button>
            )}

            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm" className="font-sans font-medium text-[15px]">
                Log in
              </Button>
            </Link>

            <Link href="/signup">
              <Button variant="primary" size="sm" magnetic className="font-sans font-medium">
                Create my portfolio
              </Button>
            </Link>

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-white/35 bg-white/20 dark:bg-white/[0.08] text-[var(--text-primary)] backdrop-blur-md"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Animated Glass Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-3 max-w-xl mx-auto rounded-3xl backdrop-blur-2xl bg-white/70 dark:bg-[#121316]/90 border border-white/40 shadow-2xl p-6 space-y-5"
            >
              <div className="flex flex-col gap-3.5 text-base font-medium text-left">
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  How It Works
                </a>
                <a
                  href="#designs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  5 Designs
                </a>
                <a
                  href="#cv-templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  CV Templates
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  Features
                </a>
                <a
                  href="#security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  Security
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 nav-link-cosmic inline-block"
                >
                  FAQ
                </a>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Create my portfolio
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {/* 2. HERO SECTION (TWO-COLUMN EDITORIAL DIGITAL SCULPTURE LAYOUT) */}
        <section className="pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Subtext, CTAs, Trust row */}
            <div className="lg:col-span-7 text-left space-y-8 pr-0 lg:pr-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/45 bg-white/25 dark:bg-white/[0.08] backdrop-blur-md text-xs font-mono tracking-wider text-[var(--text-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#e4572e] animate-pulse" />
                  <span>{BRAND_NAME} 2.0 • The Career Art Platform</span>
                </div>
              </motion.div>

              {/* Giant Condensed Serif Upper-Case Headline with em-dash line accent */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-display-hero headline-em-dash"
              >
                Your career deserves <br />
                <span>
                  more than a PDF.
                </span>
              </motion.h1>

              {/* Calm, Light Editorial Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-xl leading-relaxed font-sans font-normal"
              >
                Fill in your achievements once. Instantly publish a cinematic, animated web portfolio at{" "}
                <span className="font-mono text-[#e4572e] dark:text-[#f97316] font-medium">folionova.io/u/you</span> and export 6
                ATS-ready executive CVs.
              </motion.p>

              {/* Action Buttons: Primary Charcoal + Secondary Transparent Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="flex flex-wrap items-center gap-5 pt-2"
              >
                <Link href="/signup">
                  <Button size="lg" variant="primary" magnetic rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Create my portfolio
                  </Button>
                </Link>

                <Link href="/demo/aurora">
                  <Button size="lg" variant="secondary" leftIcon={<Eye className="w-4 h-4 text-[#e4572e]" />}>
                    See live example
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="flex flex-wrap items-center gap-6 pt-3 text-xs font-mono text-[var(--text-secondary)]"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] dark:text-emerald-400" />
                  <span>Free to start</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] opacity-25" />
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e4572e]" />
                  <span>Link in 2 minutes</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)] opacity-25" />
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1b2a6b] dark:text-sky-400" />
                  <span>6 CV templates included</span>
                </span>
              </motion.div>
            </div>

            {/* Right Column: Monumental Statue Hero Image with Sliced Glass Refraction */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
            >
              {/* Radial light glow behind hero imagery */}
              <div
                className="absolute inset-0 -m-8 rounded-full bg-white/20 dark:bg-white/[0.08] blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              {/* Statue Frame with Sliced Glass Window Effect */}
              <div
                data-cursor="view"
                className="statue-frame relative w-full max-w-[460px] lg:max-w-none aspect-[3/4] rounded-3xl overflow-hidden border border-white/50 dark:border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.22)] bg-black/10 backdrop-blur-md group"
              >
                {/* Hero Statue Image */}
                <Image
                  src="/assets/images/hero-statue.jpg"
                  alt="Monumental classical cosmic marble sculpture"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Ambient Fiery and Cosmic Light Scrim Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c]/60 via-transparent to-transparent pointer-events-none" />

                {/* Signature Sliced Glass Effect: 5 Frosted Glass Panels */}
                <HeroGlassSlices />

                {/* Subtitle Scrim Tag */}
                <div className="absolute bottom-5 inset-x-5 z-30 flex items-center justify-between text-xs font-mono text-white/90 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
                  <span className="uppercase tracking-widest text-[11px]">Digital Sculpture № 01</span>
                  <span className="text-[#e4572e] flex items-center gap-1.5 font-sans font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#e4572e] animate-ping" />
                    Interactive View
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* BELOW THE HERO: ROW OF 3 GLASS IMAGE TILES WITH CAPTIONS */}
          <div className="pt-20 sm:pt-28">
            <div className="text-left mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">
                Featured Sculpture Archetypes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Tile 1: Aurora Glass */}
              <Link href="#designs" onClick={() => setSelectedDesignId("aurora")}>
                <GlassTiltCard className="sculpture-tile relative h-80 rounded-3xl overflow-hidden p-0 border border-white/40 cursor-pointer">
                  <Image
                    src="/assets/images/sculpture-aurora.jpg"
                    alt="Classical marble hands with glowing nebula orb"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  />
                  {/* Card Caption with Gradient Scrim and Condensed Serif Title at Bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 tile-caption-scrim z-10 flex flex-col justify-end text-left space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300">
                      01 • Luminous
                    </span>
                    <h3 className="font-display-card text-white uppercase tracking-tight">
                      Aurora Glass
                    </h3>
                    <p className="text-xs text-white/80 font-sans line-clamp-1">
                      Ethereal luminous gradients and frosted surfaces
                    </p>
                  </div>
                </GlassTiltCard>
              </Link>

              {/* Tile 2: Obsidian Noir */}
              <Link href="#designs" onClick={() => setSelectedDesignId("noir")}>
                <GlassTiltCard className="sculpture-tile relative h-80 rounded-3xl overflow-hidden p-0 border border-white/40 cursor-pointer">
                  <Image
                    src="/assets/images/sculpture-noir.jpg"
                    alt="Noir obsidian marble sculpture bust with cosmic fracture"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  />
                  {/* Card Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-6 tile-caption-scrim z-10 flex flex-col justify-end text-left space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300">
                      02 • Brutalist Luxury
                    </span>
                    <h3 className="font-display-card text-white uppercase tracking-tight">
                      Obsidian Noir
                    </h3>
                    <p className="text-xs text-white/80 font-sans line-clamp-1">
                      High-contrast monochrome luxury and precise typography
                    </p>
                  </div>
                </GlassTiltCard>
              </Link>

              {/* Tile 3: Kinetic Flow */}
              <Link href="#designs" onClick={() => setSelectedDesignId("kinetic")}>
                <GlassTiltCard className="sculpture-tile relative h-80 rounded-3xl overflow-hidden p-0 border border-white/40 cursor-pointer">
                  <Image
                    src="/assets/images/hero-statue.jpg"
                    alt="Liquid chrome classical marble statue with fiery trails"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                  />
                  {/* Card Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-6 tile-caption-scrim z-10 flex flex-col justify-end text-left space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-orange-300">
                      03 • Velocity
                    </span>
                    <h3 className="font-display-card text-white uppercase tracking-tight">
                      Kinetic Flow
                    </h3>
                    <p className="text-xs text-white/80 font-sans line-clamp-1">
                      Interactive velocity, physics, and scroll-driven storytelling
                    </p>
                  </div>
                </GlassTiltCard>
              </Link>
            </div>
          </div>

          {/* Animated Product Demo Built in Code */}
          <div className="pt-16 sm:pt-24">
            <HeroProductDemo />
          </div>
        </section>

        {/* 3. HOW IT WORKS (3 STEPS) */}
        <section id="how-it-works" className="py-28 sm:py-36 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="primary" size="sm">
              SIMPLE 3-STEP ENGINE
            </Badge>
            <h2 className="font-display-section">
              From zero to living portfolio in minutes
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto font-sans font-normal">
              No web hosting to set up, no templates to debug, and no CSS wrestling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <GlassTiltCard className="p-8 sm:p-10 rounded-3xl space-y-5 text-left relative group">
              <div className="w-12 h-12 rounded-2xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[var(--text-primary)] font-heading font-bold text-xl shadow-inner">
                01
              </div>
              <h3 className="font-display-card">
                Fill your details once
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Add your experience milestones, core skill chips, education, and social coordinates in
                our intuitive split-screen studio.
              </p>
              <div className="p-3.5 rounded-xl bg-white/25 dark:bg-white/[0.04] border border-white/30 text-xs font-mono text-[var(--text-primary)] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803d] dark:text-emerald-400 shrink-0" />
                <span>Autosaved locally &amp; to cloud</span>
              </div>
            </GlassTiltCard>

            {/* Step 2 */}
            <GlassTiltCard className="p-8 sm:p-10 rounded-3xl space-y-5 text-left relative group">
              <div className="w-12 h-12 rounded-2xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[var(--text-primary)] font-heading font-bold text-xl shadow-inner">
                02
              </div>
              <h3 className="font-display-card">
                Pick your design
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Choose from 5 completely different aesthetic archetypes. Switch anytime with a single
                click without losing a single character.
              </p>
              <div className="p-3.5 rounded-xl bg-white/25 dark:bg-white/[0.04] border border-white/30 text-xs font-mono text-[var(--text-primary)] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803d] dark:text-emerald-400 shrink-0" />
                <span>Custom accent colors &amp; typography</span>
              </div>
            </GlassTiltCard>

            {/* Step 3 */}
            <GlassTiltCard className="p-8 sm:p-10 rounded-3xl space-y-5 text-left relative group">
              <div className="w-12 h-12 rounded-2xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[var(--text-primary)] font-heading font-bold text-xl shadow-inner">
                03
              </div>
              <h3 className="font-display-card">
                Share your personal link
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Publish live at <span className="font-mono text-[#e4572e] dark:text-[#f97316]">folionova.io/u/you</span>.
                Send it to recruiters, scan with QR codes, or export selectable-text CVs.
              </p>
              <div className="p-3.5 rounded-xl bg-white/25 dark:bg-white/[0.04] border border-white/30 text-xs font-mono text-[var(--text-primary)] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803d] dark:text-emerald-400 shrink-0" />
                <span>Instant ATS resume export</span>
              </div>
            </GlassTiltCard>
          </div>
        </section>

        {/* 4. DESIGNS SHOWCASE (5 ARCHETYPES) */}
        <section id="designs" className="py-28 sm:py-36 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="glow" size="sm">
              5 CINEMATIC ARCHETYPES
            </Badge>
            <h2 className="font-display-section">
              One career. 5 aesthetic universes.
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto font-sans font-normal">
              Every design has its own motion language, spacing philosophy, and typography hierarchy.
            </p>
          </div>

          {/* Interactive Design Selector Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {PORTFOLIO_DESIGN_LIST.map((design) => {
              const isSelected = selectedDesignId === design.id;
              return (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesignId(design.id)}
                  className={`px-6 py-3 rounded-xl text-xs font-semibold tracking-wider font-sans transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "btn-primary-charcoal shadow-[0_8px_25px_rgba(0,0,0,0.22)] scale-105"
                      : "bg-white/20 dark:bg-white/[0.06] border-white/35 text-[var(--text-primary)] hover:bg-white/30 hover:border-white/55 backdrop-blur-md"
                  }`}
                >
                  {design.name}
                </button>
              );
            })}
          </div>

          {/* Active Archetype Showcase Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/50 relative overflow-hidden text-left shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-2.5">
                  <Badge variant="primary">{activeDesign.vibe}</Badge>
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    Recommended Accent: {activeDesign.accentRecommended}
                  </span>
                </div>

                <h3 className="font-display-section">
                  {activeDesign.name}
                </h3>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
                  {activeDesign.description}
                </p>

                <div className="pt-2 space-y-2.5">
                  <span className="text-[11px] font-mono uppercase text-[var(--text-secondary)] tracking-wider block">
                    Signature Design Tokens
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    {activeDesign.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-[var(--text-primary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e4572e] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Choose {activeDesign.name}
                    </Button>
                  </Link>
                  <Link href={`/demo/${activeDesign.id}`}>
                    <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Explore Full Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Real Live Scaled-Down Archetype Preview */}
              <div className="lg:col-span-7 rounded-2xl border border-white/40 dark:border-white/20 bg-slate-950 shadow-2xl relative overflow-hidden h-[460px] flex flex-col">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 text-xs font-mono text-slate-400 bg-slate-900/90 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>folionova.io/demo/{activeDesign.id}</span>
                  </div>
                  <Link
                    href={`/demo/${activeDesign.id}`}
                    target="_blank"
                    className="text-xs text-[#e4572e] hover:text-white flex items-center gap-1 hover:underline"
                  >
                    <span>Open Interactive Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="relative flex-1 overflow-hidden pointer-events-none select-none bg-[#07090E]">
                  <div
                    style={{
                      transform: "scale(0.55)",
                      transformOrigin: "top left",
                      width: "182%",
                      height: "182%",
                    }}
                  >
                    {(() => {
                      const LiveComponent =
                        PORTFOLIO_COMPONENTS[selectedDesignId as PortfolioDesignKey] ||
                        PORTFOLIO_COMPONENTS.aurora;
                      return (
                        <LiveComponent
                          data={DEMO_PORTFOLIO_DATA}
                          accent={activeDesign.accentRecommended}
                          themeMode="dark"
                          font="inter"
                          mode="preview"
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CV TEMPLATES SECTION */}
        <section id="cv-templates" className="py-28 sm:py-36 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="primary" size="sm">
              ATS-OPTIMIZED PDF ENGINE
            </Badge>
            <h2 className="font-display-section">
              6 Executive CV &amp; Resume Templates
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto font-sans font-normal">
              Real selectable text, calibrated margins, and automated parsing. Never struggle with
              Word templates again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CV_TEMPLATE_LIST.map((tmpl) => (
              <GlassTiltCard
                key={tmpl.id}
                className="p-6 rounded-3xl flex flex-col justify-between space-y-5 text-left group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#e4572e] dark:text-[#f97316]">
                      {tmpl.columns} Column Layout
                    </span>
                    <Badge size="sm" variant="outline">
                      {tmpl.recommendedPages}
                    </Badge>
                  </div>

                  <h3 className="font-display-card text-lg sm:text-xl">
                    {tmpl.name}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {tmpl.description}
                  </p>
                </div>

                {/* Real Rendered Template Preview */}
                <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-white/30 dark:bg-[#07090E] border border-white/30 shadow-inner group-hover:border-white/60 transition-all select-none">
                  <div
                    className="absolute top-2 left-2 origin-top-left pointer-events-none"
                    style={{
                      width: "680px",
                      transform: "scale(0.38)",
                    }}
                  >
                    {(() => {
                      const CVComp = CV_COMPONENTS[tmpl.id as CVTemplateId];
                      return CVComp ? <CVComp data={DEMO_PORTFOLIO_DATA} /> : null;
                    })()}
                  </div>
                  {/* Bottom protective gradient fade */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 dark:from-[#0B0F19] to-transparent pointer-events-none" />
                  
                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 bg-[#1a1a1c]/25 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all flex items-center justify-center p-4">
                    <Link
                      href={`/cv?template=${tmpl.id}`}
                      className="btn-primary-charcoal px-4 py-2 text-xs flex items-center gap-1.5 transition-transform group-hover:scale-105"
                    >
                      <span>Open in CV Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                    Recommended For
                  </span>
                  <p className="text-xs font-medium text-[var(--text-primary)]">
                    {tmpl.targetAudience}
                  </p>
                </div>
              </GlassTiltCard>
            ))}
          </div>
        </section>

        {/* 6. FEATURES GRID (BENTO MATRIX) */}
        <section id="features" className="py-28 sm:py-36 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="glow" size="sm">
              BUILT FOR MODERN PROFESSIONALS
            </Badge>
            <h2 className="font-display-section">
              Everything you need to stand out
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto font-sans font-normal">
              Every detail engineered to give you unfair leverage in recruitment, client pitches, and
              consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Tile 1: Live Preview (2-span) */}
            <GlassTiltCard className="sm:col-span-2 p-7 sm:p-9 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#e4572e] shadow-inner">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-xl">Split-Screen Live Reactivity</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Watch every keystroke, new skill chip, and accent color update instantly in a live device frame with sub-50ms latency.
              </p>
            </GlassTiltCard>

            {/* Tile 2: 5 Designs */}
            <GlassTiltCard className="p-7 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#1b2a6b] dark:text-sky-300 shadow-inner">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-lg">5 Designs in 1-Click</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Switch between Aurora, Noir, Kinetic, Bento, and Editorial archetypes on the fly.
              </p>
            </GlassTiltCard>

            {/* Tile 3: 6 CV Templates */}
            <GlassTiltCard className="p-7 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#e4572e] shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-lg">6 CV Exports</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Download crisp, selectable-text PDFs calibrated to pass Applicant Tracking Systems.
              </p>
            </GlassTiltCard>

            {/* Tile 4: Custom URL */}
            <GlassTiltCard className="p-7 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#15803d] dark:text-emerald-400 shadow-inner">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-lg">Personal Hosted Link</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Claim <span className="font-mono text-[#15803d] dark:text-emerald-400">folionova.io/u/you</span>. Zero hosting configuration required.
              </p>
            </GlassTiltCard>

            {/* Tile 5: Live Analytics (2-span) */}
            <GlassTiltCard className="sm:col-span-2 p-7 sm:p-9 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#1b2a6b] dark:text-sky-300 shadow-inner">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-xl">Visitor Analytics &amp; Telemetry</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                Track how many hiring managers and visitors view your portfolio with privacy-first view counting and sparkline charts.
              </p>
            </GlassTiltCard>

            {/* Tile 6: QR Code Sharing */}
            <GlassTiltCard className="p-7 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#e4572e] shadow-inner">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-lg">Instant QR Code</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Generate high-res QR codes to share your portfolio at conferences and interviews.
              </p>
            </GlassTiltCard>

            {/* Tile 7: SEO Ready */}
            <GlassTiltCard className="p-7 rounded-3xl space-y-3">
              <div className="w-11 h-11 rounded-xl bg-white/30 dark:bg-white/[0.08] border border-white/40 flex items-center justify-center text-[#c2410c] dark:text-amber-400 shadow-inner">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-display-card text-lg">SEO &amp; Social Cards</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Automated OpenGraph meta tags make your link look stunning on Twitter, LinkedIn, and iMessage.
              </p>
            </GlassTiltCard>
          </div>
        </section>

        {/* 7. SECURITY SECTION */}
        <section id="security" className="py-28 sm:py-36 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-white/50 text-left relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/30 dark:bg-white/[0.08] border border-white/45 text-[var(--text-primary)] text-xs font-mono tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#15803d] dark:text-emerald-400" />
                <span>Enterprise Privacy &amp; Data Isolation</span>
              </div>

              <h2 className="font-display-section text-3xl sm:text-5xl">
                Security is our foundation, not an afterthought
              </h2>

              <p className="text-base text-[var(--text-secondary)] leading-relaxed font-sans font-normal">
                Your portfolio contains your career identity. We treat that with military-grade respect.
                Only you have edit rights, and draft portfolios remain strictly private.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-3.5">
                  <Lock className="w-5 h-5 text-[#e4572e] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-display-card text-sm text-[var(--text-primary)]">Postgres Row Level Security</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5 leading-relaxed">
                      Enforced directly at the database engine level. Nobody can tamper with your records.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-[#15803d] dark:text-emerald-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-display-card text-sm text-[var(--text-primary)]">Contact Shielding</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5 leading-relaxed">
                      Phone numbers and emails remain hidden from scrapers until you toggle public visibility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Zap className="w-5 h-5 text-[#1b2a6b] dark:text-sky-400 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-display-card text-sm text-[var(--text-primary)]">Rate-Limited Endpoints</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5 leading-relaxed">
                      Sliding window protection defends against brute-force password guessing and abuse.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Award className="w-5 h-5 text-[#e4572e] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-display-card text-sm text-[var(--text-primary)]">Complete Right to Erasure</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5 leading-relaxed">
                      Delete your account and all associated media files at any time with typed confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. STATS / HONEST SOCIAL PROOF ROW */}
        <section className="py-20 border-y border-white/35 bg-white/10 dark:bg-white/[0.02] backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1.5">
              <div className="font-display-hero text-4xl sm:text-6xl text-[var(--text-primary)]">
                5
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                Cinematic Designs
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-display-hero text-4xl sm:text-6xl text-[var(--text-primary)]">
                6
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                ATS CV Templates
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-display-hero text-4xl sm:text-6xl text-[var(--text-primary)]">
                2 min
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                To Publish Live
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-display-hero text-4xl sm:text-6xl text-[var(--text-primary)]">
                &lt;50ms
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-widest">
                Live Preview Latency
              </p>
            </div>
          </div>
        </section>

        {/* 9. FAQ ACCORDION (8 REAL QUESTIONS) */}
        <section id="faq" className="py-28 sm:py-36 max-w-4xl mx-auto px-4 sm:px-6 text-left">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="primary" size="sm">
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 className="font-display-section">
              Everything you need to know
            </h2>
            <p className="text-base text-[var(--text-secondary)] font-sans font-normal">
              Clear answers to the most common questions about FolioNova.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/35 bg-white/20 dark:bg-white/[0.04] backdrop-blur-md overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left font-display-card text-base sm:text-xl text-[var(--text-primary)] hover:opacity-85 transition-opacity cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? "rotate-180 text-[#e4572e]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 sm:px-8 pb-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans"
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. FINAL BIG CTA */}
        <section className="py-28 sm:py-36 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="glass-panel rounded-3xl p-10 sm:p-20 border border-white/50 text-center space-y-7 relative overflow-hidden shadow-2xl">
            {/* Ambient fiery & cosmic glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#e4572e]/10 dark:bg-[#e4572e]/15 blur-3xl rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 dark:bg-white/[0.08] border border-white/45 text-[var(--text-primary)] text-xs font-mono tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#e4572e]" />
              <span>Get Started in Under 2 Minutes</span>
            </div>

            <h2 className="font-display-hero text-3xl sm:text-5xl md:text-6xl tracking-tight">
              Ready to turn your career into a{" "}
              <span className="text-[var(--text-primary)] underline decoration-[#e4572e]/60 decoration-wavy underline-offset-8">
                living work of art?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-sans font-normal leading-relaxed">
              Join visionary developers, designers, and creators presenting their journey with
              FolioNova.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-5">
              <Link href="/signup">
                <Button size="lg" variant="primary" magnetic rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Create my portfolio free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Sign in to studio
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER */}
      <footer className="border-t border-white/35 py-16 px-4 sm:px-6 text-sm text-[var(--text-secondary)] bg-white/10 dark:bg-white/[0.02] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1.5 text-center md:text-left">
            <Logo size="sm" asLink={false} />
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              {DEVELOPER_CREDIT}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 font-sans font-medium text-sm">
            <a href="#how-it-works" className="nav-link-cosmic">
              How it works
            </a>
            <a href="#designs" className="nav-link-cosmic">
              5 Designs
            </a>
            <a href="#cv-templates" className="nav-link-cosmic">
              CV Templates
            </a>
            <a href="#security" className="nav-link-cosmic">
              Security
            </a>
            <Link href="/privacy" className="nav-link-cosmic">
              Privacy Policy
            </Link>
            <Link href="/terms" className="nav-link-cosmic">
              Terms of Service
            </Link>
            <Link href="/design-system" className="nav-link-cosmic">
              Design System Spec
            </Link>
          </div>

          <div className="text-center md:text-right font-mono text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
