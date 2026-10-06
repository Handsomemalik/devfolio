"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Globe,
  Camera,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Badge,
  AvatarUploader,
  Stepper,
  Logo,
} from "@/components/ui";
import { useEditorStore } from "@/store/editor-store";
import { PORTFOLIO_DESIGN_LIST } from "@/config/designs";
import { isUsernameReserved } from "@/config/reserved-usernames";
import { BRAND_NAME } from "@/config/brand";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useEditorStore();

  const [currentStep, setCurrentStep] = React.useState(0);

  // Form State
  const [username, setUsername] = React.useState(profile.username || "alex-vance");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [usernameValid, setUsernameValid] = React.useState(true);

  const [fullName, setFullName] = React.useState(profile.full_name || "Alex Vance");
  const [title, setTitle] = React.useState(
    profile.professional_title || "Principal Creative Technologist"
  );
  const [shortBio, setShortBio] = React.useState(
    profile.short_bio || "Crafting fluid digital experiences at the intersection of motion and code."
  );

  const [avatar, setAvatar] = React.useState<string | null>(profile.avatar_url);
  const [selectedDesign, setSelectedDesign] = React.useState(profile.design_id || "aurora");

  // Debounced username validation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) {
        setUsernameError("Username is required");
        setUsernameValid(false);
        setIsCheckingUsername(false);
        return;
      }

      const clean = username.trim().toLowerCase();
      setIsCheckingUsername(false);

      if (clean.length < 3 || clean.length > 30) {
        setUsernameError("Must be between 3 and 30 characters");
        setUsernameValid(false);
      } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(clean)) {
        setUsernameError("Only lowercase letters, numbers, and hyphens (cannot start/end with hyphen)");
        setUsernameValid(false);
      } else if (isUsernameReserved(clean)) {
        setUsernameError("This username is reserved by the platform");
        setUsernameValid(false);
      } else {
        setUsernameError(null);
        setUsernameValid(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!usernameValid) {
        toast.error("Please pick a valid username to continue.");
        return;
      }
      updateProfile({ username: username.toLowerCase().trim() });
    }

    if (currentStep === 1) {
      if (!fullName.trim() || !title.trim()) {
        toast.error("Please provide your name and professional title.");
        return;
      }
      updateProfile({
        full_name: fullName.trim(),
        professional_title: title.trim(),
        short_bio: shortBio.trim(),
      });
    }

    if (currentStep === 2) {
      updateProfile({ avatar_url: avatar });
    }

    if (currentStep === 3) {
      updateProfile({ design_id: selectedDesign });
      toast.success("Setup complete! Welcome to your Studio Editor.");
      router.push("/edit");
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const steps = [
    { id: "1", title: "Claim URL", description: "Choose link" },
    { id: "2", title: "Profile", description: "Name & Bio" },
    { id: "3", title: "Avatar", description: "Upload Photo" },
    { id: "4", title: "Design", description: "Pick Archetype" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
        <Logo size="sm" asLink={false} />
        <Badge variant="glow" size="sm">
          ONBOARDING WIZARD // STEP {currentStep + 1} OF 4
        </Badge>
      </header>

      {/* Main Stepper & Form Container */}
      <main className="max-w-2xl mx-auto w-full my-8 space-y-8 text-left">
        {/* Stepper Progress Indicator */}
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[var(--border-strong)] shadow-2xl relative min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Claim Username */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-black">Claim your personal link</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    This is your permanent public portfolio URL. You can share it anywhere.
                  </p>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="alex-vance"
                    error={usernameError || undefined}
                    leftIcon={<Globe className="w-4 h-4" />}
                    rightIcon={
                      isCheckingUsername ? (
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      ) : usernameValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )
                    }
                  />

                  {/* Live Link Preview */}
                  <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-white/[0.03] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Your shareable link will be:
                    </span>
                    <div className="text-sm font-mono font-bold text-indigo-400 truncate">
                      https://folionova.io/u/{username || "..."}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Name, Title & Bio */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-black">Tell us who you are</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    This appears at the top of your portfolio hero and on your downloadable CV.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    required
                  />

                  <Input
                    label="Professional Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Principal Creative Technologist"
                    required
                  />

                  <Textarea
                    label="Short Bio"
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    showCount
                    maxLength={160}
                    placeholder="Brief 1-2 sentence statement..."
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 3: Avatar Upload & Crop */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-black">Upload a profile photo</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Add a high-res photo. We automatically frame it with your custom glowing accent ring.
                  </p>
                </div>

                <div className="py-4 flex justify-center">
                  <AvatarUploader
                    value={avatar}
                    onChange={setAvatar}
                    accentColor={profile.accent_color}
                  />
                </div>

                <p className="text-center text-xs text-slate-400">
                  Optional. If omitted, your stylish initials monogram will be used automatically.
                </p>
              </motion.div>
            )}

            {/* STEP 4: Pick Starting Design */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-heading font-black">Choose your starting aesthetic</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Pick a design archetype. You can switch between all 5 at any time in the editor.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {PORTFOLIO_DESIGN_LIST.map((design) => {
                    const isSelected = selectedDesign === design.id;
                    return (
                      <div
                        key={design.id}
                        onClick={() => setSelectedDesign(design.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/30"
                            : "bg-slate-100/50 dark:bg-white/[0.02] border-[var(--border-subtle)] hover:border-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-heading">{design.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                          {design.tagline}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-[var(--border-subtle)]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentStep === 3 ? "Launch Studio Editor" : "Continue"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 font-mono py-2">
        {BRAND_NAME} Career Engine • Setup takes ~60 seconds
      </footer>
    </div>
  );
}
