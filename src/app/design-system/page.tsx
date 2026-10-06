"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Skeleton,
  Badge,
  ColorPicker,
  AvatarUploader,
  Stepper,
  ProgressRing,
  EmptyState,
  Logo,
} from "@/components/ui";
import {
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Send,
  Sliders,
  Shield,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";
import { useMounted } from "@/hooks/useMounted";

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [color, setColor] = React.useState("#6366F1");
  const [chips, setChips] = React.useState(["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"]);
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [progressVal, setProgressVal] = React.useState(68);
  const [avatar, setAvatar] = React.useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] px-4 sm:px-8 py-12 selection:bg-indigo-500/20">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[var(--border-subtle)]">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Logo size="md" asLink={false} />
                <Badge variant="glow" size="sm">DESIGN SYSTEM SPEC</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                {BRAND_NAME} Component Library • Zero AI Slop • Production Tokens
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm" leftIcon={<ArrowRight className="w-3.5 h-3.5 rotate-180" />}>
                  Back to Home
                </Button>
              </Link>

              {mounted && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              )}
            </div>
          </div>

          {/* Section 1: Brand & Typography */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-xl font-heading font-bold">1. Brand Identity & Typography</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-xs font-mono uppercase text-slate-400">Monogram & Wordmark Sizes</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <Logo size="sm" />
                  <Logo size="md" />
                  <Logo size="lg" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h3 className="text-xs font-mono uppercase text-slate-400">Font Stack Specimens</h3>
                <div className="space-y-2">
                  <p className="font-heading text-lg font-bold">Sora: Headings & Display ({BRAND_TAGLINE})</p>
                  <p className="font-sans text-sm text-[var(--text-secondary)]">Inter: Body text crafted for maximal legibility across high-density layouts.</p>
                  <p className="font-mono text-xs text-indigo-400">JetBrains Mono: const stack = [&apos;Next.js&apos;, &apos;GSAP&apos;, &apos;Zod&apos;];</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Buttons & Actions */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-500">
                <Sliders className="w-5 h-5" />
                <h2 className="text-xl font-heading font-bold">2. Buttons & Actions</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBtnLoading(!btnLoading)}
              >
                Toggle Loading State: {btnLoading ? "ON" : "OFF"}
              </Button>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400">Variants</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" isLoading={btnLoading} leftIcon={<Sparkles className="w-4 h-4" />}>
                    Primary Gradient
                  </Button>
                  <Button variant="secondary" isLoading={btnLoading}>
                    Secondary Glass
                  </Button>
                  <Button variant="outline" isLoading={btnLoading}>
                    Outline Border
                  </Button>
                  <Button variant="ghost" isLoading={btnLoading}>
                    Ghost Action
                  </Button>
                  <Button variant="glow" isLoading={btnLoading}>
                    Cyber Glow
                  </Button>
                  <Button variant="danger" isLoading={btnLoading}>
                    Destructive Action
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400">Sizes & Magnetic Pull</h4>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small (36px)</Button>
                  <Button size="md">Medium (44px)</Button>
                  <Button size="lg">Large (52px)</Button>
                  <Button magnetic variant="glow">
                    Magnetic Hover (Try Me!)
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => toast.success("Toast notification triggered smoothly!")}
                  >
                    Trigger Sonner Toast
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Form Controls & Inputs */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Code2 className="w-5 h-5" />
              <h2 className="text-xl font-heading font-bold">3. Form Primitives & Validation</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Vance"
                  defaultValue="Alex Vance"
                  helperText="Your legal or professional name displayed on portfolios."
                />

                <Input
                  label="Claim Custom Username"
                  placeholder="alex-vance"
                  defaultValue="alex-vance"
                  leftIcon={<span className="text-xs font-mono text-slate-400">u/</span>}
                />

                <Input
                  label="Input with Error State"
                  defaultValue="invalid-email@"
                  error="Please enter a valid email address."
                />

                <Textarea
                  label="Professional Bio"
                  defaultValue="8+ years crafting fluid digital experiences at the intersection of motion, code & aesthetics."
                  showCount
                  maxLength={180}
                  helperText="Keep it punchy for recruiters and clients."
                />
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <label className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 block mb-1.5">
                    Select Portfolio Archetype
                  </label>
                  <Select defaultValue="aurora">
                    <SelectTrigger>
                      <SelectValue placeholder="Select design..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aurora">Aurora Glass (Luminous)</SelectItem>
                      <SelectItem value="noir">Obsidian Noir (Monochrome)</SelectItem>
                      <SelectItem value="kinetic">Kinetic Flow (High-Velocity)</SelectItem>
                      <SelectItem value="bento">Bento Matrix (Apple Style)</SelectItem>
                      <SelectItem value="editorial">Editorial Atelier (High-Fashion)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <Switch
                    label="Publicly Published"
                    description="Allow search engines and visitors to see your portfolio."
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                  <Switch
                    label="Display Email Publicly"
                    description="Show contact button directly on hero section."
                  />
                </div>

                <div className="pt-2">
                  <ColorPicker
                    value={color}
                    onChange={(c) => {
                      setColor(c);
                      toast.info(`Accent updated to ${c}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Interactive Panels & Navigation */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Layers className="w-5 h-5" />
              <h2 className="text-xl font-heading font-bold">4. Layouts, Modals, Tabs & Accordions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Accordion Panels */}
              <div className="glass-panel p-6 rounded-2xl space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Collapsible Editor Cards</h4>
                <Accordion type="single" collapsible defaultValue="personal">
                  <AccordionItem value="personal">
                    <AccordionTrigger icon={<Sparkles className="w-4 h-4" />}>
                      Personal Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Configure your headline, current role, avatar photo, and location.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="skills">
                    <AccordionTrigger icon={<Code2 className="w-4 h-4" />}>
                      Skills & Technologies
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Add proficiency ratings, categorize skills, and drag to reorder.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Tabs & Modals */}
              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Animated Tabs</h4>
                  <Tabs defaultValue="editor">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="preview">Live Preview</TabsTrigger>
                      <TabsTrigger value="cv">CV Export</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="p-4 rounded-xl bg-slate-100/50 dark:bg-white/[0.02]">
                      <p className="text-xs text-slate-400">Left-side split view editor with collapsible forms.</p>
                    </TabsContent>
                    <TabsContent value="preview" className="p-4 rounded-xl bg-slate-100/50 dark:bg-white/[0.02]">
                      <p className="text-xs text-slate-400">Right-side live portfolio renderer with device toggle.</p>
                    </TabsContent>
                    <TabsContent value="cv" className="p-4 rounded-xl bg-slate-100/50 dark:bg-white/[0.02]">
                      <p className="text-xs text-slate-400">PDF download engine with 6 ATS-ready templates.</p>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Dialog Demo */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">Open Dialog Modal</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish Your Portfolio?</DialogTitle>
                        <DialogDescription>
                          Your site will be live at <span className="font-mono text-indigo-400">https://folionova.io/u/alex-vance</span>.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-3">
                        <Input label="Custom Subtitle" defaultValue="Living Work of Art" />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => toast.success("Portfolio published live!")}>
                          Confirm Publish
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Dropdown Menu Demo */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Action Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => toast.info("Copied public link")}>
                        Copy Share URL
                        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Exporting PDF...")}>
                        Download CV
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem danger onClick={() => toast.error("Action reset")}>
                        Reset to Defaults
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Tooltip Demo */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">Hover for Tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Instant ATS compatibility check: 100/100</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Badges, Progress, Avatar & Shimmer */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-heading font-bold">5. Feedback, Chips & Media</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono uppercase text-slate-400">Removable Chips (Skills)</h4>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <Badge
                      key={chip}
                      variant="primary"
                      onRemove={() => {
                        setChips(chips.filter((c) => c !== chip));
                        toast.info(`Removed ${chip}`);
                      }}
                    >
                      {chip}
                    </Badge>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setChips([...chips, "New Skill"])}
                  >
                    + Add
                  </Button>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
                  <h4 className="text-xs font-mono uppercase text-slate-400">Status Badges</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success" dot>Live & Published</Badge>
                    <Badge variant="warning" dot>Draft In Progress</Badge>
                    <Badge variant="danger" dot>Unverified Email</Badge>
                    <Badge variant="glow">Pro Vanguard</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400">Progress Rings & Steppers</h4>
                  <div className="flex items-center gap-6">
                    <ProgressRing progress={progressVal} color={color} size={64} />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">Profile Completeness</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs underline text-indigo-500"
                          onClick={() => setProgressVal(Math.max(10, progressVal - 15))}
                        >
                          Decrease
                        </button>
                        <button
                          type="button"
                          className="text-xs underline text-indigo-500"
                          onClick={() => setProgressVal(Math.min(100, progressVal + 15))}
                        >
                          Increase
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-3">Avatar Photo with Glowing Ring</h4>
                  <AvatarUploader
                    value={avatar}
                    onChange={setAvatar}
                    accentColor={color}
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                  <h4 className="text-xs font-mono uppercase text-slate-400">Shimmer Wave Skeleton Loading States</h4>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Empty States & Steppers */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Laptop className="w-5 h-5" />
              <h2 className="text-xl font-heading font-bold">6. Empty States & Multi-Step Flow</h2>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <Stepper
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                steps={[
                  { id: "1", title: "Claim Username", description: "Choose URL" },
                  { id: "2", title: "Add Highlights", description: "Skills & roles" },
                  { id: "3", title: "Pick Design", description: "5 Archetypes" },
                  { id: "4", title: "Publish Live", description: "Share link" },
                ]}
              />

              <div className="pt-4">
                <EmptyState
                  title="No Experience Items Yet"
                  description="Add your career milestones, leadership roles, and achievements to generate your portfolio and CV instantly."
                  actionLabel="Add First Experience"
                  onAction={() => toast.success("Opening experience modal")}
                  secondaryActionLabel="Import from LinkedIn"
                  onSecondaryAction={() => toast.info("Import feature coming soon")}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
