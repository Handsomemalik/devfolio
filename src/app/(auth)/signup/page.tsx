"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Layers,
  Palette,
} from "lucide-react";
import { Button, Input, Logo, Badge } from "@/components/ui";
import { BRAND_NAME, BRAND_TAGLINE } from "@/config/brand";
import { toast } from "sonner";
import { signupSchema } from "@/schemas/auth";
import { evaluatePasswordStrength } from "@/lib/security/passwords";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Email verification screen state
  const [isVerificationSent, setIsVerificationSent] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const strength = React.useMemo(() => evaluatePasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!agreeTerms) {
      setErrors({ terms: "Please accept the terms of service to continue." });
      return;
    }

    const result = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsVerificationSent(true);
      toast.success("Account created! Verification link sent.");
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    toast.info("Verification email re-sent. Please check your inbox.");

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex selection:bg-[#e4572e]/20">
      {/* LEFT: Signup Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 text-left glass-panel p-8 sm:p-10 rounded-3xl border border-white/45">
          <div className="space-y-2">
            <Logo size="md" />
            <h1 className="text-2xl sm:text-3xl font-heading font-black pt-2">
              Start your living portfolio
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Create an account once. Publish 5 cinematic designs and export 6 executive CVs.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isVerificationSent ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/50 space-y-5 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-white/[0.08] border border-white/30 flex items-center justify-center text-[#e4572e] mx-auto shadow-inner">
                  <Mail className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-heading font-bold">Check your email</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    We sent a verification link to <span className="font-mono text-[#e4572e] font-bold">{email}</span>. Click the link to activate your workspace.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="w-full"
                    leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? "animate-spin" : ""}`} />}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Verification Email"}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push("/onboarding")}
                    className="w-full"
                  >
                    Continue to Onboarding Wizard
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  error={errors.fullName}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <div className="space-y-1">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                    error={errors.password}
                    leftIcon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[var(--text-secondary)]">Strength: {strength.label}</span>
                        <span className="text-[var(--text-secondary)]">{strength.score}/5</span>
                      </div>
                      <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`flex-1 h-full rounded-full transition-colors ${
                              lvl <= strength.score ? strength.color : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-white/40 text-[#1a1a1c] focus:ring-[#1a1a1c] cursor-pointer"
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#e4572e] hover:underline font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#e4572e] hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-[11px] text-red-500 font-medium">{errors.terms}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create My Free Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="pt-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1a1a1c] dark:text-white hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT: Animated Brand Panel (Digital Sculpture / Cosmic Marble Art Direction) */}
      <div className="hidden lg:flex w-1/2 relative p-12 flex-col justify-between overflow-hidden border-l border-white/40 bg-white/10 dark:bg-black/20 backdrop-blur-md">
        {/* Subtle background radial glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#e4572e]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
          <span>{BRAND_NAME} Studio</span>
          <span>5 Archetypes • 6 CV Exports</span>
        </div>

        {/* Floating Showcase Cards */}
        <div className="relative z-10 space-y-6 max-w-md mx-auto">
          {/* Card 1: Aurora */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl glass-panel border border-white/50 text-[var(--text-primary)] shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#e4572e]">01 // AURORA GLASS</span>
              <Badge size="sm" variant="glow">Luminous</Badge>
            </div>
            <h4 className="text-lg font-heading font-bold">Alex Vance</h4>
            <p className="text-xs text-[var(--text-secondary)]">Principal Creative Technologist</p>
          </motion.div>

          {/* Card 2: Kinetic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl glass-panel border border-white/50 text-[var(--text-primary)] shadow-2xl space-y-3 ml-8"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#1b2a6b] dark:text-sky-400">02 // KINETIC FLOW</span>
              <Badge size="sm" variant="outline">High Velocity</Badge>
            </div>
            <h4 className="text-lg font-heading font-bold">Elena Rostova</h4>
            <p className="text-xs text-[var(--text-secondary)]">Lead Design Systems Architect</p>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-[var(--text-secondary)] font-mono">
          &ldquo;Your career, as a living work of art.&rdquo;
        </div>
      </div>
    </div>
  );
}
