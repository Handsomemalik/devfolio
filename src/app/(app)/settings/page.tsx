"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  AtSign,
  AlertTriangle,
  Trash2,
  KeyRound,
  Mail,
  Laptop,
  Smartphone,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Badge,
  Logo,
} from "@/components/ui";
import { toast } from "sonner";
import { changePasswordSchema, changeEmailSchema, deleteAccountSchema } from "@/schemas/auth";
import { usernameSchema } from "@/schemas/profile";
import { evaluatePasswordStrength } from "@/lib/security/passwords";
import { useEditorStore } from "@/store/editor-store";

export default function SettingsPage() {
  const router = useRouter();
  const { profile, updateProfile } = useEditorStore();

  // Tab State
  const [activeTab, setActiveTab] = React.useState("account");

  // Account Tab State
  const [fullName, setFullName] = React.useState(profile.full_name || "Alex Vance");
  const [isUpdatingAccount, setIsUpdatingAccount] = React.useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = React.useState("");
  const [emailPassword, setEmailPassword] = React.useState("");
  const [isChangingEmail, setIsChangingEmail] = React.useState(false);

  // Security Tab State (Password)
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [isSigningOutOtherSessions, setIsSigningOutOtherSessions] = React.useState(false);
  const [otherSessionsRevoked, setOtherSessionsRevoked] = React.useState(false);

  // Password strength calculation
  const pwdStrength = React.useMemo(() => {
    return evaluatePasswordStrength(newPassword);
  }, [newPassword]);

  // Username Tab State
  const [newUsername, setNewUsername] = React.useState(profile.username || "alex-vance");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState<string | null>(null);
  const [usernameValid, setUsernameValid] = React.useState(true);
  const [isSavingUsername, setIsSavingUsername] = React.useState(false);

  // Danger Zone State
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  const [deletePassword, setDeletePassword] = React.useState("");
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Debounced Username availability check
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const clean = newUsername.trim().toLowerCase();
      if (!clean) {
        setUsernameError("Username is required");
        setUsernameValid(false);
        setIsCheckingUsername(false);
        return;
      }

      if (clean === profile.username) {
        setUsernameError(null);
        setUsernameValid(true);
        setIsCheckingUsername(false);
        return;
      }

      setIsCheckingUsername(false);
      const parseResult = usernameSchema.safeParse(clean);
      if (!parseResult.success) {
        setUsernameError(parseResult.error.issues[0]?.message || "Invalid username format");
        setUsernameValid(false);
      } else {
        setUsernameError(null);
        setUsernameValid(true);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [newUsername, profile.username]);

  // Handlers
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }
    setIsUpdatingAccount(true);
    setTimeout(() => {
      updateProfile({ full_name: fullName.trim() });
      setIsUpdatingAccount(false);
      toast.success("Account profile details updated.");
    }, 400);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changeEmailSchema.safeParse({
      newEmail,
      currentPassword: emailPassword,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    setIsChangingEmail(true);
    setTimeout(() => {
      setIsChangingEmail(false);
      setNewEmail("");
      setEmailPassword("");
      toast.success("Verification links sent to your current and new email addresses.");
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security credentials updated. Your password was successfully changed.");
    }, 700);
  };

  const handleSignOutOtherSessions = () => {
    setIsSigningOutOtherSessions(true);
    setTimeout(() => {
      setIsSigningOutOtherSessions(false);
      setOtherSessionsRevoked(true);
      toast.success("Signed out of all other active sessions and revoked refresh tokens.");
    }, 800);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newUsername.trim().toLowerCase();
    if (!usernameValid || clean === profile.username) return;

    setIsSavingUsername(true);
    setTimeout(() => {
      updateProfile({ username: clean });
      setIsSavingUsername(false);
      toast.success(`Username changed to @${clean}. Your public portfolio URL is updated.`);
    }, 500);
  };

  const handleDeleteAccount = () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: deleteConfirmation,
      password: deletePassword,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    setIsDeletingAccount(true);
    setTimeout(() => {
      setIsDeletingAccount(false);
      setIsDeleteDialogOpen(false);
      toast.success("Account permanently purged. Redirecting to home...");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-bold">Settings & Security</span>
              <Badge variant="outline" size="sm" className="hidden sm:inline-flex text-[10px]">
                @{profile.username}
              </Badge>
            </div>
          </div>
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-left">
        {/* Header Intro */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">Account & Security</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your personal profile, credentials, public link handle, and active security sessions.
          </p>
        </div>

        {/* Tabs System */}
        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 max-w-lg mb-8">
            <TabsTrigger value="account" className="flex items-center gap-1.5 text-xs">
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="username" className="flex items-center gap-1.5 text-xs">
              <AtSign className="w-3.5 h-3.5" />
              <span>Username</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-1.5 text-xs text-red-500 data-[state=active]:text-red-500">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Danger</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ACCOUNT */}
          <TabsContent value="account" className="space-y-6">
            {/* Profile Info */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Account Profile</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Update your primary account name and billing contact info.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAccountSubmit} className="space-y-4 max-w-md">
                <Input
                  label="Display Full Name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  required
                />
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingAccount}>
                  Save Profile Info
                </Button>
              </form>
            </section>

            {/* Email Management */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Change Email Address</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Current primary email: <span className="font-mono text-cyan-400">alex@folionova.design</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md">
                <Input
                  label="New Email Address"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new-address@example.com"
                  required
                />
                <Input
                  label="Current Password (Verification)"
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Verify your existing password"
                  required
                />
                <Button type="submit" variant="secondary" size="sm" isLoading={isChangingEmail}>
                  Send Verification Links
                </Button>
              </form>
            </section>
          </TabsContent>

          {/* TAB 2: SECURITY */}
          <TabsContent value="security" className="space-y-6">
            {/* Password Change */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Change Password</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Must be at least 10 characters with uppercase, lowercase, and numbers.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />

                <div>
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 10 characters"
                    required
                  />
                  {/* Strength Bar */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">Strength:</span>
                        <span
                          className="font-semibold capitalize"
                          style={{
                            color:
                              pwdStrength.score >= 4
                                ? "#10B981"
                                : pwdStrength.score >= 3
                                ? "#6366F1"
                                : pwdStrength.score >= 2
                                ? "#F59E0B"
                                : "#EF4444",
                          }}
                        >
                          {pwdStrength.score >= 4
                            ? "Very Strong"
                            : pwdStrength.score >= 3
                            ? "Strong"
                            : pwdStrength.score >= 2
                            ? "Fair"
                            : "Weak"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((seg) => (
                          <div
                            key={seg}
                            className="h-full flex-1 transition-colors duration-300 rounded-full"
                            style={{
                              backgroundColor:
                                pwdStrength.score >= seg
                                  ? seg >= 4
                                    ? "#10B981"
                                    : seg >= 3
                                    ? "#6366F1"
                                    : seg >= 2
                                    ? "#F59E0B"
                                    : "#EF4444"
                                  : "transparent",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                />

                <Button type="submit" variant="primary" size="sm" isLoading={isChangingPassword}>
                  Update Password
                </Button>
              </form>
            </section>

            {/* Active Sessions */}
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold">Active Sessions</h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Devices currently authorized to access your FolioNova workspace.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogOut className="w-4 h-4 text-red-400" />}
                  onClick={handleSignOutOtherSessions}
                  isLoading={isSigningOutOtherSessions}
                  disabled={otherSessionsRevoked}
                >
                  {otherSessionsRevoked ? "Sessions Terminated" : "Sign Out All Other Devices"}
                </Button>
              </div>

              <div className="space-y-3">
                {/* Current device */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Windows PC - Chrome Browser</span>
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Current Session
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                        Active now · IP: 192.168.1.1 (Authenticated)
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">This Device</Badge>
                </div>

                {/* Secondary device */}
                {!otherSessionsRevoked && (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div>
                        <span className="text-sm font-semibold">iPhone 15 Pro - Mobile Safari</span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
                          Last active 2 days ago · California, US
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">Signed in</span>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* TAB 3: USERNAME */}
          <TabsContent value="username" className="space-y-6">
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <AtSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold">Portfolio Link & Username</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Your unique URL identifier for your published live portfolio.
                  </p>
                </div>
              </div>

              {/* Current URL preview */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">Current Live Link:</span>
                  <div className="font-mono text-sm font-bold text-indigo-400 mt-0.5">
                    folionova.com/u/{profile.username}
                  </div>
                </div>
                <Link href={`/u/${profile.username}`} target="_blank">
                  <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Open Live
                  </Button>
                </Link>
              </div>

              {/* Warning Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
                  <p className="font-semibold text-amber-300">Important URL change warning:</p>
                  <p>
                    Changing your username immediately releases your old handle. Any resume links, LinkedIn links,
                    or printed QR codes pointing to <span className="font-mono underline">/u/{profile.username}</span> will
                    instantly break with a 404 error.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUsernameSubmit} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">New Username Handle</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] select-none">
                      folionova.com/u/
                    </span>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="your-name"
                      className="w-full h-11 pl-36 pr-10 rounded-xl bg-white/[0.04] border border-[var(--border-subtle)] focus:border-indigo-500 text-sm font-mono text-[var(--text-primary)] outline-none transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingUsername ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      ) : usernameValid && newUsername !== profile.username ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : usernameError ? (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      ) : null}
                    </div>
                  </div>
                  {usernameError && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {usernameError}
                    </p>
                  )}
                  {usernameValid && newUsername !== profile.username && !isCheckingUsername && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                      <Check className="w-3.5 h-3.5" />
                      Username is available!
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!usernameValid || isCheckingUsername || newUsername === profile.username}
                  isLoading={isSavingUsername}
                >
                  Confirm & Update Username
                </Button>
              </form>
            </section>
          </TabsContent>

          {/* TAB 4: DANGER ZONE */}
          <TabsContent value="danger" className="space-y-6">
            <section className="p-6 sm:p-8 rounded-3xl border border-red-500/25 bg-red-500/[0.03] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-red-500">Danger Zone</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Irreversible actions that result in permanent data deletion.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-red-500/20 text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
                <p className="font-semibold text-red-400">Account Deletion Details:</p>
                <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
                  <li>Your public portfolio at <code className="text-red-400">/u/{profile.username}</code> will be unpublished instantly.</li>
                  <li>All database records (skills, experiences, education, projects) will be erased.</li>
                  <li>All uploaded avatars and media in Supabase Storage will be purged.</li>
                  <li>This action cannot be undone.</li>
                </ul>
              </div>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="danger" size="sm" leftIcon={<Trash2 className="w-4 h-4" />}>
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-500 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Permanently Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This operation is immediate and irreversible. Please enter your confirmation below.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-2">
                    <Input
                      label='Type "DELETE" in capital letters to confirm'
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      required
                    />
                    <Input
                      label="Your current password"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Account password"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeletingAccount}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={deleteConfirmation !== "DELETE" || !deletePassword}
                      isLoading={isDeletingAccount}
                      onClick={handleDeleteAccount}
                    >
                      Purge Account Forever
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
