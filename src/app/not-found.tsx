import Link from "next/link";
import { ArrowLeft, Home, FileText, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui";
import { BRAND_NAME } from "@/config/brand";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07070B] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-heading font-black tracking-tight text-white">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-slate-200">
            Looks like this page drifted off the grid.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The profile or URL you are trying to reach does not exist or may have been renamed.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/cv" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Open CV Studio</span>
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-white/10 text-xs text-slate-500 flex items-center justify-center gap-4">
          <Link href="/#designs" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>Showcase</span>
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-slate-300 transition-colors">
            Account Login
          </Link>
          <span>•</span>
          <Link href="/signup" className="hover:text-slate-300 transition-colors">
            Create Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
