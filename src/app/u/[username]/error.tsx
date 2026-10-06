"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Public profile render exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07070B] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-white">
            Unable to display portfolio
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            There was a temporary issue rendering this portfolio.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="sm">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>FolioNova Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
